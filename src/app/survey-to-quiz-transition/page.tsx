"use client";

import React from "react";
import LearningPathLayout from "EduSmart/layout/LearningPathLayout";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { 
  FiCheckCircle, 
  FiArrowRight,
  FiTarget,
  FiUser,
  FiCpu
} from "react-icons/fi";

export default function SurveyToQuizTransition() {
  const router = useRouter();

  const handleContinueToQuiz = () => {
    router.push("/quiz");
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

        {/* Main Content */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
            Bạn đã hoàn thành phần khảo sát!
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Thông tin của bạn đã được ghi nhận thành công. Tiếp theo, chúng ta
            sẽ đánh giá năng lực của bạn để có thể đưa ra lộ trình học tập phù
            hợp nhất.
          </p>
        </div>

        {/* Simple Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-center items-start space-x-12">
            {/* Step 1 - Completed */}
            <div className="text-center w-24">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 mx-auto">
                <FiUser className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                Khảo sát
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Hoàn thành ✓
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center pt-6">
              <FiArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* Step 2 - Current */}
            <div className="text-center w-24">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3 mx-auto">
                <FiTarget className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Đánh giá năng lực
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Tiếp theo
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center pt-6">
              <FiArrowRight className="w-6 h-6 text-gray-300" />
            </div>

            {/* Step 3 - Pending */}
            <div className="text-center w-24">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center mb-3 mx-auto">
                <FiCpu className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Nhận kết quả
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Chờ xử lý
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          type="primary"
          size="large"
          onClick={handleContinueToQuiz}
          className="bg-gradient-to-r from-blue-600 to-green-600 border-none hover:from-blue-700 hover:to-green-700 px-8 py-3 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          icon={<FiArrowRight className="w-5 h-5" />}
          iconPosition="end"
        >
          Tiếp tục đánh giá năng lực
        </Button>

        </div>
      </div>
  );
}
