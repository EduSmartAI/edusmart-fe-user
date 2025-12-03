"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Survey1FormValues,
  Survey2FormValues,
  Survey3FormValues,
} from "EduSmart/types";
import {
  submitSurveyAction,
  getSurveyRecommendationsAction,
  saveSurveyDraftAction,
  loadSurveyDraftAction,
  getSemesterAction,
  getMajorAction,
  getLearningGoalAction,
  getTechnologyAction,
  getSurveyListAction,
  // getSurveyDetailAction, // Unused - can be removed
  getSurveyByCodeAction,
} from "EduSmart/app/(survey)/surveyAction";
import { StoreError, createStoreError } from "EduSmart/types/errors";
// Client API imports removed - now using server actions to avoid CORS
// Types will be imported from the API client

// Interface removed - using direct types from server actions

export interface SurveyRecommendations {
  courses: Array<{
    courseId: string;
    courseName: string;
    difficulty: string;
    priority: number;
  }>;
  learningPath: Array<{
    stepId: string;
    stepName: string;
    description: string;
    estimatedWeeks: number;
  }>;
  skills: Array<{
    skillId: string;
    skillName: string;
    currentLevel: string;
    targetLevel: string;
  }>;
}

export interface SurveyState {
  // Survey data
  survey1Data: Survey1FormValues | null;
  survey2Data: Survey2FormValues | null;
  survey3Data: Survey3FormValues | null;

  // Progress tracking
  currentStep: number;
  completedSteps: number[];

  // Submission state
  isSubmitting: boolean;
  surveyId: string | null;
  submitError: StoreError | null; // ✅ NEW: Typed error object

  // Draft state
  isDraftSaving: boolean;
  lastSavedAt: string | null;

  // Recommendations
  recommendations: SurveyRecommendations | null;

  // ===== API DATA =====
  // Form options data (loaded from server actions to avoid CORS)
  semesters: Array<{
    semesterId: string;
    semesterName: string;
    semesterNumber: number;
  }>;
  majors: Array<{
    majorId: string;
    majorName: string;
    majorCode: string;
    parentMajorId?: string;
  }>;
  technologies: Array<{
    technologyId: string;
    technologyName: string;
    technologyType: number;
  }>;
  learningGoals: Array<{
    learningGoalId: string;
    learningGoalName: string;
    learningGoalType: number;
  }>;
  surveyList: Array<{
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
  }>;
  interestSurveyDetail: {
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
    questions?: Array<{
      questionId: string;
      questionText: string;
      questionType: number;
      answers: Array<{
        answerId: string;
        answerText: string;
        isCorrect: boolean;
      }>;
    }>;
  } | null;
  habitSurveyDetail: {
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
    questions?: Array<{
      questionId: string;
      questionText: string;
      questionType: number;
      answers: Array<{
        answerId: string;
        answerText: string;
        isCorrect: boolean;
      }>;
    }>;
  } | null;

  // Loading states for client API calls
  isLoadingSemesters: boolean;
  isLoadingMajors: boolean;
  isLoadingTechnologies: boolean;
  isLoadingLearningGoals: boolean;
  isLoadingSurveyList: boolean;
  isLoadingInterestSurvey: boolean;
  isLoadingHabitSurvey: boolean;
}

export interface SurveyActions {
  // Data updates
  updateSurveyData: (
    step: number,
    data: Survey1FormValues | Survey2FormValues | Survey3FormValues,
  ) => void;

  // Progress management
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Submission management - Internal state setters
  setSubmittingState: (isSubmitting: boolean) => void;
  setSurveyId: (id: string | null) => void;
  setSubmitError: (error: StoreError | null) => void; // ✅ NEW: Accept StoreError

  // Draft management - Internal state setters
  setDraftSaving: (isSaving: boolean) => void;
  markDraftSaved: () => void;

