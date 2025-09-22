"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Divider,
} from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  Survey1FormValues,
  SemesterOption,
  SpecializationOption,
  LearningGoalOption,
  InterestSurveyQuestion,
  InterestSurveyAnswer,
} from "EduSmart/types/survey";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Survey1BasicInfoProps {
  initialData?: Survey1FormValues | null;
  onComplete: (data: Survey1FormValues) => void;
  onBack?: () => void;
}

const Survey1BasicInfo: React.FC<Survey1BasicInfoProps> = ({
  initialData,
  onComplete,
  onBack,
}) => {
  const [form] = Form.useForm<Survey1FormValues>();
  const [hasFutureOrientation, setHasFutureOrientation] = useState<
    boolean | undefined
  >();
  const [currentSemester, setCurrentSemester] = useState<string>();
  const [interestSurveyAnswers, setInterestSurveyAnswers] = useState<
    InterestSurveyAnswer[]
  >([]);

  // Mock data cho câu hỏi khảo sát sở thích
  const interestSurveyQuestions: InterestSurveyQuestion[] = [
    {
      questionId: "e54e26de-45a5-42c6-8052-3db027fb74be",
      questionText: "Bạn có thể dành bao nhiêu giờ học mỗi ngày?",
      questionType: 4,
      answers: [
        {
          answerId: "308fa63c-7395-4357-820e-3a5c699d2d0c",
          answerText: "1-2 giờ/ngày",
          isCorrect: false,
        },
        {
          answerId: "55051f4c-0a2c-4fe4-93d1-358b1420b898",
          answerText: "3-4 giờ/ngày",
          isCorrect: false,
        },
        {
          answerId: "d98244d8-235a-4b76-bed1-bdcbda2e3831",
          answerText: "5-6 giờ/ngày",
          isCorrect: false,
        },
        {
          answerId: "6cc61bcd-29ef-4380-8677-460504d1bb6c",
          answerText: "Trên 6 giờ/ngày",
          isCorrect: false,
        },
      ],
    },
    {
      questionId: "a12b34cd-56ef-78gh-90ij-1234567890kl",
      questionText: "Bạn thích học theo phương pháp nào nhất?",
      questionType: 4,
      answers: [
        {
          answerId: "answer1-study-method",
          answerText: "Học lý thuyết trước, thực hành sau",
          isCorrect: false,
        },
        {
          answerId: "answer2-study-method",
          answerText: "Học qua dự án thực tế",
          isCorrect: false,
        },
        {
          answerId: "answer3-study-method",
          answerText: "Học theo nhóm, thảo luận",
          isCorrect: false,
        },
        {
          answerId: "answer4-study-method",
          answerText: "Tự học, nghiên cứu độc lập",
          isCorrect: false,
        },
      ],
    },
    {
      questionId: "b23c45de-67fg-89hi-01jk-2345678901mn",
      questionText: "Lĩnh vực công nghệ nào bạn quan tâm nhất?",
      questionType: 4,
      answers: [
        {
          answerId: "answer1-tech-field",
          answerText: "Phát triển Web (Frontend/Backend)",
          isCorrect: false,
        },
        {
          answerId: "answer2-tech-field",
          answerText: "Phát triển Mobile App",
          isCorrect: false,
        },
        {
          answerId: "answer3-tech-field",
          answerText: "Trí tuệ nhân tạo & Machine Learning",
          isCorrect: false,
        },
        {
          answerId: "answer4-tech-field",
          answerText: "Khoa học dữ liệu & Analytics",
          isCorrect: false,
        },
      ],
    },
    {
      questionId: "c34d56ef-78gh-90ij-12kl-3456789012no",
      questionText: "Môi trường làm việc nào bạn thích nhất?",
      questionType: 4,
      answers: [
        {
          answerId: "answer1-work-env",
          answerText: "Công ty lớn, ổn định",
          isCorrect: false,
        },
        {
          answerId: "answer2-work-env",
          answerText: "Startup, năng động",
          isCorrect: false,
        },
        {
          answerId: "answer3-work-env",
          answerText: "Freelance, tự do",
          isCorrect: false,
        },
        {
          answerId: "answer4-work-env",
          answerText: "Remote, làm việc từ xa",
          isCorrect: false,
        },
      ],
    },
    {
      questionId: "d45e67fg-89hi-01jk-23lm-4567890123op",
      questionText: "Yếu tố nào quan trọng nhất với bạn khi chọn ngành nghề?",
      questionType: 4,
      answers: [
        {
          answerId: "answer1-career-factor",
          answerText: "Mức lương cao",
          isCorrect: false,
        },
        {
          answerId: "answer2-career-factor",
          answerText: "Sự phát triển và học hỏi",
          isCorrect: false,
        },
        {
          answerId: "answer3-career-factor",
          answerText: "Work-life balance",
          isCorrect: false,
        },
        {
          answerId: "answer4-career-factor",
          answerText: "Tác động xã hội tích cực",
          isCorrect: false,
        },
      ],
    },
  ];

  // Mock data - sẽ thay thế bằng API calls sau
  const semesters: SemesterOption[] = [
    { label: "Kỳ 1", value: "semester_1" },
    { label: "Kỳ 2", value: "semester_2" },
    { label: "Kỳ 3", value: "semester_3" },
    { label: "Kỳ 4", value: "semester_4" },
    { label: "Kỳ 5", value: "semester_5" },
    { label: "Kỳ 6", value: "semester_6" },
    { label: "Kỳ 7", value: "semester_7" },
    { label: "Kỳ 8", value: "semester_8" },
  ];

  const specializations: SpecializationOption[] = [
    { label: "Phát triển Web", value: "web_development" },
    { label: "Phát triển Mobile", value: "mobile_development" },
    { label: "Trí tuệ nhân tạo", value: "artificial_intelligence" },
    { label: "Khoa học dữ liệu", value: "data_science" },
    { label: "Bảo mật thông tin", value: "cybersecurity" },
    { label: "DevOps", value: "devops" },
    { label: "Game Development", value: "game_development" },
  ];

  const learningGoals: LearningGoalOption[] = [
    { label: "Cải thiện kỹ năng lập trình", value: "improve_programming" },
    { label: "Chuẩn bị cho thực tập", value: "prepare_internship" },
    { label: "Chuẩn bị cho việc làm", value: "prepare_job" },
    { label: "Phát triển dự án cá nhân", value: "personal_project" },
    { label: "Học công nghệ mới", value: "learn_new_tech" },
    { label: "Đạt chứng chỉ", value: "get_certification" },
  ];

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setHasFutureOrientation(initialData.hasFutureOrientation);
      setCurrentSemester(initialData.semester);

      // Set initial interest survey answers if available
      if (initialData.interestSurveyAnswers) {
        setInterestSurveyAnswers(initialData.interestSurveyAnswers);
      }
    }
  }, [initialData, form]);

  const handleFutureOrientationChange = (value: boolean) => {
    setHasFutureOrientation(value);
    // Reset related fields when switching
    if (value) {
      form.setFieldValue("interests", undefined);
      setInterestSurveyAnswers([]); // Clear survey answers
    } else {
      form.setFieldValue("futureOrientation", undefined);
    }
  };

  const handleSemesterChange = (value: string) => {
    setCurrentSemester(value);
    // Reset specialization if moving to earlier semester
    const semesterNumber = parseInt(value.split("_")[1]);
    if (semesterNumber <= 4) {
      form.setFieldValue("specialization", undefined);
    }
  };

  const onFinish = (values: Survey1FormValues) => {
    // Nếu user chọn "chưa có định hướng", cần validate khảo sát sở thích
    if (hasFutureOrientation === false) {
      if (interestSurveyAnswers.length < interestSurveyQuestions.length) {
        // Show a more user-friendly notification
        const unansweredCount =
          interestSurveyQuestions.length - interestSurveyAnswers.length;
        alert(
          `⚠️ Vui lòng hoàn thành thêm ${unansweredCount} câu hỏi khảo sát để tiếp tục!`,
        );
        return;
      }
      // Gửi data với interestSurveyAnswers
      onComplete({
        ...values,
        interestSurveyAnswers,
      });
    } else {
      // Gửi data bình thường với futureOrientation
      onComplete(values);
    }
  };

  const shouldShowSpecialization = () => {
    if (!currentSemester) return false;
    const semesterNumber = parseInt(currentSemester.split("_")[1]);
    return semesterNumber > 4;
  };

  const handleInterestSurveyAnswer = (questionId: string, answerId: string) => {
    setInterestSurveyAnswers((prev) => {
      const existing = prev.find((answer) => answer.questionId === questionId);
      if (existing) {
        return prev.map((answer) =>
          answer.questionId === questionId
            ? { ...answer, selectedAnswerId: answerId }
            : answer,
        );
      } else {
        return [...prev, { questionId, selectedAnswerId: answerId }];
      }
    });
  };

  const renderInterestSurveyQuestion = (
    question: InterestSurveyQuestion,
    index: number,
  ) => {
    const selectedAnswer = interestSurveyAnswers.find(
      (answer) => answer.questionId === question.questionId,
    );

    return (
      <Card
        key={question.questionId}
        className="mb-5 border-0 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow:
            "0 2px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)",
        }}
      >
        <div className="p-5">
          {/* Question Header */}
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

          {/* Answer Options */}
          <Radio.Group
            value={selectedAnswer?.selectedAnswerId}
            onChange={(e) =>
              handleInterestSurveyAnswer(question.questionId, e.target.value)
            }
            className="w-full"
          >
            <div className="grid gap-3">
              {question.answers.map((answer, answerIndex) => (
                <Radio
                  key={answer.answerId}
                  value={answer.answerId}
                  className="!m-0 w-full group"
                >
                  <div
                    className={`w-full p-3 rounded-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.01] ${
                      selectedAnswer?.selectedAnswerId === answer.answerId
                        ? "border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow"
                        : "border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Text
                        className={`text-sm font-medium ${
                          selectedAnswer?.selectedAnswerId === answer.answerId
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
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <Title
            level={1}
            className="!mb-3 !text-3xl text-gray-800 dark:text-gray-100"
          >
            Thông tin cơ bản & Định hướng nghề nghiệp
          </Title>
          <Paragraph className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hãy cho chúng tôi biết về bạn để có thể đưa ra gợi ý phù hợp nhất
          </Paragraph>
        </div>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
              requiredMark={false}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="semester"
                    label={
                      <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Bạn đang học kỳ thứ mấy?
                      </span>
                    }
                    rules={[
                      { required: true, message: "Vui lòng chọn kỳ học" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn kỳ học"
                      options={semesters}
                      onChange={handleSemesterChange}
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>

                {shouldShowSpecialization() && (
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="specialization"
                      label={
                        <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                          Chuyên ngành hẹp bạn quan tâm
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn chuyên ngành",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn chuyên ngành"
                        options={specializations}
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>

              <Form.Item
                name="learningGoal"
                label={
                  <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Mục tiêu học tập chính của bạn là gì?
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng chọn mục tiêu học tập" },
                ]}
              >
                <Select
                  placeholder="Chọn mục tiêu học tập"
                  options={learningGoals}
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Divider className="my-8 border-gray-200 dark:border-gray-600" />

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
                <Form.Item
                  name="hasFutureOrientation"
                  label={
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Bạn đã có định hướng rõ ràng cho tương lai chưa?
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn một tùy chọn" },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) =>
                      handleFutureOrientationChange(e.target.value)
                    }
                    className="mt-4"
                  >
                    <Space direction="vertical" size="large" className="w-full">
                      <Radio
                        value={true}
                        className="p-4 rounded-xl border border-transparent hover:border-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        <span className="text-base font-medium">
                          Có, tôi đã có định hướng rõ ràng
                        </span>
                      </Radio>
                      <Radio
                        value={false}
                        className="p-4 rounded-xl border border-transparent hover:border-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        <span className="text-base font-medium">
                          Chưa, tôi cần tìm hiểu thêm
                        </span>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>

              {hasFutureOrientation === true && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
                  <Form.Item
                    name="futureOrientation"
                    label={
                      <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Mô tả định hướng tương lai của bạn
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng mô tả định hướng của bạn",
                      },
                      { max: 500, message: "Tối đa 500 ký tự" },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Ví dụ: Tôi muốn trở thành một Frontend Developer, làm việc với React và TypeScript..."
                      showCount
                      maxLength={500}
                      className="rounded-lg resize-none"
                    />
                  </Form.Item>
                </div>
              )}

              {hasFutureOrientation === false && (
                <div className="mb-6">
                  {/* Survey Header */}
                  <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-md">
                      <span className="text-xl">📋</span>
                    </div>
                    <Title
                      level={3}
                      className="!mb-2 !text-xl !font-bold text-gray-800 dark:text-gray-100"
                    >
                      Khảo sát sở thích học tập
                    </Title>
                    <Paragraph className="!text-base !text-gray-600 dark:text-gray-300 !mb-4 max-w-2xl mx-auto leading-relaxed">
                      Hãy trả lời các câu hỏi dưới đây để chúng tôi hiểu rõ hơn
                      về sở thích, phong cách học tập và mục tiêu nghề nghiệp
                      của bạn
                    </Paragraph>
                    {/* Progress Indicator */}
                    <div className="max-w-md mx-auto">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Tiến độ hoàn thành
                        </Text>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              interestSurveyAnswers.length ===
                              interestSurveyQuestions.length
                                ? "bg-green-500"
                                : interestSurveyAnswers.length > 0
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                            }`}
                          />
                          <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {interestSurveyAnswers.length}/
                            {interestSurveyQuestions.length}
                          </Text>
                        </div>
                      </div>
                      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                          style={{
                            width: `${(interestSurveyAnswers.length / interestSurveyQuestions.length) * 100}%`,
                          }}
                        />
                        {/* Progress segments */}
                        {Array.from({
                          length: interestSurveyQuestions.length - 1,
                        }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 w-px h-full bg-white dark:bg-gray-800"
                            style={{
                              left: `${((i + 1) / interestSurveyQuestions.length) * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                      {interestSurveyAnswers.length ===
                        interestSurveyQuestions.length && (
                        <div className="mt-2 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                          <span className="text-xs">✅</span>
                          <Text className="text-xs font-medium">
                            Hoàn thành khảo sát!
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Survey Questions */}
                  <div className="space-y-4">
                    {interestSurveyQuestions.map((question, index) =>
                      renderInterestSurveyQuestion(question, index),
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  onClick={onBack}
                  disabled={!onBack}
                  size="large"
                  className="px-6 py-3 h-auto rounded-xl border-gray-200 hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
                >
                  Quay lại
                </Button>

                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  htmlType="submit"
                  size="large"
                  className="px-8 py-3 h-auto rounded-xl bg-blue-600 hover:bg-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Tiếp tục
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Survey1BasicInfo;
