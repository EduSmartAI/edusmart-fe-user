/*
 * Quiz Result Hook
 * Hook to manage quiz result data and transform for QuizResultScreen component
 */

import { useState, useCallback, useEffect } from "react";
import { useQuizStore } from "EduSmart/stores/Quiz/QuizStore";
import { QuestionType, mapBackendQuestionType } from "EduSmart/types/quiz";
import type { StudentTestResult } from "EduSmart/app/(quiz)/quizAction";

// Interface matching QuizResultScreen expectations
interface QuizAnswer {
  questionId: string;
  selectedOptions: string[];
  correctOptions: string[];
  isCorrect: boolean;
}

interface QuizResultData {
  quizId: string;
  quizTitle: string;
  questions: Array<{
    id: string;
    text: string;
    type: QuestionType;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
  }>;
  userAnswers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
}

interface UseQuizResultResult {
  // Data
  results: QuizResultData[];

  // Status
  isLoading: boolean;
  error: string | null;

  // Actions
  loadResult: (studentTestId: string) => Promise<boolean>;

  // Utilities
  transformTestResult: (testResult: StudentTestResult) => QuizResultData[];
}

export function useQuizResult(): UseQuizResultResult {
  const { testResult, loadTestResult, isLoading, error } = useQuizStore();
  const [results, setResults] = useState<QuizResultData[]>([]);

  const transformTestResult = useCallback(
    (testResult: StudentTestResult): QuizResultData[] => {
      if (!testResult || !testResult.quizzesResults) {
        return [];
      }

      return testResult.quizzesResults.map((quizResult) => {
        const questions = quizResult.questionsResult.map((question) => ({
          id: question.questionId,
          text: question.questionText,
          type: mapBackendQuestionType(question.questionType || 1),
          options: question.answers.map((answer) => ({
            id: answer.answerId,
            text: answer.answerText,
            isCorrect: answer.isCorrectAnswer || false,
          })),
        }));

        const userAnswers: QuizAnswer[] = quizResult.questionsResult.map(
          (question) => {
            const selectedAnswers = question.answers.filter(
              (answer) => answer.selectedByStudent,
            );
            const correctAnswers = question.answers.filter(
              (answer) => answer.isCorrectAnswer,
            );

            return {
              questionId: question.questionId,
              selectedOptions: selectedAnswers.map((a) => a.answerId),
              correctOptions: correctAnswers.map((a) => a.answerId),
              isCorrect:
                selectedAnswers.length === correctAnswers.length &&
                selectedAnswers.every((selected) =>
                  correctAnswers.some(
                    (correct) => correct.answerId === selected.answerId,
                  ),
                ),
            };
          },
        );

        const totalQuestions = questions.length;
        const correctAnswers = userAnswers.filter(
          (answer) => answer.isCorrect,
        ).length;
        const score =
          totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0;

        // Calculate time spent (could be calculated from startedAt/finishedAt)
        const startTime = new Date(testResult.startedAt);
        const endTime = new Date(testResult.finishedAt);
        const timeSpent = Math.round(
          (endTime.getTime() - startTime.getTime()) / 1000,
        );

        return {
          quizId: quizResult.quizId,
          quizTitle: quizResult.title,
          questions,
          userAnswers,
          score,
          totalQuestions,
          correctAnswers,
          timeSpent,
        };
      });
    },
    [],
  );

  const loadResult = useCallback(
    async (studentTestId: string): Promise<boolean> => {
      const success = await loadTestResult(studentTestId);

      return success;
    },
    [loadTestResult],
  );

  // Transform testResult to results whenever testResult changes
  useEffect(() => {
    if (testResult) {
      const transformedResults = transformTestResult(testResult);
      setResults(transformedResults);
    }
  }, [testResult, transformTestResult]);

  return {
    results,
    isLoading,
    error,
    loadResult,
    transformTestResult,
  };
}
