/**
 * Hook to manage learning path assessment flow state
 * Handles graceful recovery when user refreshes or navigates back
 */

import { useEffect, useState } from "react";

export interface LearningPathFlowState {
  surveyCompleted: boolean;
  quizCompleted: boolean;
  practiceTestCompleted: boolean;
  learningPathId?: string;
}

const STORAGE_KEY = "learning-path-flow-state";

export function useLearningPathFlow() {
  const [flowState, setFlowState] = useState<LearningPathFlowState>({
    surveyCompleted: false,
    quizCompleted: false,
    practiceTestCompleted: false,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFlowState(parsed);
      } catch (error) {
        console.error("Error parsing learning path flow state:", error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState));
  }, [flowState]);

  const markSurveyCompleted = () => {
    setFlowState((prev) => ({ ...prev, surveyCompleted: true }));
  };

  const markQuizCompleted = () => {
    setFlowState((prev) => ({ ...prev, quizCompleted: true }));
  };

  const markPracticeTestCompleted = () => {
    setFlowState((prev) => ({ ...prev, practiceTestCompleted: true }));
  };

  const setLearningPathId = (id: string) => {
    setFlowState((prev) => ({ ...prev, learningPathId: id }));
  };

  const resetFlow = () => {
    setFlowState({
      surveyCompleted: false,
      quizCompleted: false,
      practiceTestCompleted: false,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const canAccessQuiz = () => {
    return flowState.surveyCompleted;
  };

  const canAccessPracticeTest = () => {
    return flowState.surveyCompleted && flowState.quizCompleted;
  };

  const canAccessProcessing = () => {
    return (
      flowState.surveyCompleted &&
      flowState.quizCompleted &&
      flowState.practiceTestCompleted
    );
  };

  return {
    flowState,
    markSurveyCompleted,
    markQuizCompleted,
    markPracticeTestCompleted,
    setLearningPathId,
    resetFlow,
    canAccessQuiz,
    canAccessPracticeTest,
    canAccessProcessing,
  };
}
