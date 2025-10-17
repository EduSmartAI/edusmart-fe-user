"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SurveyMainFlow } from "EduSmart/components/User/Survey";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";
import { LearningPathGuard, learningPathProgress } from "EduSmart/components/LearningPath";

export default function SurveyAssessmentPage() {
  const router = useRouter();

  useEffect(() => {
    // Set current step when component mounts
    const completedSteps = learningPathProgress.getCompletedSteps();
    console.log("Survey page - completed steps:", completedSteps);
  }, []);

  const handleSurveyComplete = () => {
    console.log("Survey completed!");
    
    // Mark step 1 as completed
    learningPathProgress.completeStep(1);
    
    // Redirect to transition page
    router.push("/learning-path/assessment/transition");
  };

  const handleBack = () => {
    router.push("/learning-path/overview");
  };

  return (
    <LearningPathGuard requiredStep={1} requiredCompletedSteps={[]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Progress Header - Minimal for survey pages */}
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
          onBack={handleBack} 
        />
      </div>
    </LearningPathGuard>
  );
}