  // API Actions - Store gọi server actions
  submitSurvey: (isWantToTakeTest: boolean) => Promise<{
    success: boolean;
    surveyId?: string;
    learningPathId?: string; // When isWantToTakeTest = false
    error?: string;
  }>;
  loadRecommendations: (
    surveyId?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  saveDraft: () => Promise<{ success: boolean; error?: string }>;
  loadDraft: () => Promise<{ success: boolean; error?: string }>;

  // Utility
  resetSurvey: () => void;
  clearSurveyData: () => void;

  // Getters
  getCompletedStepsCount: () => number;
  getProgress: () => number;
  isStepCompleted: (step: number) => boolean;
  canGoToStep: (step: number) => boolean;
  getAllSurveyData: () => {
    survey1Data: Survey1FormValues | null;
    survey2Data: Survey2FormValues | null;
    survey3Data: Survey3FormValues | null;
  };

  // Recommendations state
  setRecommendations: (data: SurveyRecommendations | null) => void;

  // ===== API CONFIGURATION =====
  // No configuration needed - using client APIs directly

  // ===== API ACTIONS =====
  // Load form data from API
  loadSemesters: () => Promise<{ success: boolean; error?: string }>;
  loadMajors: () => Promise<{ success: boolean; error?: string }>;
  loadTechnologies: () => Promise<{ success: boolean; error?: string }>;
  loadLearningGoals: () => Promise<{ success: boolean; error?: string }>;
  loadSurveyList: () => Promise<{ success: boolean; error?: string }>;
  loadInterestSurvey: () => Promise<{ success: boolean; error?: string }>;
  loadHabitSurvey: () => Promise<{ success: boolean; error?: string }>;

  // Initialize all form data (called on app start or form open)
  initializeFormData: () => Promise<{ success: boolean; error?: string }>;
}

const initialState: SurveyState = {
  survey1Data: null,
  survey2Data: null,
  survey3Data: null,
  currentStep: 1,
  completedSteps: [],
  isSubmitting: false,
  surveyId: null,
  submitError: null,
  isDraftSaving: false,
  lastSavedAt: null,
  recommendations: null,

  // API Data
  semesters: [],
  majors: [],
  technologies: [],
  learningGoals: [],
  surveyList: [],
  interestSurveyDetail: null,
  habitSurveyDetail: null,

  // No API configuration needed - using client APIs directly

  // Loading states
  isLoadingSemesters: false,
  isLoadingMajors: false,
  isLoadingTechnologies: false,
  isLoadingLearningGoals: false,
  isLoadingSurveyList: false,
  isLoadingInterestSurvey: false,
  isLoadingHabitSurvey: false,
};

export const useSurveyStore = create<SurveyState & SurveyActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Data updates
      updateSurveyData: (step, data) => {
        switch (step) {
          case 1:
            set({ survey1Data: data as Survey1FormValues });
            break;
          case 2:
            set({ survey2Data: data as Survey2FormValues });
            break;
          case 3:
            set({ survey3Data: data as Survey3FormValues });
            break;
          default:
            break;
        }
      },

      // Progress management
      setCurrentStep: (step) => set({ currentStep: step }),

      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      goToNextStep: () =>
        set((state) => ({
          currentStep:
            state.currentStep < 3 ? state.currentStep + 1 : state.currentStep,
        })),

      goToPreviousStep: () =>
        // set currentStep về tối thiểu 1
        set((state) => ({
          currentStep:
            state.currentStep > 1 ? state.currentStep - 1 : state.currentStep,
        })),

      // ===== API CONFIGURATION =====
      // No configuration methods needed - using client APIs directly

      // Submission management
      setSubmittingState: (isSubmitting) => set({ isSubmitting }),

      setSurveyId: (id) => set({ surveyId: id }),

      setSubmitError: (error) => set({ submitError: error }),

      // Draft management
      setDraftSaving: (isSaving) => set({ isDraftSaving: isSaving }),

      markDraftSaved: () => set({ lastSavedAt: new Date().toISOString() }),

