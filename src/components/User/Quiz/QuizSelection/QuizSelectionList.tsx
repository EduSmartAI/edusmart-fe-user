"use client";
import React from "react";
import QuizSelectionLine from "./QuizSelectionLine";
import { Quiz } from "EduSmart/types/quiz";
import { FiTarget } from "react-icons/fi";

interface QuizSelectionListProps {
  quizzes: Quiz[];
  selectedQuizIds: string[];
  isLoading?: boolean;
  onQuizSelect: (quizId: string) => void;
  onQuizStart: (quizId: string) => void;
}

const QuizSelectionList: React.FC<QuizSelectionListProps> = ({
  quizzes,
  selectedQuizIds,
  isLoading = false,
  onQuizSelect,
  onQuizStart,
}) => {
  // Chỉ hiển thị "không có quiz" khi đã load xong và thực sự không có dữ liệu
  if (!isLoading && quizzes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiTarget className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Không có quiz nào
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Hiện tại chưa có quiz nào phù hợp với bộ lọc đã chọn
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
      {quizzes.map((quiz: Quiz) => (
        <QuizSelectionLine
          key={quiz.id}
          id={quiz.id}
          title={quiz.title}
          description={
            quiz.description || "Một bài quiz thú vị đang chờ bạn khám phá"
          }
          subjectCode={quiz.subjectCode || "N/A"}
          subjectCodeName={quiz.subjectCodeName || "N/A"}
          totalQuestions={quiz.totalQuestions || 0}
          isCompleted={quiz.status === "completed"}
          isSelected={selectedQuizIds.includes(quiz.id)}
          onSelect={onQuizSelect}
          onStart={onQuizStart}
        />
      ))}
    </div>
  );
};

export default QuizSelectionList;
