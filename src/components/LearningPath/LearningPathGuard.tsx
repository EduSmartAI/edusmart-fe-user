/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Spin, Button } from "antd";
import { FiLock } from "react-icons/fi";
import { LearningPathExitConfirmModal } from "EduSmart/components/LearningPath";
import { useSurvey } from "EduSmart/hooks/survey";

interface LearningPathGuardProps {
  children: React.ReactNode;
  requiredStep: number; // Which step this page requires
  requiredCompletedSteps?: number[]; // Which steps must be completed before accessing
  redirectTo?: string;
}

// Step flow configuration
const STEP_FLOW = {
  1: {
    path: "/learning-path/assessment/survey",
    requiredCompleted: [],
  },
  2: {
    path: "/learning-path/assessment/quiz",
    requiredCompleted: [1], // Must complete survey first
  },
  3: {
    path: "/dashboard/learning-paths", // Will redirect to specific ID when available
    requiredCompleted: [1, 2], // Must complete survey and quiz
  },
};

// Keys for localStorage
const STORAGE_KEYS = {
  CURRENT_STEP: "learning_path_current_step",
  COMPLETED_STEPS: "learning_path_completed_steps",
  SURVEY_COMPLETED: "survey_completed",
  QUIZ_COMPLETED: "quiz_completed",
  LEARNING_PATH_ID: "learning_path_id",
};

