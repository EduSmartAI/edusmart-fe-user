"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Radio,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Spin,
} from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  Survey1FormValues,
  SemesterOption,
  LearningGoalOption,
  InterestSurveyQuestion,
  InterestSurveyAnswer,
} from "EduSmart/types";

const { Title, Text, Paragraph } = Typography;

interface Survey1BasicInfoProps {
  initialData?: Survey1FormValues | null;
  onComplete: (data: Survey1FormValues) => void;
  onBack?: (data: Survey1FormValues) => void;
  semesters?: Array<{
    semesterId: string;
    semesterName: string;
    semesterNumber: number;
  }>;
  majors?: Array<{
    majorId: string;
    majorName: string;
    majorCode: string;
    parentMajorId?: string;
  }>;
  learningGoals?: Array<{
    learningGoalId: string;
    learningGoalName: string;
    learningGoalType: number;
  }>;
  interestSurveyDetail?: {
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
  isLoading?: boolean;
}

const Survey1BasicInfo: React.FC<Survey1BasicInfoProps> = ({
  initialData,
  onComplete,
  onBack,
  semesters = [],
  majors = [],
  learningGoals = [],
  interestSurveyDetail = null,
  isLoading = false,
}) => {
  const [form] = Form.useForm<Survey1FormValues>();

  const [currentSemester, setCurrentSemester] = useState<string>();
  const [selectedMajor, setSelectedMajor] = useState<string>();
  const [selectedLearningGoal, setSelectedLearningGoal] = useState<string>();
  const [interestSurveyAnswers, setInterestSurveyAnswers] = useState<
    InterestSurveyAnswer[]
  >([]);

  // Chỉ sử dụng questions từ API (không dùng mock data)
  const interestSurveyQuestions: InterestSurveyQuestion[] =
    interestSurveyDetail?.questions || [];

  // Transform API data to component format
  const semesterOptions: SemesterOption[] = semesters.map((semester) => ({
    label: semester.semesterName,
    value: semester.semesterId,
  }));

  // Separate major (parent) and specialization (child) data
  const majorOptions = majors
    .filter(
      (major) =>
        major.parentMajorId === null || major.parentMajorId === undefined,
    )
    .map((major) => ({
      label: major.majorName,
      value: major.majorId,
    }));

  const getSpecializationOptions = (selectedMajorId: string) => {
    return majors
      .filter((major) => major.parentMajorId === selectedMajorId)
      .map((major) => ({
        label: major.majorName,
        value: major.majorId,
      }));
  };

  const learningGoalOptions: LearningGoalOption[] = learningGoals.map(
    (goal) => ({
      label: goal.learningGoalName,
      value: goal.learningGoalId,
    }),
  );

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setCurrentSemester(initialData.semester);
      setSelectedMajor(initialData.major);
      setSelectedLearningGoal(initialData.learningGoal);

      // Set initial interest survey answers if available
      if (initialData.interestSurveyAnswers) {
        setInterestSurveyAnswers(initialData.interestSurveyAnswers);
      }
    }
  }, [initialData, form]);

  const handleSemesterChange = (value: string) => {
    setCurrentSemester(value);
    // Find semester number from API data
    const selectedSemester = semesters.find((s) => s.semesterId === value);
    // Clear specialization khi chuyển từ semester > 4 về <= 4
    if (selectedSemester && selectedSemester.semesterNumber <= 4) {
      form.setFieldValue("specialization", undefined);
    }
  };

  const handleMajorChange = (value: string) => {
    setSelectedMajor(value);
    // Clear specialization when major changes
    form.setFieldValue("specialization", undefined);
  };

  const handleLearningGoalChange = (value: string) => {
    setSelectedLearningGoal(value);
    // Clear interest survey answers when learning goal changes
    setInterestSurveyAnswers([]);
  };

  const onFinish = (values: Survey1FormValues) => {
    // Old: Chỉ validate khảo sát sở thích INTEREST khi learning goal là "Chưa có định hướng"

    // New: Luôn yêu cầu hoàn thành khảo sát INTEREST nếu có.
    if (shouldShowInterestSurvey()) {
      if (interestSurveyAnswers.length < interestSurveyQuestions.length) {
        // Show a more user-friendly notification
        const unansweredCount =
          interestSurveyQuestions.length - interestSurveyAnswers.length;
        alert(
          `⚠️ Vui lòng hoàn thành thêm ${unansweredCount} câu hỏi khảo sát sở thích để tiếp tục!`,
        );
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 🔍 DEBUG: Log Survey 1 data trước khi gửi
      const survey1Payload = {
        ...values,
        interestSurveyAnswers,
      };
      console.group("📋 [SURVEY 1] Data being sent");
      console.log("Form Values:", values);
      console.log(
        "Interest Survey Answers Count:",
        interestSurveyAnswers.length,
      );
      console.log("Interest Survey Answers:", interestSurveyAnswers);
      console.log("Complete Survey 1 Payload:", survey1Payload);
      console.groupEnd();

      // Gửi data với interestSurveyAnswers
      onComplete(survey1Payload);
    }
    // else {
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    //   // Gửi data bình thường
    //   onComplete({
    //     ...values,
    //   });
    // }
  };

  const handleBack = () => {
    // Gửi data hiện tại trước khi back
    if (onBack) {
      const currentFormData = form.getFieldsValue();
      const backupData: Survey1FormValues = {
        ...currentFormData,
        interestSurveyAnswers,
      };
      onBack(backupData);
    }
  };

  // Chỉ hiển thị specialization khi semester > 4
  const shouldShowSpecialization = () => {
    if (!currentSemester || !selectedMajor) return false;
    const selectedSemester = semesters.find(
      (s) => s.semesterId === currentSemester,
    );
    // Chỉ hiển thị specialization khi semester > 4
    if (!selectedSemester || selectedSemester.semesterNumber <= 4) return false;
    const hasSpecializations =
      getSpecializationOptions(selectedMajor).length > 0;
    return hasSpecializations;
  };

  // Old: Chỉ hiển thị khảo sát sở thích INTEREST nếu chọn learning goal "Chưa có định hướng"
  // New: Luôn hiển thị khảo sát sở thích INTEREST bất kể định hướng gì
  const shouldShowInterestSurvey = () => {
    // // Hiển thị khảo sát sở thích INTEREST chỉ khi learning goal là "Chưa có định hướng"
    // if (!selectedLearningGoal) return false;
    // const selectedGoal = learningGoals.find(
    //   (g) => g.learningGoalId === selectedLearningGoal,
    // );
    // return (
    //   selectedGoal && selectedGoal.learningGoalName === "Chưa có định hướng"
    // );
    // Chỉ cần có learning goal được chọn và có câu hỏi
    // return !!selectedLearningGoal && interestSurveyQuestions.length > 0;
    return true;
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
        className="!mb-5 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800/50"
      >
        <div className="p-5">
          {/* Question Header */}
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

          {/* Answer Options */}
          <Radio.Group
            value={selectedAnswer?.selectedAnswerId}
            onChange={(e) =>
              handleInterestSurveyAnswer(question.questionId, e.target.value)
            }
            className="w-full"
          >
            <div className="grid">
              {question.answers.map((answer) => (
                <Radio
                  key={answer.answerId}
                  value={answer.answerId}
                  className="!m-0 w-full group"
                >
                  <div
                    className={`w-full px-3 py-5 rounded-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.01] ${
                      selectedAnswer?.selectedAnswerId === answer.answerId
                        ? "border-[#49BBBD] bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 shadow-md"
                        : "border-gray-200 dark:border-gray-600 hover:border-[#49BBBD] hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Text
                        className={`text-sm font-medium ${
                          selectedAnswer?.selectedAnswerId === answer.answerId
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
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:bg-teal-900/30 rounded-full mb-4">
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
                      options={semesterOptions}
                      onChange={handleSemesterChange}
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="major"
                    label={
                      <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Khối ngành
                      </span>
                    }
                    rules={[
                      { required: true, message: "Vui lòng chọn chuyên ngành" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn khối ngành"
                      options={majorOptions}
                      onChange={handleMajorChange}
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
                          Chuyên ngành hẹp
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn chuyên ngành hẹp",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn chuyên ngành hẹp"
                        options={
                          selectedMajor
                            ? getSpecializationOptions(selectedMajor)
                            : []
                        }
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
                <Radio.Group
                  onChange={(e) => handleLearningGoalChange(e.target.value)}
                  className="w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learningGoalOptions.map((goal) => (
                      <Radio
                        key={goal.value}
                        value={goal.value}
                        className="!m-0 w-full"
                      >
                        <div
                          className={`w-full px-4 py-3 rounded-lg cursor-pointer  ${
                            selectedLearningGoal === goal.value
                              ? "border-[#49BBBD] bg-teal-50 dark:bg-teal-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800"
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              selectedLearningGoal === goal.value
                                ? "text-[#49BBBD] dark:text-teal-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {goal.label}
                          </Text>
                        </div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>

              {shouldShowInterestSurvey() && (
                <Divider className="my-8 border-gray-200 dark:border-gray-600" />
              )}

              {shouldShowInterestSurvey() && (
                <div className="mb-6">
                  {/* Survey Header */}
                  <div className="text-center mb-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#49BBBD] to-cyan-600 rounded-full mb-4 shadow-md">
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
                      của bạn. Thông tin này giúp hệ thống đề xuất lộ trình học
                      tập phù hợp nhất.
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
                                  ? "bg-[#49BBBD]"
                                  : "bg-gray-300"
                            }`}
                          />
                          <Text className="text-xs font-bold text-[#49BBBD] dark:text-cyan-400">
                            {interestSurveyAnswers.length}/
                            {interestSurveyQuestions.length}
                          </Text>
                        </div>
                      </div>
                      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#49BBBD] to-cyan-600 rounded-full transition-all duration-500 ease-out shadow-sm"
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

              <div className="flex justify-end mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                {/* <Button
                  type="default"
                  onClick={handleBack}
                  icon={<ArrowLeftOutlined />}
                  disabled={!onBack}
                  size="large"
                  className="px-6 py-3 h-auto rounded-xl border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 dark:hover:text-red-400 transition-all duration-200"
                >
                  Thoát
                </Button> */}

                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  htmlType="submit"
                  size="large"
                  className="px-8 py-3 h-auto rounded-xl !bg-gradient-to-r from-[#49BBBD] to-cyan-600 hover:from-[#3da8aa] hover:to-cyan-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
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
