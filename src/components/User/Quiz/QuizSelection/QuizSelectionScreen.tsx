"use client";
import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useQuizList, useQuizTest } from "EduSmart/hooks/quiz";
import { Quiz } from "EduSmart/types/quiz";
import QuizSelectionHeader from "EduSmart/components/User/Quiz/QuizSelection/QuizSelectionHeader";
import QuizSelectionList from "EduSmart/components/User/Quiz/QuizSelection/QuizSelectionList";
import ActionButtons from "EduSmart/components/User/Quiz/QuizSelection/ActionButtons";
import QuizEduSmartHeader from "EduSmart/components/User/Quiz/QuizEdusmartHeader";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Content } = Layout;

interface QuizSelectionScreenProps {
  onQuizSelect: (testId: string) => void; // Changed from quizIds to testId
  onSkip?: () => void;
}

const QuizSelectionScreen: React.FC<QuizSelectionScreenProps> = ({
  onQuizSelect,
  onSkip,
}) => {
  // API hooks để lấy danh sách quiz từ backend
  const {
    quizzes: availableQuizzes,
    loadQuizzes,
    isLoading,
    error,
  } = useQuizList();
  const { createTest } = useQuizTest();

  // UI state
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load quizzes khi component mount
  useEffect(() => {
    setHasInitialized(true);
    loadQuizzes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Convert API data to UI format (QuizListItem -> Quiz)
  const quizzes: Quiz[] = availableQuizzes.map(
    (quiz) =>
      ({
        id: quiz.quizId,
        title: quiz.title,
        description: quiz.description,
        questions: [], // Questions sẽ được load khi tạo test
        status: "not_started", // Default status cho quiz mới
        // Additional UI fields
        subjectCode: quiz.subjectCode,
        subjectCodeName: quiz.subjectCodeName,
        totalQuestions: quiz.totalQuestions,
        difficultyLevel: quiz.difficultyLevel,
      }) as Quiz & {
        subjectCode: string;
        subjectCodeName: string;
        totalQuestions: number;
        difficultyLevel: string;
      },
  );

  const filteredQuizzes = quizzes.filter((quiz: Quiz) => {
    const hasResult = quiz.status === "completed";
    switch (selectedFilter) {
      case "completed":
        return hasResult;
      case "pending":
        return !hasResult;
      default:
        return true;
    }
  });

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuizIds((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId],
    );
  };

  const handleQuizStart = async (quizId: string) => {
    try {
      // Tạo test với single quiz
      const result = await createTest([quizId]);
      if (result.ok) {
        console.log("Single quiz test created:", result.testId);
        onQuizSelect(result.testId!);
      } else {
        console.error("Failed to create single quiz test:", result.error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error("Error creating single quiz test:", error);
    }
  };

  const handleStartSelected = async () => {
    if (selectedQuizIds.length > 0) {
      try {
        // Tạo test với các quiz đã chọn thông qua API
        const result = await createTest(selectedQuizIds);
        if (result.ok) {
          console.log("Test created successfully:", result.testId);
          onQuizSelect(result.testId!);
        } else {
          console.error("Failed to create test:", result.error);
          // TODO: Show error message to user
        }
      } catch (error) {
        console.error("Error creating test:", error);
        // TODO: Show error message to user
      }
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  // Create currentSeries for header (backward compatibility)
  const currentSeries = {
    id: "quiz-selection",
    title: "Chọn bài quiz",
    description: "Vui lòng chọn các bài quiz bạn muốn làm",
    quizzes: quizzes,
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout className="min-h-screen h-screen  bg-gray-50 dark:bg-gray-900">
        <QuizEduSmartHeader />
        <Content>
          <div className="max-w-7xl mx-auto">
            <div className="text-center h-screen flex items-center justify-center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
              />
            </div>
          </div>
        </Content>
      </Layout>
    );
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
                onClick={() => loadQuizzes()}
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

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* EduSmart Header */}
      <QuizEduSmartHeader />

      <Content className="p-10">
        <div className="max-w-7xl mx-auto min-h-screen">
          {/* Header Section */}
          <QuizSelectionHeader
            currentSeries={currentSeries}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {/* Quiz List */}
          <QuizSelectionList
            quizzes={filteredQuizzes}
            selectedQuizIds={selectedQuizIds}
            isLoading={isLoading || !hasInitialized}
            onQuizSelect={handleQuizSelect}
            onQuizStart={handleQuizStart}
          />
        </div>
      </Content>

      {/* Action Buttons */}
      <ActionButtons
        selectedCount={selectedQuizIds.length}
        onSkip={handleSkip}
        onStart={handleStartSelected}
        disabled={selectedQuizIds.length === 0}
      />
    </Layout>
  );
};

export default QuizSelectionScreen;
