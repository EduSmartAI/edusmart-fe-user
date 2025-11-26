"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import QuizSelectionScreen from "./QuizSelection/QuizSelectionScreen";
import QuizTakingScreenNew from "./QuizTaking/QuizTakingScreenNew";
import PracticeTestSelection from "../PracticeTest/PracticeTestSelection";
import PracticeTestTaking from "../PracticeTest/PracticeTestTaking";
import { useLearningPathFlow } from "EduSmart/hooks/useLearningPathFlow";
import { useQuizStore } from "EduSmart/stores/Quiz/QuizStore";
import { usePracticeTestStore } from "EduSmart/stores/PracticeTest/PracticeTestStore";
import { learningPathProgress } from "EduSmart/components/LearningPath";

export interface QuizState {
  stage: "selection" | "taking" | "practice-selection" | "practice-taking";
  selectedQuizIds: string[];
  testId?: string;
  quizSubmissionData?: {
    testId: string;
    startedAt: string;
    quizIds: string[];
    answers: Array<{ questionId: string; answerId: string }>;
  };
}

const QuizMainFlow: React.FC = () => {
  const router = useRouter();
  const {
    flowState,
    markQuizCompleted,
    markPracticeTestCompleted,
    canAccessPracticeTest,
  } = useLearningPathFlow();

  const quizStore = useQuizStore();
  const practiceTestStore = usePracticeTestStore();

  // Determine initial stage based on flow state
  const getInitialStage = (): QuizState["stage"] => {
    if (flowState.practiceTestCompleted) {
      // Already completed everything, redirect to processing
      // router.push("/learning-path/assessment/processing");
      return "selection";
    }
    if (flowState.quizCompleted && canAccessPracticeTest()) {
      // Quiz done, show practice test
      return "practice-selection";
    }
    // Start from quiz selection
    return "selection";
  };

  const [quizState, setQuizState] = useState<QuizState>({
    stage: getInitialStage(),
    selectedQuizIds: [],
  });
  const [practiceTestResetDone, setPracticeTestResetDone] = useState(false);

  // Reset practice test store when entering practice test for the first time
  useEffect(() => {
    if (
      (quizState.stage === "practice-selection" ||
        quizState.stage === "practice-taking") &&
      !practiceTestResetDone
    ) {
      // Reset practice test store to start fresh
      console.log("🔄 Resetting practice test store for new attempt");
      practiceTestStore.reset();
      setPracticeTestResetDone(true);
    }
  }, [quizState.stage]);

  const handleStartQuiz = (testId: string) => {
    setQuizState({
      stage: "taking",
      selectedQuizIds: [],
      testId,
    });
  };

  const handleSubmitQuiz = (quizData: {
    testId: string;
    startedAt: string;
    quizIds: string[];
    answers: Array<{ questionId: string; answerId: string }>;
  }) => {
    // After quiz completion, save data and move to practice test selection
    console.log("Quiz completed, saving data for later submission:", quizData);
    markQuizCompleted();
    setQuizState({
      stage: "practice-selection",
      selectedQuizIds: [],
      quizSubmissionData: quizData,
    });
  };

  const handleStartPracticeTest = () => {
    setQuizState((prev) => ({
      ...prev,
      stage: "practice-taking",
      selectedQuizIds: [],
      // Preserve quizSubmissionData
    }));
  };

  const handleCompletePracticeTest = async () => {
    // After practice test completion, submit both quiz and practice test together
    console.log("Practice test completed - submitting combined results");

    const hideLoading = message.loading("Đang nộp bài kiểm tra...", 0);

    try {
      // Get quiz submission data from state
      if (!quizState.quizSubmissionData) {
        throw new Error("Quiz data not found");
      }

      // Get practice test submissions
      const practiceSubmissions = practiceTestStore.getAllSubmissions();
      console.log("🔍 Practice submissions from store:", practiceSubmissions);

      const practiceTestAnswers = practiceSubmissions.map((sub) => ({
        problemId: sub.problemId,
        languageId: sub.languageId,
        codeSubmission: sub.sourceCode,
      }));

      console.log("📦 Combined submission data:", {
        testId: quizState.quizSubmissionData.testId,
        quizIds: quizState.quizSubmissionData.quizIds,
        answersCount: quizState.quizSubmissionData.answers.length,
        practiceTestAnswersCount: practiceTestAnswers.length,
        practiceTestAnswers: practiceTestAnswers,
      });

      // Submit combined data
      const testData = {
        ...quizState.quizSubmissionData,
        practiceTestAnswers,
      };

      const result = await quizStore.submitTest(testData);

      hideLoading();

      if (result.ok && result.learningPathId) {
        message.success("Đã nộp bài thành công!");

        // Mark practice test completed
        markPracticeTestCompleted();

        // Store learning path ID
        learningPathProgress.setLearningPathId(result.learningPathId);

        // Redirect to processing
        setTimeout(() => {
          router.push(
            `/learning-path/assessment/processing?learningPathId=${result.learningPathId}`,
          );
        }, 300);
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      hideLoading();
      console.error("❌ Combined submission error:", error);
      message.error("Có lỗi khi nộp bài. Vui lòng thử lại.");
    }
  };

  const handleBackToSelection = () => {
    setQuizState({
      stage: "selection",
      selectedQuizIds: [],
    });
  };

  const handleBackToHome = () => {
    router.push("/home");
  };

  switch (quizState.stage) {
    case "selection":
      return (
        <QuizSelectionScreen
          onQuizSelect={handleStartQuiz}
          onSkip={handleBackToHome}
        />
      );

    case "taking":
      return (
        <QuizTakingScreenNew
          testId={quizState.testId!}
          onComplete={handleSubmitQuiz}
          onExit={handleBackToSelection}
        />
      );

    case "practice-selection":
      return (
        <PracticeTestSelection onStartPracticeTest={handleStartPracticeTest} />
      );

    case "practice-taking":
      return <PracticeTestTaking onComplete={handleCompletePracticeTest} />;

    default:
      return null;
  }
};

export default QuizMainFlow;
