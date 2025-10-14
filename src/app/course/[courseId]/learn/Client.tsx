"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Collapse,
  Input,
  List,
  Tabs,
  Tag,
  Space,
  Button,
  Typography,
} from "antd";
import {
  PlayCircleOutlined,
  FileOutlined,
  MessageOutlined,
  BookOutlined,
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

  // NEW: map bài học -> module để mở đúng panel
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

  // NEW: điều khiển panel đang mở
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
      if (q !== currentLessonId) setCurrentLessonId(q); // cập nhật bài đang phát
      const mod = lessonToModule.get(q);
      if (mod && mod !== activeModuleId) setActiveModuleId(mod); // mở đúng panel
    }
  }, [
    searchParams,
    initialLessonId,
    lessonToModule,
    activeModuleId,
    currentLessonId,
  ]);

  // NEW: mỗi khi currentLessonId đổi, tự mở panel chứa bài đó
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
                __html: course.description ?? "No description provided." 
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
    ],
  );

  return (
    <BaseScreenStudyLayout>
      <div className="mx-8 mb-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* ========= LEFT ========= */}
          <div className="col-span-12 lg:col-span-9">
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
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="px-3 py-2 lg:px-4 lg:py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-sm font-semibold">Course details</div>
              </div>
              <div className="px-2 lg:px-4">
                <Tabs
                  defaultActiveKey="overview"
                  items={tabItems}
                  className="[&_.ant-tabs-nav]:mb-0"
                />
              </div>
            </div>
          </div>

          {/* ========= RIGHT: Sidebar ========= */}
          <aside className="col-span-12 lg:col-span-3">
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
                  // NEW: điều khiển panel đang mở để khi reload vẫn mở đúng module
                  activeKey={activeModuleId}
                  onChange={(key) => {
                    // key có thể là string | string[] vì accordion=true nên sẽ là string
                    const k = Array.isArray(key) ? key[0] : key;
                    setActiveModuleId(typeof k === "string" ? k : undefined);
                  }}
                  items={modules.map((m, i) => {
                    const lessons = m.lessons ?? [];
                    const totalMinutes = lessons.reduce(
                      (sum, l) => sum + secToMinutes(l.videoDurationSec),
                      0,
                    );
                    return {
                      key: m.moduleId ?? `m-${i}`,
                      label: (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{m.moduleName}</span>
                          <span className="text-xs text-neutral-500">
                            {lessons.length} lectures • {totalMinutes}m
                          </span>
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
                                <button
                                  aria-current={isActive ? "true" : undefined}
                                  className={`group w-full text-left px-2 py-2 rounded-lg transition
                                  ${
                                    isActive
                                      ? "bg-violet-50 dark:bg-violet-900/30 border-l-2 border-violet-500 ring-1 ring-violet-400/40"
                                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                                  }`}
                                  onClick={() =>
                                    it.lessonId &&
                                    handleSelectLesson(it.lessonId)
                                  }
                                  disabled={!it.lessonId}
                                >
                                  <div className="flex items-start gap-3">
                                    <PlayCircleOutlined
                                      className={`mt-0.5 text-base transition-transform group-hover:scale-105
                                      ${isActive ? "text-violet-600 dark:text-violet-300" : "text-neutral-500"}`}
                                    />
                                    <div className="flex-1">
                                      <div
                                        className={`text-sm leading-snug ${isActive ? "text-violet-800 dark:text-violet-200 font-medium" : ""}`}
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
                                  </div>
                                </button>
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
