"use client";
import React, { useState } from "react";
import { Layout, Button, Card, Typography, Alert } from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import QuizResultWrapper from "EduSmart/components/User/Quiz/QuizResult/QuizResultWrapper";
import QuizResultScreen from "EduSmart/components/User/Quiz/QuizResult/QuizResultScreen";
import ClientOnly from "EduSmart/components/User/Quiz/ClientOnly";
import { QuestionType } from "EduSmart/types/quiz";

const { Content } = Layout;
const { Title, Text } = Typography;

// Mock student test IDs for demo
const MOCK_STUDENT_TEST_IDS = [
    "st_001_demo_react_basic",
    "st_004_demo_javascript_core",
    "st_005_demo_web_fundamentals",
];

// Mock data for fallback (when API is not available)
const mockResults = [
    {
        quizId: "1",
        quizTitle: "React Basics",
        questions: [
            {
                id: "q1",
                text: "React là gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "opt1",
                        text: "Một thư viện JavaScript để xây dựng giao diện người dùng",
                        isCorrect: true,
                    },
                    {
                        id: "opt2",
                        text: "Một framework backend",
                        isCorrect: false,
                    },
                    { id: "opt3", text: "Một cơ sở dữ liệu", isCorrect: false },
                    {
                        id: "opt4",
                        text: "Một ngôn ngữ lập trình",
                        isCorrect: false,
                    },
                ],
            },
            {
                id: "q2",
                text: "Những tính năng nào là của React?",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    { id: "opt5", text: "Virtual DOM", isCorrect: true },
                    { id: "opt6", text: "Component-based", isCorrect: true },
                    {
                        id: "opt7",
                        text: "Server-side rendering",
                        isCorrect: false,
                    },
                    { id: "opt8", text: "Built-in routing", isCorrect: false },
                ],
            },
        ],
        userAnswers: [
            {
                questionId: "q1",
                selectedOptions: ["opt1"], // Đúng
                correctOptions: ["opt1"],
                isCorrect: true,
            },
            {
                questionId: "q2",
                selectedOptions: ["opt5", "opt7"], // Chọn đúng 1, sai 1
                correctOptions: ["opt5", "opt6"],
                isCorrect: false,
            },
        ],
        score: 50, // 1/2 đúng
        totalQuestions: 2,
        correctAnswers: 1,
        timeSpent: 300,
    },
];

export default function QuizResultDemoPage() {
    return (
        <ClientOnly>
            <QuizResultDemoContent />
        </ClientOnly>
    );
}

function QuizResultDemoContent() {
    const [mode, setMode] = useState<"menu" | "result" | "fallback">("menu");
    const [selectedStudentTestId, setSelectedStudentTestId] =
        useState<string>("");
    const [customTestId, setCustomTestId] = useState<string>("");

    const handleViewResult = (studentTestId: string) => {
        setSelectedStudentTestId(studentTestId);
        setMode("result");
    };

    const handleBackToMenu = () => {
        setMode("menu");
        setSelectedStudentTestId("");
        setCustomTestId("");
    };

    const handleRetakeQuiz = () => {
        // Redirect to quiz demo or show message
        alert("Chuyển đến /quiz-demo để làm bài mới");
        window.location.href = "/quiz-demo";
    };

    const handleCustomIdSubmit = () => {
        if (customTestId.trim()) {
            handleViewResult(customTestId.trim());
        }
    };

    const handleShowFallback = () => {
        setMode("fallback");
    };

    const renderMenu = () => (
        <Layout className="h-auto bg-gray-50">
            <Content className="p-8 flex items-center justify-center">
                <Card className="w-full max-w-3xl">
                    <div className="text-center space-y-6">
                        <Title level={2}>Quiz Result Demo</Title>
                        <Text className="text-gray-600 block">
                            Demo màn hình xem kết quả quiz với mock data và API
                            integration setup
                        </Text>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg text-left">
                                <Title level={4} className="!mb-2">
                                    Features:
                                </Title>
                                <ul className="space-y-1 text-sm">
                                    <li>• Xem điểm số tổng quan</li>
                                    <li>• Review từng câu hỏi chi tiết</li>
                                    <li>• Highlight đáp án đúng/sai</li>
                                    <li>• Navigation giữa các câu hỏi</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg text-left">
                                <Title level={4} className="!mb-2">
                                    ✅ API Integration:
                                </Title>
                                <Text className="text-sm">
                                    Mock data với structure tương tự backend
                                    API.
                                    <br />
                                    Sẵn sàng integrate khi backend ready.
                                </Text>
                            </div>

                            {/* Mock Student Test IDs */}
                            <div className="p-4 bg-purple-50 rounded-lg text-left">
                                <Title level={4} className="!mb-3">
                                    📝 Demo Student Test IDs:
                                </Title>
                                <div className="grid grid-cols-1 gap-2">
                                    {MOCK_STUDENT_TEST_IDS.map(
                                        (testId, index) => (
                                            <div
                                                key={testId}
                                                className="flex items-center justify-between p-3 bg-white rounded border hover:shadow-sm transition-shadow"
                                            >
                                                <div>
                                                    <Text
                                                        strong
                                                        className="block"
                                                    >
                                                        {testId}
                                                    </Text>
                                                    <Text className="text-xs text-gray-500">
                                                        Demo result #{index + 1}
                                                    </Text>
                                                </div>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    icon={<EyeOutlined />}
                                                    onClick={() =>
                                                        handleViewResult(testId)
                                                    }
                                                >
                                                    Xem kết quả
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Fallback Mode */}
                            <div className="p-4 bg-yellow-50 rounded-lg text-left">
                                <Title level={4} className="!mb-3">
                                    🔧 Fallback Mode:
                                </Title>
                                <Text className="text-sm block mb-3">
                                    Xem kết quả với mock data tĩnh (không qua
                                    API)
                                </Text>
                                <Button
                                    type="default"
                                    icon={<ReloadOutlined />}
                                    onClick={handleShowFallback}
                                >
                                    Xem Mock Result
                                </Button>
                            </div>

                            <Alert
                                type="info"
                                message="Environment Settings"
                                description="NEXT_PUBLIC_USE_QUIZ_MOCK = true (Sử dụng mock data)"
                                showIcon
                            />
                        </div>
                    </div>
                </Card>
            </Content>
        </Layout>
    );

    // Use QuizResultWrapper for API integration (with mock support)
    if (mode === "result") {
        return (
            <QuizResultWrapper
                studentTestId={selectedStudentTestId}
                onBackToHome={handleBackToMenu}
                onRetakeQuiz={handleRetakeQuiz}
            />
        );
    }

    // Use QuizResultScreen directly for fallback mock data
    if (mode === "fallback") {
        return (
            <QuizResultScreen
                results={mockResults}
                onRetakeQuiz={() => handleRetakeQuiz()}
                onBackToHome={handleBackToMenu}
            />
        );
    }

    return renderMenu();
}
