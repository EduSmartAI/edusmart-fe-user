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
} from "antd";
import { useRouter } from "next/navigation";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import "EduSmart/components/CourseCard/styles/component.card.css";
import {
  courseWishlistCreate,
  courseWishlistDelete,
} from "EduSmart/app/apiServer/wishlist/wishlistAction";
import { useMessageStore } from "EduSmart/stores/message/MessageStore";

const { Title, Paragraph, Text } = Typography;

interface CourseCardProps {
  imageUrl: ImageProps["src"];
  id?: string;
  title: string;
  descriptionLines?: string[];
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
}

const CourseCard: React.FC<CourseCardProps> = ({
  imageUrl,
  title,
  descriptionLines = [],
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

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation(); // tránh trigger Card onClick

    if (!routerPush) return;

    if (isEnrolled) {
      router.push(`${routerPush}/learn`);
    } else {
      router.push(routerPush);
    }
  };

  const handleToggleWish = async () => {
    if (onToggleWishList) {
      onToggleWishList();
      return;
    }

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

  console.log("router push", routerPush);

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
        className="
          w-[22rem]
          max-w-[26rem] min-w-[16rem] h-[28rem]
          cursor-pointer rounded-lg overflow-hidden !border !border-slate-200/80 dark:!border-slate-700/60
          hover:!border-slate-300 dark:hover:!border-slate-600 !shadow-sm hover:!shadow-md !transition
          focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        "
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Image */}
          <div className="relative w-full h-[180px] overflow-hidden flex items-center justify-center">
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
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex flex-col flex-grow">
              <Title
                level={5}
                style={{ marginBottom: 8 }}
                ellipsis={{ rows: 2, tooltip: title }}
                className="basis-[3.2rem]"
              >
                {title}
              </Title>

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
                  <Paragraph
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: "rgba(0,0,0,0.45)",
                    }}
                    className="dark:!text-white"
                  >
                    Giảng viên: {instructor}
                  </Paragraph>
                  {(typeof price === "number" || hasDeal) && (
                    <div className="mt-4">
                      <div className="flex flex-col" style={{ minHeight: 56 }}>
                        {dealPrice !== null && dealPrice !== undefined ? (
                          <>
                            <Text
                              strong
                              style={{ fontSize: 20, color: "#20C997" }}
                            >
                              {formatMoneyVND(dealPrice)}
                            </Text>
                            {typeof price === "number" ? (
                              <Text
                                type="secondary"
                                delete
                                style={{ marginTop: 4 }}
                              >
                                {formatMoneyVND(price)}
                              </Text>
                            ) : (
                              <span
                                style={{ marginTop: 4, visibility: "hidden" }}
                              >
                                .
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {typeof price === "number" && (
                              <Text
                                strong
                                style={{ fontSize: 20, color: "#20C997" }}
                              >
                                {formatMoneyVND(price)}
                              </Text>
                            )}
                            <span
                              style={{ marginTop: 4, visibility: "hidden" }}
                            >
                              .
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <Button type="primary" onClick={handleButtonClick}>
                      {isEnrolled ? "Học ngay" : "Xem ngay"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Popover>
  );
};

export default CourseCard;
