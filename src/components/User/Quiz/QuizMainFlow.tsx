"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuizSelectionScreen from "./QuizSelection/QuizSelectionScreen";
import QuizTakingScreenNew from "./QuizTaking/QuizTakingScreenNew";
import PracticeTestSelection from "../PracticeTest/PracticeTestSelection";
import PracticeTestTaking from "../PracticeTest/PracticeTestTaking";
import { useLearningPathFlow } from "EduSmart/hooks/useLearningPathFlow";

export interface QuizState {
  stage: "selection" | "taking" | "practice-selection" | "practice-taking";
  selectedQuizIds: string[];
  testId?: string;
}

const QuizMainFlow: React.FC = () => {
  const router = useRouter();
  const {
    flowState,
    markQuizCompleted,
    markPracticeTestCompleted,
    canAccessPracticeTest,
  } = useLearningPathFlow();

  // Determine initial stage based on flow state
  const getInitialStage = (): QuizState["stage"] => {
    if (flowState.practiceTestCompleted) {
      // Already completed everything, redirect to processing
      router.push("/learning-path/assessment/processing");
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

  const handleStartQuiz = (testId: string) => {
    setQuizState({
      stage: "taking",
      selectedQuizIds: [],
      testId,
    });
  };

  const handleSubmitQuiz = (studentTestId: string) => {
    // After quiz completion, move to practice test selection
    console.log("Quiz submitted with ID:", studentTestId);
    markQuizCompleted();
    setQuizState({
      stage: "practice-selection",
      selectedQuizIds: [],
    });
  };

  const handleStartPracticeTest = () => {
    setQuizState({
      stage: "practice-taking",
      selectedQuizIds: [],
    });
  };

  const handleCompletePracticeTest = () => {
    // After practice test completion, redirect to processing page
    console.log("Practice test completed");
    markPracticeTestCompleted();
    router.push("/learning-path/assessment/processing");
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
