"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import {
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiHelpCircle,
} from "react-icons/fi";
import { SiQuizlet } from "react-icons/si";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiArtificialIntelligence } from "react-icons/gi";
import { MdMoreTime } from "react-icons/md";
import { Button, Collapse, message } from "antd";
import { learningPathProgress } from "EduSmart/components/LearningPath";
import { useSessionAuthStore } from "EduSmart/stores/Auth/SessionAuthStore";
import { useSurvey } from "EduSmart/hooks/survey";

const steps = [
  {
    id: 1,
    icon: <FiUser className="w-8 h-8" />,
    title: "Làm khảo sát",
    // titleColor: "text-cyan-600",
    description:
      "Thu thập thông tin cá nhân, kiến thức công nghệ và thói quen học tập của bạn",
    color: "bg-[#49BBBD]",
    lightColor: "bg-cyan-50 dark:bg-cyan-900/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
    cardBg:
      "bg-gradient-to-br from-teal-50/20 to-white dark:from-teal-900/5 dark:to-gray-800",
    lineGradient: "from-[#49BBBD] to-orange-400",
    duration: "~7 phút",
  },
  {
    id: 2,
    icon: <SiQuizlet className="w-8 h-8" />,
    title: "Làm bài đánh giá năng lực",
    // titleColor: "text-cyan-600",
    description:
      "Xác định năng lực của sinh viên để có thể lựa chọn khóa học phù hợp",
    color: "bg-orange-500",
    // lightColor: "bg-orange-50 dark:bg-orange-900/20",
    // textColor: "text-orange-500 dark:text-orange-400",
    lightColor: "bg-cyan-50 dark:bg-cyan-900/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
    cardBg:
      "bg-gradient-to-br from-orange-50/20 to-white dark:from-orange-900/5 dark:to-gray-800",
    lineGradient: "from-orange-400 to-cyan-500",
    duration: "15-20 phút",
  },
  {
    id: 3,
    icon: <FaMapLocationDot className="w-8 h-8" />,
    title: "Nhận kết quả lộ trình",
    // titleColor: "text-cyan-600",
    description:
      "AI phân tích dữ liệu và đưa ra lộ trình học tập cá nhân hóa phù hợp nhất",
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50 dark:bg-cyan-900/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
    cardBg:
      "bg-gradient-to-br from-cyan-50/20 to-white dark:from-cyan-900/5 dark:to-gray-800",
    lineGradient: "from-cyan-500 to-teal-400",
    duration: "~3 phút",
  },
];

const benefits = [
  {
    icon: <FaMapLocationDot className="w-6 h-6" />,
    title: "Lộ trình cá nhân hóa 100%",
    description:
      "AI phân tích kỹ năng, sở thích và mục tiêu của bạn để đề xuất lộ trình học tập phù hợp nhất với bản thân bạn",
    color: "text-[#49BBBD]",
    bgColor: "bg-teal-50",
    darkBgColor: "dark:bg-teal-900/20",
  },
  {
    icon: <MdMoreTime className="w-6 h-6" />,
    title: "Tiết kiệm thời gian tối đa",
    description:
      "Chỉ 25-30 phút để có lộ trình hoàn chỉnh. Không cần duyệt hàng trăm khóa học, bắt đầu học ngay với khóa học phù hợp nhất",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    darkBgColor: "dark:bg-orange-900/20",
  },
  {
    icon: <GiArtificialIntelligence className="w-6 h-6" />,
    title: "Công nghệ AI tiên tiến",
    description:
      "Hệ thống AI phân tích đa chiều dựa trên câu trả lời của bạn để đưa ra gợi ý khóa học được cá nhân hóa và tối ưu",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    darkBgColor: "dark:bg-cyan-900/20",
  },
  {
    icon: <FiRefreshCw className="w-6 h-6" />,
    title: "Linh hoạt & có thể điều chỉnh",
    description:
      "Thay đổi lộ trình khi mục tiêu thay đổi. Làm lại bài đánh giá bất cứ lúc nào. Luôn được hỗ trợ trong suốt hành trình",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    darkBgColor: "dark:bg-purple-900/20",
  },
];

const faqs = [
  {
    question: "Tôi cần chuẩn bị gì trước khi bắt đầu?",
    answer: "Bạn không cần chuẩn bị gì đặc biệt! Chỉ cần:",
    details: [
      "~35 phút thời gian rảnh",
      "Trả lời các câu hỏi một cách trung thực nhất",
      "Suy nghĩ về mục tiêu học tập của bản thân",
    ],
  },
  {
    question: "Tôi có thể làm lại bài khảo sát/đánh giá không?",
    answer: "Hoàn toàn được!",
    details: [
      "Bạn có thể làm lại bất cứ lúc nào",
      "Kết quả mới sẽ thay thế kết quả cũ",
      "Không giới hạn số lần làm lại",
    ],
  },
  {
    question: "Nếu tôi chưa có kiến thức IT có làm được không?",
    answer: "Tất nhiên rồi!",
    details: [
      "Khảo sát và bài test được thiết kế cho mọi trình độ",
      "Từ người mới bắt đầu đến người đã có kinh nghiệm",
      "Hệ thống sẽ đề xuất lộ trình phù hợp với level của bạn",
    ],
  },
  {
    question: "Tôi có thể nhận lộ trình cho nhiều mục tiêu khác nhau không?",
    answer: "Hiện tại mỗi giai đoạn, hệ thống chỉ hỗ trợ 1 lộ trình chính:",
    details: [
      "Bạn có thể thay đổi mục tiêu và làm lại",
      "Hoặc tập trung vào 1 hướng để hiệu quả tốt nhất",
      "Sau khi hoàn thành có thể khám phá hướng mới",
    ],
  },
];

