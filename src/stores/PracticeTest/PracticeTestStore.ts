"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PracticeTestLanguageSelectsResponseEntity,
  PracticeTestSelectsResponseEntity,
  PracticeTestSelectResponseEntity,
} from "EduSmart/api/api-quiz-service";

// Types
export interface PracticeTestLanguage {
  languageId: number;
  name: string;
}

export interface PracticeProblem {
  problemId: string;
  title: string;
  description: string;
  difficulty: string;
}

export interface PracticeProblemDetail extends PracticeProblem {
  examples: PracticeExample[];
  testCases: PracticeTestCase[];
}

export interface PracticeExample {
  exampleId: string;
  exampleOrder: number;
  inputData: string;
  outputData: string;
  explanation?: string | null;
}

export interface PracticeTestCase {
  testcaseId: string;
  inputData: string;
  expectedOutput: string;
}

export interface PracticeTestSubmission {
  problemId: string;
  languageId: number;
  sourceCode: string;
}

interface PracticeTestState {
  // Available data
  languages: PracticeTestLanguage[];
  problems: PracticeProblem[];

  // Current test state
  currentProblemIndex: number;
  currentProblemDetail: PracticeProblemDetail | null;
  selectedLanguageId: number | null;

  // Code submissions
  submissions: Record<string, PracticeTestSubmission>; // problemId -> submission

  // Loading states
  isLoadingLanguages: boolean;
  isLoadingProblems: boolean;
  isLoadingProblemDetail: boolean;
  isSubmitting: boolean;

  // Completion tracking
  completedProblems: string[]; // problemIds
  isAllCompleted: boolean;

  // Actions
  setLanguages: (
    languages: PracticeTestLanguageSelectsResponseEntity[],
  ) => void;
  setProblems: (problems: PracticeTestSelectsResponseEntity[]) => void;
  setCurrentProblemDetail: (
    detail: PracticeTestSelectResponseEntity | null,
  ) => void;
  setSelectedLanguageId: (languageId: number) => void;

  saveSubmission: (
    problemId: string,
    languageId: number,
    sourceCode: string,
  ) => void;
  markProblemCompleted: (problemId: string) => void;

  goToNextProblem: () => void;
  goToPreviousProblem: () => void;
  goToProblem: (index: number) => void;

  setLoadingLanguages: (loading: boolean) => void;
  setLoadingProblems: (loading: boolean) => void;
  setLoadingProblemDetail: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;

  reset: () => void;

  // Getters
  getCurrentProblem: () => PracticeProblem | null;
  getSubmission: (problemId: string) => PracticeTestSubmission | null;
  getAllSubmissions: () => PracticeTestSubmission[];
  isProblemCompleted: (problemId: string) => boolean;
}

const initialState = {
  languages: [],
  problems: [],
  currentProblemIndex: 0,
  currentProblemDetail: null,
  selectedLanguageId: null,
  submissions: {},
  isLoadingLanguages: false,
  isLoadingProblems: false,
  isLoadingProblemDetail: false,
  isSubmitting: false,
  completedProblems: [],
  isAllCompleted: false,
};

export const usePracticeTestStore = create<PracticeTestState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Set languages
      setLanguages: (languages) => {
        const mapped: PracticeTestLanguage[] = languages
          .filter((l) => l.languageId !== undefined && l.name !== undefined)
          .map((l) => ({
            languageId: l.languageId!,
            name: l.name!,
          }));

        set({ languages: mapped });

        // Auto-select first language if none selected
        if (!get().selectedLanguageId && mapped.length > 0) {
          set({ selectedLanguageId: mapped[0].languageId });
        }
      },

      // Set problems
      setProblems: (problems) => {
        const mapped: PracticeProblem[] = problems
          .filter((p) => p.problemId && p.title && p.description)
          .map((p) => ({
            problemId: p.problemId!,
            title: p.title!,
            description: p.description!,
            difficulty: p.difficulty ?? "Unknown",
          }));

        set({ problems: mapped });
      },

      // Set current problem detail
      setCurrentProblemDetail: (detail) => {
        if (!detail) {
          set({ currentProblemDetail: null });
          return;
        }

        const examples: PracticeExample[] = (detail.examples ?? []).map(
          (e) => ({
            exampleId: e.exampleId ?? "",
            exampleOrder: e.exampleOrder ?? 0,
            inputData: e.inputData ?? "",
            outputData: e.outputData ?? "",
            explanation: e.explanation ?? null,
          }),
        );

        const testCases: PracticeTestCase[] = (detail.testCases ?? []).map(
          (t) => ({
            testcaseId: t.testcaseId ?? "",
            inputData: t.inputData ?? "",
            expectedOutput: t.expectedOutput ?? "",
          }),
        );

        const problemDetail: PracticeProblemDetail = {
          problemId: detail.problemId ?? "",
          title: detail.title ?? "",
          description: detail.description ?? "",
          difficulty: detail.difficulty ?? "Unknown",
          examples,
          testCases,
        };

        set({ currentProblemDetail: problemDetail });
      },

      // Set selected language
      setSelectedLanguageId: (languageId) => {
        set({ selectedLanguageId: languageId });
      },

      // Save submission
      saveSubmission: (problemId, languageId, sourceCode) => {
        set((state) => ({
          submissions: {
            ...state.submissions,
            [problemId]: { problemId, languageId, sourceCode },
          },
        }));
      },

      // Mark problem as completed
      markProblemCompleted: (problemId) => {
        set((state) => {
          const completedProblems = [...state.completedProblems];
          if (!completedProblems.includes(problemId)) {
            completedProblems.push(problemId);
          }

          const isAllCompleted =
            completedProblems.length === state.problems.length;

          return { completedProblems, isAllCompleted };
        });
      },

      // Navigation
      goToNextProblem: () => {
        set((state) => {
          const nextIndex = Math.min(
            state.currentProblemIndex + 1,
            state.problems.length - 1,
          );
          return { currentProblemIndex: nextIndex, currentProblemDetail: null };
        });
      },

      goToPreviousProblem: () => {
        set((state) => {
          const prevIndex = Math.max(state.currentProblemIndex - 1, 0);
          return { currentProblemIndex: prevIndex, currentProblemDetail: null };
        });
      },

      goToProblem: (index) => {
        set((state) => {
          const validIndex = Math.max(
            0,
            Math.min(index, state.problems.length - 1),
          );
          return {
            currentProblemIndex: validIndex,
            currentProblemDetail: null,
          };
        });
      },

      // Loading states
      setLoadingLanguages: (loading) => set({ isLoadingLanguages: loading }),
      setLoadingProblems: (loading) => set({ isLoadingProblems: loading }),
      setLoadingProblemDetail: (loading) =>
        set({ isLoadingProblemDetail: loading }),
      setSubmitting: (submitting) => set({ isSubmitting: submitting }),

      // Reset
      reset: () => set(initialState),

      // Getters
      getCurrentProblem: () => {
        const state = get();
        return state.problems[state.currentProblemIndex] ?? null;
      },

      getSubmission: (problemId) => {
        return get().submissions[problemId] ?? null;
      },

      getAllSubmissions: () => {
        return Object.values(get().submissions);
      },

      isProblemCompleted: (problemId) => {
        return get().completedProblems.includes(problemId);
      },
    }),
    {
      name: "practice-test-storage",
      partialize: (state) => ({
        currentProblemIndex: state.currentProblemIndex,
        selectedLanguageId: state.selectedLanguageId,
        submissions: state.submissions,
        completedProblems: state.completedProblems,
        isAllCompleted: state.isAllCompleted,
      }),
    },
  ),
);
