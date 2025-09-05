import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import {
  loadTokens,
  saveTokens,
  updateTokens,
  deleteSession,
  dumpSessionKeys,
} from "./sessionStore";
import { Agent, setGlobalDispatcher } from "undici";

const BACKEND = process.env.API_URL!;
const CID = process.env.CLIENT_ID!;
const CSECRET = process.env.CLIENT_SECRET!;
const isProd = process.env.NODE_ENV === "production";
const SID_NAME = isProd ? "__Host-sid" : "sid"; // dev không dùng __Host-
const mustSecure = SID_NAME.startsWith("__Host-"); // __Host-* bắt buộc Secure

const agent = new Agent({ connect: { rejectUnauthorized: false } });
if (process.env.NODE_ENV !== 'production') {
  setGlobalDispatcher(agent);
}

async function setSidCookie(sid: string) {
  const jar = await cookies();
  jar.set({
    name: SID_NAME,
    value: sid,
    httpOnly: true,
    secure: mustSecure || isProd,  // đảm bảo true nếu __Host-
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
    priority: "high",
  });
}
export async function clearSidCookie() {
  const jar = await cookies();
  jar.delete(SID_NAME);
}

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

  // Log ở server terminal / function logs
  console.log("[exchangePassword] status:", resp.status);

  // Nếu cần xem body để debug:
  const raw = await resp.clone().text(); // cẩn thận dữ liệu nhạy cảm!
  console.log("[exchangePassword] raw body (trim):", raw.slice(0, 1000));

  const data = safeJson(raw); // tránh .json() throw
  if (!resp.ok)
    throw new Error(data?.error || `Đăng nhập thất bại (HTTP ${resp.status})`);

  const { access, refresh, expSec } = pickTokens(data);
  if (!access || !refresh) throw new Error("Thiếu token từ backend");

  const sid = randomUUID();
  const expAt = Date.now() + Math.max(30, expSec) * 1000;
  await saveTokens(sid, { access, refresh, expAt });

  await setSidCookie(sid); // nhớ await
  const jar = await cookies();
  console.log("refresh", jar.get("__Host-sid"));
  return { sid };
}

function safeJson(t: string) {
  try {
    return JSON.parse(t);
  } catch {
    return {};
  }
}

export async function refreshTokens(sid: string) {
  const bundle = await loadTokens(sid);
  console.log("load sid", sid, "bundle:", bundle, "keys:", dumpSessionKeys());
  if (!bundle) throw new Error("Session not found");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: bundle.refresh,
    client_id: CID,
    client_secret: CSECRET,
  });
  console.log("body", body);
  const resp = await fetch(`${BACKEND}/auth/connect/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });
  console.log("res", resp);
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.error || "Refresh failed");

  const { access, refresh, expSec } = pickTokens(data);
  if (!access || !refresh) throw new Error("Refresh response invalid");

  await updateTokens(sid, {
    access,
    refresh,
    expAt: Date.now() + Math.max(30, expSec) * 1000,
  });
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

export async function destroySession(sid: string) {
  await deleteSession(sid);
  clearSidCookie();
}

export async function getAccessTokenFromCookie(): Promise<string | null> {
  const jar = await cookies();
  const sid = jar.get(SID_NAME)?.value;
  if (!sid) return null;
  const nb = await loadTokens(sid);
  return nb?.access ?? null;
}

export async function getAuthHeaderFromCookie() {
  const jar = await cookies();
  const sid = jar.get(SID_NAME)?.value;
  if (!sid) return null;
  const bearer = await getBearerForSid(sid);
  return bearer ? { Authorization: bearer } : null;
}

export async function getSidFromCookie(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SID_NAME)?.value ?? null;
}
