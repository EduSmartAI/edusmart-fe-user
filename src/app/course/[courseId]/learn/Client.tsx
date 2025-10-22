"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
        children: (
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Ghi chú của bạn sẽ hiển thị ở đây.
          </div>
        ),
      },

      /** -------- Discussions tab (mới, dùng BasecontrolModal) -------- */
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

                            {/* Ô trả lời inline (chỉ hiện khi bấm nút) */}
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
            <Button icon={<MessageOutlined />}>Ask AI</Button>
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
      activeModuleName, // ✅ dùng tên module đã chuẩn hoá
      replyOpenId,
    ],
  );

  return (
    <BaseScreenStudyLayout>
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
                  tickSec={1}
                  poster={course.courseImageUrl ?? "https://www.shutterstock.com/image-vector/play-button-icon-vector-illustration-600nw-1697833306.jpg"}
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
              <div className="flex items-center justify-between px-3 lg:px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-sm font-semibold">Course content</div>
                <Tag color="purple" className="m-0">
                  AI Assistant
                </Tag>
              </div>

              <div className="px-3 lg:px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <Input.Search placeholder="Search lectures…" allowClear />
              </div>

              <div
                className="px-2 lg:px-3 py-2 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 180px)" }}
              >
                <Collapse
                  accordion
                  ghost
                  activeKey={activeModuleId}
                  onChange={(key) => {
                    const k = Array.isArray(key) ? key[0] : key;
                    setActiveModuleId(typeof k === "string" ? k : undefined);
                  }}
                  items={modules.map((m, i) => {
                    const lessons = m.lessons ?? [];
                    const totalMinutes = lessons.reduce(
                      (sum, l) => sum + secToMinutes(l.videoDurationSec),
                      0,
                    );

                    const materials = m.moduleMaterialDetails ?? [];
                    const materialsCount = materials.length;

                    return {
                      key: m.moduleId ?? `m-${i}`,
                      label: (
                        <div className="w-full">
                          {/* Hàng 1: tên module (trái) — tag file (phải) luôn cùng hàng */}
                          <div className="min-w-0 flex items-center justify-between gap-2">
                            <span className="font-medium truncate min-w-0">
                              {m.moduleName}
                            </span>

                            {materialsCount > 0 &&
                              (materialsCount === 1 ? (
                                <a
                                  href={materials[0].fileUrl ?? "#"}
                                  download
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()} // không toggle Collapse
                                  className="shrink-0"
                                >
                                  <Tag className="m-0 cursor-pointer inline-flex items-center gap-1">
                                    <FileOutlined /> 1 file
                                  </Tag>
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
                                          <CheckCircleOutlined /> Đã làm quiz
                                        </>
                                      ) : (
                                        <>
                                          <QuestionCircleOutlined /> Quiz
                                        </>
                                      )}
                                    </Tag>
                                  )}
                                </a>
                              ) : (
                                <Dropdown
                                  trigger={["click"]}
                                  menu={{
                                    items: materials.map((mat, idx) => ({
                                      key: mat.materialId ?? String(idx),
                                      label: (
                                        <a
                                          href={mat.fileUrl ?? "#"}
                                          download
                                          target="_blank"
                                          rel="noreferrer"
                                          onClick={(e) => e.stopPropagation()}
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
                                    })),
                                  }}
                                >
                                  <Tag
                                    className="m-0 cursor-pointer inline-flex items-center gap-1 shrink-0"
                                    onClick={(e) => e.stopPropagation()} // không toggle Collapse
                                  >
                                    <FileOutlined /> {materialsCount} files
                                  </Tag>
                                </Dropdown>
                              ))}
                          </div>

                          {/* Hàng 2: thông tin lectures • minutes */}
                          <div className="mt-0.5 text-xs text-neutral-500">
                            <span className="whitespace-nowrap">
                              {lessons.length} lectures • {totalMinutes}m
                            </span>
                          </div>
                        </div>
                      ),
                      children: (
                        <List
                          itemLayout="horizontal"
                          dataSource={lessons}
                          split={false}
                          renderItem={(it) => {
                            const isActive = it.lessonId === currentLessonId;
                            return (
                              <List.Item className="!px-0">
                                <div
                                  role="button"
                                  tabIndex={0}
                                  aria-current={isActive ? "true" : undefined}
                                  className={`group w-full text-left px-2 py-2 rounded-lg transition ${
                                    isActive
                                      ? "bg-violet-50 dark:bg-violet-900/30 border-l-2 border-violet-500 ring-1 ring-violet-400/40"
                                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                                  }`}
                                  onClick={() => {
                                    if (it.lessonId)
                                      handleSelectLesson(it.lessonId);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      if (it.lessonId)
                                        handleSelectLesson(it.lessonId);
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
                                          {secToMinutes(it.videoDurationSec)}m
                                        </span>
                                        {isActive && (
                                          <Tag className="m-0" color="purple">
                                            Now playing
                                          </Tag>
                                        )}
                                        {it.isCompleted && (
                                          <Tag color="green" className="m-0">
                                            completed
                                          </Tag>
                                        )}
                                      </div>
                                    </div>
                                    {Array.isArray(it.lessonQuiz?.questions) &&
                                      it.lessonQuiz!.questions!.length > 0 && (
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
                                                  startQuiz(it.lessonId!);
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
            </div>
          </aside>
        </div>
      </div>
    </BaseScreenStudyLayout>
  );
}
