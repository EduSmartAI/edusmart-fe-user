"use client";
import React, { useEffect } from "react";
import { Layout, Steps, Card } from "antd";
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

const { Content } = Layout;

interface SurveyMainFlowProps {
  onComplete?: () => void;
  onBack?: () => void;
}

const SurveyMainFlow: React.FC<SurveyMainFlowProps> = ({ onComplete }) => {
  // Sử dụng hook thay vì local state
  const survey = useSurvey();

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

  const handleStepComplete = (
    step: SurveyStep,
    data: Survey1FormValues | Survey2FormValues | Survey3FormValues,
  ) => {
    // Update data trong store
    survey.updateSurveyData(step, data);
    survey.markStepCompleted(step);

    // Auto save draft after completing each step
    survey.saveDraft().then((result) => {
      if (result.success) {
        console.log(`✅ Step ${step} data saved successfully`);
      } else {
        console.warn(`⚠️ Failed to save step ${step} draft:`, result.error);
      }
    });

    // Chuyển sang bước tiếp theo nếu không phải bước cuối
    if (step < 3) {
      survey.goToNextStep();
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevStep = () => {
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
            onBack={handlePrevStep}
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
            onBack={handlePrevStep}
            technologies={survey.technologies}
            isLoading={survey.isLoadingTechnologies}
          />
        );
      case 3:
        return (
          <Survey3StudyHabits
            initialData={survey.survey3Data}
            onComplete={(data) => handleStepComplete(3, data)}
            onBack={handlePrevStep}
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
          {/* Header */}
          {/* <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Khảo sát định hướng học tập
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Giúp chúng tôi hiểu về bạn để đề xuất lộ trình học tập phù hợp
            </p>
          </div> */}

          {/* Steps */}
          <Card className="mb-6 shadow-sm">
            <Steps
              current={survey.currentStep - 1}
              items={stepItems}
              size="small"
              className="mb-0"
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

export default SurveyMainFlow;
