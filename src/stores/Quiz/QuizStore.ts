/*
 * Quiz Store - Hybrid Pattern
 *
 * STRUCTURE:
 * 1. API Data & Methods (Following Auth Pattern) - NEW
 * 2. UI Flow & State Management (Original Quiz Logic) - EXISTING
 *
 * API USAGE (3-layer pattern):
 * - loadAvailableQuizzes() → getQuizListAction()
 * - createTest() → createTestAction()
 * - submitTest() → submitStudentTestAction()
 * - loadTestResult() → getStudentTestResultAction()
 *
 * UI USAGE (existing pattern):
 * - initializeSeries(), toggleQuizSelection(), updateAnswer(), etc.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  QuizStatus,
  SeriesStatus,
  QuizSeries,
  UserAnswer,
  Quiz,
  Question,
  SeriesProgress,
  NavigationInfo,
  QuizProgress,
  SubmissionValidation,
} from "EduSmart/types";
import {
  createUserAnswer,
  updateUserAnswer,
  calculateQuizCompletion,
  determineQuizStatus,
  calculateSeriesProgress,
  calculateNavigationInfo,
} from "EduSmart/utils/quiz";
import {
  getQuizListAction,
  createTestAction,
  submitStudentTestAction,
  getStudentTestResultAction,
  type QuizListItem,
  type TestDetail,
  type StudentTestResult,
} from "EduSmart/app/(quiz)/quizAction";
import { StoreError, createStoreError } from "EduSmart/types/errors";

// Helper types for better type safety

interface QuizStoreState {
  // ===== API DATA (Following Auth Pattern) =====
  availableQuizzes: QuizListItem[]; // Danh sách quiz có thể chọn
  currentTest: TestDetail | null; // Test hiện tại đã tạo
  testResult: StudentTestResult | null; // Kết quả test

  // ===== SERIES DATA =====
  currentSeries: QuizSeries | null;

  // ===== NAVIGATION =====
  currentQuizId: string | null;

  // ===== USER CHOICES =====
  selectedQuizIds: string[];

  // ===== ANSWERS DATA =====
  userAnswers: Record<string, UserAnswer[]>; // { quizId: UserAnswer[] }

  // ===== STATUS TRACKING =====
  seriesStatus: SeriesStatus; // Trạng thái tổng thể series
  quizStatuses: Record<string, QuizStatus>; // Trạng thái từng quiz { quizId: status }

  // ===== UI STATES =====
  isLoading: boolean;
  error: StoreError | null; // ✅ NEW: Typed error object with status
  isSubmitting: boolean;

  // ===== NAVIGATION RULES =====
  navigationPermissions: Record<string, boolean>; // Quiz nào có thể navigate tới

  // ===== VALIDATION STATES =====
  canSubmitSeries: boolean; // Có thể submit series không

  // ===== TIME TRACKING =====
  seriesStartedAt: Date | null; // Thời điểm bắt đầu series
  lastUpdatedAt: Date | null; // Lần update cuối
  quizStartTimes: Record<string, Date>;
  quizCompletionTimes: Record<string, Date>;
}

interface QuizStoreActions {
  // ===== API METHODS (Following Auth Pattern) =====
  loadAvailableQuizzes: () => Promise<boolean>; // Load danh sách quiz có thể chọn
  createTest: (
    quizIds: string[],
  ) => Promise<{ ok: boolean; testId?: string; error?: string }>; // Tạo test từ quiz được chọn
  submitTest: (testData: {
    testId: string;
    startedAt: string;
    quizIds: string[];
    answers: Array<{ questionId: string; answerId: string }>;
  }) => Promise<{ ok: boolean; learningPathId?: string; error?: string }>; // Submit test
  loadTestResult: (studentTestId: string) => Promise<boolean>; // Load kết quả test

  // ===== SERIES MANAGEMENT =====
  initializeSeries: (series: QuizSeries) => void;
  resetSeries: () => void;
  skipSeries: () => void;
  submitSeries: () => Promise<void>;

  // ===== QUIZ SELECTION =====
  toggleQuizSelection: (quizId: string) => void; // Chọn hoặc bỏ chọn quiz
  selectQuizzes: (quizIds: string[]) => void; // Chọn nhiều quiz hoặc all
  startSelectedQuizzes: () => void;

  // ===== NAVIGATION =====
  setCurrentQuiz: (quizId: string) => void;
  navigateToNextQuiz: () => void;
  navigateToPreviousQuiz: () => void;
  getNavigationInfo: () => NavigationInfo;

  // ===== ANSWER MANAGEMENT =====
  updateAnswer: (
    quizId: string,
    questionId: string,
    selectedOptions: string[],
  ) => void;
  clearAnswer: (quizId: string, questionId: string) => void; // Xoá câu trả lời của một câu hỏi
  clearQuizAnswers: (quizId: string) => void; // Xoá tất cả câu trả lời của một quiz

  // ===== COMPUTED PROPERTIES (thay vì state) =====
  canCompleteQuiz: (quizId: string) => boolean;
  getQuizProgress: (quizId: string) => QuizProgress;
  getSeriesProgress: () => SeriesProgress;

  // ===== VALIDATION =====
  validateSubmission: () => SubmissionValidation;
  canNavigateToQuiz: (quizId: string) => boolean;

  // ===== STATUS MANAGEMENT =====
  updateQuizStatus: (quizId: string) => void;
  updateSeriesStatus: () => void;
  getQuizStatus: (quizId: string) => QuizStatus;

  // ===== UI UTILITIES =====
  setLoading: (loading: boolean) => void;
  setError: (error: StoreError | null) => void; // ✅ NEW: Accept StoreError
  setSubmitting: (submitting: boolean) => void;

  // ===== DATA ACCESS HELPERS =====
  getQuizById: (quizId: string) => Quiz | null;
  getQuestionById: (quizId: string, questionId: string) => Question | null;
  getAnswersForQuiz: (quizId: string) => UserAnswer[];
  getAnswerForQuestion: (
    quizId: string,
    questionId: string,
  ) => UserAnswer | null;

  // ===== ANALYTICS & TRACKING =====
  getTimeSpentOnQuiz: (quizId: string) => number; // Minutes
  getTotalTimeSpent: () => number; // Total minutes on series
  markQuizStartTime: (quizId: string) => void; // Đánh dấu thời gian bắt đầu quiz
  markQuizCompletionTime: (quizId: string) => void; // Đánh dấu thời gian hoàn thành quiz
}

// Default state values
const defaultState: QuizStoreState = {
  // API data
  availableQuizzes: [],
  currentTest: null,
  testResult: null,

  // Series data
  currentSeries: null,

  // Navigation
  currentQuizId: null,

  // User choices - selected quizzes
  selectedQuizIds: [],

  // Answers data
  userAnswers: {},

  // Status tracking
  seriesStatus: SeriesStatus.QUIZ_SELECTION,
  quizStatuses: {},

  // UI states
  isLoading: false,
  error: null,
  isSubmitting: false,

  // Navigation rules
  navigationPermissions: {},

  // Validation states
  canSubmitSeries: false,

  // Time tracking
  seriesStartedAt: null,
  lastUpdatedAt: null,
  quizStartTimes: {},
  quizCompletionTimes: {},
};

// Create Zustand Store với devtools
type QuizStore = QuizStoreState & QuizStoreActions;

export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Spread default state
        ...defaultState,

        // ===== SERIES MANAGEMENT =====
        initializeSeries: (series: QuizSeries) => {
          set({
            currentSeries: series,
            seriesStatus: SeriesStatus.QUIZ_SELECTION,
            selectedQuizIds: [],
            currentQuizId: null,
            userAnswers: {},
            quizStatuses: {},
            navigationPermissions: {},
            canSubmitSeries: false,
            seriesStartedAt: new Date(),
            lastUpdatedAt: new Date(),
            error: null,
          });
        },

        resetSeries: () => {
          set(defaultState);
        },

        // ===== API METHODS =====
        loadAvailableQuizzes: async () => {
          try {
            set({ isLoading: true, error: null });
            const result = await getQuizListAction();

            if (result.ok) {
              set({
                availableQuizzes: result.data.response || [],
                isLoading: false,
              });
              return true;
            }

            // ✅ NEW: Store typed error object
            set({
              error: createStoreError({
                error: result.error || "Failed to load quizzes",
                status: result.status,
              }),
              isLoading: false,
            });
            return false;
          } catch (error) {
            set({
              error: createStoreError({
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to load quizzes",
              }),
              isLoading: false,
            });
            return false;
          }
        },

        // Lấy test từ selected quizzes được chọn
        createTest: async (quizIds: string[]) => {
          try {
            set({ isLoading: true, error: null });
            const result = await createTestAction(quizIds);

            if (result.ok) {
              set({
                currentTest: result.data.response,
                isLoading: false,
              });
              return {
                ok: true,
                testId: result.data.response?.testId,
              };
            }

            // ✅ NEW: Create StoreError from action result
            const storeError = createStoreError({
              error: result.error || "Failed to create test",
              status: result.status,
            });
            set({ error: storeError, isLoading: false });
            return {
              ok: false,
              error: result.error || "Failed to create test",
            };
          } catch (error) {
            // ✅ NEW: Create StoreError from exception
            const storeError = createStoreError({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create test",
            });
            set({ error: storeError, isLoading: false });
            return { ok: false, error: storeError.message };
          }
        },

        submitTest: async (testData) => {
          try {
            set({ isSubmitting: true, error: null });

            // 🚀 DETAILED QUIZ STORE SUBMISSION LOGGING
            console.group("🔥 QUIZ STORE SUBMISSION DEBUG");
            console.log(
              "📋 Test Data from Store:",
              JSON.stringify(testData, null, 2),
            );
            console.log("🆔 Test ID:", testData.testId);
            console.log("⏰ Started At:", testData.startedAt);
            console.log("📚 Quiz IDs:", testData.quizIds);
            console.log("📝 Answers Count:", testData.answers.length);
            console.log("🎯 Answers Details:");
            testData.answers.forEach((answer, index) => {
              console.log(
                `  ${index + 1}. Question: ${answer.questionId} -> Answer: ${answer.answerId}`,
              );
            });
            console.groupEnd();

            const result = await submitStudentTestAction(testData);

            // 📤 QUIZ STORE RESULT LOGGING
            console.group("📤 QUIZ STORE RESULT DEBUG");
            console.log("✅ Submission Result:", result);
            console.log("🎯 Success:", result.ok);
            if (result.ok) {
              console.log(
                "🆔 Learning Path ID:",
                result.data?.response?.learningPathId,
              );
            } else {
              console.log("❌ Error:", result.error);
            }
            console.groupEnd();

            if (result.ok) {
              set({ isSubmitting: false });
              return {
                ok: true,
                learningPathId: result.data.response?.learningPathId,
              };
            }

            // ✅ NEW: Create StoreError from action result
            const storeError = createStoreError({
              error: result.error || "Failed to submit test",
              status: result.status,
            });
            set({ error: storeError, isSubmitting: false });
            return {
              ok: false,
              error: result.error || "Failed to submit test",
            };
          } catch (error) {
            console.error("💥 Quiz Store Submission Exception:", error);
            // ✅ NEW: Create StoreError from exception
            const storeError = createStoreError({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to submit test",
            });
            set({ error: storeError, isSubmitting: false });
            return { ok: false, error: storeError.message };
          }
        },

        loadTestResult: async (studentTestId: string) => {
          try {
            set({ isLoading: true, error: null });
            const result = await getStudentTestResultAction(studentTestId);

            if (result.ok) {
              set({
                testResult: result.data.response,
                isLoading: false,
              });
              return true;
            }

            // ✅ NEW: Create StoreError from action result
            set({
              error: createStoreError({
                error: result.error || "Failed to load test result",
                status: result.status,
              }),
              isLoading: false,
            });
            return false;
          } catch (error) {
            // ✅ NEW: Create StoreError from exception
            set({
              error: createStoreError({
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to load test result",
              }),
              isLoading: false,
            });
            return false;
          }
        },

        skipSeries: () => {
          console.log("skipSeries - placeholder");
        },

        submitSeries: async () => {
          console.log("submitSeries - placeholder");
        },

        // ===== QUIZ SELECTION =====
        toggleQuizSelection: (quizId: string) => {
          const state = get();

          // Kiểm tra nếu quizId có tồn tại trong current series không
          const quiz = state.currentSeries?.quizzes.find(
            (q) => q.id === quizId,
          );
          if (!quiz) {
            console.warn(`Quiz with id ${quizId} not found in current series`);
            return;
          }

          // Kiểm tra nếu quizId đã được chọn rồi
          const isSelected = state.selectedQuizIds.includes(quizId);

          let newSelectedIds: string[];

          if (isSelected) {
            // Loại khỏi selection
            newSelectedIds = state.selectedQuizIds.filter(
              (id) => id !== quizId,
            );

            // Nếu quiz hiện tại bị bỏ chọn, reset currentQuizId
            const newCurrentQuizId =
              state.currentQuizId === quizId ? null : state.currentQuizId;

            set({
              selectedQuizIds: newSelectedIds,
              currentQuizId: newCurrentQuizId,
              lastUpdatedAt: new Date(),
            });
          } else {
            // Thêm vào selection
            newSelectedIds = [...state.selectedQuizIds, quizId];

            set({
              selectedQuizIds: newSelectedIds,
              lastUpdatedAt: new Date(),
            });

            console.log(`Quiz ${quizId} selected`);
          }

          // Update quiz status after selection change
          get().updateQuizStatus(quizId);

          // Update series status
          get().updateSeriesStatus();

          // If no quizzes selected anymore, reset series status
          if (newSelectedIds.length === 0) {
            set({
              seriesStatus: SeriesStatus.QUIZ_SELECTION,
            });
          }
        },

        selectQuizzes: (quizIds: string[]) => {
          const state = get();

          if (!state.currentSeries) {
            console.warn("No current series available for quiz selection");
            return;
          }

          // Lấy danh sách all quizIds có thể chọn từ current series
          const availableQuizIds = state.currentSeries.quizzes.map((q) => q.id);

          // Validate quizIds đầu vào
          const validQuizIds = quizIds.filter((id) =>
            availableQuizIds.includes(id),
          );

          // Filter invalid quizIds
          const invalidIds = quizIds.filter(
            (id) => !availableQuizIds.includes(id),
          );
          if (invalidIds.length > 0) {
            console.warn(`Invalid quiz IDs ignored: ${invalidIds.join(", ")}`);
          }

          // Update selection
          set({
            selectedQuizIds: validQuizIds,
            lastUpdatedAt: new Date(),
          });

          // Nếu currentQuizId không còn trong selectedQuizIds, reset nó
          if (
            state.currentQuizId &&
            !validQuizIds.includes(state.currentQuizId)
          ) {
            set({ currentQuizId: null });
          }

          // Update status cho các quiz liên quan
          // First, reset status for previously selected but now deselected quizzes
          const deselectedIds = state.selectedQuizIds.filter(
            (id) => !validQuizIds.includes(id),
          );
          deselectedIds.forEach((quizId) => {
            get().updateQuizStatus(quizId);
          });

          // Then update status for newly selected quizzes
          validQuizIds.forEach((quizId) => {
            get().updateQuizStatus(quizId);
          });

          // Update series status
          get().updateSeriesStatus();

          console.log(`Selected ${validQuizIds.length} quizzes:`, validQuizIds);
        },

        startSelectedQuizzes: () => {
          const state = get();

          // Validate: ít nhất một quiz được chọn
          if (state.selectedQuizIds.length === 0) {
            console.warn("No quizzes selected to start");
            set({
              error: createStoreError({
                error: "Vui lòng chọn ít nhất một quiz để bắt đầu",
                status: 400, // ✅ Validation error = 400
              }),
            });
            return;
          }

          // Validate: current series phải tồn tại
          if (!state.currentSeries) {
            console.warn("No current series available to start");
            set({
              error: createStoreError({
                error: "Không tìm thấy bộ quiz để bắt đầu",
                status: 404, // ✅ Not Found = 404
              }),
            });
            return;
          }

          // Set current quiz là quiz đầu tiên trong selectedQuizIds (phần tử đầu)
          const firstQuizId = state.selectedQuizIds[0];

          // Update series status: IN_PROGRESS
          set({
            seriesStatus: SeriesStatus.IN_PROGRESS,
            currentQuizId: firstQuizId,
            lastUpdatedAt: new Date(),
            error: null, // Clear any previous errors
          });

          // Mark start time cho first quiz
          get().markQuizStartTime(firstQuizId);

          // Update status cho first quiz
          get().updateQuizStatus(firstQuizId);

          // Update overall series status
          get().updateSeriesStatus();

          console.log(
            `Started quiz series with ${state.selectedQuizIds.length} selected quizzes`,
          );
          console.log(`Current quiz set to: ${firstQuizId}`);
        },

        // ===== NAVIGATION =====
        setCurrentQuiz: (quizId: string) => {
          const state = get();

          // Kiểm tra xem quizId có tồn tại trong current series không
          const quiz = state.currentSeries?.quizzes.find(
            (q) => q.id === quizId,
          );
          if (!quiz) {
            console.warn(`Quiz with id ${quizId} not found in current series`);
            return;
          }

          // Kiểm tra xem quizId có được chọn không
          if (!state.selectedQuizIds.includes(quizId)) {
            console.warn(`Quiz ${quizId} is not in selected quizzes list`);
            return;
          }

          // Update current quiz
          set({
            currentQuizId: quizId,
            lastUpdatedAt: new Date(),
          });

          // Mark quiz start time nếu chưa có (user lần đầu vào quiz này)
          if (!state.quizStartTimes[quizId]) {
            get().markQuizStartTime(quizId);
          }

          // Update quiz status khi navigate đến
          get().updateQuizStatus(quizId);

          // Check và update series status
          get().updateSeriesStatus();
        },

        navigateToNextQuiz: () => {
          const navInfo = get().getNavigationInfo();

          // Check nếu có thể navigate next
          if (!navInfo.canGoNext) {
            console.warn(
              "Cannot navigate to next quiz: already at last quiz or no next quiz available",
            );
            return;
          }

          // Check nếu có nextQuizId
          if (!navInfo.nextQuizId) {
            console.warn("Cannot navigate to next quiz: nextQuizId is null");
            return;
          }

          // Navigate đến next quiz
          get().setCurrentQuiz(navInfo.nextQuizId);

          console.log(`Navigated to next quiz: ${navInfo.nextQuizId}`);
        },

        navigateToPreviousQuiz: () => {
          const navInfo = get().getNavigationInfo();

          // Check nếu có thể navigate previous
          if (!navInfo.canGoPrev) {
            console.warn(
              "Cannot navigate to previous quiz: already at first quiz or no previous quiz available",
            );
            return;
          }

          // Check nếu có prevQuizId
          if (!navInfo.prevQuizId) {
            console.warn(
              "Cannot navigate to previous quiz: prevQuizId is null",
            );
            return;
          }

          // Navigate đến previous quiz
          get().setCurrentQuiz(navInfo.prevQuizId);

          console.log(`Navigated to previous quiz: ${navInfo.prevQuizId}`);
        },

        getNavigationInfo: (): NavigationInfo => {
          const state = get();

          // Nếu không có series hoặc không có quiz nào được chọn
          if (!state.currentSeries || state.selectedQuizIds.length === 0) {
            return {
              currentIndex: -1,
              totalSelected: 0,
              canGoNext: false,
              canGoPrev: false,
              nextQuizId: null,
              prevQuizId: null,
            };
          }

          // Sử dụng business logic để tính toán navigation info
          const navInfo = calculateNavigationInfo(
            state.selectedQuizIds,
            state.currentQuizId,
          );

          return {
            currentIndex: navInfo.currentIndex,
            totalSelected: navInfo.totalSelected,
            canGoNext: navInfo.canGoNext,
            canGoPrev: navInfo.canGoPrev,
            nextQuizId: navInfo.nextQuizId,
            prevQuizId: navInfo.prevQuizId,
          };
        },

        // ===== ANSWER MANAGEMENT =====
        updateAnswer: (
          quizId: string,
          questionId: string,
          selectedOptions: string[],
        ) => {
          const state = get();
          const existingAnswers = state.userAnswers[quizId] || [];

          // Tìm index câu trả lời hiện có cho questionId
          const existingIndex = existingAnswers.findIndex(
            (answer) => answer.questionId === questionId,
          );

          let updatedAnswers: UserAnswer[];

          // Nếu đã có câu trả lời, cập nhật nó
          if (existingIndex >= 0) {
            // Cập nhật câu trả lời hiện có sử dụng business logic
            const updatedAnswer = updateUserAnswer(
              existingAnswers[existingIndex],
              selectedOptions,
            );
            updatedAnswers = [...existingAnswers];
            updatedAnswers[existingIndex] = updatedAnswer;
          } else {
            // Chưa có câu trả lời, tạo mới
            const newAnswer = createUserAnswer(questionId, selectedOptions);
            updatedAnswers = [...existingAnswers, newAnswer];
          }

          // Update state
          set({
            userAnswers: {
              ...state.userAnswers, // giữ nguyên answers cho các quizId khác
              [quizId]: updatedAnswers,
            },
            lastUpdatedAt: new Date(),
          });

          // Trigger cập nhật trạng thái quiz và series
          get().updateQuizStatus(quizId);
          get().updateSeriesStatus();

          // Đánh dấu thời gian bắt đầu quiz nếu chưa có
          if (existingIndex === -1 && !state.quizStartTimes[quizId]) {
            get().markQuizStartTime(quizId);
          }
        },

        // Xóa 1 câu trả lời
        clearAnswer: (quizId: string, questionId: string) => {
          const state = get();
          const existingAnswers = state.userAnswers[quizId] || [];

          // Tìm index câu trả lời hiện có cho questionId
          const answerIndex = existingAnswers.findIndex(
            (answer) => answer.questionId === questionId,
          );

          if (answerIndex >= 0) {
            // Nếu tìm thấy câu trả lời, loại bỏ nó
            const updatedAnswers = existingAnswers.filter(
              (answer) => answer.questionId !== questionId,
            );

            // Update state
            set({
              userAnswers: {
                ...state.userAnswers,
                [quizId]: updatedAnswers,
              },
              lastUpdatedAt: new Date(),
            });

            // Trigger cập nhật trạng thái quiz và series
            get().updateQuizStatus(quizId);
            get().updateSeriesStatus();
          }
        },

        // Xoá tất cả câu trả lời của một quiz
        clearQuizAnswers: (quizId: string) => {
          const state = get();

          // Xóa all answers cho quizId
          const updatedUserAnswers = { ...state.userAnswers };
          delete updatedUserAnswers[quizId];

          // Xóa time tracking cho quizId
          const updatedStartTimes = { ...state.quizStartTimes };
          delete updatedStartTimes[quizId];

          const updatedCompletionTimes = {
            ...state.quizCompletionTimes,
          };
          delete updatedCompletionTimes[quizId];

          // Update state
          set({
            userAnswers: updatedUserAnswers,
            quizStartTimes: updatedStartTimes,
            quizCompletionTimes: updatedCompletionTimes,
            lastUpdatedAt: new Date(),
          });

          // Reset quiz status
          const updatedStatuses = { ...state.quizStatuses };
          delete updatedStatuses[quizId];

          set({
            quizStatuses: updatedStatuses,
          });

          // Trigger cập nhật trạng thái quiz và series
          get().updateQuizStatus(quizId);
          get().updateSeriesStatus();
        },

        // ===== COMPUTED PROPERTIES =====
        canCompleteQuiz: (quizId: string): boolean => {
          const state = get();

          // Validate quiz tồn tại trong current series
          const quiz = state.currentSeries?.quizzes.find(
            (q) => q.id === quizId,
          );
          if (!quiz) {
            return false;
          }

          // Get user answers cho quiz này
          const answers = state.userAnswers[quizId] || [];

          // Business logic - check completion
          const completion = calculateQuizCompletion(quiz, answers);

          return completion.isCompleted;
        },

        getQuizProgress: (quizId: string): QuizProgress => {
          const state = get();

          // Validate quiz tồn tại trong current series
          const quiz = state.currentSeries?.quizzes.find(
            (q) => q.id === quizId,
          );

          if (!quiz) {
            // Nếu quiz không tồn tại, trả về progress mặc định
            return {
              total: 0,
              answered: 0,
              completed: false,
              percentage: 0,
            };
          }

          // Lấy user answers cho quiz này
          const answers = state.userAnswers[quizId] || [];

          // Business logic - calculate completion
          const completion = calculateQuizCompletion(quiz, answers);

          return {
            total: completion.totalQuestions,
            answered: completion.answeredCount,
            completed: completion.isCompleted,
            percentage: completion.progress,
          };
        },

        getSeriesProgress: (): SeriesProgress => {
          const state = get();

          // Nếu không có current series, trả về progress mặc định
          if (!state.currentSeries) {
            return {
              totalQuizzes: 0,
              selectedQuizzes: 0,
              completedQuizzes: 0,
              inProgressQuizzes: 0,
              totalQuestions: 0,
              answeredQuestions: 0,
              overallProgress: 0,
              canSubmit: false,
            };
          }

          // Business logic - calculate series progress
          const seriesProgress = calculateSeriesProgress(
            state.currentSeries,
            state.selectedQuizIds,
            state.userAnswers,
          );

          return {
            totalQuizzes: seriesProgress.totalQuizzes,
            selectedQuizzes: seriesProgress.selectedQuizzes,
            completedQuizzes: seriesProgress.completedQuizzes,
            inProgressQuizzes: seriesProgress.inProgressQuizzes,
            totalQuestions: seriesProgress.totalQuestions,
            answeredQuestions: seriesProgress.answeredQuestions,
            overallProgress: seriesProgress.overallProgress,
            canSubmit: seriesProgress.canSubmit,
          };
        },

        // ===== VALIDATION =====
        validateSubmission: (): SubmissionValidation => {
          const state = get();

          // Check nếu có current series
          if (!state.currentSeries) {
            return {
              canSubmit: false,
              missingRequirements: ["Không tìm thấy bộ quiz để submit"],
              completedQuizzes: [],
              incompleteQuizzes: [],
            };
          }

          // Validate có quizzes được selected
          if (state.selectedQuizIds.length === 0) {
            return {
              canSubmit: false,
              missingRequirements: ["Vui lòng chọn ít nhất một quiz để submit"],
              completedQuizzes: [],
              incompleteQuizzes: [],
            };
          }

          // Get progress data
          const seriesProgress = get().getSeriesProgress();

          // Analyze each selected quiz
          const completedQuizzes: string[] = [];
          const incompleteQuizzes: string[] = [];
          const missingRequirements: string[] = [];

          state.selectedQuizIds.forEach((quizId) => {
            const quiz = state.currentSeries!.quizzes.find(
              (q) => q.id === quizId,
            );
            if (!quiz) {
              incompleteQuizzes.push(quizId);
              missingRequirements.push(`Quiz ${quizId} không tồn tại`);
              return;
            }

            const quizProgress = get().getQuizProgress(quizId);

            if (quizProgress.completed) {
              completedQuizzes.push(quizId);
            } else {
              incompleteQuizzes.push(quizId);
              const missingQuestions =
                quizProgress.total - quizProgress.answered;
              missingRequirements.push(
                `Quiz "${quiz.title}": còn ${missingQuestions} câu hỏi chưa trả lời`,
              );
            }
          });

          // Determine if can submit
          const canSubmit =
            seriesProgress.canSubmit && incompleteQuizzes.length === 0;

          // Add general requirements if can't submit
          if (!canSubmit && missingRequirements.length === 0) {
            missingRequirements.push("Vui lòng hoàn thành tất cả quiz đã chọn");
          }

          return {
            canSubmit,
            missingRequirements,
            completedQuizzes,
            incompleteQuizzes,
          };
        },

        canNavigateToQuiz: (quizId: string): boolean => {
          const state = get();

          // Validate series exists
          if (!state.currentSeries) {
            console.warn("No current series available for navigation check");
            return false;
          }

          // Validate quiz exists in current series
          const quiz = state.currentSeries.quizzes.find((q) => q.id === quizId);
          if (!quiz) {
            console.warn(`Quiz ${quizId} not found in current series`);
            return false;
          }

          // Check if quiz is selected
          if (!state.selectedQuizIds.includes(quizId)) {
            console.warn(`Quiz ${quizId} is not selected - cannot navigate`);
            return false;
          }

          // Check series status - must be IN_PROGRESS to navigate
          if (state.seriesStatus !== SeriesStatus.IN_PROGRESS) {
            console.warn(
              `Series status is ${state.seriesStatus} - navigation not allowed`,
            );
            return false;
          }

          // Check if navigation permissions are explicitly set
          if (state.navigationPermissions.hasOwnProperty(quizId)) {
            return state.navigationPermissions[quizId];
          }

          // Default navigation logic: can navigate to selected quizzes during IN_PROGRESS
          const canNavigate = true;

          // Cache permission for future checks
          set({
            navigationPermissions: {
              ...state.navigationPermissions,
              [quizId]: canNavigate,
            },
          });

          return canNavigate;
        },

        // ===== STATUS MANAGEMENT =====
        updateQuizStatus: (quizId: string) => {
          const state = get();

          // Validate quiz tồn tại trong current series
          const quiz = state.currentSeries?.quizzes.find(
            (q) => q.id === quizId,
          );
          if (!quiz) {
            console.warn(`Quiz ${quizId} not found in current series`);
            return;
          }

          // Calculate old, new status
          const oldStatus = state.quizStatuses[quizId];
          const newStatus = determineQuizStatus(
            quizId,
            state.selectedQuizIds,
            state.userAnswers,
            quiz,
          );

          // Check completion transitions
          const wasCompleted = oldStatus === QuizStatus.COMPLETED;
          const isNowCompleted = newStatus === QuizStatus.COMPLETED;
          const hasCompletionTime = !!state.quizCompletionTimes[quizId];

          // Update status
          set({
            quizStatuses: {
              ...state.quizStatuses,
              [quizId]: newStatus,
            },
            lastUpdatedAt: new Date(),
          });

          // Handle completion time logic
          if (isNowCompleted) {
            if (!hasCompletionTime) {
              // First time completing - mark completion time
              get().markQuizCompletionTime(quizId);
              console.log(`Quiz ${quizId} completed for first time`);
            } else if (!wasCompleted) {
              // Re-completing after becoming incomplete - update completion time
              get().markQuizCompletionTime(quizId);
              console.log(`Quiz ${quizId} re-completed - time updated`);
            }
            // If wasCompleted && isNowCompleted: no change (still completed)
          }

          console.log(`Quiz ${quizId} status: ${oldStatus} → ${newStatus}`);
        },

        updateSeriesStatus: () => {
          const state = get();

          // Validate current series tồn tại
          if (!state.currentSeries) {
            console.warn("No current series to update status");
            return;
          }

          // Get series progress để determine status
          const progress = get().getSeriesProgress();

          let newSeriesStatus = state.seriesStatus;

          // Xác định new series status dựa trên progress
          if (progress.selectedQuizzes === 0) {
            // No quizzes selected
            newSeriesStatus = SeriesStatus.QUIZ_SELECTION;
          } else if (
            progress.completedQuizzes === progress.selectedQuizzes &&
            progress.selectedQuizzes > 0
          ) {
            // All selected quizzes completed
            newSeriesStatus = SeriesStatus.COMPLETED;
          } else if (progress.answeredQuestions > 0) {
            // Some questions answered
            newSeriesStatus = SeriesStatus.IN_PROGRESS;
          } else if (progress.selectedQuizzes > 0) {
            // Quizzes selected but no answers yet
            newSeriesStatus = SeriesStatus.IN_PROGRESS;
          }

          // Update series status and submission readiness
          set({
            seriesStatus: newSeriesStatus,
            canSubmitSeries: progress.canSubmit,
            lastUpdatedAt: new Date(),
          });

          console.log(`Series status updated to: ${newSeriesStatus}`);
          console.log(`Can submit series: ${progress.canSubmit}`);
        },

        // Lấy trạng thái quiz, với caching để tối ưu performance. Nếu chưa có trong cache, tính toán và lưu lại.
        getQuizStatus: (quizId: string): QuizStatus => {
          const state = get();

          // Check if status is already cached
          if (state.quizStatuses[quizId]) {
            return state.quizStatuses[quizId];
          }

          // If not cached, calculate it using business logic
          const quiz = state.currentSeries?.quizzes.find(
            (q) => q.id === quizId,
          );
          if (!quiz) {
            return QuizStatus.NOT_STARTED;
          }

          // Business logic to determine status
          const status = determineQuizStatus(
            quizId,
            state.selectedQuizIds,
            state.userAnswers,
            quiz,
          );

          // Cache the calculated status
          set({
            quizStatuses: {
              ...state.quizStatuses,
              [quizId]: status,
            },
          });

          return status;
        },

        // ===== UI UTILITIES =====
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: StoreError | null) => {
          set({ error });
        },

        setSubmitting: (submitting: boolean) => {
          set({ isSubmitting: submitting });
        },

        // ===== DATA ACCESS HELPERS =====
        getQuizById: (quizId: string): Quiz | null => {
          console.log("getQuizById:", quizId);
          const state = get();
          return (
            state.currentSeries?.quizzes.find((q) => q.id === quizId) || null
          );
        },

        getQuestionById: (
          quizId: string,
          questionId: string,
        ): Question | null => {
          console.log("getQuestionById:", { quizId, questionId });
          const quiz = get().getQuizById(quizId);
          return quiz?.questions.find((q) => q.id === questionId) || null;
        },

        getAnswersForQuiz: (quizId: string): UserAnswer[] => {
          console.log("getAnswersForQuiz:", quizId);
          return get().userAnswers[quizId] || [];
        },

        getAnswerForQuestion: (
          quizId: string,
          questionId: string,
        ): UserAnswer | null => {
          console.log("getAnswerForQuestion:", {
            quizId,
            questionId,
          });
          const answers = get().getAnswersForQuiz(quizId);
          return answers.find((a) => a.questionId === questionId) || null;
        },

        // ===== ANALYTICS & TRACKING =====
        // Quiz-level
        getTimeSpentOnQuiz: (quizId: string): number => {
          const state = get();

          // Check if quiz has start time
          const startTime = state.quizStartTimes[quizId];
          if (!startTime) {
            return 0; // Quiz chưa được start
          }

          // Check if quiz has completion time
          const completionTime = state.quizCompletionTimes[quizId];

          let endTime: Date;
          if (completionTime) {
            // Quiz đã completed, dùng completion time
            endTime = completionTime;
          } else {
            // Quiz chưa completed, dùng current time
            endTime = new Date();
          }

          // Calculate time difference in minutes
          const timeSpentMs = endTime.getTime() - startTime.getTime();
          const timeSpentMinutes = Math.round(timeSpentMs / (1000 * 60));

          return Math.max(0, timeSpentMinutes); // Ensure non-negative
        },

        // Series-level
        getTotalTimeSpent: (): number => {
          const state = get();

          // If no series started, return 0
          if (!state.seriesStartedAt) {
            return 0;
          }

          // Calculate total time from series start to now
          const currentTime = new Date();
          const totalTimeMs =
            currentTime.getTime() - state.seriesStartedAt.getTime();
          const totalTimeMinutes = Math.round(totalTimeMs / (1000 * 60));

          return Math.max(0, totalTimeMinutes); // Ensure non-negative
        },

        markQuizStartTime: (quizId: string) => {
          console.log("markQuizStartTime:", quizId);
          const state = get();
          set({
            quizStartTimes: {
              ...state.quizStartTimes,
              [quizId]: new Date(),
            },
          });
        },

        markQuizCompletionTime: (quizId: string) => {
          console.log("markQuizCompletionTime:", quizId);
          const state = get();
          set({
            quizCompletionTimes: {
              ...state.quizCompletionTimes,
              [quizId]: new Date(),
            },
          });
        },
      }),
      {
        name: "quiz-store",
        version: 1,
        partialize: (state) => ({
          currentSeries: state.currentSeries,
          currentQuizId: state.currentQuizId,
          selectedQuizIds: state.selectedQuizIds,
          userAnswers: state.userAnswers,
          seriesStatus: state.seriesStatus,
          quizStatuses: state.quizStatuses,
          navigationPermissions: state.navigationPermissions,
          seriesStartedAt: state.seriesStartedAt,
          lastUpdatedAt: state.lastUpdatedAt,
          quizStartTimes: state.quizStartTimes,
          quizCompletionTimes: state.quizCompletionTimes,
        }),
        migrate: (persistedState: unknown, version: number) => {
          // Migrate data từ old versions (lưu trong localStorage) sang new versions
          console.log("Migrating quiz-store from version", version);

          // Safe casting
          const state = persistedState as Partial<QuizStoreState>;

          // User có data từ version 0 (không có time tracking)
          if (version < 1) {
            return {
              ...state,
              quizStartTimes: {},
              quizCompletionTimes: {},
            };
          }
          return persistedState; // Version đã mới, không cần migrate
        },
        merge: (persistedState, currentState) => {
          // Type guard: đảm bảo persistedState là object hợp lệ
          const safePersistedState =
            (persistedState as Partial<QuizStoreState>) || {};

          return {
            ...currentState, // Start với state hiện tại
            ...safePersistedState, // Override với persisted state (đã validate)
            // Force reset UI states
            isLoading: false, // Always start fresh
            error: null, // Clear old errors
            isSubmitting: false, // Reset submission state
          };
        },
      },
    ),
    {
      name: "QuizStore", // Tên hiển thị trong DevTools
      enabled: process.env.NODE_ENV === "development", // // Chỉ enable khi development
    },
  ),
);
