// app/quiz-simple/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Button, Card, Typography, Space } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import QuizSelectionScreen from "EduSmart/components/User/Quiz/QuizSelection/QuizSelectionScreen";
import QuizTakingScreenNew from "EduSmart/components/User/Quiz/QuizTaking/QuizTakingScreenNew";
import ClientOnly from "EduSmart/components/User/Quiz/ClientOnly";

const { Content } = Layout;
const { Title, Text } = Typography;

type Screen = "menu" | "selection" | "taking";

interface QuizFlow {
  currentScreen: Screen;
  testId?: string;
}

export default function QuizSimplePage() {
  return (
    <ClientOnly>
      <QuizSimpleContent />
    </ClientOnly>
  );
}

function QuizSimpleContent() {
  const router = useRouter();
  const [flow, setFlow] = useState<QuizFlow>({
    currentScreen: "menu",
  });

  const handleQuizSelect = (testId: string) => {
    console.log("Test created with ID:", testId);
    setFlow({
      currentScreen: "taking",
      testId: testId,
    });
  };

  const handleQuizComplete = (studentTestId: string) => {
    console.log("Quiz completed with student test ID:", studentTestId);
    // Navigate to result page with studentTestId as query parameter
    router.push(`/quiz-result?studentTestId=${studentTestId}`);
  };

  const handleExit = () => {
    setFlow({
      currentScreen: "menu",
    });
  };

  const handleSkip = () => {
    console.log("Skip quiz selection");
  };

  const renderMenu = () => (
    <Layout className="min-h-screen h-screen bg-gray-50">
      <Content className="p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <div className="text-center space-y-6">
            <Title level={2}>Quiz Simple Demo</Title>
            <Text className="text-gray-600 block">
              Demo luồng chọn quiz và làm bài đơn giản với mock data
            </Text>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg text-left">
                <Title level={4} className="!mb-2">
                  Luồng hoạt động:
                </Title>
                <ol className="space-y-1 text-sm">
                  <li>1. Chọn Quiz Selection để xem danh sách quiz</li>
                  <li>2. Chọn quiz và tạo test</li>
                  <li>3. Làm bài quiz</li>
                  <li>4. Submit và xem kết quả</li>
                  <li>5. Quay về menu hoặc làm lại</li>
                </ol>
              </div>
            </div>

            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => setFlow({ currentScreen: "selection" })}
              >
                Bắt đầu Demo
              </Button>
            </Space>
          </div>
        </Card>
      </Content>
    </Layout>
  );

  switch (flow.currentScreen) {
    case "menu":
      return renderMenu();

    case "selection":
      return (
        <QuizSelectionScreen
          onQuizSelect={handleQuizSelect}
          onSkip={handleSkip}
        />
      );

    case "taking":
      return (
        <QuizTakingScreenNew
          testId={flow.testId!}
          onComplete={handleQuizComplete}
          onExit={handleExit}
        />
      );

    default:
      return <div>Unknown screen</div>;
  }
}
