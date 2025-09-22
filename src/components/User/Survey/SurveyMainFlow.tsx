"use client";
import React, { useState } from "react";
import { Layout, Steps, Card } from "antd";
import {
  SurveyFlowState,
  SurveyStep,
  Survey1FormValues,
  Survey2FormValues,
  Survey3FormValues,
} from "EduSmart/types/survey";
import Survey1BasicInfo from "EduSmart/components/User/Survey/SurveySteps/Survey1BasicInfo";
import Survey2TechKnowledge from "EduSmart/components/User/Survey/SurveySteps/Survey2TechKnowledge";
import Survey3StudyHabits from "EduSmart/components/User/Survey/SurveySteps/Survey3StudyHabits";

const { Content } = Layout;

interface SurveyMainFlowProps {
  onComplete?: () => void;
  onBack?: () => void;
}

const SurveyMainFlow: React.FC<SurveyMainFlowProps> = ({
  onComplete,
  onBack,
}) => {
  const [surveyState, setSurveyState] = useState<SurveyFlowState>({
    currentStep: 1,
    completedSteps: [],
    survey1Data: null,
    survey2Data: null,
    survey3Data: null,
    isLoading: false,
    error: null,
  });

  const handleStepComplete = (
    step: SurveyStep,
    data: Survey1FormValues | Survey2FormValues | Survey3FormValues,
  ) => {
    setSurveyState((prev) => ({
      ...prev,
      [`survey${step}Data`]: data,
      completedSteps: prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step],
    }));

    // Chuyển sang bước tiếp theo nếu không phải bước cuối
    if (step < 3) {
      setSurveyState((prev) => ({
        ...prev,
        currentStep: (step + 1) as SurveyStep,
      }));
    } else {
      // Hoàn thành tất cả survey
      onComplete?.();
    }
  };

  const handlePrevStep = () => {
    if (surveyState.currentStep > 1) {
      setSurveyState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep - 1) as SurveyStep,
      }));
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

  const renderCurrentStep = () => {
    switch (surveyState.currentStep) {
      case 1:
        return (
          <Survey1BasicInfo
            initialData={surveyState.survey1Data}
            onComplete={(data) => handleStepComplete(1, data)}
            onBack={onBack}
          />
        );
      case 2:
        return (
          <Survey2TechKnowledge
            initialData={surveyState.survey2Data}
            onComplete={(data) => handleStepComplete(2, data)}
            onBack={handlePrevStep}
          />
        );
      case 3:
        return (
          <Survey3StudyHabits
            initialData={surveyState.survey3Data}
            onComplete={(data) => handleStepComplete(3, data)}
            onBack={handlePrevStep}
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
              current={surveyState.currentStep - 1}
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
              Bước {surveyState.currentStep}/3 -
              {surveyState.completedSteps.length > 0 &&
                ` Đã hoàn thành ${surveyState.completedSteps.length} bước`}
            </p>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default SurveyMainFlow;
