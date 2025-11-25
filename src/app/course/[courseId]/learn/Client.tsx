"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Collapse,
  Input,
  List,
  Tag,
  Space,
  Button,
  Typography,
  Empty,
  Divider,
  Dropdown,
  Progress,
} from "antd";
import {
  PlayCircleOutlined,
  FileOutlined,
  MessageOutlined,
  BookOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
  CalendarOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  RobotOutlined,
} from "@ant-design/icons";

import VideoPlayer, {
  PauseReason,
} from "EduSmart/components/Video/VideoPlayer";
import BaseScreenStudyLayout from "EduSmart/layout/BaseScreenStudyLayout";

import {
  CourseDetailForStudentDto,
  ModuleDetailForStudentDto,
  StudentLessonDetailDto,
} from "EduSmart/api/api-course-service";
import { useLoadingStore } from "EduSmart/stores/Loading/LoadingStore";
import CourseDetailsCardTabs from "EduSmart/components/Course/CourseDetailsCardTabs";
import BasecontrolModal from "EduSmart/components/BaseControl/BasecontrolModal";
import ChatAssistantPanel from "EduSmart/components/Course/Learn/ChatAssistantPanel";
import CourseComments from "EduSmart/components/Course/Learn/CourseComments";
import LessonNotes from "EduSmart/components/Course/Learn/LessonNotes";
import { animated, useTransition, useSpring } from "@react-spring/web";

const { Text } = Typography;

type Props = {
  course: CourseDetailForStudentDto;
  initialLessonId?: string;
};

function secToMinutes(sec?: number | null): number {
  if (!sec || sec <= 0) return 0;
  return Math.round(sec / 60);
}

