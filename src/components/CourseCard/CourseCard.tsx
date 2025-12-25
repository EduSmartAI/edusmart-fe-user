"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Progress,
  Popover,
  Image,
  ImageProps,
  Tag,
  Tooltip,
} from "antd";
import { CourseLevel } from "EduSmart/enum/enum";
import { useRouter } from "next/navigation";
import { HeartOutlined, HeartFilled, TeamOutlined } from "@ant-design/icons";
import "EduSmart/components/CourseCard/styles/component.card.css";
import {
  courseWishlistCreate,
  courseWishlistDelete,
} from "EduSmart/app/apiServer/wishlist/wishlistAction";
import { useMessageStore } from "EduSmart/stores/message/MessageStore";

const { Title, Text } = Typography;

interface CourseCardProps {
  imageUrl: ImageProps["src"];
  id?: string;
  title: string;
  descriptionLines?: string[];
  tagNames?: string[];
  level?: number | null;
  instructor: string;
  isEnrolled?: boolean;
  price?: number;
  dealPrice?: number | null;
  isShowProgress?: boolean;
  progress?: number;
  currentLesson?: number;
  totalLessons?: number;
  instructorAvatar?: ImageProps["src"];
  routerPush?: string;

  // ⭐ NEW: trạng thái wishlist
  isWishList?: boolean;
  // ⭐ NEW: callback nếu muốn handle khi bấm trái tim
  onToggleWishList?: () => void;
  learnerCount?: number | null;
  isHorizontal?: boolean;
  isLearningImproved?: boolean;
  onPrimaryAction?: () => void | Promise<void>;
}

