"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { Card, Tabs, Tag } from "antd";
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
  FiBook,
  FiExternalLink,
  FiStar,
} from "react-icons/fi";
import {
  CourseGroupDto as GeneratedCourseGroupDto,
  CourseItemDto,
  ExternalLearningPathDto,
  LearningPathSelectDto as GeneratedLearningPathSelectDto,
  LearningPathSelectResponse,
} from "EduSmart/api/api-student-service";

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

const LEARNING_PATH_STATUS_STYLE: Record<LearningPathStatus, string> = {
  [LearningPathStatus.Generating]: "bg-orange-100 text-orange-700",
  [LearningPathStatus.Choosing]: "bg-cyan-100 text-cyan-700",
  [LearningPathStatus.InProgress]: "bg-blue-100 text-blue-700",
  [LearningPathStatus.Completed]: "bg-emerald-100 text-emerald-700",
  [LearningPathStatus.Closed]: "bg-slate-100 text-slate-700",
  [LearningPathStatus.Paused]: "bg-amber-100 text-amber-700",
};

interface SubjectInsight {
  score?: number;
  target?: number;
  summary?: string;
  reasons?: string[];
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

const CORE_SKILL_STATUS = [
  {
    key: "dsa",
    label: "Cấu trúc dữ liệu & giải thuật",
    score: 48,
    target: 70,
    status: "Thiếu 22 điểm so với chuẩn tuyển dụng Fresher Backend.",
    summary:
      "Nhanh ở bài toán tuyến tính nhưng mất điểm ở dạng đồ thị & phân tích độ phức tạp. Cần luyện thêm 3-4 tuần với bài tập chuẩn hoá.",
  },
  {
    key: "db",
    label: "Cơ sở dữ liệu",
    score: 62,
    target: 75,
    status:
      "Hiểu query cơ bản nhưng chưa tối ưu hoá, thiếu trải nghiệm thiết kế chuẩn 3NF.",
    summary:
      "Điểm mạnh là viết được trigger/procedure đơn giản, tuy nhiên phần index & transaction isolation còn yếu.",
  },
  {
    key: "oop",
    label: "Lập trình hướng đối tượng",
    score: 58,
    target: 80,
    status: "Chưa thành thạo SOLID, refactor còn lúng túng khi scale module.",
    summary:
      "Bạn xử lý inheritance tốt nhưng chưa biết đo đạc cohesion/coupling để tái cấu trúc class.",
  },
  {
    key: "htmlcss",
    label: "Lập trình web HTML & CSS cơ bản",
    score: 54,
    target: 75,
    status: "Thiếu cảm giác spacing, layout responsive chưa vững.",
    summary:
      "Nắm được flexbox ở mức cơ bản nhưng grid system và accessibility (semantic tag) dưới mức yêu cầu.",
  },
];

const SUBJECT_STATUS_META = {
  0: {
    label: "Ưu tiên học",
    badgeClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-50",
    toneClass:
      "border-orange-200 bg-orange-50/60 dark:border-orange-500/30 dark:bg-orange-500/5",
    review: "Môn nền tảng, nên bắt đầu sớm để giữ tiến độ chung.",
  },
  1: {
    label: "Đang học",
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-50",
    toneClass:
      "border-blue-200 bg-blue-50/60 dark:border-blue-500/30 dark:bg-blue-500/5",
    review: "Bạn đang theo học, tiếp tục duy trì nhịp độ hiện tại.",
  },
  2: {
    label: "Đã vững",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-50",
    toneClass:
      "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/5",
    review: "Đã hoàn thành tốt, có thể chuyển sang nội dung nâng cao.",
  },
  3: {
    label: "Nâng cao",
    badgeClass:
      "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-50",
    toneClass:
      "border-teal-200 bg-teal-50/60 dark:border-teal-500/30 dark:bg-teal-500/5",
    review: "Đủ nền tảng để thử các khóa chuyên sâu hoặc luyện thi.",
  },
} as const;

const getStatusMeta = (status?: number) =>
  SUBJECT_STATUS_META[(status as keyof typeof SUBJECT_STATUS_META) ?? 0] ??
  SUBJECT_STATUS_META[0];

const toCourseCardProps = (course: CourseItemDto) => {
  const descriptionSource =
    course.shortDescription ||
    course.description?.replace(/<[^>]+>/g, " ") ||
    "";
  const descriptionLines = descriptionSource
    .split(/[.•]| - |:/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    id: course.courseId ?? crypto.randomUUID(),
    imageUrl:
      course.courseImageUrl ??
      "https://via.placeholder.com/600x400?text=EduSmart",
    title: course.title ?? "Khoá học",
    descriptionLines,
    instructor: course.teacherName ?? "",
    price: course.price ?? undefined,
    dealPrice: course.dealPrice ?? undefined,
    isEnrolled: Boolean(course.isEnrolled),
    isWishList: Boolean(course.isWishList),
    routerPush: `/courses/${course.slug ?? course.courseId ?? ""}`,
    tagNames: course.tagNames ?? [],
    level: course.level ?? undefined,
    isHorizontal: true,
  };
};

const getSemesterNarrative = (groups: ExtendedCourseGroupDto[]) => {
  const priority = groups.find((g) => (g.status ?? 0) === 0);
  if (priority) {
    return `Ưu tiên củng cố ${priority.subjectCode} và hoàn thiện các môn còn lại.`;
  }
  return "Duy trì nhịp học ổn định ở toàn bộ môn trong kỳ này.";
};

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

const mapGroupsBySemester = (groups?: ExtendedCourseGroupDto[]) => {
  if (!groups) return [];
  const map = new Map<number, ExtendedCourseGroupDto[]>();

  groups.forEach((group) => {
    splitGroupBySemester(group).forEach(({ semester, group: splitted }) => {
      const existing = map.get(semester) ?? [];
      existing.push(splitted);
      map.set(semester, existing);
    });
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([semester, groups]) => ({ semester, groups }));
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
  const [expandedInternal, setExpandedInternal] = useState<
    Record<string, boolean>
  >({});
  const [showBasicSection, setShowBasicSection] = useState(true);
  const [showInternalSection, setShowInternalSection] = useState(true);
  const [showExternalSection, setShowExternalSection] = useState(true);
  const [collapsedSemesters, setCollapsedSemesters] = useState<
    Record<number, boolean>
  >({});
  const [collapsedMajors, setCollapsedMajors] = useState<
    Record<string, boolean>
  >({});
  const [collapsedMajorSemesters, setCollapsedMajorSemesters] = useState<
    Record<string, boolean>
  >({});
  const [collapsedTracks, setCollapsedTracks] = useState<
    Record<string, boolean>
  >({});
  const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);
  const [draggingMajorId, setDraggingMajorId] = useState<string | null>(null);
  const [chooseMajorsLoading, setChooseMajorsLoading] = useState(false);
  const [chooseMajorsError, setChooseMajorsError] = useState<string | null>(
    null,
  );
  const [chooseMajorsSuccess, setChooseMajorsSuccess] = useState<string | null>(
    null,
  );

  const summaryFeedback = learningPath?.summaryFeedback;
  const personality = learningPath?.personality;
  const habitAnalysis = learningPath?.habitAndInterestAnalysis;
  const learningAbility = learningPath?.learningAbility;

  const aiProfileCards = useMemo(() => {
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
    setExpandedInternal({});
    setShowBasicSection(true);
    setShowInternalSection(true);
    setShowExternalSection(true);
    setCollapsedSemesters({});
    setCollapsedMajors({});
    setCollapsedMajorSemesters({});
    setCollapsedTracks({});
    setSelectedMajorIds([]);
    setChooseMajorsError(null);
    setChooseMajorsSuccess(null);
  }, [pathId]);
  const deriveSemesterMeta = (groups: ExtendedCourseGroupDto[]) => {
    if (!groups.length) {
      return getStatusMeta(0);
    }
    const minStatus = Math.min(
      ...groups.map((group) => (group.status ?? 0) as number),
    );
    return getStatusMeta(minStatus);
  };

  const computeMajorProgress = (
    timeline: Array<{ semester: number; groups: ExtendedCourseGroupDto[] }>,
  ) => {
    if (timeline.length === 0) return 0;
    const completed = timeline.filter(({ groups }) =>
      groups.every((group) => (group.status ?? 0) >= 2),
    ).length;
    return Math.round((completed / timeline.length) * 100);
  };

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
  const majorOptions = useMemo(
    () =>
      internalMajors.map((major, idx) => ({
        key: major.majorId ?? `${major.majorCode ?? "major"}-${idx}`,
        major,
      })),
    [internalMajors],
  );
  const majorOptionMap = useMemo(() => {
    const map = new Map<string, InternalMajorDto>();
    majorOptions.forEach(({ key, major }) => map.set(key, major));
    return map;
  }, [majorOptions]);
  const defaultMajorIds = useMemo(
    () => majorOptions.map((option) => option.key),
    [majorOptions],
  );
  useEffect(() => {
    if (defaultMajorIds.length === 0) {
      setSelectedMajorIds([]);
      return;
    }
    setSelectedMajorIds((prev) => {
      if (prev.length === 0) return defaultMajorIds;
      const sanitized = prev.filter((id) => defaultMajorIds.includes(id));
      const missing = defaultMajorIds.filter((id) => !sanitized.includes(id));
      return [...sanitized, ...missing];
    });
  }, [defaultMajorIds]);

  const externalTracks = learningPath?.externalLearningPath ?? [];

  const statusLabel =
    status != null
      ? (LEARNING_PATH_STATUS_LABEL[status] ?? "Không xác định")
      : "Không xác định";

  const statusBadgeClass =
    status != null
      ? (LEARNING_PATH_STATUS_STYLE[status] ?? "bg-slate-100 text-slate-700")
      : "bg-slate-100 text-slate-700";

  const isPending =
    loading || status === LearningPathStatus.Generating || false;
  const isChoosingStatus = status === LearningPathStatus.Choosing;
  const selectedMajors = useMemo<InternalMajorDto[]>(
    () =>
      selectedMajorIds
        .map((id) => majorOptionMap.get(id))
        .filter((major): major is InternalMajorDto => Boolean(major)),
    [selectedMajorIds, majorOptionMap],
  );
  const displayedInternalMajors = useMemo(
    () => (isChoosingStatus ? selectedMajors : internalMajors),
    [isChoosingStatus, selectedMajors, internalMajors],
  );
  const handleSlotSelectChange = (slotIndex: number, nextId: string) => {
    if (!nextId) return;
    setSelectedMajorIds((prev) => {
      if (!prev.length) return prev;
      const current = prev[slotIndex];
      if (current === nextId) return prev;
      const nextOrder = [...prev];
      const existingIndex = nextOrder.indexOf(nextId);
      if (existingIndex !== -1) {
        nextOrder[existingIndex] = current;
      }
      nextOrder[slotIndex] = nextId;
      return nextOrder;
    });
    setChooseMajorsError(null);
    setChooseMajorsSuccess(null);
  };
  const handleDragStart = (majorId: string) => {
    setDraggingMajorId(majorId);
  };
  const handleDragEnter = (targetId: string) => {
    if (!draggingMajorId || draggingMajorId === targetId) return;
    setSelectedMajorIds((prev) => {
      const fromIndex = prev.indexOf(draggingMajorId);
      const toIndex = prev.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) {
        return prev;
      }
      const updated = [...prev];
      updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, draggingMajorId);
      return updated;
    });
    setChooseMajorsError(null);
    setChooseMajorsSuccess(null);
  };
  const handleDragEnd = () => {
    setDraggingMajorId(null);
  };
  const resetMajorSelection = () => {
    setSelectedMajorIds(defaultMajorIds);
    setChooseMajorsError(null);
    setChooseMajorsSuccess(null);
  };
  const handleConfirmMajorSelection = async () => {
    if (!pathId) {
      setChooseMajorsError("Thiếu thông tin lộ trình.");
      return;
    }
    const orderedIds =
      selectedMajors
        .map((major) => major.majorId)
        .filter((id): id is string => Boolean(id)) ?? [];
    if (orderedIds.length === 0) {
      setChooseMajorsError("Vui lòng chọn ít nhất một chuyên ngành hợp lệ.");
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

  const renderBasicContent = () => {
    if (!showBasicSection) return null;
    if (isPending) return <BasicTimelineSkeleton />;
    if (basicSemesters.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Chưa có dữ liệu học phần nền tảng cho lộ trình này.
        </p>
      );
    }

    return (
      <div className="relative pl-10">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-orange-200 dark:bg-orange-400/30" />
        {basicSemesters.map(({ semester, groups }) => {
          const isCollapsed = Boolean(collapsedSemesters[semester]);
          const semesterOpen = !isCollapsed;

          return (
            <div key={semester} className="relative mb-14 pl-10">
              <div className="absolute left-0 top-2 w-16 h-16 rounded-full bg-white border-4 border-orange-300 shadow-md flex items-center justify-center text-sm font-black text-orange-600 dark:bg-[#0f1d33] dark:text-orange-100 dark:border-orange-400/40">
                Kỳ {semester}
              </div>
              <div className="bg-white dark:bg-[#081229] rounded-2xl border border-orange-100 dark:border-orange-400/20 p-6 shadow-sm dark:shadow-[0_0_20px_rgba(8,18,41,0.6)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-orange-500 font-semibold mb-1">
                      Đánh giá kỳ {semester}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getSemesterNarrative(groups)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {groups
                        .map(
                          (group) =>
                            `${group.subjectCode ?? "SUB"} · ${
                              getStatusMeta(group.status).label
                            }`,
                        )
                        .join(" • ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiStar className="text-orange-500" />
                    {groups.reduce(
                      (sum, group) => sum + (group.courses?.length ?? 0),
                      0,
                    )}{" "}
                    khóa học gợi ý
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedSemesters((prev) => ({
                          ...prev,
                          [semester]: !Boolean(prev[semester]),
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition dark:border-orange-400/40 dark:text-orange-100 dark:bg-transparent dark:hover:bg-orange-500/10"
                    >
                      {semesterOpen ? "Thu gọn kỳ" : "Mở kỳ"}
                      {semesterOpen ? (
                        <FiChevronUp className="h-4 w-4" />
                      ) : (
                        <FiChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {semesterOpen && (
                  <div className="space-y-6">
                    {groups.map((group) => {
                      const statusMeta = getStatusMeta(group.status);
                      const key = `${semester}-${group.subjectCode ?? "SUB"}`;
                      const isOpen = Boolean(expandedBasic[key]);
                      const insight = (group as ExtendedCourseGroupDto).insight;
                      const analysisMarkdown = (group as ExtendedCourseGroupDto)
                        .analysisMarkdown;
                      const courseCount = group.courses?.length ?? 0;
                      const canToggleCourses = courseCount > 0;

                      return (
                        <div
                          key={key}
                          className={`rounded-2xl border ${statusMeta.toneClass} p-5 transition shadow-sm`}
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm uppercase tracking-wide text-gray-400">
                                {group.subjectCode ?? "Môn học"}
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {statusMeta.review}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {courseCount > 0
                                  ? `${courseCount} lựa chọn khóa học`
                                  : "Chưa có khóa học gợi ý"}
                              </p>
                            </div>
                            <span
                              className={`self-start md:self-auto px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>
                          {insight && (
                            <div className="mt-4 rounded-2xl border border-orange-100 bg-white/80 dark:bg-slate-900/80 p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl font-black text-orange-500">
                                  {insight.score ?? "--"}
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-400">
                                    Điểm hiện tại
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Chuẩn mục tiêu {insight.target ?? "--"}+
                                  </p>
                                </div>
                              </div>
                              {insight.summary && <p>{insight.summary}</p>}
                              {insight.reasons &&
                                insight.reasons.length > 0 && (
                                  <ul className="list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400">
                                    {insight.reasons.map(
                                      (reason: string, idx: number) => (
                                        <li key={`${key}-reason-${idx}`}>
                                          {reason}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                )}
                            </div>
                          )}
                          {analysisMarkdown && (
                            <MarkdownBlock
                              markdown={analysisMarkdown}
                              className="mt-4 rounded-2xl border border-orange-100 bg-white/70 dark:bg-slate-900/70 p-4 prose prose-sm max-w-none text-gray-600 dark:text-gray-300 prose-p:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
                            />
                          )}
                          {canToggleCourses && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedBasic((prev) => ({
                                    ...prev,
                                    [key]: !prev[key],
                                  }))
                                }
                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-100"
                              >
                                {isOpen
                                  ? "Thu gọn khóa học"
                                  : "Xem chi tiết khóa"}
                                {isOpen ? (
                                  <FiChevronUp className="h-4 w-4" />
                                ) : (
                                  <FiChevronDown className="h-4 w-4" />
                                )}
                              </button>

                              {isOpen && (
                                <div className="flex flex-col gap-4">
                                  {(group.courses ?? []).map((course, idx) => (
                                    <CourseCard
                                      key={
                                        course.courseId ??
                                        `${key}-course-${idx}`
                                      }
                                      {...toCourseCardProps(course)}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          )}
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

  const renderInternalContent = (majorsList: InternalMajorDto[]) => {
    if (!showInternalSection) return null;
    if (isPending) return <InternalMajorSkeleton />;
    if (majorsList.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Chưa có dữ liệu chuyên ngành nội bộ cho lộ trình này.
        </p>
      );
    }

    return (
      <div className="space-y-8">
        {majorsList.map((major, majorIdx) => {
          const majorKey = major.majorId ?? `major-${majorIdx}`;
          const isMajorCollapsed = Boolean(collapsedMajors[majorKey]);
          const majorOpen = !isMajorCollapsed;
          const semesterTimeline = mapGroupsBySemester(major.majorCourseGroups);
          const progressPercent = computeMajorProgress(semesterTimeline);

          return (
            <div
              key={major.majorId ?? `major-${majorIdx}`}
              className="rounded-3xl border border-cyan-100 dark:border-[#122138] p-6 bg-white dark:bg-[#040b17] shadow-sm dark:shadow-[0_0_30px_rgba(4,11,23,0.8)] space-y-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-semibold">
                    Major {majorIdx + 1}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {major.majorCode ?? major.majorId ?? "Chuyên ngành"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {major.reason ??
                      "Hệ thống chưa cung cấp lý do đề xuất cho chuyên ngành này."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCollapsedMajors((prev) => ({
                      ...prev,
                      [majorKey]: !Boolean(prev[majorKey]),
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition self-start lg:self-auto"
                >
                  {majorOpen ? "Thu gọn major" : "Mở major"}
                  {majorOpen ? (
                    <FiChevronUp className="h-4 w-4" />
                  ) : (
                    <FiChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {majorOpen && (
                <div className="rounded-3xl border border-cyan-50 dark:border-[#1a2d47] bg-gradient-to-br from-white via-cyan-50/60 to-white dark:from-[#061126] dark:via-[#081b33] dark:to-[#051327] p-6 space-y-8">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-cyan-600">
                      <span>Tiến độ chuyên ngành</span>
                      <span className="px-3 py-1 rounded-full bg-white text-cyan-600 shadow-sm">
                        {progressPercent}% hoàn thành
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/60 dark:bg-[#0d1f36] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 dark:from-cyan-400 dark:to-emerald-300 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {semesterTimeline.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Chưa có dữ liệu học phần cho chuyên ngành này.
                    </p>
                  ) : (
                    <div className="relative pl-10">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-200 via-cyan-100 to-transparent dark:from-cyan-400/40 dark:via-cyan-400/10 dark:to-transparent" />
                      {semesterTimeline.map(({ semester, groups }, idx) => {
                        const semesterKey = `${majorKey}-sem-${semester}`;
                        const isSemesterCollapsed = Boolean(
                          collapsedMajorSemesters[semesterKey],
                        );
                        const semesterOpen = !isSemesterCollapsed;
                        const courseCount = groups.reduce(
                          (sum, group) => sum + (group.courses?.length ?? 0),
                          0,
                        );
                        const semesterMeta = deriveSemesterMeta(groups);

                        return (
                          <div
                            key={semesterKey}
                            className="relative mb-12 pl-10 last:mb-0"
                          >
                            <div className="absolute left-0 top-0 flex flex-col items-center">
                              <div className="w-12 h-12 rounded-full bg-white border-4 border-cyan-300 shadow flex items-center justify-center text-sm font-black text-cyan-600 dark:bg-[#051121] dark:border-cyan-500/40 dark:text-cyan-100">
                                {semester > 0 ? `K${semester}` : "Δ"}
                              </div>
                              {idx !== semesterTimeline.length - 1 && (
                                <div className="flex-1 w-px bg-gradient-to-b from-cyan-200 to-transparent" />
                              )}
                            </div>
                            <div className="bg-white dark:bg-[#091627] rounded-2xl border border-cyan-100 dark:border-[#18314a] p-5 shadow-sm space-y-5">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-semibold">
                                    {semester > 0
                                      ? `Kỳ ${semester}`
                                      : "Gợi ý mở rộng"}
                                  </p>
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {getSemesterNarrative(groups)}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {courseCount} khóa • {groups.length} môn
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${semesterMeta.badgeClass}`}
                                >
                                  {semesterMeta.label}
                                </span>
                              </div>

                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                {groups
                                  .map(
                                    (group) =>
                                      `${group.subjectCode ?? "SUB"} · ${
                                        getStatusMeta(group.status).label
                                      }`,
                                  )
                                  .join(" • ")}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  setCollapsedMajorSemesters((prev) => ({
                                    ...prev,
                                    [semesterKey]: !isSemesterCollapsed,
                                  }))
                                }
                                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-200"
                              >
                                {semesterOpen
                                  ? "Thu gọn môn trong kỳ"
                                  : "Xem môn trong kỳ"}
                                {semesterOpen ? (
                                  <FiChevronUp className="h-4 w-4" />
                                ) : (
                                  <FiChevronDown className="h-4 w-4" />
                                )}
                              </button>

                              {semesterOpen && (
                                <div className="space-y-5 pt-2">
                                  {groups.map((group) => {
                                    const statusMeta = getStatusMeta(
                                      group.status,
                                    );
                                    const groupKey = `${
                                      major.majorId ?? majorIdx
                                    }-${group.subjectCode ?? "SUB"}-${semester}`;
                                    const isOpen = Boolean(
                                      expandedInternal[groupKey],
                                    );
                                    const insight = (
                                      group as ExtendedCourseGroupDto
                                    ).insight;
                                    const analysisMarkdown = (
                                      group as ExtendedCourseGroupDto
                                    ).analysisMarkdown;
                                    const groupCourseCount =
                                      group.courses?.length ?? 0;
                                    const canToggleCourses =
                                      groupCourseCount > 0;

                                    return (
                                      <div
                                        key={groupKey}
                                        className="rounded-2xl border border-cyan-100 dark:border-[#1f3854] bg-white/80 dark:bg-[#0b192d] p-4 space-y-4 shadow-sm"
                                      >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                          <div>
                                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                                              {group.subjectCode ?? "Môn học"}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                              {statusMeta.review}
                                            </p>
                                          </div>
                                          <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}
                                          >
                                            {statusMeta.label}
                                          </span>
                                        </div>

                                        {insight && (
                                          <div className="rounded-2xl border border-cyan-50 dark:border-[#1c3250] bg-white dark:bg-[#0f2139] p-4 text-sm text-gray-600 dark:text-gray-200 space-y-2">
                                            <div className="flex items-center gap-3">
                                              <div className="text-2xl font-black text-cyan-500">
                                                {insight.score ?? "--"}
                                              </div>
                                              <div>
                                                <p className="text-xs uppercase tracking-widest text-gray-400">
                                                  Điểm hiện tại
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                  Chuẩn mục tiêu{" "}
                                                  {insight.target ?? "--"}+
                                                </p>
                                              </div>
                                            </div>
                                            {insight.summary && (
                                              <p>{insight.summary}</p>
                                            )}
                                            {insight.reasons &&
                                              insight.reasons.length > 0 && (
                                                <ul className="list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400">
                                                  {insight.reasons.map(
                                                    (
                                                      reason: string,
                                                      idx: number,
                                                    ) => (
                                                      <li
                                                        key={`${groupKey}-reason-${idx}`}
                                                      >
                                                        {reason}
                                                      </li>
                                                    ),
                                                  )}
                                                </ul>
                                              )}
                                          </div>
                                        )}

                                        {analysisMarkdown && (
                                          <MarkdownBlock
                                            markdown={analysisMarkdown}
                                            className="rounded-2xl border border-cyan-100 bg-white/70 dark:bg-[#0f1e33]/90 p-4 prose prose-sm max-w-none text-gray-600 dark:text-gray-300 prose-p:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
                                          />
                                        )}

                                        {canToggleCourses && (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setExpandedInternal((prev) => ({
                                                  ...prev,
                                                  [groupKey]: !prev[groupKey],
                                                }))
                                              }
                                              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-200"
                                            >
                                              {isOpen
                                                ? "Thu gọn khóa học"
                                                : "Xem chi tiết khóa"}
                                              {isOpen ? (
                                                <FiChevronUp className="h-4 w-4" />
                                              ) : (
                                                <FiChevronDown className="h-4 w-4" />
                                              )}
                                            </button>

                                            {isOpen && (
                                              <div className="flex flex-col gap-3">
                                                {(group.courses ?? []).map(
                                                  (course, idx) => (
                                                    <CourseCard
                                                      key={
                                                        course.courseId ??
                                                        `${groupKey}-course-${idx}`
                                                      }
                                                      {...toCourseCardProps(
                                                        course,
                                                      )}
                                                    />
                                                  ),
                                                )}
                                              </div>
                                            )}
                                          </>
                                        )}
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
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderExternalContent = () => {
    if (!showExternalSection) return null;
    if (isPending) return <ExternalTrackSkeleton />;
    if (externalTracks.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Chưa có gợi ý lộ trình ngoài hệ thống cho lộ trình này.
        </p>
      );
    }

    return (
      <div className="space-y-10">
        {externalTracks.map((track, trackIdx) => {
          const trackKey = track.majorId ?? `external-${trackIdx}`;
          const isTrackCollapsed = Boolean(collapsedTracks[trackKey]);
          const trackOpen = !isTrackCollapsed;

          return (
            <div
              key={track.majorId ?? `external-${trackIdx}`}
              className="rounded-3xl border border-lime-100 dark:border-[#1d2f22] bg-white dark:bg-[#030b13] shadow-sm dark:shadow-[0_0_25px_rgba(3,11,19,0.8)] p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 space-y-3">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-lime-50 text-lime-700 text-sm font-semibold dark:bg-lime-500/15 dark:text-lime-200">
                    <FiBook /> Track {trackIdx + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {track.majorCode ?? "TRACK"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {track.reason ??
                      "Hệ thống chưa cung cấp mô tả chi tiết cho track này."}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsedTracks((prev) => ({
                        ...prev,
                        [trackKey]: !Boolean(prev[trackKey]),
                      }))
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-white px-3 py-1 text-xs font-semibold text-lime-600 hover:bg-lime-50 transition dark:border-lime-400/30 dark:text-lime-200 dark:bg-transparent dark:hover:bg-lime-500/10"
                  >
                    {trackOpen ? "Thu gọn track" : "Mở track"}
                    {trackOpen ? (
                      <FiChevronUp className="h-4 w-4" />
                    ) : (
                      <FiChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {trackOpen && (
                  <div className="flex-1 relative pl-10">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-lime-200 dark:bg-lime-400/30" />
                    {(track.steps ?? []).map((step, stepIdx) => (
                      <div
                        key={`${track.majorId ?? trackIdx}-${stepIdx}`}
                        className="relative mb-10 pl-6"
                      >
                        <div className="absolute -left-6 top-0 w-10 h-10 rounded-full bg-white border-2 border-lime-300 flex items-center justify-center text-lime-600 font-semibold shadow dark:bg-[#07120d] dark:border-lime-400/40 dark:text-lime-200">
                          {stepIdx + 1}
                        </div>
                        <div className="rounded-2xl border border-lime-100 dark:border-[#1c3822] bg-lime-50/60 dark:bg-[#0a1b10] p-5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="text-sm uppercase tracking-wide text-lime-500 font-semibold">
                                Bước {stepIdx + 1}
                              </p>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                {step.title ?? "Nội dung"}
                              </h4>
                            </div>
                            {step.duration_Weeks && step.duration_Weeks > 0 && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                ≈ {step.duration_Weeks} tuần
                              </span>
                            )}
                          </div>

                          <div className="mt-4 space-y-4">
                            {(step.suggested_Courses ?? []).map((course) => (
                              <a
                                key={course.link ?? course.title}
                                href={course.link ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col sm:flex-row sm:items-start gap-4 border border-lime-100 dark:border-lime-400/20 rounded-2xl p-4 bg-white dark:bg-[#04120c] hover:shadow-md transition dark:hover:shadow-[0_0_15px_rgba(100,255,205,0.2)]"
                              >
                                <div className="flex-1">
                                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                                    {course.title}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {course.provider ?? "Đối tác"} •{" "}
                                    {course.level ?? "N/A"}
                                  </p>
                                  {course.reason && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                      {course.reason}
                                    </p>
                                  )}
                                </div>
                                <span className="inline-flex items-center gap-2 text-lime-600 font-semibold dark:text-lime-300">
                                  Mở khóa học
                                  <FiExternalLink />
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!pathId) {
    return (
      <div className="p-8 text-center text-sm text-red-600">
        Thiếu learning path Id trong URL. Vui lòng kiểm tra đường dẫn.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f4] via-white to-[#f2fbfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <header className="bg-white/80 dark:bg-slate-900/60 shadow-sm rounded-3xl p-8 border border-orange-100 dark:border-slate-700 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="uppercase tracking-[0.2em] text-xs text-orange-500 font-semibold">
              {learningPath?.pathName || "Lộ trình học tập"}
            </p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}`}
            >
              {statusLabel}
            </span>
            {isStreaming && (
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Đang nhận dữ liệu realtime
              </span>
            )}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3">
                Dựa trên kết quả khảo sát năng lực của bạn
              </h1>
              {summaryFeedback ? (
                <MarkdownBlock
                  markdown={summaryFeedback}
                  className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-3xl prose prose-sm sm:prose-base prose-p:my-2 prose-ul:my-2 prose-li:my-1"
                />
              ) : isPending ? (
                <SkeletonParagraph className="mt-4 max-w-3xl" lines={3} />
              ) : (
                <>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                    Hệ thống đang tổng hợp phản hồi cá nhân hoá cho lộ trình của
                    bạn...
                  </p>
                  <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 italic">
                    Đang phân tích chi tiết từng học phần, vui lòng chờ thêm ít
                    phút.
                  </p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                fetchLearningPath(
                  status === LearningPathStatus.Choosing ? "text" : "json",
                )
              }
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
              disabled={loading}
            >
              <FiRefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </header>

        {loading && (
          <div className="rounded-3xl border border-orange-100 bg-white px-6 py-4 text-sm text-gray-600 shadow-sm">
            Đang tải dữ liệu lộ trình...
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-3">
          {aiProfileCards.map((card) => (
            <div
              key={card.id}
              className="rounded-3xl border border-orange-100/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                {card.badge}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                {card.title}
              </h3>
              {card.markdown ? (
                <MarkdownBlock
                  markdown={card.markdown}
                  className="mt-3 prose prose-sm max-w-none text-gray-600 dark:text-gray-300 prose-p:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
                />
              ) : isPending ? (
                <SkeletonParagraph className="mt-4" lines={4} />
              ) : (
                <>
                  <p
                    className={`text-sm mt-2 ${
                      card.isLoading
                        ? "text-gray-400 dark:text-gray-500 animate-pulse"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {card.summary}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {card.bullets.map((bullet, idx) => (
                      <li
                        key={`${card.id}-bullet-${idx}`}
                        className="flex gap-2"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={`${card.id}-${tag}`}
                    className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CORE_SKILL_STATUS.map((skill) => (
            <div
              key={skill.key}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-white to-orange-50/60 dark:from-slate-900 dark:to-slate-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">
                    Năng lực trọng tâm
                  </p>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {skill.label}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-orange-500">
                    {skill.score}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    /100 · Chuẩn {skill.target}+
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {skill.status}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {skill.summary}
              </p>
            </div>
          ))}
        </section>

        <section className="bg-white/90 dark:bg-slate-900/70 rounded-3xl p-8 border border-orange-100/70 dark:border-slate-800 shadow-lg shadow-orange-100/40 dark:shadow-none">
          <div className="bg-gradient-to-r from-[#ffe9d3] to-white dark:from-orange-900/30 dark:to-transparent rounded-3xl p-6 mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-orange-600 mb-2">
                Lộ trình khởi đầu
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                Các môn học nền tảng được đề xuất dựa trên năng lực hiện tại của
                bạn. Nếu hệ thống chưa trả dữ liệu, vui lòng thử lại sau ít
                phút.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBasicSection((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition self-start"
            >
              {showBasicSection ? "Thu gọn" : "Xem nội dung"}
              {showBasicSection ? (
                <FiChevronUp className="h-4 w-4" />
              ) : (
                <FiChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {renderBasicContent()}
        </section>

        <section className="bg-white/90 dark:bg-slate-900/70 rounded-3xl p-8 border border-cyan-100/70 dark:border-slate-800 shadow-lg shadow-cyan-100/30 dark:shadow-none">
          <div className="bg-gradient-to-r from-[#d9f8f5] to-white dark:from-cyan-900/30 dark:to-transparent rounded-3xl p-6 mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-[#20c997] mb-2">
                Chuyên ngành hẹp
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                Bạn đã chọn các major nội bộ phù hợp. Học theo thứ tự đã sắp xếp
                để tối ưu hiệu quả và có thể bật/tắt từng cụm môn để xem
                CourseCard tương ứng.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowInternalSection((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition self-start"
            >
              {showInternalSection ? "Thu gọn" : "Xem nội dung"}
              {showInternalSection ? (
                <FiChevronUp className="h-4 w-4" />
              ) : (
                <FiChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {isChoosingStatus && (
            <div className="mb-10 rounded-3xl border border-cyan-100 dark:border-[#1a2d47] bg-white dark:bg-[#030b17] shadow-lg shadow-cyan-100/20 dark:shadow-[0_0_25px_rgba(3,11,23,0.7)] p-6 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-500 font-semibold">
                  Tuỳ chỉnh chuyên ngành
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  Chọn và sắp xếp thứ tự major ưu tiên
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Dùng combobox để đổi major cho từng vị trí hoặc kéo thả để sắp
                  xếp lại. Nhấn “Xác nhận” để lưu và dựng lại lộ trình theo thứ
                  tự bạn chọn.
                </p>
              </div>
              <div className="space-y-4">
                {selectedMajors.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Chưa có chuyên ngành nào để lựa chọn.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {selectedMajors.map((major, idx) => {
                      const optionKey = selectedMajorIds[idx];
                      const label =
                        major.majorCode ?? major.majorId ?? `Major #${idx + 1}`;
                      return (
                        <li
                          key={`selected-major-${optionKey}`}
                          className={`rounded-2xl border border-cyan-100 dark:border-[#1f3854] bg-white dark:bg-[#0b192d] p-4 space-y-3 shadow-sm ${draggingMajorId === optionKey ? "ring-2 ring-cyan-300" : ""}`}
                          draggable
                          onDragStart={() => handleDragStart(optionKey)}
                          onDragEnter={() => handleDragEnter(optionKey)}
                          onDragOver={(event) => event.preventDefault()}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 text-sm font-bold dark:bg-cyan-500/20 dark:text-cyan-100">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-[220px]">
                              <label className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-semibold">
                                Major {idx + 1}
                              </label>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {label}
                              </p>
                              <select
                                value={optionKey}
                                onChange={(event) =>
                                  handleSlotSelectChange(
                                    idx,
                                    event.target.value,
                                  )
                                }
                                className="mt-1 w-full rounded-xl border border-cyan-200 dark:border-cyan-400/30 bg-white dark:bg-[#040d1d] px-3 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              >
                                {majorOptions.map(
                                  ({ key, major: optionMajor }) => (
                                    <option key={key} value={key}>
                                      {optionMajor.majorCode ??
                                        optionMajor.majorId ??
                                        key}
                                    </option>
                                  ),
                                )}
                              </select>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 min-w-[200px]">
                              {major.reason ??
                                "Hệ thống chưa cung cấp mô tả cho chuyên ngành này."}
                            </p>
                          </div>
                          <p className="text-xs text-cyan-600 dark:text-cyan-300">
                            Giữ thả để sắp xếp lại thứ tự ưu tiên
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleConfirmMajorSelection}
                  disabled={
                    chooseMajorsLoading ||
                    selectedMajors.every((major) => !major.majorId)
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {chooseMajorsLoading ? (
                    <>
                      <FiRefreshCw className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Xác nhận lựa chọn"
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetMajorSelection}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-cyan-500/40 px-4 py-2 text-sm font-semibold text-cyan-600 dark:text-cyan-100 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                >
                  Phục hồi gợi ý
                </button>
                {chooseMajorsError && (
                  <span className="text-sm text-red-500">
                    {chooseMajorsError}
                  </span>
                )}
                {!chooseMajorsError && chooseMajorsSuccess && (
                  <span className="text-sm text-emerald-500">
                    {chooseMajorsSuccess}
                  </span>
                )}
              </div>
            </div>
          )}
          {renderInternalContent(displayedInternalMajors)}
        </section>

        <section className="bg-white/90 dark:bg-slate-900/70 rounded-3xl p-8 border border-lime-100/70 dark:border-slate-800 shadow-lg shadow-lime-100/30 dark:shadow-none">
          <div className="bg-gradient-to-r from-[#e8ffe0] to-white dark:from-lime-900/30 dark:to-transparent rounded-3xl p-6 mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-lime-600 mb-2">
                Đề xuất lộ trình ngoài
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                Các track bổ sung từ nền tảng đối tác để bù lấp lỗ hổng kỹ năng.
                UI mô phỏng timeline với icon giống mockup: mỗi bước hiển thị
                khóa học gợi ý cùng nút mở link.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowExternalSection((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-white px-4 py-2 text-sm font-semibold text-lime-600 hover:bg-lime-50 transition self-start"
            >
              {showExternalSection ? "Thu gọn" : "Xem nội dung"}
              {showExternalSection ? (
                <FiChevronUp className="h-4 w-4" />
              ) : (
                <FiChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {renderExternalContent()}
        </section>
      </div>
    </div>
  );
};

export default LearningPathSamplePage;
