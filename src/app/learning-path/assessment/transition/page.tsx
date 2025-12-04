"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Spin,
  Alert,
  Checkbox,
  Space,
  Modal,
  Table,
  Tag,
  Collapse,
  Upload,
} from "antd";
import { FiCheckCircle, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import { SiQuizlet } from "react-icons/si";
import { HiDocumentText } from "react-icons/hi";
import { LearningPathGuard } from "EduSmart/components/LearningPath";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";
import { getStudentTranscriptServer } from "EduSmart/app/(student)/studentAction";
import {
  getLearningGoalAction,
  getSurveyByCodeAction,
} from "EduSmart/app/(survey)/surveyAction";
import { useSurveyStore } from "EduSmart/stores/Survey/SurveyStore";
import type { OtherQuestionCode } from "EduSmart/api/api-quiz-service";
import type { ColumnsType } from "antd/es/table";
import type { RcFile } from "antd/es/upload";
import type { StudentTranscriptRecord } from "EduSmart/app/(student)/studentAction";
import { useNotification } from "EduSmart/Provider/NotificationProvider";
import { uploadTranscriptClient } from "EduSmart/hooks/api-client/studentApiClient";

interface LearningGoalOption {
  learningGoalId: string;
  learningGoalName: string;
  learningGoalType: number;
}

interface OtherQuestion {
  otherQuestionCode: number;
  otherQuestionText: string;
}

function SurveyToQuizTransitionContent() {
  const messageApi = useNotification();

  const router = useRouter();
  const searchParams = useSearchParams();
  const { submitSurvey } = useSurveyStore(); // ✅ Get submitSurvey from store
  const [selectedOption, setSelectedOption] = useState<
    "quiz" | "transcript" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTranscript, setHasTranscript] = useState<boolean | null>(null);
  const [checkingTranscript, setCheckingTranscript] = useState(true);
  const [learningGoalDetails, setLearningGoalDetails] =
    useState<LearningGoalOption | null>(null);
  const [otherQuestions, setOtherQuestions] = useState<OtherQuestion[]>([]);
  const [selectedOtherQuestions, setSelectedOtherQuestions] = useState<
    number[]
  >([]);
  const [loadingOtherQuestions, setLoadingOtherQuestions] = useState(false);
  // const [showOtherQuestions, setShowOtherQuestions] = useState(false); // Not used yet
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcriptData, setTranscriptData] = useState<
    StudentTranscriptRecord[]
  >([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [uploadingTranscript, setUploadingTranscript] = useState(false);

  // Load learning goal from URL param and fetch learning goals list
  useEffect(() => {
    const initializeData = async () => {
      try {
        const learningGoalId = searchParams.get("learningGoalId");

        if (!learningGoalId) {
          console.warn("No learningGoalId in URL params");
          return;
        }

        console.log("📚 Fetching learning goals for ID:", learningGoalId);

        // Fetch learning goals list from API
        const result = await getLearningGoalAction();

        if (result.ok && result.data) {
          // Find the learning goal matching the ID from URL
          const goal = result.data.find(
            (g) => g.learningGoalId === learningGoalId,
          );

          if (goal) {
            console.log("✅ Found learning goal:", goal);
            setLearningGoalDetails(goal);
          } else {
            console.warn("Learning goal not found in list:", learningGoalId);
          }
        } else {
          console.error("Failed to fetch learning goals:", result.error);
        }
      } catch (error) {
        console.error("Error loading learning goal:", error);
      }
    };

    initializeData();
  }, [searchParams]);

  // Check transcript and load other questions on mount
  useEffect(() => {
    const checkTranscript = async () => {
      try {
        setCheckingTranscript(true);
        console.log("🔍 [TRANSITION] Checking transcript...");
        const result = await getStudentTranscriptServer();

        console.log("📊 [TRANSITION] Transcript result:", {
          success: result.success,
          hasResponse: !!result.response,
          responseLength: result.response?.length,
          message: result.message,
        });

        if (result.success && result.response && result.response.length > 0) {
          console.log(
            "✅ [TRANSITION] Transcript found! Setting hasTranscript = true",
          );
          setHasTranscript(true);
          // Load other questions when transcript exists
          await loadOtherQuestions();
        } else {
          console.warn(
            "⚠️ [TRANSITION] No transcript found. Setting hasTranscript = false",
          );
          setHasTranscript(false);
        }
      } catch (error) {
        console.error("❌ [TRANSITION] Error checking transcript:", error);
        setHasTranscript(false);
      } finally {
        setCheckingTranscript(false);
      }
    };

    checkTranscript();
  }, []);

  // Load other questions from HABIT survey
  const loadOtherQuestions = async () => {
    try {
      setLoadingOtherQuestions(true);
      console.log("📋 Loading other questions from HABIT survey...");

      const result = await getSurveyByCodeAction("HABIT");

      if (result.ok && result.data && result.otherQuestions) {
        console.log("✅ Loaded other questions:", result.otherQuestions);
        setOtherQuestions(result.otherQuestions);
      } else {
        console.warn("No other questions found in HABIT survey");
      }
    } catch (error) {
      console.error("Error loading other questions:", error);
    } finally {
      setLoadingOtherQuestions(false);
    }
  };

  const handleContinueToQuiz = async () => {
    // ✅ Submit survey with isWantToTakeTest = true
    setIsSubmitting(true);
    try {
      console.log(
        "🎯 [TRANSITION] Submitting survey with isWantToTakeTest = true (Take Quiz)",
      );
      const result = await submitSurvey(true);

      console.log("🎯 [TRANSITION] Survey result:", result);

      if (result.success) {
        // Update localStorage
        localStorage.setItem(
          "learning_path_completed_steps",
          JSON.stringify([1, 2]),
        );
        localStorage.setItem("learning_path_current_step", "3");

        messageApi.success("Đang chuyển đến bài đánh giá...");
        router.push("/learning-path/assessment/quiz");
      } else {
        messageApi.error(
          result.error || "Không thể gửi khảo sát. Vui lòng thử lại.",
        );
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      messageApi.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSurvey = () => {
    // Navigate back to survey step 3 (last step) so user can review/edit
    console.log("🔙 [TRANSITION] Going back to survey");

    // Reset transition step but keep survey data
    localStorage.setItem("learning_path_completed_steps", JSON.stringify([1]));
    localStorage.setItem("learning_path_current_step", "1");

    // Redirect back to survey flow
    router.push("/learning-path/assessment/survey");
  };

  const handleUseTranscript = async () => {
    if (!learningGoalDetails) {
      messageApi.error("Không tìm thấy thông tin mục tiêu học tập");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Submit survey with isWantToTakeTest = false and optional other question answers
      // Backend will create learning path from transcript and return learningPathId
      console.log(
        "📄 [TRANSITION] Submitting survey with isWantToTakeTest = false (Use Transcript)",
      );
      console.log(
        "📄 [TRANSITION] Selected other questions:",
        selectedOtherQuestions,
      );
      const surveyResult = await submitSurvey(
        false,
        selectedOtherQuestions as OtherQuestionCode[],
      );

      console.log("📄 [TRANSITION] Survey result:", surveyResult);

      if (!surveyResult.success) {
        messageApi.error(
          surveyResult.error || "Không thể gửi khảo sát. Vui lòng thử lại.",
        );
        return;
      }

      // ✅ When isWantToTakeTest = false, response contains learningPathId
      const learningPathId =
        surveyResult.learningPathId || surveyResult.surveyId;

      if (!learningPathId) {
        messageApi.error("Không nhận được ID lộ trình học tập");
        console.error("❌ No learningPathId in response:", surveyResult);
        return;
      }

      console.log("✅ [TRANSITION] Received learningPathId:", learningPathId);

      // Update localStorage
      localStorage.setItem(
        "learning_path_completed_steps",
        JSON.stringify([1, 2]),
      );
      localStorage.setItem("learning_path_current_step", "3");

      // Success - redirect to processing page
      messageApi.success("Đang tạo lộ trình học tập từ bảng điểm...");
      router.push(
        `/learning-path/assessment/processing?learningPathId=${learningPathId}`,
      );
    } catch (error) {
      console.error("Error using transcript:", error);
      messageApi.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmChoice = () => {
    if (selectedOption === "quiz") {
      handleContinueToQuiz();
    } else if (selectedOption === "transcript") {
      handleUseTranscript();
    }
  };

  // Load transcript data for preview
  const handlePreviewTranscript = async () => {
    try {
      setLoadingTranscript(true);
      setShowTranscriptModal(true);
      const result = await getStudentTranscriptServer();
      if (result.success && result.response) {
        setTranscriptData(result.response);
      } else {
        messageApi.error("Không thể tải bảng điểm");
      }
    } catch (error) {
      console.error("Error loading transcript:", error);
      messageApi.error("Đã xảy ra lỗi khi tải bảng điểm");
    } finally {
      setLoadingTranscript(false);
    }
  };

  // Get status tag for transcript
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      "Not started": { color: "default", label: "Chưa bắt đầu" },
      Passed: { color: "success", label: "Đã qua" },
      "Not passed": { color: "error", label: "Không qua" },
      Studying: { color: "processing", label: "Đang học" },
    };
    const config = statusMap[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // Handle transcript upload
  const handleUploadTranscript = async (file: RcFile) => {
    try {
      setUploadingTranscript(true);
      console.log("🔼 [TRANSITION] Starting upload for file:", file.name);

      const result = await uploadTranscriptClient(file);
      console.log("🔼 [TRANSITION] Upload result:", result);

      if (result.success === true) {
        console.log("✅ [TRANSITION] Upload success");
        messageApi.success(result.message || "Upload bảng điểm thành công");

        // Re-check transcript after successful upload
        const transcriptResult = await getStudentTranscriptServer();
        if (
          transcriptResult.success &&
          transcriptResult.response &&
          transcriptResult.response.length > 0
        ) {
          setHasTranscript(true);
          // Auto-load other questions after successful upload
          await loadOtherQuestions();
        }
      } else {
        console.warn("⚠️ [TRANSITION] Upload failed");
        const errorDetails = result.detailErrors
          ? typeof result.detailErrors === "string"
            ? result.detailErrors
            : JSON.stringify(result.detailErrors)
          : "";

        messageApi.error({
          content: (
            <div>
              <div className="font-semibold">{result.message}</div>
              {errorDetails && (
                <div className="text-sm mt-1">{errorDetails}</div>
              )}
            </div>
          ),
          duration: 5,
        });
      }
    } catch (error) {
      console.error("❌ [TRANSITION] Upload exception:", error);
      messageApi.error({
        content: (
          <div>
            <div className="font-semibold">
              {error instanceof Error
                ? error.message
                : "Có lỗi xảy ra khi upload bảng điểm"}
            </div>
            <div className="text-sm mt-1">
              Vui lòng thử lại hoặc liên hệ với quản trị viên.
            </div>
          </div>
        ),
        duration: 5,
      });
    } finally {
      setUploadingTranscript(false);
    }
    return false; // Prevent default upload behavior
  };

  // Table columns for transcript
  const transcriptColumns: ColumnsType<StudentTranscriptRecord> = [
    {
      title: "Kỳ",
      dataIndex: "semesterNumber",
      key: "semesterNumber",
      width: 60,
      align: "center",
      render: (num: number) => <span className="font-semibold">{num}</span>,
    },
    {
      title: "Mã môn",
      dataIndex: "subjectCode",
      key: "subjectCode",
      width: 100,
      render: (code: string) => (
        <span className="font-mono font-semibold">{code}</span>
      ),
    },
    {
      title: "Tên môn học",
      dataIndex: "subjectName",
      key: "subjectName",
      ellipsis: true,
    },
    {
      title: "Tín chỉ",
      dataIndex: "credit",
      key: "credit",
      width: 80,
      align: "center",
    },
    {
      title: "Điểm",
      dataIndex: "grade",
      key: "grade",
      width: 80,
      align: "center",
      render: (grade: number) => (
        <Tag color="blue">{grade > 0 ? grade.toFixed(1) : "-"}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: string) => getStatusTag(status),
    },
  ];

  return (
    <LearningPathGuard requiredStep={1} requiredCompletedSteps={[1]}>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Progress Header - Minimal Mode */}
        <div className="sticky top-0 z-10">
          <LearningPathProgress
            currentStep={2}
            completedSteps={[1]}
            minimal={true}
            showTimeRemaining={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Main Card with subtle celebration */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Decorative elements - minimal */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-16 -translate-y-16 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 dark:bg-cyan-900/20 rounded-full transform -translate-x-12 translate-y-12 opacity-40"></div>

              <div className="relative z-10">
                {/* Success Icon with subtle animation */}
                <div className="text-center mb-8">
                  <div className="inline-block relative">
                    {/* Main icon */}
                    <div className="relative w-18 h-18 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <FiCheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Main Message */}
                <div className="text-center mb-10">
                  <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-5">
                    Xuất sắc! Bạn đã hoàn thành khảo sát
                  </h1>

                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-2">
                    Thông tin của bạn đã được ghi nhận. Bây giờ, hãy chọn cách
                    bạn muốn tiếp tục
                  </p>
                </div>

                {/* Choice Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
                  {/* Option 1: Use Transcript */}
                  <Card
                    className={`relative transition-all duration-200 ${
                      hasTranscript === false || checkingTranscript
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      selectedOption === "transcript"
                        ? "border-2 border-[#49BBBD] shadow-sm"
                        : "border border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={(e) => {
                      // Prevent card click when clicking on checkboxes
                      if (
                        (e.target as HTMLElement).closest(
                          ".other-questions-section",
                        )
                      ) {
                        return;
                      }
                      if (hasTranscript === true && !checkingTranscript) {
                        setSelectedOption("transcript");
                      }
                    }}
                  >
                    <div className="text-center p-5">
                      {/* Icon */}
                      <div className="mb-4">
                        <div
                          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200 ${
                            selectedOption === "transcript"
                              ? "bg-[#49BBBD]"
                              : "bg-teal-100 dark:bg-teal-900/30"
                          }`}
                        >
                          <HiDocumentText
                            className={`w-8 h-8 ${
                              selectedOption === "transcript"
                                ? "text-white"
                                : "text-[#49BBBD]"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Sử dụng bảng điểm
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        Hệ thống sẽ phân tích bảng điểm của bạn để đánh giá năng
                        lực và đề xuất lộ trình phù hợp
                      </p>

                      {/* Transcript Status */}
                      {checkingTranscript ? (
                        <div className="text-center py-2">
                          <Spin size="small" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Đang kiểm tra bảng điểm...
                          </p>
                        </div>
                      ) : hasTranscript === false ? (
                        <div className="space-y-3 flex flex-col gap-5">
                          <Alert
                            message="Chưa có bảng điểm"
                            type="warning"
                            showIcon
                            className="text-xs"
                          />
                          <Upload
                            accept=".xlsx,.xls"
                            maxCount={1}
                            beforeUpload={handleUploadTranscript}
                            showUploadList={false}
                          >
                            <Button
                              icon={
                                uploadingTranscript ? (
                                  <Spin size="small" />
                                ) : (
                                  <UploadOutlined />
                                )
                              }
                              block
                              disabled={uploadingTranscript}
                              size="small"
                              type="primary"
                              loading={uploadingTranscript}
                              className="!bg-[#49BBBD] hover:!bg-[#3da8aa]"
                            >
                              {uploadingTranscript
                                ? "Đang upload..."
                                : "Upload bảng điểm (.xlsx, .xls)"}
                            </Button>
                          </Upload>
                          {/* <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Định dạng: Excel (.xlsx, .xls)
                          </p> */}
                        </div>
                      ) : (
                        <>
                          <Alert
                            message="Đã có bảng điểm"
                            type="success"
                            showIcon
                            className="text-xs"
                            action={
                              <Button
                                size="small"
                                type="text"
                                color="default"
                                variant="filled"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreviewTranscript();
                                }}
                              >
                                Xem
                              </Button>
                            }
                          />

                          {/* Other Questions Section - Only show when transcript option is selected */}
                          {selectedOption === "transcript" &&
                            otherQuestions.length > 0 && (
                              <div className="other-questions-section mt-4  border-t border-gray-200 dark:border-gray-600">
                                <Collapse
                                  ghost
                                  size="small"
                                  expandIconPosition="start"
                                  // onChange={(keys) => {
                                  //   setShowOtherQuestions(keys.length > 0);
                                  // }}
                                  items={[
                                    {
                                      key: "1",
                                      label: (
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                          Câu hỏi bổ sung (Không bắt buộc)
                                        </span>
                                      ),
                                      children: (
                                        <>
                                          {loadingOtherQuestions ? (
                                            <div className="text-center py-2">
                                              <Spin size="small" />
                                            </div>
                                          ) : (
                                            <div className="space-y-2 text-left max-h-48 overflow-y-auto">
                                              <Checkbox.Group
                                                value={selectedOtherQuestions}
                                                onChange={(checkedValues) => {
                                                  setSelectedOtherQuestions(
                                                    checkedValues as number[],
                                                  );
                                                }}
                                                className="w-full"
                                              >
                                                <Space
                                                  direction="vertical"
                                                  className="w-full"
                                                  size="small"
                                                >
                                                  {otherQuestions.map((q) => (
                                                    <Checkbox
                                                      key={q.otherQuestionCode}
                                                      value={
                                                        q.otherQuestionCode
                                                      }
                                                      className="!items-start"
                                                    >
                                                      <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        {q.otherQuestionText}
                                                      </span>
                                                    </Checkbox>
                                                  ))}
                                                </Space>
                                              </Checkbox.Group>
                                            </div>
                                          )}

                                          {/* {selectedOtherQuestions.length >
                                            0 && (
                                            <p className="text-xs text-teal-600 dark:text-teal-400 mt-3 text-center">
                                              Đã chọn{" "}
                                              {selectedOtherQuestions.length}{" "}
                                              câu hỏi
                                            </p>
                                          )} */}
                                        </>
                                      ),
                                    },
                                  ]}
                                />
                              </div>
                            )}
                        </>
                      )}

                      {/* Benefits */}
                      {/* <div className="space-y-2 text-left">
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Nhanh chóng
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Chỉ mất ~1 phút
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Dựa trên thành tích
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Phân tích từ điểm số thực tế
                          </div>
                        </div>
                      </div> */}

                      {/* Selected Badge */}
                      {selectedOption === "transcript" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Option 2: Take Quiz */}
                  <Card
                    className={`relative cursor-pointer transition-all duration-200 ${
                      selectedOption === "quiz"
                        ? "border-2 border-orange-500 shadow-sm"
                        : "border border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedOption("quiz")}
                  >
                    <div className="text-center p-5">
                      {/* Icon */}
                      <div className="mb-4">
                        <div
                          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200 ${
                            selectedOption === "quiz"
                              ? "bg-orange-500"
                              : "bg-orange-100 dark:bg-orange-900/30"
                          }`}
                        >
                          <SiQuizlet
                            className={`w-8 h-8 ${
                              selectedOption === "quiz"
                                ? "text-white"
                                : "text-orange-600"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Làm bài đánh giá
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        Làm bài test đánh giá năng lực để hệ thống có thể đề
                        xuất lộ trình chính xác nhất
                      </p>

                      {/* Benefits */}
                      {/* <div className="space-y-2 text-left">
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Chính xác cao
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Đánh giá toàn diện năng lực
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            • Thời gian
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            Khoảng 15-20 phút
                          </div>
                        </div>
                      </div> */}

                      {/* Selected Badge */}
                      {selectedOption === "quiz" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <Button
                      size="large"
                      onClick={handleBackToSurvey}
                      icon={<FiArrowLeft className="w-6 h-6" />}
                      disabled={isSubmitting}
                      className="!px-8 !py-6 h-auto text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Quay lại khảo sát
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleConfirmChoice}
                      disabled={
                        !selectedOption || isSubmitting || checkingTranscript
                      }
                      className="!p-6 !bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 px-12 py-4 h-auto text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      icon={
                        isSubmitting ? (
                          <Spin size="small" />
                        ) : (
                          <FiArrowRight className="w-6 h-6 ml-2" />
                        )
                      }
                      iconPosition="end"
                    >
                      {isSubmitting
                        ? "Đang xử lý..."
                        : checkingTranscript
                          ? "Đang kiểm tra..."
                          : selectedOption
                            ? "Tiếp tục"
                            : "Chọn một phương án"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration - subtle */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-teal-200 dark:bg-teal-800 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-200 dark:bg-cyan-800 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-10 animate-pulse delay-2000"></div>
        </div>

        {/* Transcript Preview Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <HiDocumentText className="w-5 h-5 text-[#49BBBD]" />
              <span>Bảng điểm của bạn</span>
            </div>
          }
          open={showTranscriptModal}
          onCancel={() => setShowTranscriptModal(false)}
          footer={[
            <Button key="close" onClick={() => setShowTranscriptModal(false)}>
              Đóng
            </Button>,
          ]}
          width={1000}
          centered
        >
          <Spin spinning={loadingTranscript}>
            <div className="mt-4">
              {transcriptData.length === 0 && !loadingTranscript ? (
                <div className="text-center py-8 text-gray-500">
                  Không có dữ liệu bảng điểm
                </div>
              ) : (
                <Table
                  columns={transcriptColumns}
                  dataSource={transcriptData}
                  rowKey="studentTranscriptId"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) => `Tổng ${total} môn học`,
                  }}
                  scroll={{ x: 800 }}
                  size="small"
                  bordered
                />
              )}
            </div>
          </Spin>
        </Modal>
      </div>
    </LearningPathGuard>
  );
}

export default function SurveyToQuizTransition() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spin />
        </div>
      }
    >
      <SurveyToQuizTransitionContent />
    </Suspense>
  );
}
