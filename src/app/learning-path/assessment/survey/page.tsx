"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SurveyMainFlow } from "EduSmart/components/User/Survey";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";
import {
  LearningPathGuard,
  learningPathProgress,
  LearningPathExitConfirmModal,
} from "EduSmart/components/LearningPath";
import { useSurvey } from "EduSmart/hooks/survey";
import { useSessionAuthStore } from "EduSmart/stores/Auth/SessionAuthStore";
import { useLearningPathFlow } from "EduSmart/hooks/useLearningPathFlow";
import { Spin, message } from "antd";

export default function SurveyAssessmentPage() {
  const router = useRouter();
  const survey = useSurvey();
  const { session, fetchSession, isLoading } = useSessionAuthStore();
  const { markSurveyCompleted, resetFlow } = useLearningPathFlow();
  const [showExitModal, setShowExitModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      await fetchSession();
      setIsChecking(false);
    };

    checkAuth();

    // Clear any previous assessment completion flag when starting new assessment
    sessionStorage.removeItem("learning-path-assessment-completed");
  }, [fetchSession]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isChecking && !session) {
      console.log("User not authenticated - redirecting to login");
      message.warning({
        content:
          "Bạn cần đăng nhập để thực hiện khảo sát và nhận đề xuất lộ trình học tập phù hợp",
        duration: 4,
      });
      setTimeout(() => {
        router.push("/Login?redirect=/learning-path/assessment/survey");
      }, 500);
      return;
    }
  }, [isChecking, session, router]);

  useEffect(() => {
    // Set current step when component mounts
    const completedSteps = learningPathProgress.getCompletedSteps();
    console.log("Survey page - completed steps:", completedSteps);
  }, []);

  // Show loading while checking auth
  if (isChecking || isLoading) {
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

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const handleSurveyComplete = (learningGoalId?: string) => {
    console.log("Survey completed! learningGoalId:", learningGoalId);

    // Mark step 1 as completed
    learningPathProgress.completeStep(1);

    // Mark survey completed in flow state
    markSurveyCompleted();

    // Redirect to transition page with learningGoalId param
    if (learningGoalId) {
      console.log("✅ Redirecting with learningGoalId:", learningGoalId);
      router.push(
        `/learning-path/assessment/transition?learningGoalId=${learningGoalId}`,
      );
    } else {
      console.warn("⚠️ No learningGoalId provided, redirecting without it");
      router.push("/learning-path/assessment/transition");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleExitClick = (data?: any) => {
    // Show confirmation modal instead of exiting directly
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    console.log("🚪 User confirmed exit - clearing all data");

    // 1. Clear all learning path progress data
    learningPathProgress.clearProgress();

    // 2. Reset survey store (clears survey1Data, survey2Data, survey3Data, etc.)
    survey.resetSurvey();

    // 3. Reset flow state
    resetFlow();

    // 4. Clear any other survey-related data in localStorage
    localStorage.removeItem("survey_data");
    localStorage.removeItem("survey_step");
    localStorage.removeItem("survey-storage"); // Store key
    localStorage.removeItem("practice-test-storage"); // Practice test store

    console.log("✅ All data cleared successfully");

    // 5. Close modal
    setShowExitModal(false);

    // 6. Redirect to learning path overview
    router.push("/learning-path");
  };

  const handleCancelExit = () => {
    console.log("User cancelled exit");
    setShowExitModal(false);
  };

  return (
    <LearningPathGuard requiredStep={1} requiredCompletedSteps={[]}>
      <div className="min-h-screen  dark:bg-gray-900">
        {/* Progress Header - Minimal */}
        <div className="sticky top-0 z-10">
          <LearningPathProgress
            currentStep={1}
            completedSteps={[]}
            minimal={true}
            showTimeRemaining={true}
          />
        </div>

        {/* Survey Content */}
        <SurveyMainFlow
          onComplete={handleSurveyComplete}
          onBack={handleExitClick}
          showProgress={true}
        />

        {/* Exit Confirmation Modal */}
        <LearningPathExitConfirmModal
          open={showExitModal}
          title="Xác nhận thoát khảo sát"
          warningMessage="Hành động này không thể hoàn tác. Bạn sẽ cần bắt đầu lại từ đầu nếu muốn tiếp tục lộ trình học tập."
          confirmText="Thoát khảo sát"
          cancelText="Tiếp tục làm"
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
          type="warning"
        />
      </div>
    </LearningPathGuard>
  );
}
