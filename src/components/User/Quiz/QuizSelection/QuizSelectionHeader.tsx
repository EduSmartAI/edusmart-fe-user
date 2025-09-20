"use client";
import React from "react";
import { Typography } from "antd";
import { FadeTransition } from "EduSmart/components/Animation/FadeTransition";
import { Quiz } from "EduSmart/types/quiz";

const { Title, Paragraph } = Typography;

interface QuizSelectionHeaderProps {
  currentSeries: {
    title?: string;
    description?: string;
    quizzes?: Quiz[];
  } | null;
  selectedFilter: "all" | "completed" | "pending";
  onFilterChange: (filter: "all" | "completed" | "pending") => void;
}

const QuizSelectionHeader: React.FC<QuizSelectionHeaderProps> = ({}) => {
  return (
    <FadeTransition show={true}>
      <div className="mb-8">
        <div className="text-center mb-6">
          <Title level={1} className="!mb-2">
            Quiz kiểm tra kiến thức
          </Title>
          <Paragraph className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Quiz được tạo ra nhằm đánh giá kiến thức của bạn về các môn nền
            tảng. Hãy chọn ít nhất một quiz để bắt đầu!
          </Paragraph>
        </div>
      </div>
    </FadeTransition>
  );
};

export default QuizSelectionHeader;
