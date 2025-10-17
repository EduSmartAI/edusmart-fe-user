"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin, Result, Button } from "antd";
import { FiLock, FiAlertCircle } from "react-icons/fi";

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
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [missingSteps, setMissingSteps] = useState<number[]>([]);

  useEffect(() => {
    checkAccess();
  }, [requiredStep, pathname]);

  const checkAccess = () => {
    try {
      // Get completed steps from localStorage
      const completedStepsStr = localStorage.getItem(
        STORAGE_KEYS.COMPLETED_STEPS
      );
      const completedSteps: number[] = completedStepsStr
        ? JSON.parse(completedStepsStr)
        : [];

      // Check if all required steps are completed
      const missing = requiredCompletedSteps.filter(
        (step) => !completedSteps.includes(step)
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
        
        router.push(
          STEP_FLOW[firstMissing as keyof typeof STEP_FLOW].path
        );
      } else {
        router.push("/learning-path/overview");
      }
    }
  };

  const handleStartFromBeginning = () => {
    // Clear all progress
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    router.push("/learning-path/overview");
  };

  if (isChecking) {
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

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-md w-full">
          <Result
            status="warning"
            icon={<FiLock className="w-16 h-16 mx-auto text-yellow-500" />}
            title={
              <span className="text-gray-900 dark:text-white">
                Chưa thể truy cập
              </span>
            }
            subTitle={
              <div className="text-gray-600 dark:text-gray-400">
                <p className="mb-4">
                  Bạn cần hoàn thành các bước trước để tiếp tục.
                </p>
                {missingSteps.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
                    <div className="flex items-start">
                      <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                          Các bước chưa hoàn thành:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {missingSteps.map((step) => (
                            <li key={step} className="text-yellow-700 dark:text-yellow-400">
                              Bước {step}:{" "}
                              {step === 1
                                ? "Khảo sát"
                                : step === 2
                                  ? "Đánh giá năng lực"
                                  : "Nhận kết quả"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
            extra={[
              <Button
                key="continue"
                type="primary"
                size="large"
                onClick={handleRedirect}
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-none"
              >
                Tiếp tục từ bước còn thiếu
              </Button>,
              <Button
                key="restart"
                size="large"
                onClick={handleStartFromBeginning}
              >
                Bắt đầu lại từ đầu
              </Button>,
            ]}
          />
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
        STORAGE_KEYS.COMPLETED_STEPS
      );
      const completedSteps: number[] = completedStepsStr
        ? JSON.parse(completedStepsStr)
        : [];

      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
        localStorage.setItem(
          STORAGE_KEYS.COMPLETED_STEPS,
          JSON.stringify(completedSteps)
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
        STORAGE_KEYS.COMPLETED_STEPS
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
