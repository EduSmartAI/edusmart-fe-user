"use client";
import React, { useState } from "react";
import {
  Layout,
  Card,
  Button,
  Radio,
  Checkbox,
  Typography,
  Progress,
  Space,
  Tag,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { QuestionType, mapBackendDifficulty } from "EduSmart/types/quiz";

const { Content } = Layout;
const { Title, Text } = Typography;

interface QuizAnswer {
  questionId: string;
  selectedOptions: string[];
  correctOptions: string[];
  isCorrect: boolean;
}

interface QuizResultData {
  quizId: string;
  quizTitle: string;
  questions: Array<{
    id: string;
    text: string;
    type: QuestionType;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
    difficultyLevel: number; // Thêm trường này
  }>;
  userAnswers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
}

interface QuizResultScreenProps {
  results: QuizResultData[];
  onBackToHome: () => void;
  onRetakeQuiz: (quizId: string) => void;
}

const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  results,
  onBackToHome,
}) => {
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentResult = results[currentResultIndex];
  const currentQuestion = currentResult?.questions[currentQuestionIndex];
  const currentAnswer = currentResult?.userAnswers.find(
    (answer) => answer.questionId === currentQuestion?.id,
  );

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentResult.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuizSelect = (resultIndex: number) => {
    setCurrentResultIndex(resultIndex);
    setCurrentQuestionIndex(0);
  };

  const getOptionStyle = (optionId: string) => {
    const isSelected = currentAnswer?.selectedOptions.includes(optionId);
    const isCorrect = currentQuestion?.options.find(
      (opt) => opt.id === optionId,
    )?.isCorrect;

    if (isSelected && isCorrect) {
      return "bg-green-100 border-green-500 text-green-800"; // Đúng và được chọn
    } else if (isSelected && !isCorrect) {
      return "bg-red-100 border-red-500 text-red-800"; // Sai và được chọn
    } else if (!isSelected && isCorrect) {
      return "bg-green-50 border-green-300 text-green-700"; // Đúng nhưng không được chọn
    }
    return "bg-gray-50 border-gray-200"; // Không được chọn và không đúng
  };

  const getOptionIcon = (optionId: string) => {
    const isSelected = currentAnswer?.selectedOptions.includes(optionId);
    const isCorrect = currentQuestion?.options.find(
      (opt) => opt.id === optionId,
    )?.isCorrect;

    if (isSelected && isCorrect) {
      return <CheckCircleOutlined className="text-green-600" />;
    } else if (isSelected && !isCorrect) {
      return <CloseCircleOutlined className="text-red-600" />;
    } else if (!isSelected && isCorrect) {
      return <CheckCircleOutlined className="text-green-500" />;
    }
    return null;
  };

  if (!currentResult || !currentQuestion) {
    return (
      <Layout className="h-screen bg-gray-50 dark:bg-gray-900">
        <Content className="p-6 flex items-center justify-center">
          <Card className="text-center">
            <Title level={3}>Không có kết quả để hiển thị</Title>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen h-screen bg-gray-50 dark:bg-gray-900">
      <Content className="p-4 h-screen overflow-hidden">
        <Row gutter={16} className="w-full mx-auto h-full">
          {/* Left Sidebar - Quiz Results Stepper */}
          <Col span={8} className="h-full">
            <Card
              title="Kết quả Quiz"
              className="h-full min-h-[calc(100vh-3rem)]"
              styles={{
                body: {
                  padding: "16px",
                  height: "calc(100% - 57px)",
                  overflowY: "auto",
                },
              }}
            >
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={result.quizId}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      index === currentResultIndex
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleQuizSelect(index)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Title level={5} className="!mb-0">
                        {result.quizTitle}
                      </Title>
                      {result.score >= 70 ? (
                        <CheckCircleOutlined className="text-green-500" />
                      ) : (
                        <CloseCircleOutlined className="text-red-500" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <Text>Điểm số:</Text>
                        <Text
                          className={`font-bold ${
                            result.score >= 70
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {result.score}%
                        </Text>
                      </div>
                      <div className="flex justify-between text-sm">
                        <Text>Đúng:</Text>
                        <Text>
                          {result.correctAnswers}/{result.totalQuestions}
                        </Text>
                      </div>
                      <Progress
                        percent={result.score}
                        size="small"
                        showInfo={false}
                        strokeColor={result.score >= 70 ? "#52c41a" : "#f5222d"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Right Content - Question Review */}
          <Col span={16} className="h-full">
            <div className="space-y-6 h-full flex flex-col">
              {/* Header */}
              <Card className="flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <Title level={3} className="!mb-1">
                      {currentResult.quizTitle}
                    </Title>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Progress
                      type="circle"
                      size={60}
                      percent={
                        ((currentQuestionIndex + 1) /
                          currentResult.questions.length) *
                        100
                      }
                      strokeColor="#1890ff"
                      format={() => (
                        <span style={{ color: "#1890ff", fontWeight: "500" }}>
                          {currentQuestionIndex + 1}/
                          {currentResult.questions.length}
                        </span>
                      )}
                    />
                  </div>
                </div>
              </Card>

              {/* Question Card */}
              <Card className="flex-1 overflow-auto">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-x-2 mb-3">
                      <Tag color="blue">
                        {currentQuestion.type === QuestionType.SINGLE_CHOICE
                          ? "Chọn 1 đáp án"
                          : "Chọn nhiều đáp án"}
                      </Tag>
                      <Tag color="orange">
                        Độ khó:{" "}
                        {mapBackendDifficulty(
                          currentQuestion.difficultyLevel ?? 1,
                        )}
                      </Tag>
                    </div>
                    <Tag
                      color={currentAnswer?.isCorrect ? "success" : "error"}
                      icon={
                        currentAnswer?.isCorrect ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                    >
                      {currentAnswer?.isCorrect ? "Đúng" : "Sai"}
                    </Tag>
                  </div>

                  <Title level={4} className="!mb-4">
                    {currentQuestion.text}
                  </Title>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <div
                      key={option.id}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${getOptionStyle(option.id)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {currentQuestion.type ===
                          QuestionType.SINGLE_CHOICE ? (
                            <Radio
                              checked={currentAnswer?.selectedOptions.includes(
                                option.id,
                              )}
                              disabled
                            />
                          ) : (
                            <Checkbox
                              checked={currentAnswer?.selectedOptions.includes(
                                option.id,
                              )}
                              disabled
                            />
                          )}
                          <Text>{option.text}</Text>
                        </div>
                        {getOptionIcon(option.id)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Navigation */}
              <Card className="flex-shrink-0">
                <div className="flex justify-between items-center">
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    size="large"
                  >
                    Câu trước
                  </Button>

                  <Space>
                    <Button
                      icon={<HomeOutlined />}
                      onClick={onBackToHome}
                      size="large"
                    >
                      Về trang chủ
                    </Button>

                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={handleNextQuestion}
                      disabled={
                        currentQuestionIndex ===
                        currentResult.questions.length - 1
                      }
                      size="large"
                    >
                      Câu tiếp
                    </Button>
                  </Space>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default QuizResultScreen;
