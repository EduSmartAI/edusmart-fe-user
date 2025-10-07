import { useCallback, useMemo } from "react";
import { useQuizStore } from "EduSmart/stores/Quiz/QuizStore";
import { NavigationInfo } from "EduSmart/types/quiz";

/**
 * Custom hook for quiz navigation management
 * Provides: navigation controls, current quiz info, and navigation validation
 */

export const useQuizNavigation = () => {
    // ===== CORE STATE =====
    const {
        currentQuizId,
        selectedQuizIds,
        currentSeries,
        seriesStatus,
        // Actions
        setCurrentQuiz,
        navigateToNextQuiz,
        navigateToPreviousQuiz,
        getNavigationInfo,
        canNavigateToQuiz,
    } = useQuizStore((state) => ({
        currentQuizId: state.currentQuizId,
        selectedQuizIds: state.selectedQuizIds,
        currentSeries: state.currentSeries,
        seriesStatus: state.seriesStatus,
        navigationPermissions: state.navigationPermissions,
        setCurrentQuiz: state.setCurrentQuiz,
        navigateToNextQuiz: state.navigateToNextQuiz,
        navigateToPreviousQuiz: state.navigateToPreviousQuiz,
        getNavigationInfo: state.getNavigationInfo,
        canNavigateToQuiz: state.canNavigateToQuiz,
    }));

    // ===== COMPUTED VALUES =====
    /**
     * Current quiz object
     */
    const currentQuiz = useMemo(() => {
        if (!currentSeries || !currentQuizId) return null;
        return (
            currentSeries.quizzes.find((quiz) => quiz.id === currentQuizId) ||
            null
        );
    }, [currentSeries, currentQuizId]);

    /**
     * Navigation information (current position, has next/prev, etc.)
     */
    const navigationInfo = useMemo<NavigationInfo>(() => {
        return getNavigationInfo();
    }, [getNavigationInfo, currentQuizId, selectedQuizIds]);

    /**
     * Available quizzes for navigation (only selected quizzes)
     */
    const availableQuizzes = useMemo(() => {
        if (!currentSeries) return [];

        return currentSeries.quizzes.filter((quiz) =>
            selectedQuizIds.includes(quiz.id),
        );
    }, [currentSeries, selectedQuizIds]);

    /**
     * Quiz sequence with navigation permissions
     */
    const quizSequence = useMemo(() => {
        return availableQuizzes.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            canNavigate: canNavigateToQuiz(quiz.id),
            isCurrent: quiz.id === currentQuizId,
        }));
    }, [availableQuizzes, canNavigateToQuiz, currentQuizId]);

    // ===== NAVIGATION ACTIONS =====

    /**
     * Navigate to specific quiz by ID
     */
    const navigateToQuiz = useCallback(
        (quizId: string) => {
            const canNavigate = canNavigateToQuiz(quizId);

            if (!canNavigate) {
                console.warn(`Cannot navigate to quiz ${quizId}`);
                return false;
            }

            setCurrentQuiz(quizId);
            return true;
        },
        [canNavigateToQuiz, setCurrentQuiz],
    );

    /**
     * Navigate to next quiz in sequence
     */
    const goToNext = useCallback(() => {
        if (!navigationInfo.nextQuizId) {
            console.warn("No next quiz available");
            return false;
        }

        navigateToNextQuiz();
        return true;
    }, [navigationInfo.nextQuizId, navigateToNextQuiz]);

    /**
     * Navigate to previous quiz in sequence
     */
    const goToPrevious = useCallback(() => {
        if (!navigationInfo.prevQuizId) {
            console.warn("No previous quiz available");
            return false;
        }

        navigateToPreviousQuiz();
        return true;
    }, [navigationInfo.prevQuizId, navigateToPreviousQuiz]);

    /**
     * Navigate to first quiz in sequence
     */
    const goToFirst = useCallback(() => {
        if (availableQuizzes.length === 0) return false;

        const firstQuiz = availableQuizzes[0];
        return navigateToQuiz(firstQuiz.id);
    }, [availableQuizzes, navigateToQuiz]);

    /**
     * Navigate to last quiz in sequence
     */
    const goToLast = useCallback(() => {
        if (availableQuizzes.length === 0) return false;

        const lastQuiz = availableQuizzes[availableQuizzes.length - 1];
        return navigateToQuiz(lastQuiz.id);
    }, [availableQuizzes, navigateToQuiz]);

    // ===== NAVIGATION HELPERS =====

    /**
     * Get position info for current quiz
     */
    const getPositionInfo = useCallback(() => {
        if (!currentQuizId || availableQuizzes.length === 0) {
            return {
                current: 0,
                total: 0,
                position: "0/0",
                percentage: 0,
            };
        }

        const currentIndex = availableQuizzes.findIndex(
            (quiz) => quiz.id === currentQuizId,
        );
        const position = currentIndex + 1;
        const total = availableQuizzes.length;
        const percentage = Math.round((position / total) * 100);

        return {
            current: position,
            total,
            position: `${position}/${total}`,
            percentage,
        };
    }, [currentQuizId, availableQuizzes]);

    /**
     * Check if navigation is available
     */
    const canNavigate = useMemo(() => {
        return {
            toNext: !!navigationInfo.nextQuizId,
            toPrevious: !!navigationInfo.prevQuizId,
            toFirst:
                availableQuizzes.length > 0 &&
                currentQuizId !== availableQuizzes[0]?.id,
            toLast:
                availableQuizzes.length > 0 &&
                currentQuizId !==
                    availableQuizzes[availableQuizzes.length - 1]?.id,
        };
    }, [navigationInfo, availableQuizzes, currentQuizId]);

    /**
     * Get next quiz info
     */
    const getNextQuiz = useCallback(() => {
        if (!navigationInfo.nextQuizId) return null;

        return (
            availableQuizzes.find(
                (quiz) => quiz.id === navigationInfo.nextQuizId,
            ) || null
        );
    }, [navigationInfo, availableQuizzes]);

    /**
     * Get previous quiz info
     */
    const getPreviousQuiz = useCallback(() => {
        if (!navigationInfo.prevQuizId) return null;

        return (
            availableQuizzes.find(
                (quiz) => quiz.id === navigationInfo.prevQuizId,
            ) || null
        );
    }, [navigationInfo, availableQuizzes]);

    // ===== RETURN HOOK API =====
    return {
        // Current state
        currentQuiz,
        currentQuizId,
        seriesStatus,

        // Navigation info
        navigationInfo,
        positionInfo: getPositionInfo(),

        // Quiz data
        availableQuizzes,
        quizSequence,

        // Navigation capabilities
        canNavigate,

        // Navigation actions
        navigateToQuiz,
        goToNext,
        goToPrevious,
        goToFirst,
        goToLast,

        // Helper functions
        getNextQuiz,
        getPreviousQuiz,
        canNavigateToQuiz,
    };
};

/**
 * Specialized hook for simple controls for navigation buttons
 */
export const useQuizNavigationControls = () => {
    const { canNavigate, goToNext, goToPrevious, positionInfo, currentQuiz } =
        useQuizNavigation();

    return {
        // Simple navigation
        next: goToNext,
        previous: goToPrevious,

        // Navigation state
        canGoNext: canNavigate.toNext,
        canGoPrevious: canNavigate.toPrevious,

        // Position
        position: positionInfo.position,
        percentage: positionInfo.percentage,

        // Current quiz
        currentQuiz,
    };
};

/**
 * Hook for quiz menu/list navigation
 */
export const useQuizMenu = () => {
    const { quizSequence, navigateToQuiz, currentQuizId, availableQuizzes } =
        useQuizNavigation();

    return {
        quizzes: quizSequence,
        selectQuiz: navigateToQuiz,
        currentQuizId,
        totalQuizzes: availableQuizzes.length,
    };
};
