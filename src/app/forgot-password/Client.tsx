"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Tooltip } from "antd";
import Image from "next/image";
import { useSpring, useTrail, animated, easings } from "@react-spring/web";
import { gsap } from "gsap";
import BaseControlTextField from "EduSmart/components/BaseControl/BasecontrolTextField";
import { ThemeSwitch } from "EduSmart/components/Themes/Theme";
import bgQuestion from "EduSmart/assets/FPT_Logo_Background.jpg";
import { useAuthStore } from "EduSmart/stores/Auth/AuthStore";
import { isAxiosError } from "axios";
import BubbleBackground from "EduSmart/components/Bubble/BubbleBackground";
import { useRouter } from "next/navigation";
import { useNotification } from "EduSmart/Provider/NotificationProvider";
import Loading from "EduSmart/components/Loading/Loading";
import { useLoadingStore } from "EduSmart/stores/Loading/LoadingStore";
import { Lobster } from "next/font/google";
import "./styles/forgot.styles.css";
import { FiArrowLeft, FiMail, FiShield } from "react-icons/fi";

const emailFieldKeys = ["email"] as const;
const resetFieldKeys = ["password", "confirmPassword"] as const;
type EmailFieldKey = (typeof emailFieldKeys)[number];
type ResetFieldKey = (typeof resetFieldKeys)[number];
type FieldKey = EmailFieldKey | ResetFieldKey;

const xmlColumns: Record<FieldKey, { id: FieldKey; name: string; rules: string }> = {
  email: { id: "email", name: "Email", rules: "required" },
  password: { id: "password", name: "Mật khẩu mới", rules: "required" },
  confirmPassword: {
    id: "confirmPassword",
    name: "Xác nhận mật khẩu",
    rules: "required|confirm_password:password",
  },
};

const fieldMeta: Record<
  FieldKey,
  { placeholder: string; type: "text" | "email" | "password"; maxLength: number }
> = {
  email: {
    placeholder: "Nhập email",
    type: "email",
    maxLength: 50,
  },
  password: {
    placeholder: "Nhập mật khẩu mới",
    type: "password",
    maxLength: 50,
  },
  confirmPassword: {
    placeholder: "Nhập lại mật khẩu mới",
    type: "password",
    maxLength: 50,
  },
};

type ForgotPasswordFormValues = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
});

type ForgotPasswordPageProps = {
  isReset?: boolean;
  resetKey?: string;
};

