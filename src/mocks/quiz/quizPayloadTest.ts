import {
    SubmitSeriesAPIRequest,
    QuizSubmissionPayload,
    ValidationResult,
    SeriesStatus,
    QuizSeries,
} from "EduSmart/types/quiz";
import {
    sampleQuizSeries,
    sampleQuizSeriesWithSelections,
    sampleQuizAnswers,
    selectedQuizAnswers,
    incompleteQuizAnswers,
    emptyQuizAnswers,
    correctAnswersByQuiz,
    mockSeriesStates,
    mockUserScenarios,
    getQuizzesBySelection,
    MockQuizSeries,
} from "EduSmart/mocks/quiz/quizMockData";

// ======================== HELPER FUNCTIONS ========================

// Validation function để test quiz completeness
function validateSeriesSubmission(
    series: MockQuizSeries, // ✅ Use proper MockQuizSeries type instead of QuizSeries
    answers: Record<string, (typeof sampleQuizAnswers)[string]>,
): ValidationResult {
    const missingAnswers: string[] = [];

    // Get only selected quizzes
    const { selectedQuizzes } = getQuizzesBySelection(series);

    // Check each SELECTED quiz
    selectedQuizzes.forEach((quiz) => {
        const quizAnswers = answers[quiz.id] || [];
        const answeredQuestionIds = new Set(
            quizAnswers.map((a) => a.questionId),
        );

        quiz.questions.forEach((question) => {
            // Assume all questions are required by default for base Quiz interface
            if (!answeredQuestionIds.has(question.id)) {
                missingAnswers.push(question.id);
            }
        });
    });

    // Check if all selected quizzes are completed
    const incompleteSelectedQuizIds = selectedQuizzes
        .filter((quiz) => {
            const quizAnswers = answers[quiz.id] || [];
            const answeredQuestionIds = new Set(
                quizAnswers.map((a) => a.questionId),
            );
            const requiredQuestions = quiz.questions.filter(
                (q) => q.isRequired !== false,
            );
            return !requiredQuestions.every((q) =>
                answeredQuestionIds.has(q.id),
            );
        })
        .map((quiz) => quiz.id);

    const selectedQuizzesCompleted = incompleteSelectedQuizIds.length === 0;

    return {
        canSubmitSeries:
            missingAnswers.length === 0 && selectedQuizzesCompleted,
        missingAnswers,
        areSelectedQuizzesCompleted: selectedQuizzesCompleted,
        incompleteSelectedQuizIds,
    };
}

// Build complete payload for submitting
function buildSubmissionPayload(
    series: MockQuizSeries, // ✅ Use proper MockQuizSeries type
    answers: Record<string, (typeof sampleQuizAnswers)[string]>,
): SubmitSeriesAPIRequest {
    const { selectedQuizzes } = getQuizzesBySelection(series);

    const quizSubmissions: QuizSubmissionPayload[] = selectedQuizzes.map(
        (quiz) => ({
            quizId: quiz.id,
            answers: answers[quiz.id] || [],
            timeSpent: Math.floor(Math.random() * 1200) + 300, // Random 5-20 minutes
            completedAt: new Date(),
            wasSelected: true, // All in payload were selected
            selectionOrder:
                selectedQuizzes.findIndex((q) => q.id === quiz.id) + 1,
        }),
    );

    return {
        seriesId: series.id,
        userId: "user-123", // Mock user ID
        selectedQuizIds: selectedQuizzes.map((q) => q.id),
        quizSubmissions,
        totalTimeSpent: quizSubmissions.reduce(
            (total, submission) => total + (submission.timeSpent || 0),
            0,
        ),
        submittedAt: new Date(),
        seriesStatus: SeriesStatus.SUBMITTED,
    };
}

