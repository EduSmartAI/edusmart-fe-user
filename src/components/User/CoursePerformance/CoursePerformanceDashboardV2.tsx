"use client";

import React, { useState } from "react";
import { Tabs } from "antd";

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
      label: "Các Mô-đun",
      children: <ModulesTab />,
    },
    {
      key: "lessons",
      label: "Bài Học",
      children: <LessonsTab />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Unified Header Card */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Course Info Section */}
            {courseInfo && (
              <div className="px-8 py-6 bg-white">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {courseInfo.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {courseInfo.shortDescription}
                  </p>
                </div>

                {/* Course Metadata */}
                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-700">
                    <span className="text-gray-500">Cấp độ:</span>{" "}
                    <span className="font-medium">
                      {courseInfo.level === 2 ? "Nâng cao" : "Cơ bản"}
                    </span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-700">
                    <span className="text-gray-500">Thời lượng:</span>{" "}
                    <span className="font-medium">
                      {courseInfo.durationHours} giờ
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            className="custom-tabs"
            items={tabItems}
            tabBarStyle={{
              borderBottom: "1px solid #e5e7eb",
              margin: 0,
              padding: "0 24px",
              backgroundColor: "#f9fafb",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============ OVERVIEW TAB ============
const OverviewTab = () => {
  return (
    <div className="p-8 space-y-6">
      {/* Quick Status */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Trạng Thái
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-5 bg-gray-50 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Tiến độ
              </p>
              <p className="text-3xl font-bold text-gray-900">0%</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-5 bg-gray-50 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                Trạng thái
              </p>
              <p className="text-sm font-medium text-gray-900 mb-3">
                Chưa bắt đầu
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  Bài học: <span className="font-medium">0/6</span>
                </p>
                <p>
                  Thời gian: <span className="font-medium">0/220 phút</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bắt Đầu Ngay
          </h3>
          <p className="text-gray-600 text-sm mb-5">
            Bắt đầu bài học đầu tiên để mở khóa hiểu biết được cá nhân hóa
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
            Bắt Đầu Bài Học Đầu Tiên
          </button>
        </div>
      </section>

      {/* Module Overview */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Tổng Quan Mô-đun
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Bài 05 Giới thiệu cập nhật",
              lessons: 3,
              progress: 0,
            },
            {
              name: "Bài 05 Web API Cơ bản",
              lessons: 3,
              progress: 0,
            },
          ].map((module, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {module.name}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {module.lessons} bài học
                </p>
                <div className="w-full bg-gray-300 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {module.progress}% hoàn thành
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Insights */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hiểu biết AI
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <p className="text-gray-600 text-sm text-center">
              Hoàn thành bài học đầu tiên để mở khóa phản hồi được cá nhân hóa
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============ MODULES TAB ============
const ModulesTab = () => {
  const modules = [
    {
      id: 1,
      name: "Bài 05 Giới thiệu cập nhật",
      description: "Tổng quan & thiết lập môi trường",
      lessons: 3,
      quizzes: 3,
      progress: 0,
      status: "notStarted",
      aiScore: null,
    },
    {
      id: 2,
      name: "Bài 05 Web API Cơ bản cập nhật",
      description: "Controllers, Dependency Injection, EF Core",
      lessons: 3,
      quizzes: 0,
      progress: 0,
      status: "notStarted",
      aiScore: null,
    },
  ];

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="p-8 space-y-3">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          isExpanded={expandedId === module.id}
          onToggle={() =>
            setExpandedId(expandedId === module.id ? null : module.id)
          }
        />
      ))}
    </div>
  );
};

interface Module {
  id: number;
  name: string;
  description: string;
  lessons: number;
  quizzes: number;
  progress: number;
  status: string;
  aiScore: number | null;
}

interface ModuleCardProps {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
      <button
        onClick={onToggle}
        className="w-full p-5 text-left hover:bg-gray-50 transition-colors bg-white border-b border-gray-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {module.name}
            </h3>
            <p className="text-xs text-gray-600 mb-3">{module.description}</p>
            <div className="w-full bg-gray-300 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${module.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {module.progress}% • {module.lessons} bài học • {module.quizzes}{" "}
              bài kiểm tra
            </p>
          </div>
          <span className="text-gray-400 ml-4 text-lg">
            {isExpanded ? "−" : "+"}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Tiến độ
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {module.progress}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Trạng thái
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {module.status === "notStarted"
                    ? "Chưa bắt đầu"
                    : "Đang diễn ra"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Điểm AI
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {module.aiScore ? `${module.aiScore}/100` : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 border-b border-gray-200">
            <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Bài học
            </h4>
            <div className="space-y-2">
              {[...Array(module.lessons)].map((_, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-gray-200 rounded text-xs text-gray-600"
                >
                  Bài học {idx + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 flex gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
              Bắt Đầu
            </button>
            <button className="flex-1 px-4 py-2 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              Xem Chi Tiết
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ LESSONS TAB ============
const LessonsTab = () => {
  const lessonsData = [
    {
      id: 1,
      module: "Bài 05 Giới thiệu cập nhật",
      lessons: [
        { name: "Bài 05 Chào mừng", duration: 190, watched: 0 },
        { name: "Thiết lập môi trường phát triển", duration: 240, watched: 0 },
        { name: "Bài chuỗi 04", duration: 240, watched: 0 },
      ],
    },
    {
      id: 2,
      module: "Bài 05 Web API Cơ bản cập nhật",
      lessons: [
        { name: "Controllers 101", duration: 180, watched: 0 },
        { name: "Tiêm phụ thuộc", duration: 250, watched: 0 },
        { name: "Bài chuỗi 05", duration: 240, watched: 0 },
      ],
    },
  ];

  return (
    <div className="p-8 space-y-5">
      {lessonsData.map((module) => (
        <div key={module.id}>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {module.module}
          </h3>
          <div className="space-y-2">
            {module.lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {lesson.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {Math.floor(lesson.duration / 60)}:
                      {(lesson.duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${lesson.watched}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      {lesson.watched}% đã xem
                    </p>
                    <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Xem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursePerformanceDashboardV2;
