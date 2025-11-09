"use client";

import React, { useState } from "react";
import { Card, Tabs, Progress, Tag, Collapse, Modal } from "antd";
import { MarkdownView } from "EduSmart/components/MarkDown/MarkdownView";
import type { CourseDetailForGuestDto } from "EduSmart/api/api-course-service";
import {
  mockModuleData,
  mockLessonData,
} from "../../course-performance-demo-2/mockData";

interface ImprovementResource {
  improvementId: string;
  positionIndex: number;
  improvementText: string;
  contentMarkdown: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  moduleId: string;
  moduleName: string;
  positionIndex: number;
  level: number;
  isCore: boolean;
  description: string;
  status: string | number;
  lessonsVideoTotal: number;
  lessonsCompleted: number;
  percentCompleted: number;
  lessonsInProgress: number;
  moduleDurationMinutes: number;
  actualStudyMinutes: number;
  moduleQuizCount: number;
  lessonQuizCount: number;
  totalQuizCount: number;
  averageQuizScore: number | null;
  aiScore: number | null;
  aiFeedbackSummary: string | null;
  aiStrengths: string[] | null;
  improvementResources: ImprovementResource[];
  startedAtUtc: string | null;
  completedAtUtc: string | null;
  updatedAtUtc: string;
}

interface Lesson {
  lessonId: string;
  title: string;
  positionIndex: number;
  isActive: boolean;
  videoUrl: string;
  status: number;
  currentSecond: number | null;
  videoDurationSeconds: number;
  actualStudyMinutes: number;
  percentWatched: number;
  lessonQuizCount: number;
  averageQuizScore: number | null;
  aiScore: number | null;
  aiScoreRaw: number | null;
  aiFeedbackSummary: string | null;
  aiStrengths: string[] | null;
  aiImprovementResources: ImprovementResource[] | null;
  startedAtUtc: string | null;
  completedAtUtc: string | null;
  updatedAtUtc: string;
  aiEvaluatedAtUtc: string | null;
}

interface ModuleWithLessons {
  moduleId: string;
  moduleName: string;
  positionIndex: number;
  lessons: Lesson[];
}

// Helper function to get status tag
const getStatusTag = (status: string | number) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    NotStarted: { label: "Chưa bắt đầu", color: "default" },
    InProgress: { label: "Đang học", color: "processing" },
    Completed: { label: "Hoàn thành", color: "success" },
    0: { label: "Chưa bắt đầu", color: "default" },
    1: { label: "Đang học", color: "processing" },
    2: { label: "Hoàn thành", color: "success" },
  };

  const statusInfo = statusMap[status] || {
    label: "Không xác định",
    color: "default",
  };
  return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
};

interface CoursePerformanceClientProps {
  courseDetail: CourseDetailForGuestDto;
  modulesCount: number;
  lessonsCount: number;
}

export default function CoursePerformanceClient({
  courseDetail,
  modulesCount,
  lessonsCount,
}: CoursePerformanceClientProps) {
  const [activeTab, setActiveTab] = useState<string>("modules");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedLessonKeys, setExpandedLessonKeys] = useState<string[]>([]);
  const [expandedModuleKeys, setExpandedModuleKeys] = useState<string[]>([]);

  // Helper function to get level label
  const getLevelLabel = (level: number | null | undefined) => {
    const levelMap: Record<number, string> = {
      1: "Cơ bản",
      2: "Trung bình",
      3: "Nâng cao",
    };
    return levelMap[Number(level)] || "Không xác định";
  };

  // Course Information Component
  const CourseInformation = () => (
    <div className="bg-[#49BBBD] rounded-lg p-6 shadow-lg">
      <div className="space-y-5">
        {/* Course Header */}
        <div className="space-y-3">
          {/* Subject Code & Level */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-sm text-white text-sm font-medium">
              {courseDetail.subjectCode || "N/A"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white">
            {courseDetail.title || "Khóa học"}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-base">
            {courseDetail.shortDescription || "Không có mô tả"}
          </p>
        </div>

        {/* Course Stats */}
        <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/10 backdrop-blur-md rounded-md border border-white/30 shadow-xl mt-2">
          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Cấp độ
            </div>
            <div className="text-base font-bold text-white text-center">
              {getLevelLabel(courseDetail.level)}
            </div>
          </div>

          <div className="w-px h-12 bg-white/30"></div>

          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Tổng chương
            </div>
            <div className="text-base font-bold text-white text-center">
              {modulesCount}
            </div>
          </div>

          <div className="w-px h-12 bg-white/30"></div>

          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Tổng bài học
            </div>
            <div className="text-base font-bold text-white text-center">
              {lessonsCount}
            </div>
          </div>

          <div className="w-px h-12 bg-white/30"></div>

          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Thời lượng khóa học
            </div>
            <div className="text-base font-bold text-white text-center">
              {courseDetail.durationHours
                ? courseDetail.durationHours.toFixed(1)
                : "--"}
              h
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Module Performance Component (using mock data for now)
  const ModulePerformance = () => {
    const collapseItems = mockModuleData.response.modules.map(
      (module: Module) => ({
        key: module.moduleId,
        label: (
          <div className="flex items-center justify-between pr-4 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                Chương {module.positionIndex}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {module.moduleName}
              </span>
              {getStatusTag(module.status)}
            </div>

            <div className="flex items-center gap-4 text-sm shrink-0">
              <span className="text-gray-600 dark:text-gray-400">
                Tiến độ:{" "}
                <span className="font-semibold text-[#49BBBD]">
                  {module.percentCompleted.toFixed(1)}%
                </span>
              </span>
            </div>
          </div>
        ),
        children: <div className="text-gray-600">Module content pending...</div>,
      })
    );

    return (
      <Collapse
        items={collapseItems}
        activeKey={expandedModuleKeys}
        onChange={(keys) => setExpandedModuleKeys(keys as string[])}
      />
    );
  };

  // Lesson Performance Component (using mock data for now)
  const LessonPerformance = () => {
    return (
      <div className="text-gray-600 dark:text-gray-400">
        <p>Lesson performance data pending...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Course Information */}
        <CourseInformation />

        {/* Tabs for different views */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "modules",
              label: "Hiệu suất Chương",
              children: <ModulePerformance />,
            },
            {
              key: "lessons",
              label: "Hiệu suất Bài học",
              children: <LessonPerformance />,
            },
          ]}
        />
      </div>
    </div>
  );
}
