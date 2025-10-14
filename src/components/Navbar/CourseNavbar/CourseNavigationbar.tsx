"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Dropdown, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { Kaushan_Script } from "next/font/google";
import "@ant-design/v5-patch-for-react-19";

import {
  EllipsisOutlined,
  ShareAltOutlined,
  TrophyOutlined,
  DownOutlined,
  CheckCircleTwoTone,
  LinkOutlined,
  CopyOutlined,
  FacebookFilled,
  TwitterSquareFilled,
} from "@ant-design/icons";

import { useAuthStore } from "EduSmart/stores/Auth/AuthStore";
import UserMenu from "../UserMenu";
import { ThemeSwitch } from "EduSmart/components/Themes/Theme";

// -- Font
const kaushan = Kaushan_Script({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

type Props = {
  /** Tiêu đề khoá học hiển thị trên thanh (nếu không truyền sẽ dùng mặc định) */
  title?: string;
};

export default function CourseNavigationbar({ title }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Auth
  const isAuthed = useAuthStore((s) => s.isAuthen);
  const getAuthen = useAuthStore((s) => s.getAuthen);

  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await getAuthen();
      } finally {
        if (mounted) setAuthReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getAuthen]);

  // Elevation
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();
  // ---------- UI Actions (right) ----------
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  const shareMenu: MenuProps["items"] = [
    {
      key: "copy",
      icon: <CopyOutlined />,
      label: <span>Sao chép liên kết</span>,
      onClick: copyLink,
    },
    {
      type: "divider",
    },
    {
      key: "fb",
      icon: <FacebookFilled />,
      label: <span>Chia sẻ Facebook</span>,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank"),
    },
    {
      key: "tw",
      icon: <TwitterSquareFilled />,
      label: <span>Chia sẻ Twitter/X</span>,
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, "_blank"),
    },
    {
      key: "open",
      icon: <LinkOutlined />,
      label: <span>Mở liên kết</span>,
      onClick: () => window.open(window.location.href, "_blank"),
    },
  ];

  const progressMenu: MenuProps["items"] = [
    {
      key: "p1",
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      label: <span>Tiến độ của bạn: 0%</span>,
      disabled: true,
    },
    { type: "divider" },
    { key: "view", label: "Xem chi tiết tiến độ", onClick: () => {} },
    { key: "reset", label: "Đặt lại tiến độ", danger: true, onClick: () => {} },
  ];

  const moreMenu: MenuProps["items"] = [
    { key: "settings", label: "Cài đặt khóa học", onClick: () => {} },
    { key: "report", label: "Báo cáo vấn đề", onClick: () => {} },
    { type: "divider" },
    { key: "help", label: "Trợ giúp & hỗ trợ", onClick: () => {} },
  ];

  const courseTitle =
    title ?? ".NET 8 Microservices: DDD, CORS, Vertical/Clean Architecture";

  return (
    <nav
      suppressHydrationWarning
      ref={navRef}
      className={[
        "fixed top-0 left-0 w-full z-50",
        "bg-zinc-50/95 dark:bg-[#0b1220]/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md",
        "border-b border-zinc-200/80 dark:border-zinc-800/70",
        elevated
          ? "shadow-[0_8px_20px_-12px_rgba(17,24,39,0.25)] ring-1 ring-black/5"
          : "shadow-[0_1px_0_0_rgba(17,24,39,0.06)]",
      ].join(" ")}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-baseline h-14 sm:h-16">
          {/* Left: Logo | Course title */}
          <div className="min-w-0 flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://rubicmarketing.com/wp-content/uploads/2022/07/y-nghia-logo-fpt-lan-3.jpg"
                alt="Logo"
                width={24}
                height={24}
                className="!w-auto !h-auto"
              />
              <span
                className={`${kaushan.className} text-2xl sm:text-3xl cursor-pointer dark:text-white`}
                onClick={() => router.push("/home")}
              >
                EduSmart
              </span>
            </div>

            {/* Divider */}
            <span className="hidden sm:block h-5 w-px bg-slate-500/30" />

            {/* Course title (truncate) */}
            <Tooltip title={courseTitle}>
              <div className="min-w-0 max-w-[52vw] sm:max-w-[60vw] text-sm sm:text-[15px] text-slate-900 dark:text-slate-100 truncate">
                {courseTitle}
              </div>
            </Tooltip>
          </div>

          {/* Right: Actions + Auth */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Your progress */}
            <Dropdown
              menu={{ items: progressMenu }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                size="middle"
                type="default"
                className="hidden md:inline-flex items-center"
                icon={<TrophyOutlined />}
              >
                Your progress <DownOutlined style={{ marginLeft: 6, fontSize: 10 }} />
              </Button>
            </Dropdown>

            {/* Share */}
            <Dropdown menu={{ items: shareMenu }} trigger={["click"]}>
              <Button
                size="middle"
                type="default"
                className="hidden sm:inline-flex items-center"
                icon={<ShareAltOutlined />}
              >
                Share
              </Button>
            </Dropdown>

            {/* More */}
            <Dropdown
              menu={{ items: moreMenu }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                size="middle"
                type="default"
                className="inline-flex items-center"
                icon={<EllipsisOutlined />}
              />
            </Dropdown>

            {/* Theme (giữ nguyên) */}
            <div className="hidden md:block">
              <ThemeSwitch />
            </div>

            {/* Auth area */}
            {!authReady ? (
              <div className="hidden xl:block">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            ) : isAuthed ? (
              <div className="hidden xl:block">
                <UserMenu />
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2 ml-2">
                <Button type="link" onClick={() => router.push("/Login")}>
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  onClick={() => router.push("/Signup")}
                  className="bg-emerald-500 hover:!bg-emerald-600"
                >
                  Đăng Ký
                </Button>
              </div>
            )}

            {/* Hamburger (mobile) */}
            <button
              suppressHydrationWarning
              onClick={() => setIsOpen((v) => !v)}
              className="xl:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {isOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown (giữ gọn: share + auth) */}
      {isOpen && (
        <div className="xl:hidden px-3 py-3">
          <div className="rounded-2xl border shadow-xl backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center justify-between p-3">
              <div className="rounded-lg px-2 py-1 ring-1 bg-slate-100 dark:bg-slate-800 ring-slate-200 dark:ring-slate-700">
                <ThemeSwitch />
              </div>
              <div className="flex items-center gap-2">
                <Dropdown menu={{ items: progressMenu }} trigger={["click"]}>
                  <Button size="middle" icon={<TrophyOutlined />}>
                    Progress
                  </Button>
                </Dropdown>
                <Dropdown menu={{ items: shareMenu }} trigger={["click"]}>
                  <Button size="middle" icon={<ShareAltOutlined />}>
                    Share
                  </Button>
                </Dropdown>
                <Dropdown menu={{ items: moreMenu }} trigger={["click"]}>
                  <Button size="middle" icon={<EllipsisOutlined />} />
                </Dropdown>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800" />

            <div className="p-3">
              {!authReady ? (
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ) : isAuthed ? (
                <div className="flex justify-end">
                  <UserMenu />
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2">
                  <Button type="link" onClick={() => { setIsOpen(false); router.push("/Login"); }}>
                    Đăng nhập
                  </Button>
                  <Button type="primary" className="bg-emerald-500 hover:!bg-emerald-600"
                    onClick={() => { setIsOpen(false); router.push("/Signup"); }}>
                    Đăng Ký
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
