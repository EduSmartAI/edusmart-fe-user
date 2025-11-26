"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Tag, Spin, message, Progress, Modal } from "antd";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { usePracticeTestStore } from "EduSmart/stores/PracticeTest/PracticeTestStore";
import {
  selectPracticeTestDetailList,
  selectUserTemplateCodeList,
  submitPracticeTestCreate,
} from "EduSmart/app/(codeQuiz)/action";
import CodeEditor from "EduSmart/components/Code/CodeEditor";
import {
  CodeLanguageOption,
  PracticeProblem,
} from "EduSmart/components/Code/CodeEditorContainer";

interface PracticeTestTakingProps {
  onComplete: () => void;
}

const difficultyColor = (difficulty: string): string => {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "green";
  if (d === "medium") return "gold";
  if (d === "hard") return "red";
  return "default";
};

const PracticeTestTaking: React.FC<PracticeTestTakingProps> = ({
  onComplete,
}) => {
  const {
    problems,
    languages,
    currentProblemIndex,
    currentProblemDetail,
    selectedLanguageId,
    completedProblems,
    isAllCompleted,
    setCurrentProblemDetail,
    setLoadingProblemDetail,
    saveSubmission,
    markProblemCompleted,
    goToNextProblem,
    goToPreviousProblem,
    goToProblem,
    getCurrentProblem,
    getSubmission,
    isProblemCompleted,
  } = usePracticeTestStore();

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  const currentProblem = getCurrentProblem();

  // Load problem detail when problem changes
  useEffect(() => {
    const loadProblemDetail = async () => {
      if (!currentProblem) return;

      setIsLoadingDetail(true);
      setLoadingProblemDetail(true);

      try {
        const detail = await selectPracticeTestDetailList(
          currentProblem.problemId,
        );

        if (detail?.response) {
          setCurrentProblemDetail(detail.response);
        } else {
          message.error("Không thể tải chi tiết bài tập");
        }
      } catch (error) {
        console.error("Error loading problem detail:", error);
        message.error("Có lỗi khi tải chi tiết bài tập");
      } finally {
        setIsLoadingDetail(false);
        setLoadingProblemDetail(false);
      }
    };

    loadProblemDetail();
  }, [currentProblem, setCurrentProblemDetail, setLoadingProblemDetail]);

  // Load template code when problem or language changes
  useEffect(() => {
    const loadTemplate = async () => {
      if (!currentProblem || !selectedLanguageId) return;

      // Check if we have saved code for this problem
      const savedSubmission = getSubmission(currentProblem.problemId);
      if (savedSubmission && savedSubmission.sourceCode) {
        setCurrentCode(savedSubmission.sourceCode);
        return;
      }

      setIsLoadingTemplate(true);

      try {
        const template = await selectUserTemplateCodeList(
          currentProblem.problemId,
          selectedLanguageId,
        );

        if (template?.response?.userTemplateCode) {
          setCurrentCode(template.response.userTemplateCode);
        } else {
          setCurrentCode("// Write your code here\n");
        }
      } catch (error) {
        console.error("Error loading template:", error);
        setCurrentCode("// Write your code here\n");
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [currentProblem, selectedLanguageId, getSubmission]);

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);

    // Auto-save code
    if (currentProblem && selectedLanguageId) {
      saveSubmission(currentProblem.problemId, selectedLanguageId, code);
    }
  };

  const handleMarkAsComplete = () => {
    if (!currentProblem) return;

    if (!currentCode || currentCode.trim().length === 0) {
      message.warning("Vui lòng viết code trước khi đánh dấu hoàn thành");
      return;
    }

    // Save final submission
    if (selectedLanguageId) {
      saveSubmission(currentProblem.problemId, selectedLanguageId, currentCode);
    }

    markProblemCompleted(currentProblem.problemId);
    message.success(
      `Đã hoàn thành bài ${currentProblemIndex + 1}/${problems.length}`,
    );

    // Auto move to next problem if not last
    if (currentProblemIndex < problems.length - 1) {
      setTimeout(() => {
        goToNextProblem();
      }, 500);
    }
  };

  const handleSubmitAll = async () => {
    const incompletedCount = problems.length - completedProblems.length;

    const submitAllTests = async () => {
      message.loading({
        content: "Đang nộp bài...",
        key: "submit",
        duration: 0,
      });

      try {
        // Submit all problems with their code
        const submissions = problems.map((problem) => {
          const submission = getSubmission(problem.problemId);
          return {
            problemId: problem.problemId,
            languageId: submission?.languageId || selectedLanguageId || 51,
            sourceCode: submission?.sourceCode || "// No code submitted",
          };
        });

        // Submit all in parallel
        const results = await Promise.allSettled(
          submissions.map((sub) =>
            submitPracticeTestCreate(
              sub.problemId,
              sub.languageId,
              sub.sourceCode,
            ),
          ),
        );

        const successCount = results.filter(
          (r) => r.status === "fulfilled",
        ).length;
        const failCount = results.filter((r) => r.status === "rejected").length;

        message.destroy("submit");

        if (failCount === 0) {
          message.success(`Đã nộp thành công ${successCount} bài tập!`);
        } else {
          message.warning(
            `Nộp thành công ${successCount} bài, thất bại ${failCount} bài`,
          );
        }

        // Complete regardless of submission results
        setTimeout(() => {
          onComplete();
        }, 1000);
      } catch (error) {
        message.destroy("submit");
        message.error("Có lỗi khi nộp bài. Vui lòng thử lại.");
        console.error("Submit error:", error);
      }
    };

    if (incompletedCount > 0) {
      Modal.confirm({
        title: "Bạn chưa hoàn thành tất cả bài tập",
        content: `Còn ${incompletedCount} bài chưa hoàn thành. Bạn có chắc muốn nộp bài?`,
        okText: "Nộp bài",
        cancelText: "Hủy",
        onOk: submitAllTests,
      });
    } else {
      await submitAllTests();
    }
  };

  const progressPercent = Math.round(
    (completedProblems.length / problems.length) * 100,
  );

  if (isLoadingDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải bài tập...
          </div>
        </div>
      </div>
    );
  }

  if (!currentProblem || !currentProblemDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Không tìm thấy bài tập
        </div>
      </div>
    );
  }

  // Map data for CodeEditor
  const codeLanguages: CodeLanguageOption[] = languages.map((l) => ({
    judgeLanguageId: l.languageId,
    name: l.name,
  }));

  const codeProblems: PracticeProblem[] = currentProblemDetail
    ? [
        {
          problemId: currentProblemDetail.problemId,
          title: currentProblemDetail.title,
          description: currentProblemDetail.description,
          difficulty: currentProblemDetail.difficulty,
          examples: currentProblemDetail.examples,
          testCases: currentProblemDetail.testCases,
        },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bài {currentProblemIndex + 1}/{problems.length}
            </h2>
            <Tag color={difficultyColor(currentProblem.difficulty)}>
              {currentProblem.difficulty}
            </Tag>
            {isProblemCompleted(currentProblem.problemId) && (
              <Tag icon={<FiCheckCircle />} color="success">
                Đã hoàn thành
              </Tag>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tiến độ: {completedProblems.length}/{problems.length}
            </div>
            <Progress
              type="circle"
              percent={progressPercent}
              width={40}
              strokeColor="#8b5cf6"
            />
          </div>
        </div>
      </div>

      {/* Problem Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          {problems.map((problem, index) => (
            <Button
              key={problem.problemId}
              size="small"
              type={index === currentProblemIndex ? "primary" : "default"}
              onClick={() => goToProblem(index)}
              icon={
                isProblemCompleted(problem.problemId) ? (
                  <FiCheckCircle className="text-green-500" />
                ) : null
              }
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        {isLoadingTemplate ? (
          <div className="h-full flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <CodeEditor
            languages={codeLanguages}
            problems={codeProblems}
            onSubmit={(payload) => {
              // Handle code submission for testing
              console.log("Code submitted for testing:", payload);
            }}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            icon={<FiChevronLeft />}
            onClick={goToPreviousProblem}
            disabled={currentProblemIndex === 0}
          >
            Bài trước
          </Button>

          <div className="flex items-center gap-3">
            {!isProblemCompleted(currentProblem.problemId) && (
              <Button
                type="default"
                icon={<FiCheckCircle />}
                onClick={handleMarkAsComplete}
              >
                Đánh dấu hoàn thành
              </Button>
            )}

            {isAllCompleted || completedProblems.length === problems.length ? (
              <Button
                type="primary"
                size="large"
                icon={<FiSend />}
                onClick={handleSubmitAll}
                className="px-8"
              >
                Nộp bài
              </Button>
            ) : (
              <Button
                type="default"
                icon={<FiAlertCircle />}
                onClick={handleSubmitAll}
              >
                Nộp bài ({completedProblems.length}/{problems.length})
              </Button>
            )}
          </div>

          <Button
            icon={<FiChevronRight />}
            iconPosition="end"
            onClick={goToNextProblem}
            disabled={currentProblemIndex === problems.length - 1}
          >
            Bài tiếp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeTestTaking;
