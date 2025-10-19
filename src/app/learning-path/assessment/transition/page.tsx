"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import {
  FiCheckCircle,
  FiArrowRight,
  FiAward,
  FiUser,
} from "react-icons/fi";
import { SiQuizlet } from "react-icons/si";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiArtificialIntelligence } from "react-icons/gi";
import { MdMoreTime } from "react-icons/md";
import {
  LearningPathGuard,
  learningPathProgress,
} from "EduSmart/components/LearningPath";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";

export default function SurveyToQuizTransition() {
  const router = useRouter();

  const handleContinueToQuiz = () => {
    router.push("/learning-path/assessment/quiz");
  };

  return (
    <LearningPathGuard requiredStep={1} requiredCompletedSteps={[1]}>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Progress Header - Minimal Mode */}
        <div className="sticky top-0 z-10">
          <LearningPathProgress
            currentStep={2}
            completedSteps={[1]}
            minimal={true}
            showTimeRemaining={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Main Card with subtle celebration */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Decorative elements - minimal */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-16 -translate-y-16 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 dark:bg-cyan-900/20 rounded-full transform -translate-x-12 translate-y-12 opacity-40"></div>

              <div className="relative z-10">
                {/* Success Icon with subtle animation */}
                <div className="text-center mb-8">
                  <div className="inline-block relative">
                    {/* Animated ring */}
                    <div className="absolute inset-0 animate-ping opacity-20">
                      <div className="w-20 h-20 border-4 border-green-500 rounded-full"></div>
                    </div>

                    {/* Main icon */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <FiCheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Main Message */}
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                    Xuất sắc! Bạn đã hoàn thành khảo sát
                  </h1>

                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    Thông tin của bạn đã được ghi nhận. Bước tiếp theo, chúng ta
                    sẽ đánh giá năng lực để đề xuất lộ trình phù hợp nhất.
                  </p>
                </div>

                {/* Progress Indicator - Clean Timeline */}
                <div className="mb-10">
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-[#49BBBD] to-gray-300 dark:to-gray-600"></div>

                    {/* Steps */}
                    <div className="relative flex justify-between items-start">
                      {/* Step 1 - Completed */}
                      <div className="flex flex-col items-center w-1/3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-md z-10">
                          <FiUser className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">
                            Khảo sát
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Hoàn thành ✓
                          </div>
                        </div>
                      </div>

                      {/* Step 2 - Current */}
                      <div className="flex flex-col items-center w-1/3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#49BBBD] to-cyan-600 rounded-full flex items-center justify-center mb-3 shadow-lg z-10 animate-pulse">
                          <SiQuizlet className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-[#49BBBD] dark:text-teal-400 mb-1">
                            Đánh giá năng lực
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Tiếp theo
                          </div>
                        </div>
                      </div>

                      {/* Step 3 - Pending */}
                      <div className="flex flex-col items-center w-1/3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-3 shadow-sm z-10">
                          <FaMapLocationDot className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-1">
                            Kết quả
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Chờ xử lý
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivation Box - Minimal */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 mb-8 border border-teal-100 dark:border-teal-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#49BBBD] to-cyan-600 rounded-lg flex items-center justify-center">
                        <FiAward className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          Bạn đang tiến rất tốt!
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Đã hoàn thành 1/3 hành trình
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#49BBBD] to-cyan-600">
                      33%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-2 bg-white dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-[#49BBBD] to-cyan-600 rounded-full transition-all duration-1000"></div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleContinueToQuiz}
                    className="!p-6 !bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 px-12 py-4 h-auto text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    icon={<FiArrowRight className="w-6 h-6 ml-2" />}
                    iconPosition="end"
                  >
                    Sẵn sàng cho thử thách tiếp theo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration - subtle */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-teal-200 dark:bg-teal-800 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-10 animate-pulse delay-2000"></div>
        </div>
      </div>
    </LearningPathGuard>
  );
}
