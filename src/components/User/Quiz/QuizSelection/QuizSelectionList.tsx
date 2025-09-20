"use client";
import React from "react";
import { Typography } from "antd";
import QuizSelectionLine from "./QuizSelectionLine";
import { Quiz } from "EduSmart/types/quiz";

const { Text } = Typography;

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
      <div className="text-center py-12">
        <Text className="text-lg text-gray-500">
          Không có quiz nào phù hợp với bộ lọc đã chọn
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
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
