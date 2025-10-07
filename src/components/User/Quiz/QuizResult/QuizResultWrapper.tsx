"use client";
import React, { useEffect, useState } from "react";
import { Layout, Card, Typography } from "antd";
import QuizResultScreen from "./QuizResultScreen";
import { useQuizResult } from "EduSmart/hooks/quiz";
import { useLoadingStore } from "EduSmart/stores/Loading/LoadingStore";
import Loading from "EduSmart/components/Loading/Loading";
import QuizEduSmartHeader from "EduSmart/components/User/Quiz/QuizEdusmartHeader";
import { mapBackendQuestionType } from "EduSmart/types/quiz";

const { Content } = Layout;
const { Title } = Typography;

interface QuizResultWrapperProps {
  studentTestId: string;
  onBackToHome: () => void;
  onRetakeQuiz: () => void;
}

const QuizResultWrapper: React.FC<QuizResultWrapperProps> = ({
  studentTestId,
  onBackToHome,
  onRetakeQuiz,
}) => {
  const {
    results,
    error,
    loadResult,
    isLoading: quizLoading,
  } = useQuizResult();
  const { showLoading, hideLoading } = useLoadingStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (studentTestId) {
      setHasInitialized(true);
      showLoading();
      loadResult(studentTestId).finally(() => {
        hideLoading();
      });
    }
  }, [studentTestId, loadResult, showLoading, hideLoading]);

  // Show loading state if loading or haven't initialized yet
  if (quizLoading || !hasInitialized) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return (
      <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <QuizEduSmartHeader />
        <Content className="p-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-red-600">
              <p>Lỗi: {error}</p>
              <button
                onClick={() => loadResult(studentTestId)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Thử lại
              </button>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  // Show no results state - chỉ hiển thị khi đã load xong và thực sự không có dữ liệu
  if (!quizLoading && !error && results.length === 0) {
    return (
      <Layout className="h-screen bg-gray-50 dark:bg-gray-900">
        <QuizEduSmartHeader />
        <Content className="p-6 flex items-center justify-center">
          <Card className="text-center">
            <Title level={3}>API Không có kết quả để hiển thị</Title>
            <Title level={4}>Không có dữ liệu</Title>
          </Card>
        </Content>
      </Layout>
    );
  }

  // Transform results for the original QuizResultScreen
  const normalizedResults = results.map((result) => ({
    ...result,
    questions: result.questions.map((q) => ({
      ...q,
      difficultyLevel:
        "difficultyLevel" in q && typeof q.difficultyLevel === "number"
          ? q.difficultyLevel
          : 1,
      type: mapBackendQuestionType(q.type),
    })),
  }));

  const handleRetakeQuiz = () => {
    onRetakeQuiz();
  };

  return (
    <QuizResultScreen
      results={normalizedResults}
      onBackToHome={onBackToHome}
      onRetakeQuiz={handleRetakeQuiz}
    />
  );
};

export default QuizResultWrapper;
