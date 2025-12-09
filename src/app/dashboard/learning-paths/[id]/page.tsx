"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Tabs,
  Tag,
  Modal,
  Table,
  Spin,
  Button,
  Carousel,
  Select,
  message,
  Collapse,
  Progress,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import { MarkdownBlock } from "EduSmart/components/MarkDown/MarkdownBlock";
import { learningPathsChooseMajorUpdate } from "EduSmart/app/apiServer/learningPathAction";
import {
  FiCheck,
  FiPlus,
  FiMinus,
  FiMove,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiExternalLink,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiGlobe,
} from "react-icons/fi";
import { getStudentTranscriptServer } from "EduSmart/app/(student)/studentAction";
import type { StudentTranscriptRecord } from "EduSmart/app/(student)/studentAction";
import {
  CourseGroupDto as GeneratedCourseGroupDto,
  CourseItemDto,
  ExternalLearningPathDto,
  LearningPathSelectDto as GeneratedLearningPathSelectDto,
  LearningPathSelectResponse,
  CourseBasicInfoDto,
} from "EduSmart/api/api-student-service";
import { StudentClient, AIClient } from "EduSmart/hooks/apiClient";

const SNAPSHOT_ENDPOINT = "/api/learning-paths";
const STREAM_ENDPOINT = "/api/learning-paths/stream";

enum LearningPathStatus {
  Generating = 0,
  Choosing = 1,
  InProgress = 2,
  Completed = 3,
  Closed = 4,
  Paused = 5,
}

const LEARNING_PATH_STATUS_LABEL: Record<LearningPathStatus, string> = {
  [LearningPathStatus.Generating]: "Đang dựng lộ trình",
  [LearningPathStatus.Choosing]: "Đang chọn chuyên ngành",
  [LearningPathStatus.InProgress]: "Đang học",
  [LearningPathStatus.Completed]: "Đã hoàn thành",
  [LearningPathStatus.Closed]: "Đã đóng",
  [LearningPathStatus.Paused]: "Tạm dừng",
};