export default function LearningPathOverview() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasExistingProgress, setHasExistingProgress] = useState(false);
  const { session, fetchSession } = useSessionAuthStore();
  const survey = useSurvey();

  useEffect(() => {
    // Fetch session to check authentication
    fetchSession();

    // Check if user has existing progress
    const completedSteps = learningPathProgress.getCompletedSteps();
    setHasExistingProgress(completedSteps.length > 0);
  }, [fetchSession]);

  const handleStartSurvey = () => {
    if (!session) {
      message.warning({
        content:
          "Bạn cần đăng nhập để bắt đầu khảo sát và nhận đề xuất lộ trình học tập",
        duration: 4,
      });
      setTimeout(() => {
        router.push("/Login?redirect=/learning-path/assessment/survey");
      }, 500);
      return;
    }

    console.log("🔄 Starting assessment flow - cleaning up previous data...");

    try {
      // 1. Clear all learning path progress
      learningPathProgress.clearProgress();
      console.log("✅ Learning path progress cleared");

      // 2. Reset survey store (clears survey1Data, survey2Data, survey3Data, etc.)
      survey.resetSurvey();
      console.log("✅ Survey store reset");

      // 3. Clear quiz data from localStorage
      localStorage.removeItem("quiz-store");
      console.log("✅ Quiz store cleared");

      // 4. Clear learning path progress keys
      const learningPathKeys = [
        "learning_path_current_step",
        "learning_path_completed_steps",
        "survey_completed",
        "quiz_completed",
        "learning_path_id",
      ];
      learningPathKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
      console.log("✅ Learning path keys cleared");

      // 5. Clear survey-related localStorage keys
      localStorage.removeItem("survey_data");
      localStorage.removeItem("survey_step");
      localStorage.removeItem("survey-storage");
      console.log("✅ Survey localStorage keys cleared");

      console.log(
        "✅ All previous data cleaned up successfully - ready for fresh assessment",
      );
    } catch (error) {
      console.error("Error during cleanup:", error);
    }

    // Navigate to survey assessment page
    router.push("/learning-path/assessment/survey");
  };

  return (
    <BaseScreenWhiteNav>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section - Giới thiệu */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-32">
            {/* Section Header */}
            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-16 -translate-y-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 dark:bg-cyan-900/20 rounded-full transform -translate-x-12 translate-y-12 animate-pulse delay-500"></div>
              <div className="absolute bottom-1/3 left-16 w-12 h-12 bg-teal-50 dark:bg-teal-900/10 rounded-full opacity-40 animate-pulse delay-1000"></div>

              <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                  Khám phá{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49BBBD] to-cyan-600">
                    lộ trình học tập
                  </span>
                  <br />
                  <span className="mt-1">dành riêng cho bạn</span>
                </h1>

                <div className="max-w-4xl mx-auto">
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-normal">
                    Trả lời một vài câu hỏi đơn giản, EduSmart sẽ sử dụng AI để
                    phân tích và đề xuất lộ trình học tập cá nhân hóa phù hợp
                    với mục tiêu và trình độ của bạn.
                  </p>

                  <div className="flex justify-center mb-8 mt-8">
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 px-7 py-3 rounded-full font-light border border-teal-100 dark:border-teal-800">
                      <FiClock className="w-5 h-5 mr-3" />
                      Chỉ mất tầm 25-30 phút để hoàn thành toàn bộ quy trình
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleStartSurvey}
                      className="!p-6 !bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 px-12 py-4 h-auto text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      icon={<FiArrowRight className="w-6 h-6" />}
                      iconPosition="end"
                    >
                      Khám phá ngay
                    </Button>
                  </div>
                  {/* Show continue button if has existing progress */}
                  {/* {hasExistingProgress && (
                    <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <FiCheckCircle className="w-5 h-5 text-[#49BBBD] dark:text-teal-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-teal-900 dark:text-teal-300 mb-1">
                              Bạn có tiến độ chưa hoàn thành
                            </p>
                            <p className="text-sm text-teal-700 dark:text-teal-400">
                              Tiếp tục từ nơi bạn đã dừng lại hoặc bắt đầu lại
                              từ đầu
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
                  )} */}
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
            <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-teal-100 dark:bg-teal-700 rounded-full opacity-15 animate-bounce delay-500"></div>
            <div className="absolute bottom-40 right-16 w-14 h-14 bg-orange-100 dark:bg-orange-700 rounded-full opacity-25 animate-pulse delay-1500"></div>
          </div>
        </section>

        {/* Steps Section - Quy trình */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-800/30">
          {/* Divider Wave Top */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
            <svg
              className="relative block w-full h-12 md:h-16"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-teal-50/50 dark:fill-gray-900"
              ></path>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full text-[#49BBBD] dark:text-teal-400 text-sm font-medium mb-8 border border-teal-100 dark:border-teal-800">
                3 Bước Đơn Giản
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Quy trình đơn giản
              </h2>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
                Chỉ với 3 bước đơn giản, bạn sẽ có được lộ trình học tập được cá
                nhân hóa hoàn toàn
              </p>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-20 w-16 h-16 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-32 right-32 w-24 h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
              <div className="absolute top-1/2 right-20 w-12 h-12 bg-teal-100 dark:bg-teal-700 rounded-full opacity-15 animate-bounce delay-500"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((step) => (
                <div key={step.id} className="relative">
                  <div
                    className={`relative ${step.cardBg} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2`}
                  >
                    {/* Horizontal line across the card at icon level */}
                    <div
                      className={`absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r ${step.lineGradient} opacity-20 dark:opacity-15`}
                    ></div>

                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white rounded-full flex items-center justify-center text-base font-bold shadow-lg ring-4 ring-white dark:ring-gray-900">
                      {step.id}
                    </div>

                    {/* Icon */}
                    <div
                      className={`relative z-10 ${step.lightColor} ${step.textColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {step.icon}
                    </div>

                    <h3 className={`text-2xl font-bold mb-4`}>{step.title}</h3>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Duration badge */}
                    <div
                      className={`inline-flex items-center px-3 py-1.5 ${step.lightColor} rounded-full text-sm ${step.textColor} font-medium`}
                    >
                      <FiClock className="w-4 h-4 mr-2" />
                      {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>{" "}
            {/* CTA Button after steps */}
            <div className="text-center mt-16">
              <Button
                type="primary"
                size="large"
                onClick={handleStartSurvey}
                className="!p-6 !bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 px-12 py-4 h-auto text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                icon={<FiArrowRight className="w-6 h-6" />}
                iconPosition="end"
              >
                Bắt đầu ngay
              </Button>
            </div>
          </div>

          {/* Divider Wave Bottom */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
            <svg
              className="relative block w-full h-12 md:h-16"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-teal-50/50 dark:fill-gray-900"
              ></path>
            </svg>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Accent Border Top */}
          {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#49BBBD] via-cyan-500 to-orange-400"></div> */}

          <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full text-[#49BBBD] dark:text-teal-400 text-sm font-medium mb-8 border border-teal-100 dark:border-teal-800">
                Lợi ích vượt trội
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Tại sao chọn EduSmart?
              </h2>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
                Hệ thống đề xuất lộ trình học tập thông minh giúp bạn tìm ra con
                đường phát triển phù hợp nhất
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2"
                >
                  {/* Icon */}
                  <div
                    className={`${benefit.bgColor} ${benefit.darkBgColor} ${benefit.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {benefit.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-20 h-20 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white dark:bg-gray-800/50 relative overflow-hidden">
          {/* Divider Wave Top */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
            <svg
              className="relative block w-full h-12 md:h-16"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-teal-50/50 dark:fill-gray-900"
              ></path>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 pt-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full text-[#49BBBD] dark:text-teal-400 text-sm font-medium mb-8 border border-teal-100 dark:border-teal-800">
                <FiHelpCircle className="w-4 h-4 mr-2" />
                Giải đáp thắc mắc
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Câu hỏi thường gặp
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
                Những câu hỏi phổ biến từ sinh viên về quy trình đánh giá
              </p>
            </div>

            {/* FAQ Accordion */}
            <Collapse
              accordion
              expandIconPosition="end"
              className="bg-transparent border-none"
              bordered={false}
              items={faqs.map((faq, index) => ({
                key: index.toString(),
                label: (
                  <div className="flex items-center gap-3 py-2">
                    <div className="bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                ),
                children: (
                  <div className="ml-11 pb-4">
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                      {faq.answer}
                    </p>
                    <ul className="space-y-3">
                      {faq.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start gap-3 text-base text-gray-600 dark:text-gray-400"
                        >
                          <FiCheckCircle className="w-5 h-5 text-[#49BBBD] dark:text-teal-400 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
                className:
                  "mb-4 !bg-gradient-to-br from-teal-50/30 to-white dark:from-gray-800 dark:to-gray-800/50 !rounded-2xl !border-gray-200 dark:!border-gray-700 shadow-md hover:shadow-lg transition-all duration-300",
                style: {
                  marginBottom: "16px",
                  borderRadius: "16px",
                  overflow: "hidden",
                },
              }))}
            />
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-10 w-16 h-16 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-20 h-20 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </section>
      </div>
    </BaseScreenWhiteNav>
  );
}
