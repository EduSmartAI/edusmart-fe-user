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
  user?: BasicUser;
};

export type BasicUser = { name: string; email: string; role: string; avatarUrl?: string};

function decodeJwt<T = unknown>(jwt: string): T | null {
  const parts = jwt.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload) as T;
  } catch {
    return null;
  }
}

function extractUserFromIdToken(idt: string): BasicUser | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwtDecode = decodeJwt<any>(idt);
  if (!jwtDecode) return null;

  const name =
    (jwtDecode.name ??
      [jwtDecode.given_name, jwtDecode.family_name].filter(Boolean).join(" ").trim() ??
      jwtDecode.preferred_username ??
      "") || "";

  const email = jwtDecode.email ?? "";

  const roleCandidate =
    jwtDecode.role ??
    (Array.isArray(jwtDecode.roles) ? jwtDecode.roles[0] : jwtDecode.roles) ??
    jwtDecode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    "";

  const role =
    (Array.isArray(roleCandidate) ? roleCandidate[0] : roleCandidate) || "Student";

  const avatarUrl = jwtDecode.picture ?? "https://i.pravatar.cc/100?img=3";

  return { name, email, role, avatarUrl };
}

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
  const baseOk =
    typeof o.sid === "string" &&
    typeof o.access === "string" &&
    typeof o.refresh === "string" &&
    typeof o.expAt === "number";
  if (!baseOk) return false;

  if (o.user !== undefined) {
    const u = o.user as Record<string, unknown>;
    if (
      !u ||
      typeof u.name !== "string" ||
      typeof u.email !== "string" ||
      typeof u.role !== "string" ||
      (u.avatarUrl !== undefined && typeof u.avatarUrl !== "string")
    ) {
      return false;
    }
  }
  return true;
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
  id_token?: string;   // NEW
  idToken?: string;   // NEW
};

function pickTokens(data: TokenResponse) {
  const access = data?.access_token ?? data?.accessToken ?? data?.token ?? null;
  const refresh = data?.refresh_token ?? data?.refreshToken ?? null;
  const expSec = Number(data?.expires_in ?? data?.expiresIn ?? 600);
  const idToken = data?.id_token ?? data?.idToken ?? null; // NEW
  return { access, refresh, expSec, idToken };              // CHANGED
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

  const picked = data ? pickTokens(data) : { access: null, refresh: null, expSec: 600, idToken: null };
  const { access, refresh, expSec, idToken } = picked;
  if (!access || !refresh) throw new Error("Thiếu token từ backend");

  const sid = randomUUID();
  const expAt = Date.now() + Math.max(30, expSec) * 1000;

  const user = idToken ? extractUserFromIdToken(idToken) ?? undefined : undefined;
  // Lưu in-memory
  await saveTokens(sid, { access, refresh, expAt });

  // Ghi cookie duy nhất kèm payload
  await setSidCookie({ sid, access, refresh, expAt, user });

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
      console.log("Refesh tokens fallback from cookie:", bundle);
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
    console.error("Refresh token failed:", data);
    const errMsg = (data as { error?: string })?.error || "Refresh failed";
    throw new Error(errMsg);
  }

  const { access, refresh, expSec, idToken } = pickTokens(data as TokenResponse);
  console.log("refresh-token-after-call-api", refresh);
  if (!access || !refresh) throw new Error("Refresh response invalid");

  const newExpAt = Date.now() + Math.max(30, expSec) * 1000;
  await updateTokens(sid, { access, refresh, expAt: newExpAt });
  // Đồng bộ cookie duy nhất
  const oldPayload = await readSidCookiePayload();
  const newUser =
    idToken ? extractUserFromIdToken(idToken) ?? oldPayload?.user : oldPayload?.user;

  await setSidCookie({ sid, access, refresh, expAt: newExpAt, user: newUser });
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
    
    // Đồng bộ in-mem từ cookie nếu có
    if (payload) {
      await saveTokens(payload.sid, {
        access: payload.access,
        refresh: payload.refresh,
        expAt: payload.expAt,
      });
    }
    console.log("hasRefreshToken check sid", realSid);

    const bundle = await loadTokens(realSid);
    if (!bundle || !bundle.refresh?.trim()) return false;
    if (Date.now() < bundle.expAt - 5_000) return true;
    try {
      await refreshTokens(realSid);  // sẽ throw nếu RT hết hạn/hỏng
      return true;
    } catch {
      await destroySession(realSid);
      return false;
    }
  } catch {
    return false;
  }
}

/** Thu hồi token local: xoá refresh, rút ngắn access ~5s, đồng bộ cookie */
export async function revokeRefreshLocal(sid?: string): Promise<boolean> {
  console.log("revokeRefreshLocal called with");
  const payload = await readSidCookiePayload().catch(() => null);
  const realSid = sid ?? payload?.sid ?? null;
  await clearSidCookie();
  if (realSid) await deleteSession(realSid);
  return true;
}