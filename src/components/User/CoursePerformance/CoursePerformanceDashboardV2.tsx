"use client";

import React, { useState } from "react";
import {
  Tabs,
  Statistic,
  Progress,
  Card,
  Collapse,
  Tag,
  Button,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface CourseInfo {
  title: string;
  shortDescription: string;
  level: number;
  durationHours: number;
}

interface CoursePerformanceDashboardV2Props {
  courseId: string;
  courseInfo?: CourseInfo;
}


const CoursePerformanceDashboardV2: React.FC<
  CoursePerformanceDashboardV2Props
> = ({ courseId, courseInfo }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabItems = [
    {
      key: "overview",
      label: "Tổng Quan",
      children: <OverviewTab />,
    },
    {
      key: "modules",
      label: "Chương",
      children: <ModulesTab />,
    },
    {
      key: "lessons",
      label: "Bài Giảng",
      children: <LessonsTab />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Enhanced with gradient background */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {courseInfo && (
            <div>
              {/* Course Title */}
              <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                {courseInfo.title}
              </h1>

              {/* Course Description */}
              <p className="text-blue-100 text-base mb-6 max-w-3xl leading-relaxed">
                {courseInfo.shortDescription}
              </p>

              {/* Course Metadata - Highlighted Card */}
              <div className="inline-flex items-center gap-6 px-6 py-4 bg-white/15 backdrop-blur-md rounded-xl border border-white/30 shadow-xl">
                <div className="flex flex-col">
                  <div className="text-xs text-blue-200 font-semibold uppercase tracking-wider mb-1">
                    Cấp độ
                  </div>
                  <div className="text-base font-bold text-white">
                    {courseInfo.level === 2 ? "Nâng cao" : "Cơ bản"}
                  </div>
                </div>

                <div className="w-px h-12 bg-white/30"></div>

                <div className="flex flex-col">
                  <div className="text-xs text-blue-200 font-semibold uppercase tracking-wider mb-1">
                    Thời lượng
                  </div>
                  <div className="text-base font-bold text-white">
                    {courseInfo.durationHours} giờ
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 shadow-sm"></div>

      {/* Content - Clean white background with subtle shadow */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            items={tabItems}
            tabBarStyle={{
              borderBottom: "2px solid #e5e7eb",
              margin: 0,
              padding: "0 24px",
              backgroundColor: "#ffffff",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============ OVERVIEW TAB ============
const OverviewTab = () => {
  // Sample data - replace with real API data
  const courseData = {
    totals: {
      percentCompleted: 16.67,
      lessonsCompleted: 1,
      lessonsTotal: 6,
      totalActualStudyMinutes: 2,
      totalModuleDurationMinutes: 220,
      averageAiScore: 100,
      averageQuizScore: 100,
    },
  };

  const formatMinutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-8 space-y-8">
      {/* KPI Statistics Row */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Tiến độ học tập
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="h-full border-gray-200 shadow-none hover:shadow-sm transition-shadow">
              <div className="text-gray-600 text-xs font-medium mb-3">
                TIẾN ĐỘ
              </div>
              <div className="text-3xl font-semibold text-gray-900 mb-3">
                {Math.round(courseData.totals.percentCompleted)}%
              </div>
              <Progress
                percent={courseData.totals.percentCompleted}
                showInfo={false}
                strokeColor="#1890ff"
                trailColor="#f0f0f0"
                strokeWidth={6}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="h-full border-gray-200 shadow-none hover:shadow-sm transition-shadow">
              <div className="text-gray-600 text-xs font-medium mb-3">
                BÀI HỌC
              </div>
              <div className="text-3xl font-semibold text-gray-900">
                {courseData.totals.lessonsCompleted}
                <span className="text-lg text-gray-500 font-normal ml-1">
                  /{courseData.totals.lessonsTotal}
                </span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="h-full border-gray-200 shadow-none hover:shadow-sm transition-shadow">
              <div className="text-gray-600 text-xs font-medium mb-3">
                THỜI GIAN HỌC
              </div>
              <div className="text-3xl font-semibold text-gray-900">
                {formatMinutesToHours(
                  courseData.totals.totalActualStudyMinutes,
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                /{" "}
                {formatMinutesToHours(
                  courseData.totals.totalModuleDurationMinutes,
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="h-full border-gray-200 shadow-none hover:shadow-sm transition-shadow">
              <div className="text-gray-600 text-xs font-medium mb-3">
                ĐIỂM ĐÁNH GIÁ
              </div>
              <div className="text-3xl font-semibold text-gray-900">
                {courseData.totals.averageAiScore}
                <span className="text-lg text-gray-500 font-normal ml-1">
                  /100
                </span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <Card className="border-blue-200 bg-blue-50 shadow-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Tiếp tục học tập
            </h3>
            <p className="text-sm text-gray-600">
              Tiếp tục với bài học tiếp theo để nhận phân tích từ AI
            </p>
          </div>
          <Button type="primary" size="large" className="whitespace-nowrap">
            Bắt đầu học
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============ MODULES TAB ============
const ModulesTab = () => {
  // Sample data - replace with real API data
  const modules = [
    {
      moduleId: "dafd86b4-bc91-46ee-bde7-5460dd9f7bb2",
      moduleName: "Updated 05 Introduction",
      positionIndex: 1,
      level: 2,
      isCore: true,
      description: "Overview & environment setup",
      status: "InProgress",
      lessonsVideoTotal: 3,
      lessonsCompleted: 1,
      percentCompleted: 33.33,
      moduleDurationMinutes: 80,
      actualStudyMinutes: 2,
      totalQuizCount: 3,
      averageQuizScore: 100,
      aiScore: 100,
      aiFeedbackSummary: "Kết quả làm bài tốt, đạt được điểm số cao.",
      aiStrengths: [
        "Có kiến thức tốt về các thành phần cốt lõi của ASP.NET Core",
        "Hiểu rõ về các phương thức HTTP và ứng dụng của chúng",
      ],
      improvementResources: [
        {
          improvementText:
            "Cần phát triển thêm kỹ năng phân tích và đánh giá thông tin",
        },
        {
          improvementText:
            "Nên tìm hiểu thêm về các công nghệ và framework khác liên quan đến phát triển web",
        },
        {
          improvementText:
            "Cần cải thiện khả năng giải quyết vấn đề và tư duy logic",
        },
      ],
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
      moduleDurationMinutes: 140,
      actualStudyMinutes: 0,
      totalQuizCount: 0,
      averageQuizScore: null,
      aiScore: null,
      aiFeedbackSummary: null,
      aiStrengths: null,
      improvementResources: [],
    },
  ];

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      NotStarted: { color: "default", text: "Chưa bắt đầu" },
      InProgress: { color: "", text: "Đang học" },
      Completed: { color: "success", text: "Hoàn thành" },
    };
    const s = statusMap[status] || statusMap.NotStarted;
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const formatMinutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const collapseItems = modules.map((module) => ({
    key: module.moduleId,
    label: (
      <div className="flex items-center justify-between w-full pr-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Text strong className="text-base">
              {module.moduleName}
            </Text>
            {module.status === "InProgress" && <Tag color="blue">Đang học</Tag>}
            {module.status === "Completed" && (
              <Tag color="green">Hoàn thành</Tag>
            )}
          </div>
          <Text type="secondary" className="text-sm">
            {module.description}
          </Text>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-24">
            <Progress
              percent={Math.round(module.percentCompleted)}
              showInfo={false}
              strokeColor="#1890ff"
              trailColor="#f0f0f0"
              strokeWidth={6}
            />
          </div>
          <Text
            type="secondary"
            className="whitespace-nowrap text-sm font-medium"
          >
            {Math.round(module.percentCompleted)}%
          </Text>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-5">
        {/* Module Stats Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-gray-200 shadow-none">
              <div className="text-gray-600 text-sm mb-2">Tiến độ</div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(module.percentCompleted)}%
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-gray-200 shadow-none">
              <div className="text-gray-600 text-sm mb-2">Bài học</div>
              <div className="text-2xl font-semibold text-gray-900">
                {module.lessonsCompleted}
                <span className="text-sm text-gray-500 font-normal">
                  /{module.lessonsVideoTotal}
                </span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-gray-200 shadow-none">
              <div className="text-gray-600 text-sm mb-2">Thời gian</div>
              <div className="text-2xl font-semibold text-gray-900">
                {formatMinutesToHours(module.actualStudyMinutes)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                / {formatMinutesToHours(module.moduleDurationMinutes)}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-gray-200 shadow-none">
              <div className="text-gray-600 text-sm mb-2">Điểm AI</div>
              <div className="text-2xl font-semibold text-gray-900">
                {module.aiScore ?? "—"}
                {module.aiScore && (
                  <span className="text-sm text-gray-500 font-normal">
                    /100
                  </span>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* AI Feedback Section */}
        {module.status === "InProgress" && module.aiScore !== null && (
          <Card className="border-gray-200 bg-blue-50 shadow-none">
            <div className="space-y-3">
              <div>
                <Text strong className="text-sm text-gray-900">
                  Nhận xét AI
                </Text>
                <Paragraph className="mb-0 mt-1 text-gray-600 text-sm">
                  {module.aiFeedbackSummary}
                </Paragraph>
              </div>

              {module.aiStrengths && module.aiStrengths.length > 0 && (
                <div>
                  <Text strong className="text-sm text-gray-900">
                    Điểm mạnh
                  </Text>
                  <ul className="mt-1 space-y-1">
                    {module.aiStrengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {module.improvementResources.length > 0 && (
                <div>
                  <Text strong className="text-sm text-gray-900">
                    Hướng cải thiện
                  </Text>
                  <ul className="mt-1 space-y-1">
                    {module.improvementResources.map((resource, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        • {resource.improvementText}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Quiz Stats */}
        {module.totalQuizCount > 0 && (
          <Card className="border-gray-200 shadow-none">
            <div className="space-y-3">
              <Text strong className="text-sm text-gray-900">
                Thống kê bài tập
              </Text>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Tổng bài tập
                    </Text>
                    <div className="text-2xl font-semibold text-gray-900 mt-1">
                      {module.totalQuizCount}
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div>
                    <Text type="secondary" className="text-xs">
                      Điểm trung bình
                    </Text>
                    <div className="text-2xl font-semibold text-gray-900 mt-1">
                      {module.averageQuizScore ?? 0}
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="primary"
            size="large"
            disabled={module.status === "Completed"}
            className="flex-1"
          >
            {module.status === "NotStarted" ? "Bắt đầu học" : "Tiếp tục học"}
          </Button>
          <Button size="large" className="flex-1">
            Xem chi tiết
          </Button>
        </div>
      </div>
    ),
  }));

  return (
    <div className="p-8">
      <Collapse items={collapseItems} accordion className="bg-transparent" />
    </div>
  );
};

// ============ LESSONS TAB ============
const LessonsTab = () => {
  // Sample data - replace with real API data
  const lessonsData = [
    {
      moduleId: "dafd86b4-bc91-46ee-bde7-5460dd9f7bb2",
      moduleName: "Updated 05 Introduction",
      lessons: [
        {
          lessonId: "d4521e01-4015-4784-9bfb-5dad8a4cd406",
          title: "Updated 05 Welcome",
          videoDurationSeconds: 190,
          percentWatched: 34.74,
          status: 2,
          lessonQuizCount: 1,
          averageQuizScore: 0,
          aiScore: 0,
          aiFeedbackSummary:
            "Kết quả làm bài không đạt yêu cầu, cần cải thiện kỹ năng giải thuật",
        },
        {
          lessonId: "9f349ea4-91cc-4501-9385-5470c9762163",
          title: "Updated 05 Dev Environment Setup",
          videoDurationSeconds: 240,
          percentWatched: 0.83,
          status: 1,
          lessonQuizCount: 1,
          averageQuizScore: null,
          aiScore: null,
          aiFeedbackSummary: null,
        },
        {
          lessonId: "d2984ac6-c5f6-4a48-a507-371090f240e7",
          title: "string 04",
          videoDurationSeconds: 240,
          percentWatched: 0,
          status: 0,
          lessonQuizCount: 0,
          averageQuizScore: null,
          aiScore: null,
          aiFeedbackSummary: null,
        },
      ],
    },
    {
      moduleId: "ea3fcae1-d2a4-4578-b1c4-cd1d639ea99a",
      moduleName: "05 Web API Basics Updated",
      lessons: [
        {
          lessonId: "2826698a-bd8e-40b6-b552-53f5dfa801c8",
          title: "05 Updated Controllers 101",
          videoDurationSeconds: 180,
          percentWatched: 0,
          status: 0,
          lessonQuizCount: 0,
          averageQuizScore: null,
          aiScore: null,
          aiFeedbackSummary: null,
        },
        {
          lessonId: "bb0a9759-8250-47dd-ad13-80b551f44403",
          title: "05 Updated Dependency Injection",
          videoDurationSeconds: 250,
          percentWatched: 0,
          status: 0,
          lessonQuizCount: 0,
          averageQuizScore: null,
          aiScore: null,
          aiFeedbackSummary: null,
        },
        {
          lessonId: "40a16e66-819f-4c58-b9e0-d0a83e9ff4a3",
          title: "string 05",
          videoDurationSeconds: 240,
          percentWatched: 0,
          status: 0,
          lessonQuizCount: 0,
          averageQuizScore: null,
          aiScore: null,
          aiFeedbackSummary: null,
        },
      ],
    },
  ];

  const getStatusBadge = (status: number) => {
    const statusMap: Record<number, { color: string; text: string }> = {
      0: { color: "default", text: "Chưa bắt đầu" },
      1: { color: "", text: "Đang xem" },
      2: { color: "success", text: "Hoàn thành" },
    };
    const s = statusMap[status] || statusMap[0];
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="p-8 space-y-8">
      {lessonsData.map((moduleData) => (
        <div key={moduleData.moduleId}>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              {moduleData.moduleName}
            </h2>
            <Divider style={{ margin: "12px 0" }} />
          </div>

          <div className="space-y-4">
            {moduleData.lessons.map((lesson, idx) => (
              <Card
                key={lesson.lessonId}
                className="border-gray-200 hover:shadow-sm transition-all shadow-none"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 font-medium uppercase">
                          Bài {idx + 1}
                        </span>
                        {getStatusBadge(lesson.status)}
                      </div>
                      <Text strong className="text-base text-gray-900">
                        {lesson.title}
                      </Text>
                    </div>
                    <Text
                      type="secondary"
                      className="text-sm whitespace-nowrap flex-shrink-0 text-gray-500"
                    >
                      {formatSeconds(lesson.videoDurationSeconds)}
                    </Text>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Text
                        type="secondary"
                        className="text-xs font-medium text-gray-600"
                      >
                        Tiến độ xem
                      </Text>
                      <Text
                        type="secondary"
                        className="text-xs font-medium text-gray-900"
                      >
                        {Math.round(lesson.percentWatched)}%
                      </Text>
                    </div>
                    <Progress
                      percent={Math.round(lesson.percentWatched)}
                      showInfo={false}
                      strokeColor="#1890ff"
                      trailColor="#f0f0f0"
                      strokeWidth={6}
                    />
                  </div>

                  {/* Lesson Stats Row */}
                  {(lesson.lessonQuizCount > 0 ||
                    lesson.averageQuizScore !== null ||
                    lesson.aiScore !== null) && (
                    <div className="grid grid-cols-3 gap-4 py-3 px-3 bg-gray-50 rounded border border-gray-100">
                      {lesson.lessonQuizCount > 0 && (
                        <div>
                          <Text
                            type="secondary"
                            className="text-xs font-medium text-gray-600 block mb-1"
                          >
                            Bài tập
                          </Text>
                          <Text strong className="text-sm text-gray-900">
                            {lesson.lessonQuizCount}
                          </Text>
                        </div>
                      )}

                      {lesson.averageQuizScore !== null && (
                        <div>
                          <Text
                            type="secondary"
                            className="text-xs font-medium text-gray-600 block mb-1"
                          >
                            Điểm bài tập
                          </Text>
                          <Text strong className="text-sm text-gray-900">
                            {lesson.averageQuizScore}/100
                          </Text>
                        </div>
                      )}

                      {lesson.aiScore !== null && (
                        <div>
                          <Text
                            type="secondary"
                            className="text-xs font-medium text-gray-600 block mb-1"
                          >
                            Điểm AI
                          </Text>
                          <Text strong className="text-sm text-gray-900">
                            {lesson.aiScore}/100
                          </Text>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Feedback */}
                  {lesson.aiFeedbackSummary && (
                    <Card
                      className="bg-blue-50 border-gray-200 shadow-none"
                      size="small"
                    >
                      <div className="flex-1">
                        <Text strong className="text-sm text-gray-900">
                          Nhận xét từ AI
                        </Text>
                        <Text className="block text-gray-600 text-sm mt-1">
                          {lesson.aiFeedbackSummary}
                        </Text>
                      </div>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button type="primary" size="large" className="flex-1">
                      {lesson.status === 0
                        ? "Bắt đầu xem"
                        : lesson.status === 1
                          ? "Tiếp tục xem"
                          : "Xem lại"}
                    </Button>
                    {lesson.lessonQuizCount > 0 && (
                      <Button size="large" className="flex-1">
                        Làm bài tập
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursePerformanceDashboardV2;
