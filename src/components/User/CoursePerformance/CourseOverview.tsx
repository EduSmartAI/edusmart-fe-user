"use client";

import React from "react";
import { Card, Progress, Tag, Row, Col } from "antd";
import {
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiPlay,
  FiFileText,
  FiTarget,
  FiUsers,
  FiEye,
  FiRotateCcw,
  FiPause,
  FiClock,
  FiSkipForward,
  FiActivity,
  FiAward,
  FiAlertTriangle,
  FiCpu,
} from "react-icons/fi";

interface CourseOverviewProps {
  courseId: string;
}

// Mock data - trong thực tế sẽ fetch từ API
const mockCourseData = {
  courseInfo: {
    title: "React Advanced - Xây dựng ứng dụng thực tế",
    instructor: "Nguyễn Văn An",
    totalDuration: "24 giờ 30 phút",
    totalVideos: 156,
    totalQuizzes: 12,
    startDate: "2024-09-15",
    completionDate: null,
    progress: 68,
    status: "Đang học",
  },
  aiAssessment: {
    overallComment:
      "Bạn đang có tiến độ học tập tốt với khả năng tiếp thu kiến thức ổn định. Tuy nhiên, cần tập trung hơn vào phần State Management và Testing.",
    strongSkills: [
      {
        skill: "Component Development",
        score: 8.5,
        evidence:
          "Hoàn thành 95% bài tập về components với điểm trung bình 8.7/10",
        suggestion:
          "Tiếp tục thực hành với Advanced Patterns như Compound Components",
      },
      {
        skill: "Hooks Usage",
        score: 8.2,
        evidence: "Sử dụng hooks hiệu quả, ít lỗi logic trong các bài quiz",
        suggestion: "Khám phá Custom Hooks để tối ưu code",
      },
    ],
    weakSkills: [
      {
        skill: "State Management",
        score: 6.1,
        evidence: "Điểm quiz Redux thấp (5.8/10), thời gian làm bài lâu",
        suggestion:
          "Xem lại video về Redux Toolkit và làm thêm bài tập thực hành",
      },
      {
        skill: "Testing",
        score: 5.9,
        evidence:
          "Bỏ qua 40% video về Testing, chưa hoàn thành quiz Unit Testing",
        suggestion: "Dành thời gian học Jest và React Testing Library",
      },
    ],
  },
  completion: {
    courseProgress: 68,
    scheduleStatus: "Chậm hơn 2 ngày",
    schedulePercentage: -8,
    totalStudyTime: "18 giờ 45 phút",
    videosWatched: 106,
    quizzesCompleted: 8,
  },
  performance: {
    averageScore: 7.8,
    retakeCount: 3,
    proficiencyLevel: "Intermediate",
    proficiencyScore: 76,
    groupComparison: "Cao hơn 72% sinh viên cùng khóa",
  },
  behavior: {
    lastAccess: "2024-10-09",
    studyDays: 28,
    avgTimePerDay: "42 phút",
    rewatchFrequency: 2.3,
    rewindCount: 156,
    pauseRate: 0.85,
    skipRate: 0.12,
  },
};

