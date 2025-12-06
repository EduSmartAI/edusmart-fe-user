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
  const [showBasicSection, setShowBasicSection] = useState(false);
  const [showInternalSection, setShowInternalSection] = useState(false);
  const [showExternalSection, setShowExternalSection] = useState(false);
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
    setShowBasicSection(false);
    setShowInternalSection(false);
    setShowExternalSection(false);
    setCollapsedSemesters({});
    // Initialize all majors as collapsed (closed) by default
    const initialCollapsedMajors: Record<string, boolean> = {};
    if (learningPath?.internalLearningPath) {
      learningPath.internalLearningPath.forEach((major, idx) => {
        const id = major.majorId ?? `major-${idx}`;
        initialCollapsedMajors[id] = true; // true = collapsed/closed
      });
    }
    setCollapsedMajors(initialCollapsedMajors);
    setCollapsedMajorSemesters({});
    setCollapsedTracks({});
    setSelectedMajors([]);
    setMajorOrder([]);
    setChooseMajorsError(null);
    setChooseMajorsSuccess(null);
  }, [pathId, learningPath?.internalLearningPath]);
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

  // Lấy danh sách majors đã chọn theo thứ tự (giống sample)
  const orderedMajors = useMemo(() => {
    return majorOrder
      .map((id) => internalMajors.find((m) => m.majorId === id))
      .filter((m): m is InternalMajorDto => Boolean(m));
  }, [majorOrder, internalMajors]);

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
          const key = `basic-${group.subjectCode ?? group.subjectId ?? "SUB"}`;
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
                  {(group as ExtendedCourseGroupDto).subjectName ?? ""}
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
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {courseCount} khóa học
                                  </span>
                                </div>
                                {courseCount > 0 && (
                                  <div className="space-y-3">
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
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {courseCount} khóa học
                                    </span>
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
                                        {course.provider ?? "Đối tác"}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {course.level ?? "N/A"}
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
            {/* <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
              Tóm tắt kết quả học tập
            </h3> */}
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
            </div>
            {error && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </Card>

        {loading && (
          <div className="rounded-xl border border-orange-100 bg-white px-6 py-4 text-sm text-gray-600 shadow-sm">
            Đang tải dữ liệu lộ trình...
          </div>
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
                              {isChoosingStatus
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
    </div>
  );
};

export default LearningPathSamplePage;
