// components/User/Quiz/QuizTaking/QuizTakingScreenNew.tsx
"use client";
import React, { useEffect, useCallback } from "react";
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

const { Content } = Layout;
const { Title, Text } = Typography;

interface QuizTakingScreenNewProps {
  testId: string;
  onComplete: (studentTestId: string) => void;
  onExit: () => void;
}

const QuizTakingScreenNew: React.FC<QuizTakingScreenNewProps> = ({
  testId,
  onComplete,
  onExit,
}) => {
  const { state, actions } = useQuizTaking();
  console.log("QuizTakingScreenNew state:", state);

  const handleSubmitTest = useCallback(async () => {
    const studentTestId = await actions.submitTest();
    if (studentTestId) {
      onComplete(studentTestId);
    }
  }, [actions, onComplete]);

  // Load test when component mounts
  useEffect(() => {
    if (testId) {
      actions.loadTest(testId);
    }
  }, [testId, actions]);

  console.log("state in quiz store:", state);

  // Loading state
  if (state.isLoading) {
    return (
      <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Content className="p-6 flex items-center justify-center">
          <Spin size="large" />
          <Text className="ml-4">Đang tải bài kiểm tra...</Text>
        </Content>
      </Layout>
    );
  }

  // Error state
  if (state.error) {
    return (
      <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Content className="p-6 flex items-center justify-center">
          <Alert
            message="Lỗi tải bài kiểm tra"
            description={state.error}
            type="error"
            showIcon
            action={<Button onClick={onExit}>Quay lại</Button>}
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
      <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Content className="p-6 flex items-center justify-center">
          <Alert
            message="Không tìm thấy bài kiểm tra"
            description="Bài kiểm tra không tồn tại hoặc đã bị lỗi."
            type="error"
            showIcon
            action={<Button onClick={onExit}>Quay lại</Button>}
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

  // Get total answered questions count across all quizzes
  const getTotalAnsweredQuestions = () => {
    if (!state.testDetail?.quizzes) return 0;

    let count = 0;
    for (const quiz of state.testDetail.quizzes) {
      for (const question of quiz.questions) {
        const answers = state.answers[question.questionId];
        if (answers && answers.length > 0) {
          count++;
        }
      }
    }
    return count;
  };

  // Get total questions count across all quizzes
  const getTotalQuestionsCount = () => {
    if (!state.testDetail?.quizzes) return 0;

    return state.testDetail.quizzes.reduce(
      (total, quiz) => total + quiz.questions.length,
      0,
    );
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
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Content className="p-4 h-screen overflow-hidden">
        <Row gutter={16} className="w-full mx-auto h-full">
          {/* Left Sidebar - Quiz Navigation */}
          <Col span={8} className="h-full">
            <Card
              title="Danh sách Quiz"
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
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      quizIndex === state.currentQuizIndex
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => actions.goToQuiz(quizIndex)}
                  >
                    <div className="font-medium text-sm">{quiz.title}</div>
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
                        strokeColor="#1890ff"
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
                      strokeColor="#1890ff"
                      format={() => (
                        <span style={{ color: "#1890ff", fontWeight: "500" }}>
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
                      <Tag color="blue">
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

                <div className="space-y-3">
                  {currentQuestion.answers?.map((answer) => (
                    <div key={answer.answerId} className="w-full">
                      {isMultipleChoice ? (
                        <Checkbox
                          checked={selectedAnswers.includes(answer.answerId)}
                          onChange={() => handleAnswerChange(answer.answerId)}
                          className="w-full"
                        >
                          <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            {answer.answerText}
                          </div>
                        </Checkbox>
                      ) : (
                        <Radio
                          checked={selectedAnswers.includes(answer.answerId)}
                          onChange={() => handleAnswerChange(answer.answerId)}
                          className="w-full"
                        >
                          <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
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
  );
};

export default QuizTakingScreenNew;
