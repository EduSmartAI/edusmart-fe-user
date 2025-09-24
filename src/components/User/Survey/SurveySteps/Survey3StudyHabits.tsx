"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Typography, Radio, Checkbox } from "antd";
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
  onBack?: () => void;
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
  habitSurveyDetail = null,
}) => {
  const [form] = Form.useForm();
  const [answers, setAnswers] = useState<StudyHabitAnswer[]>([]);

  // Transform API data to component format
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
    })) || [
      // Fallback mock data if API data is not available
      {
        id: "time_preference",
        questionText: "Bạn thích học vào thời gian nào trong ngày?",
        questionType: "single_choice",
        isRequired: true,
        allowMultiple: false,
        answers: [
          {
            id: "morning",
            answerText: "Buổi sáng (6:00 - 12:00)",
            value: "morning",
          },
          {
            id: "afternoon",
            answerText: "Buổi chiều (12:00 - 18:00)",
            value: "afternoon",
          },
          {
            id: "evening",
            answerText: "Buổi tối (18:00 - 22:00)",
            value: "evening",
          },
          {
            id: "night",
            answerText: "Buổi đêm (22:00 - 6:00)",
            value: "night",
          },
        ],
      },
      {
        id: "study_duration",
        questionText:
          "Thời gian học liên tục hiệu quả nhất với bạn là bao lâu?",
        questionType: "single_choice",
        isRequired: true,
        allowMultiple: false,
        answers: [
          { id: "15_30", answerText: "15-30 phút", value: "15_30" },
          { id: "30_60", answerText: "30-60 phút", value: "30_60" },
          { id: "60_90", answerText: "1-1.5 giờ", value: "60_90" },
          { id: "90_120", answerText: "1.5-2 giờ", value: "90_120" },
          { id: "120_plus", answerText: "Hơn 2 giờ", value: "120_plus" },
        ],
      },
      {
        id: "learning_style",
        questionText:
          "Phương pháp học nào hiệu quả nhất với bạn? (Có thể chọn nhiều)",
        questionType: "multiple_choice",
        isRequired: true,
        allowMultiple: true,
        answers: [
          {
            id: "visual",
            answerText: "Học qua hình ảnh, video",
            value: "visual",
          },
          {
            id: "audio",
            answerText: "Nghe giải thích, podcast",
            value: "audio",
          },
          {
            id: "hands_on",
            answerText: "Thực hành trực tiếp",
            value: "hands_on",
          },
          { id: "reading", answerText: "Đọc tài liệu, sách", value: "reading" },
          {
            id: "discussion",
            answerText: "Thảo luận với người khác",
            value: "discussion",
          },
          {
            id: "note_taking",
            answerText: "Ghi chép, tóm tắt",
            value: "note_taking",
          },
        ],
      },
      {
        id: "difficulty_preference",
        questionText: "Bạn thích tiếp cận kiến thức mới như thế nào?",
        questionType: "single_choice",
        isRequired: true,
        allowMultiple: false,
        answers: [
          {
            id: "easy_to_hard",
            answerText: "Từ dễ đến khó, từng bước một",
            value: "easy_to_hard",
          },
          {
            id: "challenge_first",
            answerText: "Thử thách ngay từ đầu",
            value: "challenge_first",
          },
          { id: "mixed", answerText: "Kết hợp cả hai", value: "mixed" },
          {
            id: "depends",
            answerText: "Tùy thuộc vào chủ đề",
            value: "depends",
          },
        ],
      },
      {
        id: "motivation_factors",
        questionText: "Điều gì thúc đẩy bạn học tập? (Có thể chọn nhiều)",
        questionType: "multiple_choice",
        isRequired: true,
        allowMultiple: true,
        answers: [
          {
            id: "career_goals",
            answerText: "Mục tiêu nghề nghiệp",
            value: "career_goals",
          },
          { id: "curiosity", answerText: "Sự tò mò", value: "curiosity" },
          {
            id: "competition",
            answerText: "Cạnh tranh với bạn bè",
            value: "competition",
          },
          {
            id: "achievement",
            answerText: "Cảm giác hoàn thành",
            value: "achievement",
          },
          {
            id: "practical_use",
            answerText: "Ứng dụng thực tế",
            value: "practical_use",
          },
          {
            id: "recognition",
            answerText: "Sự công nhận",
            value: "recognition",
          },
        ],
      },
      {
        id: "study_environment",
        questionText: "Môi trường học tập lý tưởng của bạn là gì?",
        questionType: "single_choice",
        isRequired: true,
        allowMultiple: false,
        answers: [
          {
            id: "quiet_alone",
            answerText: "Yên tĩnh, một mình",
            value: "quiet_alone",
          },
          {
            id: "music_background",
            answerText: "Có nhạc nền nhẹ",
            value: "music_background",
          },
          { id: "group_study", answerText: "Học nhóm", value: "group_study" },
          {
            id: "cafe_library",
            answerText: "Quán cà phê, thư viện",
            value: "cafe_library",
          },
          {
            id: "flexible",
            answerText: "Linh hoạt, thay đổi",
            value: "flexible",
          },
        ],
      },
    ]; // End fallback data

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
    window.scrollTo({ top: 0, behavior: "smooth" });
    onComplete(result);
  };

  const handleBack = () => {
    // Scroll to top before going back
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onBack) {
      onBack();
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
        className="mb-5 border-0 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow:
            "0 2px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)",
        }}
      >
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md">
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
              <div className="grid gap-3">
                {question.answers.map((answer) => (
                  <Radio
                    key={answer.id}
                    value={answer.value}
                    className="!m-0 w-full group"
                  >
                    <div
                      className={`w-full p-3 rounded-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.01] ${
                        currentAnswer?.selectedAnswers[0] === answer.value
                          ? "border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Text
                          className={`text-sm font-medium ${
                            currentAnswer?.selectedAnswers[0] === answer.value
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-200"
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
              <div className="grid gap-3">
                {question.answers.map((answer) => (
                  <Checkbox
                    key={answer.id}
                    value={answer.value}
                    className="!m-0 w-full group"
                  >
                    <div
                      className={`w-full p-3 rounded-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.01] ${
                        currentAnswer?.selectedAnswers.includes(answer.value)
                          ? "border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Text
                          className={`text-sm font-medium ${
                            currentAnswer?.selectedAnswers.includes(
                              answer.value,
                            )
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-200"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Survey Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="text-2xl">📚</span>
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

        <Form form={form} onFinish={onFinish} layout="vertical" size="large">
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
              disabled={!isFormComplete()}
              className="px-8 py-3 h-auto rounded-xl bg-blue-600 hover:bg-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Hoàn thành khảo sát
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Survey3StudyHabits;
