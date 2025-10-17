"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import {
  FiUser,
  FiTarget,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiCpu,
  FiClock,
} from "react-icons/fi";
import { Button } from "antd";
import { learningPathProgress } from "EduSmart/components/LearningPath";

const steps = [
  {
    id: 1,
    icon: <FiUser className="w-8 h-8" />,
    title: "Làm khảo sát",
    description:
      "Thu thập thông tin cá nhân, kiến thức công nghệ và thói quen học tập của bạn",
    color: "bg-blue-500",
    lightColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
    duration: "5-7 phút",
  },
  {
    id: 2,
    icon: <FiTarget className="w-8 h-8" />,
    title: "Làm bài đánh giá năng lực",
    description:
      "Xác định năng lực của sinh viên để có thể lựa chọn khóa học phù hợp",
    color: "bg-green-500",
    lightColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600 dark:text-green-400",
    duration: "10-15 phút",
  },
  {
    id: 3,
    icon: <FiCpu className="w-8 h-8" />,
    title: "Nhận kết quả lộ trình",
    description:
      "AI phân tích dữ liệu và đưa ra lộ trình học tập cá nhân hóa phù hợp nhất",
    color: "bg-purple-500",
    lightColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
    duration: "2-3 phút",
  },
];

const benefits = [
  {
    icon: <FiTarget className="w-6 h-6" />,
    title: "Lộ trình cá nhân hóa",
    description: "Nhận được đề xuất khóa học phù hợp với mục tiêu và trình độ",
  },
  {
    icon: <FiCpu className="w-6 h-6" />,
    title: "AI thông minh",
    description: "Công nghệ AI phân tích và đưa ra gợi ý tối ưu cho bạn",
  },
  {
    icon: <FiStar className="w-6 h-6" />,
    title: "Tiết kiệm thời gian",
    description: "Không còn phải tìm kiếm khóa học phù hợp một cách mù quáng",
  },
];

export default function LearningPathOverview() {
  const router = useRouter();
  const [hasExistingProgress, setHasExistingProgress] = useState(false);

  useEffect(() => {
    // Check if user has existing progress
    const completedSteps = learningPathProgress.getCompletedSteps();
    setHasExistingProgress(completedSteps.length > 0);
  }, []);

  const handleStartSurvey = () => {
    // Clear any existing progress to start fresh
    learningPathProgress.clearProgress();
    router.push("/learning-path/assessment/survey");
  };

  const handleContinue = () => {
    const currentStep = learningPathProgress.getCurrentStep();
    const completedSteps = learningPathProgress.getCompletedSteps();

    // Redirect to appropriate page based on progress
    if (completedSteps.includes(1) && !completedSteps.includes(2)) {
      router.push("/learning-path/assessment/quiz");
    } else if (completedSteps.includes(2)) {
      const learningPathId = learningPathProgress.getLearningPathId();
      if (learningPathId) {
        router.push(`/dashboard/learning-paths/${learningPathId}`);
      } else {
        router.push("/learning-path/assessment/quiz");
      }
    } else {
      router.push("/learning-path/assessment/survey");
    }
  };

  return (
    <BaseScreenWhiteNav>
         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section - Giới thiệu */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-24">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
              <FiCpu className="w-4 h-4 mr-2" />
              Lộ trình cá nhân hóa bởi AI
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full transform -translate-x-12 translate-y-12"></div>

            <div className="relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                Khám phá{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  lộ trình học tập
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 dark:text-gray-300">
                  dành riêng cho bạn
                </span>
              </h1>

              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-medium">
                  Trả lời một vài câu hỏi đơn giản, EduSmart sẽ sử dụng AI để
                  phân tích và đề xuất lộ trình học tập cá nhân hóa phù hợp với
                  mục tiêu và trình độ của bạn.
                </p>

                <div className="flex justify-center mb-8">
                  <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-full text-green-600 dark:text-green-400 font-medium">
                    <FiClock className="w-5 h-5 mr-3" />
                    Chỉ mất 15-20 phút để hoàn thành toàn bộ quy trình
                  </div>
                </div>

                {/* Show continue button if has existing progress */}
                {hasExistingProgress && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                            Bạn có tiến độ chưa hoàn thành
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            Tiếp tục từ nơi bạn đã dừng lại hoặc bắt đầu lại từ đầu
                          </p>
                        </div>
                      </div>
                      <Button
                        type="default"
                        onClick={handleContinue}
                        className="whitespace-nowrap"
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Steps Section - Quy trình */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            {/* <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-8">
                <FiTarget className="w-4 h-4 mr-2" />
                3 Bước Đơn Giản
              </div> */}

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Quy trình đơn giản
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Chỉ với 3 bước đơn giản, bạn sẽ có được lộ trình học tập được cá
              nhân hóa hoàn toàn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 z-0 transform translate-x-4"></div>
                )}

                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div
                    className={`${step.lightColor} ${step.textColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {step.description}
                  </p>

                  {/* Duration badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                    <FiClock className="w-4 h-4 mr-2" />
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button after steps */}
          <div className="text-center mt-16">
            <Button
              type="primary"
              size="large"
              onClick={handleStartSurvey}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 px-12 py-4 h-auto text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              icon={<FiArrowRight className="w-6 h-6" />}
              iconPosition="end"
            >
              Bắt đầu ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {/* <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tại sao chọn EduSmart?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Hệ thống AI thông minh giúp bạn tìm ra con đường học tập hiệu quả nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}
    </div>
    </BaseScreenWhiteNav>
   
  );
}