// Calculate quiz statistics
function calculateQuizStats(
    series: MockQuizSeries, // ✅ Use proper MockQuizSeries type
    answers: Record<string, (typeof sampleQuizAnswers)[string]>,
) {
    const { selectedQuizzes, skippedQuizzes } = getQuizzesBySelection(series);

    const stats = series.quizzes.map((quiz) => {
        const quizAnswers = answers[quiz.id] || [];
        const totalQuestions = quiz.questions.length;
        const answeredQuestions = quizAnswers.length;
        // For base Quiz interface, assume all questions are required
        const answeredRequired = answeredQuestions;

        return {
            quizId: quiz.id,
            quizTitle: quiz.title,
            isSelected: quiz.isSelected || false,
            totalQuestions,
            requiredQuestions: totalQuestions,
            optionalQuestions: 0,
            answeredQuestions,
            answeredRequired,
            isCompleted: answeredRequired === totalQuestions,
            completionPercentage:
                totalQuestions > 0
                    ? Math.round((answeredQuestions / totalQuestions) * 100)
                    : 0,
        };
    });

    const selectedStats = stats.filter((s) => s.isSelected);
    const totalSelectedQuestions = selectedStats.reduce(
        (sum, s) => sum + s.totalQuestions,
        0,
    );
    const totalSelectedAnswered = selectedStats.reduce(
        (sum, s) => sum + s.answeredQuestions,
        0,
    );

    const totalStats = {
        totalQuizzes: series.quizzes.length,
        selectedQuizzes: selectedQuizzes.length,
        skippedQuizzes: skippedQuizzes.length,
        completedQuizzes: selectedStats.filter((s) => s.isCompleted).length,
        totalQuestions: totalSelectedQuestions,
        totalAnswered: totalSelectedAnswered,
        overallCompletion:
            totalSelectedQuestions > 0
                ? Math.round(
                      (totalSelectedAnswered / totalSelectedQuestions) * 100,
                  )
                : 0,
        canSubmitSeries:
            selectedStats.every((s) => s.isCompleted) &&
            selectedStats.length > 0,
    };

    return { quizStats: stats, selectedStats, totalStats };
}

// Calculate scores against correct answers
function calculateScores(
    answers: Record<string, (typeof sampleQuizAnswers)[string]>,
) {
    let totalCorrect = 0;
    let totalQuestions = 0;
    const quizScores: Record<
        string,
        { correct: number; total: number; percentage: number }
    > = {};

    Object.entries(answers).forEach(([quizId, userAnswers]) => {
        const correctAnswers = correctAnswersByQuiz[quizId];
        if (!correctAnswers) return;

        let correctCount = 0;
        userAnswers.forEach((userAnswer) => {
            const correctAnswer = correctAnswers[userAnswer.questionId];
            if (correctAnswer) {
                totalQuestions++;
                // Check if arrays are equal (for multiple choice)
                const isCorrect =
                    JSON.stringify(userAnswer.selectedOptions.sort()) ===
                    JSON.stringify(correctAnswer.sort());
                if (isCorrect) {
                    correctCount++;
                    totalCorrect++;
                }
            }
        });

        quizScores[quizId] = {
            correct: correctCount,
            total: userAnswers.length,
            percentage:
                userAnswers.length > 0
                    ? Math.round((correctCount / userAnswers.length) * 100)
                    : 0,
        };
    });

    return {
        quizScores,
        overallScore: {
            correct: totalCorrect,
            total: totalQuestions,
            percentage:
                totalQuestions > 0
                    ? Math.round((totalCorrect / totalQuestions) * 100)
                    : 0,
        },
    };
}

// ✅ HELPER FUNCTION - Create series with quiz selection
function createSeriesWithSelection(
    baseSeries: QuizSeries,
    selectedQuizIds: string[],
): QuizSeries {
    return {
        ...baseSeries,
        quizzes: baseSeries.quizzes.map((quiz) => ({
            ...quiz,
            isSelected: selectedQuizIds.includes(quiz.id),
        })),
    };
}

// ======================== TEST SCENARIOS ========================

console.log("🧪 QUIZ DATA TESTING STARTED");
console.log("=".repeat(60));

// ✅ Test 1: Complete Submission (All Quizzes Selected & Completed)
console.log("\n📊 TEST 1: COMPLETE SUBMISSION - ALL QUIZZES");
const allQuizzesSelected = createSeriesWithSelection(
    sampleQuizSeries,
    sampleQuizSeries.quizzes.map((q) => q.id),
);
const completeValidation = validateSeriesSubmission(
    allQuizzesSelected,
    sampleQuizAnswers,
);
const completePayload = buildSubmissionPayload(
    allQuizzesSelected,
    sampleQuizAnswers,
);
const completeStats = calculateQuizStats(allQuizzesSelected, sampleQuizAnswers);
const completeScores = calculateScores(sampleQuizAnswers);

