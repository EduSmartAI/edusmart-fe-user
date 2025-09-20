"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Layout, Alert, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import QuizResultWrapper from "EduSmart/components/User/Quiz/QuizResult/QuizResultWrapper";

const { Content } = Layout;

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentTestId = searchParams.get("studentTestId");

  const handleBackToQuiz = () => {
    router.push("/quiz");
  };

  const handleRetakeQuiz = () => {
    router.push("/quiz");
  };

  if (!studentTestId) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Content style={{ padding: "50px", textAlign: "center" }}>
          <Alert
            message="Không tìm thấy ID bài kiểm tra"
            description="Vui lòng quay lại và thực hiện bài kiểm tra."
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={handleBackToQuiz}>
                Quay lại Quiz
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToQuiz}
            type="link"
          >
            Quay lại danh sách Quiz
          </Button>
        </div>

        <QuizResultWrapper
          studentTestId={studentTestId}
          onBackToHome={handleBackToQuiz}
          onRetakeQuiz={handleRetakeQuiz}
        />
      </Content>
    </Layout>
  );
}
