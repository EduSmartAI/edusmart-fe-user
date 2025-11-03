/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { FadeTransition } from "EduSmart/components/Animation/FadeTransition";
import { Quiz } from "EduSmart/types/quiz";
import { FiTarget, FiCpu } from "react-icons/fi";

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
      <div className="text-center py-10 px-4 sm:px-6 lg:px-8 ">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Chọn{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49BBBD] to-cyan-600">
            bài kiểm tra
          </span>
          <br />
          để đánh giá năng lực
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Chọn các bài kiểm tra phù hợp để đánh giá kiến thức và kỹ năng của
          bạn. Kết quả sẽ giúp hệ thống đề xuất lộ trình học tập cá nhân hóa tốt nhất.
        </p>

        {/* Info Box */}
      </div>
    </FadeTransition>
  );
};

export default QuizSelectionHeader;
