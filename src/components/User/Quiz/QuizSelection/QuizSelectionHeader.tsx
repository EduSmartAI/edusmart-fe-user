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
      <div className="mb-12">
        <div className="text-center mb-8">
          {/* AI Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-6">
            <FiTarget className="w-4 h-4 mr-2" />
            Đánh giá năng lực
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Chọn{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              bài quiz
            </span>
            <br />
            để đánh giá năng lực
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Chọn các bài quiz phù hợp để đánh giá kiến thức và kỹ năng của bạn. 
            Kết quả sẽ giúp AI đề xuất lộ trình học tập cá nhân hóa tốt nhất.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-start space-x-4">
              <FiCpu className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Lưu ý quan trọng
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                  Bạn có thể chọn nhiều quiz cùng lúc hoặc làm từng quiz riêng lẻ. 
                  Hãy chọn ít nhất một quiz để bắt đầu đánh giá năng lực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeTransition>
  );
};

export default QuizSelectionHeader;