      // Utility
      resetSurvey: () => {
        // Xóa dữ liệu khảo sát khỏi localStorage TRƯỚC KHI reset state
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("survey-storage");
            console.log("✅ Removed survey-storage from localStorage");
          } catch (err) {
            console.warn(
              "Không thể xóa survey-storage khỏi localStorage:",
              err,
            );
          }
        }
        // Reset state về initialState
        set(initialState);
        console.log("✅ Survey state reset to initial");
      },

      clearSurveyData: () =>
        set({
          survey1Data: null,
          survey2Data: null,
          survey3Data: null,
          completedSteps: [],
          currentStep: 1,
        }),

      // Getters
      getCompletedStepsCount: () => get().completedSteps.length,

      getProgress: () => {
        const completedCount = get().completedSteps.length;
        return Math.round((completedCount / 3) * 100);
      },

      isStepCompleted: (step) => get().completedSteps.includes(step),

      canGoToStep: (step) => {
        const state = get();
        if (step === 1) return true;

        for (let i = 1; i < step; i++) {
          if (!state.completedSteps.includes(i)) {
            return false;
          }
        }
        return true;
      },

      getAllSurveyData: () => {
        const state = get();
        return {
          survey1Data: state.survey1Data,
          survey2Data: state.survey2Data,
          survey3Data: state.survey3Data,
        };
      },

      // Recommendations management
      setRecommendations: (data) => set({ recommendations: data }),

      // API Actions - Store gọi server actions
      submitSurvey: async (isWantToTakeTest: boolean) => {
        const state = get();
        const allData = state;

        if (
          !allData.survey1Data ||
          !allData.survey2Data ||
          !allData.survey3Data
        ) {
          // ✅ NEW: Create StoreError for validation
          set({
            submitError: createStoreError({
              error: "Hãy hoàn thành tất cả khảo sát trước khi gửi.",
              status: 400, // Validation error
            }),
          });
          return { success: false, error: "Dữ liệu khảo sát không đầy đủ" };
        }

        set({ isSubmitting: true, submitError: null });

        try {
          const apiData = {
            survey1Data: allData.survey1Data || undefined,
            survey2Data: allData.survey2Data || undefined,
            survey3Data: allData.survey3Data || undefined,
            isWantToTakeTest, // ✅ Pass parameter to server action
          };

          // 🔍 DEBUG: Log data being sent to server action
          console.group("🏪 [SURVEY STORE] Calling submitSurveyAction");
          console.log("API Data:", apiData);
          console.log("isWantToTakeTest:", isWantToTakeTest);
          console.log(
            "Survey 1 - Interest Answers:",
            apiData.survey1Data?.interestSurveyAnswers,
          );
          console.log(
            "Survey 3 - Study Habits:",
            apiData.survey3Data?.studyHabits,
          );
          console.groupEnd();

          const result = await submitSurveyAction(apiData);

          console.log('[SURVEY STORE] submitSurveyAction result:', result);

          if (result.ok) {
            // ✅ Handle two cases based on isWantToTakeTest
            if (!isWantToTakeTest && result.surveyId) {
              // Case 1: Use transcript - response contains learningPathId
              set({ surveyId: result.surveyId });
              console.log(
                `✅ [SURVEY STORE] Survey submitted (Transcript flow). LearningPathId: ${result.surveyId}`,
              );
              return { 
                success: true, 
                learningPathId: result.surveyId,
                surveyId: result.surveyId 
              };
            } else if (isWantToTakeTest) {
              // Case 2: Take quiz - response is null, just success
              console.log(
                `✅ [SURVEY STORE] Survey submitted (Quiz flow). Response: null`,
              );

              // Auto-load recommendations (optional, don't fail if this fails)
              // Only for quiz flow
              if (result.surveyId) {
                set({ surveyId: result.surveyId });
                try {
                  const loadResult = await getSurveyRecommendationsAction(
                    result.surveyId,
                  );
                  if (loadResult.ok && loadResult.data) {
                    set({ recommendations: loadResult.data.recommendations });
                  }
                } catch (recommendationError) {
                  console.warn(
                    "Failed to load recommendations:",
                    recommendationError,
                  );
                  // Don't fail the entire submission if recommendations fail
                }
              }

              return { success: true };
            }

            // Fallback - shouldn't reach here
            return { success: true, surveyId: result.surveyId };
          } else {
            // ✅ NEW: Create StoreError from action result
            const storeError = createStoreError({
              error:
                result.error || "Không thể gửi khảo sát. Vui lòng thử lại sau.",
              status: result.status,
            });

            set({ submitError: storeError });
            return { success: false, error: storeError.message };
          }
        } catch (error) {
          // ✅ NEW: Create StoreError from exception
          const storeError = createStoreError({
            error:
              error instanceof Error
                ? error.message
                : "Không thể gửi khảo sát. Vui lòng thử lại sau.",
          });
          set({ submitError: storeError });
          return { success: false, error: storeError.message };
        } finally {
          set({ isSubmitting: false });
        }
      },

      loadRecommendations: async (surveyId?: string) => {
        const state = get();
        const targetSurveyId = surveyId || state.surveyId;

        if (!targetSurveyId) {
          return { success: false, error: "Không tìm thấy ID khảo sát" };
        }

        try {
          const result = await getSurveyRecommendationsAction(targetSurveyId);

          if (result.ok && result.data) {
            set({ recommendations: result.data.recommendations });
            return { success: true };
          } else {
            return { success: false, error: result.error };
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Thất bại khi tải khuyến nghị";
          return { success: false, error: errorMessage };
        }
      },

      saveDraft: async () => {
        const state = get();
        set({ isDraftSaving: true });

        try {
          const apiData = {
            survey1Data: state.survey1Data || undefined,
            survey2Data: state.survey2Data || undefined,
            survey3Data: state.survey3Data || undefined,
          };

          const result = await saveSurveyDraftAction(apiData);

          if (result.ok) {
            set({ lastSavedAt: new Date().toISOString() });
          }

          return { success: result.ok, error: result.error };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Thất bại khi lưu nháp";
          return { success: false, error: errorMessage };
        } finally {
          set({ isDraftSaving: false });
        }
      },

      loadDraft: async () => {
        try {
          const result = await loadSurveyDraftAction();

          if (result.ok && result.data) {
            const { survey1Data, survey2Data, survey3Data, lastStep } =
              result.data;

            // Restore data và progress
            const updates: Partial<SurveyState> = { currentStep: lastStep };

            if (survey1Data) {
              updates.survey1Data = survey1Data;
              updates.completedSteps = [1];
            }
            if (survey2Data) {
              updates.survey2Data = survey2Data;
              updates.completedSteps = [...(updates.completedSteps || []), 2];
            }
            if (survey3Data) {
              updates.survey3Data = survey3Data;
              updates.completedSteps = [...(updates.completedSteps || []), 3];
            }

            set(updates);
            return { success: true };
          } else {
            return { success: false, error: result.error };
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Thất bại khi tải nháp";
          return { success: false, error: errorMessage };
        }
      },

      // ===== API METHODS =====
      loadSemesters: async () => {
        try {
          set({ isLoadingSemesters: true });
          const response = await getSemesterAction();

          if (response.ok && response.data) {
            set({ semesters: response.data, isLoadingSemesters: false });
            return { success: true };
          } else {
            set({ isLoadingSemesters: false });
            return {
              success: false,
              error:
                response.error ||
                "Không thể tải danh sách kỳ học. Vui lòng thử lại sau.",
            };
          }
        } catch (error) {
          set({ isLoadingSemesters: false });
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách kỳ học. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },

      loadMajors: async () => {
        try {
          set({ isLoadingMajors: true });
          const response = await getMajorAction();

          if (response.ok && response.data) {
            set({ majors: response.data, isLoadingMajors: false });
            return { success: true };
          } else {
            set({ isLoadingMajors: false });
            return {
              success: false,
              error:
                response.error ||
                "Không thể tải danh sách chuyên ngành. Vui lòng thử lại sau.",
            };
          }
        } catch (error) {
          set({ isLoadingMajors: false });
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách chuyên ngành. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },

      loadTechnologies: async () => {
        try {
          set({ isLoadingTechnologies: true });
          const response = await getTechnologyAction();

          if (response.ok && response.data) {
            set({ technologies: response.data, isLoadingTechnologies: false });
            return { success: true };
          } else {
            set({ isLoadingTechnologies: false });
            return {
              success: false,
              error:
                response.error ||
                "Không thể tải danh sách công nghệ. Vui lòng thử lại sau.",
            };
          }
        } catch (error) {
          set({ isLoadingTechnologies: false });
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách công nghệ. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },

      loadLearningGoals: async () => {
        try {
          set({ isLoadingLearningGoals: true });
          const response = await getLearningGoalAction();

          if (response.ok && response.data) {
            set({
              learningGoals: response.data,
              isLoadingLearningGoals: false,
            });
            return { success: true };
          } else {
            set({ isLoadingLearningGoals: false });
            return {
              success: false,
              error:
                response.error ||
                "Không thể tải danh sách mục tiêu học tập. Vui lòng thử lại sau.",
            };
          }
        } catch (error) {
          set({ isLoadingLearningGoals: false });
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách mục tiêu học tập. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },

      loadSurveyList: async () => {
        try {
          set({ isLoadingSurveyList: true });
          const response = await getSurveyListAction();

          if (response.ok && response.data) {
            set({ surveyList: response.data, isLoadingSurveyList: false });
            return { success: true };
          } else {
            set({ isLoadingSurveyList: false });
            return {
              success: false,
              error:
                response.error ||
                "Không thể tải danh sách khảo sát. Vui lòng thử lại sau.",
            };
          }
        } catch (error) {
          set({ isLoadingSurveyList: false });
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách khảo sát. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },

      loadInterestSurvey: async () => {
        try {
          set({ isLoadingInterestSurvey: true });
          const response = await getSurveyByCodeAction("INTEREST");

          if (response.ok && response.data) {
            set({
              interestSurveyDetail: response.data,
              isLoadingInterestSurvey: false,
            });
            return { success: true };
          } else {
            set({ isLoadingInterestSurvey: false });
            return {
              success: false,
              error:
                response.error ||
                "Không thể tải khảo sát sở thích. Vui lòng thử lại sau.",
            };
          }
        } catch (error) {
          set({ isLoadingInterestSurvey: false });
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể tải khảo sát sở thích. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },

      loadHabitSurvey: async () => {
        try {
          set({ isLoadingHabitSurvey: true });
          const response = await getSurveyByCodeAction("HABIT");

          if (response.ok && response.data) {
            set({
              habitSurveyDetail: response.data,
              isLoadingHabitSurvey: false,
            });
            return { success: true };
          } else {
            set({ isLoadingHabitSurvey: false });
            return {
              success: false,
              error:
                response.error ||
                "Không thể tải khảo sát thói quen học tập. Vui lòng thử lại sau.",
            };
          }
        } catch (error) {
          set({ isLoadingHabitSurvey: false });
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể tải khảo sát thói quen học tập. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },

      initializeFormData: async () => {
        try {
          // Load all necessary data in parallel
          const [
            semestersResult,
            majorsResult,
            technologiesResult,
            learningGoalsResult,
            interestSurveyResult,
            habitSurveyResult,
          ] = await Promise.allSettled([
            get().loadSemesters(),
            get().loadMajors(),
            get().loadTechnologies(),
            get().loadLearningGoals(),
            get().loadInterestSurvey(),
            get().loadHabitSurvey(),
          ]);

          // Check for any failures
          const failures = [
            semestersResult,
            majorsResult,
            technologiesResult,
            learningGoalsResult,
            interestSurveyResult,
            habitSurveyResult,
          ].filter(
            (result) =>
              result.status === "rejected" ||
              (result.status === "fulfilled" && !result.value.success),
          );

          if (failures.length > 0) {
            console.warn("Some data failed to load:", failures);
            const errorMessages = failures
              .map((failure) => {
                if (failure.status === "fulfilled" && failure.value.error) {
                  return failure.value.error;
                }
                return "Unknown error";
              })
              .join(", ");

            return {
              success: false,
              error: `Không thể tải dữ liệu khảo sát: ${errorMessages}`,
            };
          }

          return { success: true };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Không thể khởi tạo dữ liệu khảo sát. Vui lòng thử lại sau.";
          return { success: false, error: errorMessage };
        }
      },
    }),
    {
      name: "survey-storage",
      partialize: (state) => ({
        survey1Data: state.survey1Data,
        survey2Data: state.survey2Data,
        survey3Data: state.survey3Data,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        lastSavedAt: state.lastSavedAt,
      }),
    },
  ),
);
