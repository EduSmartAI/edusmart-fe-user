// app/(auth)/verify/page.tsx
import React from "react";
import { verifyAccountAction } from "../(auth)/verifyAction";
import ResultScreen from "./Client";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeKey(input: string) {
  let s = (input ?? "").trim();
  if (s.includes(" ")) s = s.replace(/ /g, "+");
  s = s.replace(/\r?\n/g, "");
  try { s = decodeURIComponent(s); } catch {}
  s = s.replace(/\s*\/\s*/g, "/");
  return s;
}

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = Array.isArray(params?.key) ? params!.key![0] : (params?.key ?? "");
  const key = normalizeKey(raw);
  console.log("key", key.trim());
  const result = await verifyAccountAction(key);
  const isSuccess = result.ok;
  const title = isSuccess ? "XÁC MINH THÀNH CÔNG" : "XÁC MINH THẤT BẠI";
  const description = isSuccess
    ? "Cảm ơn bạn! Tài khoản đã được xác minh. Bạn có thể đăng nhập và sử dụng hệ thống."
    : result.error ||
      "Có lỗi xảy ra trong quá trình xác minh. Vui lòng thử lại hoặc liên hệ hỗ trợ.";

  return (
    <ResultScreen
      type={isSuccess ? "success" : "error"}
      title={title}
      description={description}
    />
  );
}
