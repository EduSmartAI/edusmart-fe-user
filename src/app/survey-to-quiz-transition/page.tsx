"use client";

import React from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
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
    <BaseScreenAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            
            {/* Success Animation */}
            <div className="mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <FiCheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Bạn đã hoàn thành phần khảo sát!
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Thông tin của bạn đã được ghi nhận thành công. Tiếp theo, chúng ta sẽ đánh giá 
                năng lực của bạn để có thể đưa ra lộ trình học tập phù hợp nhất.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex justify-center items-center space-x-8">
                {/* Step 1 - Completed */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <FiUser className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Khảo sát
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Hoàn thành ✓
                  </div>
                </div>

                {/* Connection Line */}
                <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 mx-4"></div>

                {/* Step 2 - Current */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3 shadow-lg animate-pulse">
                    <FiTarget className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Đánh giá năng lực
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Tiếp theo
                  </div>
                </div>

                {/* Connection Line */}
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-gray-300 dark:to-gray-600 mx-4"></div>

                {/* Step 3 - Pending */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <FiCpu className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nhận kết quả
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Chờ xử lý
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                <FiTarget className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Phần đánh giá năng lực
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                    Bạn sẽ làm một số bài quiz để đánh giá kiến thức và kỹ năng hiện tại. 
                    Điều này giúp AI có thể đề xuất lộ trình học tập phù hợp với trình độ của bạn.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              type="primary"
              size="large"
              onClick={handleContinueToQuiz}
              className="bg-gradient-to-r from-blue-600 to-green-600 border-none hover:from-blue-700 hover:to-green-700 px-12 py-4 h-auto text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              icon={<FiArrowRight className="w-6 h-6" />}
              iconPosition="end"
            >
              Tiếp tục đánh giá năng lực
            </Button>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800 opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 dark:bg-blue-800 opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
          </div>
        </div>
      </div>
    </BaseScreenAdmin>
  );
}
