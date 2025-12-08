"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VerificationSentCard from "./sent";
import { useAuthStore } from "EduSmart/stores/Auth/AuthStore";
import { useNotification } from "EduSmart/Provider/NotificationProvider";
import { useLoadingStore } from "EduSmart/stores/Loading/LoadingStore";

export default function SentPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const messageApi = useNotification();

  const handleResend = useCallback(async () => {
    if (!email) return;
    try {
      useLoadingStore.getState().showLoading();
      await forgotPassword(email);
      messageApi.success("Đã gửi lại liên kết đặt lại mật khẩu.");
    } catch (error) {
      const fallback =
        error instanceof Error && error.message
          ? error.message
          : "Không thể gửi lại email. Vui lòng thử lại.";
      messageApi.error(fallback);
    } finally {
      useLoadingStore.getState().hideLoading();
    }
  }, [email, forgotPassword, messageApi]);

  const background = useMemo(
    () => (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950" />
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/15" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/15" />
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#0000000d_1px,transparent_1px)] [background-size:20px_20px]" />
      </>
    ),
    [],
  );

  if (!email) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 text-center">
        {background}
        <div className="relative z-10 max-w-md rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-slate-200/70 dark:ring-white/5 space-y-5">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Không tìm thấy yêu cầu đặt lại mật khẩu
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Vui lòng quay lại và nhập email của bạn để nhận liên kết đặt lại
            mật khẩu.
          </p>
          <button
            onClick={() => router.replace("/forgot-password")}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-cyan-200/40 hover:scale-[1.01] transition-transform"
          >
            Quay lại trang quên mật khẩu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {background}
      <VerificationSentCard
        email={email}
        onResend={handleResend}
        backHref="/home"
        manageHref="/Login"
        brand="EduSmart"
        cooldownSec={30}
      />
    </main>
  );
}

