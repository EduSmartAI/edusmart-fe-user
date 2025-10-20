"use client";

import React from "react";
import {  Progress as AntProgress } from "antd";
import {
  FiUser,
  FiTarget,
  FiCpu,
  FiCheckCircle,
  FiClock,
  FiZap,
} from "react-icons/fi";

interface LearningPathProgressProps {
  currentStep: number; // 1, 2, or 3
  completedSteps?: number[];
  estimatedTime?: string;
  showTimeRemaining?: boolean;
  compact?: boolean;
  minimal?: boolean; // Ultra-minimal mode for survey/quiz pages
}

const STEPS = [
  {
    id: 1,
    title: "Khảo sát thông tin",
    description: "Thu thập thông tin",
    icon: <FiUser className="w-5 h-5" />,
    estimatedMinutes: 7,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Đánh giá năng lực",
    description: "Kiểm tra năng lực",
    icon: <FiTarget className="w-5 h-5" />,
    estimatedMinutes: 25,
    color: "green",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    title: "Kết quả lộ trình",
    description: "Nhận lộ trình",
    icon: <FiCpu className="w-5 h-5" />,
    estimatedMinutes: 3,
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function LearningPathProgress({
  currentStep,
  completedSteps = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  estimatedTime,
  showTimeRemaining = true,
  compact = false,
  minimal = false,
}: LearningPathProgressProps) {
  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return "finish";
    if (stepId === currentStep) return "process";
    return "wait";
  };

  const calculateProgress = () => {
    const totalSteps = STEPS.length;
    const completed = completedSteps.length;
    return Math.round((completed / totalSteps) * 100);
  };

  const getTotalEstimatedTime = () => {
    return STEPS.reduce((sum, step) => sum + step.estimatedMinutes, 0);
  };

  const getRemainingTime = () => {
    // Return estimated time for current step only
    const currentStepData = STEPS.find((step) => step.id === currentStep);
    return currentStepData?.estimatedMinutes || 0;
  };

  // Minimal mode - Ultra simple for survey/quiz pages
  if (minimal) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const progress = calculateProgress();
    const currentStepData = STEPS[currentStep - 1];

    return (
      //   <div className="bg-gradient-to-r from-teal-50/30 via-white to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-teal-100 dark:border-gray-700 py-4 px-4 shadow-sm">
      <div className="bg-white/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900   dark:border-gray-700 py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Left: Step Info */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Step Counter with Accent */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#49BBBD] to-cyan-600 px-5 py-3 rounded-lg shadow-md">
                {/* <div className="flex items-center gap-2 bg-gradient-to-r from-orange-300 to-orange-500 px-5 py-3 rounded-lg shadow-md"> */}
                <span className="text-md font-black text-white whitespace-nowrap">
                  Bước {currentStep}
                </span>
                <span className="text-white/60 font-bold">–</span>
                <span className="text-md font-semibold text-white/90 whitespace-nowrap">
                  {currentStepData?.title}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Time with Icon */}
          {showTimeRemaining && (
            // <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/30 px-3 py-1.5 rounded-lg border border-orange-100 dark:border-orange-800 shadow-sm">
            //   <FiClock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            //   <span className="text-sm font-bold text-orange-700 dark:text-orange-300 whitespace-nowrap">
            //     ~{getRemainingTime()} phút
            //   </span>
            // </div>
            <div className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/30 px-3 py-1.5 rounded-lg border border-cyan-100 dark:border-cyan-800 shadow-sm">
              {" "}
              <FiClock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />{" "}
              <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300 whitespace-nowrap">
                {" "}
                ~{getRemainingTime()} phút{" "}
              </span>{" "}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (compact) {
    const currentStepData = STEPS[currentStep - 1];
    const progress = calculateProgress();

    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-5 shadow-lg border-2 border-blue-100 dark:border-gray-700 backdrop-blur-sm">
        {/* Animated Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

        <div className="relative z-10">
          {/* Header with Icons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentStepData?.gradient} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}
              >
                {currentStepData?.icon &&
                  React.cloneElement(currentStepData.icon, {
                    className: "w-5 h-5 text-white",
                  })}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    Bước {currentStep}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {STEPS.length}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {currentStepData?.title}
                </p>
              </div>
            </div>

            {showTimeRemaining && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full">
                <FiClock className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-pulse" />
                <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                  ~{getRemainingTime()}p
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="relative">
            <AntProgress
              percent={progress}
              showInfo={false}
              strokeColor={{
                "0%": "#3b82f6",
                "50%": "#8b5cf6",
                "100%": "#ec4899",
              }}
              trailColor="#e5e7eb"
              strokeWidth={8}
              className="mb-2"
            />
            {/* Progress Percentage Badge */}
            <div className="absolute -top-1 right-0">
              <div className="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">
                {progress}%
              </div>
            </div>
          </div>

          {/* Step Info */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {currentStepData?.description}
            </span>
            <div className="flex items-center space-x-1">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    completedSteps.includes(step.id)
                      ? "bg-green-500 w-3"
                      : step.id === currentStep
                        ? "bg-blue-500 animate-pulse"
                        : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-gray-800 dark:via-gray-800/95 dark:to-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-blue-100/50 dark:border-gray-700">
      {/* Animated Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
              <FiZap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                Tiến độ của bạn
              </h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {completedSteps.length}
                </span>
                <span className="mx-1">/</span>
                <span>{STEPS.length} bước hoàn thành</span>
              </p>
            </div>
          </div>

          {showTimeRemaining && (
            <div className="mt-4 md:mt-0 inline-flex items-center px-5 py-3 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/40 dark:via-amber-900/40 dark:to-yellow-900/40 rounded-2xl shadow-lg border border-orange-200 dark:border-orange-800">
              <FiClock className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3 animate-pulse" />
              <div>
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Thời gian còn lại
                </div>
                <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  ~{getRemainingTime()} phút
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Progress Bar with Glow Effect */}
        <div className="mb-10 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Tiến độ tổng thể
            </span>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {calculateProgress()}%
            </span>
          </div>

          <div className="relative">
            <AntProgress
              percent={calculateProgress()}
              showInfo={false}
              strokeColor={{
                "0%": "#3b82f6",
                "50%": "#8b5cf6",
                "100%": "#ec4899",
              }}
              trailColor="#e5e7eb"
              strokeWidth={16}
              className="learning-path-progress-bar"
            />
            {/* Glow effect underneath */}
            <div className="absolute inset-0 blur-xl opacity-30">
              <AntProgress
                percent={calculateProgress()}
                showInfo={false}
                strokeColor={{
                  "0%": "#3b82f6",
                  "50%": "#8b5cf6",
                  "100%": "#ec4899",
                }}
                trailColor="transparent"
                strokeWidth={16}
              />
            </div>
          </div>
        </div>

        {/* Steps as Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {STEPS.map((step) => {
            const status = getStepStatus(step.id);
            const isCompleted = status === "finish";
            const isCurrent = status === "process";

            return (
              <div
                key={step.id}
                className={`relative group ${
                  isCurrent
                    ? "ring-4 ring-blue-500 ring-opacity-50 transform scale-105"
                    : ""
                } ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                    : isCurrent
                      ? "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                      : "bg-gray-50 dark:bg-gray-700/30"
                } rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border-2 ${
                  isCompleted
                    ? "border-green-200 dark:border-green-800"
                    : isCurrent
                      ? "border-blue-200 dark:border-blue-800"
                      : "border-gray-200 dark:border-gray-600"
                }`}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : isCurrent
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white animate-pulse"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {step.id}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 group-hover:scale-110"
                      : isCurrent
                        ? `bg-gradient-to-br ${step.gradient} group-hover:scale-110 animate-pulse`
                        : "bg-gray-300 dark:bg-gray-600 group-hover:scale-105"
                  }`}
                >
                  {isCompleted ? (
                    <FiCheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    React.cloneElement(step.icon, {
                      className: "w-8 h-8 text-white",
                    })
                  )}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h4
                    className={`text-lg font-bold mb-2 ${
                      isCompleted || isCurrent
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h4>

                  <p
                    className={`text-sm mb-3 ${
                      isCompleted || isCurrent
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-500 dark:text-gray-500"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Time Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      isCompleted
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                        : isCurrent
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <FiClock className="w-3 h-3 mr-1" />
                    {isCompleted
                      ? "Hoàn thành"
                      : `~${step.estimatedMinutes} phút`}
                  </div>
                </div>

                {/* Current Step Indicator */}
                {isCurrent && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                      Đang thực hiện
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Estimated Total Time (shown at start) */}
        {completedSteps.length === 0 && (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80 animate-pulse"></div>
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <FiZap className="w-6 h-6 text-white animate-pulse" />
              <p className="text-lg font-bold text-white">
                Tổng thời gian: ~{getTotalEstimatedTime()} phút để hoàn thành
                toàn bộ
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
