/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useQuizStore } from "EduSmart/stores/Quiz/QuizStore";
import { SeriesStatus, QuizStatus } from "EduSmart/types/quiz";

/**
 * Custom hook for quiz progress tracking
 * Provides: individual quiz progress, series progress, time tracking, error handling
 */
export const useQuizProgress = () => {
    // ===== CORE STATE =====
    const {
        currentSeries,
        currentQuizId,
        selectedQuizIds,
        seriesStatus,
        quizStatuses,
        userAnswers,
        // Progress functions
        getQuizProgress,
        getSeriesProgress,
        getTimeSpentOnQuiz,
        getTotalTimeSpent,
    } = useQuizStore((state) => ({
        currentSeries: state.currentSeries,
        currentQuizId: state.currentQuizId,
        selectedQuizIds: state.selectedQuizIds,
        userAnswers: state.userAnswers,
        seriesStatus: state.seriesStatus,
        quizStatuses: state.quizStatuses,
        getQuizProgress: state.getQuizProgress,
        getSeriesProgress: state.getSeriesProgress,
        getTimeSpentOnQuiz: state.getTimeSpentOnQuiz,
        getTotalTimeSpent: state.getTotalTimeSpent,
    }));

    // ===== SAFE PROGRESS STATE =====
    const safeProgress = useMemo(() => {
        // EDGE CASE 1: No Series Loaded
        if (!currentSeries) {
            return {
                hasSeries: false,
                hasSelection: false,
                notStarted: true,
                ready: false, // True nghĩa là có thể tính progress. False nghĩa là không có data để tính
                completed: false,
                message: "No quiz series loaded",
                errorType: "NO_SERIES" as const,
            };
        }

        // EDGE CASE 2: No Quizzes Selected
        if (selectedQuizIds.length === 0) {
            return {
                hasSeries: true,
                hasSelection: false,
                notStarted: true,
                ready: false,
                completed: false,
                message: "No quizzes selected",
                errorType: "NO_SELECTION" as const,
            };
        }

        // EDGE CASE 3: Series Not Started (QUIZ_SELECTION)
        if (seriesStatus === SeriesStatus.QUIZ_SELECTION) {
            return {
                hasSeries: true,
                hasSelection: true,
                notStarted: true,
                ready: false,
                completed: false,
                message:
                    "Series not started yet - please select quizzes and begin",
                errorType: "NOT_STARTED" as const,
            };
        }

        // EDGE CASE 4: Series Completed/Submitted
        if (
            seriesStatus === SeriesStatus.SUBMITTED ||
            seriesStatus === SeriesStatus.SKIPPED
        ) {
            return {
                hasSeries: true,
                hasSelection: true,
                notStarted: false,
                ready: true,
                completed: true,
                message: `Series ${seriesStatus.toLowerCase()}`,
                errorType: null,
            };
        }

        // NORMAL CASE: Series In Progress
        return {
            hasSeries: true,
            hasSelection: true,
            notStarted: false,
            ready: true,
            completed: false,
            message: null,
            errorType: null,
        };
    }, [currentSeries, selectedQuizIds, seriesStatus]);

    // ===== CURRENT QUIZ PROGRESS =====
    const currentQuizProgress = useMemo(() => {
        // Handle no current quiz
        if (!currentQuizId) {
            return {
                quizId: null,
                title: null,
                completed: false,
                answered: 0,
                total: 0,
                percentage: 0,
                status: null,
                timeSpent: 0,
                error: "No current quiz selected",
            };
        }

        // Handle invalid quiz ID
        const quiz = currentSeries?.quizzes.find((q) => q.id === currentQuizId);
        if (!quiz) {
            return {
                quizId: currentQuizId,
                title: `Quiz ${currentQuizId}`,
                completed: false,
                answered: 0,
                total: 0,
                percentage: 0,
                status: QuizStatus.NOT_STARTED,
                timeSpent: 0,
                error: `Quiz not found in series`,
            };
        }

        try {
            const progress = getQuizProgress(currentQuizId);
            const timeSpent = getTimeSpentOnQuiz(currentQuizId);

            // Safe calculations
            const total = progress.total || 0;
            const answered = progress.answered || 0;
            const percentage =
                total > 0 ? Math.round((answered / total) * 100) : 0;

            return {
                quizId: currentQuizId,
                title: quiz.title,
                completed: progress.completed || false,
                answered,
                total,
                percentage,
                status: quizStatuses[currentQuizId] || QuizStatus.NOT_STARTED,
                timeSpent,
                error: null,
            };
        } catch (error) {
            console.error(
                `Error calculating progress for quiz ${currentQuizId}:`,
                error,
            );
            return {
                quizId: currentQuizId,
                title: quiz?.title || `Quiz ${currentQuizId}`,
                completed: false,
                answered: 0,
                total: 0,
                percentage: 0,
                status: QuizStatus.NOT_STARTED,
                timeSpent: 0,
                error: "Failed to calculate quiz progress",
            };
        }
    }, [
        currentQuizId,
        currentSeries,
        getQuizProgress,
        getTimeSpentOnQuiz,
        quizStatuses,
        userAnswers,
    ]);

    // ===== SERIES PROGRESS =====
    const seriesProgress = useMemo(() => {
        if (!safeProgress.ready) {
            return {
                selectedQuizzes: 0,
                completedQuizzes: 0,
                totalQuestions: 0,
                answeredQuestions: 0,
                canSubmit: false,
                percentage: 0,
                totalTimeSpent: 0,
                averageTimePerQuiz: 0,
                error: safeProgress.message,
            };
        }

        try {
            const progress = getSeriesProgress();
            const totalTimeSpent = getTotalTimeSpent();

            // Safe calculations
            const selectedQuizzes = selectedQuizIds.length;
            const totalQuestions = progress.totalQuestions || 0;
            const answeredQuestions = progress.answeredQuestions || 0;
            const percentage =
                totalQuestions > 0
                    ? Math.round((answeredQuestions / totalQuestions) * 100)
                    : 0;
            const averageTimePerQuiz =
                selectedQuizzes > 0
                    ? Math.round(totalTimeSpent / selectedQuizzes)
                    : 0;

            return {
                selectedQuizzes,
                completedQuizzes: progress.completedQuizzes || 0,
                totalQuestions,
                answeredQuestions,
                canSubmit: progress.canSubmit || false,
                percentage,
                totalTimeSpent,
                averageTimePerQuiz,
                error: null,
            };
        } catch (error) {
            console.error("Error calculating series progress:", error);
            return {
                selectedQuizzes: selectedQuizIds.length,
                completedQuizzes: 0,
                totalQuestions: 0,
                answeredQuestions: 0,
                canSubmit: false,
                percentage: 0,
                totalTimeSpent: 0,
                averageTimePerQuiz: 0,
                error: "Failed to calculate series progress",
            };
        }
    }, [
        safeProgress.ready,
        safeProgress.message,
        getSeriesProgress,
        getTotalTimeSpent,
        selectedQuizIds.length,
    ]);

    // ===== ALL QUIZZES PROGRESS =====
    const allQuizzesProgress = useMemo(() => {
        if (!safeProgress.ready || !currentSeries) {
            return [];
        }

        try {
            return selectedQuizIds
                .map((quizId) => {
                    const quiz = currentSeries.quizzes.find(
                        (q) => q.id === quizId,
                    );

                    // Handle quiz not found
                    if (!quiz) {
                        return {
                            quizId,
                            title: `Quiz ${quizId}`,
                            completed: false,
                            answered: 0,
                            total: 0,
                            percentage: 0,
                            status: QuizStatus.NOT_STARTED,
                            timeSpent: 0,
                            isCurrent: quizId === currentQuizId,
                            error: `Quiz not found in series`,
                        };
                    }

                    try {
                        const progress = getQuizProgress(quizId);
                        const timeSpent = getTimeSpentOnQuiz(quizId);

                        // Safe calculations
                        const total = progress.total || 0;
                        const answered = progress.answered || 0;
                        const percentage =
                            total > 0
                                ? Math.round((answered / total) * 100)
                                : 0;

                        return {
                            quizId,
                            title: quiz.title,
                            completed: progress.completed || false,
                            answered,
                            total,
                            percentage,
                            status:
                                quizStatuses[quizId] || QuizStatus.NOT_STARTED,
                            timeSpent,
                            isCurrent: quizId === currentQuizId,
                            error: null,
                        };
                    } catch (quizError) {
                        console.error(
                            `Error calculating progress for quiz ${quizId}:`,
                            quizError,
                        );
                        return {
                            quizId,
                            title: quiz.title,
                            completed: false,
                            answered: 0,
                            total: 0,
                            percentage: 0,
                            status: QuizStatus.NOT_STARTED,
                            timeSpent: 0,
                            isCurrent: quizId === currentQuizId,
                            error: `Failed to calculate progress`,
                        };
                    }
                })
                .filter(Boolean);
        } catch (error) {
            console.error("Error calculating all quizzes progress:", error);
            return [];
        }
    }, [
        safeProgress.ready,
        currentSeries,
        selectedQuizIds,
        getQuizProgress,
        getTimeSpentOnQuiz,
        quizStatuses,
        currentQuizId,
        userAnswers,
    ]);

    // ===== PROGRESS SUMMARY =====
    const progressSummary = useMemo(() => {
        if (!safeProgress.ready) {
            return {
                quizzes: {
                    total: 0,
                    completed: 0,
                    remaining: 0,
                    percentage: 0,
                },
                questions: {
                    total: 0,
                    answered: 0,
                    remaining: 0,
                    percentage: 0,
                },
                time: {
                    total: 0,
                    averagePerQuiz: 0,
                },
                error: safeProgress.message,
            };
        }

        try {
            const totalQuizzes = selectedQuizIds.length;
            const completedQuizzes = allQuizzesProgress.filter(
                (q) => q?.completed,
            ).length;
            const totalQuestions = allQuizzesProgress.reduce(
                (sum, q) => sum + (q?.total || 0),
                0,
            );
            const answeredQuestions = allQuizzesProgress.reduce(
                (sum, q) => sum + (q?.answered || 0),
                0,
            );

            return {
                quizzes: {
                    total: totalQuizzes,
                    completed: completedQuizzes,
                    remaining: totalQuizzes - completedQuizzes,
                    percentage:
                        totalQuizzes > 0
                            ? Math.round(
                                  (completedQuizzes / totalQuizzes) * 100,
                              )
                            : 0,
                },
                questions: {
                    total: totalQuestions,
                    answered: answeredQuestions,
                    remaining: totalQuestions - answeredQuestions,
                    percentage:
                        totalQuestions > 0
                            ? Math.round(
                                  (answeredQuestions / totalQuestions) * 100,
                              )
                            : 0,
                },
                time: {
                    total: seriesProgress.totalTimeSpent,
                    averagePerQuiz: seriesProgress.averageTimePerQuiz,
                },
                error: null,
            };
        } catch (error) {
            console.error("Error calculating progress summary:", error);
            return {
                quizzes: {
                    total: 0,
                    completed: 0,
                    remaining: 0,
                    percentage: 0,
                },
                questions: {
                    total: 0,
                    answered: 0,
                    remaining: 0,
                    percentage: 0,
                },
                time: { total: 0, averagePerQuiz: 0 },
                error: "Failed to calculate progress summary",
            };
        }
    }, [
        safeProgress.ready,
        safeProgress.message,
        selectedQuizIds.length,
        allQuizzesProgress,
        seriesProgress,
    ]);

    // ===== ERROR RECOVERY =====
    const errorRecovery = useMemo(
        () => ({
            canRecover: (errorType: string | null) => {
                switch (errorType) {
                    case "NO_SERIES":
                        return false; // Need to load series first
                    case "NO_SELECTION":
                        return true; // Can recover by selecting quizzes
                    case "NOT_STARTED":
                        return true; // Can recover by starting series
                    default:
                        return false;
                }
            },

            getRecoveryAction: (errorType: string | null) => {
                switch (errorType) {
                    case "NO_SELECTION":
                        return "Please select at least one quiz to continue";
                    case "NOT_STARTED":
                        return "Click 'Start Quiz' to begin the series";
                    default:
                        return null;
                }
            },
        }),
        [],
    );

    // ===== RETURN HOOK API =====
    return {
        // Status information
        ...safeProgress,

        // Expose safeProgress explicitly for consumers
        safeProgress,

        // Progress data (only if ready)
        ...(safeProgress.ready && {
            currentQuizProgress,
            seriesProgress,
            allQuizzesProgress,
            progressSummary,
        }),

        // Error information
        hasErrors:
            !safeProgress.ready ||
            currentQuizProgress.error ||
            seriesProgress.error ||
            progressSummary.error,

        // Recovery helpers
        errorRecovery,

        // Raw functions always available
        getQuizProgress,
        getSeriesProgress,
        getTimeSpentOnQuiz,
        getTotalTimeSpent,
    };
};

