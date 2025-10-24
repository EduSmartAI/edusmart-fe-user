"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizList, useQuizTest } from "EduSmart/hooks/quiz";
import { Quiz } from "EduSmart/types/quiz";
import QuizSelectionHeader from "EduSmart/components/User/Quiz/QuizSelection/QuizSelectionHeader";
import QuizSelectionList from "EduSmart/components/User/Quiz/QuizSelection/QuizSelectionList";
import ActionButtons from "EduSmart/components/User/Quiz/QuizSelection/ActionButtons";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { throwStoreError } from "EduSmart/types/errors";
import {
  LearningPathExitConfirmModal,
  learningPathProgress,
} from "EduSmart/components/LearningPath";
import { useSurvey } from "EduSmart/hooks/survey";

interface QuizSelectionScreenProps {
  onQuizSelect: (testId: string) => void;
  onSkip?: () => void;
  showProgress?: boolean; // Cho Learning Path
}

const QuizSelectionScreen: React.FC<QuizSelectionScreenProps> = ({
  onQuizSelect,
  onSkip,
}) => {
  const router = useRouter();
  const survey = useSurvey();

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
  const [showExitModal, setShowExitModal] = useState(false);

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
        }
      } catch (error) {
        console.error("Error creating test:", error);
      }
    }
  };

  const handleSkip = () => {
    // Show exit confirmation modal instead of exiting directly
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    console.log(
      "🚪 User confirmed exit from quiz selection - clearing all data",
    );

    // 1. Clear all learning path progress data
    learningPathProgress.clearProgress();

    // 2. Reset survey store
    survey.resetSurvey();

    // 3. Clear any other survey-related data in localStorage
    localStorage.removeItem("survey_data");
    localStorage.removeItem("survey_step");
    localStorage.removeItem("survey-storage");

    console.log("✅ All data cleared successfully");

    // 4. Close modal
    setShowExitModal(false);

    // 5. Call onSkip if provided or redirect to overview
    if (onSkip) {
      onSkip();
    } else {
      router.push("/learning-path/overview");
    }
  };

  const handleCancelExit = () => {
    console.log("User cancelled exit from quiz selection");
    setShowExitModal(false);
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: "#49BBBD" }}
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

  // ✅ Throw HttpError để ErrorBoundary bắt (LearningPathErrorBoundary hoặc page-level boundary)
  if (error) {
    throwStoreError(error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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

      {/* Exit Confirmation Modal */}
      <LearningPathExitConfirmModal
        open={showExitModal}
        title="Xác nhận thoát đánh giá năng lực"
        warningMessage="Tất cả dữ liệu khảo sát và tiến độ của bạn sẽ bị xóa. Bạn sẽ cần bắt đầu lại từ đầu nếu muốn tiếp tục lộ trình học tập."
        confirmText="Thoát và xóa dữ liệu"
        cancelText="Tiếp tục làm bài"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        type="warning"
      />
    </div>
  );
};

// Export directly - ErrorBoundary should be at page/layout level
export default QuizSelectionScreen;