export function LearningPathGuard({
  children,
  requiredStep,
  requiredCompletedSteps = [],
  redirectTo,
}: LearningPathGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const survey = useSurvey();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [missingSteps, setMissingSteps] = useState<number[]>([]);
  const [showRestartModal, setShowRestartModal] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [requiredStep, pathname, searchParams]);

  const checkAccess = () => {
    try {
      // Special case: If learningPathId param exists, bypass guard
      // This is for the transcript flow where user skips quiz
      const learningPathId = searchParams.get("learningPathId");
      if (learningPathId) {
        console.log(
          "✅ Transcript flow detected - bypassing guard with learningPathId:",
          learningPathId,
        );
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      // Get completed steps from localStorage
      const completedStepsStr = localStorage.getItem(
        STORAGE_KEYS.COMPLETED_STEPS,
      );
      const completedSteps: number[] = completedStepsStr
        ? JSON.parse(completedStepsStr)
        : [];

      // Check if all required steps are completed
      const missing = requiredCompletedSteps.filter(
        (step) => !completedSteps.includes(step),
      );

      if (missing.length > 0) {
        setMissingSteps(missing);
        setHasAccess(false);
        setIsChecking(false);
        return;
      }

      // Grant access
      setHasAccess(true);
      setIsChecking(false);
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
      setIsChecking(false);
    }
  };

  const handleRedirect = () => {
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      // Redirect to the first missing step
      const firstMissing = missingSteps[0];
      if (firstMissing && STEP_FLOW[firstMissing as keyof typeof STEP_FLOW]) {
        // Special case: if redirecting to step 3 (results), check for learning path ID
        if (firstMissing === 3) {
          const learningPathId = learningPathProgress.getLearningPathId();
          if (learningPathId) {
            router.push(`/dashboard/learning-paths/${learningPathId}`);
            return;
          }
        }

        router.push(STEP_FLOW[firstMissing as keyof typeof STEP_FLOW].path);
      } else {
        router.push("/learning-path/overview");
      }
    }
  };

  const handleStartFromBeginning = () => {
    // Show confirmation modal instead of clearing directly
    setShowRestartModal(true);
  };

  const handleConfirmRestart = () => {
    console.log("🔄 User confirmed restart - clearing all progress");

    // Clear all learning path progress
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Clear survey data
    survey.resetSurvey();

    // Clear any other survey-related data in localStorage
    localStorage.removeItem("survey_data");
    localStorage.removeItem("survey_step");
    localStorage.removeItem("survey-storage");

    console.log("✅ All progress cleared");

    // Close modal
    setShowRestartModal(false);

    // Redirect to overview
    router.push("/learning-path/overview");
  };

  const handleCancelRestart = () => {
    console.log("User cancelled restart");
    setShowRestartModal(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-6 text-gray-600 dark:text-gray-400">
            Đang kiểm tra quyền truy cập...
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="max-w-lg w-full">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-10 sm:px-8 sm:py-12 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-16 sm:translate-x-20 -translate-y-16 sm:-translate-y-20 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-100 dark:bg-cyan-900/20 rounded-full transform -translate-x-12 sm:-translate-x-16 translate-y-12 sm:translate-y-16 opacity-30"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="text-center mb-5 sm:mb-6">
                <div className="inline-block">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto shadow-md bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30">
                    <FiLock className="w-8 h-8 sm:w-10 sm:h-10 text-[#49BBBD] dark:text-teal-400" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 text-[#49BBBD] dark:text-teal-400 px-4">
                Chưa thể truy cập
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2 sm:px-4">
                Bạn cần hoàn thành các bước trước để có thể tiếp tục bước này
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleRedirect}
                  className="flex-1 !h-11 sm:!h-11 !bg-gradient-to-r from-[#49BBBD] to-teal-600 border-none hover:from-[#3da8aa] hover:to-teal-700 !text-sm sm:!text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Tiếp tục từ bước còn thiếu
                </Button>
                <Button
                  size="large"
                  onClick={handleStartFromBeginning}
                  className="flex-1 !h-11 sm:!h-11 !text-sm sm:!text-base font-medium rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-[#49BBBD] dark:hover:border-[#49BBBD] hover:text-[#49BBBD] dark:hover:text-[#49BBBD] transition-all duration-300"
                >
                  Bắt đầu lại
                </Button>
              </div>
            </div>
          </div>

          {/* Restart Confirmation Modal */}
          <LearningPathExitConfirmModal
            open={showRestartModal}
            title="Xác nhận bắt đầu lại"
            warningMessage="Tất cả tiến độ và dữ liệu khảo sát của bạn sẽ bị xóa. Bạn sẽ cần làm lại từ đầu."
            confirmText="Bắt đầu lại từ đầu"
            cancelText="Hủy"
            onConfirm={handleConfirmRestart}
            onCancel={handleCancelRestart}
            type="warning"
          />

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-teal-200 dark:bg-teal-800 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-32 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-10 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Helper functions to manage learning path progress
export const learningPathProgress = {
  // Mark a step as completed
  completeStep: (step: number) => {
    try {
      const completedStepsStr = localStorage.getItem(
        STORAGE_KEYS.COMPLETED_STEPS,
      );
      const completedSteps: number[] = completedStepsStr
        ? JSON.parse(completedStepsStr)
        : [];

      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
        localStorage.setItem(
          STORAGE_KEYS.COMPLETED_STEPS,
          JSON.stringify(completedSteps),
        );
      }

      // Update current step
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(step + 1));
    } catch (error) {
      console.error("Error completing step:", error);
    }
  },

  // Get completed steps
  getCompletedSteps: (): number[] => {
    try {
      const completedStepsStr = localStorage.getItem(
        STORAGE_KEYS.COMPLETED_STEPS,
      );
      return completedStepsStr ? JSON.parse(completedStepsStr) : [];
    } catch (error) {
      console.error("Error getting completed steps:", error);
      return [];
    }
  },

  // Get current step
  getCurrentStep: (): number => {
    try {
      const currentStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      return currentStep ? parseInt(currentStep, 10) : 1;
    } catch (error) {
      console.error("Error getting current step:", error);
      return 1;
    }
  },

  // Clear all progress
  clearProgress: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Error clearing progress:", error);
    }
  },

  // Set learning path ID
  setLearningPathId: (id: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNING_PATH_ID, id);
    } catch (error) {
      console.error("Error setting learning path ID:", error);
    }
  },

  // Get learning path ID
  getLearningPathId: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LEARNING_PATH_ID);
    } catch (error) {
      console.error("Error getting learning path ID:", error);
      return null;
    }
  },
};