/**
 * Specialized hook for current quiz progress only
 */
export const useCurrentQuizProgress = () => {
    const { currentQuizProgress, hasErrors, safeProgress } = useQuizProgress();

    return {
        ...currentQuizProgress,
        hasErrors,
        isReady: safeProgress.ready,
    };
};

/**
 * Specialized hook for series progress overview
 */
export const useSeriesProgress = () => {
    const { seriesProgress, progressSummary, hasErrors, safeProgress } =
        useQuizProgress();

    return {
        seriesProgress,
        progressSummary,
        hasErrors,
        isReady: safeProgress.ready,
    };
};

/**
 * Specialized hook for progress bars and visual indicators
 */
export const useProgressIndicators = () => {
    const { allQuizzesProgress, seriesProgress, hasErrors, safeProgress } =
        useQuizProgress();

    if (hasErrors || !safeProgress.ready) {
        return {
            quizBars: [],
            seriesBar: { percentage: 0, completed: 0, total: 0 },
            hasErrors: true,
            errorMessage: safeProgress.message,
        };
    }

    return {
        quizBars: (allQuizzesProgress ?? []).map((quiz) => ({
            id: quiz?.quizId,
            title: quiz?.title,
            percentage: quiz?.percentage || 0,
            isCurrent: quiz?.isCurrent || false,
            completed: quiz?.completed || false,
            hasError: !!quiz?.error,
        })),
        seriesBar: {
            percentage: seriesProgress?.percentage ?? 0,
            completed: seriesProgress?.completedQuizzes ?? 0,
            total: seriesProgress?.selectedQuizzes ?? 0,
        },
        hasErrors: false,
    };
};

/**
 * Specialized hook for time tracking
 */
export const useQuizTimeTracking = () => {
    const {
        currentQuizProgress,
        seriesProgress,
        allQuizzesProgress,
        hasErrors,
        safeProgress,
    } = useQuizProgress();

    if (hasErrors || !safeProgress.ready) {
        return {
            currentQuiz: 0,
            totalSeries: 0,
            averagePerQuiz: 0,
            quizBreakdown: [],
            hasErrors: true,
            errorMessage: safeProgress.message,
        };
    }

    return {
        currentQuiz: currentQuizProgress?.timeSpent ?? 0,
        totalSeries: seriesProgress?.totalTimeSpent ?? 0,
        averagePerQuiz: seriesProgress?.averageTimePerQuiz,
        quizBreakdown: (allQuizzesProgress ?? []).map((quiz) => ({
            quizId: quiz?.quizId,
            title: quiz?.title,
            timeSpent: quiz?.timeSpent || 0,
        })),
        hasErrors: false,
    };
};
