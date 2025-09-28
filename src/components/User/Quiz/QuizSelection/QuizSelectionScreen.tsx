"use client";
import React, { useState, useEffect } from "react";
import { useQuizList, useQuizTest } from "EduSmart/hooks/quiz";
import { Quiz } from "EduSmart/types/quiz";
import QuizSelectionHeader from "EduSmart/components/User/Quiz/QuizSelection/QuizSelectionHeader";
import QuizSelectionList from "EduSmart/components/User/Quiz/QuizSelection/QuizSelectionList";
import ActionButtons from "EduSmart/components/User/Quiz/QuizSelection/ActionButtons";
import { Spin, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FiRefreshCcw } from "react-icons/fi";

interface QuizSelectionScreenProps {
  onQuizSelect: (testId: string) => void;
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
  if (isLoading || !hasInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: "#3b82f6" }}
                  spin
                />
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Đang tải danh sách quiz
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Vui lòng chờ trong giây lát...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiRefreshCcw className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Không thể tải danh sách quiz
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error}
            </p>
            <Button
              type="primary"
              onClick={() => loadQuizzes()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 px-6 py-2 h-auto font-semibold rounded-lg"
              icon={<FiRefreshCcw className="w-4 h-4" />}
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
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

      {/* Action Buttons */}
      <ActionButtons
        selectedCount={selectedQuizIds.length}
        onSkip={handleSkip}
        onStart={handleStartSelected}
        disabled={selectedQuizIds.length === 0}
      />
    </div>
  );
};

export default QuizSelectionScreen;
