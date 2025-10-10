"use client";

import React, { useState } from "react";
import { Card, Tag, Row, Col, Progress, Collapse, Timeline, Statistic, Divider } from "antd";
import { 
  FiPlay,
  FiClock,
  FiCheckCircle,
  FiPause,
  FiRotateCcw,
  FiEye,
  FiSkipForward,
  FiMessageCircle,
  FiEdit3,
  FiHelpCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiCpu,
  FiAlertTriangle,
  FiTarget,
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiLayers
} from "react-icons/fi";

const { Panel } = Collapse;

interface VideoPerformanceProps {
  courseId: string;
}

// Mock data cho video performance
const mockVideoData = [
  {
    id: "video-1",
    title: "Introduction to React Components",
    module: "Module 1: React Fundamentals",
    duration: "12:45",
    status: "Hoàn thành",
    statusIcon: "✅",
    replayCount: 3,
    lastViewed: "2024-10-08",
    behaviorMetrics: {
      midVideoQuizScore: 8.5,
      rewatchCount: 2,
      pauseCount: 15,
      seekCount: 8,
      difficultSegments: [
        { start: "02:30", end: "04:10", reason: "Component Props concept", pauseCount: 8, seekCount: 4 },
        { start: "08:15", end: "09:30", reason: "JSX Syntax rules", pauseCount: 5, seekCount: 3 }
      ],
      interactionLevel: {
        notes: 5,
        comments: 2,
        questions: 1
      }
    },
    aiAssessment: {
      overallComment: "Bạn có xu hướng xem lại nhiều phần liên quan đến Component Props → Có thể đây là mảng bạn chưa nắm vững. Tuy nhiên, bạn hoàn thành video với hiệu suất tốt.",
      strengths: [
        {
          point: "Tương tác tích cực",
          detail: "Ghi chú nhiều và đặt câu hỏi cho thấy sự chủ động trong học tập"
        }
      ],
      improvements: [
        {
          point: "Component Props",
          detail: "Xem lại tài liệu về Props và làm bài tập thực hành thêm"
        }
      ],
      suggestions: [
        "Thực hành tạo components với nhiều props khác nhau",
        "Xem video bổ sung về Props validation"
      ]
    }
  },
  {
    id: "video-2", 
    title: "State Management with useState",
    module: "Module 2: State Management & Hooks",
    duration: "18:20",
    status: "Dở dang",
    statusIcon: "⏸",
    replayCount: 1,
    lastViewed: "2024-10-09",
    behaviorMetrics: {
      midVideoQuizScore: 6.0,
      rewatchCount: 4,
      pauseCount: 22,
      seekCount: 12,
      difficultSegments: [
        { start: "05:45", end: "08:30", reason: "State updates and re-renders", pauseCount: 12, seekCount: 7 },
        { start: "12:10", end: "15:45", reason: "Functional updates", pauseCount: 8, seekCount: 4 }
      ],
      interactionLevel: {
        notes: 8,
        comments: 0,
        questions: 3
      }
    },
    aiAssessment: {
      overallComment: "Video chưa hoàn thành và có nhiều khó khăn ở phần State updates. Bạn cần dành thời gian tập trung hơn cho phần này.",
      strengths: [
        {
          point: "Ghi chú chi tiết",
          detail: "Bạn ghi chú rất nhiều, cho thấy sự cẩn thận trong việc học"
        }
      ],
      improvements: [
        {
          point: "State Management Logic",
          detail: "Cần hiểu rõ hơn về cách React re-render khi state thay đổi"
        }
      ],
      suggestions: [
        "Hoàn thành video và làm quiz để kiểm tra hiểu biết",
        "Thực hành với useState trong các ví dụ đơn giản trước",
        "Xem thêm video về React rendering cycle"
      ]
    }
  },
  {
    id: "video-3",
    title: "Advanced useEffect Patterns",
    module: "Module 3: Advanced Patterns & Performance", 
    duration: "25:15",
    status: "Xem lại",
    statusIcon: "🔁",
    replayCount: 5,
    lastViewed: "2024-10-07",
    behaviorMetrics: {
      midVideoQuizScore: 7.8,
      rewatchCount: 5,
      pauseCount: 35,
      seekCount: 18,
      difficultSegments: [
        { start: "08:20", end: "12:45", reason: "Dependency array rules", pauseCount: 15, seekCount: 9 },
        { start: "18:30", end: "22:10", reason: "Cleanup functions", pauseCount: 12, seekCount: 6 }
      ],
      interactionLevel: {
        notes: 12,
        comments: 1,
        questions: 4
      }
    },
    aiAssessment: {
      overallComment: "Bạn xem lại video này rất nhiều lần, cho thấy nội dung khá phức tạp với bạn. Tuy nhiên, sự kiên trì này sẽ giúp bạn nắm vững kiến thức.",
      strengths: [
        {
          point: "Sự kiên trì",
          detail: "Xem lại nhiều lần cho thấy quyết tâm học tập cao"
        }
      ],
      improvements: [
        {
          point: "useEffect Dependencies",
          detail: "Cần hiểu rõ hơn về dependency array và khi nào cần cleanup"
        }
      ],
      suggestions: [
        "Chia nhỏ video thành các phần và học từng phần một",
        "Thực hành với các ví dụ useEffect đơn giản trước",
        "Tham gia discussion forum để hỏi đáp"
      ]
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hoàn thành": return "success";
    case "Dở dang": return "warning"; 
    case "Xem lại": return "processing";
    default: return "default";
  }
};

const VideoPerformance: React.FC<VideoPerformanceProps> = ({ courseId }) => {
  const [selectedModule, setSelectedModule] = useState<string>("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Hiệu suất và Đánh giá theo Video
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Phân tích hành vi học tập và hiệu suất chi tiết của từng video trong khóa học
        </p>
      </div>

      {/* Videos List - Linear Layout */}
      <div className="flex flex-col gap-6">
        {mockVideoData.map((video, index) => (
          <Card 
            key={video.id}
            className="border-0 shadow-sm"
          >
            {/* Video Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-xl shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiPlay className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {video.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-blue-100 mb-1">
                      <FiLayers className="w-4 h-4" />
                      <span>{video.module}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-blue-100">
                      <span className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{video.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiEye className="w-4 h-4" />
                        <span>{video.replayCount} lần xem</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>Xem cuối: {new Date(video.lastViewed).toLocaleDateString('vi-VN')}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-white font-medium text-sm">
                    {video.statusIcon} {video.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Learning Behavior - Compact */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Hành vi học tập
              </h4>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {video.behaviorMetrics.midVideoQuizScore}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">/10</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Điểm quiz</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {video.behaviorMetrics.rewatchCount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">lần</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Xem lại</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {video.behaviorMetrics.pauseCount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">lần</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Dừng video</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {video.behaviorMetrics.seekCount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">lần</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Tua video</div>
                </div>
              </div>

              {/* Interaction Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Ghi chú</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{video.behaviorMetrics.interactionLevel.notes}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Bình luận</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{video.behaviorMetrics.interactionLevel.comments}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Câu hỏi</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{video.behaviorMetrics.interactionLevel.questions}</span>
                </div>
              </div>

              {/* Difficult Segments */}
              {video.behaviorMetrics.difficultSegments.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <FiAlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      Phần học khó ({video.behaviorMetrics.difficultSegments.length} vị trí)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {video.behaviorMetrics.difficultSegments.map((segment, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-amber-800 dark:text-amber-400 text-sm">
                            {segment.start} - {segment.end}
                          </span>
                          <div className="text-xs text-amber-600 dark:text-amber-400">
                            {segment.pauseCount} dừng, {segment.seekCount} tua
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {segment.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  {video.aiAssessment.overallComment}
                </p>
              </div>

              {/* Skills Summary */}
              <div className="space-y-4">
                {video.aiAssessment.strengths.length > 0 && (
                  <div className="border-l-3 border-emerald-500 pl-4 bg-white dark:bg-slate-900 p-3 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiTrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Điểm nổi bật
                      </span>
                    </div>
                    {video.aiAssessment.strengths.map((strength, idx) => (
                      <div key={idx} className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        <strong className="text-slate-900 dark:text-slate-100">{strength.point}:</strong> {strength.detail}
                      </div>
                    ))}
                  </div>
                )}

                {video.aiAssessment.improvements.length > 0 && (
                  <div className="border-l-3 border-amber-500 pl-4 bg-white dark:bg-slate-900 p-3 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiTrendingDown className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        Cần cải thiện
                      </span>
                    </div>
                    {video.aiAssessment.improvements.map((improvement, idx) => (
                      <div key={idx} className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        <strong className="text-slate-900 dark:text-slate-100">{improvement.point}:</strong> {improvement.detail}
                      </div>
                    ))}
                  </div>
                )}

                {video.aiAssessment.suggestions.length > 0 && (
                  <div className="border-l-3 border-blue-500 pl-4 bg-white dark:bg-slate-900 p-3 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiTarget className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Đề xuất cải thiện
                      </span>
                    </div>
                    <div className="space-y-2">
                      {video.aiAssessment.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                          • {suggestion}
                        </div>
                      ))}
                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600">
                        <a 
                          href="#" 
                          className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          <span>📖 Tài liệu đọc thêm</span>
                        </a>
                      </div>
                    </div>
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

export default VideoPerformance;
