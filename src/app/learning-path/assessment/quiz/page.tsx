"use client";

import React from "react";
import { useRouter } from "next/navigation";
import QuizMainFlow from "EduSmart/components/User/Quiz/QuizMainFlow";
import { LearningPathGuard, learningPathProgress } from "EduSmart/components/LearningPath";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";

export default function QuizAssessmentPage() {
  const router = useRouter();

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

  return (
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
  );
}
