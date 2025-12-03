// components/User/Quiz/QuizTaking/QuizTakingScreenNew.tsx
"use client";
import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
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
  Alert,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useQuizTaking } from "EduSmart/hooks/quiz";
import {
  QuestionType,
  mapBackendQuestionType,
  mapBackendDifficulty,
} from "EduSmart/types/quiz";
import { learningPathProgress } from "EduSmart/components/LearningPath";
import { useNotification } from "EduSmart/Provider/NotificationProvider";

const { Content } = Layout;
const { Title, Text } = Typography;

interface QuizTakingScreenNewProps {
  testId: string;
  onComplete: (quizData: {
    testId: string;
    startedAt: string;
    quizIds: string[];
    answers: Array<{ questionId: string; answerId: string }>;
  }) => void;
  onExit: () => void;
}

const QuizTakingScreenNew: React.FC<QuizTakingScreenNewProps> = ({
  testId,
  onComplete,
  onExit,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const { state, actions } = useQuizTaking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageApi = useNotification();

  const handleSubmitTest = useCallback(async () => {
    // Set submitting state to show blur overlay with Spin
    setIsSubmitting(true);

    try {
      // Prepare quiz data (don't submit yet, will submit with practice test)
      const testDetail = state.testDetail;

      if (!testDetail || !testDetail.testId) {
        throw new Error("Test data not found");
      }

      // Convert answers from Record to Array format
      const answersArray: Array<{ questionId: string; answerId: string }> = [];
      Object.entries(state.answers || {}).forEach(([questionId, answerIds]) => {
        (answerIds as string[]).forEach((answerId) => {
          answersArray.push({ questionId, answerId });
        });
      });

      const quizData = {
        testId: testDetail.testId,
        startedAt: new Date().toISOString(),
        quizIds: (testDetail.quizzes || [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((q: any) => q.quizId)
          .filter(Boolean),
        answers: answersArray,
      };

      console.log("✅ Quiz data prepared:", quizData);

      // Show success message
      messageApi.success({
        content: "Đã lưu bài kiểm tra! Tiếp tục với bài tập thực hành.",
        duration: 1,
      });

      // Mark step 2 as completed
      learningPathProgress.completeStep(2);

      // Call onComplete callback to move to practice test
      setTimeout(() => {
        onComplete(quizData);
      }, 300);
    } catch (error) {
      console.error("❌ Quiz preparation error:", error);

      // Show error message
      messageApi.error({
        content: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        duration: 6,
      });

      // Reset submitting state on error to allow retry
      setIsSubmitting(false);
    }
  }, [state, onComplete]);

  // Load test when component mounts
  useEffect(() => {
    if (testId) {
      actions.loadTest(testId);
    }
  }, [testId, actions]);

  // Loading state
  if (state.isLoading) {
    return (
      <Layout className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <Content className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
              <Spin
                size="large"
                className="[&_.ant-spin-dot-item]:bg-[#49BBBD]"
              />
            </div>
            <Text className="text-gray-600 dark:text-gray-400">
              Đang tải bài kiểm tra...
            </Text>
          </div>
        </Content>
      </Layout>
    );
  }

  // Error state
  if (state.error) {
    return (
      <Layout className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <Content className="p-6 flex items-center justify-center">
          <Alert
            message="Lỗi tải bài kiểm tra"
            description={state.error}
            type="error"
            showIcon
            action={
              <Button
                onClick={onExit}
                className="bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none text-white hover:from-[#3da8aa] hover:to-cyan-700"
              >
                Quay lại
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  // No test data
  if (
    !state.testDetail ||
    !state.testDetail.quizzes ||
    state.testDetail.quizzes.length === 0
  ) {
    return (
      <Layout className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <Content className="p-6 flex items-center justify-center">
          <Alert
            message="Không tìm thấy bài kiểm tra"
            description="Bài kiểm tra không tồn tại hoặc đã bị lỗi."
            type="error"
            showIcon
            action={
              <Button
                onClick={onExit}
                className="bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none text-white hover:from-[#3da8aa] hover:to-cyan-700"
              >
                Quay lại
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  // Sau các điều kiện trên mới truy cập quizzes/questions
  const currentQuiz = state.testDetail.quizzes[state.currentQuizIndex];
  const currentQuestion = currentQuiz.questions[state.currentQuestionIndex];
  // Map BE type to FE type
  const questionType = mapBackendQuestionType(currentQuestion.questionType);
  const difficultyLevel = mapBackendDifficulty(
    currentQuestion.difficultyLevel ?? 1,
  );
  const isMultipleChoice = questionType === QuestionType.MULTIPLE_CHOICE;
  const selectedAnswers = state.answers[currentQuestion.questionId] || [];

  const handleAnswerChange = (answerId: string) => {
    actions.selectAnswer(
      currentQuestion.questionId,
      answerId,
      isMultipleChoice,
    );
  };

  // Count answered questions for the current quiz only
  const getAnsweredCountForCurrentQuiz = () => {
    return currentQuiz.questions.filter(
      (q) =>
        state.answers[q.questionId] && state.answers[q.questionId].length > 0,
    ).length;
  };

  // Check if all questions in all quizzes are answered
  const areAllQuestionsAnswered = () => {
    if (!state.testDetail?.quizzes) return false;

    for (const quiz of state.testDetail.quizzes) {
      for (const question of quiz.questions) {
        const answers = state.answers[question.questionId];
        if (!answers || answers.length === 0) {
          return false;
        }
      }
    }
    return true;
  };

  const isLastQuestion = () => {
    return (
      state.currentQuizIndex === state.testDetail!.quizzes.length - 1 &&
      state.currentQuestionIndex === currentQuiz.questions.length - 1
    );
  };

  const canGoNext = () => {
    return !isLastQuestion();
  };

  const canGoPrevious = () => {
    return !(state.currentQuizIndex === 0 && state.currentQuestionIndex === 0);
  };

  return (
    <Spin spinning={isSubmitting}>
      <Layout className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <Content className="p-4 h-screen overflow-hidden">
          <Row gutter={16} className="w-full mx-auto h-full">
            {/* Left Sidebar - Quiz Navigation */}
            <Col span={8} className="h-full">
              <Card
                title="Danh sách bài kiểm tra"
                className="h-full"
                styles={{
                  body: {
                    padding: "16px",
                    height: "calc(100% - 57px)",
                    overflowY: "auto",
                  },
                }}
              >
                <div className="space-y-4">
                  {state.testDetail.quizzes.map((quiz, quizIndex) => (
                    <div
                      key={quiz.quizId}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                        quizIndex === state.currentQuizIndex
                          ? "bg-teal-50 border-teal-200 shadow-sm"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-teal-100"
                      }`}
                      onClick={() => actions.goToQuiz(quizIndex)}
                    >
                      <div
                        className={`font-medium text-sm ${
                          quizIndex === state.currentQuizIndex
                            ? "text-[#49BBBD]"
                            : "text-gray-900"
                        }`}
                      >
                        {quiz.title}
                      </div>
                      {quiz.description && (
                        <div className="text-xs text-gray-400 mt-1">
                          {quiz.description}
                        </div>
                      )}
                      <div className="mt-2">
                        <Progress
                          percent={
                            (quiz.questions.filter(
                              (q) =>
                                state.answers[q.questionId] &&
                                state.answers[q.questionId].length > 0,
                            ).length /
                              quiz.questions.length) *
                            100
                          }
                          size="small"
                          showInfo={false}
                          strokeColor={{
                            "0%": "#49BBBD",
                            "100%": "#06b6d4",
                          }}
                        />
                        <Text className="text-xs text-gray-500">
                          {
                            quiz.questions.filter(
                              (q) =>
                                state.answers[q.questionId] &&
                                state.answers[q.questionId].length > 0,
                            ).length
                          }
                          /{quiz.questions.length} câu
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Right Content - Quiz Taking */}
            <Col span={16} className="h-full">
              <div className="space-y-6 h-full flex flex-col">
                {/* Header with Progress */}
                <Card className="flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <Title level={3} className="!mb-1">
                        {currentQuiz.title}
                      </Title>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress
                        type="circle"
                        size={60}
                        percent={
                          ((state.currentQuestionIndex + 1) /
                            currentQuiz.questions.length) *
                          100
                        }
                        strokeColor={{
                          "0%": "#49BBBD",
                          "100%": "#06b6d4",
                        }}
                        format={() => (
                          <span style={{ color: "#49BBBD", fontWeight: "500" }}>
                            {state.currentQuestionIndex + 1}/
                            {currentQuiz.questions.length}
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
                        <Tag color="cyan">
                          {isMultipleChoice
                            ? "Chọn nhiều đáp án"
                            : "Chọn 1 đáp án"}
                        </Tag>
                        <Tag color="orange">Độ khó: {difficultyLevel}</Tag>
                      </div>
                      <Text className="text-sm text-gray-500">
                        Đã trả lời: {getAnsweredCountForCurrentQuiz()}/
                        {currentQuiz.questions.length}
                      </Text>
                    </div>

                    <Title level={4} className="!mb-4">
                      {currentQuestion.questionText}
                    </Title>
                  </div>

                  <div className="">
                    {currentQuestion.answers?.map((answer) => (
                      <div key={answer.answerId} className="w-full">
                        {isMultipleChoice ? (
                          <Checkbox
                            checked={selectedAnswers.includes(answer.answerId)}
                            onChange={() => handleAnswerChange(answer.answerId)}
                            className="w-full"
                          >
                            <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                              {answer.answerText}
                            </div>
                          </Checkbox>
                        ) : (
                          <Radio
                            checked={selectedAnswers.includes(answer.answerId)}
                            onChange={() => handleAnswerChange(answer.answerId)}
                            className="w-full"
                          >
                            <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                              {answer.answerText}
                            </div>
                          </Radio>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Navigation */}
                <Card className="flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={actions.previousQuestion}
                      disabled={!canGoPrevious()}
                      size="large"
                      className="hover:border-teal-400 hover:text-[#49BBBD]"
                    >
                      Câu trước
                    </Button>

                    <Space>
                      <Button onClick={onExit} size="large">
                        Thoát
                      </Button>

                      {isLastQuestion() ? (
                        <div className="text-center">
                          <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={handleSubmitTest}
                            size="large"
                            loading={state.isLoading}
                            disabled={!areAllQuestionsAnswered()}
                            className="!bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 hover:shadow-lg"
                            title={
                              !areAllQuestionsAnswered()
                                ? "Vui lòng hoàn thành tất cả câu hỏi trước khi nộp bài"
                                : "Nộp bài kiểm tra"
                            }
                          >
                            Nộp bài
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          icon={<ArrowRightOutlined />}
                          onClick={actions.nextQuestion}
                          disabled={!canGoNext()}
                          size="large"
                          className="!bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 hover:shadow-lg"
                        >
                          Câu tiếp
                        </Button>
                      )}
                    </Space>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Spin>
  );
};

export default QuizTakingScreenNew;
