"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import QuizSelectionScreen from "./QuizSelection/QuizSelectionScreen";
import QuizTakingScreenNew from "./QuizTaking/QuizTakingScreenNew";

export interface QuizState {
  stage: "selection" | "taking";
  selectedQuizIds: string[];
  testId?: string;
}

const QuizMainFlow: React.FC = () => {
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState>({
    stage: "selection",
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
    // No longer needed - QuizTakingScreenNew handles redirect
    console.log("Quiz submitted with ID:", studentTestId);
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

    default:
      return null;
  }
};

export default QuizMainFlow;
