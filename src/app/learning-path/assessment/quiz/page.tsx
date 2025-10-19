"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizMainFlow from "EduSmart/components/User/Quiz/QuizMainFlow";
import {
  LearningPathGuard,
  learningPathProgress,
} from "EduSmart/components/LearningPath";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";
import LearningPathErrorBoundary from "EduSmart/components/LearningPath/LearningPathErrorBoundary";
import { useSessionAuthStore } from "EduSmart/stores/Auth/SessionAuthStore";
import { Spin, message } from "antd";

export default function QuizAssessmentPage() {
  const router = useRouter();
  const { session, fetchSession, isLoading } = useSessionAuthStore();
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
          "Bạn cần đăng nhập để thực hiện bài kiểm tra đánh giá năng lực",
        duration: 4,
      });
      setTimeout(() => {
        router.push("/Login?redirect=/learning-path/assessment/quiz");
      }, 500);
    }
  }, [isChecking, session, router]);

  const handleQuizComplete = (learningPathId: string) => {
    console.log("Quiz completed with learning path ID:", learningPathId);

    // Mark step 2 as completed
    learningPathProgress.completeStep(2);

    // Store learning path ID
    learningPathProgress.setLearningPathId(learningPathId);
  };

  const handleBack = () => {
    router.push("/learning-path/overview");
  };

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
    <LearningPathErrorBoundary showProgress={true}>
      <LearningPathGuard requiredStep={2} requiredCompletedSteps={[1]}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Progress Header - Minimal */}
          <div className="sticky top-0 z-10">
            <LearningPathProgress
              currentStep={2}
              completedSteps={[1]}
              minimal={true}
              showTimeRemaining={true}
            />
          </div>

          {/* Quiz Content */}
          <QuizMainFlow />
        </div>
      </LearningPathGuard>
    </LearningPathErrorBoundary>
  );
}