const CourseCard: React.FC<CourseCardProps> = ({
  imageUrl,
  title,
  descriptionLines = [],
  tagNames = [],
  level = null,
  instructor,
  price,
  dealPrice,
  isShowProgress = false,
  progress = 0,
  currentLesson = 0,
  totalLessons = 0,
  instructorAvatar,
  routerPush,
  isWishList = false,
  id,
  isEnrolled = false,
  onToggleWishList,
  learnerCount = null,
  isHorizontal = false,
  isLearningImproved = false,
  onPrimaryAction,
}) => {
  const router = useRouter();
  const [localWish, setLocalWish] = useState(isWishList);
  const setMessage = useMessageStore((s) => s.setMessage);

  useEffect(() => {
    setLocalWish(isWishList);
  }, [isWishList]);

  useEffect(() => {
    if (routerPush) {
      router.prefetch(routerPush);
    }
  }, [routerPush, router]);

  const handleClick = () => {
    if (routerPush) router.push(routerPush);
  };

  // Nội dung popover
  const popContent = isShowProgress ? (
    <div style={{ width: 280 }}>
      <Title level={5} style={{ marginBottom: 8 }}>
        Hãy học ngay bây giờ!!!
      </Title>
      <Button type="primary" onClick={handleClick}>
        Học tiếp
      </Button>
    </div>
  ) : (
    <div style={{ width: 280 }}>
      <Title level={5} style={{ marginBottom: 8 }}>
        Mô tả khóa học
      </Title>
      <ul className="list-disc list-inside space-y-1 mb-4">
        {descriptionLines.map((line, idx) => {
          const words = line.split(" ");
          const text =
            words.length > 8 ? words.slice(0, 8).join(" ") + "..." : line;
          return (
            <li key={idx}>
              <Text>{text}</Text>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const formatMoneyVND = (value?: number | null) => {
    if (typeof value !== "number" || !isFinite(value)) return "";
    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${value.toLocaleString("vi-VN")} ₫`;
    }
  };

  const formatLearnerCount = (value?: number | null) => {
    if (typeof value !== "number" || value <= 0 || !isFinite(value)) return "";
    try {
      return value.toLocaleString("vi-VN");
    } catch {
      return String(value);
    }
  };

  const handleButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation(); // tránh trigger Card onClick
     if (onPrimaryAction) {
      await onPrimaryAction();
      return;
    }
    if (!routerPush) return;

    if (isEnrolled) {
      router.push(`${routerPush}/learn`);
    } else {
      router.push(routerPush);
    }
  };

  const handleToggleWish = async () => {
    if (!id) return;

    try {
      if (!localWish) {
        const res = await courseWishlistCreate(id);
        if (res?.success && res.response) {
          setLocalWish(true);
        }
        setMessage(res?.message ?? "", {
          type: "success",
          duration: 1,
        });

        // Call callback after successful add
        if (onToggleWishList) {
          onToggleWishList();
        }
      } else {
        console.log("Removing from wishlist");
        const res = await courseWishlistDelete(id);
        if (res?.success) {
          setLocalWish(false);
        }
        setMessage(res?.message ?? "", {
          type: "success",
          duration: 1,
        });

        // Call callback after successful remove
        if (onToggleWishList) {
          onToggleWishList();
        }
      }
    } catch (error) {
      console.error("handleToggleWish error:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại", {
        type: "error",
        duration: 1,
      });
    }
  };
  const hasDeal = dealPrice !== null && dealPrice !== undefined;
  const normalizedTags = (tagNames ?? []).filter(Boolean);
  const maxInlineTags = 2;
  const inlineTags = normalizedTags.slice(0, maxInlineTags);
  const hiddenTags = normalizedTags.slice(maxInlineTags);
  const descriptionPreview = descriptionLines.join(" • ");
  const horizontalDescription =
    descriptionPreview || "Khoá học đang cập nhật mô tả, vui lòng trở lại sau.";
  const horizontalBullets = descriptionLines.length
    ? descriptionLines.slice(0, 3)
    : [
        "Đang cập nhật mô tả cho khoá học này.",
        "Vui lòng thử lại sau ít phút để xem chi tiết.",
      ];
  const levelLabel = (() => {
    switch (level) {
      case CourseLevel.Beginner:
        return "Cơ bản";
      case CourseLevel.Intermidiate:
        return "Trung cấp";
      case CourseLevel.Advanced:
        return "Nâng cao";
      default:
        return null;
    }
  })();

  const renderLearnerCount = (options?: {
    className?: string;
    inline?: boolean;
  }) => {
    const { className = "mt-2", inline = false } = options ?? {};
    const formatted = formatLearnerCount(learnerCount);
    if (!formatted) return null;
    const baseClass =
      "items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-300";
    const content = (
      <>
        <TeamOutlined style={{ fontSize: 12 }} className="text-emerald-500" />
        <span>{formatted} học viên</span>
      </>
    );

    return inline ? (
      <span className={`${className} inline-flex ${baseClass}`}>{content}</span>
    ) : (
      <div className={`${className} flex ${baseClass}`}>{content}</div>
    );
  };

  const cardLayoutClass = isHorizontal
    ? "w-full min-h-[220px]"
    : "w-[22rem] max-w-[26rem] min-w-[16rem] h-[30rem]";

  const bodyWrapperClass = isHorizontal
    ? "flex flex-col lg:flex-row gap-6 h-full"
    : "flex flex-col h-full";

  const imageWrapperClass = isHorizontal
    ? "relative w-full lg:w-[320px] h-[200px] lg:h-auto overflow-hidden flex items-center justify-center rounded-2xl flex-shrink-0 bg-slate-100"
    : "relative w-full h-[180px] overflow-hidden flex items-center justify-center";

  const imageStyle: React.CSSProperties = {
    objectFit: "cover",
    objectPosition: "center center",
    width: "100%",
    height: "100%",
  };

  const baseCardClass =
    "cursor-pointer rounded-lg overflow-hidden !border !border-slate-200/80 dark:!border-slate-700/60 hover:!border-slate-300 dark:hover:!border-slate-600 !shadow-sm hover:!shadow-md !transition focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-emerald-400";
  const cardClassName = `${cardLayoutClass} ${baseCardClass} ${
    isHorizontal ? "hover:!shadow-lg" : ""
  }`;
  const contentWrapperClass = `flex-1 flex flex-col ${
    isHorizontal ? "p-4 lg:py-5 lg:pr-6" : "p-4"
  }`;

  const priceBlock =
    typeof price === "number" || hasDeal ? (
      <div className="flex flex-col" style={{ minHeight: 56 }}>
        {dealPrice !== null && dealPrice !== undefined ? (
          <>
            <Text strong style={{ fontSize: 20, color: "#20C997" }}>
              {formatMoneyVND(dealPrice)}
            </Text>
            {typeof price === "number" ? (
              <Text type="secondary" delete style={{ marginTop: 4 }}>
                {formatMoneyVND(price)}
              </Text>
            ) : (
              <span style={{ marginTop: 4, visibility: "hidden" }}>.</span>
            )}
          </>
        ) : (
          <>
            {typeof price === "number" && (
              <Text strong style={{ fontSize: 20, color: "#20C997" }}>
                {formatMoneyVND(price)}
              </Text>
            )}
            <span style={{ marginTop: 4, visibility: "hidden" }}>.</span>
          </>
        )}
      </div>
    ) : null;

  const actionButtonLabel = isEnrolled || isLearningImproved ? "Học ngay" : "Xem ngay";

  const renderPrimaryButton = (className?: string) => (
    <Button type="primary" onClick={handleButtonClick} className={className}>
      {actionButtonLabel}
    </Button>
  );

  const levelBadge = levelLabel ? (
    <span className="inline-flex items-center rounded-full bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1">
      {levelLabel}
    </span>
  ) : null;

  const learnerBadge = (() => {
    const formatted = formatLearnerCount(learnerCount);
    if (!formatted) return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1">
        <TeamOutlined style={{ fontSize: 12 }} />
        {formatted} học viên
      </span>
    );
  })();

  return (
    <Popover
      content={popContent}
      trigger="hover"
      placement="rightTop"
      mouseEnterDelay={0.1}
    >
      <Card
        hoverable
        variant={"borderless"}
        onClick={handleClick}
        className={cardClassName}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 0 }}
      >
        <div className={bodyWrapperClass}>
          {/* Image */}
          <div className={imageWrapperClass}>
            {/* ⭐ Icon trái tim wishlist */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // tránh trigger Card onClick
                handleToggleWish();
              }}
              className="
                absolute top-2 right-2 z-10
                rounded-full bg-black/40 hover:bg-black/60
                p-1 flex items-center justify-center
              "
            >
              {localWish ? (
                <HeartFilled style={{ fontSize: 20, color: "#f97373" }} />
              ) : (
                <HeartOutlined style={{ fontSize: 20, color: "#ffffff" }} />
              )}
            </button>

            <Image
              src={imageUrl}
              className="w-full h-full object-cover"
              preview={false}
              alt={title}
              loading="lazy"
              style={imageStyle}
            />
          </div>

          {/* Main content */}
          <div className={contentWrapperClass}>
            {isHorizontal ? (
              <div className="flex flex-col flex-grow gap-2">
                {(levelBadge || learnerBadge || inlineTags.length > 0) && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {levelBadge}
                    {learnerBadge}
                    {inlineTags.map((tag) => (
                      <span
                        key={`horizontal-tag-${tag}`}
                        className="inline-flex items-center rounded-full bg-blue-50/70 text-blue-600 text-xs font-semibold px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div>
                  <Title
                    level={4}
                    style={{ marginBottom: 4 }}
                    ellipsis={{ rows: 2, tooltip: title }}
                    className="!text-[1.35rem] !font-bold text-gray-900 dark:text-white"
                  >
                    {title}
                  </Title>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {instructor}
                  </p>
                </div>
                {horizontalBullets.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-300 leading-relaxed space-y-1">
                    {horizontalBullets.map((line, idx) => (
                      <li key={`horizontal-bullet-${idx}`}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {horizontalDescription}
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:gap-4">
                  {priceBlock && (
                    <div className="lg:text-right">{priceBlock}</div>
                  )}
                  <div className="flex lg:flex-none">
                    {renderPrimaryButton("min-w-[160px]")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-grow">
                <Title
                  level={5}
                  style={{ marginBottom: 8 }}
                  ellipsis={{ rows: 2, tooltip: title }}
                  className="basis-[3.2rem]"
                >
                  {title}
                </Title>

                {(levelLabel || normalizedTags.length > 0) && (
                  <div className="flex items-center gap-1.5 mb-3 overflow-hidden flex-nowrap w-full min-w-0">
                    {levelLabel && (
                      <Tag
                        color="purple"
                        className="!m-0 !rounded-full px-3 py-0 text-xs font-medium whitespace-nowrap"
                      >
                        {levelLabel}
                      </Tag>
                    )}
                    {inlineTags.map((tag) => (
                      <Tooltip key={tag} title={tag}>
                        <Tag
                          color="blue"
                          className="!m-0 !rounded-full px-3 py-0 text-xs font-medium whitespace-nowrap"
                          style={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {tag}
                        </Tag>
                      </Tooltip>
                    ))}
                    {hiddenTags.length > 0 && (
                      <Tooltip
                        title={
                          <div className="space-y-1">
                            {hiddenTags.map((tag) => (
                              <div key={tag}>{tag}</div>
                            ))}
                          </div>
                        }
                      >
                        <Tag
                          color="blue"
                          className="!m-0 !rounded-full px-3 py-0 text-xs font-medium cursor-pointer"
                        >
                          +{hiddenTags.length}
                        </Tag>
                      </Tooltip>
                    )}
                  </div>
                )}

                {isShowProgress ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4">
                      {instructorAvatar && (
                        <Image
                          src={instructorAvatar}
                          alt={instructor}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <Text className="dark:!text-white">{instructor}</Text>
                    </div>
                    {renderLearnerCount({ className: "mt-0 mb-3" })}
                    <Progress
                      className="mb-2"
                      percent={progress}
                      showInfo={false}
                      strokeColor="#20C997"
                      trailColor="#E5E7EB"
                    />
                    <div className="text-right text-xs text-gray-500">
                      Lesson {currentLesson} of {totalLessons}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-500 dark:text-gray-300">
                      <span className="dark:!text-white">
                        Giảng viên: {instructor}
                      </span>
                      {renderLearnerCount({
                        className: "text-xs font-medium",
                        inline: true,
                      })}
                    </div>
                    {priceBlock && <div className="mt-4">{priceBlock}</div>}

                    <div className="mt-6">{renderPrimaryButton()}</div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Popover>
  );
};

export default CourseCard;
