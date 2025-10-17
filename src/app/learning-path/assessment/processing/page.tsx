"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, message } from "antd";
import { 
  FiCpu, 
  FiLoader,
  FiCheckCircle,
  FiTarget,
  FiUser,
  FiArrowRight,
  FiClock
} from "react-icons/fi";
import { getLearningPathAction } from "EduSmart/app/(learning-path)/learningPathAction";
import { LearningPathGuard, learningPathProgress } from "EduSmart/components/LearningPath";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";

export default function QuizCompletionWaiting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const learningPathId = searchParams.get("learningPathId");
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [aiStage, setAiStage] = useState(1); // 1: Analyzing, 2: Processing, 3: Generating

  useEffect(() => {
    if (!learningPathId) {
      message.error("Không tìm thấy ID lộ trình học tập");
      router.push("/learning-path/overview");
      return;
    }

    let pollInterval: NodeJS.Timeout;
    let attemptCount = 0;
    let stageInterval: NodeJS.Timeout;

    // Simulate AI processing stages for better UX
    stageInterval = setInterval(() => {
      setAiStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 3000);

    const checkLearningPathStatus = async () => {
      try {
        attemptCount++;
        setPollingAttempts(attemptCount);
        console.log(`🔄 Polling learning path status (Attempt ${attemptCount})...`);
        
        const result = await getLearningPathAction(learningPathId);

        if (!result.ok) {
          console.error("❌ Failed to get learning path:", result.error);
          
          // After 10 attempts (~30 seconds), stop and show error
          if (attemptCount >= 10) {
            clearInterval(pollInterval);
            clearInterval(stageInterval);
            setIsPolling(false);
            message.error("Không thể tải lộ trình học tập. Vui lòng thử lại sau.");
          }
          return;
        }

        // Check if learning path is ready (status === 1)
        if (result.data.status === 1) {
          console.log("✅ Learning path is ready!");
          clearInterval(pollInterval);
          clearInterval(stageInterval);
          setIsPolling(false);
          setIsCompleted(true);
          
          // Mark step 2 as completed and store learning path ID
          learningPathProgress.completeStep(2);
          learningPathProgress.setLearningPathId(learningPathId);
          
          // Wait a moment to show success state
          setTimeout(() => {
            router.push(`/dashboard/learning-paths/${learningPathId}`);
          }, 2000);
        } else {
          console.log("⏳ Learning path still processing, status:", result.data.status);
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
      clearInterval(stageInterval);
    };
  }, [learningPathId, router]);

  const aiStages = [
    { id: 1, name: "Phân tích khảo sát", icon: <FiUser className="w-5 h-5" /> },
    { id: 2, name: "Đánh giá năng lực", icon: <FiTarget className="w-5 h-5" /> },
    { id: 3, name: "Tạo lộ trình", icon: <FiCpu className="w-5 h-5" /> },
  ];

  return (
    <LearningPathGuard requiredStep={2} requiredCompletedSteps={[1, 2]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Progress Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <LearningPathProgress
              currentStep={3}
              completedSteps={[1, 2]}
              compact={true}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-8">
              {!isCompleted ? (
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiLoader className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="w-10 h-10 text-green-500" />
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
                {!isCompleted ? (
                  <>🤖 AI đang xử lý dữ liệu của bạn</>
                ) : (
                  <>✨ Lộ trình học tập đã sẵn sàng!</>
                )}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                {!isCompleted ? (
                  <>
                    Hệ thống AI đang phân tích khảo sát và kết quả đánh giá của bạn
                    để tạo ra lộ trình học tập cá nhân hóa. Quá trình này có thể mất
                    vài giây...
                  </>
                ) : (
                  <>
                    Lộ trình học tập cá nhân hóa của bạn đã được tạo thành công!
                    Chúng tôi sẽ chuyển bạn đến trang kết quả ngay bây giờ.
                  </>
                )}
              </p>
            </div>

            {/* AI Processing Stages */}
            {isPolling && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                <div className="space-y-4">
                  {aiStages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                        aiStage >= stage.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-700/30 border-2 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            aiStage > stage.id
                              ? "bg-green-500 text-white"
                              : aiStage === stage.id
                                ? "bg-blue-500 text-white"
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
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
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
                  <FiClock className="w-4 h-4 mr-2" />
                  <span>
                    Đã xử lý {pollingAttempts * 3} giây...
                  </span>
                </div>
              </div>
            )}

            {/* Success state - show button to view results */}
            {isCompleted && (
              <Button
                type="primary"
                size="large"
                icon={<FiArrowRight className="w-5 h-5" />}
                iconPosition="end"
                onClick={() => router.push(`/dashboard/learning-paths/${learningPathId}`)}
                className="bg-gradient-to-r from-green-600 to-blue-600 border-none hover:from-green-700 hover:to-blue-700 px-8 py-3 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem lộ trình của tôi
              </Button>
            )}
          </div>
        </div>
      </div>
    </LearningPathGuard>
  );
}