// Level mapping và config
const LEVEL_CONFIG = {
  1: {
    label: "Cơ bản",
    color: "green",
    bgGradient:
      "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    badgeColor:
      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    iconColor: "text-green-600 dark:text-green-400",
  },
  2: {
    label: "Trung cấp",
    color: "blue",
    bgGradient:
      "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  3: {
    label: "Nâng cao",
    color: "purple",
    bgGradient:
      "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    badgeColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
} as const;

interface SubjectInsight {
  score?: number;
  target?: number;
  summary?: string;
  reasons?: string[];
}

interface PraticalAbilityFeedback {
  analysisMarkDown?: string;
}

type ExtendedCourseGroupDto = GeneratedCourseGroupDto & {
  insight?: SubjectInsight;
  courses?: CourseItemDto[];
};

type LearningPathDto = Omit<
  GeneratedLearningPathSelectDto,
  "basicLearningPath" | "internalLearningPath"
> & {
  basicLearningPath?: {
    courseGroups?: ExtendedCourseGroupDto[];
  };
  internalLearningPath?: Array<
    NonNullable<
      GeneratedLearningPathSelectDto["internalLearningPath"]
    >[number] & {
      majorCourseGroups?: ExtendedCourseGroupDto[];
    }
  >;
  externalLearningPath?: ExternalLearningPathDto[];
  praticalAbilityFeedbacks?: PraticalAbilityFeedback[];
};

type InternalMajorDto = NonNullable<
  LearningPathDto["internalLearningPath"]
>[number];

type LearningPathApiResponse = Omit<LearningPathSelectResponse, "response"> & {
  response?: LearningPathDto;
};

type AiFieldKey =
  | "personality"
  | "habitAndInterestAnalysis"
  | "learningAbility";

const AI_CARD_CONFIG: Array<{
  id: string;
  badge: string;
  title: string;
  field: AiFieldKey;
  fallbackTitle: string;
  fallbackSummary: string;
  fallbackBullets: string[];
}> = [
  {
    id: "persona",
    badge: "Tính cách",
    title: "Tính cách học tập",
    field: "personality",
    fallbackTitle: "Đang phân tích tính cách",
    fallbackSummary:
      "Hệ thống đang tổng hợp tính cách học tập của bạn dựa trên dữ liệu mới nhất.",
    fallbackBullets: [
      "Giữ nhịp học ổn định để AI có thêm dữ liệu.",
      "Thử lại sau vài phút nếu vẫn chưa thấy kết quả.",
    ],
  },
  {
    id: "habit",
    badge: "Thói quen & sở thích",
    title: "Thói quen học tập",
    field: "habitAndInterestAnalysis",
    fallbackTitle: "Đang phân tích thói quen",
    fallbackSummary:
      "AI đang phân tích thói quen và sở thích học tập của bạn để đưa ra gợi ý phù hợp.",
    fallbackBullets: [],
  },
  {
    id: "learning",
    badge: "Năng lực học tập",
    title: "Năng lực học tập",
    field: "learningAbility",
    fallbackTitle: "Đang phân tích năng lực",
    fallbackSummary:
      "Dữ liệu năng lực học tập đang được tổng hợp và chuẩn hoá.",
    fallbackBullets: ["Thực hiện các bài kiểm tra nhanh để cập nhật năng lực."],
  },
];

const parseContentLines = (value?: string | null) =>
  value
    ?.split(/\r?\n+/)
    .map((line) => line.replace(/^[*-]\s*/, "").trim())
    .filter(Boolean) ?? [];

const SkeletonParagraph = ({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) => (
  <div className={`space-y-2 animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => (
      <div
        key={`skeleton-line-${idx}`}
        className="h-4 rounded-full bg-gradient-to-r from-orange-50 via-white to-orange-50 dark:from-slate-800/80 dark:via-slate-700/70 dark:to-slate-800/80"
        style={{ width: `${Math.max(45, 90 - idx * 12)}%` }}
      />
    ))}
  </div>
);

const BasicTimelineSkeleton = () => (
  <div className="relative pl-10">
    <div className="absolute left-5 top-0 bottom-0 w-px bg-orange-100 animate-pulse" />
    {Array.from({ length: 2 }).map((_, idx) => (
      <div key={`basic-skeleton-${idx}`} className="relative mb-14 pl-10">
        <div className="absolute left-0 top-2 w-16 h-16 rounded-full bg-white border-4 border-orange-200 shadow-md flex items-center justify-center">
          <div className="h-4 w-10 rounded-full bg-orange-100 animate-pulse" />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-slate-800 p-6 shadow-sm">
          <SkeletonParagraph lines={2} className="mb-6 max-w-xl" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, gIdx) => (
              <div
                key={`basic-skeleton-group-${idx}-${gIdx}`}
                className="rounded-2xl border border-orange-100 bg-orange-50/60 dark:border-slate-800 dark:bg-slate-800/30 p-5"
              >
                <SkeletonParagraph lines={3} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const InternalMajorSkeleton = () => (
  <div className="space-y-8">
    {Array.from({ length: 2 }).map((_, idx) => (
      <div
        key={`internal-skeleton-${idx}`}
        className="rounded-3xl border border-cyan-100 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-sm"
      >
        <SkeletonParagraph lines={3} className="max-w-2xl" />
        <div className="mt-5 space-y-4">
          {Array.from({ length: 2 }).map((_, gIdx) => (
            <div
              key={`internal-skeleton-group-${idx}-${gIdx}`}
              className="rounded-2xl border border-cyan-100 bg-cyan-50/50 dark:border-slate-800 dark:bg-slate-800/40 p-5"
            >
              <SkeletonParagraph lines={3} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ExternalTrackSkeleton = () => (
  <div className="space-y-10">
    {Array.from({ length: 2 }).map((_, idx) => (
      <div
        key={`external-skeleton-${idx}`}
        className="rounded-3xl border border-lime-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6"
      >
        <SkeletonParagraph lines={3} className="max-w-2xl" />
        <div className="relative pl-10 mt-6">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-lime-200 animate-pulse" />
          {Array.from({ length: 3 }).map((_, stepIdx) => (
            <div
              key={`external-skeleton-step-${idx}-${stepIdx}`}
              className="relative mb-8 pl-6"
            >
              <div className="absolute -left-6 top-0 w-10 h-10 rounded-full bg-white border-2 border-lime-200 flex items-center justify-center">
                <div className="h-3 w-8 rounded-full bg-lime-100 animate-pulse" />
              </div>
              <div className="rounded-2xl border border-lime-100 bg-lime-50/60 dark:border-slate-800 dark:bg-slate-800/30 p-5">
                <SkeletonParagraph lines={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const normalizeSemesterPosition = (value?: number | null, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const splitGroupBySemester = (
  group: ExtendedCourseGroupDto,
  defaultSemester = 0,
) => {
  const courseList = group.courses ?? [];
  const fallbackSemester = normalizeSemesterPosition(
    group.semesterPosition,
    defaultSemester,
  );

  const semesters = new Set<number>();

  if (courseList.length === 0) {
    semesters.add(fallbackSemester);
  } else {
    courseList.forEach((course) => {
      semesters.add(
        normalizeSemesterPosition(course.semesterPosition, fallbackSemester),
      );
    });
  }

  if (semesters.size === 0) {
    semesters.add(fallbackSemester);
  }

  const entries: Array<{ semester: number; group: ExtendedCourseGroupDto }> =
    [];

  semesters.forEach((semester) => {
    const filteredCourses = courseList.filter(
      (course) =>
        normalizeSemesterPosition(course.semesterPosition, fallbackSemester) ===
        semester,
    );

    entries.push({
      semester,
      group: { ...group, courses: filteredCourses },
    });
  });

  return entries;
};

const consumeSseBuffer = (
  buffer: string,
  onMessage: (payload: string) => void,
) => {
  let remaining = buffer;
  let separatorIndex = remaining.indexOf("\n\n");

  while (separatorIndex !== -1) {
    const rawEvent = remaining.slice(0, separatorIndex).replace(/\r/g, "");
    remaining = remaining.slice(separatorIndex + 2);

    const dataLines = rawEvent
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:\s*/, ""));

    if (dataLines.length > 0) {
      const payload = dataLines.join("\n").trim();
      if (payload && payload !== "[DONE]") {
        onMessage(payload);
      }
    }

    separatorIndex = remaining.indexOf("\n\n");
  }

  return remaining;
};

const LearningPathSamplePage = () => {
  const params = useParams<{ id?: string }>();
  const pathId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const [learningPath, setLearningPath] = useState<LearningPathDto | null>(
    null,
  );
  const [status, setStatus] = useState<LearningPathStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [expandedBasic, setExpandedBasic] = useState<Record<string, boolean>>(
    {},
  );
  const [showBasicSection, setShowBasicSection] = useState(false);
  const [showInternalSection, setShowInternalSection] = useState(false);
  const [showExternalSection, setShowExternalSection] = useState(false);
  const [collapsedMajors, setCollapsedMajors] = useState<
    Record<string, boolean>
  >({});
  // State cho việc chọn và sắp xếp chuyên ngành (khi status = 1)
  // Mặc định rỗng - người dùng tự chọn
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [majorOrder, setMajorOrder] = useState<string[]>([]);
  const [draggedMajor, setDraggedMajor] = useState<string | null>(null);
  const [viewingMajorId, setViewingMajorId] = useState<string | null>(null);
  const [chooseMajorsLoading, setChooseMajorsLoading] = useState(false);
  const [chooseMajorsError, setChooseMajorsError] = useState<string | null>(
    null,
  );
  const [chooseMajorsSuccess, setChooseMajorsSuccess] = useState<string | null>(
    null,
  );

  // Transcript modal states
  const [hasTranscript, setHasTranscript] = useState<boolean>(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcriptData, setTranscriptData] = useState<
    StudentTranscriptRecord[]
  >([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  // Course suggestion modal states
  const [showCourseSuggestionModal, setShowCourseSuggestionModal] =
    useState(false);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string | null>(
    null,
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [suggestionType, setSuggestionType] = useState<1 | 2>(1); // 1 = Easier, 2 = Harder
  const [suggestedCourses, setSuggestedCourses] = useState<
    CourseBasicInfoDto[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [addingCourseId, setAddingCourseId] = useState<string | null>(null);

  // External courses modal states
  const [showExternalCoursesModal, setShowExternalCoursesModal] =
    useState(false);
  const [externalSubjectCode, setExternalSubjectCode] = useState<string | null>(
    null,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [externalCourses, setExternalCourses] = useState<any[]>([]);
  const [loadingExternalCourses, setLoadingExternalCourses] = useState(false);

  const summaryFeedback = learningPath?.summaryFeedback;
  const personality = learningPath?.personality;
  const habitAnalysis = learningPath?.habitAndInterestAnalysis;
  const learningAbility = learningPath?.learningAbility;
  const praticalAbilityFeedbacks = learningPath?.praticalAbilityFeedbacks;

  useMemo(() => {
    const source: Record<AiFieldKey, string | null | undefined> = {
      personality,
      habitAndInterestAnalysis: habitAnalysis,
      learningAbility,
    };

    return AI_CARD_CONFIG.map((config) => {
      const raw = source[config.field];
      const lines = parseContentLines(raw);
      const summary = lines[0] ?? config.fallbackSummary;
      const bullets =
        lines.slice(1).length > 0 ? lines.slice(1) : config.fallbackBullets;

      return {
        id: config.id,
        badge: config.badge,
        title: raw ? config.title : config.fallbackTitle,
        summary,
        bullets,
        tags: raw ? ["Cá nhân hoá"] : ["Đang phân tích"],
        isLoading: !raw,
        markdown: raw?.trim() ?? null,
      };
    });
  }, [habitAnalysis, learningAbility, personality]);

  const streamAbortRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    if (streamAbortRef.current) {
      streamAbortRef.current.abort();
      streamAbortRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const handleStreamPayload = useCallback(
    (payload: LearningPathDto) => {
      setLearningPath(payload);
      const nextStatus = (payload.status ?? null) as LearningPathStatus | null;
      setStatus(nextStatus);
      if (nextStatus !== LearningPathStatus.Generating) {
        stopStream();
      }
    },
    [stopStream],
  );

  const startStream = useCallback(() => {
    if (!pathId || streamAbortRef.current) {
      return;
    }

    const controller = new AbortController();
    streamAbortRef.current = controller;
    setIsStreaming(true);

    const url = `${STREAM_ENDPOINT}?learningPathId=${encodeURIComponent(pathId)}`;

    (async () => {
      try {
        const response = await fetch(url, {
          headers: { Accept: "text/event-stream" },
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Stream HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Trình duyệt không hỗ trợ đọc stream.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          buffer = consumeSseBuffer(buffer, (data) => {
            try {
              const parsed = JSON.parse(data) as LearningPathApiResponse;
              if (parsed.response) {
                handleStreamPayload(parsed.response);
              }
            } catch (err) {
              console.error("Không thể parse dữ liệu streaming", err);
            }
          });
        }

        consumeSseBuffer(buffer, (data) => {
          try {
            const parsed = JSON.parse(data) as LearningPathApiResponse;
            if (parsed.response) {
              handleStreamPayload(parsed.response);
            }
          } catch {
            /* noop */
          }
        });
      } catch (err) {
        if ((err as DOMException)?.name !== "AbortError") {
          console.error("Streaming error:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Không thể kết nối realtime. Vui lòng thử lại.",
          );
        }
      } finally {
        if (streamAbortRef.current === controller) {
          streamAbortRef.current = null;
        }
        setIsStreaming(false);
      }
    })();
  }, [handleStreamPayload, pathId]);

  const fetchLearningPath = useCallback(
    async (preferredMode: "json" | "text" = "json") => {
      if (!pathId) {
        setError("Thiếu thông tin learning path Id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ learningPathId: pathId });
        if (preferredMode === "text") {
          params.set("mode", "text");
        }

        const response = await fetch(
          `${SNAPSHOT_ENDPOINT}?${params.toString()}`,
          {
            headers: {
              Accept:
                preferredMode === "text"
                  ? "text/plain, application/json"
                  : "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            message || `Không thể tải dữ liệu (HTTP ${response.status})`,
          );
        }

        const data = (await response.json()) as LearningPathApiResponse;
        if (!data?.response) {
          throw new Error(data?.message ?? "Không tìm thấy lộ trình.");
        }

        const payload = data.response;
        setLearningPath(payload);

        const nextStatus = (payload.status ??
          null) as LearningPathStatus | null;
        setStatus(nextStatus);

        if (nextStatus === LearningPathStatus.Generating) {
          startStream();
        } else {
          stopStream();
        }
      } catch (err) {
        console.error("Fetch learning path error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải dữ liệu lộ trình.",
        );
      } finally {
        setLoading(false);
      }
    },
    [pathId, startStream, stopStream],
  );

  useEffect(() => {
    fetchLearningPath();
    return () => {
      stopStream();
    };
  }, [fetchLearningPath, stopStream]);

  useEffect(() => {
    setExpandedBasic({});
    setShowBasicSection(false);
    setShowInternalSection(false);
    setShowExternalSection(false);
    // Initialize all majors as collapsed (closed) by default
    const initialCollapsedMajors: Record<string, boolean> = {};
    if (learningPath?.internalLearningPath) {
      learningPath.internalLearningPath.forEach((major, idx) => {
        const id = major.majorId ?? `major-${idx}`;
        initialCollapsedMajors[id] = true; // true = collapsed/closed
      });
    }
    setCollapsedMajors(initialCollapsedMajors);
    setSelectedMajors([]);
    setMajorOrder([]);
    setChooseMajorsError(null);
    setChooseMajorsSuccess(null);
  }, [pathId, learningPath?.internalLearningPath]);

  // Check if student has transcript on mount
  useEffect(() => {
    const checkTranscript = async () => {
      try {
        const result = await getStudentTranscriptServer();
        if (result.success && result.response && result.response.length > 0) {
          setHasTranscript(true);
        } else {
          setHasTranscript(false);
        }
      } catch (error) {
        console.error("Error checking transcript:", error);
        setHasTranscript(false);
      }
    };
    checkTranscript();
  }, []);

  // Load transcript data for preview
  const handlePreviewTranscript = async () => {
    try {
      setLoadingTranscript(true);
      setShowTranscriptModal(true);
      const result = await getStudentTranscriptServer();
      if (result.success && result.response) {
        setTranscriptData(result.response);
      }
    } catch (error) {
      console.error("Error loading transcript:", error);
    } finally {
      setLoadingTranscript(false);
    }
  };

  // Open course suggestion modal
  const handleOpenCourseSuggestion = (
    subjectCode: string,
    subjectId: string,
    majorId: string,
  ) => {
    setSelectedSubjectCode(subjectCode);
    setSelectedSubjectId(subjectId);
    setSelectedMajorId(majorId);
    setSuggestionType(1); // Default to Easier
    setShowCourseSuggestionModal(true);
    // Auto-fetch on open
    fetchSuggestedCourses(subjectCode, 1);
  };

  // Fetch suggested courses
  const fetchSuggestedCourses = async (subjectCode: string, type: 1 | 2) => {
    if (!pathId) return;

    try {
      setLoadingSuggestions(true);
      setSuggestedCourses([]);

      const response =
        await StudentClient.api.learningPathsSuggestedCoursesSubjectsRecommendList(
          pathId,
          subjectCode,
          { type },
        );

      if (response.data?.success && response.data?.response) {
        setSuggestedCourses(response.data.response);
        if (response.data.response.length === 0) {
          message.info("Không tìm thấy khóa học phù hợp");
        }
      } else {
        message.error(
          response.data?.message || "Không thể tải danh sách khóa học",
        );
      }
    } catch (error) {
      console.error("Error fetching suggested courses:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách khóa học");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handle suggestion type change
  const handleSuggestionTypeChange = (type: 1 | 2) => {
    setSuggestionType(type);
    if (selectedSubjectCode) {
      fetchSuggestedCourses(selectedSubjectCode, type);
    }
  };

  // Open external courses modal
  const handleOpenExternalCourses = (subjectCode: string) => {
    setExternalSubjectCode(subjectCode);
    setShowExternalCoursesModal(true);
    fetchExternalCourses(subjectCode);
  };

  // Fetch external courses
  const fetchExternalCourses = async (subjectCode: string) => {
    try {
      setLoadingExternalCourses(true);
      setExternalCourses([]);

      const response = await AIClient.api.v1AiRecommendSubjectCourseMatchCreate(
        {
          subjectCode: subjectCode,
          topK: 20,
          showSources: false,
        },
      );

      if (response.data?.success && response.data?.response?.courses) {
        setExternalCourses(response.data.response.courses);
        if (response.data.response.courses.length === 0) {
          message.info("Không tìm thấy khóa học bên ngoài phù hợp");
        }
      } else {
        message.error(
          response.data?.message || "Không thể tải danh sách khóa học",
        );
      }
    } catch (error) {
      console.error("Error fetching external courses:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách khóa học");
    } finally {
      setLoadingExternalCourses(false);
    }
  };

  // Add course to learning path
  const handleAddCourseToPath = async (courseId: string) => {
    if (!selectedMajorId || !selectedSubjectId || !selectedSubjectCode) {
      message.error("Thiếu thông tin cần thiết để thêm khóa học");
      return;
    }

    try {
      setAddingCourseId(courseId);

      const response =
        await StudentClient.api.learningPathsAddSuggestedCoursePartialUpdate({
          learningPathMajorId: selectedMajorId,
          internalCourseId: courseId,
          learningPathSubjectCodeId: selectedSubjectId,
          subjectCode: selectedSubjectCode,
        });

      if (response.data?.success) {
        message.success("Đã thêm khóa học vào lộ trình thành công!");
        // Refresh learning path data
        fetchLearningPath();
        // Close modal after successful add
        setTimeout(() => {
          setShowCourseSuggestionModal(false);
        }, 1000);
      } else {
        message.error(
          response.data?.message || "Không thể thêm khóa học vào lộ trình",
        );
      }
    } catch (error) {
      console.error("Error adding course to path:", error);
      message.error("Đã xảy ra lỗi khi thêm khóa học");
    } finally {
      setAddingCourseId(null);
    }
  };

  // Map level to Vietnamese
  const getLevelInVietnamese = (level?: string | null) => {
    if (!level) return "";
    const levelLower = level.toLowerCase();
    if (levelLower.includes("beginner")) return "Cơ bản";
    if (levelLower.includes("intermediate")) return "Trung cấp";
    if (levelLower.includes("advanced")) return "Nâng cao";
    return level;
  };

  // Get status tag for transcript
  const getTranscriptStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      "Not started": { color: "default", label: "Chưa bắt đầu" },
      Passed: { color: "success", label: "Đã qua" },
      "Not passed": { color: "error", label: "Không qua" },
      Studying: { color: "processing", label: "Đang học" },
    };
    const config = statusMap[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // Transcript table columns
  const transcriptColumns: ColumnsType<StudentTranscriptRecord> = [
    {
      title: "STT",
      dataIndex: "semesterNumber",
      key: "semesterNumber",
      width: 60,
      align: "center",
      render: (num: number) => <span className="font-semibold">{num}</span>,
    },
    {
      title: "Mã môn",
      dataIndex: "subjectCode",
      key: "subjectCode",
      width: 100,
      render: (code: string) => (
        <span className="font-mono font-semibold">{code}</span>
      ),
    },
    {
      title: "Tên môn học",
      dataIndex: "subjectName",
      key: "subjectName",
      ellipsis: true,
    },
    {
      title: "Tín chỉ",
      dataIndex: "credit",
      key: "credit",
      width: 80,
      align: "center",
    },
    {
      title: "Điểm",
      dataIndex: "grade",
      key: "grade",
      width: 80,
      align: "center",
      render: (grade: number) => (
        <Tag color="blue">{grade > 0 ? grade.toFixed(1) : "-"}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: string) => getTranscriptStatusTag(status),
    },
  ];

  const basicSemesters = useMemo(() => {
    if (!learningPath?.basicLearningPath?.courseGroups) return [];
    const map = new Map<number, ExtendedCourseGroupDto[]>();

    learningPath.basicLearningPath.courseGroups.forEach((group) => {
      splitGroupBySemester(group).forEach(({ semester, group: splitted }) => {
        const list = map.get(semester) ?? [];
        list.push(splitted);
        map.set(semester, list);
      });
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([semester, groups]) => ({ semester, groups }));
  }, [learningPath]);

  const internalMajors = useMemo(
    () =>
      [...(learningPath?.internalLearningPath ?? [])].sort(
        (a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0),
      ),
    [learningPath],
  );
  const externalTracks = learningPath?.externalLearningPath ?? [];

  const statusLabel =
    status != null
      ? (LEARNING_PATH_STATUS_LABEL[status] ?? "Không xác định")
      : "Không xác định";

  const isPending =
    loading || status === LearningPathStatus.Generating || false;
  const isChoosingStatus = status === LearningPathStatus.Choosing;

  // displayedInternalMajors: Nếu đang chọn thì hiển thị tất cả, nếu không thì hiển thị theo thứ tự đã chọn
  const displayedInternalMajors = useMemo(
    () => (isChoosingStatus ? internalMajors : internalMajors),
    [isChoosingStatus, internalMajors],
  );

  // Confirm major selection - gọi API
  const handleConfirmMajorSelection = async () => {
    if (!pathId) {
      setChooseMajorsError("Thiếu thông tin lộ trình.");
      return;
    }
    const orderedIds = majorOrder.filter((id) => selectedMajors.includes(id));
    if (orderedIds.length === 0) {
      setChooseMajorsError("Vui lòng chọn ít nhất một chuyên ngành.");
      return;
    }
    setChooseMajorsLoading(true);
    setChooseMajorsError(null);
    setChooseMajorsSuccess(null);
    try {
      const response = await learningPathsChooseMajorUpdate(pathId, orderedIds);
      if (!response?.data?.success) {
        throw new Error(response?.data?.message ?? undefined);
      }
      setChooseMajorsSuccess("Đã cập nhật lựa chọn chuyên ngành.");
      await fetchLearningPath();
    } catch (error) {
      setChooseMajorsError(
        error instanceof Error
          ? error.message || "Không thể cập nhật chuyên ngành."
          : "Không thể cập nhật chuyên ngành.",
      );
    } finally {
      setChooseMajorsLoading(false);
      setTimeout(() => {
        setChooseMajorsSuccess(null);
      }, 4000);
    }
  };

  // Helper: Status label và màu sắc (giống sample)
  const getStatusInfo = (statusValue: number | undefined) => {
    switch (statusValue) {
      case 0:
        return {
          label: "Chưa học",
          color: "default",
          bgClass: "bg-slate-100 dark:bg-slate-800",
        };
      case 1:
        return {
          label: "Đang học",
          color: "processing",
          bgClass: "bg-blue-50 dark:bg-blue-950/30",
        };
      case 2:
        return {
          label: "Đã hoàn thành",
          color: "success",
          bgClass: "bg-green-50 dark:bg-green-950/30",
        };
      default:
        return {
          label: "Chưa xác định",
          color: "default",
          bgClass: "bg-slate-100 dark:bg-slate-800",
        };
    }
  };

  const renderBasicContent = () => {
    if (isPending) return <BasicTimelineSkeleton />;

    // Flatten all groups from all semesters and sort by semesterPosition
    const allGroups = basicSemesters.flatMap(({ groups }) => groups);
    const sortedGroups = [...allGroups].sort(
      (a, b) => (a.semesterPosition ?? 0) - (b.semesterPosition ?? 0),
    );

    if (sortedGroups.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Chưa có dữ liệu học phần nền tảng cho lộ trình này.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {sortedGroups.map((group) => {
          const statusInfo = getStatusInfo(group.status);
          const key = `basic-${group.subjectCode ?? "SUB"}`;
          const isExpanded = Boolean(expandedBasic[key]);
          const analysisMarkdown = (group as ExtendedCourseGroupDto)
            .analysisMarkdown;
          const courseCount = group.courses?.length ?? 0;

          return (
            <div
              key={key}
              className={`rounded-lg border overflow-hidden transition-all ${
                isExpanded
                  ? "border-gray-300 dark:border-gray-600 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {/* Subject Row - Clickable */}
              <div
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  isExpanded
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() =>
                  setExpandedBasic((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
              >
                {/* Semester Badge */}
                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex-shrink-0">
                  Kỳ {group.semesterPosition ?? 0}
                </span>

                {/* Subject Code */}
                <span className="font-semibold text-gray-900 dark:text-white flex-shrink-0">
                  {group.subjectCode ?? "SUB"}
                </span>

                {/* Subject Name */}
                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 min-w-0 truncate">
                  {group.subjectCode ?? ""}
                </span>

                {/* Course count + Status */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {courseCount > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {courseCount} khóa học
                    </span>
                  )}
                  <Tag color={statusInfo.color as string} className="text-xs">
                    {statusInfo.label}
                  </Tag>
                </div>

                {/* Expand indicator */}
                <span
                  className={`text-gray-400 transition-transform text-sm flex-shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {/* Analysis Markdown */}
                  {analysisMarkdown && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                      <div className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-strong:text-gray-700 dark:prose-strong:text-gray-300 prose-h2:text-base prose-h3:text-sm prose-h2:mb-3 prose-h3:mb-2 prose-ul:my-2 prose-li:my-0.5">
                        <MarkdownBlock markdown={analysisMarkdown} />
                      </div>
                    </div>
                  )}

                  {/* No analysis message */}
                  {!analysisMarkdown && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Môn học này không có phân tích chi tiết.
                      </p>
                    </div>
                  )}

                  {/* Courses */}
                  {courseCount > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Khóa học đề xuất
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          {courseCount} khóa học
                        </span>
                      </div>
                      <div className="space-y-3">
                        {(group.courses ?? []).map((course, idx) => (
                          <div
                            key={course.courseId ?? `${key}-course-${idx}`}
                            className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-3 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-sm transition-all duration-200"
                          >
                            <CourseCard
                              id={course.courseId ?? ""}
                              imageUrl={
                                course.courseImageUrl ??
                                "https://via.placeholder.com/600x400?text=EduSmart"
                              }
                              title={course.title ?? "Khóa học"}
                              descriptionLines={
                                course.shortDescription
                                  ? [course.shortDescription]
                                  : []
                              }
                              instructor={course.teacherName ?? "Giảng viên"}
                              level={course.level}
                              price={course.price}
                              dealPrice={course.dealPrice}
                              routerPush={`/course/${course.courseId}`}
                              isHorizontal={true}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper: Lấy danh sách kỳ từ majorCourseGroups
  const getSemestersFromGroups = (
    groups: ExtendedCourseGroupDto[] | undefined,
  ) => {
    if (!groups) return [];
    const set = new Set<number>();
    groups.forEach((g) => {
      const sem = g.semesterPosition ?? 0;
      if (sem > 0) set.add(sem);
    });
    return Array.from(set).sort((a, b) => a - b);
  };

  // Helper: Lọc groups theo kỳ
  const filterGroupsBySemester = (
    groups: ExtendedCourseGroupDto[] | undefined,
    sem: number,
  ) => {
    if (!groups) return [];
    return groups.filter((g) => (g.semesterPosition ?? 0) === sem);
  };

  // Helper: Đếm tổng số khóa học trong major
  const getTotalCourses = (major: InternalMajorDto) => {
    return (major.majorCourseGroups ?? []).reduce(
      (acc, cg) => acc + (cg.courses?.length ?? 0),
      0,
    );
  };

  // Handle major toggle for selection (giống sample)
  const handleMajorToggle = (majorId: string) => {
    if (!majorId) return;
    if (selectedMajors.includes(majorId)) {
      setSelectedMajors((prev) => prev.filter((id) => id !== majorId));
      setMajorOrder((prev) => prev.filter((id) => id !== majorId));
    } else {
      setSelectedMajors((prev) => [...prev, majorId]);
      setMajorOrder((prev) => [...prev, majorId]);
    }
  };

  // Move major up in order (giống sample)
  const moveMajorUp = (majorId: string) => {
    const i = majorOrder.indexOf(majorId);
    if (i > 0) {
      const arr = [...majorOrder];
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      setMajorOrder(arr);
    }
  };

  // Move major down in order (giống sample)
  const moveMajorDown = (majorId: string) => {
    const i = majorOrder.indexOf(majorId);
    if (i !== -1 && i < majorOrder.length - 1) {
      const arr = [...majorOrder];
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      setMajorOrder(arr);
    }
  };

  // Enhanced drag handlers (giống sample)
  const handleDragStartEnhanced = (e: React.DragEvent, majorId: string) => {
    setDraggedMajor(majorId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", majorId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropEnhanced = (e: React.DragEvent, targetMajorId: string) => {
    e.preventDefault();
    if (!draggedMajor || draggedMajor === targetMajorId) {
      setDraggedMajor(null);
      return;
    }
    const draggedIndex = majorOrder.indexOf(draggedMajor);
    const targetIndex = majorOrder.indexOf(targetMajorId);
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedMajor(null);
      return;
    }
    const arr = [...majorOrder];
    arr.splice(draggedIndex, 1);
    arr.splice(targetIndex, 0, draggedMajor);
    setMajorOrder(arr);
    setDraggedMajor(null);
  };

  const handleDragEnd = () => {
    setDraggedMajor(null);
  };

  const renderInternalContent = (majorsList: InternalMajorDto[]) => {
    if (isPending) return <InternalMajorSkeleton />;
    if (majorsList.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Chưa có dữ liệu chuyên ngành nội bộ cho lộ trình này.
        </p>
      );
    }

    const isChoosingMode = status === LearningPathStatus.Choosing;

    // ========== MODE: CHOOSING (status = 1) ==========
    if (isChoosingMode) {
      return (
        <>
          {/* Grid cards để chọn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {majorsList.map((major, idx) => {
              const id = major.majorId ?? `major-${idx}`;
              const total = getTotalCourses(major);
              const isViewing = viewingMajorId === id;
              const isSelected = selectedMajors.includes(id);

              return (
                <div
                  key={id}
                  onClick={() => setViewingMajorId(isViewing ? null : id)}
                  className={`relative cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
                    isViewing
                      ? "bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white border-[#49BBBD] shadow-lg"
                      : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-cyan-600 hover:shadow-md"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className={`font-bold text-base leading-tight ${isViewing ? "text-white" : "text-gray-900 dark:text-white"}`}
                    >
                      {major.majorCode ?? major.majorId ?? "Chuyên ngành"}
                    </h3>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${isViewing ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"}`}
                    >
                      {total} khóa học
                    </div>
                  </div>

                  {/* Reason */}
                  <p
                    className={`text-sm mb-3 transition-all duration-300 ${isViewing ? "" : "line-clamp-2"} ${isViewing ? "text-white/90" : "text-gray-600 dark:text-gray-300"}`}
                  >
                    {major.reason || `${total} khóa học chuyên sâu`}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMajorToggle(id);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? isViewing
                            ? "bg-white text-black hover:bg-gray-50 shadow-sm"
                            : "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-800 dark:text-teal-100"
                          : isViewing
                            ? "bg-white/20 text-white hover:bg-white/30 border border-white/40"
                            : "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400"
                      }`}
                    >
                      {isSelected ? (
                        <span className="flex items-center space-x-1 text-black">
                          <FiCheck className="w-4 h-4" />
                          <span>Đã chọn</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1">
                          <FiPlus className="w-4 h-4" />
                          <span>Chọn combo</span>
                        </span>
                      )}
                    </button>
                    <div
                      className={`text-xs ${isViewing ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {isViewing ? "Đang xem" : "Nhấn để xem"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chi tiết major đang xem */}
          {viewingMajorId &&
            (() => {
              const selectedMajor = majorsList.find(
                (m) => m.majorId === viewingMajorId,
              );
              if (!selectedMajor) return null;
              const sems = getSemestersFromGroups(
                selectedMajor.majorCourseGroups as ExtendedCourseGroupDto[],
              );

              return (
                <div className="mb-8">
                  {sems.map((sem) => {
                    const groupsForSem = filterGroupsBySemester(
                      selectedMajor.majorCourseGroups as ExtendedCourseGroupDto[],
                      sem,
                    );
                    if (groupsForSem.length === 0) return null;
                    return (
                      <div
                        key={`view-${viewingMajorId}-sem-${sem}`}
                        className="mb-10"
                      >
                        <div className="flex items-center mb-5">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                              Kỳ {sem}
                            </h4>
                            <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          {groupsForSem.map((cg) => {
                            const courseCount = cg.courses?.length ?? 0;
                            return (
                              <div key={cg.subjectCode} className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="px-2 py-1 rounded-md bg-[#49BBBD] text-white text-xs font-bold">
                                      {cg.subjectCode ?? "SUB"}
                                    </div>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${cg.status === 0 ? "bg-gray-100 text-gray-700" : cg.status === 1 ? "bg-blue-100 text-blue-700" : cg.status === 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                                    >
                                      {cg.status === 0
                                        ? "Chưa bắt đầu"
                                        : cg.status === 1
                                          ? "Đang học"
                                          : cg.status === 2
                                            ? "Hoàn thành"
                                            : "Bỏ qua"}
                                    </span>
                                  </div>
                                  {/* <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {courseCount} khóa học
                                  </span> */}
                                  <div className="flex gap-2">
                                    <Button
                                      size="small"
                                      type="default"
                                      icon={
                                        <FiSearch className="w-3.5 h-3.5" />
                                      }
                                      onClick={() => {
                                        handleOpenCourseSuggestion(
                                          cg.subjectCode ?? "",
                                          cg.subjectId ?? "",
                                          selectedMajor.majorId ?? "",
                                        );
                                      }}
                                      style={{
                                        borderColor: "#49BBBD",
                                        color: "#49BBBD",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                      className="hover:bg-[#49BBBD] hover:text-white transition-colors"
                                    >
                                      Tìm thêm khóa ở mức độ khác
                                    </Button>
                                    <Button
                                      size="small"
                                      type="default"
                                      icon={<FiGlobe className="w-3.5 h-3.5" />}
                                      onClick={() => {
                                        handleOpenExternalCourses(
                                          cg.subjectCode ?? "",
                                        );
                                      }}
                                      style={{
                                        borderColor: "#FF6B6B",
                                        color: "#FF6B6B",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                      className="hover:bg-[#FF6B6B] hover:text-white transition-colors"
                                    >
                                      Tìm khóa học bên ngoài
                                    </Button>
                                  </div>
                                </div>

                                {courseCount > 0 && (
                                  <div className="space-y-3 flex flex-row flex-wrap gap-5">
                                    {(cg.courses ?? []).map((course, i) => (
                                      <div
                                        key={`${cg.subjectCode}-${i}`}
                                        className=""
                                      >
                                        <CourseCard
                                          id={course.courseId ?? ""}
                                          imageUrl={
                                            course.courseImageUrl ??
                                            "https://via.placeholder.com/600x400?text=EduSmart"
                                          }
                                          title={course.title ?? "Khóa học"}
                                          descriptionLines={
                                            course.shortDescription
                                              ? [course.shortDescription]
                                              : []
                                          }
                                          instructor={
                                            course.teacherName ?? "Giảng viên"
                                          }
                                          level={course.level}
                                          price={course.price}
                                          dealPrice={course.dealPrice}
                                          routerPush={`/course/${course.courseId}`}
                                          isHorizontal={false}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {courseCount === 0 && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    Chưa có khóa học cho môn này
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          {/* Empty state */}
          {selectedMajors.length === 0 && !viewingMajorId && (
            <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <FiPlus className="w-8 h-8 text-teal-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Chưa chọn chuyên ngành nào
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Hãy nhấn vào các thẻ chuyên ngành ở trên để xem chi tiết, sau đó
                nhấn &quot;Chọn combo&quot; để thêm vào lộ trình học của bạn.
              </p>
            </div>
          )}

          {/* Selected Order Management */}
          {selectedMajors.length > 0 && (
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="text-xl text-[#49BBBD] dark:text-cyan-400">
                    Thứ tự học đã chọn
                  </span>
                  <span className="ml-3 text-base font-medium text-gray-500 dark:text-gray-400">
                    ({selectedMajors.length} combo)
                  </span>
                </h4>
              </div>
              <div className="space-y-3">
                {majorOrder.map((majorId, index) => {
                  const major = majorsList.find((m) => m.majorId === majorId);
                  if (!major) return null;
                  const total = getTotalCourses(major);
                  const isDragging = draggedMajor === majorId;

                  return (
                    <div
                      key={majorId}
                      draggable
                      onDragStart={(e) => handleDragStartEnhanced(e, majorId)}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDrop={(e) => handleDropEnhanced(e, majorId)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-move ${
                        isDragging
                          ? "bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-cyan-600 opacity-50 scale-105 shadow-lg"
                          : "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-cyan-700 hover:shadow-md hover:bg-teal-100 dark:hover:bg-teal-900/30"
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing">
                          <FiMove className="w-5 h-5" />
                        </div>
                        <div className="w-8 h-8 bg-[#49BBBD] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {major.majorCode ?? "Chuyên ngành"}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {total} khóa học
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveMajorUp(majorId)}
                          disabled={index === 0}
                          className="p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Di chuyển lên"
                        >
                          <FiChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => moveMajorDown(majorId)}
                          disabled={index === majorOrder.length - 1}
                          className="p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Di chuyển xuống"
                        >
                          <FiChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => handleMajorToggle(majorId)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 text-red-500 transition-colors"
                          title="Xóa khỏi danh sách"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMajors([]);
                    setMajorOrder([]);
                    setViewingMajorId(null);
                  }}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Đặt lại
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMajorSelection}
                  disabled={chooseMajorsLoading || selectedMajors.length === 0}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold !text-white bg-[#49BBBD] hover:bg-[#3da9ab] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {chooseMajorsLoading ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 text-white" />
                      Xác nhận ({selectedMajors.length} chuyên ngành)
                    </>
                  )}
                </button>
              </div>

              {/* Error/Success Messages */}
              {chooseMajorsError && (
                <p className="mt-3 text-sm text-red-500 dark:text-red-400 text-right">
                  {chooseMajorsError}
                </p>
              )}
              {chooseMajorsSuccess && (
                <p className="mt-3 text-sm text-emerald-500 dark:text-emerald-400 text-right flex items-center justify-end gap-1">
                  <FiCheck className="w-4 h-4" />
                  {chooseMajorsSuccess}
                </p>
              )}
            </div>
          )}
        </>
      );
    }

    // ========== MODE: IN PROGRESS (status = 2) - Timeline View ==========
    // Sort by positionIndex to display in correct order
    const sortedMajors = [...majorsList].sort(
      (a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0),
    );

    return (
      <div className="space-y-6">
        {/* Summary header */}

        {sortedMajors.map((major) => {
          const id = major.majorId ?? `major-${major.positionIndex}`;
          const sems = getSemestersFromGroups(
            major.majorCourseGroups as ExtendedCourseGroupDto[],
          );
          const totalCourses = getTotalCourses(major);
          const isExpanded = !collapsedMajors[id];
          const displayIndex = major.positionIndex ?? 1;

          return (
            <div key={id} className="relative">
              <div
                onClick={() =>
                  setCollapsedMajors((prev) => ({ ...prev, [id]: !prev[id] }))
                }
                className={`cursor-pointer rounded-xl p-6 transition-all duration-300 border ${
                  isExpanded
                    ? "border-[#49BBBD] bg-teal-50/50 dark:bg-teal-900/20 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:border-teal-200 dark:hover:border-cyan-600 hover:shadow-md"
                }`}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shadow-md ${displayIndex === 1 ? "bg-gradient-to-br from-[#49BBBD] to-cyan-600 text-white" : "bg-gradient-to-br from-teal-400 to-cyan-500 text-white"}`}
                  >
                    {displayIndex}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {major.majorCode ?? major.majorId ?? "Chuyên ngành"}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {totalCourses} khóa học • {sems.length} kỳ học
                    </span>
                  </div>
                  <div
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Reason */}
                {major.reason && (
                  <p
                    className={`text-sm leading-relaxed ${isExpanded ? "text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400 line-clamp-2"}`}
                  >
                    {major.reason}
                  </p>
                )}

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-teal-200 dark:border-cyan-800">
                    {sems.map((sem) => {
                      const groupsForSem = filterGroupsBySemester(
                        major.majorCourseGroups as ExtendedCourseGroupDto[],
                        sem,
                      );
                      if (groupsForSem.length === 0) return null;
                      return (
                        <div key={`major-${id}-sem-${sem}`} className="mb-10">
                          <div className="flex items-center mb-5">
                            {/* <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-base font-bold mr-4 shadow-md">
                              {sem}
                            </div> */}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                Kỳ {sem}
                              </h4>
                              <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
                            </div>
                          </div>
                          <div className="space-y-6">
                            {groupsForSem.map((cg) => {
                              const courseCount = cg.courses?.length ?? 0;
                              return (
                                <div
                                  key={cg.subjectCode ?? `${id}-${sem}`}
                                  className="mb-6"
                                >
                                  <div className="mb-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3 flex-wrap">
                                        <div className="px-2 py-1 rounded-md bg-[#49BBBD] text-white text-xs font-bold">
                                          {cg.subjectCode ?? "SUB"}
                                        </div>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-semibold ${cg.status === 0 ? "bg-gray-100 text-gray-700" : cg.status === 1 ? "bg-blue-100 text-blue-700" : cg.status === 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                                        >
                                          {cg.status === 0
                                            ? "Chưa bắt đầu"
                                            : cg.status === 1
                                              ? "Đang học"
                                              : cg.status === 2
                                                ? "Hoàn thành"
                                                : "Bỏ qua"}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {courseCount} khóa học
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="small"
                                        type="default"
                                        icon={
                                          <FiSearch className="w-3.5 h-3.5" />
                                        }
                                        onClick={() => {
                                          handleOpenCourseSuggestion(
                                            cg.subjectCode ?? "",
                                            cg.subjectId ?? "",
                                            major.majorId ?? "",
                                          );
                                        }}
                                        style={{
                                          borderColor: "#49BBBD",
                                          color: "#49BBBD",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                        className="hover:bg-[#49BBBD] hover:text-white transition-colors"
                                      >
                                        Tìm thêm khóa ở mức độ khác
                                      </Button>
                                      <Button
                                        size="small"
                                        type="default"
                                        icon={
                                          <FiGlobe className="w-3.5 h-3.5" />
                                        }
                                        onClick={() => {
                                          handleOpenExternalCourses(
                                            cg.subjectCode ?? "",
                                          );
                                        }}
                                        style={{
                                          borderColor: "#FF6B6B",
                                          color: "#FF6B6B",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                        className="hover:bg-[#FF6B6B] hover:text-white transition-colors"
                                      >
                                        Tìm khóa học bên ngoài
                                      </Button>
                                    </div>
                                  </div>
                                  {courseCount > 0 && (
                                    <div className="space-y-3 mt-3">
                                      {(cg.courses ?? []).map((course, i) => (
                                        <div
                                          key={`${cg.subjectCode}-${i}`}
                                          className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-3 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-sm transition-all duration-200"
                                        >
                                          <CourseCard
                                            id={course.courseId ?? ""}
                                            imageUrl={
                                              course.courseImageUrl ??
                                              "https://via.placeholder.com/600x400?text=EduSmart"
                                            }
                                            title={course.title ?? "Khóa học"}
                                            descriptionLines={
                                              course.shortDescription
                                                ? [course.shortDescription]
                                                : []
                                            }
                                            instructor={
                                              course.teacherName ?? "Giảng viên"
                                            }
                                            level={course.level}
                                            price={course.price}
                                            dealPrice={course.dealPrice}
                                            routerPush={`/course/${course.courseId}`}
                                            isHorizontal={true}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {courseCount === 0 && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                      Chưa có khóa học cho môn này
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderExternalContent = () => {
    if (isPending) return <ExternalTrackSkeleton />;
    if (externalTracks.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Chưa có gợi ý lộ trình ngoài hệ thống cho lộ trình này.
        </p>
      );
    }

    return (
      <div className="space-y-6">
        {externalTracks.map((track, trackIdx) => (
          <div
            key={track.majorId ?? `external-${trackIdx}`}
            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Track Header */}
            <div className="bg-gray-50 dark:bg-gray-800 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {trackIdx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {(track.majorCode ?? "TRACK").replace(/_/g, " ")}
                    </h4>
                    <Tag color="purple" className="text-xs">
                      {(track.steps ?? []).length} bước
                    </Tag>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {track.reason ??
                      "Hệ thống chưa cung cấp mô tả chi tiết cho track này."}
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="p-5 bg-white dark:bg-gray-900">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-6">
                  {(track.steps ?? []).map((step, stepIdx) => (
                    <div
                      key={`${track.majorId ?? trackIdx}-step-${stepIdx}`}
                      className="relative pl-10"
                    >
                      {/* Step dot */}
                      <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-purple-500 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {stepIdx + 1}
                        </span>
                      </div>

                      {/* Step Content */}
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {step.title ?? "Nội dung"}
                        </h5>

                        {/* Courses Grid */}
                        <div className="grid gap-3">
                          {(step.suggested_Courses ?? []).map(
                            (course, courseIdx) => (
                              <a
                                key={
                                  course.link ??
                                  `${stepIdx}-course-${courseIdx}`
                                }
                                href={course.link ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all group"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                      {course.title}
                                    </div>
                                    {course.reason && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {course.reason}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                        {course.level
                                          ? getLevelInVietnamese(course.level)
                                          : "N/A"}
                                      </span>
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                        {course.provider ?? "Đối tác"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                    <FiExternalLink className="text-purple-600 dark:text-purple-400 w-4 h-4" />
                                  </div>
                                </div>
                              </a>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const [activeTab, setActiveTab] = useState("analysis");

  // Helper function để loại bỏ heading ## từ markdown
  const removeMarkdownHeading = (markdown: string) => {
    return markdown.replace(/^##\s+[^\n]+\n+/, "").trim();
  };

  if (!pathId) {
    return (
      <div className="p-8 text-center text-sm text-red-600">
        Thiếu learning path Id trong URL. Vui lòng kiểm tra đường dẫn.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header Card - Combined */}
        <Card className="mb-6 overflow-hidden border-0 shadow-lg">
          {/* Top Section - Title & Status */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-6 border-b border-orange-100 dark:border-orange-900">
            <div className="flex items-start justify-between gap-4 my-1">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    Lộ trình đề xuất
                  </div>
                  {isStreaming && (
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Đang cập nhật
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {learningPath?.pathName || "Lộ trình học tập"}
                </h1>
                {/* DEBUG: Log values */}
                {(() => {
                  console.log("🔍 Progress Check:", {
                    status,
                    statusType: typeof status,
                    InProgressEnum: LearningPathStatus.InProgress,
                    isStatusValid:
                      status != null && status >= LearningPathStatus.InProgress,
                    completionPercent: learningPath?.completionPercent,
                    completionType: typeof learningPath?.completionPercent,
                    isNumberType:
                      typeof learningPath?.completionPercent === "number",
                    shouldShow:
                      status != null &&
                      status >= LearningPathStatus.InProgress &&
                      typeof learningPath?.completionPercent === "number",
                  });
                  return null;
                })()}
                {/* Completion Progress - Only show if status >= InProgress (2) */}
                {status != null &&
                  status >= LearningPathStatus.InProgress &&
                  typeof learningPath?.completionPercent === "number" && (
                    <div className="mt-3 flex items-center gap-3">
                      <Progress
                        percent={Math.round(learningPath.completionPercent)}
                        strokeColor={{
                          "0%": "#fb923c",
                          "100%": "#f97316",
                        }}
                        trailColor="#fed7aa"
                        size="small"
                        className="flex-1 max-w-full"
                      />
                    </div>
                  )}
              </div>
              <div className="flex items-center gap-2">
                <Tag
                  color={
                    status != null
                      ? ["orange", "cyan", "blue", "green", "default", "gold"][
                          status
                        ] || "default"
                      : "default"
                  }
                >
                  {statusLabel}
                </Tag>
                <button
                  type="button"
                  onClick={() =>
                    fetchLearningPath(
                      status === LearningPathStatus.Choosing ? "text" : "json",
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
                  disabled={loading}
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Summary */}
          <div className="p-6 bg-white dark:bg-slate-800">
            <div className="prose prose-sm max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed">
              {summaryFeedback ? (
                <MarkdownBlock markdown={summaryFeedback} />
              ) : isPending ? (
                <SkeletonParagraph lines={3} />
              ) : (
                <p className="text-gray-500 italic">
                  Hệ thống đang tổng hợp phản hồi cá nhân hoá cho lộ trình của
                  bạn...
                </p>
              )}
              <div className="flex items-center justify-end">
                {/* <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Tóm tắt kết quả học tập
              </h3> */}
                {hasTranscript && (
                  <button
                    type="button"
                    onClick={handlePreviewTranscript}
                    className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-[#49BBBD] hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-[#49BBBD]/30 transition-colors"
                  >
                    <FiFileText className="w-4 h-4" />
                    Bảng điểm
                  </button>
                )}
              </div>
            </div>
            {error && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </Card>

        {loading && (
          <div className="">{/* Đang tải dữ liệu lộ trình... */}</div>
        )}

        {/* Main Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: "analysis",
              label: "Phân tích chung",
              children: (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tính cách học tập */}
                    <div className="rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-3 border-b border-orange-100 dark:border-orange-900/50">
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                          Tính cách
                        </span>
                      </div>
                      <div className="p-5 flex-1">
                        {personality ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400">
                            <MarkdownBlock
                              markdown={removeMarkdownHeading(personality)}
                            />
                          </div>
                        ) : isPending ? (
                          <SkeletonParagraph lines={5} />
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Đang phân tích tính cách học tập của bạn...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Thói quen & sở thích học tập */}
                    <div className="rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-3 border-b border-orange-100 dark:border-orange-900/50">
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                          Thói quen & Sở thích
                        </span>
                      </div>
                      <div className="p-5 flex-1">
                        {habitAnalysis ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400">
                            <MarkdownBlock
                              markdown={removeMarkdownHeading(habitAnalysis)}
                            />
                          </div>
                        ) : isPending ? (
                          <SkeletonParagraph lines={5} />
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Đang phân tích thói quen học tập của bạn...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Năng lực học tập */}
                    <div className="rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-3 border-b border-orange-100 dark:border-orange-900/50">
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                          Năng lực học tập
                        </span>
                      </div>
                      <div className="p-5 flex-1">
                        {learningAbility ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400">
                            <MarkdownBlock
                              markdown={removeMarkdownHeading(learningAbility)}
                            />
                          </div>
                        ) : isPending ? (
                          <SkeletonParagraph lines={5} />
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Đang đánh giá năng lực học tập của bạn...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phân tích năng lực thực hành - Carousel */}
                  {praticalAbilityFeedbacks &&
                    praticalAbilityFeedbacks.length > 0 && (
                      <>
                        <style>{`
                          /* Ẩn default arrow icon (::before pseudo-element) */
                          .pratical-ability-carousel .slick-prev::before,
                          .pratical-ability-carousel .slick-next::before {
                            content: '' !important;
                            opacity: 0 !important;
                          }
                          
                          /* Style cho custom arrow buttons */
                          .pratical-ability-carousel .slick-prev,
                          .pratical-ability-carousel .slick-next {
                            width: 40px !important;
                            height: 0px !important;
                            z-index: 10 !important;
                          }
                          
                          .pratical-ability-carousel .slick-prev {
                            left: 10px !important;
                          }
                          
                          .pratical-ability-carousel .slick-next {
                            right: 10px !important;
                          }
                        `}</style>
                        <div className="mt-8">
                          <Carousel
                            arrows
                            autoplay
                            autoplaySpeed={5000}
                            dots={{
                              className:
                                "!bottom-4 [&_li_button]:!bg-orange-300 [&_li.slick-active_button]:!bg-orange-600",
                            }}
                            className="pratical-ability-carousel"
                            prevArrow={
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors">
                                <FiChevronLeft className="text-orange-500 text-2xl" />
                              </div>
                            }
                            nextArrow={
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors">
                                <FiChevronRight className="text-orange-500 text-2xl" />
                              </div>
                            }
                          >
                            {praticalAbilityFeedbacks.map((feedback, index) => {
                              // Tách metadata và markdown content
                              const fullText = feedback.analysisMarkDown || "";

                              // Tìm vị trí của "##" để tách phần metadata và markdown
                              const markdownStartIndex = fullText.indexOf("##");
                              let testInfo = "";
                              let markdownContent = fullText;

                              if (markdownStartIndex > 0) {
                                // Phần trước "##" là testInfo
                                testInfo = fullText
                                  .substring(0, markdownStartIndex)
                                  .trim();
                                // Loại bỏ dấu ":" cuối cùng nếu có
                                testInfo = testInfo
                                  .replace(/:+\s*$/, "")
                                  .trim();
                                // Phần từ "##" trở đi là markdown
                                markdownContent = fullText
                                  .substring(markdownStartIndex)
                                  .trim();
                              }

                              // Kiểm tra loại phân tích
                              const isTranscriptAnalysis =
                                testInfo
                                  .toLowerCase()
                                  .includes("phân tích dựa trên bảng điểm") ||
                                testInfo.toLowerCase().includes("bảng điểm");

                              const isPracticalTest =
                                !isTranscriptAnalysis &&
                                (testInfo
                                  .toLowerCase()
                                  .includes("bài test tự luận") ||
                                  testInfo
                                    .toLowerCase()
                                    .includes("với độ khó"));

                              const isTheoryTest =
                                !isTranscriptAnalysis && !isPracticalTest;

                              // Trích xuất heading ## đầu tiên (tên tiếng Việt)
                              const headingMatch =
                                markdownContent.match(/^##\s+([^\n]+)/);
                              const vietnameseName = headingMatch
                                ? headingMatch[1].trim()
                                : null;

                              // Nếu là bài test PE hoặc Transcript, lược bỏ heading ## đầu tiên
                              // Nếu là bài test TE, cũng lược bỏ heading ## (vì sẽ hiển thị trong parenthesis)
                              if (vietnameseName) {
                                markdownContent = markdownContent
                                  .replace(/^##\s+[^\n]+\n/, "")
                                  .trim();
                              }

                              // Với bài test TE, thêm tên tiếng Việt vào testInfo
                              if (isTheoryTest && vietnameseName) {
                                testInfo = `${testInfo} (${vietnameseName})`;
                              }

                              return (
                                <div
                                  key={`pratical-feedback-${index}`}
                                  className=""
                                >
                                  {/* Card giống 3 card phân tích */}
                                  <div className="rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden flex flex-col shadow-sm">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-4 border-b border-orange-100 dark:border-orange-900/50">
                                      <div className="flex items-start gap-3 mb-3">
                                        {/* <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-bold flex-shrink-0 shadow-md">
                                        {index + 1}
                                      </span> */}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            {isTranscriptAnalysis ? (
                                              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                                                Phân tích từ bảng điểm
                                              </span>
                                            ) : (
                                              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                                                Bài đánh giá {index + 1} /{" "}
                                                {
                                                  praticalAbilityFeedbacks.length
                                                }
                                              </span>
                                            )}
                                            {/* {isTranscriptAnalysis && (
                                              <Tag
                                                color="blue"
                                                className="text-xs m-0"
                                              >
                                                Bảng điểm
                                              </Tag>
                                            )} */}
                                            {isPracticalTest && (
                                              <Tag
                                                color="purple"
                                                className="text-xs m-0"
                                              >
                                                Thực hành
                                              </Tag>
                                            )}
                                            {isTheoryTest && (
                                              <Tag
                                                color="green"
                                                className="text-xs m-0"
                                              >
                                                Lý thuyết
                                              </Tag>
                                            )}
                                            {/* {difficulty && (
                                              <Tag
                                                color={difficultyColor}
                                                className="text-xs m-0"
                                              >
                                                {difficulty}
                                              </Tag>
                                            )} */}
                                          </div>
                                        </div>
                                      </div>
                                      {testInfo &&
                                        (isTranscriptAnalysis ? (
                                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                                            Hệ thống đưa ra đánh giá dựa trên
                                            bảng điểm của bạn
                                          </h4>
                                        ) : (
                                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                                            {testInfo}
                                          </h4>
                                        ))}
                                    </div>

                                    {/* Body */}
                                    <div className="py-6 px-15 flex-1">
                                      {markdownContent ? (
                                        <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400 prose-h3:text-sm prose-h3:font-semibold prose-h3:mb-2 prose-h3:text-orange-700 dark:prose-h3:text-orange-400 prose-ul:my-2 prose-li:my-0.5 prose-li:text-sm">
                                          <MarkdownBlock
                                            markdown={markdownContent}
                                          />
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                          Không có dữ liệu phân tích
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </Carousel>
                        </div>
                      </>
                    )}

                  {/* Level Assessment - Collapse */}
                  {learningPath?.level && (
                    <div className="mt-8">
                      <Collapse
                        ghost
                        expandIconPosition="end"
                        items={[
                          {
                            key: "level-detail",
                            label: (
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                                  Đánh giá trình độ của bạn:
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full text-sm  font-bold ${
                                    LEVEL_CONFIG[
                                      learningPath.level as 1 | 2 | 3
                                    ]
                                  }`}
                                >
                                  {LEVEL_CONFIG[learningPath.level as 1 | 2 | 3]
                                    ?.label || `Level ${learningPath.level}`}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  (Click để xem chi tiết)
                                </span>
                              </div>
                            ),
                            children: (
                              <div className="pt-2 pb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                  Dựa trên kết quả bài kiểm tra lý thuyết và
                                  thực hành
                                </p>
                                {learningPath?.levelReason ? (
                                  <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400">
                                    <MarkdownBlock
                                      markdown={learningPath.levelReason.replace(
                                        /\n---\n*$/,
                                        "",
                                      )}
                                    />
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    Đang phân tích kết quả đánh giá của bạn...
                                  </p>
                                )}
                              </div>
                            ),
                          },
                        ]}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-orange-900/50 overflow-hidden shadow-sm [&_.ant-collapse-header]:!bg-gradient-to-r [&_.ant-collapse-header]:!from-orange-50 [&_.ant-collapse-header]:!to-amber-50 dark:[&_.ant-collapse-header]:!from-orange-950/30 dark:[&_.ant-collapse-header]:!to-amber-950/30 [&_.ant-collapse-header]:!px-6 [&_.ant-collapse-header]:!py-6 [&_.ant-collapse-content-box]:!px-6 [&_.ant-collapse-expand-icon]:!text-orange-600 dark:[&_.ant-collapse-expand-icon]:!text-orange-400"
                      />
                    </div>
                  )}
                </>
              ),
            },
            {
              key: "roadmap",
              label: "Lộ trình học tập",
              children: (
                <div className="space-y-5">
                  {/* Section 1: Lộ trình khởi đầu */}
                  <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                    <div
                      className="px-6 py-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => setShowBasicSection((prev) => !prev)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-semibold text-orange-500 dark:text-orange-400 uppercase tracking-wide">
                              Phần 1
                            </span>
                            <span className="text-xs text-gray-300 dark:text-gray-600">
                              •
                            </span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {basicSemesters.reduce(
                                (acc, s) => acc + s.groups.length,
                                0,
                              )}{" "}
                              môn học
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Lộ trình khởi đầu
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Dựa trên năng lực hiện tại của bạn, hệ thống đề xuất
                            bạn nên củng cố các môn nền tảng dưới đây
                          </p>
                        </div>
                        <FiChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showBasicSection ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                    {showBasicSection && (
                      <div className="p-6">{renderBasicContent()}</div>
                    )}
                  </section>

                  {/* Section 2: Chuyên ngành hẹp */}
                  <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                    <div
                      className="px-6 py-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => setShowInternalSection((prev) => !prev)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-semibold text-[#49BBBD] dark:text-cyan-400 uppercase tracking-wide">
                              Phần 2
                            </span>
                            <span className="text-xs text-gray-300 dark:text-gray-600">
                              •
                            </span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {isChoosingStatus || isPending
                                ? `${internalMajors.length} chuyên ngành đề xuất`
                                : `${internalMajors.length} chuyên ngành đã chọn`}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Chuyên ngành hẹp
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {isChoosingStatus
                              ? "Chọn và sắp xếp thứ tự các chuyên ngành bạn muốn học"
                              : "Học theo thứ tự đã sắp xếp để đạt hiệu quả tốt nhất"}
                          </p>
                        </div>
                        <FiChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showInternalSection ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                    {showInternalSection && (
                      <div className="p-6">
                        {renderInternalContent(displayedInternalMajors)}
                      </div>
                    )}
                  </section>

                  {/* Section 3: Khóa học bên ngoài */}
                  <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                    <div
                      className="px-6 py-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => setShowExternalSection((prev) => !prev)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wide">
                              Phần 3
                            </span>
                            <span className="text-xs text-gray-300 dark:text-gray-600">
                              •
                            </span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {externalTracks.length} track
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Đề xuất khóa học bên ngoài
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Các khóa học bổ sung từ nền tảng ngoài để bù lấp lỗ
                            hổng kỹ năng
                          </p>
                        </div>
                        <FiChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showExternalSection ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                    {showExternalSection && (
                      <div className="p-6">{renderExternalContent()}</div>
                    )}
                  </section>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Course Suggestion Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FiSearch className="w-5 h-5 text-[#49BBBD]" />
            <span className="font-bold">
              Tìm khóa học khác - {selectedSubjectCode}
            </span>
          </div>
        }
        open={showCourseSuggestionModal}
        onCancel={() => setShowCourseSuggestionModal(false)}
        footer={null}
        width={1100}
        centered
      >
        <div className="space-y-4">
          {/* Filter Section */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Độ khó:
            </span>
            <Select
              value={suggestionType}
              onChange={handleSuggestionTypeChange}
              className="w-48"
              options={[
                { value: 1, label: "Dễ hơn" },
                { value: 2, label: "Khó hơn" },
              ]}
            />
            <div className="flex-1" />
            <Tag color="blue" className="text-xs">
              {suggestedCourses.length} khóa học
            </Tag>
          </div>

          {/* Courses List */}
          <Spin spinning={loadingSuggestions}>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {suggestedCourses.length === 0 && !loadingSuggestions ? (
                <div className="text-center py-12">
                  <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy khóa học phù hợp
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Thử chọn độ khó khác hoặc quay lại sau
                  </p>
                </div>
              ) : (
                suggestedCourses.map((course: CourseBasicInfoDto, index) => (
                  <div
                    key={course.courseId ?? index}
                    className="rounded-xl p-4 transition-all duration-200 flex gap-5"
                  >
                    <CourseCard
                      id={course.courseId ?? ""}
                      imageUrl={
                        course.courseImageUrl ??
                        "https://via.placeholder.com/600x400?text=EduSmart"
                      }
                      title={course.title ?? "Khóa học"}
                      descriptionLines={
                        course.shortDescription ? [course.shortDescription] : []
                      }
                      instructor={course.teacherName ?? "Giảng viên"}
                      level={course.level}
                      price={course.price}
                      dealPrice={course.dealPrice}
                      routerPush={`/course/${course.courseId}`}
                      isHorizontal={true}
                    />
                    <div className="mt-3 flex flex-1 items-center justify-center ">
                      <Button
                        type="primary"
                        size="middle"
                        icon={<FiPlus className="w-4 h-4" />}
                        loading={addingCourseId === course.courseId}
                        disabled={addingCourseId !== null}
                        onClick={() =>
                          handleAddCourseToPath(course.courseId ?? "")
                        }
                        className="bg-[#49BBBD] hover:bg-cyan-600 border-none"
                      >
                        {addingCourseId === course.courseId
                          ? "Đang thêm..."
                          : "Thêm vào lộ trình"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Spin>
        </div>
      </Modal>

      {/* External Courses Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FiGlobe className="w-5 h-5 text-[#FF6B6B]" />
            <span className="font-bold">
              Khóa học bên ngoài - {externalSubjectCode}
            </span>
          </div>
        }
        open={showExternalCoursesModal}
        onCancel={() => setShowExternalCoursesModal(false)}
        footer={null}
        width={1200}
        centered
      >
        <div className="space-y-4">
          {/* Info Section */}
          {/* <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <FiGlobe className="w-5 h-5 text-[#FF6B6B]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Khóa học từ các nền tảng: Coursera, Udemy, edX...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tìm thấy {externalCourses.length} khóa học phù hợp với môn{" "}
                {externalSubjectCode}
              </p>
            </div>
          </div> */}

          {/* Courses List */}
          <Spin spinning={loadingExternalCourses}>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {externalCourses.length === 0 && !loadingExternalCourses ? (
                <div className="text-center py-12">
                  <FiGlobe className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy khóa học bên ngoài phù hợp
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Thử lại sau hoặc tìm kiếm môn học khác
                  </p>
                </div>
              ) : (
                externalCourses.map((course, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-[#FF6B6B] dark:hover:border-orange-600 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      {/* Course Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                            {course.title}
                          </h3>
                          {course.rating && (
                            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                              <span className="text-yellow-500">⭐</span>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {course.rating}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <Tag color="blue" className="text-xs">
                            {course.provider}
                          </Tag>
                          {course.level && (
                            <Tag color="green" className="text-xs">
                              {getLevelInVietnamese(course.level)}
                            </Tag>
                          )}
                          {course.estimatedWeeks && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ~{course.estimatedWeeks} tuần
                            </span>
                          )}
                        </div>

                        {course.snippet && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                            {course.snippet}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <a
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-[#FF6B6B] hover:bg-[#ff5252] rounded-lg transition-colors"
                          >
                            <FiExternalLink className="w-4 h-4" />
                            Xem khóa học
                          </a>
                          {course.score && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              Độ phù hợp: {(course.score * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Spin>
        </div>
      </Modal>

      {/* Transcript Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FiFileText className="w-5 h-5 text-[#49BBBD]" />
            <span>Bảng điểm của bạn</span>
          </div>
        }
        open={showTranscriptModal}
        onCancel={() => setShowTranscriptModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowTranscriptModal(false)}>
            Đóng
          </Button>,
        ]}
        width={1000}
        centered
      >
        <Spin spinning={loadingTranscript}>
          <div className="mt-4">
            {transcriptData.length === 0 && !loadingTranscript ? (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu bảng điểm
              </div>
            ) : (
              <Table
                columns={transcriptColumns}
                dataSource={transcriptData}
                rowKey="studentTranscriptId"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) => `Tổng ${total} môn học`,
                }}
                scroll={{ x: 800 }}
                size="small"
                bordered
              />
            )}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default LearningPathSamplePage;
