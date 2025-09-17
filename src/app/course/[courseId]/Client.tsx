"use client";

import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Image as AntImage,
  Layout,
  Rate,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
  Collapse,
} from "antd";
import {
  CheckCircleTwoTone,
  TabletOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
  FacebookFilled,
  YoutubeFilled,
  InstagramOutlined,
  LinkedinFilled,
  WhatsAppOutlined,
  TwitterOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  RightOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { FadeTransition } from "EduSmart/components/Animation/FadeTransition";
import Link from "next/link";
import CourseReviews, {
  ReviewItem,
} from "EduSmart/components/User/Course/CourseReviews";
import { useMemo, useState } from "react";
import CourseInstructor from "EduSmart/components/User/Course/CourseInstructor";
import CourseOverview from "EduSmart/components/User/Course/CourseOverView";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import { CourseDetailForGuestDto } from "EduSmart/api/api-course-service";

const { Title, Text } = Typography;

const IMG_FALLBACK =
  "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531";

type Props = {
  data?: CourseDetailForGuestDto;
  modulesCount?: number;
  lessonsCount?: number;
};

/* =======================
   Helpers hiển thị
======================= */
const levelLabel = (lv?: number | null) => {
  if (lv === 1) return "Beginner";
  if (lv === 2) return "Intermediate";
  if (lv === 3) return "Advanced";
  return "All levels";
};

const formatDuration = (hours?: number | null, minutes?: number | null) => {
  if (typeof hours === "number" && hours > 0) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m ? `${h} giờ ${m} phút` : `${h} giờ`;
  }
  if (typeof minutes === "number" && minutes > 0) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h} giờ ${m} phút` : `${m} phút`;
  }
  return "—";
};

const formatCurrencySmart = (n?: number | null) => {
  if (typeof n !== "number") return "";
  if (n >= 1000) return `${n.toLocaleString("vi-VN")}₫`;
  return `$${n.toLocaleString("en-US")}`;
};

/* =======================
   Dummy reviews giữ nguyên UI
======================= */
const defaultReviews: ReviewItem[] = [
  {
    id: 1,
    name: "Lina",
    time: "3 tháng",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Lina&backgroundColor=b6e3f4",
    rating: 4,
    content:
      "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively…",
    images: ["https://picsum.photos/seed/rv1/300/180"],
    purchased: true,
    helpful: 12,
    replies: [
      {
        id: "r1",
        by: "Giảng viên",
        avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=Teacher",
        content: "Cảm ơn bạn! Tài liệu bổ sung ở section 3.",
        time: "2 tháng",
      },
    ],
  },
  {
    id: 2,
    name: "Alex",
    time: "1 tháng",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex&backgroundColor=c0aede",
    rating: 5,
    content: "Nội dung cô đọng, bài tập thực hành ổn. Phần responsive rất hay.",
    images: [],
    purchased: true,
    helpful: 7,
  },
  {
    id: 3,
    name: "Ngọc",
    time: "5 ngày",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Ngoc&backgroundColor=ffd5dc",
    rating: 3,
    content: "Ổn cho người mới, mong có thêm ví dụ flex/grid nâng cao.",
    images: ["https://picsum.photos/seed/rv3/300/180"],
    purchased: false,
    helpful: 2,
  },
];

/* =======================
   Component chính
======================= */
export default function CourseDetailUI({
  data,
  modulesCount = 0,
  lessonsCount = 0,
}: Props) {
  const [activeTab, setActiveTab] = useState<string>("reviews");

  const courseTitle = data?.title ?? "—";
  const coverUrl = data?.courseImageUrl || IMG_FALLBACK;
  const subjectTag = data?.subjectCode ? [data.subjectCode] : [];
  const levelTag = levelLabel(data?.level ?? 0);

  const durationText = useMemo(
    () => formatDuration(data?.durationHours ?? 0, data?.durationMinutes ?? 0),
    [data?.durationHours, data?.durationMinutes],
  );

  const priceText = useMemo(
    () => formatCurrencySmart(data?.price),
    [data?.price],
  );
  const dealText = useMemo(
    () => formatCurrencySmart(data?.dealPrice ?? 0),
    [data?.dealPrice],
  );

  const hasDeal =
    typeof data?.dealPrice === "number" &&
    typeof data?.price === "number" &&
    (data?.dealPrice as number) < (data?.price as number);

  const learnings =
    data?.objectives
      ?.filter((o) => !!o.isActive)
      .sort((a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0))
      .map((o) => o.content || "")
      .filter(Boolean) ?? [];

  console.log("CourseDetailUI - data:", data?.objectives);
  console.log("CourseDetailUI - learnings:", learnings);

  const requirements =
    data?.requirements
      ?.filter((r) => !!r.isActive)
      .sort((a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0))
      .map((r) => r.content || "")
      .filter(Boolean) ?? [];

  const facts = {
    level: levelTag,
    duration: durationText,
    modules: modulesCount,
    access: "Trọn đời",
    language: "Tiếng Việt",
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      message.success("Đã copy link khóa học");
    } catch {
      message.info(url ? "Sao chép thủ công: " + url : "Không có URL");
    }
  };

  return (
    <BaseScreenWhiteNav>
      <FadeTransition show={true}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6"
        >
          <div className="sticky top-20 sm:top-24 z-30">
            <div className="rounded-xl px-3 py-2 bg-white/75 dark:bg-[#0b1220]/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur ring-1 ring-zinc-200/70 dark:ring-zinc-800/70 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] text-[13px] sm:text-sm">
              <Breadcrumb
                separator={
                  <RightOutlined className="text-zinc-400/70 text-[10px]" />
                }
                items={[
                  {
                    title: (
                      <Link
                        href="/home"
                        className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        <HomeOutlined className="text-[14px]" />
                        <span className="hidden sm:inline">Trang chủ</span>
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <Link
                        href="/course"
                        className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        <BookOutlined className="text-[14px]" />
                        <span className="hidden xs:inline">Khóa học</span>
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <Tooltip title={courseTitle}>
                        <span
                          className="text-gray-500 dark:text-gray-400 truncate inline-block align-middle max-w-[60vw] sm:max-w-[40vw] md:max-w-[32vw] lg:max-w-[28vw]"
                          aria-current="page"
                        >
                          {courseTitle}
                        </span>
                      </Tooltip>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <Layout className="!bg-transparent">
            <Card
              variant="borderless"
              hoverable
              className="lg:col-span-2 h-[400px] w-full !rounded-2xl shadow-sm ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 bg-white dark:bg-zinc-900"
              cover={
                <AntImage
                  src={coverUrl}
                  alt="Ảnh bìa khóa học"
                  className="!h-[400px] !rounded-2xl !w-full !object-cover !object-center"
                  preview={true}
                  fallback={IMG_FALLBACK}
                  placeholder={
                    <div className="h-full w-full animate-pulse bg-zinc-200/60 dark:bg-zinc-800/60" />
                  }
                />
              }
            />
          </Layout>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Mobile-first: sidebar trước, nội dung sau; Desktop: đảo lại */}
          <section
            aria-label="Course summary & sidebar"
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {/* SIDEBAR */}
            <aside className="order-1 lg:order-2 lg:col-span-1 lg:-mt-36 lg:mr-10">
              <Card className="rounded-2xl shadow-xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 bg-white/95 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur lg:sticky lg:top-6 h-fit">
                <div className="overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                  <AntImage
                    src={coverUrl}
                    alt="Thumbnail"
                    preview={false}
                    rootClassName="!block aspect-[16/9]"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    fallback={IMG_FALLBACK}
                  />
                </div>

                <Title level={4} className="!mt-4 !mb-2 leading-tight">
                  {courseTitle}
                </Title>

                <div className="flex items-center gap-2">
                  <Rate disabled defaultValue={4} style={{ fontSize: 16 }} />
                  <Text type="secondary" className="ml-1">
                    4/5 (128 đánh giá)
                  </Text>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {subjectTag.map((s) => (
                    <Tag key={s} color="blue">
                      {s}
                    </Tag>
                  ))}
                  <Tag color="geekblue">{levelTag}</Tag>
                </div>

                <Divider className="!my-4 sm:!my-5" />

                <Title level={5} className="!mb-3">
                  Khóa học bao gồm
                </Title>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <span>Đảm bảo hoàn tiền</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TabletOutlined className="opacity-80" />
                    <span>Truy cập trên mọi thiết bị</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckSquareOutlined className="opacity-80" />
                    <span>Chứng nhận hoàn thành</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AppstoreOutlined className="opacity-80" />
                    <Tag color="blue" className="align-middle">
                      {modulesCount} Modules · {lessonsCount} Lessons
                    </Tag>
                  </div>
                </div>

                <Divider className="!my-4 sm:!my-5" />

                {/* CTA */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div className="sm:order-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Giá
                    </div>
                    <div className="text-2xl font-semibold">
                      {hasDeal ? (
                        <>
                          <span className="line-through mr-2 opacity-60">
                            {priceText}
                          </span>
                          <span>{dealText}</span>
                        </>
                      ) : (
                        <span>{priceText || "—"}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:order-2">
                    <Button
                      icon={<ShoppingCartOutlined />}
                      className="w-full sm:w-auto"
                      onClick={() => message.success("Đã thêm vào giỏ")}
                    >
                      Thêm vào giỏ
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      className="w-full sm:w-auto"
                      onClick={() => message.success("Bắt đầu học ngay")}
                    >
                      Học ngay
                    </Button>
                  </div>
                </div>

                <Divider className="!my-4 sm:!my-5" />

                <Title level={5} className="!mb-3">
                  Chia sẻ khóa học
                </Title>
                <Space size={8} wrap>
                  {[
                    FacebookFilled,
                    YoutubeFilled,
                    InstagramOutlined,
                    LinkedinFilled,
                    WhatsAppOutlined,
                    TwitterOutlined,
                  ].map((Icon, i) => (
                    <Button
                      key={i}
                      type="text"
                      shape="circle"
                      aria-label="share"
                      icon={<Icon />}
                      onClick={handleShare}
                    />
                  ))}
                </Space>
              </Card>
            </aside>

            {/* MAIN CONTENT */}
            <div className="order-2 lg:order-1 lg:col-span-2 space-y-4">
              {/* Stars + Tabs */}
              <div className="rounded-2xl p-3 sm:p-4 bg-white/95 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <Rate disabled defaultValue={4} style={{ fontSize: 16 }} />
                  <span className="text-sm text-gray-500">Top đánh giá</span>
                </div>

                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  size="middle"
                  type="line"
                  tabBarGutter={24}
                  tabBarStyle={{ margin: 0 }}
                  rootClassName="course-tabs"
                  animated={{ inkBar: true, tabPane: false }}
                  items={[
                    { key: "curriculum", label: "Nội dung khóa học" },
                    { key: "overview", label: "Tổng quan" },
                    { key: "reviews", label: "Đánh giá" },
                    { key: "instructor", label: "Giảng viên" },
                  ]}
                />
              </div>

              {activeTab === "overview" && (
                <CourseOverview
                  title={courseTitle}
                  summary={data?.description || data?.shortDescription || "—"}
                  learnings={learnings}
                  requirements={requirements}
                  facts={facts}
                />
              )}

              {activeTab === "reviews" && (
                <CourseReviews
                  initialReviews={defaultReviews}
                  average={4}
                  breakdownPercentages={[78, 62, 44, 28, 12]}
                />
              )}

              {activeTab === "instructor" && (
                <CourseInstructor
                  socials={{
                    facebook: "#",
                    youtube: "#",
                    linkedin: "#",
                  }}
                />
              )}

              {activeTab === "curriculum" && (
                <Card className="rounded-2xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60">
                  <Typography.Title level={5}>
                    Nội dung khóa học
                  </Typography.Title>
                  <Typography.Paragraph className="text-gray-600">
                    (Bạn có thể thay thế bằng component Curriculum thật sau.)
                  </Typography.Paragraph>

                  <Collapse
                    accordion
                    bordered={false}
                    expandIconPosition="end"
                    className="bg-transparent"
                    items={(data?.modules ?? [])
                      .filter((m) => !!m.isActive)
                      .sort(
                        (a, b) =>
                          (a.positionIndex ?? 0) - (b.positionIndex ?? 0),
                      )
                      .map((m, idx) => {
                        const activeLessons = (m.lessons ?? [])
                          .filter((l) => !!l.isActive)
                          .sort(
                            (a, b) =>
                              (a.positionIndex ?? 0) - (b.positionIndex ?? 0),
                          );

                        // label (thay cho header cũ)
                        const label = (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {m.moduleName}
                            </span>
                            {m.isCore && <Tag color="cyan">Core</Tag>}
                            {(typeof m.durationHours === "number" &&
                              m.durationHours > 0) ||
                            (typeof m.durationMinutes === "number" &&
                              m.durationMinutes > 0) ? (
                              <Tag>
                                {formatDuration(
                                  m.durationHours ?? null,
                                  m.durationMinutes ?? null,
                                )}
                              </Tag>
                            ) : null}
                          </div>
                        );

                        // children: giữ nguyên nội dung body như Card trước đây
                        const children = (
                          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 !mb-3 overflow-hidden p-3 sm:p-4">
                            {m.description ? (
                              <Typography.Paragraph
                                type="secondary"
                                className="!mb-3"
                              >
                                {m.description}
                              </Typography.Paragraph>
                            ) : null}

                            {(m.objectives ?? []).some((o) => o.isActive) && (
                              <>
                                <Typography.Text type="secondary">
                                  Mục tiêu
                                </Typography.Text>
                                <ul className="mt-2 mb-3 list-disc pl-5 space-y-1">
                                  {(m.objectives ?? [])
                                    .filter((o) => !!o.isActive)
                                    .sort(
                                      (a, b) =>
                                        (a.positionIndex ?? 0) -
                                        (b.positionIndex ?? 0),
                                    )
                                    .map((o) => (
                                      <li key={o.objectiveId}>{o.content}</li>
                                    ))}
                                </ul>
                              </>
                            )}

                            <Typography.Text type="secondary">
                              Bài học
                            </Typography.Text>
                            <ul className="mt-2 space-y-1">
                              {activeLessons.length ? (
                                activeLessons.map((l) => (
                                  <li
                                    key={l.lessonId}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="inline-flex h-2 w-2 rounded-full bg-cyan-500/70" />
                                    <span>
                                      {(l.positionIndex ?? 0) + ". "} {l.title}
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500">
                                  (Chưa có bài học hoạt động)
                                </li>
                              )}
                            </ul>
                          </div>
                        );

                        return {
                          key: (m.moduleId ?? String(idx)) as string,
                          label,
                          children,
                        };
                      })}
                  />
                </Card>
              )}
            </div>
          </section>
        </div>
      </FadeTransition>
    </BaseScreenWhiteNav>
  );
}