export default function ForgotPasswordPage({
  isReset = false,
  resetKey = "",
}: ForgotPasswordPageProps) {
  const messageApi = useNotification();
  const [form] = Form.useForm<ForgotPasswordFormValues>();
  const requestForgotPassword = useAuthStore((state) => state.forgotPassword);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const isOtherSystem = useAuthStore((state) => state.isOtherSystem);
  const router = useRouter();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [skipMountAnim, setSkipMountAnim] = useState(false);
  const [showFormBySwipeRun, setShowFormBySwipeRun] = useState<boolean>(true);
  const [showWipe, setShowWipe] = useState(false);
  const [wipeStyles, wipeApi] = useSpring<{ y: number }>(() => ({ y: 100 }));
  const didRunRef = useRef(false);
  const entryTransitionRef = useRef<HTMLDivElement | null>(null);
  const [waitingSeconds, setWaitingSeconds] = useState(0);

  useEffect(() => {
    const SetForm = async () => {
      const seen =
        typeof window !== "undefined" &&
        sessionStorage.getItem("authMountOnce") === "1";
      if (seen) {
        setShowFormBySwipeRun(false);
      }
      await setShowForm(true);
    };
    SetForm();
  }, []);

  useEffect(() => {
    if (!isOtherSystem) {
      setWaitingSeconds(0);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      setWaitingSeconds(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOtherSystem]);

  useEffect(() => {
    router.prefetch("/Register"); // tải sẵn chunk của trang Register
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("routeTransition") !== "login-to-forgot") {
      return;
    }
    sessionStorage.removeItem("routeTransition");
    const layer = entryTransitionRef.current;
    if (!layer) return;
    gsap.set(layer, {
      opacity: 1,
      scaleY: 1,
      transformOrigin: "bottom",
      pointerEvents: "none",
    });
    gsap.to(layer, {
      opacity: 0,
      scaleY: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, []);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (e.persisted || nav?.type === "reload") {
        sessionStorage.removeItem("authMountOnce");
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      sessionStorage.getItem("authMountOnce") === "1";

    setSkipMountAnim(seen);
    if (!seen || didRunRef.current) return;
    didRunRef.current = true;

    setShowWipe(true);

    requestAnimationFrame(() => {
      // Dừng animation đang chạy (nếu có) rồi set tức thời vị trí start
      wipeApi.stop();
      wipeApi.set({ y: -100 }); // <-- KHÔNG có immediate ở đây

      requestAnimationFrame(() => {
        wipeApi.start({
          to: [
            { y: 0, config: { duration: 700, easing: easings.easeOutCubic } },
            { y: 100, config: { duration: 550, easing: easings.easeInCubic } },
          ],
          onRest: () => setShowWipe(false),
        });
      });
    });
    setTimeout(() => {
      setShowFormBySwipeRun(true);
    }, 500);
  }, [wipeApi]);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    try {
      useLoadingStore.getState().showLoading();
      if (isReset) {
        if (!resetKey) {
          throw new Error("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
        }
        const password = values.password?.trim() ?? "";
        if (!password) {
          throw new Error("Vui lòng nhập mật khẩu mới.");
        }
        const resp = await resetPassword(resetKey, password);
        if (!resp?.success) {
          throw new Error(
            resp?.message || "Đặt lại mật khẩu thất bại, vui lòng thử lại.",
          );
        }
        messageApi.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        router.push("/Login");
        return;
      }

      const email = values.email?.trim() ?? "";
      if (!email) {
        throw new Error("Vui lòng nhập email để nhận liên kết đặt lại.");
      }
      const res = await requestForgotPassword(email);
      if (!res?.success) {
        throw new Error(
          res?.message || "Quên mật khẩu thất bại, vui lòng thử lại sau.",
        );
      }
      messageApi.success("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      router.push(
        `/forgot-password/has-sent?email=${encodeURIComponent(email)}`,
      );
    } catch (error: unknown) {
      let errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Có lỗi xảy ra, vui lòng thử lại.";
      if (isAxiosError(error)) {
        const serverMsg =
          error.response?.data?.errors || error.response?.data?.error;
        if (typeof serverMsg === "string") errorMessage = serverMsg;
      }
      messageApi.error(errorMessage);
    } finally {
      useLoadingStore.getState().hideLoading();
    }
  };

  // 1) Mount animation: chỉ 1 useSpring
  const mountSprings = useSpring({
    opacity: showForm ? 1 : 0,
    transform: showForm ? "scale(1)" : "scale(0.8)",
    immediate: skipMountAnim,
    config: { mass: 1, tension: 280, friction: 60 },
    delay: 300,
  });
  const statusSpring = useSpring({
    opacity: isOtherSystem ? 1 : 0,
    transform: isOtherSystem
      ? "translateY(0px) scale(1)"
      : "translateY(16px) scale(0.96)",
    config: { mass: 1, tension: 240, friction: 22 },
  });

  const visibleFieldKeys = isReset ? resetFieldKeys : emailFieldKeys;

  // 2) Trail cho các input field
  const trail = useTrail(showForm ? visibleFieldKeys.length : 0, {
    from: { opacity: 0, transform: "translate3d(0,20px,0)" },
    to: { opacity: 1, transform: "translate3d(0,0,0)" },
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 600,
  });
  const goToLogin = () => {
    sessionStorage.setItem("authMountOnce", "1");
    router.push("/Login");
  };

  const titleText = isReset ? "Đặt lại mật khẩu" : "Quên mật khẩu";
  const descriptionText = isReset
    ? "Tạo mật khẩu mới đủ mạnh để bảo vệ tài khoản của bạn."
    : "Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu. Chúng tôi sẽ gửi trong vòng vài giây.";
  const highlightTitle = isReset ? "Thiết lập mật khẩu mới" : "Gửi liên kết đặt lại";
  const highlightDescription = isReset
    ? "Mật khẩu nên dài ít nhất 8 ký tự và chứa cả chữ lẫn số."
    : "Liên kết sẽ hết hạn sau 15 phút để đảm bảo an toàn.";
  const primaryButtonLabel = isReset ? "Đặt lại mật khẩu" : "Quên mật khẩu";

  const FormCard = (
    <animated.div
      style={mountSprings}
      className="relative w-full max-w-md isolate"
    >
      <BubbleBackground />
      <div className="relative z-10 rounded-[32px] p-[1px] bg-gradient-to-br from-white/40 via-cyan-300/40 to-blue-500/40 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="rounded-[30px] bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
            <span>EduSmart</span>
            <span>An Toàn</span>
          </div>
          <div className="mt-5 text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold text-teal-600 bg-teal-50/80 border border-teal-100/70 dark:bg-teal-500/10 dark:text-teal-200 dark:border-teal-400/30">
              <FiShield className="text-base" />
              {isReset ? "Bảo vệ tài khoản" : "Khôi phục tài khoản"}
            </span>
            <div
              className={`${lobster.className} text-black text-2xl md:text-3xl font-semibold dark:text-white`}
            >
              {titleText}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {descriptionText}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100/80 dark:border-white/10 bg-gradient-to-r from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-800/70 dark:via-slate-900/70 dark:to-slate-800/70 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md shadow-slate-200/70 dark:bg-slate-900/80 dark:shadow-none">
                {isReset ? (
                  <FiShield className="text-lg text-teal-500" />
                ) : (
                  <FiMail className="text-lg text-teal-500" />
                )}
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 dark:text-white">
                  {highlightTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {highlightDescription}
                </p>
              </div>
            </div>
          </div>

          <Form<ForgotPasswordFormValues>
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="mt-6"
          >
            {trail.map((style, idx) => {
              const key = visibleFieldKeys[idx];
              if (!key) return null;
              const meta = fieldMeta[key];
              return (
                <animated.div key={key} style={style} className="mb-4">
                  <BaseControlTextField
                    xmlColumn={xmlColumns[key]}
                    maxlength={meta.maxLength}
                    placeholder={meta.placeholder}
                    type={meta.type}
                  />
                </animated.div>
              );
            })}
            <div className="mt-4 sm:mt-6 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full py-4 font-semibold text-white rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 shadow-lg shadow-cyan-200/40 dark:shadow-none hover:scale-[1.02] transition-all duration-200"
              >
                {primaryButtonLabel}
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="w-full py-3 font-semibold rounded-2xl border border-slate-200 text-slate-600 bg-white/80 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 shadow-sm hover:border-teal-200 hover:text-teal-600 hover:bg-white hover:-translate-y-0.5 dark:hover:border-teal-500 dark:hover:text-teal-300 dark:hover:bg-slate-900 transition-all duration-200"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </Form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Hỗ trợ 24/7: support@edusmart.vn
            </span>
            {isReset ? (
              <span>Liên kết đặt lại chỉ sử dụng một lần để đảm bảo an toàn.</span>
            ) : (
              <span>Mật khẩu được bảo vệ theo chuẩn OWASP.</span>
            )}
          </div>
        </div>
      </div>
    </animated.div>
  );

  const ShowSwipeEffect = (
    <animated.div
      style={mountSprings}
      className="fixed inset-0 z-[2147483647] pointer-events-none"
    >
      {showWipe && (
        <animated.div
          className="fixed inset-0 z-[2147483647] pointer-events-none"
          style={{
            transform: wipeStyles.y.to((v) => `translate3d(0, ${v}%, 0)`),
            opacity: wipeStyles.y.to([100, 0, -100], [0, 1, 0]), // fade in/out
          }}
        >
          <div className="relative h-dvh w-full overflow-hidden rounded-b-[80px] shadow-[0_20px_60px_rgba(16,185,129,.35)]">
            {/* Gradient động */}
            <div
              className="absolute inset-0 bg-[length:300%_300%] animate-gradient-flow 
                          bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500"
            />

            {/* Overlay cinematic */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />

            {/* Lưới chấm parallax */}
            <div
              className="absolute inset-0 opacity-25 animate-slow-move"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,.4) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Shine nhiều lớp */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-y-0 -left-1/3 w-1/2 rotate-6 bg-white/10 blur-2xl animate-wipe-shine" />
              <div className="absolute inset-y-0 left-1/4 w-1/3 rotate-12 bg-white/5 blur-3xl animate-wipe-shine delay-200" />
            </div>

            {/* Wave động */}
            <svg
              className="absolute -bottom-10 left-0 w-full h-24 text-white/40 animate-wave"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="currentColor"
                d="M0,0L120,32C240,64,480,128,720,149.3C960,171,1200,149,1320,138.7L1440,128L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
              />
            </svg>
          </div>
        </animated.div>
      )}
    </animated.div>
  );

  const backButton = () => {
    sessionStorage.removeItem("authMountOnce");
    router.push("/home");
  };

  if (isOtherSystem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 px-4">
        <animated.div style={statusSpring} className="relative max-w-md w-full">
          {/* Viền gradient + glow nhẹ */}
          <div
            className="
            absolute -inset-[1px] rounded-3xl 
            bg-gradient-to-br from-teal-400/35 via-cyan-400/25 to-blue-500/35 
            opacity-80 blur-md
            dark:from-teal-400/60 dark:via-cyan-400/40 dark:to-blue-500/60
          "
          />

          <div
            className="
            relative rounded-3xl p-8 text-center
            bg-white/90 border border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.18)]
            dark:bg-slate-900/90 dark:border-slate-700/70 dark:shadow-[0_18px_60px_rgba(15,23,42,0.85)]
          "
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-teal-600 dark:text-teal-300 mb-3">
              Đang chuyển hướng
            </p>

            <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-900 dark:text-slate-50">
              Đang kết nối tới hệ thống xác thực khác
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Vui lòng giữ nguyên tab này. Hệ thống sẽ tự động chuyển khi kết
              nối hoàn tất.
            </p>

            {/* Khu vực timer + loading */}
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-3">
                {/* Vòng tròn loading + ping */}
                <span className="relative flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400/35 dark:bg-teal-400/40" />
                  <span className="relative inline-flex rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent animate-spin" />
                </span>

                <div className="text-left">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Thời gian chờ
                  </div>
                  <div className="mt-0.5 text-2xl font-mono text-slate-900 dark:text-slate-100">
                    {waitingSeconds} <span className="text-sm">giây</span>
                  </div>
                </div>
              </div>

              {/* Thanh progress giả để đỡ trống */}
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (waitingSeconds % 10) * 10)}%`,
                  }}
                />
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
              Nếu chờ quá lâu, hãy thử tải lại trang hoặc kiểm tra lại đường dẫn
              đăng nhập.
            </p>
          </div>
        </animated.div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={entryTransitionRef}
        className="fixed inset-0 z-[65] bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 pointer-events-none"
        style={{ transformOrigin: "bottom", transform: "scaleY(0)", opacity: 0 }}
      />
      {showWipe && ShowSwipeEffect}
      <Loading />
      {/* Back floating button */}
      <div
        className="fixed left-3 top-3 md:left-6 md:top-6 z-50"
        style={{
          left: "calc(env(safe-area-inset-left, 0px) + 12px)",
          top: "calc(env(safe-area-inset-top, 0px) + 12px)",
        }}
      >
        <Tooltip title="Esc để quay lại" placement="right">
          <Button
            onClick={backButton}
            shape="round"
            size="large"
            aria-label="Quay lại"
            className={[
              "group !inline-flex !items-center gap-2 !px-3 sm:!px-4 !h-10 md:!h-11",
              "relative rounded-full overflow-hidden",
              "bg-white/70 dark:bg-slate-900/60 backdrop-blur-md",
              "ring-1 ring-black/5 dark:ring-white/10 shadow-lg hover:shadow-xl",
              "transition-all duration-200 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60",
              "before:absolute before:inset-0 before:rounded-full",
              "before:bg-gradient-to-r before:from-teal-400/20 before:via-cyan-400/20 before:to-blue-400/20",
              "before:opacity-0 hover:before:opacity-100 before:transition-opacity",
            ].join(" ")}
            icon={
              <FiArrowLeft
                className="h-[18px] w-[18px] md:h-5 md:w-5 text-slate-700 dark:text-slate-200
                     transition-transform duration-200 motion-safe:group-hover:-translate-x-0.5"
              />
            }
          >
            {/* Ẩn label ở mobile để gọn gàng, hiện từ sm trở lên */}
            <span className="hidden sm:inline text-[13px] md:text-sm font-medium text-slate-700 dark:text-slate-200">
              Quay lại Trang Chủ
            </span>
          </Button>
        </Tooltip>
      </div>

      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
        <Image
          src={bgQuestion}
          alt="Hero"
          fill
          priority
          placeholder="blur"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center brightness-90 dark:brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-cyan-500/30 to-blue-500/30 dark:from-slate-900/80 dark:via-cyan-600/40 dark:to-blue-700/40" />
        <div className="absolute inset-0 pointer-events-none">
          <BubbleBackground />
        </div>

        <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-30 pointer-events-auto max-w-xl space-y-2 drop-shadow-2xl hidden xs:block">
          <p
            className={`hidden xs:block text-3xl sm:text-4xl md:text-5xl font-extrabold !m-0`}
          >
            EduSmart
          </p>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl flex items-center gap-3">
            Nền tảng học tập cho sinh viên FPT
            <span className="inline-flex">
              <ThemeSwitch />
            </span>
          </p>
        </div>

        <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 sm:px-6 md:px-10 py-12">
          {showFormBySwipeRun && FormCard}
        </div>
      </div>
    </>
  );
}
