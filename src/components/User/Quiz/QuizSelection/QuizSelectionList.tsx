"use client";
import React from "react";
import { Typography } from "antd";
import QuizSelectionLine from "./QuizSelectionLine";
import { Quiz } from "EduSmart/types/quiz";

const { Text } = Typography;

interface QuizSelectionListProps {
    quizzes: Quiz[];
    selectedQuizIds: string[];
    onQuizSelect: (quizId: string) => void;
    onQuizStart: (quizId: string) => void;
}

const QuizSelectionList: React.FC<QuizSelectionListProps> = ({
    quizzes,
    selectedQuizIds,
    onQuizSelect,
    onQuizStart,
}) => {
    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12">
                <Text className="text-lg text-gray-500">
                    Không có quiz nào phù hợp với bộ lọc đã chọn
                </Text>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            {quizzes.map((quiz: Quiz) => (
                <QuizSelectionLine
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    description={
                        quiz.description ||
                        "Một bài quiz thú vị đang chờ bạn khám phá"
                    }
                    difficulty={"Medium"}
                    timeLimit={30}
                    totalQuestions={quiz.questions?.length || 0}
                    isCompleted={quiz.status === "completed"}
                    score={85}
                    isSelected={selectedQuizIds.includes(quiz.id)}
                    onSelect={onQuizSelect}
                    onStart={onQuizStart}
                />
            ))}
        </div>
    );
};

export default QuizSelectionList;
