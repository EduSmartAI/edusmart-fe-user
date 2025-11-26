"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, message, Spin } from "antd";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { SiQuizlet } from "react-icons/si";
import { HiDocumentText } from "react-icons/hi";
import { LearningPathGuard } from "EduSmart/components/LearningPath";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";
import { useSurveyStore } from "EduSmart/stores/Survey/SurveyStore";
import { createLearningPathFromTranscriptAction } from "EduSmart/app/(learning-path)/learningPathAction";

export default function SurveyToQuizTransition() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    "quiz" | "transcript" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const survey1Data = useSurveyStore((s) => s.survey1Data);

  const handleContinueToQuiz = () => {
    router.push("/learning-path/assessment/quiz");
  };

  const handleUseTranscript = async () => {
    if (!survey1Data?.learningGoal) {
      message.error("Không tìm thấy thông tin mục tiêu học tập");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call server action to create learning path from transcript
      const result = await createLearningPathFromTranscriptAction(
        survey1Data.learningGoal,
      );

      if (!result.ok) {
        message.error(result.error || "Không thể tạo lộ trình từ bảng điểm");
        return;
      }

      // Success case
      message.success("Đang tạo lộ trình học tập từ bảng điểm...");
      // Redirect to processing page with learningPathId
      router.push(
        `/learning-path/assessment/processing?learningPathId=${result.learningPathId}`,
      );
    } catch (error) {
      console.error("Error creating learning path from transcript:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmChoice = () => {
    if (selectedOption === "quiz") {
      handleContinueToQuiz();
    } else if (selectedOption === "transcript") {
      handleUseTranscript();
    }
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
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Decorative elements - minimal */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-16 -translate-y-16 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 dark:bg-cyan-900/20 rounded-full transform -translate-x-12 translate-y-12 opacity-40"></div>

              <div className="relative z-10">
                {/* Success Icon with subtle animation */}
                <div className="text-center mb-8">
                  <div className="inline-block relative">
                    {/* Main icon */}
                    <div className="relative w-18 h-18 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <FiCheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Main Message */}
                <div className="text-center mb-10">
                  <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                    Xuất sắc! Bạn đã hoàn thành khảo sát
                  </h1>

                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-2">
                    Thông tin của bạn đã được ghi nhận. Bây giờ, hãy chọn cách
                    bạn muốn tiếp tục:
                  </p>
                  {/* <p className="text-base text-gray-500 dark:text-gray-400">
                    Bạn có thể sử dụng bảng điểm hiện có hoặc làm bài đánh giá
                    năng lực
                  </p> */}
                </div>

                {/* Choice Cards */}
                <div className="grid md:grid-cols-2 gap-5 mb-8 max-w-4xl mx-auto">
                  {/* Option 1: Use Transcript */}
                  <Card
                    className={`relative cursor-pointer transition-all duration-200 ${
                      selectedOption === "transcript"
                        ? "border-2 border-[#49BBBD] shadow-sm"
                        : "border border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedOption("transcript")}
                  >
                    <div className="text-center p-5">
                      {/* Icon */}
                      <div className="mb-4">
                        <div
                          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200 ${
                            selectedOption === "transcript"
                              ? "bg-[#49BBBD]"
                              : "bg-teal-100 dark:bg-teal-900/30"
                          }`}
                        >
                          <HiDocumentText
                            className={`w-8 h-8 ${
                              selectedOption === "transcript"
                                ? "text-white"
                                : "text-[#49BBBD]"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Sử dụng bảng điểm
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        Hệ thống sẽ phân tích bảng điểm của bạn để đánh giá năng
                        lực và đề xuất lộ trình phù hợp
                      </p>

                      {/* Benefits */}
                      {/* <div className="space-y-2 text-left">
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Nhanh chóng
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Chỉ mất ~1 phút
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Dựa trên thành tích
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Phân tích từ điểm số thực tế
                          </div>
                        </div>
                      </div> */}

                      {/* Selected Badge */}
                      {selectedOption === "transcript" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Option 2: Take Quiz */}
                  <Card
                    className={`relative cursor-pointer transition-all duration-200 ${
                      selectedOption === "quiz"
                        ? "border-2 border-orange-500 shadow-sm"
                        : "border border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedOption("quiz")}
                  >
                    <div className="text-center p-5">
                      {/* Icon */}
                      <div className="mb-4">
                        <div
                          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200 ${
                            selectedOption === "quiz"
                              ? "bg-orange-500"
                              : "bg-orange-100 dark:bg-orange-900/30"
                          }`}
                        >
                          <SiQuizlet
                            className={`w-8 h-8 ${
                              selectedOption === "quiz"
                                ? "text-white"
                                : "text-orange-600"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Làm bài đánh giá
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        Làm bài test đánh giá năng lực để hệ thống có thể đề
                        xuất lộ trình chính xác nhất
                      </p>

                      {/* Benefits */}
                      {/* <div className="space-y-2 text-left">
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Chính xác cao
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Đánh giá toàn diện năng lực
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Thời gian
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Khoảng 15-20 phút
                          </div>
                        </div>
                      </div> */}

                      {/* Selected Badge */}
                      {selectedOption === "quiz" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleConfirmChoice}
                    disabled={!selectedOption || isSubmitting}
                    className="!p-6 !bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 px-12 py-4 h-auto text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    icon={
                      isSubmitting ? (
                        <Spin size="small" />
                      ) : (
                        <FiArrowRight className="w-6 h-6 ml-2" />
                      )
                    }
                    iconPosition="end"
                  >
                    {isSubmitting
                      ? "Đang xử lý..."
                      : selectedOption
                        ? "Tiếp tục"
                        : "Chọn một phương án"}
                  </Button>

                  {/* {selectedOption && !isSubmitting && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      {selectedOption === "transcript"
                        ? "Bạn đã chọn sử dụng bảng điểm"
                        : "Bạn đã chọn làm bài đánh giá năng lực"}
                    </p>
                  )} */}
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
