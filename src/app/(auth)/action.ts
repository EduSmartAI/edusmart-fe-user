"use server";

import { destroySession, exchangePassword, getAccessTokenFromCookie, getSidFromCookie, refreshTokens } from "EduSmart/lib/authServer";

export async function loginAction({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (!email || !password) return { ok: false, error: "Thiếu email/password" };
  try {
    await exchangePassword(email, password);
    const accessToken = await getAccessTokenFromCookie();
    console.log("Bearer Access", accessToken)
    return { ok: true, accessToken: accessToken};
  } catch (e: unknown) {
    const errorMessage = typeof e === "object" && e !== null && "message" in e ? (e as { message?: string }).message : undefined;
    return { ok: false, error: errorMessage ?? "Đăng nhập thất bại" };
  }
}

export async function refreshAction() {
  try {
    console.log("vao serverrrrrrrrrrrrrr")
    const sid = await getSidFromCookie();
    console.log("sid", sid)
    if (!sid) return { ok: false, error: "No session" };
    await refreshTokens(sid);                              // 👈 truyền sid vào đây
    const accessToken = await getAccessTokenFromCookie();  // lấy access mới
    console.log("new accessToken", accessToken)
    return { ok: true, accessToken };
  } catch (e: unknown) {
    const msg =
      typeof e === "object" && e && "message" in e
        ? (e as { message?: string }).message
        : undefined;
    return { ok: false, error: msg ?? "Đăng nhập thất bại" };
  }
}

export async function logoutAction() {
  const sid = await getSidFromCookie();
  if (sid) {
    await destroySession(sid);  // xóa session + cookie sid
  }
  return { ok: true };
}