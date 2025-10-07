// hooks/quiz/useQuizTaking.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuizStore } from "EduSmart/stores/Quiz/QuizStore";
import { useQuizTest } from "EduSmart/hooks/quiz";
import type { TestDetail } from "EduSmart/app/(quiz)/quizAction";

export interface QuizTakingState {
  testDetail: TestDetail | null;
  currentQuizIndex: number;
  currentQuestionIndex: number;
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
  answers: Record<string, string[]>; // questionId -> selectedAnswerIds
}

export interface UseQuizTakingReturn {
  state: QuizTakingState;
  actions: {
    loadTest: (testId: string) => Promise<void>;
    selectAnswer: (
      questionId: string,
      answerId: string,
      isMultiple: boolean,
    ) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuiz: (quizIndex: number) => void;
    submitTest: () => Promise<string | null>; // returns studentTestId
    setTimeRemaining: (time: number) => void;
  };
}

export function useQuizTaking(): UseQuizTakingReturn {
  const quizStore = useQuizStore();
  const { currentTest, isLoading: apiLoading, error: apiError } = useQuizTest();

  const [state, setState] = useState<QuizTakingState>({
    testDetail: null,
    currentQuizIndex: 0,
    currentQuestionIndex: 0,
    isLoading: false,
    error: null,
    timeRemaining: 30 * 60, // 30 minutes default
    answers: {},
  });

  // Update state when currentTest changes
  useEffect(() => {
    if (currentTest) {
      setState((prev) => ({
        ...prev,
        testDetail: currentTest,
        isLoading: false,
        error: null,
      }));
    }
  }, [currentTest]);

  // Update loading and error from API
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoading: apiLoading,
      error: apiError,
    }));
  }, [apiLoading, apiError]);

  const loadTest = useCallback(
    async (testId: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // For now, use currentTest from store since createTest was already called
      // In future, we might need a getTestDetail API if test data expires
      if (currentTest && currentTest.testId === testId) {
        setState((prev) => ({
          ...prev,
          testDetail: currentTest,
          isLoading: false,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Test not found. Please create a new test.",
        }));
      }
    },
    [currentTest],
  );

  const selectAnswer = useCallback(
    (questionId: string, answerId: string, isMultiple: boolean) => {
      setState((prev) => {
        const currentAnswers = prev.answers[questionId] || [];
        let newAnswers: string[];

        if (isMultiple) {
          // Multiple choice: toggle answer
          newAnswers = currentAnswers.includes(answerId)
            ? currentAnswers.filter((id) => id !== answerId)
            : [...currentAnswers, answerId];
        } else {
          // Single choice: replace answer
          newAnswers = [answerId];
        }

        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: newAnswers,
          },
        };
      });
    },
    [],
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (!prev.testDetail) return prev;

      const currentQuiz = prev.testDetail.quizzes[prev.currentQuizIndex];
      const totalQuestions = currentQuiz.questions.length;

      if (prev.currentQuestionIndex < totalQuestions - 1) {
        // Next question in current quiz
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      } else if (prev.currentQuizIndex < prev.testDetail.quizzes.length - 1) {
        // Next quiz
        return {
          ...prev,
          currentQuizIndex: prev.currentQuizIndex + 1,
          currentQuestionIndex: 0,
        };
      }

      return prev; // No next question/quiz
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex > 0) {
        // Previous question in current quiz
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      } else if (prev.currentQuizIndex > 0) {
        // Previous quiz, go to last question
        const prevQuiz = prev.testDetail!.quizzes[prev.currentQuizIndex - 1];
        return {
          ...prev,
          currentQuizIndex: prev.currentQuizIndex - 1,
          currentQuestionIndex: prevQuiz.questions.length - 1,
        };
      }

      return prev; // No previous question/quiz
    });
  }, []);

  const goToQuiz = useCallback((quizIndex: number) => {
    setState((prev) => ({
      ...prev,
      currentQuizIndex: quizIndex,
      currentQuestionIndex: 0,
    }));
  }, []);

  const submitTest = useCallback(async (): Promise<string | null> => {
    if (!state.testDetail) return null;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Chỉ lấy quizIds của các quiz có ít nhất một câu đã trả lời
      const quizIds = state.testDetail.quizzes
        .filter((quiz) =>
          quiz.questions.some(
            (q) =>
              state.answers[q.questionId] &&
              state.answers[q.questionId].length > 0,
          ),
        )
        .map((q) => q.quizId);

      // Đảm bảo answers là mảng các object {questionId, answerId} đúng format
      const answers: Array<{ questionId: string; answerId: string }> = [];
      Object.entries(state.answers).forEach(([questionId, answerIds]) => {
        answerIds.forEach((answerId) => {
          answers.push({ questionId, answerId });
        });
      });

      // Đảm bảo testId và startedAt đúng format
      const testId = state.testDetail.testId;
      const startedAt = new Date(
        Date.now() - (30 * 60 - state.timeRemaining) * 1000,
      ).toISOString();

      const testData = {
        testId,
        startedAt,
        quizIds,
        answers,
      };

      const result = await quizStore.submitTest(testData);

      console.log("📤 Submit test result:", result);

      setState((prev) => ({ ...prev, isLoading: false }));

      if (result.ok && result.studentTestId) {
        return result.studentTestId;
      } else {
        setState((prev) => ({
          ...prev,
          error: result.error || "Failed to submit test",
        }));
        return null;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to submit test",
      }));
      return null;
    }
  }, [state.testDetail, state.timeRemaining, state.answers, quizStore]);

  const setTimeRemaining = useCallback((time: number) => {
    setState((prev) => ({ ...prev, timeRemaining: time }));
  }, []);

  // Memoize actions to prevent infinite re-renders
  const actions = useMemo(
    () => ({
      loadTest,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      goToQuiz,
      submitTest,
      setTimeRemaining,
    }),
    [
      loadTest,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      goToQuiz,
      submitTest,
      setTimeRemaining,
    ],
  );

  return {
    state,
    actions,
  };
}
