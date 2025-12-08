"use client";

import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import { Spin } from "antd";
import { useSpring, animated } from "@react-spring/web";

export default function PaymentLoading() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 200, friction: 20 },
  });

  const pulse = useSpring({
    from: { scale: 1 },
    to: { scale: 1.1 },
    loop: { reverse: true },
    config: { duration: 1500 },
  });

  return (
    <BaseScreenWhiteNav>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <animated.div style={fadeIn} className="space-y-8">
          {/* Loading Card */}
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 shadow-lg p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Animated Spinner */}
              <animated.div style={pulse}>
                <Spin size="large" />
              </animated.div>

              {/* Loading Text */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Đang xử lý kết quả thanh toán
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Vui lòng chờ trong giây lát...
                </p>
              </div>

              {/* Loading Progress Bar */}
              <div className="w-full max-w-md">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder Card for Transaction Details */}
          <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </animated.div>
      </div>
    </BaseScreenWhiteNav>
  );
}

