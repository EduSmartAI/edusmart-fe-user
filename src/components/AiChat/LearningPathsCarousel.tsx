"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiArrowRight,
  FiMoreVertical,
} from "react-icons/fi";
import type { LearningPathSelectAllDto } from "EduSmart/api/api-student-service";

interface LearningPathsCarouselProps {
  learningPaths: LearningPathSelectAllDto[];
  onPathClick?: (pathId: string, pathName?: string) => void;
}

export default function LearningPathsCarousel({
  learningPaths,
  onPathClick,
}: LearningPathsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          setItemsPerPage(3); // Desktop: 3 cards
        } else if (window.innerWidth >= 640) {
          setItemsPerPage(2); // Tablet: 2 cards
        } else {
          setItemsPerPage(1); // Mobile: 1 card
        }
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalSlides = Math.ceil(learningPaths.length / itemsPerPage);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
  };

  const currentItems = learningPaths.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (learningPaths.length === 0) return null;

  return (
    <div className="mt-5 w-full max-w-4xl">
      <div className="relative rounded-2xl border border-slate-200/60 bg-white/90 backdrop-blur-sm p-4 sm:p-5 shadow-[0_8px_30px_rgba(148,163,184,0.2)] dark:border-slate-700/60 dark:bg-slate-900/90 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-sm">
              <FiBookOpen className="text-[16px]" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-50">
              Lộ trình học tập của bạn
            </h3>
          </div>
          {totalSlides > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToSlide(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 backdrop-blur-sm transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:bg-slate-800"
              >
                <FiChevronLeft className="text-[14px]" />
              </button>
              <span className="min-w-[3rem] text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                {currentIndex + 1} / {totalSlides}
              </span>
              <button
                type="button"
                onClick={() => goToSlide(currentIndex + 1)}
                disabled={currentIndex >= totalSlides - 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 backdrop-blur-sm transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:bg-slate-800"
              >
                <FiChevronRight className="text-[14px]" />
              </button>
            </div>
          )}
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((path) => (
            <LearningPathCard 
              key={path.pathId} 
              path={path} 
              onPathClick={onPathClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Learning Path Card Component
function LearningPathCard({ 
  path,
  onPathClick,
}: { 
  path: LearningPathSelectAllDto;
  onPathClick?: (pathId: string, pathName?: string) => void;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!path.pathId) return;

    // Nếu có callback, gọi callback để điền vào chat input
    if (onPathClick) {
      e.preventDefault();
      onPathClick(path.pathId, path.pathName);
      return;
    }

    // Nếu không có callback, navigate như cũ
    router.push(`/dashboard/learning-paths/${path.pathId}`);
  };

  const handleViewDetail: MenuProps['onClick'] = (info) => {
    info.domEvent.stopPropagation();
    if (path.pathId) {
      // Trigger global drawer open
      window.dispatchEvent(new CustomEvent('openLearningPathDrawer', { 
        detail: { pathId: path.pathId } 
      }));
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'view-detail',
      label: 'Xem chi tiết',
      icon: <EyeOutlined />,
      onClick: handleViewDetail,
    },
  ];

  const getStatusBadge = (status?: number) => {
    switch (status) {
      case 0:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 shadow-sm dark:bg-amber-900/20 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Chưa xác nhận
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Đã xác nhận
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/50 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-200/50 dark:border-slate-700/70 dark:from-slate-800 dark:to-slate-900/50 dark:hover:border-sky-500 dark:hover:shadow-sky-500/20">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-sky-500 opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Header with dropdown */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/10 to-sky-400/10 text-emerald-500 transition-transform group-hover:scale-110 dark:from-emerald-400/20 dark:to-sky-400/20 dark:text-emerald-400">
            <FiBookOpen className="text-[18px]" />
          </div>
          {getStatusBadge(path.status)}
        </div>
        {/* Dropdown menu button */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
        >
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-500 opacity-0 transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-sky-500"
          >
            <FiMoreVertical className="text-[14px]" />
          </button>
        </Dropdown>
      </div>

      {/* Title - clickable */}
      <button
        type="button"
        onClick={handleClick}
        className="mb-2 w-full text-left"
      >
        <h4 className="line-clamp-2 text-[14px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-sky-600 dark:text-slate-50 dark:group-hover:text-sky-400">
          {path.pathName || "Lộ trình học tập"}
        </h4>
      </button>

      {/* Date */}
      {path.createdAt && (
        <div className="mt-auto flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <FiClock className="text-[12px]" />
          <span>
            {new Date(path.createdAt).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}

      {/* Arrow indicator */}
      <button
        type="button"
        onClick={handleClick}
        className="absolute bottom-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:bg-sky-500/20 dark:text-sky-400"
      >
        <FiArrowRight className="text-[12px]" />
      </button>
    </div>
  );
}