const CourseOverview: React.FC<CourseOverviewProps> = () => {
  const data = mockCourseData;

  return (
    <div className=" flex flex-col gap-6">
      {/* Course Header - Enhanced */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  {data.courseInfo.title}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>{data.courseInfo.instructor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock className="w-4 h-4" />
                <span>{data.courseInfo.totalDuration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPlay className="w-4 h-4" />
                <span>{data.courseInfo.totalVideos} video</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiFileText className="w-4 h-4" />
                <span>{data.courseInfo.totalQuizzes} quiz</span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-white font-medium">
              {data.courseInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Dashboard */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <FiTarget className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-400 font-semibold">
              Tiến độ học tập
            </span>
          </div>
        }
        className="border-0 shadow-sm"
      >
        {/* Progress Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tiến độ hoàn thành khóa học
            </span>
            {/* <span className="text-lg font-bold text-blue-600">
              {data.completion.courseProgress}%
            </span> */}
          </div>
          <Progress
            percent={data.completion.courseProgress}
            strokeColor={{
              "0%": "#3b82f6",
              "100%": "#8b5cf6",
            }}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Bắt đầu:{" "}
              {new Date(data.courseInfo.startDate).toLocaleDateString("vi-VN")}
            </span>
            <span>Thời gian học: {data.completion.totalStudyTime}</span>
          </div>
        </div>

        {/* Key Stats Grid - Clean */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {data.completion.videosWatched}/{data.courseInfo.totalVideos}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Video đã xem
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {data.completion.quizzesCompleted}/{data.courseInfo.totalQuizzes}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Quiz hoàn thành
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {data.performance.averageScore}/10
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Điểm trung bình
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {data.performance.retakeCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Lần làm lại
            </div>
          </div>
        </div>

        {/* Schedule Status */}
        <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiActivity className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Tiến độ so với lộ trình AI
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag
              color={
                data.completion.schedulePercentage < 0 ? "warning" : "success"
              }
            >
              {data.completion.scheduleStatus}
            </Tag>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ({data.completion.schedulePercentage > 0 ? "+" : ""}
              {data.completion.schedulePercentage}%)
            </span>
          </div>
        </div>
      </Card>

      {/* AI Assessment - Simplified */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <FiCpu className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 dark:text-purple-400 font-semibold">
              Đánh giá của AI
            </span>
          </div>
        }
        className="border-0 shadow-sm"
      >
        {/* Overall Comment */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {data.aiAssessment.overallComment}
          </p>
        </div>

        {/* Skills Summary - Compact */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10 p-4 rounded-r-lg">
              <div className="flex items-center space-x-2 mb-3">
                <FiTrendingUp className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-700 dark:text-green-400">
                  Điểm mạnh
                </h4>
              </div>
              <div className="space-y-3">
                {data.aiAssessment.strongSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {skill.skill}
                      </span>
                      <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">
                          {skill.score}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {skill.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="border-l-4 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-r-lg">
              <div className="flex items-center space-x-2 mb-3">
                <FiTrendingDown className="w-4 h-4 text-orange-600" />
                <h4 className="font-medium text-orange-700 dark:text-orange-400">
                  Cần cải thiện
                </h4>
              </div>
              <div className="space-y-3">
                {data.aiAssessment.weakSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {skill.skill}
                      </span>
                      <div className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                        <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                          {skill.score}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {skill.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Additional Performance Details */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <FiAward className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
              Hiệu suất học tập tổng thể
            </span>
          </div>
        }
        className="border-0 shadow-sm"
      >
        {/* Performance Metrics - Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Average Score */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiTarget className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Điểm trung bình tổng khóa
              </span>
            </div>
            <div className="flex items-end space-x-1 mb-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.performance.averageScore}
              </span>
              <span className="text-sm text-gray-500 mb-1">/10</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Điểm trung bình của tất cả các bài quiz
            </p>
          </div>

          {/* AI Score */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiCpu className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Điểm số tổng hợp (AI)
              </span>
            </div>
            <div className="flex items-end space-x-1 mb-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.performance.proficiencyScore}
              </span>
              <span className="text-sm text-gray-500 mb-1">/100</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dựa trên điểm số, thời gian phản hồi, độ khó
            </p>
          </div>

          {/* Proficiency Level */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiTrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trình độ
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {data.performance.proficiencyLevel}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI đánh giá
            </p>
          </div>
        </div>

        {/* Secondary Metrics - Simple Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiRotateCcw className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Số lần làm quiz lại
                </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {data.performance.retakeCount} lần
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiUsers className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  So sánh với nhóm
                </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Cao hơn 72%
              </span>
            </div>
          </div>
        </div>

        {/* Performance Analysis - Simplified */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <FiAlertTriangle className="w-4 h-4 text-gray-600" />
            <span>Phân tích hiệu suất</span>
          </h4>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Điểm mạnh:</strong> Điểm trung bình{" "}
              {data.performance.averageScore}/10 cho thấy khả năng tiếp thu kiến
              thức tốt.
            </p>
            <p>
              <strong>So sánh:</strong> Kết quả tốt hơn 72% sinh viên cùng trình
              độ, thể hiện nỗ lực học tập đáng khen ngợi.
            </p>
            <p>
              <strong>Tiềm năng:</strong> Với điểm AI{" "}
              {data.performance.proficiencyScore}/100, bạn có thể phát triển lên
              mức Advanced.
            </p>
          </div>
        </div>
      </Card>

      {/* Learning Behavior */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <FiActivity className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700 dark:text-indigo-400 font-semibold">
              Hành vi học tập (AI phân tích)
            </span>
          </div>
        }
        className="border-0 shadow-sm"
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">
                    Lần truy cập cuối
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(data.behavior.lastAccess).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">
                    Số ngày học thực tế
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.behavior.studyDays} ngày
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiClock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">
                    Thời gian TB/ngày
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.behavior.avgTimePerDay}
                </span>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiEye className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">
                    Tần suất xem lại
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.behavior.rewatchFrequency}x
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiRotateCcw className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">
                    Tần suất tua lại
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.behavior.rewindCount} lần
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiPause className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">
                    Tỷ lệ bấm dừng
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(data.behavior.pauseRate * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiSkipForward className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">
                    Tỷ lệ bỏ qua nội dung
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(data.behavior.skipRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Behavior Insights */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <FiAlertTriangle className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Phân tích hành vi học tập
              </h4>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  • <strong>Tích cực:</strong> Tỷ lệ bấm dừng cao (85%) cho thấy
                  bạn chủ động xử lý thông tin
                </p>
                <p>
                  • <strong>Cần chú ý:</strong> Tỷ lệ bỏ qua nội dung (12%) cần
                  theo dõi để tránh học hổng
                </p>
                <p>
                  • <strong>Gợi ý:</strong> Tần suất tua lại hợp lý, cho thấy sự
                  tập trung tốt trong quá trình học
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseOverview;
