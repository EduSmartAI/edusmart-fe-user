/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Card, Tabs, Tag, Collapse, Modal, Spin, Row, Col } from "antd";
import { MarkdownView } from "EduSmart/components/MarkDown/MarkdownView";
import type { CourseDetailForGuestDto } from "EduSmart/api/api-course-service";
import type { OverviewCourseContract } from "EduSmart/api/api-student-service";
import { fetchImprovementContentClient } from "EduSmart/hooks/api-client/courseApiClient";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import BaseControlCarousel from "EduSmart/components/Carousel/BaseControlCarousel";
import StreakChart from "./StreakChart";
import {
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiClock,
  FiEye,
  FiRotateCcw,
  FiPause,
  FiSkipForward,
  FiAward,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import { GiProgression } from "react-icons/gi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  overallPerformance?: OverviewCourseContract | null;
}

export default function CoursePerformanceClient({
  courseDetail,
  modulesCount,
  lessonsCount,
  modulePerformance,
  lessonPerformance,
  overallPerformance,
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

  // const test =
  //   "## Tổng quan\n- Khóa học đã có 3 bài được chấm với **điểm do AI chấm** trung bình là 33.33. \n- Mức hiệu chỉnh trung bình là 0.\n\n### Bảng tổng quan\n| Chỉ số | Giá trị |\n|---|---|\n| Số đánh giá | 3 |\n| Điểm AI trung bình | 33.33 |\n| Điểm thô trung bình | 33.33 |\n| Mức hiệu chỉnh trung bình | 0 |\n| Số bài theo scope | Lesson: 3 · Module: 0 |\n| Ghi chú | Điểm hiện tại là 'điểm do AI chấm'. Khống hiển thị điểm gốc. |\n\n### Nhận xét tổng quan\n- Kết quả học tập cho thấy điểm số thấp, cho thấy học viên cần cải thiện kỹ năng trong các bài học. Xu hướng điểm hiện tại cho thấy sự cần thiết phải củng cố kiến thức và kỹ năng.\n\n## Điểm mạnh nổi bật\n- Có kiến thức cơ bản về hình ảnh chuyên nghiệp.\n- Giảng viên chia sẻ kiến thức thực tế.\n- Hiểu rõ về khái niệm đánh giá đầu vào và ứng dụng trong thực tế.\n\n## Vấn đề & Khoảng trống kỹ năng\n- Cần cải thiện khả năng phân tích và đánh giá thông tin.\n- Cần tìm hiểu thêm về các phương pháp học nhanh và hiệu quả.\n- Cần củng cố kỹ năng giao tiếp và tạo niềm tin cho học viên.\n\n## Phân tầng chất lượng\n- Dựa trên các mẫu gần nhất, tỷ trọng ước lượng cho thấy không có học viên nào đạt mức xuất sắc, một số học viên có thể ở mức cần củng cố, trong khi đa số đang ở mức nguy cơ. Hạn chế dữ liệu từ số mẫu ít (3 mẫu) có thể ảnh hưởng đến độ chính xác của phân tích.\n\n## Ưu tiên hành động (1–2 tuần)\n- Ôn lại kiến thức về phân tích và đánh giá thông tin mỗi ngày 2–3 bài ngắn.\n- Luyện tập kỹ năng giao tiếp thông qua các buổi thảo luận nhóm.\n- Làm bài tập thực hành về tạo niềm tin cho học viên.\n- Viết nhật ký học tập để theo dõi tiến bộ cá nhân.\n\n## Nhóm rủi ro cao\n### 🔹 Lesson có điểm thấp\n| Lesson | Module liên quan | Điểm AI TB | Số bài | Đánh giá ngắn |\n|---|---|---|---|---|\n| Giữ hình ảnh chuyên nghiệp trước học viên | Củng cố hình ảnh chuyên nghiệp | 0 | 1 | Cần cải thiện kỹ năng và kiến thức. |\n| Tạo sự tin tưởng với học viên | Tạo sự tin tưởng ban đầu | 0 | 1 | Cần củng cố kỹ năng giao tiếp. |\n\n**Phân tích nhanh (Lesson)**\n- Có 2 lesson rủi ro với điểm trung bình từ 0 đến 0.\n- Chủ đề lặp lại đáng chú ý: Củng cố hình ảnh chuyên nghiệp: 1 lesson, Tạo sự tin tưởng ban đầu: 1 lesson.\n- Vấn đề phổ biến: Thiếu kỹ năng phân tích và đánh giá thông tin, kỹ năng giao tiếp yếu.\n- Gợi ý trọng tâm: Cần cải thiện kỹ năng giao tiếp và tạo niềm tin cho học viên.\n\n### 🔸 Module có điểm thấp\n- Không có module nào ở mức rủi ro.\n\n**Phân tích nhanh (Module)**\n- —\n\n## Nguyên nhân gốc\n- Thiếu nền tảng khái niệm trong các bài học.\n- Kỹ năng giao tiếp và tạo niềm tin cho học viên chưa được phát triển.\n- Thời gian luyện tập không đều và không đủ.\n\n## Xu hướng theo thời gian\n- — \n\n## Gợi ý học tập nhanh\n- Tìm kiếm tài liệu học tập trực tuyến về phân tích và đánh giá thông tin.\n- Tham gia các khóa học kỹ năng giao tiếp.\n- Luyện tập qua các bài tập thực hành hàng ngày.";

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
    <div className="bg-[#49BBBD]/90 rounded-lg p-6 shadow-lg">
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
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#49BBBD]/10 text-[#49BBBD] rounded-lg text-sm font-medium">
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
              </div> */}
            </div>
          ) : (
            // Has Data State
            <>
              {/* Description */}
              <div className="mb-6 mt-2">
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
                      Bài kiểm tra
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
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/80 dark:border-gray-800">
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
                          {/* <div className="inline-flex items-center mt-1 gap-2 px-4 py-2 bg-[#49BBBD]/10 text-[#49BBBD] rounded-lg text-sm font-medium">
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
                          </div> */}
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
                                Thời gian học
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
                                Bài kiểm tra
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
                              className="p-5 bg-gray-50/60 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-900"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300/50 dark:border-gray-800">
                                <h5 className="text-sm font-semibold! text-gray-900 dark:text-white">
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

  // Helper function to get time slot label
  const getTimeSlotLabel = (slot: string | number | undefined) => {
    const slotMap: Record<string | number, string> = {
      morning: "Buổi sáng",
      afternoon: "Buổi chiều",
      evening: "Buổi tối",
      night: "Buổi đêm",
      0: "Không xác định",
      1: "Buổi sáng",
      2: "Buổi chiều",
      3: "Buổi tối",
      4: "Buổi đêm",
    };
    return slotMap[slot || ""] || "Chưa xác định";
  };

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "—";
    const parsed = new Date(value);
    const year = parsed.getFullYear();
    if (Number.isNaN(parsed.getTime()) || year < 2000) return "—";
    return parsed.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const formatDateShort = (value: string | null | undefined) => {
    if (!value) return "";
    const parsed = new Date(value);
    const year = parsed.getFullYear();
    if (Number.isNaN(parsed.getTime()) || year < 2000) return "";
    return parsed.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Overall Performance Component
  const OverallPerformance = () => {
    // Calculate streaks data before early return to ensure hooks are called consistently
    const streaks = overallPerformance?.learningBehavior?.streaks || [];
    const getDateValue = (value?: string) => {
      const parsed = value ? new Date(value).getTime() : 0;
      return Number.isNaN(parsed) ? 0 : parsed;
    };
    const sortedStreaks = [...streaks].sort(
      (a, b) =>
        getDateValue(b.endDate || b.startDate) -
        getDateValue(a.endDate || a.startDate),
    );
    const longestStreak =
      sortedStreaks.reduce(
        (best, streak) =>
          (streak.days ?? 0) > (best?.days ?? 0) ? streak : best,
        null as (typeof sortedStreaks)[number] | null,
      ) || null;
    const currentStreak = sortedStreaks[0] || null;
    const recentStreaks = sortedStreaks.slice(0, 7).reverse();
    const maxStreakDays = longestStreak?.days ?? 1;
    
    // useMemo must be called before any early returns
    const streakChartData = useMemo(
      () =>
        recentStreaks.map((streak, idx) => {
          const days = typeof streak.days === "number" ? streak.days : 0;
          const label =
            formatDateShort(streak.endDate || streak.startDate) ||
            `#${idx + 1}`;
          return { label, days };
        }),
      [recentStreaks],
    );
    const hasChartData = streakChartData.some((item) => item.days > 0);

    if (!overallPerformance) {
      return (
        <div className="text-center py-12 px-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Dữ liệu hiệu suất tổng quan đang được cập nhật
          </p>
          <Spin size="large" />
        </div>
      );
    }

    const {
      progress,
      performance,
      learningBehavior,
      aiEvaluationMarkdown,
      startDate,
    } = overallPerformance;

    return (
      <div className="flex flex-col gap-10 my-3">
        {/* ===== SECTION 1: TIẾN ĐỘ & TỐC ĐỘ HỌC TẬP ===== */}
        <Card
          title={
            <div className="flex items-center space-x-2">
              <GiProgression className="w-5 h-5 text-[#49BBBD]" />
              <span className="text-[#49BBBD] dark:text-cyan-400 font-semibold">
                Tiến độ học tập
              </span>
            </div>
          }
          className="border-0 shadow-md"
          style={{ borderRadius: "8px" }}
        >
          {/* Progress Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Progress Card */}
            <div className="bg-gradient-to-br from-[#49BBBD]/10 to-cyan-50 dark:from-[#49BBBD]/20 dark:to-cyan-900/20 border border-[#49BBBD]/10 dark:border-[#49BBBD]/40 p-4 rounded-lg">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Tỷ lệ hoàn thành
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <div className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400">
                  {progress?.completedPercent?.toFixed(1) || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  %
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {progress?.lessonsCompleted || 0}/{progress?.lessonsTotal || 0}{" "}
                bài học
              </div>
            </div>

            {/* Learning Time Card */}
            <div className="bg-gradient-to-br from-[#49BBBD]/10 to-cyan-50 dark:from-[#49BBBD]/20 dark:to-cyan-900/20 border border-[#49BBBD]/10 dark:border-[#49BBBD]/40 p-4 rounded-lg">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Tổng thời gian học
              </div>
              <div className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400 mb-1">
                {progress?.totalLearningTime || "0h"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Bắt đầu:{" "}
                {startDate
                  ? new Date(startDate).toLocaleDateString("vi-VN")
                  : "N/A"}
              </div>
            </div>

            {/* Quiz Card */}
            <div className="bg-gradient-to-br from-[#49BBBD]/10 to-cyan-50 dark:from-[#49BBBD]/20 dark:to-cyan-900/20 border border-[#49BBBD]/10 dark:border-[#49BBBD]/40 p-4 rounded-lg">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Bài kiểm tra
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <div className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400 mb-1">
                  {progress?.lessonsCompleted || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  /{progress?.quizTotal || 0}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Số bài đã làm
              </div>
            </div>

            {/* Average Score Card */}
            <div className="bg-gradient-to-br from-[#49BBBD]/10 to-cyan-50 dark:from-[#49BBBD]/20 dark:to-cyan-900/20 border border-[#49BBBD]/10 dark:border-[#49BBBD]/40 p-4 rounded-lg">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Điểm trung bình
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <div className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400 mb-1">
                  {progress?.averageScore?.toFixed(1) || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  /100
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Điểm AI: {progress?.averageAiScore?.toFixed(1) || 0}
              </div>
            </div>
          </div>

          {/* Speed & Rank Section - Connected Layout */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <FiTrendingUp className="w-4 h-4 text-[#49BBBD]" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Phân tích tốc độ học tập
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Speed Metric */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FiClock className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Tốc độ học TB
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {performance?.avgMinutesPerLesson?.toFixed(1) || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  phút/bài học
                </div>
              </div>

              {/* Arrow Connector */}
              <div className="hidden md:flex items-center justify-center">
                <div className="text-center">
                  <FiArrowRight className="w-6 h-6 text-[#49BBBD] mx-auto mb-2" />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    dẫn đến
                  </div>
                </div>
              </div>

              {/* Rank Metric */}
              <div className="bg-gradient-to-br from-[#49BBBD]/10 to-cyan-50 dark:from-[#49BBBD]/20 dark:to-cyan-900/20 p-4 rounded-lg border border-[#49BBBD]/30 dark:border-[#49BBBD]/40 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FiAward className="w-4 h-4 text-[#49BBBD]" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Xếp hạng của bạn
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400 mb-1">
                  #{performance?.rank || "N/A"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  trong khóa học
                </div>
              </div>
            </div>

            {/* Analysis */}
            {performance?.analysis && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-2">
                  <FiInfo className="w-4 h-4 text-[#49BBBD] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Giải thích:
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {performance.analysis}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ===== SECTION 2: THÓI QUEN & HÀNH VI HỌC TẬP ===== */}
        <Card
          title={
            <div className="flex items-center space-x-2">
              <FiActivity className="w-5 h-5 text-[#49BBBD]" />
              <span className="text-[#49BBBD] dark:text-cyan-400 font-semibold">
                {/* Thói quen & Hành vi học tập */}
                Hoạt động học tập
              </span>
            </div>
          }
          className="border-0 shadow-md"
          style={{ borderRadius: "8px" }}
        >
          {/* Behavior Metrics - Row/Col Layout like Demo */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Lần truy cập gần nhất
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningBehavior?.lastAccessed
                      ? new Date(
                          learningBehavior.lastAccessed,
                        ).toLocaleDateString("vi-VN")
                      : "Chưa có dữ liệu"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Thời gian học hiệu quả
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getTimeSlotLabel(learningBehavior?.mostActiveSlot)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiEye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Tần suất xem lại
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningBehavior?.rewindTimes || 0} lần
                  </span>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiPause className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Tần suất dừng
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningBehavior?.totalPauseCount || 0} lần
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiSkipForward className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Tần suất tua video
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningBehavior?.scrollVideoCount || 0} lần
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiRotateCcw className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      TB xem lại/bài
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningBehavior?.averageRewatchPerLesson?.toFixed(1) || 0}
                    x
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          <div className="mt-6">
            {sortedStreaks.length > 0 ? (
              <div className="bg-gradient-to-br from-emerald-50 via-cyan-50 to-white dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800/80 border border-emerald-200/70 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white shadow-sm dark:bg-gray-800/70">
                      <FiActivity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Chuỗi ngày học
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Giữ nhịp đều đặn để không mất streak
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-white/70 dark:bg-gray-800/70 px-3 py-1 rounded-full shadow-sm">
                    Duy trì streak để giữ nhịp học
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-gray-900/70 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-3 uppercase tracking-wide">
                      Chuỗi hiện tại
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                        {currentStreak?.days ?? 0}
                      </span>
                      <span className="text-base text-gray-600 dark:text-gray-400 font-medium">
                        ngày
                      </span>
                    </div>
                    {currentStreak?.startDate || currentStreak?.endDate ? (
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {formatDate(currentStreak?.startDate)} →{" "}
                        {formatDate(currentStreak?.endDate || currentStreak?.startDate)}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 dark:text-gray-500">Chưa có ngày</div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-gray-900/70 border border-cyan-100 dark:border-cyan-900/50 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-300 mb-3 uppercase tracking-wide">
                      Chuỗi dài nhất
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-cyan-600 dark:text-cyan-300">
                        {longestStreak?.days ?? 0}
                      </span>
                      <span className="text-base text-gray-600 dark:text-gray-400 font-medium">
                        ngày
                      </span>
                    </div>
                    {longestStreak?.startDate || longestStreak?.endDate ? (
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {formatDate(longestStreak?.startDate)} →{" "}
                        {formatDate(longestStreak?.endDate || longestStreak?.startDate)}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 dark:text-gray-500">Chưa có ngày</div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-gray-900/70 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
                        <FiTrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span>Xu hướng streak gần đây</span>
                    </div>
                    <StreakChart
                      data={streakChartData}
                      maxStreakDays={maxStreakDays}
                      hasData={hasChartData}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                <div className="mb-3">
                  <FiActivity className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chưa có dữ liệu streak
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hãy học đều đặn để tạo chuỗi ngày học đầu tiên.
                </p>
              </div>
            )}
          </div>

          {/* Charts Placeholder */}
          {/* <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-800/50 rounded-lg p-6 border border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-sm font-medium mb-2">
                Biểu đồ thời gian học tập
              </div>
              <div className="text-xs">
                Gauge Chart • Horizontal Bar Chart • Calendar Heatmap
              </div>
              <div className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                (Sẽ được triển khai sau)
              </div>
            </div>
          </div> */}

          {/* Additional Behavior Metrics - Compact Grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {learningBehavior?.averagePausePerLesson?.toFixed(1) || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                TB dừng/bài
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {learningBehavior?.averageRewatchPerLesson?.toFixed(1) || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                TB xem lại/bài
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {(
                  (learningBehavior?.totalPauseCount || 0) /
                  (progress?.lessonsCompleted || 1)
                ).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Tỷ lệ tương tác
              </div>
            </div>
          </div>
        </Card>

        {/* ===== SECTION 3: ĐÁNH GIÁ TỪ AI ===== */}
        {aiEvaluationMarkdown && (
          <Card
            title={
              <div className="flex items-center space-x-2">
                <TbBrandGoogleAnalytics className="w-5 h-5 text-[#49BBBD]" />
                <span className="text-[#49BBBD] dark:text-cyan-400 font-semibold">
                  Hệ thống đánh giá
                </span>
              </div>
            }
            className="border-0 shadow-md"
            style={{ borderRadius: "8px" }}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownView
                content={aiEvaluationMarkdown}
                collapsible
                collapsedHeight={400}
              />
            </div>
          </Card>
        )}

        {/* ===== SECTION 4: KHUYẾN NGHỊ KHÓA HỌC ===== */}
        {overallPerformance?.suggestedCourses &&
          overallPerformance.suggestedCourses.length > 0 && (
            <Card
              title={
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="w-5 h-5 text-[#49BBBD]" />
                  <span className="text-[#49BBBD] dark:text-cyan-400 font-semibold">
                    Khóa học đề xuất
                  </span>
                </div>
              }
              className="border-0 shadow-md"
              style={{ borderRadius: "8px" }}
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                  .course-suggestions-wrapper .ant-carousel .slick-slide > div > div.flex {
                    gap: 0.75rem !important;
                    justify-content: flex-start !important;
                  }
                  .course-suggestions-wrapper .ant-card {
                    width: 100% !important;
                    max-width: 22rem;
                  }
                `
              }} />
              <div className="course-suggestions-wrapper">
                <BaseControlCarousel
                  totalItemsPerSlide={3}
                  classItemStyle="w-full max-w-[22rem] flex-shrink-0"
                  dots={true}
                  autoplay={false}
                >
                  {overallPerformance.suggestedCourses.map((course) => {
                  const descriptionLines = course.shortDescription
                    ? course.shortDescription
                        .split(/[.!?]\s+/)
                        .filter((line) => line.trim().length > 0)
                        .slice(0, 3)
                    : [];

                  return (
                    <CourseCard
                      key={course.courseId}
                      id={course.courseId}
                      imageUrl={course.courseImageUrl || undefined}
                      title={course.title || "Khóa học"}
                      descriptionLines={descriptionLines}
                      level={course.level ?? null}
                      instructor={course.teacherName || "Giảng viên"}
                      price={course.price}
                      dealPrice={course.dealPrice ?? null}
                      routerPush={
                        course.courseId
                          ? `/course/${course.courseId}`
                          : undefined
                      }
                      tagNames={course.subjectCode ? [course.subjectCode] : []}
                    />
                  );
                })}
              </BaseControlCarousel>
              </div>
            </Card>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Course Information */}
        <div className="mb-6">
          <CourseInformation />
        </div>

        {/* Tabs for different views */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="middle"
          className=""
          items={[
            {
              key: "overall",
              label: (
                <span className="flex items-center space-x-2">
                  {/* <FiTrendingUp className="w-4 h-4" /> */}
                  <span>Hiệu suất Tổng Quan</span>
                </span>
              ),
              children: <OverallPerformance />,
            },
            {
              key: "modules",
              label: (
                <span className="flex items-center space-x-2">
                  {/* <FiLayers className="w-4 h-4" /> */}
                  <span>Hiệu suất theo Chương</span>
                </span>
              ),
              children: <ModulePerformance />,
            },
            {
              key: "lessons",
              label: (
                <span className="flex items-center space-x-2">
                  {/* <FiPlay className="w-4 h-4" /> */}
                  <span>Hiệu suất theo Bài Học</span>
                </span>
              ),
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
