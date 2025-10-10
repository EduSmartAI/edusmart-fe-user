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

// Mock data cho modules
const mockModulesData = [
  {
    id: "module-1",
    name: "Module 1: React Fundamentals",
    videoCount: 12,
    quizCount: 3,
    estimatedDuration: "4 giờ 30 phút",
    completionRate: 100,
    status: "Hoàn thành",
    performance: {
      averageQuizScore: 8.5,
      correctAnswerRate: 85,
      retakeCount: 1,
      actualStudyTime: "5 giờ 15 phút",
      videoCompletionRate: 100,
      interactionLevel: "Cao",
    },
    aiAssessment: {
      overallComment:
        "Bạn hoàn thành module 1 với hiệu suất xuất sắc (100%). Nắm vững các khái niệm cơ bản về React và JSX.",
      strengths: [
        {
          skill: "JSX Syntax",
          suggestion: "Tiếp tục áp dụng JSX trong các dự án thực tế",
        },
      ],
      improvements: [
        {
          skill: "Component Lifecycle",
          suggestion: "Xem lại video về useEffect và thực hành thêm",
        },
      ],
    },
  },
  {
    id: "module-2",
    name: "Module 2: State Management & Hooks",
    videoCount: 18,
    quizCount: 4,
    estimatedDuration: "6 giờ 45 phút",
    completionRate: 85,
    status: "Đang học",
    performance: {
      averageQuizScore: 7.2,
      correctAnswerRate: 72,
      retakeCount: 2,
      actualStudyTime: "7 giờ 30 phút",
      videoCompletionRate: 89,
      interactionLevel: "Trung bình",
    },
    aiAssessment: {
      overallComment:
        "Bạn hoàn thành module 2 với hiệu suất tốt (85%). Tuy nhiên, bạn gặp khó ở phần 'Custom Hooks' — điểm quiz thấp hơn trung bình lớp 20%.",
      strengths: [
        {
          skill: "useState Hook",
          suggestion: "Kỹ năng tốt, có thể hướng dẫn bạn khác",
        },
      ],
      improvements: [
        {
          skill: "Custom Hooks",
          suggestion: "Làm thêm bài tập thực hành và xem video hướng dẫn",
        },
      ],
    },
  },
  {
    id: "module-3",
    name: "Module 3: Advanced Patterns & Performance",
    videoCount: 15,
    quizCount: 3,
    estimatedDuration: "5 giờ 20 phút",
    completionRate: 60,
    status: "Đang học",
    performance: {
      averageQuizScore: 6.8,
      correctAnswerRate: 68,
      retakeCount: 3,
      actualStudyTime: "4 giờ 45 phút",
      videoCompletionRate: 73,
      interactionLevel: "Thấp",
    },
    aiAssessment: {
      overallComment:
        "Module 3 đang trong quá trình học. Cần tập trung hơn vào phần Performance Optimization để đạt hiệu quả tốt hơn.",
      strengths: [
        {
          skill: "React.memo",
          suggestion: "Áp dụng vào dự án cá nhân để củng cố",
        },
      ],
      improvements: [
        {
          skill: "useMemo & useCallback",
          suggestion: "Xem lại video và làm quiz bổ sung",
        },
      ],
    },
  },
  {
    id: "module-4",
    name: "Module 4: Testing & Deployment",
    videoCount: 10,
    quizCount: 2,
    estimatedDuration: "3 giờ 15 phút",
    completionRate: 0,
    status: "Chưa bắt đầu",
    performance: {
      averageQuizScore: 0,
      correctAnswerRate: 0,
      retakeCount: 0,
      actualStudyTime: "0 phút",
      videoCompletionRate: 0,
      interactionLevel: "Chưa có",
    },
    aiAssessment: {
      overallComment:
        "Module chưa được bắt đầu. Đây là module quan trọng về testing và deployment.",
      strengths: [],
      improvements: [
        {
          skill: "Unit Testing",
          suggestion: "Bắt đầu với Jest và React Testing Library",
        },
      ],
    },
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hoàn thành":
      return "success";
    case "Đang học":
      return "processing";
    case "Chưa bắt đầu":
      return "default";
    default:
      return "default";
  }
};

const getInteractionColor = (level: string) => {
  switch (level) {
    case "Cao":
      return "text-green-600";
    case "Trung bình":
      return "text-yellow-600";
    case "Thấp":
      return "text-red-600";
    default:
      return "text-gray-600";
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
          <Card key={module.id} className="border-0 shadow-sm">
            {/* Module Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-xl shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiLayers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {module.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-blue-100">
                      <span className="flex items-center space-x-1">
                        <FiPlay className="w-4 h-4" />
                        <span>{module.videoCount} video</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiFileText className="w-4 h-4" />
                        <span>{module.quizCount} quiz</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{module.estimatedDuration}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-white font-medium text-sm">
                    {module.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-slate-50 dark:bg-slate-800 from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl  border border-slate-200 dark:border-slate-700 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Tiến độ hoàn thành
                </span>
                {module.completionRate === 100 && (
                  <span className="text-xl font-bold text-green-900 dark:text-green-100">
                    {module.completionRate}%
                  </span>
                )}
              </div>
              <Progress
                percent={module.completionRate}
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
                    {module.performance.averageQuizScore}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    /10
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Điểm TB Quiz
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {module.performance.correctAnswerRate}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    %
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Tỷ lệ đúng
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {module.performance.videoCompletionRate}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    %
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Video hoàn thành
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {module.performance.retakeCount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    lần
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Làm lại
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Thời gian thực tế
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {module.performance.actualStudyTime}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Mức độ tương tác
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {module.performance.interactionLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Assessment */}
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                <FiCpu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Nhận định của AI</span>
              </h4>

              {/* Overall Comment */}
              <div className="mb-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {module.aiAssessment.overallComment}
                </p>
              </div>

              {/* Skills Summary */}
              <div className="space-y-4">
                {module.aiAssessment.strengths.length > 0 && (
                  <div className="border-l-3 border-emerald-500 pl-4 bg-white dark:bg-slate-900 p-3 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiTrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Điểm nổi bật
                      </span>
                    </div>
                    {module.aiAssessment.strengths.map((strength, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-slate-700 dark:text-slate-300 mb-2"
                      >
                        <strong className="text-slate-900 dark:text-slate-100">
                          {strength.skill}:
                        </strong>{" "}
                        {strength.suggestion}
                      </div>
                    ))}
                  </div>
                )}

                {module.aiAssessment.improvements.length > 0 && (
                  <div className="border-l-3 border-amber-500 pl-4 bg-white dark:bg-slate-900 p-3 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiTrendingDown className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        Cần cải thiện
                      </span>
                    </div>
                    {module.aiAssessment.improvements.map(
                      (improvement, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-slate-700 dark:text-slate-300 mb-2"
                        >
                          <strong className="text-slate-900 dark:text-slate-100">
                            {improvement.skill}:
                          </strong>{" "}
                          {improvement.suggestion}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModulePerformance;
