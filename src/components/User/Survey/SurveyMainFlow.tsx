/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout, Steps, Card, message } from "antd";
import {
  SurveyStep,
  Survey1FormValues,
  Survey2FormValues,
  Survey3FormValues,
} from "EduSmart/types";
import Survey1BasicInfo from "EduSmart/components/User/Survey/SurveySteps/Survey1BasicInfo";
import Survey2TechKnowledge from "EduSmart/components/User/Survey/SurveySteps/Survey2TechKnowledge";
import Survey3StudyHabits from "EduSmart/components/User/Survey/SurveySteps/Survey3StudyHabits";
import { useSurvey } from "EduSmart/hooks/survey";
import { throwStoreError } from "EduSmart/types/errors";

const { Content } = Layout;

interface SurveyMainFlowProps {
  onComplete?: (learningGoalId?: string) => void;
  onBack?: (
    data: Survey1FormValues | Survey2FormValues | Survey3FormValues,
  ) => void;
  showProgress?: boolean; // Cho Learning Path
}

const SurveyMainFlow: React.FC<SurveyMainFlowProps> = ({
  onComplete,
  onBack,
  showProgress,
}) => {
  // ✅ Initialize router
  const router = useRouter();

  // Sử dụng hook thay vì local state
  const survey = useSurvey();

  // ✅ Throw error nếu có submitError từ store
  if (survey.submitError) {
    survey.setSubmitError(null); // Clear error state
    throwStoreError(survey.submitError);
  }

  // Khởi tạo dữ liệu API khi component mount
  useEffect(() => {
    // Load tất cả data cần thiết cho survey
    const shouldLoadData =
      survey.semesters.length === 0 ||
      survey.majors.length === 0 ||
      survey.learningGoals.length === 0 ||
      survey.technologies.length === 0 ||
      !survey.interestSurveyDetail ||
      !survey.habitSurveyDetail;

    if (shouldLoadData) {
      console.log("🔄 Loading survey form data...");
      survey.initializeFormData().then((result) => {
        if (result.success) {
          console.log("✅ Survey form data loaded successfully");
        } else {
          console.error("❌ Failed to load survey form data:", result.error);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStepComplete = async (
    step: SurveyStep,
    data: Survey1FormValues | Survey2FormValues | Survey3FormValues,
  ) => {
    // Update data trong store
    survey.updateSurveyData(step, data);
    survey.markStepCompleted(step);

    // Auto save draft after completing each step
    const saveResult = await survey.saveDraft();
    if (saveResult.success) {
      console.log(`✅ Step ${step} data saved successfully`);
    } else {
      console.warn(`⚠️ Failed to save step ${step} draft:`, saveResult.error);
    }

    // Chuyển sang bước tiếp theo nếu không phải bước cuối
    if (step < 3) {
      survey.goToNextStep();
    } else {
      // ✅ Bước cuối - KHÔNG SUBMIT, redirect to transition page với learningGoalId
      console.log("✅ Survey 3 completed, redirecting to transition page...");

      // Lấy learningGoalId từ survey1Data
      const learningGoalId = survey.survey1Data?.learningGoal;

      if (!learningGoalId) {
        message.error(
          "Không tìm thấy thông tin mục tiêu học tập. Vui lòng thử lại.",
        );
        console.error("❌ learningGoalId not found in survey1Data");
        return;
      }

      console.log("📍 Redirecting with learningGoalId:", learningGoalId);

      // ✅ Set completed steps in localStorage for LearningPathGuard
      try {
        localStorage.setItem(
          "learning_path_completed_steps",
          JSON.stringify([1]),
        );
        localStorage.setItem("learning_path_current_step", "2");
        console.log("✅ Saved completed steps to localStorage: [1]");
      } catch (error) {
        console.warn("⚠️ Failed to save to localStorage:", error);
      }

      message.success({
        content: "Khảo sát đã được lưu! Vui lòng chọn bước tiếp theo.",
        duration: 2,
      });

      // Redirect to transition page with learningGoalId parameter
      router.push(
        `/learning-path/assessment/transition?learningGoalId=${learningGoalId}`,
      );
    }
  };

  const handlePrevStep = (
    step: number,
    data: Survey1FormValues | Survey2FormValues | Survey3FormValues,
  ) => {
    // Special case: If at step 1 and onBack prop is provided, call it (Exit to overview)
    if (step === 1 && onBack) {
      console.log("🚪 Step 1 - Calling parent onBack (Exit)");
      onBack(data);
      return;
    }

    // Scroll to top before going back
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Backup current form data before going back
    if (data) {
      survey.updateSurveyData(step, data);
      console.log(`📝 Backed up step ${step} data:`, data);
    }

    // Navigate to previous step
    if (survey.currentStep > 1) {
      survey.goToPreviousStep();
    }
  };

  const stepItems = [
    {
      title: "Thông tin cơ bản",
    },
    {
      title: "Độ am hiểu công nghệ",
    },
    {
      title: "Thói quen học tập",
    },
  ];

  console.log("Survey state:", { survey });

  const renderCurrentStep = () => {
    switch (survey.currentStep) {
      case 1:
        return (
          <Survey1BasicInfo
            initialData={survey.survey1Data}
            onComplete={(data) => handleStepComplete(1, data)}
            onBack={
              onBack
                ? (data: Survey1FormValues) => handlePrevStep(1, data)
                : undefined
            }
            semesters={survey.semesters}
            majors={survey.majors}
            learningGoals={survey.learningGoals}
            interestSurveyDetail={survey.interestSurveyDetail}
            isLoading={
              survey.isLoadingSemesters ||
              survey.isLoadingMajors ||
              survey.isLoadingLearningGoals ||
              survey.isLoadingInterestSurvey
            }
          />
        );
      case 2:
        return (
          <Survey2TechKnowledge
            initialData={survey.survey2Data}
            onComplete={(data) => handleStepComplete(2, data)}
            onBack={(data: Survey2FormValues) => handlePrevStep(2, data)}
            technologies={survey.technologies}
            isLoading={survey.isLoadingTechnologies}
          />
        );
      case 3:
        return (
          <Survey3StudyHabits
            initialData={survey.survey3Data}
            onComplete={(data) => handleStepComplete(3, data)}
            onBack={(data: Survey3FormValues) => handlePrevStep(3, data)}
            isSubmitting={survey.isSubmitting}
            habitSurveyDetail={survey.habitSurveyDetail}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Content className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <Card className="mb-6 shadow-sm">
            <Steps
              current={survey.currentStep - 1}
              items={stepItems}
              size="small"
              className="mb-0 survey-steps"
            />
          </Card>

          {/* Current Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-2">
            {renderCurrentStep()}
          </div>

          {/* Progress Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bước {survey.currentStep}/3 -
              {survey.completedSteps.length > 0 &&
                ` Đã hoàn thành ${survey.completedSteps.length} bước`}
            </p>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

// Export directly - ErrorBoundary should be at page/layout level
export default SurveyMainFlow;