console.log("✅ Validation result:", completeValidation.canSubmitSeries);
console.log("✅ Can submit series:", completeStats.totalStats.canSubmitSeries);
console.log(
    "✅ Overall completion:",
    completeStats.totalStats.overallCompletion + "%",
);
console.log("✅ Overall score:", completeScores.overallScore.percentage + "%");
console.log(
    "✅ Payload size:",
    JSON.stringify(completePayload).length,
    "characters",
);

// ✅ Test 2: Selective Quiz Submission
console.log("\n📊 TEST 2: SELECTIVE QUIZ SUBMISSION");
const selectiveValidation = validateSeriesSubmission(
    sampleQuizSeriesWithSelections,
    selectedQuizAnswers,
);
const selectivePayload = buildSubmissionPayload(
    sampleQuizSeriesWithSelections,
    selectedQuizAnswers,
);
const selectiveStats = calculateQuizStats(
    sampleQuizSeriesWithSelections,
    selectedQuizAnswers,
);
const selectiveScores = calculateScores(selectedQuizAnswers);

console.log("✅ Validation result:", selectiveValidation.canSubmitSeries);
console.log("✅ Can submit series:", selectiveStats.totalStats.canSubmitSeries);
console.log(
    "✅ Completion (selected only):",
    selectiveStats.totalStats.overallCompletion + "%",
);
console.log(
    "✅ Score (selected only):",
    selectiveScores.overallScore.percentage + "%",
);

// ❌ Test 3: Incomplete Submission
console.log("\n📊 TEST 3: INCOMPLETE SUBMISSION");
const incompleteValidation = validateSeriesSubmission(
    allQuizzesSelected,
    incompleteQuizAnswers,
);
const incompleteStats = calculateQuizStats(
    allQuizzesSelected,
    incompleteQuizAnswers,
);

console.log("❌ Validation result:", incompleteValidation.canSubmitSeries);
console.log("❌ Missing answers:", incompleteValidation.missingAnswers.length);
console.log(
    "❌ Incomplete selected quizzes:",
    incompleteValidation.incompleteSelectedQuizIds,
);
console.log(
    "❌ Can submit series:",
    incompleteStats.totalStats.canSubmitSeries,
);

// 🚫 Test 4: Empty Submission
console.log("\n📊 TEST 4: EMPTY SUBMISSION");
const emptyValidation = validateSeriesSubmission(
    allQuizzesSelected,
    emptyQuizAnswers,
);
const emptyStats = calculateQuizStats(allQuizzesSelected, emptyQuizAnswers);

console.log("🚫 Validation result:", emptyValidation.canSubmitSeries);
console.log("🚫 Can submit series:", emptyStats.totalStats.canSubmitSeries);
console.log(
    "🚫 Overall completion:",
    emptyStats.totalStats.overallCompletion + "%",
);

// 📋 Test 5: Different Series States
console.log("\n📊 TEST 5: DIFFERENT SERIES STATES");

Object.entries(mockSeriesStates).forEach(([stateName, seriesState]) => {
    const { selectedQuizzes } = getQuizzesBySelection(seriesState);
    console.log(`\n${stateName.toUpperCase()}:`);
    console.log(
        `  Selected: ${selectedQuizzes.length}/${seriesState.quizzes.length} quizzes`,
    );
    console.log(
        `  Quiz statuses:`,
        seriesState.quizzes.map((q) => `${q.title}: ${q.status}`),
    );
});

// 🎯 Test 6: User Scenarios Analysis - ✅ FIXED
console.log("\n📊 TEST 6: USER SCENARIOS ANALYSIS");

Object.entries(mockUserScenarios).forEach(([scenarioName, scenario]) => {
    // ✅ Use helper function to avoid type errors
    const testSeries = createSeriesWithSelection(
        sampleQuizSeries,
        scenario.selectedQuizIds,
    );
    const validation = validateSeriesSubmission(testSeries, scenario.answers);

    console.log(`\n${scenarioName.toUpperCase()}:`);
    console.log(`  Selected quiz IDs:`, scenario.selectedQuizIds);
    console.log(`  Can submit series:`, validation.canSubmitSeries);
    console.log(`  Is valid:`, validation.canSubmitSeries);
});

