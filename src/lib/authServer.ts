import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import {
  loadTokens,
  saveTokens,
  updateTokens,
  deleteSession,
} from "./sessionStore";
import { Agent, setGlobalDispatcher } from "undici";

const BACKEND = process.env.API_URL!;
const CID = process.env.CLIENT_ID!;
const CSECRET = process.env.CLIENT_SECRET!;
const isProd = process.env.NODE_ENV === "production";
const SID_NAME = isProd ? "__Host-sid" : "sid"; // dev không dùng __Host-
const mustSecure = SID_NAME.startsWith("__Host-");

const agent = new Agent({ connect: { rejectUnauthorized: false } });
if (process.env.NODE_ENV !== "production") {
  setGlobalDispatcher(agent);
}

/** ===== Helpers cho cookie payload 1-chiếc ===== */
type CookiePayload = {
  sid: string;
  access: string;
  refresh: string;
  expAt: number; // epoch ms
};

function b64url(s: string) {
  return Buffer.from(s, "utf8").toString("base64url");
}
function ub64url(s: string) {
  try {
    return Buffer.from(s, "base64url").toString("utf8");
  } catch {
    return "";
  }
}
function safeJson<T>(t: string): T | null {
  try {
    return JSON.parse(t) as T;
  } catch {
    return null;
  }
}
function isCookiePayload(x: unknown): x is CookiePayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.sid === "string" &&
    typeof o.access === "string" &&
    typeof o.refresh === "string" &&
    typeof o.expAt === "number"
  );
}

/** Ghi cookie: giá trị là base64url(JSON payload) */
async function setSidCookie(payload: CookiePayload) {
  const jar = await cookies();
  const val = b64url(JSON.stringify(payload));
  jar.set({
    name: SID_NAME,
    value: val,
    httpOnly: true,
    secure: mustSecure || isProd, // đảm bảo true nếu __Host-
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
    priority: "high",
  });
}

/** Đọc cookie và parse payload; hỗ trợ legacy (raw sid) bằng cách trả null */
export async function readSidCookiePayload(): Promise<CookiePayload | null> {
  const jar = await cookies();
  const raw = jar.get(SID_NAME)?.value;
  if (!raw) return null;

  const asJson = ub64url(raw);
  if (!asJson) return null; // có thể là legacy chuỗi sid
  const obj = safeJson<CookiePayload>(asJson);
  return obj && isCookiePayload(obj) ? obj : null;
}

/** ===== Token response helpers ===== */
type TokenResponse = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  expires_in?: number | string;
  expiresIn?: number | string;
};

function pickTokens(data: TokenResponse) {
  const access = data?.access_token ?? data?.accessToken ?? data?.token ?? null;
  const refresh = data?.refresh_token ?? data?.refreshToken ?? null;
  const expSec = Number(data?.expires_in ?? data?.expiresIn ?? 600); // fallback 10'
  return { access, refresh, expSec };
}

