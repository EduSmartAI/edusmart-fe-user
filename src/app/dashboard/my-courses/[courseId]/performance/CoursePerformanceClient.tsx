"use client";

import React, { useState } from "react";
import { Card, Tabs, Tag, Collapse, Modal, Spin } from "antd";
import { MarkdownView } from "EduSmart/components/MarkDown/MarkdownView";
import type { CourseDetailForGuestDto } from "EduSmart/api/api-course-service";
import { fetchImprovementContentClient } from "EduSmart/hooks/api-client/courseApiClient";

// Type definitions
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
  status: string | number;
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

interface OverallPerformance {
  courseName: string;
  instructorName: string;
  username: string;
  durationText: string;
  totalVideos: number;
  totalQuizzes: number;
  startDate: string;
  level: number;
  progress: {
    completedPercent: number;
    lessonsCompleted: number;
    lessonsTotal: number;
    quizTotal: number;
    averageScore: number;
    averageAiScore: number;
    totalLearningTime: string;
  };
  aiEvaluationMarkdown: string;
  performance: {
    avgMinutesPerLesson: number;
    rank: number;
    fasterCount: number;
    slowerCount: number;
    analysis: string;
  };
  learningBehavior: {
    lastAccessed: string;
    mostActiveSlot: string;
    totalPauseCount: number;
    scrollVideoCount: number;
    rewindTimes: number;
    averageRewatchPerLesson: number;
    averagePausePerLesson: number;
    streaks: Array<{
      startDate: string;
      endDate: string;
      days: number;
    }>;
  };
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
  modulePerformance?: any;
  lessonPerformance?: any;
}

