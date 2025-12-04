"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Typography, Radio, Checkbox, Spin } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import {
  Survey3FormValues,
  StudyHabitQuestion,
  StudyHabitAnswer,
} from "EduSmart/types";

const { Title, Paragraph, Text } = Typography;

interface Survey3StudyHabitsProps {
  initialData?: Survey3FormValues | null;
  onComplete: (data: Survey3FormValues) => void;
  onBack?: (data: Survey3FormValues) => void;
  isSubmitting?: boolean;
  habitSurveyDetail?: {
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
    questions?: Array<{
      questionId: string;
      questionText: string;
      questionType: number;
      answers: Array<{
        answerId: string;
        answerText: string;
        isCorrect: boolean;
      }>;
    }>;
  } | null;
}

const Survey3StudyHabits: React.FC<Survey3StudyHabitsProps> = ({
  initialData,
  onComplete,
  onBack,
  isSubmitting = false,
  habitSurveyDetail = null,
}) => {
  const [form] = Form.useForm();
  const [answers, setAnswers] = useState<StudyHabitAnswer[]>([]);

  // Transform API data to component format (no mock data fallback)
  const studyHabitQuestions: StudyHabitQuestion[] =
    habitSurveyDetail?.questions?.map((q) => ({
      id: q.questionId,
      questionText: q.questionText,
      questionType:
        q.questionType === 2
          ? "single_choice"
          : q.questionType === 4
            ? "single_choice"
            : q.questionType === 3
              ? "multiple_choice"
              : "single_choice",
      isRequired: true,
      allowMultiple: q.questionType === 3,
      answers: q.answers.map((a) => ({
        id: a.answerId,
        answerText: a.answerText,
        value: a.answerId,
      })),
    })) || [];

  useEffect(() => {
    if (initialData) {
      setAnswers(initialData.studyHabits);
      // Set form values for display
      const formValues: Record<string, string[]> = {};
      initialData.studyHabits.forEach((answer) => {
        formValues[answer.questionId] = answer.selectedAnswers;
      });
      form.setFieldsValue(formValues);
    }
  }, [initialData, form]);

  const handleAnswerChange = (
    questionId: string,
    selectedAnswers: string[],
  ) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId);
      const newAnswer: StudyHabitAnswer = {
        questionId,
        selectedAnswers,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const onFinish = () => {
    const result: Survey3FormValues = {
      studyHabits: answers,
    };
    // Scroll to top before completing
    onComplete(result);
  };

  const handleBack = () => {
    if (onBack) {
      const currentData: Survey3FormValues = {
        studyHabits: answers,
      };
      onBack(currentData);
    }
  };

  // Helper: check form complete
  const isFormComplete = () => {
    return studyHabitQuestions.every((q) => {
      const ans = answers.find((a) => a.questionId === q.id);
      return ans && ans.selectedAnswers.length > 0;
    });
  };

  // UI render cho từng câu hỏi (card nhỏ, số thứ tự, đáp án dạng card)
  const renderStudyHabitQuestion = (
    question: StudyHabitQuestion,
    index: number,
  ) => {
    const currentAnswer = answers.find((a) => a.questionId === question.id);
    const isSingle = question.questionType === "single_choice";
    const isMultiple = question.questionType === "multiple_choice";

    return (
      <Card
        key={question.id}
        className="!mb-5 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800/50"
      >
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-8 bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md">
              {index + 1}
            </div>
            <div className="flex-1">
              <Title
                level={4}
                className="!mb-0 !text-lg !font-semibold text-gray-800 dark:text-gray-100 leading-tight"
              >
                {question.questionText}
              </Title>
            </div>
          </div>
          {/* Đáp án dạng card nhỏ */}
          {isSingle && (
            <Radio.Group
              value={currentAnswer?.selectedAnswers[0]}
              onChange={(e) =>
                handleAnswerChange(question.id, [e.target.value])
              }
              className="w-full"
            >
              <div className="grid">
                {question.answers.map((answer) => (
                  <Radio
                    key={answer.id}
                    value={answer.value}
                    className="!m-0 w-full group"
                  >
                    <div
                      className={`w-full px-3 py-5 rounded-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.01] ${
                        currentAnswer?.selectedAnswers[0] === answer.value
                          ? "border-[#49BBBD] bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 shadow-md"
                          : "border-gray-200 dark:border-gray-600 hover:border-[#49BBBD] hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Text
                          className={`text-sm font-medium ${
                            currentAnswer?.selectedAnswers[0] === answer.value
                              ? "text-[#49BBBD] dark:text-[#5fd4d6]"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {answer.answerText}
                        </Text>
                      </div>
                    </div>
                  </Radio>
                ))}
              </div>
            </Radio.Group>
          )}
          {isMultiple && (
            <Checkbox.Group
              value={currentAnswer?.selectedAnswers || []}
              onChange={(values) =>
                handleAnswerChange(question.id, values as string[])
              }
              className="w-full"
            >
              <div className="grid">
                {question.answers.map((answer) => (
                  <Checkbox
                    key={answer.id}
                    value={answer.value}
                    className="!m-0 w-full group"
                  >
                    <div
                      className={`w-full px-3 py-5 rounded-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.01] ${
                        currentAnswer?.selectedAnswers.includes(answer.value)
                          ? "border-[#49BBBD] bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 shadow-md"
                          : "border-gray-200 dark:border-gray-600 hover:border-[#49BBBD] hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Text
                          className={`text-sm font-medium ${
                            currentAnswer?.selectedAnswers.includes(
                              answer.value,
                            )
                              ? "text-[#49BBBD] dark:text-[#5fd4d6]"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {answer.answerText}
                        </Text>
                      </div>
                    </div>
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          )}
        </div>
      </Card>
    );
  };

  return (
    <Spin spinning={isSubmitting} tip="Đang xử lý khảo sát...">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Survey Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:bg-teal-900/30 rounded-full mb-4">
              {/* <span className="text-2xl">📚</span> */}
              <span className="text-2xl">📔</span>
            </div>
            <Title
              level={1}
              className="!mb-3 !text-3xl text-gray-800 dark:text-gray-100"
            >
              Thói quen học tập
            </Title>
            <Paragraph className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Giúp chúng tôi hiểu cách bạn học tập hiệu quả nhất
            </Paragraph>
          </div>

          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            disabled={isSubmitting}
          >
            {/* Survey Questions */}
            <div className="space-y-4">
              {studyHabitQuestions.map((question, index) =>
                renderStudyHabitQuestion(question, index),
              )}
            </div>

            {/* <Divider className="my-8 border-gray-200 dark:border-gray-600" /> */}

            <div className="flex justify-between mt-8 pt-6 border-gray-100 dark:border-gray-700">
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                size="large"
                className="px-6 py-3 h-auto rounded-xl border-gray-200 hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
              >
                Quay lại
              </Button>

              <Button
                type="primary"
                icon={<CheckOutlined />}
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                disabled={!isFormComplete() || isSubmitting}
                className={`px-8 py-3 h-auto rounded-xl ${isFormComplete() && `!bg-gradient-to-r from-[#49BBBD] to-cyan-600 hover:from-[#3da8aa] hover:to-cyan-700`}  border-0 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {isSubmitting ? "Đang lưu..." : "Tiếp tục"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default Survey3StudyHabits;