/** ===== Flows ===== */
export async function exchangePassword(email: string, password: string) {
  console.log("[exchangePassword] start");
  const body = new URLSearchParams({
    grant_type: "password",
    username: email,
    password,
    client_id: CID,
    client_secret: CSECRET,
  });

  let resp: Response;
  try {
    resp = await fetch(`${BACKEND}/auth/connect/token`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[exchangePassword] fetch error:", err);
    throw new Error("Không gọi được /auth/connect/token");
  }

  console.log("[exchangePassword] status:", resp.status);

  const raw = await resp.clone().text(); // cẩn thận dữ liệu nhạy cảm!
  console.log("[exchangePassword] raw body (trim):", raw.slice(0, 1000));

  const data = safeJson<TokenResponse>(raw);
  if (!resp.ok)
    throw new Error((data as unknown as { error?: string })?.error || `Đăng nhập thất bại (HTTP ${resp.status})`);

  const picked = data ? pickTokens(data) : { access: null, refresh: null, expSec: 600 };
  const { access, refresh, expSec } = picked;
  if (!access || !refresh) throw new Error("Thiếu token từ backend");

  const sid = randomUUID();
  const expAt = Date.now() + Math.max(30, expSec) * 1000;

  // Lưu in-memory
  await saveTokens(sid, { access, refresh, expAt });

  // Ghi cookie duy nhất kèm payload
  await setSidCookie({ sid, access, refresh, expAt });

  return { sid };
}

export async function refreshTokens(sid: string) {
  let bundle = await loadTokens(sid);
  console.log("load sid", sid, "bundle:", bundle);

  // Fallback: nếu in-mem trống (cold start), thử khôi phục từ cookie
  if (!bundle) {
    const payload = await readSidCookiePayload();
    if (payload && payload.sid === sid) {
      bundle = { access: payload.access, refresh: payload.refresh, expAt: payload.expAt };
      await saveTokens(sid, bundle);
    }
  }
  if (!bundle) throw new Error("Session not found");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: bundle.refresh,
    client_id: CID,
    client_secret: CSECRET,
  });
  const resp = await fetch(`${BACKEND}/auth/connect/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  const data: TokenResponse | unknown = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const errMsg = (data as { error?: string })?.error || "Refresh failed";
    throw new Error(errMsg);
  }

  const { access, refresh, expSec } = pickTokens(data as TokenResponse);
  console.log("refresh-token", refresh);
  if (!access || !refresh) throw new Error("Refresh response invalid");

  const newExpAt = Date.now() + Math.max(30, expSec) * 1000;

  await updateTokens(sid, { access, refresh, expAt: newExpAt });
  // Đồng bộ cookie duy nhất
  await setSidCookie({ sid, access, refresh, expAt: newExpAt });
  return true;
}

export async function getBearerForSid(sid: string) {
  const b = await loadTokens(sid);
  if (!b) return null;

  // refresh proactive nếu sắp hết hạn
  if (Date.now() > b.expAt - 5_000) {
    try {
      await refreshTokens(sid);
    } catch {
      /* ignore; sẽ để backend trả 401 rồi retry */
    }
    const nb = await loadTokens(sid);
    return nb ? `Bearer ${nb.access}` : null;
  }
  return `Bearer ${b.access}`;
}

/** ===== Cookie ops ===== */
export async function clearSidCookie() {
  const jar = await cookies();
  jar.set({
    name: SID_NAME,
    value: "",
    httpOnly: true,
    secure: mustSecure || isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function clearAppCookies() {
  // Chỉ còn 1 cookie cần xoá
  await clearSidCookie();
}

export async function destroySession(sid: string) {
  await deleteSession(sid);
  await clearAppCookies();
}

/** ===== Getters từ cookie duy nhất ===== */
export async function getAccessTokenFromCookie(): Promise<string | null> {
  const payload = await readSidCookiePayload();
  if (!payload) return null;

  // đồng bộ lại in-mem khi cần (giúp cold start/HMR)
  await saveTokens(payload.sid, {
    access: payload.access,
    refresh: payload.refresh,
    expAt: payload.expAt,
  });

  return payload.access ?? null;
}

export async function getAuthHeaderFromCookie() {
  const sid = await getSidFromCookie();
  if (!sid) return null;
  const bearer = await getBearerForSid(sid);
  return bearer ? { Authorization: bearer } : null;
}

export async function getSidFromCookie(): Promise<string | null> {
  const payload = await readSidCookiePayload();
  if (payload?.sid) return payload.sid;

  // legacy fallback: nếu cookie là raw sid (cũ)
  const jar = await cookies();
  return jar.get(SID_NAME)?.value ?? null;
}

/** Trả về true nếu refresh-token tồn tại trong session store (hoặc cookie) */
export async function hasRefreshToken(sid?: string): Promise<boolean> {
  try {
    const payload = await readSidCookiePayload();
    const realSid = sid ?? payload?.sid ?? null;
    if (!realSid) return false;

    if (payload) {
      await saveTokens(payload.sid, {
        access: payload.access,
        refresh: payload.refresh,
        expAt: payload.expAt,
      });
    }

    const bundle = await loadTokens(realSid);
    return typeof bundle?.refresh === "string" && bundle.refresh.trim().length > 0;
  } catch {
    return false;
  }
}

/** Thu hồi token local: xoá refresh, rút ngắn access ~5s, đồng bộ cookie */
export async function revokeRefreshLocal(sid?: string): Promise<boolean> {
  const payload = await readSidCookiePayload();
  const realSid = sid ?? payload?.sid ?? null;
  if (!realSid) return false;

  const bundle = await loadTokens(realSid);
  if (!bundle) return false;

  const newExpAt = Math.min(bundle.expAt ?? Date.now(), Date.now() + 5_000);

  await updateTokens(realSid, {
    access: bundle.access, // cho phép tiếp tục vài giây
    refresh: "",
    expAt: newExpAt,
  });

  // Đồng bộ cookie duy nhất
  await setSidCookie({
    sid: realSid,
    access: bundle.access,
    refresh: "",
    expAt: newExpAt,
  });

  return true;
}
