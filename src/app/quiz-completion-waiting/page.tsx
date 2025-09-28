"use client";

import React, { useEffect, useState } from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { 
  FiCpu, 
  FiLoader,
  FiCheckCircle,
  FiTarget,
  FiUser,
  FiArrowRight,
  FiClock
} from "react-icons/fi";

export default function QuizCompletionWaiting() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleViewResults = () => {
    router.push("/learning-path-results");
  };

  return (
    <BaseScreenAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          
          {/* Processing Icon */}
          <div className="mb-8">
            {!isCompleted ? (
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiLoader className="w-10 h-10 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-10 h-10 text-green-500" />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
              {!isCompleted ? (
                <>🤖 AI đang xử lý dữ liệu của bạn</>
              ) : (
                <>✨ Lộ trình học tập đã sẵn sàng!</>
              )}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              {!isCompleted ? (
                "Vui lòng chờ trong giây lát. AI đang phân tích thông tin khảo sát và kết quả đánh giá năng lực để tạo ra lộ trình học tập cá nhân hóa tốt nhất cho bạn."
              ) : (
                "Tuyệt vời! Lộ trình học tập cá nhân hóa của bạn đã được tạo thành công. Hãy xem kết quả ngay bây giờ!"
              )}
            </p>
          </div>

          {/* Simple Progress Steps */}
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

              {/* Step 2 - Completed */}
              <div className="text-center w-24">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 mx-auto">
                  <FiTarget className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                  Đánh giá năng lực
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Hoàn thành ✓
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center pt-6">
                <FiArrowRight className={`w-6 h-6 ${isCompleted ? 'text-gray-400' : 'text-gray-300'}`} />
              </div>

              {/* Step 3 - Processing/Completed */}
              <div className="text-center w-24">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  <FiCpu className="w-6 h-6" />
                </div>
                <div className={`text-sm font-medium mb-1 ${
                  isCompleted 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-purple-600 dark:text-purple-400'
                }`}>
                  Kết quả AI
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {isCompleted ? 'Hoàn thành ✓' : 'Đang xử lý...'}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Only show when completed */}
          {isCompleted && (
            <Button
              type="primary"
              size="large"
              onClick={handleViewResults}
              className="bg-gradient-to-r from-green-600 to-purple-600 border-none hover:from-green-700 hover:to-purple-700 px-8 py-3 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              icon={<FiArrowRight className="w-5 h-5" />}
              iconPosition="end"
            >
              Xem lộ trình của bạn
            </Button>
          )}

        </div>
      </div>
    </BaseScreenAdmin>
  );
}