export default function CoursePerformanceClient({
  courseDetail,
  modulesCount,
  lessonsCount,
  modulePerformance,
  lessonPerformance,
}: CoursePerformanceClientProps) {
  const [activeTab, setActiveTab] = useState<string>("overall");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedLessonKeys, setExpandedLessonKeys] = useState<string[]>([]);
  const [expandedModuleKeys, setExpandedModuleKeys] = useState<string[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [improvementResourcesMap, setImprovementResourcesMap] = useState<
    Record<string, string>
  >({});

  console.log("modulePerformance", modulePerformance);
  console.log("lessonPerformance", lessonPerformance);

  /**
   * Handle viewing improvement details
   * If contentMarkdown is null, fetch from API and update the map
   */
  const handleViewImprovementDetails = async (
    resource: ImprovementResource,
  ) => {
    // If already has content, use it directly
    if (resource.contentMarkdown) {
      setMarkdownContent(resource.contentMarkdown);
      setIsModalOpen(true);
      return;
    }

    // If already fetched, use cached content
    if (improvementResourcesMap[resource.improvementId]) {
      setMarkdownContent(improvementResourcesMap[resource.improvementId]);
      setIsModalOpen(true);
      return;
    }

    // Fetch from API
    try {
      setIsLoadingContent(true);
      setIsModalOpen(true);
      // setMarkdownContent("Đang tải nội dung...");

      const result = await fetchImprovementContentClient(
        resource.improvementId,
      );

      if (result.success && result.content) {
        setMarkdownContent(result.content);
        // Cache the content
        setImprovementResourcesMap((prev) => ({
          ...prev,
          [resource.improvementId]: result.content || "",
        }));
      } else {
        setMarkdownContent(`Lỗi: ${result.error || "Không thể tải nội dung"}`);
      }
    } catch (error) {
      console.error("Error loading improvement content:", error);
      setMarkdownContent("Lỗi khi tải nội dung. Vui lòng thử lại.");
    } finally {
      setIsLoadingContent(false);
    }
  };

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

  // Module Performance Component
  const ModulePerformance = () => {
    const collapseItems = modulePerformance?.modules.map((module: Module) => ({
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
      children: (
        <div className="space-y-4">
          {module.status === "NotStarted" || module.status === 0 ? (
            // Not Started State
            <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-1 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Chưa bắt đầu học chương này
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Bạn chưa có dữ liệu học tập cho chương này. Hãy bắt đầu học để
                xem phân tích hiệu suất chi tiết!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#49BBBD]/10 text-[#49BBBD] rounded-lg text-sm font-medium">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                Bắt đầu học ngay
              </div>
            </div>
          ) : (
            // Has Data State
            <>
              {/* Description */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {module.description}
                </p>
              </div>

              {/* Metrics Grid - No borders */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Bài học đã xem
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {module.lessonsCompleted}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    / {module.lessonsVideoTotal} bài học
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Thời gian học
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {module.actualStudyMinutes}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    / {module.moduleDurationMinutes} phút
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Bài kiểm tra đã làm
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {module.totalQuizCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    / tổng số
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Điểm trung bình
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {module.aiScore !== null ? module.aiScore : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    / tổng số bài kiểm đã làm
                  </div>
                </div>
              </div>

              {module.aiFeedbackSummary && (
                <div className="mt-4 p-5 bg-gray-50/60 dark:bg-gray-800/50  from-cyan-100/50 to-teal-100/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-gray-200/80 dark:border-gray-900">
                  {/* Header with AI Score */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300/50 dark:border-gray-800">
                    <h4 className="text-base font-semibold! text-gray-900 dark:text-white flex items-center gap-2">
                      Phân tích từ AI
                    </h4>
                    {module.aiScore !== null && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-md">
                        <span className="text-xs  dark:text-teal-400 font-medium">
                          Điểm AI
                        </span>
                        <span className="text-sm font-bold  dark:text-teal-300">
                          {module.aiScore}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AI Feedback Summary */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {module.aiFeedbackSummary}
                    </p>
                  </div>

                  {/* Two Column Layout for Strengths and Improvements */}
                  <div className="grid md:grid-cols-1 ">
                    {/* Strengths */}
                    {module.aiStrengths && module.aiStrengths.length > 0 && (
                      <div className=" rounded-lg">
                        <h5 className="text-sm dark:text-green-400 font-semibold  mb-3 flex items-center gap-1.5">
                          {/* <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg> */}
                          Điểm mạnh
                        </h5>
                        <ul className="space-y-2">
                          {module.aiStrengths.map(
                            (strength: string, index: number) => (
                              <li
                                key={index}
                                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-green-500 mt-0.5 shrink-0">
                                  ✓
                                </span>
                                <span className="flex-1">{strength}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Improvement Resources */}
                    {module.improvementResources &&
                      module.improvementResources.length > 0 && (
                        <div className=" rounded-lg">
                          <h5 className="text-sm font-semibold dark:text-orange-400 mb-3 flex items-center gap-1.5">
                            {/* <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg> */}
                            Gợi ý cải thiện
                          </h5>
                          <ul className="space-y-2">
                            {module.improvementResources.map(
                              (resource: ImprovementResource) => (
                                <li
                                  key={resource.improvementId}
                                  className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                                >
                                  <span className="text-orange-500 mt-0.5 shrink-0">
                                    →
                                  </span>
                                  <div className="flex-1">
                                    <span>{resource.improvementText}</span>
                                    <button
                                      onClick={() =>
                                        handleViewImprovementDetails(resource)
                                      }
                                      className="ml-1.5 text-xs text-[#49BBBD] hover:underline font-medium inline-flex items-center gap-0.5"
                                    >
                                      <span className="ml-1.5 text-xs text-orange-500 hover:underline font-medium inline-flex items-center gap-0.5">
                                        Xem chi tiết
                                      </span>
                                    </button>
                                  </div>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ),
    }));

    return (
      <Collapse
        items={collapseItems}
        activeKey={expandedModuleKeys}
        onChange={(keys) => setExpandedModuleKeys(keys as string[])}
      />
    );
  };

  // Lesson Performance Component
  const LessonPerformance = () => {
    const moduleCollapseItems = lessonPerformance?.modules.map(
      (module: ModuleWithLessons) => ({
        key: module.moduleId,
        label: (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
              Chương {module.positionIndex}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {module.moduleName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto shrink-0">
              {module.lessons.length} bài học{" "}
            </span>
          </div>
        ),
        children: (
          <div className="space-y-2">
            {/* Nested Collapse for Lessons */}
            <Collapse
              activeKey={expandedLessonKeys}
              onChange={(keys) => setExpandedLessonKeys(keys as string[])}
              items={module.lessons.map((lesson: Lesson) => {
                const isNotStarted =
                  lesson.status === 0 || lesson.status === "NotStarted";

                return {
                  key: lesson.lessonId,
                  label: (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
                          Bài {lesson.positionIndex}
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {lesson.title}
                        </span>
                        <span className="text-xs">
                          {getStatusTag(lesson.status)}
                        </span>
                      </div>
                    </div>
                  ),
                  children: (
                    <div className={isNotStarted ? "" : "pt-2"}>
                      {isNotStarted ? (
                        <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-1 border-dashed border-gray-300 dark:border-gray-700">
                          <div className="text-gray-400 dark:text-gray-500 mb-2">
                            <svg
                              className="w-16 h-16 mx-auto mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <div className="mb-2">
                            {" "}
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              Chưa có dữ liệu học tập{" "}
                            </h5>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Bạn chưa bắt đầu học bài này. Hãy bắt đầu để xem
                            phân tích hiệu suất!{" "}
                          </p>
                          <div className="inline-flex items-center mt-1 gap-2 px-4 py-2 bg-[#49BBBD]/10 text-[#49BBBD] rounded-lg text-sm font-medium">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                            Bắt đầu học ngay
                          </div>
                        </div>
                      ) : (
                        // Has Data State
                        <div className="space-y-4">
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Đã xem
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {lesson.percentWatched.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {Math.floor(
                                  (lesson.videoDurationSeconds *
                                    lesson.percentWatched) /
                                    100,
                                )}
                                /{lesson.videoDurationSeconds}s
                              </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Thời gian học thực tế
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {lesson.actualStudyMinutes}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                phút
                              </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Bài kiểm tra đã làm
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {lesson.lessonQuizCount}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                bài
                              </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Điểm trung bình
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {lesson.averageQuizScore !== null
                                  ? lesson.averageQuizScore
                                  : "N/A"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                / tổng số bài kiểm đã làm
                              </div>
                            </div>
                          </div>

                          {/* AI Feedback Section */}
                          {lesson.aiFeedbackSummary && (
                            <div
                              className="p-4 bg-gray-50/60 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-900"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300/50 dark:border-gray-800">
                                <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Phân tích từ AI
                                </h5>
                                {lesson.aiScore !== null && (
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-md">
                                    <span className="text-xs dark:text-teal-400 font-medium">
                                      Điểm AI
                                    </span>
                                    <span className="text-sm font-bold dark:text-teal-300">
                                      {lesson.aiScore}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Summary */}
                              <div className="mb-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {lesson.aiFeedbackSummary}
                                </p>
                              </div>

                              {/* Strengths and Improvements */}
                              <div
                                className="grid md:grid-cols-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lesson.aiStrengths &&
                                  lesson.aiStrengths.length > 0 && (
                                    <div
                                      className="rounded-lg"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <h6 className="text-sm dark:text-green-400 font-semibold mb-2">
                                        Điểm mạnh
                                      </h6>
                                      <ul
                                        className="space-y-1.5"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {lesson.aiStrengths.map(
                                          (strength: string, index: number) => (
                                            <li
                                              key={index}
                                              className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                                            >
                                              <span className="text-green-500 mt-0.5 shrink-0">
                                                ✓
                                              </span>
                                              <span className="flex-1">
                                                {strength}
                                              </span>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {lesson.aiImprovementResources &&
                                  lesson.aiImprovementResources.length > 0 && (
                                    <div
                                      className="rounded-lg mt-3"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <h6 className="text-sm font-semibold dark:text-orange-400 mb-2">
                                        Gợi ý cải thiện
                                      </h6>
                                      <ul
                                        className="space-y-1.5"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {lesson.aiImprovementResources.map(
                                          (resource: ImprovementResource) => (
                                            <li
                                              key={resource.improvementId}
                                              className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <span className="text-orange-500 mt-0.5 shrink-0">
                                                →
                                              </span>
                                              <div className="flex-1">
                                                <span>
                                                  {resource.improvementText}
                                                </span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewImprovementDetails(
                                                      resource,
                                                    );
                                                  }}
                                                  className="ml-1.5 text-xs text-[#49BBBD] hover:underline font-medium inline-flex items-center gap-0.5"
                                                >
                                                  <span className="ml-1.5 text-xs text-orange-500 hover:underline font-medium inline-flex items-center gap-0.5">
                                                    Xem chi tiết
                                                  </span>
                                                </button>
                                              </div>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ),
                };
              })}
              className="lesson-collapse"
            />
          </div>
        ),
      }),
    );

    return (
      <Collapse
        items={moduleCollapseItems}
        activeKey={expandedModuleKeys}
        onChange={(keys) => setExpandedModuleKeys(keys as string[])}
      />
    );
  };

  // Overall Performance Component (placeholder)
  const OverallPerformance = () => {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Dữ liệu hiệu suất tổng quan đang được cập nhật
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#49BBBD]/10 text-[#49BBBD] rounded-lg text-sm font-medium">
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Đang tải...
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Course Information */}
        <div className="mb-6">
          <CourseInformation />
        </div>

        {/* Tabs for different views */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "overall",
              label: "Hiệu suất Tổng Quan",
              children: <OverallPerformance />,
            },
            {
              key: "modules",
              label: "Hiệu suất theo Chương",
              children: <ModulePerformance />,
            },
            {
              key: "lessons",
              label: "Hiệu suất theo Bài học",
              children: <LessonPerformance />,
            },
          ]}
        />
      </div>

      {/* Modal for Improvement Details */}
      <Modal
        title="Chi tiết gợi ý cải thiện"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
        centered
        className="py-10!"
      >
        <Spin spinning={isLoadingContent} tip="Đang tải nội dung...">
          <MarkdownView
            content={markdownContent}
            collapsible
            collapsedHeight={400}
          />
        </Spin>
      </Modal>
    </div>
  );
}
