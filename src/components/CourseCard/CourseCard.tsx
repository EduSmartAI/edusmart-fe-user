"use client";
import React from "react";
import { Card, Button, Typography, Progress, Popover, Image, ImageProps } from "antd";
import { useRouter } from "next/navigation";
import "EduSmart/components/CourseCard/styles/component.card.css";
const { Title, Paragraph, Text } = Typography;

interface CourseCardProps {
  imageUrl: ImageProps["src"];
  title: string;
  descriptionLines?: string[];
  instructor: string;
  price?: string;
  isShowProgress?: boolean;
  progress?: number;
  currentLesson?: number;
  totalLessons?: number;
  instructorAvatar?: ImageProps["src"];
  routerPush?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  imageUrl,
  title,
  descriptionLines = [],
  instructor,
  price,
  isShowProgress = false,
  progress = 0,
  currentLesson = 0,
  totalLessons = 0,
  instructorAvatar,
  routerPush,
}) => {
  const router = useRouter();
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
      <Button type="primary" block>
        Add to cart
      </Button>
    </div>
  );

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
          max-w-[26rem] min-w-[16rem] h-[26rem]
          cursor-pointer rounded-lg overflow-hidden !border !border-slate-200/80 dark:!border-slate-700/60
        hover:!border-slate-300 dark:hover:!border-slate-600 !shadow-sm hover:!shadow-md !transition focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        "
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Image */}
          <div className="relative w-full h-[180px] overflow-hidden flex items-center justify-center">
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
                height: "100%"
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
                  <div className="mt-4">
                    {price && (
                      <Text strong style={{ fontSize: 20, color: "#20C997" }}>
                        {price}
                      </Text>
                    )}
                    <div className="mt-6">
                      <Button style={{ marginRight: 8 }}>Chọn</Button>
                      <Button type="primary">Mua ngay</Button>
                    </div>
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
