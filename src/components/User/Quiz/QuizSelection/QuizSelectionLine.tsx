"use client";
import React from "react";
import { Button, Card, Checkbox, Tag, Progress, Typography } from "antd";
import {
    PlayCircleOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { ZoomIn } from "EduSmart/components/Animation/ZoomIn";

const { Title, Text, Paragraph } = Typography;

interface QuizSelectionLineProps {
    id: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    timeLimit: number;
    totalQuestions: number;
    isCompleted: boolean;
    score?: number;
    isSelected: boolean;
    onSelect: (quizId: string) => void;
    onStart: (quizId: string) => void;
}

const QuizSelectionLine: React.FC<QuizSelectionLineProps> = ({
    id,
    title,
    description,
    difficulty,
    timeLimit,
    totalQuestions,
    isCompleted,
    score,
    isSelected,
    onSelect,
    onStart,
}) => {
    const getDifficultyColor = (level: string) => {
        switch (level) {
            case "Easy":
                return "green";
            case "Medium":
                return "orange";
            case "Hard":
                return "red";
            default:
                return "blue";
        }
    };

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
                        <div className="flex flex-col justify-center mr-4">
                            <Checkbox
                                checked={isSelected}
                                onChange={() => onSelect(id)}
                                className="w-full"
                                style={
                                    {
                                        "--ant-primary-color": "#1677ff",
                                    } as React.CSSProperties
                                }
                            />
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
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                <span>{totalQuestions} câu hỏi</span>
                                <Tag color={getDifficultyColor(difficulty)}>
                                    {difficulty}
                                </Tag>
                            </div>

                            {description && (
                                <Paragraph
                                    className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0 line-clamp-2"
                                    ellipsis={{ rows: 2 }}
                                >
                                    {description}
                                </Paragraph>
                            )}
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
