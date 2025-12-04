"use client";

import React, { useEffect, useState } from "react";
import { Button, Spin, Modal } from "antd";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiSend,
  FiAlertCircle,
} from "react-icons/fi";
import { usePracticeTestStore } from "EduSmart/stores/PracticeTest/PracticeTestStore";
import {
  selectPracticeTestDetailList,
  selectUserTemplateCodeList,
} from "EduSmart/app/(codeQuiz)/action";
import CodeEditor from "EduSmart/components/Code/CodeEditor";
import {
  CodeLanguageOption,
  PracticeProblem,
} from "EduSmart/components/Code/CodeEditorContainer";
import { useNotification } from "EduSmart/Provider/NotificationProvider";

interface PracticeTestTakingProps {
  onComplete: () => void;
}

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
    setSelectedLanguageId,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const messageApi = useNotification();

  const currentProblem = getCurrentProblem();

  useEffect(() => {
    const loadProblemDetail = async () => {
      if (!currentProblem) return;

      setIsLoadingDetail(true);
      setLoadingProblemDetail(true);

      try {
        // const detail = await selectPracticeTestsList(currentProblem.problemId);
        const detail = await selectPracticeTestDetailList(
          currentProblem.problemId,
        );

        if (detail?.response) {
          setCurrentProblemDetail(detail.response);
        } else {
          messageApi.error("Không thể tải chi tiết bài tập");
        }
      } catch (error) {
        console.error("Error loading problem detail:", error);
        messageApi.error("Có lỗi khi tải chi tiết bài tập");
      } finally {
        setIsLoadingDetail(false);
        setLoadingProblemDetail(false);
      }
    };

    loadProblemDetail();
  }, [currentProblem, setCurrentProblemDetail, setLoadingProblemDetail, messageApi]);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!currentProblem || !selectedLanguageId) {
        console.warn("Missing currentProblem or selectedLanguageId:", {
          currentProblem: currentProblem?.problemId,
          selectedLanguageId,
        });
        return;
      }

      const savedSubmission = getSubmission(currentProblem.problemId);
      if (savedSubmission && savedSubmission.sourceCode) {
        console.log("Using saved code for problem:", currentProblem.problemId);
        setCurrentCode(savedSubmission.sourceCode);
        return;
      }

      setIsLoadingTemplate(true);

      try {
        console.log("Loading template for:", {
          problemId: currentProblem.problemId,
          languageId: selectedLanguageId,
        });

        const template = await selectUserTemplateCodeList(
          currentProblem.problemId,
          selectedLanguageId,
        );

        console.log("Template response:", template);

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
  }, [currentProblem, selectedLanguageId, getSubmission, messageApi]);

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);

    if (currentProblem && selectedLanguageId) {
      console.log("💾 Auto-saving code:", {
        problemId: currentProblem.problemId,
        languageId: selectedLanguageId,
        codeLength: code.length,
      });
      saveSubmission(currentProblem.problemId, selectedLanguageId, code);
    } else {
      console.warn("⚠️ Cannot save code:", {
        hasProblem: !!currentProblem,
        selectedLanguageId,
      });
    }
  };

  const handleProblemChange = (problemId: string) => {
    console.log("Problem changed:", problemId);
    const problemIndex = codeProblems.findIndex(
      (p) => p.problemId === problemId,
    );
    if (problemIndex >= 0) {
      goToProblem(problemIndex);
    }
  };

  const handleLanguageChange = (langId: number) => {
    console.log("🔄 Language changed in CodeEditor:", langId);
    setSelectedLanguageId(langId);

    // Re-save current code with new language ID
    if (currentProblem && currentCode) {
      console.log("💾 Re-saving code with new language:", {
        problemId: currentProblem.problemId,
        oldLanguageId: selectedLanguageId,
        newLanguageId: langId,
        codeLength: currentCode.length,
      });
      saveSubmission(currentProblem.problemId, langId, currentCode);
    }
  };

  const handleMarkAsComplete = () => {
    if (!currentProblem) return;

    if (!currentCode || currentCode.trim().length === 0) {
      messageApi.warning("Vui lòng viết code trước khi đánh dấu hoàn thành");
      return;
    }

    if (selectedLanguageId) {
      saveSubmission(currentProblem.problemId, selectedLanguageId, currentCode);
    }

    markProblemCompleted(currentProblem.problemId);
    messageApi.success(
      `Đã hoàn thành bài ${currentProblemIndex + 1}/${problems.length}`,
    );

    if (currentProblemIndex < problems.length - 1) {
      setTimeout(() => {
        goToNextProblem();
      }, 500);
    }
  };

  const handleSubmitAll = async () => {
    const incompletedCount = problems.length - completedProblems.length;

    const submitAllTests = async () => {
      setIsSubmitting(true);

      try {
        if (currentProblem && selectedLanguageId && currentCode) {
          console.log("💾 Saving final submission...");
          saveSubmission(
            currentProblem.problemId,
            selectedLanguageId,
            currentCode,
          );
        } else {
          console.warn("⚠️ Cannot save final submission:", {
            hasProblem: !!currentProblem,
            selectedLanguageId,
            hasCode: !!currentCode,
          });
        }

        messageApi.success({
          content: "Đã lưu code của bạn!",
          duration: 1,
        });

        setTimeout(() => {
          onComplete();
        }, 300);
      } finally {
        setIsSubmitting(false);
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

  if (isLoadingDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          {/* <div className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải bài tập...
          </div> */}
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

  // Map all problems to PracticeProblem format for CodeEditor
  const codeProblems: PracticeProblem[] = problems.map((problem) => ({
    problemId: problem.problemId,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    // Use currentProblemDetail if it matches, otherwise empty arrays
    examples:
      currentProblemDetail?.problemId === problem.problemId
        ? currentProblemDetail.examples
        : [],
    testCases:
      currentProblemDetail?.problemId === problem.problemId
        ? currentProblemDetail.testCases
        : [],
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl text-center border border-gray-200 dark:border-gray-700">
            <Spin size="large" />
            <div className="mt-4 text-gray-900 dark:text-white font-medium">
              Đang nộp bài kiểm tra...
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Vui lòng không đóng cửa sổ này
            </div>
          </div>
        </div>
      )}

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
            selectedLanguageId={selectedLanguageId ?? undefined}
            activeProblemId={currentProblem?.problemId}
            onCodeChange={handleCodeChange}
            onProblemChange={handleProblemChange}
            onLanguageChange={handleLanguageChange}
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
            disabled={currentProblemIndex === 0 || isSubmitting}
          >
            Bài trước
          </Button>

          <div className="flex items-center gap-3 mx-auto">
            {!isProblemCompleted(currentProblem.problemId) && (
              <Button
                type="default"
                icon={<FiCheckCircle />}
                onClick={handleMarkAsComplete}
                disabled={isSubmitting}
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
                loading={isSubmitting}
                disabled={isSubmitting}
                className="px-10"
              >
                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
              </Button>
            ) : (
              <Button
                type="default"
                icon={<FiAlertCircle />}
                onClick={handleSubmitAll}
                disabled={isSubmitting}
              >
                Nộp bài ({completedProblems.length}/{problems.length})
              </Button>
            )}
          </div>

          {/* <Button
            icon={<FiChevronRight />}
            iconPosition="end"
            onClick={goToNextProblem}
            disabled={
              currentProblemIndex === problems.length - 1 || isSubmitting
            }
          >
            Bài tiếp
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default PracticeTestTaking;
