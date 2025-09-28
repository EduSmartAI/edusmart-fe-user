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
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    "Đang phân tích kết quả khảo sát...",
    "Đang đánh giá năng lực từ bài quiz...",
    "AI đang xử lý dữ liệu cá nhân hóa...",
    "Đang tạo lộ trình học tập phù hợp...",
    "Hoàn tất! Chuẩn bị hiển thị kết quả..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate API processing time, then redirect to results
          setTimeout(() => {
            // router.push("/learning-path-results");
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(stepInterval);
  }, []);

  const handleViewResults = () => {
    router.push("/learning-path-results");
  };

  return (
    <BaseScreenAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            
            {/* Processing Animation */}
            <div className="mb-8">
              <div className="relative inline-flex items-center justify-center">
                {progress < 100 ? (
                  <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                    <FiLoader className="w-12 h-12 text-purple-500 animate-spin" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <FiCheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {progress < 100 ? (
                  <>🤖 AI đang xử lý dữ liệu của bạn</>
                ) : (
                  <>✨ Lộ trình học tập đã sẵn sàng!</>
                )}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {progress < 100 ? (
                  "Vui lòng chờ trong giây lát. AI đang phân tích thông tin khảo sát và kết quả đánh giá năng lực để tạo ra lộ trình học tập cá nhân hóa tốt nhất cho bạn."
                ) : (
                  "Tuyệt vời! Lộ trình học tập cá nhân hóa của bạn đã được tạo thành công. Hãy xem kết quả ngay bây giờ!"
                )}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {progress < 100 ? `Đang xử lý... ${Math.round(progress)}%` : "Hoàn thành 100%"}
              </div>
            </div>

            {/* Current Processing Step */}
            {progress < 100 && (
              <div className="mb-8">
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                  <div className="flex items-center justify-center space-x-3">
                    <FiCpu className="w-5 h-5 text-purple-500 animate-pulse" />
                    <span className="text-purple-700 dark:text-purple-300 font-medium">
                      {processingSteps[currentStep]}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>

                {/* Step 2 - Completed */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <FiTarget className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Đánh giá năng lực
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Hoàn thành ✓
                  </div>
                </div>

                {/* Connection Line */}
                <div className={`flex-1 h-0.5 mx-4 ${progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-green-500 to-purple-500'}`}></div>

                {/* Step 3 - Processing/Completed */}
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg ${
                    progress >= 100 
                      ? 'bg-green-500 text-white' 
                      : 'bg-purple-500 text-white animate-pulse'
                  }`}>
                    <FiCpu className="w-8 h-8" />
                  </div>
                  <div className={`text-sm font-medium ${
                    progress >= 100 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    Kết quả AI
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {progress >= 100 ? 'Hoàn thành ✓' : 'Đang xử lý...'}
                  </div>
                </div>
              </div>
            </div>

            {/* Time Estimate */}
            {progress < 100 && (
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="w-4 h-4" />
                  <span>Thời gian ước tính: {Math.ceil((100 - progress) / 10)} giây</span>
                </div>
              </div>
            )}

            {/* CTA Button - Only show when completed */}
            {progress >= 100 && (
              <Button
                type="primary"
                size="large"
                onClick={handleViewResults}
                className="bg-gradient-to-r from-green-600 to-purple-600 border-none hover:from-green-700 hover:to-purple-700 px-12 py-4 h-auto text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                icon={<FiArrowRight className="w-6 h-6" />}
                iconPosition="end"
              >
                Xem lộ trình của bạn
              </Button>
            )}

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-800 opacity-10 rounded-full transform translate-x-16 -translate-y-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 dark:bg-blue-800 opacity-10 rounded-full transform -translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </BaseScreenAdmin>
  );
}
