"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, message, Spin } from "antd";
import {
  FiCpu,
  FiLoader,
  FiCheckCircle,
  FiTarget,
  FiUser,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";
import { getLearningPathAction } from "EduSmart/app/(learning-path)/learningPathAction";
import { LearningPathGuard } from "EduSmart/components/LearningPath";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";
import { useSessionAuthStore } from "EduSmart/stores/Auth/SessionAuthStore";

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const learningPathId = searchParams.get("learningPathId");
  const { session, fetchSession, isLoading } = useSessionAuthStore();

  const [isCompleted, setIsCompleted] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [aiStage, setAiStage] = useState(3);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await fetchSession();
      setIsChecking(false);
    };

    checkAuth();
  }, [fetchSession]);

  useEffect(() => {
    if (!isChecking && !session) {
      message.warning({
        content:
          "Bạn cần đăng nhập để xem kết quả phân tích và lộ trình học tập được đề xuất",
        duration: 4,
      });
      setTimeout(() => {
        router.push("/Login?redirect=/learning-path/assessment/processing");
      }, 500);
    }
  }, [isChecking, session, router]);

  useEffect(() => {
    if (!learningPathId) {
      message.error("Không tìm thấy ID lộ trình học tập");
      router.push("/learning-path/overview");
      return;
    }

    let pollInterval: NodeJS.Timeout;
    let attemptCount = 0;

    // No need for stageInterval since we start at stage 3

    const checkLearningPathStatus = async () => {
      try {
        attemptCount++;
        setPollingAttempts(attemptCount);
        console.log(
          `🔄 Polling learning path status (Attempt ${attemptCount})...`,
        );

        const result = await getLearningPathAction(learningPathId);

        if (!result.ok) {
          console.error("❌ Failed to get learning path:", result.error);

          // After 10 attempts (~30 seconds), stop and show error
          if (attemptCount >= 10) {
            clearInterval(pollInterval);
            setIsPolling(false);
            message.error(
              "Không thể tải lộ trình học tập. Vui lòng thử lại sau.",
            );
          }
          return;
        }

        // Check if learning path is ready (status === 1)
        if (result.data.status === 1) {
          console.log("✅ Learning path is ready!");
          clearInterval(pollInterval);
          setIsPolling(false);
          setIsCompleted(true);

          // Wait a moment to show success state
          setTimeout(() => {
            router.push(`/dashboard/learning-paths/${learningPathId}`);
          }, 2000);
        } else {
          console.log(
            "⏳ Learning path still processing, status:",
            result.data.status,
          );
        }
      } catch (error) {
        console.error("❌ Error checking learning path status:", error);
      }
    };

    // Initial check
    checkLearningPathStatus();

    // Poll every 3 seconds
    pollInterval = setInterval(checkLearningPathStatus, 3000);

    // Cleanup
    return () => {
      clearInterval(pollInterval);
    };
  }, [learningPathId, router]);

  const aiStages = [
    { id: 1, name: "Phân tích khảo sát", icon: <FiUser className="w-5 h-5" /> },
    {
      id: 2,
      name: "Đánh giá năng lực",
      icon: <FiTarget className="w-5 h-5" />,
    },
    { id: 3, name: "Tạo lộ trình", icon: <FiCpu className="w-5 h-5" /> },
  ];

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <LearningPathGuard requiredStep={3} requiredCompletedSteps={[1, 2]}>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Progress Header - Minimal Mode */}
        <div className="sticky top-0 z-10">
          <LearningPathProgress
            currentStep={3}
            completedSteps={[1, 2]}
            minimal={true}
            showTimeRemaining={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Main Card with decorative elements */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-16 -translate-y-16 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 dark:bg-cyan-900/20 rounded-full transform -translate-x-12 translate-y-12 opacity-40"></div>

              <div className="relative z-10">
                {/* Icon with animation */}
                <div className="text-center mb-8">
                  <div className="inline-block relative">
                    {!isCompleted && (
                      <div className="absolute inset-0 animate-ping opacity-20">
                        <div className="w-20 h-20 border-4 border-[#49BBBD] rounded-full"></div>
                      </div>
                    )}

                    <div
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg ${
                        !isCompleted
                          ? "bg-gradient-to-br from-teal-100 to-cyan-100 dark:bg-teal-900/30"
                          : "bg-gradient-to-br from-green-400 to-emerald-500"
                      }`}
                    >
                      {!isCompleted ? (
                        <FiLoader className="w-10 h-10 text-[#49BBBD] animate-spin" />
                      ) : (
                        <FiCheckCircle className="w-10 h-10 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Message */}
                <div className="text-center mb-10">
                  {!isCompleted ? (
                    <h1 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-[#49BBBD] via-[#2DD4BF] to-[#06B6D4] bg-clip-text text-transparent animate-gradient">
                      AI đang xử lý dữ liệu của bạn
                    </h1>
                  ) : (
                    <h1 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#14B8A6] bg-clip-text text-transparent">
                      ✨ Lộ trình học tập đã sẵn sàng!
                    </h1>
                  )}

                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    {!isCompleted ? (
                      <>
                        Hệ thống AI đang phân tích khảo sát và kết quả đánh giá
                        của bạn để tạo ra lộ trình học tập cá nhân hóa. Quá
                        trình này có thể mất vài giây...
                      </>
                    ) : (
                      <>
                        Lộ trình học tập cá nhân hóa của bạn đã được tạo thành
                        công! Chúng tôi sẽ chuyển bạn đến trang kết quả ngay bây
                        giờ.
                      </>
                    )}
                  </p>
                </div>

                {/* AI Processing Stages */}
                {isPolling && (
                  <div className="mb-10">
                    <div className="space-y-3">
                      {aiStages.map((stage) => (
                        <div
                          key={stage.id}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all duration-500 ${
                            aiStage > stage.id
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-1 border-green-300 dark:border-green-700 shadow-sm"
                              : aiStage === stage.id
                                ? "bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-1 border-teal-200 dark:border-teal-800 shadow-sm"
                                : "bg-gray-50 dark:bg-gray-700/30 border-2 border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                aiStage > stage.id
                                  ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md"
                                  : aiStage === stage.id
                                    ? "bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white shadow-md"
                                    : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                              }`}
                            >
                              {aiStage > stage.id ? (
                                <FiCheckCircle className="w-5 h-5" />
                              ) : aiStage === stage.id ? (
                                <FiLoader className="w-5 h-5 animate-spin" />
                              ) : (
                                stage.icon
                              )}
                            </div>
                            <span
                              className={`font-semibold ${
                                aiStage >= stage.id
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {stage.name}
                            </span>
                          </div>
                          {aiStage === stage.id && (
                            <span className="text-sm text-[#49BBBD] dark:text-cyan-400 font-medium animate-pulse">
                              Đang xử lý...
                            </span>
                          )}
                          {aiStage > stage.id && (
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                              Hoàn thành ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Polling info */}
                    <div className="mt-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                      <FiClock className="w-4 h-4 mr-2 animate-pulse" />
                      <span>Đã xử lý {pollingAttempts * 3} giây...</span>
                    </div>
                  </div>
                )}

                {/* Success state - show button to view results */}
                {isCompleted && (
                  <div className="text-center">
                    <Button
                      type="primary"
                      size="large"
                      icon={<FiArrowRight className="w-5 h-5" />}
                      iconPosition="end"
                      onClick={() =>
                        router.push(
                          `/dashboard/learning-paths/${learningPathId}`,
                        )
                      }
                      className="!p-6 !bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 px-12 py-4 h-auto text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      Xem lộ trình của tôi
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration - subtle */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-teal-200 dark:bg-teal-800 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-10 animate-pulse delay-2000"></div>
        </div>
      </div>
    </LearningPathGuard>
  );
}
