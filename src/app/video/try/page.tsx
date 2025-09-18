"use client";

import React, { useMemo } from "react";
import VideoPlayer, { PauseReason } from "EduSmart/components/Video/VideoPlayer";
import BaseScreenStudyLayout from "EduSmart/layout/BaseScreenStudyLayout";

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

const { Text } = Typography;

/* =========================================================
   Mock data (có thể bind từ API sau)
========================================================= */
type Lecture = {
  id: string;
  title: string;
  minutes: number;
  completed?: boolean;
  hasResources?: boolean;
};

type Section = {
  id: string;
  title: string;
  items: Lecture[];
  totalMinutes: number;
};

const SECTIONS: Section[] = [
  {
    id: "s6",
    title: "Section 6: Develop Catalog.API Infrastructure, Handler and Endpoint",
    totalMinutes: 152,
    items: [
      { id: "l1", title: "Intro & Goals", minutes: 6 },
      { id: "l2", title: "Create Infrastructure Layer", minutes: 31 },
      { id: "l3", title: "Add Endpoints + Handlers", minutes: 46, hasResources: true },
      { id: "l4", title: "Wire up Pipeline / Validation", minutes: 39 },
      { id: "l5", title: "Wrap-up", minutes: 30, completed: true },
    ],
  },
  {
    id: "s7",
    title: "Section 7: Develop Catalog.API Cross-cutting Concerns",
    totalMinutes: 129,
    items: [
      { id: "l6", title: "Logging & Serilog", minutes: 24, completed: true },
      { id: "l7", title: "FluentValidation Deep Dive", minutes: 27 },
      { id: "l8", title: "Global Exception Handler", minutes: 35, hasResources: true },
      { id: "l9", title: "Testing Handlers", minutes: 43 },
    ],
  },
  {
    id: "s8",
    title: "Section 8: Basket Microservices with Vertical Slice Architecture and CQRS",
    totalMinutes: 162,
    items: [
      { id: "l10", title: "Domain Design", minutes: 28 },
      { id: "l11", title: "CQRS Commands", minutes: 51 },
      { id: "l12", title: "Caching with Redis", minutes: 39, hasResources: true },
      { id: "l13", title: "Role Play: Walkthrough", minutes: 44 },
    ],
  },
];

/* =========================================================
   Page
========================================================= */
export default function CourseListPage() {
  const hlsUrl =
    "https://res.cloudinary.com/doqs8nvza/video/upload/sp_auto:maxres_2160p/C--TI-CN-MA---Phng-Ly-V-Tho-My-Orange-52Hz-Chu-Bi-_-Em-Xinh-Say-Hi-Performance.m3u8";
  const vttUrl = "";

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
            <Text>
              Develop Microservices on .NET 8, ASP.NET Web API, Docker, RabbitMQ,
              MassTransit, gRPC, YARP, Redis, SQL Server.
            </Text>
            <div className="flex flex-wrap gap-2">
              <Tag>English (Auto)</Tag>
              <Tag>Arabic (Auto)</Tag>
              <Tag>28.5 hours</Tag>
              <Tag>Last updated: Aug 2025</Tag>
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
      { key: "reviews", label: "Reviews", children: "4.5 ⭐ — 45,339 students" },
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
    []
  );

  return (
    <BaseScreenStudyLayout>
      <div className="">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* ===== Left: Video + Tabs (giống khu vực chính trong ảnh) ===== */}
          <div className="col-span-12 lg:col-span-9">
            {/* Video box */}
            <div className="rounded-xl overflow-hidden bg-black shadow-sm ring-1 ring-neutral-200/60 dark:ring-neutral-800">
              {/* aspect-video giữ tỷ lệ 16:9, không vỡ UI */}
              <div className="aspect-video">
                <VideoPlayer
                  src={hlsUrl}
                  urlVtt={vttUrl}
                  onPause={handlePause}
                  onResume={(info) =>
                    console.log(`Resumed after ${info.pausedForMs}ms`, info)
                  }
                />
              </div>
            </div>

            {/* Tabs bên dưới video (vùng đỏ phía dưới) */}
            <div className="mt-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {/* bo padding đều để giống style Udemy */}
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

          {/* ===== Right: Course content sidebar (vùng đỏ bên phải) ===== */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between px-3 lg:px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-sm font-semibold">Course content</div>
                <Tag color="purple" className="m-0">AI Assistant</Tag>
              </div>

              {/* Search */}
              <div className="px-3 lg:px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <Input.Search placeholder="Search lectures…" allowClear />
              </div>

              {/* Sections – scroll độc lập, cao tối ưu theo viewport */}
              <div
                className="px-2 lg:px-3 py-2 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 180px)" }}
              >
                <Collapse
                  accordion
                  ghost
                  items={SECTIONS.map((sec) => ({
                    key: sec.id,
                    label: (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{sec.title}</span>
                        <span className="text-xs text-neutral-500">
                          {sec.items.length} lectures • {sec.totalMinutes}m
                        </span>
                      </div>
                    ),
                    children: (
                      <List
                        itemLayout="horizontal"
                        dataSource={sec.items}
                        split={false}
                        renderItem={(it) => (
                          <List.Item className="!px-0">
                            <button
                              className="group w-full text-left px-2 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition"
                              // onClick={() => playLecture(it.id)} // hook vào player nếu cần
                            >
                              <div className="flex items-start gap-3">
                                <PlayCircleOutlined className="mt-0.5 text-base group-hover:scale-105 transition-transform" />
                                <div className="flex-1">
                                  <div className="text-sm leading-snug">
                                    {it.title}
                                  </div>
                                  <div className="mt-0.5 flex items-center gap-2">
                                    <span className="text-xs text-neutral-500">
                                      {it.minutes}m
                                    </span>
                                    {it.hasResources && (
                                      <Tag
                                        className="m-0"
                                        icon={<FileOutlined />}
                                      >
                                        resources
                                      </Tag>
                                    )}
                                    {it.completed && (
                                      <Tag color="green" className="m-0">
                                        completed
                                      </Tag>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          </List.Item>
                        )}
                      />
                    ),
                  }))}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BaseScreenStudyLayout>
  );
}