export default function CourseVideoClient({ course, initialLessonId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modules: ModuleDetailForStudentDto[] = useMemo(
    () => course.modules ?? [],
    [course.modules],
  );

  const allLessons: StudentLessonDetailDto[] = useMemo(
    () => modules.flatMap((m) => m.lessons ?? []),
    [modules],
  );

  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(
    initialLessonId,
  );

  // map bài học -> module để mở đúng panel
  const lessonToModule = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of modules) {
      const lessons = m.lessons ?? [];
      for (const l of lessons) {
        if (l.lessonId && m.moduleId) map.set(l.lessonId, m.moduleId);
      }
    }
    return map;
  }, [modules]);

  // điều khiển panel đang mở
  const [activeModuleId, setActiveModuleId] = useState<string | undefined>(
    undefined,
  );
  const prevUrlLessonId = useRef<string | undefined>(undefined);

  // Tabs ở sidebar (Content / AI)
  const [rightTab, setRightTab] = useState<"content" | "ai">("content");
  const onRightTabChange = useCallback(
    (key: string) => setRightTab(key === "ai" ? "ai" : "content"),
    [],
  );

  // Sync với URL khi người dùng back/forward hoặc share link
  useEffect(() => {
    const q = searchParams.get("lessonId") ?? initialLessonId;
    if (!q) return;

    if (prevUrlLessonId.current !== q) {
      prevUrlLessonId.current = q;
      if (q !== currentLessonId) setCurrentLessonId(q);
      const mod = lessonToModule.get(q);
      if (mod && mod !== activeModuleId) setActiveModuleId(mod);
    }
  }, [
    searchParams,
    initialLessonId,
    lessonToModule,
    activeModuleId,
    currentLessonId,
  ]);

  // mỗi khi currentLessonId đổi, tự mở panel chứa bài đó
  useEffect(() => {
    if (currentLessonId) {
      const modId = lessonToModule.get(currentLessonId);
      if (modId) setActiveModuleId(modId);
    }
  }, [currentLessonId, lessonToModule]);

  const currentLesson: StudentLessonDetailDto | undefined = useMemo(
    () => allLessons.find((l) => l.lessonId === currentLessonId),
    [allLessons, currentLessonId],
  );

  const videoUrl = currentLesson?.videoUrl ?? "";

  const handleSelectLesson = (lessonId: string) => {
    useLoadingStore.getState().showLoading();
    setCurrentLessonId(lessonId);
    const modId = lessonToModule.get(lessonId);
    if (modId && modId !== activeModuleId) setActiveModuleId(modId);

    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    sp.set("lessonId", lessonId);
    router.replace(`${pathname}?${sp.toString()}`);
  };

  useEffect(() => {
    if (!currentLessonId) return;
    const t = setTimeout(() => useLoadingStore.getState().hideLoading(), 250);
    return () => clearTimeout(t);
  }, [currentLessonId]);

  const handlePause = (info: {
    currentTime: number;
    duration: number;
    reason: PauseReason;
  }) => {
    console.log("Paused:", info);
  };

  const activeModule = useMemo(
    () => modules.find((m) => m.moduleId === activeModuleId) ?? modules[0],
    [modules, activeModuleId],
  );

  const currentDiscussions = useMemo(
    () => activeModule?.moduleDiscussionDetails ?? [],
    [activeModule],
  );

  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);

  const startQuiz = (lessonId: string) => {
    if (!lessonId) return;
    const sp = new URLSearchParams();
    sp.set("lessonId", lessonId);
    router.push(`/course/${course.courseId}/quiz?${sp.toString()}`);
  };

  const startModuleQuiz = (moduleId: string) => {
    if (!moduleId) return;
    const mod = modules.find((m) => m.moduleId === moduleId);
    const quizId = mod?.moduleQuiz?.quizId;
    if (!quizId) {
      console.warn("Module không có quizId, bỏ qua.");
      return;
    }
    const sp = new URLSearchParams();
    sp.set("moduleId", moduleId);
    router.push(`/course/${course.courseId}/quiz?${sp.toString()}`);
  };

  // Tên module đang mở (dùng cho UI & deps)
  const activeModuleName = activeModule?.moduleName ?? "Untitled module";

  const tabItems = useMemo(
    () => [
      {
        key: "overview",
        label: "Overview",
        children: (
          <div className="space-y-3">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: course.description ?? "No description provided.",
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Tag>English (Auto)</Tag>
              <Tag>Arabic (Auto)</Tag>
              <Tag>
                {course.durationHours ??
                  Math.round((course.durationMinutes ?? 0) / 60)}{" "}
                hours
              </Tag>
              {course.updatedAt && (
                <Tag>
                  Last updated:{" "}
                  {new Date(course.updatedAt).toLocaleDateString()}
                </Tag>
              )}
            </div>
            <div className="rounded-lg border p-3 dark:border-neutral-800">
              <div className="font-medium mb-1">Schedule learning time</div>
              <Text type="secondary">
                Setting aside time daily helps you reach your goals.
              </Text>
            </div>
          </div>
        ),
      },
      {
        key: "qa",
        label: "Q&A",
        children: (
          <Space direction="vertical" className="w-full">
            <Input.Search placeholder="Search questions…" allowClear />
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Chưa có câu hỏi. Hãy là người đầu tiên đặt câu hỏi!
            </div>
          </Space>
        ),
      },
      {
        key: "notes",
        label: "Notes",
        children: currentLessonId ? (
          <LessonNotes
            lessonId={currentLessonId}
            currentVideoTime={0}
            onJumpToTime={(timeSeconds) => {
              // Jump to specific time in video
              const videoElement = document.querySelector("video");
              if (videoElement) {
                videoElement.currentTime = timeSeconds;
              }
            }}
          />
        ) : (
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Vui lòng chọn một bài học để xem ghi chú.
          </div>
        ),
      },
      {
        key: "comments",
        label: (
          <span className="inline-flex items-center gap-2">
            <MessageOutlined /> Comments
          </span>
        ),
        children: <CourseComments courseId={course.courseId ?? ""} />,
      },

      /** -------- Discussions tab -------- */
      {
        key: "discussions",
        label: (
          <span className="inline-flex items-center gap-2">
            <CommentOutlined /> Discussions
          </span>
        ),
        children: (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                Thảo luận của module:{" "}
                <span className="font-medium">
                  {activeModule?.moduleName ?? "Untitled module"}
                </span>
              </div>
              <Tag color="purple" className="m-0">
                {currentDiscussions.length} topics
              </Tag>
            </div>

            <Divider className="my-2" />

            {currentDiscussions.length === 0 ? (
              <Empty description="Module này chưa có thảo luận" />
            ) : (
              <List
                itemLayout="vertical"
                dataSource={currentDiscussions}
                split
                renderItem={(d, idx) => {
                  const createdAt = d.createdAt
                    ? new Date(d.createdAt).toLocaleDateString()
                    : null;
                  const updatedAt = d.updatedAt
                    ? new Date(d.updatedAt).toLocaleDateString()
                    : null;
                  const id = d.discussionId ?? String(idx);
                  const isReplyOpen = replyOpenId === id;

                  return (
                    <List.Item className="!px-0">
                      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:shadow-sm transition">
                        <div className="flex items-start gap-3">
                          {/* Icon bubble */}
                          <div className="shrink-0 h-9 w-9 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                            <QuestionCircleOutlined className="text-violet-600 dark:text-violet-300" />
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Title + meta */}
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="m-0 text-base font-semibold">
                                {d.title ?? "Untitled"}
                              </h3>
                              {activeModuleName && (
                                <Tag color="geekblue" className="m-0">
                                  {activeModuleName}
                                </Tag>
                              )}
                              {createdAt && (
                                <Tag className="m-0">
                                  <CalendarOutlined /> {createdAt}
                                </Tag>
                              )}
                              {updatedAt && (
                                <Tag className="m-0" color="blue">
                                  updated {updatedAt}
                                </Tag>
                              )}
                            </div>

                            {/* Discussion question block */}
                            {d.discussionQuestion && (
                              <div className="mt-3 rounded-md border border-violet-200/60 dark:border-violet-800/60 bg-violet-50/60 dark:bg-violet-900/20 p-3">
                                <div className="text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-300 uppercase inline-flex items-center gap-1">
                                  <QuestionCircleOutlined /> Câu hỏi thảo luận
                                </div>
                                <div className="text-sm mt-1">
                                  {d.discussionQuestion}
                                </div>
                              </div>
                            )}

                            {/* Short description */}
                            {d.description && (
                              <p className="mt-3 text-[13px] text-neutral-700 dark:text-neutral-300">
                                {d.description}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="mt-3 flex flex-wrap items-center gap-8">
                              {/* Nút mở ô trả lời inline */}
                              <div className="flex items-center gap-2">
                                <Button
                                  type={isReplyOpen ? "default" : "primary"}
                                  onClick={() =>
                                    setReplyOpenId(isReplyOpen ? null : id)
                                  }
                                >
                                  {isReplyOpen
                                    ? "Đóng ô trả lời"
                                    : "Viết câu trả lời"}
                                </Button>
                              </div>

                              {/* Nút mở modal: xem các thảo luận khác */}
                              <BasecontrolModal
                                triggerText="Xem các thảo luận khác"
                                title={
                                  <div className="flex items-center gap-2">
                                    <CommentOutlined />
                                    <span>Các thảo luận trong module</span>
                                    {activeModuleName && (
                                      <Tag color="geekblue" className="m-0">
                                        {activeModuleName}
                                      </Tag>
                                    )}
                                  </div>
                                }
                                cancelText="Đóng"
                                okText="OK"
                                isResponsive
                                triggerButtonProps={{
                                  type: "primary",
                                  ghost: true,
                                }}
                              >
                                <List
                                  itemLayout="vertical"
                                  dataSource={currentDiscussions}
                                  renderItem={(it, i2) => {
                                    const isCurrent =
                                      (it.discussionId ?? String(i2)) === id;
                                    return (
                                      <List.Item className="!px-0">
                                        <div
                                          className={`rounded-lg p-3 border ${
                                            isCurrent
                                              ? "border-violet-300 bg-violet-50/40 dark:bg-violet-900/20"
                                              : "border-neutral-200 dark:border-neutral-800"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                              {it.title ?? "Untitled"}
                                            </span>
                                            {isCurrent && (
                                              <Tag
                                                color="purple"
                                                className="m-0"
                                              >
                                                Đang xem
                                              </Tag>
                                            )}
                                          </div>
                                          {it.discussionQuestion && (
                                            <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                                              {it.discussionQuestion}
                                            </div>
                                          )}
                                        </div>
                                      </List.Item>
                                    );
                                  }}
                                />
                              </BasecontrolModal>
                            </div>

                            {/* Ô trả lời inline */}
                            {isReplyOpen && (
                              <div className="mt-3">
                                <Input.TextArea
                                  placeholder="Nhập câu trả lời của bạn…"
                                  autoSize={{ minRows: 3, maxRows: 6 }}
                                />
                                <div className="mt-2 flex items-center gap-2">
                                  <Button onClick={() => setReplyOpenId(null)}>
                                    Hủy
                                  </Button>
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      // TODO: gọi API post reply ở đây
                                      setReplyOpenId(null);
                                    }}
                                  >
                                    Đăng
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>
        ),
      },
      /** -------- /Discussions -------- */

      { key: "ann", label: "Announcements", children: "No announcements." },
      {
        key: "reviews",
        label: "Reviews",
        children: `${course.ratingsAverage ?? 0} ⭐ — ${course.ratingsCount ?? 0} students`,
      },
      {
        key: "tools",
        label: "Learning tools",
        children: (
          <Space size="middle" wrap>
            <Button icon={<BookOutlined />}>Resources</Button>
            <Button
              icon={<MessageOutlined />}
              onClick={() => onRightTabChange("ai")}
            >
              Ask AI
            </Button>
            <Button icon={<FileOutlined />}>Download assets</Button>
          </Space>
        ),
      },
    ],
    [
      course.description,
      course.durationHours,
      course.durationMinutes,
      course.updatedAt,
      course.ratingsAverage,
      course.ratingsCount,
      currentDiscussions,
      activeModule.moduleName,
      activeModuleName,
      replyOpenId,
      onRightTabChange,
    ],
  );

  // ===== Custom tab header (pill) =====
  const tabTrans = useTransition(rightTab, {
    from: { opacity: 0, transform: "translateY(8px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-8px)" },
    exitBeforeEnter: true,
    config: { tension: 280, friction: 22, mass: 0.7 },
  });

  // highlight “viên thuốc” trượt mượt giữa 2 tab
  const activeIndex = rightTab === "content" ? 0 : 1;
  const highlightSpring = useSpring({
    x: activeIndex * 100, // 0% -> 100%
    config: { tension: 280, friction: 22, mass: 0.6 },
  });

  return (
    <BaseScreenStudyLayout
      title={course.title ?? "Không có tên"}
      completionPercent={course.progress?.percentCompleted?.toString()}
    >
      <div className="mx-8 mb-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* ========= LEFT ========= */}
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-xl overflow-hidden bg-black shadow-sm ring-1 ring-neutral-200/60 dark:ring-neutral-800">
              <div className="relative aspect-video w-full">
                <VideoPlayer
                  key={currentLessonId}
                  src={videoUrl}
                  urlVtt={undefined}
                  onPause={handlePause}
                  onResume={(info) =>
                    console.log(`Resumed after ${info.pausedForMs}ms`, info)
                  }
                  lessonId={currentLessonId}
                  courseId={course.courseId}
                  tickSec={1}
                  poster={
                    course.courseImageUrl ??
                    "https://www.shutterstock.com/image-vector/play-button-icon-vector-illustration-600nw-1697833306.jpg"
                  }
                />
              </div>
            </div>

            <CourseDetailsCardTabs
              title={currentLesson?.title ?? "Select a lesson"}
              items={tabItems}
              defaultActiveKey="overview"
            />
          </div>

          {/* ========= RIGHT: Sidebar ========= */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between px-3 lg:px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-sm font-semibold">Course content</div>
                <Tag color="purple" className="m-0">
                  AI Assistant
                </Tag>
              </div>

              {/* Pill Tabs */}
              <div className="px-3 lg:px-4 pt-2 pb-1">
                <div className="relative flex rounded-2xl p-1 bg-neutral-100/80 dark:bg-neutral-800/70 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-sm">
                  {/* highlight pill */}
                  <animated.span
                    style={{
                      transform: highlightSpring.x.to(
                        (v) => `translateX(${v}%)`,
                      ),
                    }}
                    className="pointer-events-none absolute top-1 bottom-1 left-1 w-1/2 rounded-xl
                               bg-gradient-to-r from-violet-600 to-indigo-600
                               shadow-[0_8px_22px_-8px_rgba(79,70,229,0.55)]"
                  />

                  <button
                    type="button"
                    aria-pressed={rightTab === "content"}
                    onClick={() => onRightTabChange("content")}
                    className={`relative z-10 flex-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-200
                      ${
                        rightTab === "content"
                          ? "text-white"
                          : "text-neutral-700 hover:text-violet-700 dark:text-neutral-300 dark:hover:text-white"
                      }`}
                  >
                    <span
                      className={
                        rightTab === "content"
                          ? "inline-flex items-center gap-1.5 font-bold text-white"
                          : "inline-flex items-center gap-1.5 font-bold text-black dark:text-white"
                      }
                    >
                      <BookOutlined /> Content
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={rightTab === "ai"}
                    onClick={() => onRightTabChange("ai")}
                    className={`relative z-10 flex-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-200
                      ${
                        rightTab === "ai"
                          ? "text-white"
                          : "text-neutral-700 hover:text-violet-700 dark:text-neutral-300 dark:hover:text-white"
                      }`}
                  >
                    <span
                      className={
                        rightTab === "ai"
                          ? "inline-flex items-center gap-1.5 font-bold text-white"
                          : "inline-flex items-center gap-1.5 font-bold text-black dark:text-white"
                      }
                    >
                      <RobotOutlined />
                      <span>AI Assistant</span>
                      <span className="text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-white/20 dark:bg-white/10">
                        Beta
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Tabs content */}
              <div className="px-3 lg:px-4 pb-3">
                {tabTrans((styles, tab) => (
                  <animated.div
                    key={tab}
                    style={styles}
                    className="will-change-[opacity,transform]"
                  >
                    {tab === "content" ? (
                      <>
                        {/* ======= NỘI DUNG TAB CONTENT ======= */}
                        <div className="px-3 lg:px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                          <Input.Search
                            placeholder="Search lectures…"
                            allowClear
                          />
                        </div>

                        <div
                          className="px-2 lg:px-3 py-2 overflow-y-auto"
                          style={{ maxHeight: "calc(100vh - 230px)" }}
                        >
                          <Collapse
                            accordion
                            ghost
                            activeKey={activeModuleId}
                            onChange={(key) => {
                              const k = Array.isArray(key) ? key[0] : key;
                              setActiveModuleId(
                                typeof k === "string" ? k : undefined,
                              );
                            }}
                            items={modules.map((m, i) => {
                              const lessons = m.lessons ?? [];
                              const totalMinutes = lessons.reduce(
                                (sum, l) =>
                                  sum + secToMinutes(l.videoDurationSec),
                                0,
                              );

                              const materials = m.moduleMaterialDetails ?? [];
                              const materialsCount = materials.length;

                              const moduleProgress = m.progress;
                              const percent = Math.round(
                                moduleProgress?.percentCompleted ?? 0,
                              );
                              const lessonsCompleted =
                                moduleProgress?.lessonsCompleted ?? 0;
                              const lessonsTotal =
                                moduleProgress?.lessonsTotal ?? lessons.length;

                              return {
                                key: m.moduleId ?? `m-${i}`,
                                label: (
                                  <div className="w-full">
                                    <div className="flex items-start justify-between gap-3">
                                      {/* BÊN TRÁI: tên module + info */}
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium leading-snug break-words">
                                          {m.moduleName}
                                        </div>

                                        <div className="mt-0.5 text-xs text-neutral-500 flex items-center gap-2 flex-wrap">
                                          <span className="whitespace-nowrap">
                                            {lessons.length} lectures •{" "}
                                            {totalMinutes}m
                                          </span>

                                          {moduleProgress && (
                                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                                              <CheckCircleOutlined className="text-emerald-500" />
                                              {lessonsCompleted}/{lessonsTotal}{" "}
                                              lessons
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* BÊN PHẢI: file + quiz (hàng trên) và vòng tròn % (hàng dưới) */}
                                      <div className="flex flex-col items-end gap-1 shrink-0">
                                        {(materialsCount > 0 ||
                                          m.moduleQuiz) && (
                                          <div className="flex items-center gap-2">
                                            {materialsCount > 0 &&
                                              (materialsCount === 1 ? (
                                                <a
                                                  href={
                                                    materials[0].fileUrl ?? "#"
                                                  }
                                                  download
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  className="shrink-0"
                                                >
                                                  <Tag className="m-0 cursor-pointer inline-flex items-center gap-1">
                                                    <FileOutlined /> 1 file
                                                  </Tag>
                                                </a>
                                              ) : (
                                                <Dropdown
                                                  trigger={["click"]}
                                                  menu={{
                                                    items: materials.map(
                                                      (mat, idx) => ({
                                                        key:
                                                          mat.materialId ??
                                                          String(idx),
                                                        label: (
                                                          <a
                                                            href={
                                                              mat.fileUrl ?? "#"
                                                            }
                                                            download
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={(e) =>
                                                              e.stopPropagation()
                                                            }
                                                          >
                                                            <div className="flex items-center gap-2">
                                                              <DownloadOutlined />
                                                              <span>
                                                                {mat.title ??
                                                                  `Tài liệu ${idx + 1}`}
                                                              </span>
                                                            </div>
                                                          </a>
                                                        ),
                                                      }),
                                                    ),
                                                  }}
                                                >
                                                  <Tag
                                                    className="m-0 cursor-pointer inline-flex items-center gap-1 shrink-0"
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                  >
                                                    <FileOutlined />{" "}
                                                    {materialsCount} files
                                                  </Tag>
                                                </Dropdown>
                                              ))}

                                            {m.moduleQuiz && (
                                              <Tag
                                                className="m-0 cursor-pointer inline-flex items-center gap-1 shrink-0"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  if (m.moduleId)
                                                    startModuleQuiz(m.moduleId);
                                                }}
                                                color={
                                                  m.canAttempt === false
                                                    ? "green"
                                                    : "purple"
                                                }
                                              >
                                                {m.canAttempt === false ? (
                                                  <>
                                                    <CheckCircleOutlined /> Đã
                                                    làm quiz
                                                  </>
                                                ) : (
                                                  <>
                                                    <QuestionCircleOutlined />{" "}
                                                    Quiz
                                                  </>
                                                )}
                                              </Tag>
                                            )}
                                          </div>
                                        )}

                                        <div className="w-11 h-11 flex items-center justify-center">
                                          <Progress
                                            type="circle"
                                            percent={percent}
                                            status="normal"
                                            size={30}
                                            strokeWidth={10}
                                            className="!m-0"
                                            strokeColor={
                                              percent >= 100
                                                ? "#22c55e"
                                                : {
                                                    "0%": "#a855f7",
                                                    "100%": "#6366f1",
                                                  }
                                            }
                                            trailColor="rgba(148,163,184,0.35)"
                                            format={(p) => (
                                              <span className="text-[9px] font-semibold text-slate-900 dark:text-slate-50">
                                                {p ?? 0}%
                                              </span>
                                            )}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ),
                                children: (
                                  <List
                                    itemLayout="horizontal"
                                    dataSource={lessons}
                                    split={false}
                                    renderItem={(it) => {
                                      const isActive =
                                        it.lessonId === currentLessonId;
                                      return (
                                        <List.Item className="!px-0">
                                          <div
                                            role="button"
                                            tabIndex={0}
                                            aria-current={
                                              isActive ? "true" : undefined
                                            }
                                            className={`group w-full text-left px-2 py-2 rounded-lg transition duration-200
                                              ${
                                                isActive
                                                  ? "bg-violet-50 dark:bg-violet-900/30 border-l-2 border-violet-500 ring-1 ring-violet-400/40"
                                                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:shadow-[0_1px_0_#0001]"
                                              }`}
                                            onClick={() => {
                                              if (it.lessonId)
                                                handleSelectLesson(it.lessonId);
                                            }}
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                              ) {
                                                e.preventDefault();
                                                if (it.lessonId)
                                                  handleSelectLesson(
                                                    it.lessonId,
                                                  );
                                              }
                                            }}
                                          >
                                            <div className="flex items-start gap-3">
                                              <PlayCircleOutlined
                                                className={`mt-0.5 text-base transition-transform group-hover:scale-105 ${
                                                  isActive
                                                    ? "text-violet-600 dark:text-violet-300"
                                                    : "text-neutral-500"
                                                }`}
                                              />

                                              {/* Nội dung bên trái */}
                                              <div className="flex-1">
                                                <div
                                                  className={`text-sm leading-snug ${
                                                    isActive
                                                      ? "text-violet-800 dark:text-violet-200 font-medium"
                                                      : ""
                                                  }`}
                                                >
                                                  {it.title}
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-2">
                                                  <span className="text-xs text-neutral-500">
                                                    {secToMinutes(
                                                      it.videoDurationSec,
                                                    )}
                                                    m
                                                  </span>
                                                  {isActive && (
                                                    <Tag
                                                      className="m-0"
                                                      color="purple"
                                                    >
                                                      Now playing
                                                    </Tag>
                                                  )}
                                                  {it.isCompleted && (
                                                    <Tag
                                                      color="green"
                                                      className="m-0"
                                                    >
                                                      completed
                                                    </Tag>
                                                  )}
                                                </div>
                                              </div>
                                              {Array.isArray(
                                                it.lessonQuiz?.questions,
                                              ) &&
                                                it.lessonQuiz!.questions!
                                                  .length > 0 && (
                                                  <div className="shrink-0 self-center">
                                                    {(() => {
                                                      const isDone =
                                                        it.canAttempt === false;
                                                      return (
                                                        <Button
                                                          size="small"
                                                          type={
                                                            isDone
                                                              ? "default"
                                                              : isActive
                                                                ? "primary"
                                                                : "default"
                                                          }
                                                          icon={
                                                            isDone ? (
                                                              <EyeOutlined />
                                                            ) : (
                                                              <QuestionCircleOutlined />
                                                            )
                                                          }
                                                          className={
                                                            isDone
                                                              ? "bg-green-50 text-green-700 border-green-300 hover:!bg-green-100"
                                                              : undefined
                                                          }
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            startQuiz(
                                                              it.lessonId!,
                                                            );
                                                          }}
                                                        >
                                                          {isDone
                                                            ? "Xem kết quả"
                                                            : "Làm bài kiểm tra"}
                                                        </Button>
                                                      );
                                                    })()}
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </List.Item>
                                      );
                                    }}
                                  />
                                ),
                              };
                            })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* ======= NỘI DUNG TAB AI ======= */}
                        <div className="py-3">
                          <ChatAssistantPanel
                            courseId={course.courseId}
                            courseTitle={course.title ?? ""}
                            lessonId={currentLesson?.lessonId}
                            lessonTitle={currentLesson?.title ?? ""}
                            defaultOpen
                            showQuickPrompts
                            maxHeightPx={460}
                          />
                        </div>
                      </>
                    )}
                  </animated.div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BaseScreenStudyLayout>
  );
}
