"use client";
import React from "react";
import { Button, Card, Tag, Typography } from "antd";
import { PlayCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { ZoomIn } from "EduSmart/components/Animation/ZoomIn";

const { Title, Paragraph } = Typography;

interface QuizSelectionLineProps {
  id: string;
  title: string;
  description: string;
  subjectCodeName: string;
  subjectCode: string;
  totalQuestions: number;
  isCompleted: boolean;
  isSelected: boolean;
  onSelect: (quizId: string) => void;
  onStart: (quizId: string) => void;
}

const QuizSelectionLine: React.FC<QuizSelectionLineProps> = ({
  id,
  title,
  description,
  subjectCodeName,
  totalQuestions,
  isCompleted,
  isSelected,
  onSelect,
  onStart,
}) => {
  return (
    <ZoomIn delay={100}>
      <Card
        className={`mb-4 transition-all duration-300 hover:shadow-md border-2 cursor-pointer ${
          isSelected
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
            : "border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-400"
        }`}
        styles={{ body: { padding: "16px" } }}
        onClick={() => onSelect(id)}
      >
        <div className="flex items-center justify-between">
          {/* Left: Checkbox and Content */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col justify-center mr-4 cursor-pointer">
              {isSelected ? (
                <CheckCircleOutlined
                  style={{ fontSize: 24, color: "#1677ff" }}
                />
              ) : (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                    background: "#fff",
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-1">
                <Title
                  level={4}
                  className="!mb-0 !text-lg line-clamp-1"
                  style={{ fontWeight: 600 }}
                >
                  {title}
                </Title>
                <Tag color="blue" className="ml-2">
                  Mã môn: {subjectCodeName}
                </Tag>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                {/* <Tag color="blue" className="ml-2">
                  Mã môn: {subjectCodeName}
                </Tag> */}

                {/* <Tag color={getDifficultyColor(difficulty)}>{difficulty}</Tag> */}
                {/* <span className="text-xs text-gray-400">
                  Mã môn: {subjectCodeName}
                </span> */}
              </div>
              {description && (
                <Paragraph
                  className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0 line-clamp-2"
                  ellipsis={{ rows: 2 }}
                >
                  {description}
                </Paragraph>
              )}
              <Tag color="red" className="ml-2">
                {totalQuestions} câu hỏi
              </Tag>
            </div>
          </div>

          {/* Right: Action Button */}
          <div
            className="ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => onStart(id)}
              size="large"
              className={`${
                isCompleted
                  ? "bg-green-500 hover:bg-green-600 border-green-500"
                  : ""
              }`}
            >
              Bắt đầu
            </Button>
          </div>
        </div>
      </Card>
    </ZoomIn>
  );
};

export default QuizSelectionLine;
