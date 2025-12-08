// app/(auth)/verify/page.tsx
import React from "react";
import { verifyAccountAction } from "../(auth)/verifyAction";
import ResultScreen from "./Client";
import ForgotPasswordPage from "../forgot-password/Client";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const keyParam = Array.isArray(params?.key)
    ? params?.key?.[0] ?? ""
    : params?.key ?? "";
  const typeParam = Array.isArray(params?.type)
    ? params?.type?.[0] ?? ""
    : params?.type ?? "";

  if (typeParam === "resetPassword") {
    return <ForgotPasswordPage isReset resetKey={keyParam.trim()} />;
  }

  console.log("key", keyParam.trim());
  const result = await verifyAccountAction(keyParam.trim());
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
