/*
 * Quiz Data Hook - Following Auth Pattern
 * Simple hook for components to access quiz API data
 * Pattern: Component → Hook → Store → Server Action → Backend
 */

import { useQuizStore } from "EduSmart/stores/Quiz/QuizStore";

/**
 * Hook for Quiz Data Operations (following Auth pattern)
 * Usage in components:
 *
 * const { quizzes, loadQuizzes, createTest, isLoading } = useQuizData();
 *
 * useEffect(() => {
 *   loadQuizzes();
 * }, []);
 */
export function useQuizData() {
    // Get state and actions from store (like useAuthStore)
    const {
        availableQuizzes,
        currentTest,
        testResult,
        isLoading,
        isSubmitting,
        error,
        loadAvailableQuizzes,
        createTest,
        submitTest,
        loadTestResult,
    } = useQuizStore();

    return {
        // Data
        quizzes: availableQuizzes,
        currentTest,
        testResult,

        // Status
        isLoading,
        isSubmitting,
        error,

        // Actions (simple & clean like auth)
        loadQuizzes: loadAvailableQuizzes,
        createTest,
        submitTest,
        loadTestResult,
    };
}

/**
 * Shorthand hook for just quiz list
 */
export function useQuizList() {
    const { quizzes, loadQuizzes, isLoading, error } = useQuizData();

    return {
        quizzes,
        loadQuizzes,
        isLoading,
        error,
    };
}

/**
 * Shorthand hook for test operations
 */
export function useQuizTest() {
    const {
        currentTest,
        testResult,
        createTest,
        submitTest,
        loadTestResult,
        isLoading,
        isSubmitting,
        error,
    } = useQuizData();

    return {
        currentTest,
        testResult,
        createTest,
        submitTest,
        loadTestResult,
        isLoading,
        isSubmitting,
        error,
    };
}
