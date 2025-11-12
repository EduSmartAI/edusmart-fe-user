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

// Mock markdown content for improvement details
export const mockImprovementContent = `## Tổng quan
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

export const test = `# Cần phát triển thêm kỹ năng phân tích và đánh giá thông tin\n\nKhông tìm thấy kết quả phù hợp. Hãy mô tả cụ thể hơn hoặc đổi chủ đề.`;

export default function CoursePerformancePage() {
  const [activeTab, setActiveTab] = useState<string>("overall");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedLessonKeys, setExpandedLessonKeys] = useState<string[]>([]);
  const [expandedModuleKeys, setExpandedModuleKeys] = useState<string[]>([]);

  // Mock data for overall performance
  const mockOverallData: OverallPerformance = {
    courseName: "Programming Fundamentals with C",
    instructorName: "",
    username: "Trần Anh",
    durationText: "11h 10m",
    totalVideos: 6,
    totalQuizzes: 9,
    startDate: "2025-10-21T22:57:09.833783Z",
    level: 1,
    progress: {
      completedPercent: 33.33,
      lessonsCompleted: 2,
      lessonsTotal: 6,
      quizTotal: 9,
      averageScore: 29.41,
      averageAiScore: 29.41,
      totalLearningTime: "01:58:57",
    },
    aiEvaluationMarkdown: `## Tổng quan
- Số bài đã chấm là 4 với **điểm do AI chấm** là 0. Điểm trung bình cho thấy học viên chưa đạt yêu cầu trong các bài kiểm tra. 
- Mức hiệu chỉnh trung bình là 0.

### Bảng tổng quan
| Chỉ số | Giá trị |
|---|---|
| Số đánh giá | 4 |
| Điểm AI trung bình | 0 |
| Điểm thô trung bình | — |
| Mức hiệu chỉnh trung bình | 0 |
| Số bài theo scope | Lesson: 4 · Module: 0 |
| Ghi chú | Điểm hiện tại là 'điểm do AI chấm'. Khống hiển thị điểm gốc. |

### Nhận xét tổng quan
- Kết quả học tập cho thấy học viên gặp khó khăn trong việc nắm bắt kiến thức cần thiết. Xu hướng điểm cho thấy cần có sự cải thiện đáng kể để đạt yêu cầu.

## Điểm mạnh nổi bật
- Không có điểm mạnh nào được ghi nhận trong các bài kiểm tra.

## Vấn đề & Khoảng trống kỹ năng
- Cần cải thiện hiểu biết về các phạm vi dịch vụ.
- Thiếu kiến thức về attribute [ApiController] và vai trò của nó trong ASP.NET.
- Cần tìm hiểu về NuGet và quản lý package trong .NET.

## Phân tầng chất lượng
- Tất cả các bài kiểm tra đều nằm trong ngưỡng "Nguy cơ" (< 50). 
- Dựa trên các mẫu gần nhất, có thể thấy rằng học viên cần tập trung vào việc củng cố kiến thức cơ bản, vì không có bài nào đạt yêu cầu tối thiểu.

## Ưu tiên hành động (1–2 tuần)
- Ôn tập kiến thức về Dependency Injection, mỗi ngày 2–3 bài ngắn.
- Luyện tập hiểu biết về Controllers 101, mỗi ngày 2–3 bài ngắn.
- Làm bài tập về Dev Environment Setup, mỗi ngày 2–3 bài ngắn.

## Nhóm rủi ro cao

### 🔹 Lesson có điểm thấp
| Lesson | Module liên quan | Điểm AI TB | Số bài | Đánh giá ngắn |
|---|---|---|---|---|
| Dependency Injection | Web API Basics | 0 | 1 | Cần cải thiện hiểu biết về các phạm vi dịch vụ. |
| Controllers 101 | Web API Basics | 0 | 1 | Cần tìm hiểu về attribute [ApiController]. |
| Dev Environment Setup | Introduction | 0 | 1 | Cần cải thiện kiến thức về quản lý package trong .NET. |

**Phân tích nhanh (Lesson)**
- Có 3 lesson rủi ro với điểm trung bình từ 0 đến 0.
- Chủ đề lặp lại đáng chú ý: Web API Basics: 2 lesson.
- Vấn đề phổ biến: thiếu hiểu biết về các phạm vi dịch vụ và attribute [ApiController].
- Gợi ý trọng tâm: Tập trung vào việc cải thiện kiến thức về các phạm vi dịch vụ.

## Nguyên nhân gốc
- Thiếu nền tảng khái niệm về các phạm vi dịch vụ.
- Đọc hiểu đề yếu, dẫn đến việc không nắm bắt được yêu cầu bài kiểm tra.
- Thời gian luyện tập không đều, không đủ để củng cố kiến thức.

## Gợi ý học tập nhanh
- Tìm kiếm tài liệu học tập về ASP.NET Core và Web API.
- Thực hành qua các bài tập ngắn liên quan đến Dependency Injection và quản lý package trong .NET.
- Tham gia các khóa học trực tuyến để củng cố kiến thức cơ bản.`,
    performance: {
      avgMinutesPerLesson: 59.475,
      rank: 1,
      fasterCount: 0,
      slowerCount: 0,
      analysis:
        "Tốc độ học của bạn đang tương đương mức trung bình, nhanh hơn khoảng 0% số học viên trong khoá (xếp hạng 1/13).",
    },
    learningBehavior: {
      lastAccessed: "2025-11-07T00:00:00",
      mostActiveSlot: "morning",
      totalPauseCount: 10,
      scrollVideoCount: 1,
      rewindTimes: 5,
      averageRewatchPerLesson: 2.5,
      averagePausePerLesson: 5,
      streaks: [
        {
          startDate: "2025-11-07T00:00:00",
          endDate: "2025-11-07T00:00:00",
          days: 1,
        },
        {
          startDate: "2025-10-07T00:00:00",
          endDate: "2025-10-08T00:00:00",
          days: 2,
        },
        {
          startDate: "2025-10-01T00:00:00",
          endDate: "2025-10-03T00:00:00",
          days: 3,
        },
      ],
    },
  };

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

  // Overall Performance Component
  const OverallPerformance = () => {
    const data = mockOverallData;

    // Helper to format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    // Helper to get time slot label
    const getTimeSlotLabel = (slot: string) => {
      const slotMap: Record<string, string> = {
        morning: "Buổi sáng",
        afternoon: "Buổi chiều",
        evening: "Buổi tối",
        night: "Buổi đêm",
      };
      return slotMap[slot] || slot;
    };

    return (
      <div className="space-y-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Completed Percent */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-teal-200/50 dark:border-teal-800/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tiến độ hoàn thành
              </h3>
            </div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
              {data.progress.completedPercent.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {data.progress.lessonsCompleted}/{data.progress.lessonsTotal} bài
              học
            </div>
            <Progress
              percent={data.progress.completedPercent}
              strokeColor="#49BBBD"
              showInfo={false}
              className="mt-2"
            />
          </div>

          {/* Learning Time */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Thời gian học thực tế
              </h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {data.progress.totalLearningTime}
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Điểm trung bình
              </h3>
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
              {data.progress.averageScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Điểm AI: {data.progress.averageAiScore.toFixed(1)}
            </div>
          </div>

          {/* Quiz Count */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bài kiểm tra
              </h3>
              <svg
                className="w-5 h-5 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {data.progress.quizTotal}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Tổng số bài kiểm tra
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Phân tích thành tích
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Tốc độ học trung bình
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.performance.avgMinutesPerLesson.toFixed(1)} phút/bài
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Xếp hạng
                </span>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  #{data.performance.rank}
                </span>
              </div>
            </div>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200/50 dark:border-teal-800/50">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.performance.analysis}
              </p>
            </div>
          </div>
        </div>

        {/* Learning Behavior */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Thói quen học tập
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Lần truy cập gần nhất
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatDate(data.learningBehavior.lastAccessed)}
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Thời gian học hiệu quả
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {getTimeSlotLabel(data.learningBehavior.mostActiveSlot)}
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Chuỗi học dài nhất
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {Math.max(...data.learningBehavior.streaks.map((s) => s.days))}{" "}
                ngày
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.learningBehavior.totalPauseCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Số lần dừng
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {data.learningBehavior.rewindTimes}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Số lần xem lại
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.learningBehavior.averagePausePerLesson.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                TB dừng/bài
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.learningBehavior.averageRewatchPerLesson.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                TB xem lại/bài
              </div>
            </div>
          </div>
        </div>

        {/* AI Evaluation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Đánh giá từ AI
            </h3>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownView
              content={data.aiEvaluationMarkdown}
              collapsible
              collapsedHeight={300}
            />
          </div>
        </div>
      </div>
    );
  };

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
    const moduleCollapseItems = mockLessonData.response.modules.map(
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
                const isNotStarted = lesson.status === 0;

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
                                                    setIsModalOpen(true);
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <CourseInformation />
        </div>

        
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
