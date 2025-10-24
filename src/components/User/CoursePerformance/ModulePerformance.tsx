"use client";

import React from "react";
import { Card, Progress, Tag, Row, Col, Statistic, Divider } from "antd";
import {
  FiLayers,
  FiPlay,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiEye,
  FiRotateCcw,
  FiAward,
  FiAlertTriangle,
  FiCpu,
  FiActivity,
  FiBookOpen,
} from "react-icons/fi";

interface ModulePerformanceProps {
  courseId: string;
}

// Mock data cho modules - Match API response structure
const mockModulesData = [
  {
    moduleId: "dafd86b4-bc91-46ee-bde7-5460dd9f7bb2",
    moduleName: "Updated 05 Introduction",
    positionIndex: 1,
    level: 2,
    isCore: true,
    description: "Overview & environment setup",
    status: "NotStarted",
    lessonsVideoTotal: 3,
    lessonsCompleted: 0,
    percentCompleted: 0,
    lessonsInProgress: 0,
    moduleDurationMinutes: 80,
    actualStudyMinutes: 0,
    moduleQuizCount: 1,
    lessonQuizCount: 2,
    totalQuizCount: 3,
    averageQuizScore: 100,
    aiScore: 100,
    aiFeedbackSummary: "Kết quả làm bài tốt, đạt được điểm số cao.",
    aiStrengths: [
      "Có kiến thức tốt về các thành phần cốt lõi của ASP.NET Core",
      "Hiểu rõ về các phương thức HTTP và ứng dụng của chúng",
    ],
    aiImprovements: [
      "Cần phát triển thêm kỹ năng phân tích và đánh giá thông tin",
      "Nên tìm hiểu thêm về các công nghệ và framework khác liên quan đến phát triển web",
      "Cần cải thiện khả năng giải quyết vấn đề và tư duy logic",
    ],
    startedAtUtc: null,
    completedAtUtc: null,
    updatedAtUtc: "2025-10-03T18:03:20.27936Z",
  },
  {
    moduleId: "ea3fcae1-d2a4-4578-b1c4-cd1d639ea99a",
    moduleName: "05 Web API Basics Updated",
    positionIndex: 2,
    level: 2,
    isCore: true,
    description: "Updated Controllers, Dependency Injection, EF Core",
    status: "NotStarted",
    lessonsVideoTotal: 3,
    lessonsCompleted: 0,
    percentCompleted: 0,
    lessonsInProgress: 0,
    moduleDurationMinutes: 140,
    actualStudyMinutes: 0,
    moduleQuizCount: 0,
    lessonQuizCount: 0,
    totalQuizCount: 0,
    averageQuizScore: null,
    aiScore: null,
    aiFeedbackSummary: null,
    aiStrengths: null,
    aiImprovements: null,
    startedAtUtc: null,
    completedAtUtc: null,
    updatedAtUtc: "2025-10-03T18:03:20.27936Z",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "success";
    case "InProgress":
      return "processing";
    case "NotStarted":
      return "default";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Completed":
      return "Hoàn thành";
    case "InProgress":
      return "Đang học";
    case "NotStarted":
      return "Chưa bắt đầu";
    default:
      return status;
  }
};


const ModulePerformance: React.FC<ModulePerformanceProps> = ({ courseId }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Hiệu suất và Đánh giá theo Module
        </h2> */}
        <p className="text-gray-600 dark:text-gray-400">
          Phân tích chi tiết tiến độ, kết quả và hành vi học tập của từng module
          trong khóa học
        </p>
      </div>

      {/* Modules List - Linear Layout */}
      <div className="flex flex-col gap-6">
        {mockModulesData.map((module, index) => (
          <Card key={module.moduleId} className="border-0 shadow-sm">
            {/* Module Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-xl shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiLayers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {module.moduleName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-blue-100">
                      <span className="flex items-center space-x-1">
                        <FiPlay className="w-4 h-4" />
                        <span>{module.lessonsVideoTotal} video</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiFileText className="w-4 h-4" />
                        <span>{module.totalQuizCount} quiz</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{Math.round(module.moduleDurationMinutes / 60)} giờ {module.moduleDurationMinutes % 60} phút</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-white font-medium text-sm">
                    {getStatusLabel(module.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-slate-50 dark:bg-slate-800 from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Tiến độ hoàn thành
                </span>
                {module.percentCompleted === 100 && (
                  <span className="text-xl font-bold text-green-900 dark:text-green-100">
                    {module.percentCompleted}%
                  </span>
                )}
              </div>
              <Progress
                percent={module.percentCompleted}
                strokeColor={{
                  "0%": "#10b981",
                  "100%": "#059669",
                }}
                trailColor="#d1fae5"
                strokeWidth={8}
                className="mb-1"
              />
            </div>

            {/* Performance Metrics - Minimal */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Hiệu suất học tập
              </h4>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {module.averageQuizScore !== null ? module.averageQuizScore : "—"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    /100
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Điểm TB Quiz
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {module.lessonsCompleted}/{module.lessonsVideoTotal}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    bài
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Video hoàn thành
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {module.totalQuizCount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    bài
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Tổng Quiz
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {Math.round(module.actualStudyMinutes / 60)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    giờ
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Thời gian học
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Mô tả
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-right">
                    {module.description}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Cấp độ
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    Level {module.level}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Assessment */}
            {module.aiFeedbackSummary && (
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                  <FiCpu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span>Nhận định của AI</span>
                </h4>

                {/* AI Score */}
                {module.aiScore !== null && (
                  <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Điểm đánh giá AI
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {module.aiScore}/100
                      </span>
                    </div>
                  </div>
                )}

                {/* Feedback Summary */}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {module.aiFeedbackSummary}
                </p>

                {/* Strengths */}
                {module.aiStrengths && module.aiStrengths.length > 0 && (
                  <div className="border-l-4 border-emerald-500 pl-4 bg-white dark:bg-slate-900 p-3 rounded-r-lg mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiTrendingUp className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Điểm nổi bật
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {module.aiStrengths.map((strength, idx) => (
                        <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start">
                          <span className="text-emerald-600 dark:text-emerald-400 mr-2 font-bold">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {module.aiImprovements && module.aiImprovements.length > 0 && (
                  <div className="border-l-4 border-amber-500 pl-4 bg-white dark:bg-slate-900 p-3 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiTrendingDown className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        Cần cải thiện
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {module.aiImprovements.map((improvement, idx) => (
                        <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start">
                          <span className="text-amber-600 dark:text-amber-400 mr-2 font-bold">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModulePerformance;
