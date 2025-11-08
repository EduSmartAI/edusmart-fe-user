"use client";

import React, { useState } from "react";
import { Card, Tabs, Progress, Tag, Collapse, Modal } from "antd";
import { mockCourseData, mockModuleData, mockLessonData } from "./mockData";
import { MarkdownView } from "EduSmart/components/MarkDown/MarkdownView";

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

export default function CoursePerformancePage() {
  const [activeTab, setActiveTab] = useState<string>("module");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock markdown content for improvement details
  const mockImprovementContent = `## Tổng quan
- Khóa học đã có 3 bài được chấm với **điểm do AI chấm** trung bình là 33.33. 
- Mức hiệu chỉnh trung bình là 0.

### Bảng tổng quan
| Chỉ số | Giá trị |
|---|---|
| Số đánh giá | 3 |
| Điểm AI trung bình | 33.33 |
| Điểm thô trung bình | 33.33 |
| Mức hiệu chỉnh trung bình | 0 |
| Số bài theo scope | Lesson: 3 · Module: 0 |
| Ghi chú | Điểm hiện tại là 'điểm do AI chấm'. Khống hiển thị điểm gốc. |

### Nhận xét tổng quan
- Kết quả học tập cho thấy điểm số thấp, cho thấy học viên cần cải thiện kỹ năng trong các bài học. Xu hướng điểm hiện tại cho thấy sự cần thiết phải củng cố kiến thức và kỹ năng.

## Điểm mạnh nổi bật
- Có kiến thức cơ bản về hình ảnh chuyên nghiệp.
- Giảng viên chia sẻ kiến thức thực tế.
- Hiểu rõ về khái niệm đánh giá đầu vào và ứng dụng trong thực tế.

## Vấn đề & Khoảng trống kỹ năng
- Cần cải thiện khả năng phân tích và đánh giá thông tin.
- Cần tìm hiểu thêm về các phương pháp học nhanh và hiệu quả.
- Cần củng cố kỹ năng giao tiếp và tạo niềm tin cho học viên.

## Phân tầng chất lượng
- Dựa trên các mẫu gần nhất, tỷ trọng ước lượng cho thấy không có học viên nào đạt mức xuất sắc, một số học viên có thể ở mức cần củng cố, trong khi đa số đang ở mức nguy cơ. Hạn chế dữ liệu từ số mẫu ít (3 mẫu) có thể ảnh hưởng đến độ chính xác của phân tích.

## Ưu tiên hành động (1–2 tuần)
- Ôn lại kiến thức về phân tích và đánh giá thông tin mỗi ngày 2–3 bài ngắn.
- Luyện tập kỹ năng giao tiếp thông qua các buổi thảo luận nhóm.
- Làm bài tập thực hành về tạo niềm tin cho học viên.
- Viết nhật ký học tập để theo dõi tiến bộ cá nhân.

## Nhóm rủi ro cao
### 🔹 Lesson có điểm thấp
| Lesson | Module liên quan | Điểm AI TB | Số bài | Đánh giá ngắn |
|---|---|---|---|---|
| Giữ hình ảnh chuyên nghiệp trước học viên | Củng cố hình ảnh chuyên nghiệp | 0 | 1 | Cần cải thiện kỹ năng và kiến thức. |
| Tạo sự tin tưởng với học viên | Tạo sự tin tưởng ban đầu | 0 | 1 | Cần củng cố kỹ năng giao tiếp. |

**Phân tích nhanh (Lesson)**
- Có 2 lesson rủi ro với điểm trung bình từ 0 đến 0.
- Chủ đề lặp lại đáng chú ý: Củng cố hình ảnh chuyên nghiệp: 1 lesson, Tạo sự tin tưởng ban đầu: 1 lesson.
- Vấn đề phổ biến: Thiếu kỹ năng phân tích và đánh giá thông tin, kỹ năng giao tiếp yếu.
- Gợi ý trọng tâm: Cần cải thiện kỹ năng giao tiếp và tạo niềm tin cho học viên.

### 🔸 Module có điểm thấp
- Không có module nào ở mức rủi ro.

**Phân tích nhanh (Module)**
- —

## Nguyên nhân gốc
- Thiếu nền tảng khái niệm trong các bài học.
- Kỹ năng giao tiếp và tạo niềm tin cho học viên chưa được phát triển.
- Thời gian luyện tập không đều và không đủ.

## Xu hướng theo thời gian
- — 

## Gợi ý học tập nhanh
- Tìm kiếm tài liệu học tập trực tuyến về phân tích và đánh giá thông tin.
- Tham gia các khóa học kỹ năng giao tiếp.
- Luyện tập qua các bài tập thực hành hàng ngày.`;

  // Helper function to get level label
  const getLevelLabel = (level: number) => {
    const levelMap: Record<number, string> = {
      1: "Cơ bản",
      2: "Trung bình",
      3: "Nâng cao",
    };
    return levelMap[level] || "Không xác định";
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
              {mockCourseData.response.subjectCode}
            </span>
            {/* <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white text-sm font-medium">
              {getLevelLabel(mockCourseData.response.level)}
            </span> */}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white">
            {mockCourseData.response.title}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-base">
            {mockCourseData.response.shortDescription}
          </p>
        </div>

        {/* Course Stats */}
        <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/10 backdrop-blur-md rounded-md border border-white/30 shadow-xl mt-2">
          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Cấp độ
            </div>
            <div className="text-base font-bold text-white text-center">
              {getLevelLabel(mockCourseData.response.level)}
            </div>
          </div>

          <div className="w-px h-12 bg-white/30"></div>

          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Tổng chương
            </div>
            <div className="text-base font-bold text-white text-center">
              {mockCourseData.modulesCount}
            </div>
          </div>

          <div className="w-px h-12 bg-white/30"></div>

          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Tổng bài học
            </div>
            <div className="text-base font-bold text-white text-center">
              {mockCourseData.lessonsCount}
            </div>
          </div>

          <div className="w-px h-12 bg-white/30"></div>

          <div className="flex flex-col">
            <div className="text-xs text-cyan-100 font-semibold uppercase tracking-wider mb-2">
              Thời lượng khóa học
            </div>
            <div className="text-base font-bold text-white text-center">
              {mockCourseData.response.durationHours.toFixed(1)}h
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Module Performance Component
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
                        Bài kiểm tra
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {module.totalQuizCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      tổng số
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
                      / tổng số bài kiểm tra
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
                                        onClick={() => setIsModalOpen(true)}
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
      }),
    );

    return (
      <Collapse
        items={collapseItems}
        defaultActiveKey={[mockModuleData.response.modules[0]?.moduleId]}
      />
    );
  };

  // Lesson Performance Component
  const LessonPerformance = () => {
    const collapseItems = mockLessonData.response.modules.map(
      (module: ModuleWithLessons) => ({
        key: module.moduleId,
        label: (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Chương {module.positionIndex}
            </span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              {module.moduleName}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({module.lessons.length} bài học)
            </span>
          </div>
        ),
        children: (
          <div className="space-y-3">
            {module.lessons.map((lesson: Lesson) => (
              <Card
                key={lesson.lessonId}
                className="hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Bài {lesson.positionIndex}
                        </span>
                        {getStatusTag(lesson.status)}
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        {lesson.title}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Đã xem
                      </div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {lesson.percentWatched.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Thời gian học
                      </div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {lesson.actualStudyMinutes} phút
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Bài kiểm tra
                      </div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {lesson.lessonQuizCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Điểm AI
                      </div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {lesson.aiScore !== null ? lesson.aiScore : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Progress
                      percent={lesson.percentWatched}
                      strokeColor="#49BBBD"
                      trailColor="#e5e7eb"
                      showInfo={false}
                    />
                  </div>

                  {lesson.aiFeedbackSummary && (
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Đánh giá của AI
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {lesson.aiFeedbackSummary}
                        </p>
                      </div>

                      {lesson.aiStrengths && lesson.aiStrengths.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Điểm mạnh
                          </h6>
                          <ul className="space-y-1">
                            {lesson.aiStrengths.map(
                              (strength: string, index: number) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 dark:text-gray-300 pl-4 relative before:content-['•'] before:absolute before:left-0"
                                >
                                  {strength}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {lesson.aiImprovementResources &&
                        lesson.aiImprovementResources.length > 0 && (
                          <div>
                            <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Gợi ý cải thiện
                            </h6>
                            <div className="space-y-2">
                              {lesson.aiImprovementResources.map(
                                (resource: ImprovementResource) => (
                                  <div
                                    key={resource.improvementId}
                                    className="text-sm text-gray-700 dark:text-gray-300 pl-4 relative before:content-['•'] before:absolute before:left-0"
                                  >
                                    {resource.improvementText}
                                    {resource.contentMarkdown && (
                                      <button className="ml-2 text-xs text-[#49BBBD] hover:underline">
                                        Xem thêm
                                      </button>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ),
      }),
    );

    return (
      <Collapse
        items={collapseItems}
        defaultActiveKey={[mockLessonData.response.modules[0]?.moduleId]}
      />
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <CourseInformation />
        </div>

        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "module",
                label: "Hiệu suất theo Chương",
                children: <ModulePerformance />,
              },
              {
                key: "lesson",
                label: "Hiệu suất theo Bài học",
                children: <LessonPerformance />,
              },
            ]}
          />
        </Card>
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
        <MarkdownView
          content={mockImprovementContent}
          collapsible
          collapsedHeight={400}
        />
      </Modal>
    </div>
  );
}