// 🔍 Test 7: Detailed Quiz Analysis
console.log("\n📊 TEST 7: DETAILED QUIZ BREAKDOWN");
completeStats.quizStats.forEach((stat, index) => {
    console.log(`\nQuiz ${index + 1}: ${stat.quizTitle}`);
    console.log(`  🎯 Selected: ${stat.isSelected ? "✅ Yes" : "❌ No"}`);
    console.log(
        `  📝 Questions: ${stat.totalQuestions} (${stat.requiredQuestions} required, ${stat.optionalQuestions} optional)`,
    );
    console.log(
        `  ✅ Answered: ${stat.answeredQuestions} (${stat.answeredRequired} required)`,
    );
    console.log(`  📊 Completion: ${stat.completionPercentage}%`);
    console.log(`  🎯 Can Submit: ${stat.isCompleted ? "✅ Yes" : "❌ No"}`);

    // Show score if quiz has answers
    const quizScore = completeScores.quizScores[stat.quizId];
    if (quizScore) {
        console.log(
            `  🏆 Score: ${quizScore.correct}/${quizScore.total} (${quizScore.percentage}%)`,
        );
    }
});

// 🚀 Test 8: API Payload Preview
console.log("\n📊 TEST 8: API PAYLOAD PREVIEW");

console.log("\n1. Complete Submission Payload:");
console.log({
    seriesId: completePayload.seriesId,
    userId: completePayload.userId,
    selectedQuizIds: completePayload.selectedQuizIds,
    quizzesInPayload: completePayload.quizSubmissions.length,
    totalAnswers: completePayload.quizSubmissions.reduce(
        (sum, quiz) => sum + quiz.answers.length,
        0,
    ),
    estimatedTimeSpent: completePayload.totalTimeSpent + " seconds",
    seriesStatus: completePayload.seriesStatus,
});

console.log("\n2. Selective Submission Payload:");
console.log({
    seriesId: selectivePayload.seriesId,
    selectedQuizIds: selectivePayload.selectedQuizIds,
    skippedQuizzes: sampleQuizSeriesWithSelections.quizzes
        .filter((q) => !q.isSelected)
        .map((q) => q.id),
    quizzesInPayload: selectivePayload.quizSubmissions.length,
    totalAnswers: selectivePayload.quizSubmissions.reduce(
        (sum, quiz) => sum + quiz.answers.length,
        0,
    ),
});

// ⚡ Test 9: Performance & Data Size Analysis
console.log("\n📊 TEST 9: PERFORMANCE & DATA SIZE ANALYSIS");
const payloadSizes = {
    completePayload: JSON.stringify(completePayload).length,
    selectivePayload: JSON.stringify(selectivePayload).length,
    sampleSeries: JSON.stringify(sampleQuizSeries).length,
    sampleAnswers: JSON.stringify(sampleQuizAnswers).length,
};

console.log("Data sizes (bytes):");
Object.entries(payloadSizes).forEach(([key, size]) => {
    console.log(`  ${key}: ${size.toLocaleString()} bytes`);
});

console.log("\n✅ QUIZ DATA TESTING COMPLETED");
console.log("=".repeat(60));

// ======================== EXPORTS ========================
export {
    validateSeriesSubmission,
    buildSubmissionPayload,
    calculateQuizStats,
    calculateScores,
    createSeriesWithSelection, // ✅ Export helper function
    // Test results
    completeValidation,
    selectiveValidation,
    incompleteValidation,
    emptyValidation,
    // Payloads
    completePayload,
    selectivePayload,
};

// ======================== SUMMARY REPORT ========================
export const testSummary = {
    totalTests: 9,
    scenarios: {
        complete: completeValidation.canSubmitSeries,
        selective: selectiveValidation.canSubmitSeries,
        incomplete: !incompleteValidation.canSubmitSeries,
        empty: !emptyValidation.canSubmitSeries,
    },
    dataIntegrity: {
        allQuizAnswersProvided: Object.keys(sampleQuizAnswers).length === 4,
        correctAnswersAvailable: Object.keys(correctAnswersByQuiz).length === 4,
        mockStatesComplete: Object.keys(mockSeriesStates).length === 4,
        userScenariosComplete: Object.keys(mockUserScenarios).length === 4,
    },
    performance: {
        payloadSizes,
        largestPayload: Math.max(...Object.values(payloadSizes)),
        smallestPayload: Math.min(...Object.values(payloadSizes)),
    },
};

console.log("\n📋 TEST SUMMARY:");
console.log(JSON.stringify(testSummary, null, 2));
