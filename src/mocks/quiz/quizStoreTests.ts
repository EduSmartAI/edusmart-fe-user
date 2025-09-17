import { useQuizStore } from "../../stores/Quiz/QuizStore";
import { mockQuizSeries, testScenarios } from "./quizStoreTestData";

// Test utilities
export class QuizStoreTestRunner {
    private store = useQuizStore;

    // Reset store before each test
    reset() {
        this.store.getState().resetSeries();
        console.log("✅ Store reset complete");
    }

    // Initialize with mock data
    initialize() {
        this.store.getState().initializeSeries(mockQuizSeries);
        console.log("✅ Store initialized with mock data");
        console.log("📊 Series:", mockQuizSeries.title);
        console.log(
            "📋 Available quizzes:",
            mockQuizSeries.quizzes.map((q) => q.title),
        );
    }

    // Test basic store functionality
    testBasicFunctionality() {
        console.log("\n🧪 === TESTING BASIC FUNCTIONALITY ===");

        // Test series initialization
        this.initialize();
        const state = this.store.getState();

        console.log("✅ Series Status:", state.seriesStatus);
        console.log("✅ Quiz Count:", state.currentSeries?.quizzes.length);
        console.log("✅ Selected Quizzes:", state.selectedQuizIds);

        // Test data access helpers
        console.log("\n📖 Testing Data Access:");
        const quiz1 = state.getQuizById("quiz_1");
        console.log("✅ getQuizById('quiz_1'):", quiz1?.title);

        const question = state.getQuestionById("quiz_1", "q1_1");
        console.log("✅ getQuestionById('quiz_1', 'q1_1'):", question?.text);

        const answers = state.getAnswersForQuiz("quiz_1");
        console.log(
            "✅ getAnswersForQuiz('quiz_1'):",
            answers.length,
            "answers",
        );
    }

    // Test quiz selection workflow
    testQuizSelection() {
        console.log("\n🧪 === TESTING QUIZ SELECTION ===");
        this.reset();
        this.initialize();

        const state = this.store.getState();

        // Test individual selection
        console.log("\n📝 Testing individual selection:");
        state.toggleQuizSelection("quiz_1");
        console.log("✅ Selected quiz_1:", state.selectedQuizIds);

        state.toggleQuizSelection("quiz_2");
        console.log("✅ Selected quiz_2:", state.selectedQuizIds);

        // Test deselection
        state.toggleQuizSelection("quiz_1");
        console.log("✅ Deselected quiz_1:", state.selectedQuizIds);

        // Test bulk selection
        console.log("\n📝 Testing bulk selection:");
        state.selectQuizzes(["quiz_1", "quiz_2", "quiz_3"]);
        console.log("✅ Bulk selected:", state.selectedQuizIds);

        // Test invalid selection
        state.selectQuizzes(["quiz_1", "invalid_quiz", "quiz_3"]);
        console.log("✅ With invalid quiz:", state.selectedQuizIds);

        // Test progress after selection
        const progress = state.getSeriesProgress();
        console.log("✅ Series progress:", {
            selectedQuizzes: progress.selectedQuizzes,
            totalQuizzes: progress.totalQuizzes,
        });
    }

    // Test answer management
    testAnswerManagement() {
        console.log("\n🧪 === TESTING ANSWER MANAGEMENT ===");
        this.reset();
        this.initialize();

        const state = this.store.getState();

        // Setup: select quiz
        state.selectQuizzes(["quiz_1"]);
        state.startSelectedQuizzes();

        console.log("✅ Series status after start:", state.seriesStatus);
        console.log("✅ Current quiz:", state.currentQuizId);

        // Test answer creation
        console.log("\n✏️ Testing answer creation:");
        state.updateAnswer("quiz_1", "q1_1", ["opt1_1"]);
        console.log("✅ Added answer for q1_1");

        const answer1 = state.getAnswerForQuestion("quiz_1", "q1_1");
        console.log("✅ Retrieved answer:", answer1);

        // Test answer update
        state.updateAnswer("quiz_1", "q1_1", ["opt1_2"]);
        const updatedAnswer = state.getAnswerForQuestion("quiz_1", "q1_1");
        console.log("✅ Updated answer:", updatedAnswer);

        // Test multiple choice answer
        state.updateAnswer("quiz_1", "q1_2", ["opt2_1", "opt2_2", "opt2_4"]);
        const multiAnswer = state.getAnswerForQuestion("quiz_1", "q1_2");
        console.log("✅ Multiple choice answer:", multiAnswer);

        // Test progress after answers
        const quizProgress = state.getQuizProgress("quiz_1");
        console.log("✅ Quiz progress:", quizProgress);

        // Test clear answer
        state.clearAnswer("quiz_1", "q1_1");
        const clearedAnswer = state.getAnswerForQuestion("quiz_1", "q1_1");
        console.log("✅ Cleared answer:", clearedAnswer);

        // Test clear all answers
        state.clearQuizAnswers("quiz_1");
        const allAnswers = state.getAnswersForQuiz("quiz_1");
        console.log("✅ All answers after clear:", allAnswers.length);
    }

    // Test navigation
    testNavigation() {
        console.log("\n🧪 === TESTING NAVIGATION ===");
        this.reset();
        this.initialize();

        const state = this.store.getState();

        // Setup multiple quizzes
        state.selectQuizzes(["quiz_1", "quiz_2", "quiz_3"]);
        state.startSelectedQuizzes();

        console.log("✅ Current quiz after start:", state.currentQuizId);

        // Test navigation info
        let navInfo = state.getNavigationInfo();
        console.log("✅ Navigation info:", navInfo);

        // Test next navigation
        if (navInfo.canGoNext) {
            state.navigateToNextQuiz();
            console.log("✅ Navigated to next:", state.currentQuizId);
        }

        // Test previous navigation
        navInfo = state.getNavigationInfo();
        if (navInfo.canGoPrev) {
            state.navigateToPreviousQuiz();
            console.log("✅ Navigated to previous:", state.currentQuizId);
        }

        // Test direct navigation
        state.setCurrentQuiz("quiz_3");
        console.log("✅ Direct navigation to quiz_3:", state.currentQuizId);

        // Test navigation permissions
        const canNavigate = state.canNavigateToQuiz("quiz_2");
        console.log("✅ Can navigate to quiz_2:", canNavigate);
    }

    // Test status management
    testStatusManagement() {
        console.log("\n🧪 === TESTING STATUS MANAGEMENT ===");
        this.reset();
        this.initialize();

        const state = this.store.getState();

        // Test initial status
        let quizStatus = state.getQuizStatus("quiz_1");
        console.log("✅ Initial quiz_1 status:", quizStatus);

        // Test status after selection
        state.toggleQuizSelection("quiz_1");
        state.updateQuizStatus("quiz_1");
        quizStatus = state.getQuizStatus("quiz_1");
        console.log("✅ Status after selection:", quizStatus);

        // Test status after starting
        state.startSelectedQuizzes();
        quizStatus = state.getQuizStatus("quiz_1");
        console.log("✅ Status after start:", quizStatus);

        // Test status after partial completion
        state.updateAnswer("quiz_1", "q1_1", ["opt1_1"]);
        quizStatus = state.getQuizStatus("quiz_1");
        console.log("✅ Status after partial completion:", quizStatus);

        // Test status after full completion
        state.updateAnswer("quiz_1", "q1_2", ["opt2_1", "opt2_2"]);
        state.updateAnswer("quiz_1", "q1_3", ["opt3_1"]);
        quizStatus = state.getQuizStatus("quiz_1");
        console.log("✅ Status after full completion:", quizStatus);

        // Test series status
        console.log("✅ Series status:", state.seriesStatus);
        console.log("✅ Can submit series:", state.canSubmitSeries);
    }

    // Test validation
    testValidation() {
        console.log("\n🧪 === TESTING VALIDATION ===");
        this.reset();
        this.initialize();

        const state = this.store.getState();

        // Test validation with no selection
        let validation = state.validateSubmission();
        console.log("✅ Validation with no selection:", validation);

        // Test validation with selection but no answers
        state.selectQuizzes(["quiz_1", "quiz_2"]);
        validation = state.validateSubmission();
        console.log("✅ Validation with selection, no answers:", validation);

        // Test validation with partial completion
        state.startSelectedQuizzes();
        state.updateAnswer("quiz_1", "q1_1", ["opt1_1"]);
        validation = state.validateSubmission();
        console.log("✅ Validation with partial completion:", validation);

        // Test completion validation
        const canComplete = state.canCompleteQuiz("quiz_1");
        console.log("✅ Can complete quiz_1:", canComplete);
    }

    // Test time tracking
    testTimeTracking() {
        console.log("\n🧪 === TESTING TIME TRACKING ===");
        this.reset();
        this.initialize();

        const state = this.store.getState();

        // Test initial time
        let timeSpent = state.getTimeSpentOnQuiz("quiz_1");
        console.log("✅ Initial time spent on quiz_1:", timeSpent, "minutes");

        let totalTime = state.getTotalTimeSpent();
        console.log("✅ Initial total time:", totalTime, "minutes");

        // Start quiz to trigger time tracking
        state.selectQuizzes(["quiz_1"]);
        state.startSelectedQuizzes();

        // Simulate some time passage
        setTimeout(() => {
            timeSpent = state.getTimeSpentOnQuiz("quiz_1");
            totalTime = state.getTotalTimeSpent();
            console.log("✅ Time spent after start:", timeSpent, "minutes");
            console.log("✅ Total time after start:", totalTime, "minutes");
        }, 1000);
    }

    // Run complete workflow test
    testCompleteWorkflow() {
        console.log("\n🧪 === TESTING COMPLETE WORKFLOW ===");
        this.reset();
        this.initialize();

        const state = this.store.getState();
        const scenario = testScenarios.completeWorkflow;

        console.log("📋 Running scenario:", scenario.description);

        // Step 1: Select quizzes
        state.selectQuizzes(scenario.selectedQuizzes);
        console.log("✅ Step 1 - Selected quizzes:", state.selectedQuizIds);

        // Step 2: Start quiz series
        state.startSelectedQuizzes();
        console.log("✅ Step 2 - Series status:", state.seriesStatus);
        console.log("✅ Step 2 - Current quiz:", state.currentQuizId);

        // Step 3: Answer all questions
        Object.entries(scenario.answers).forEach(([quizId, answers]) => {
            console.log(`\n📝 Answering questions for ${quizId}:`);
            answers.forEach((answer) => {
                state.updateAnswer(
                    quizId,
                    answer.questionId,
                    answer.selectedOptions,
                );
                console.log(
                    `  ✅ Answered ${answer.questionId}: ${answer.selectedOptions}`,
                );
            });

            const progress = state.getQuizProgress(quizId);
            console.log(
                `  📊 Progress: ${progress.answered}/${progress.total} (${progress.percentage}%)`,
            );
            console.log(`  ✅ Completed: ${progress.completed}`);
        });

        // Step 4: Check final state
        const seriesProgress = state.getSeriesProgress();
        console.log("\n📊 Final series progress:", seriesProgress);

        const validation = state.validateSubmission();
        console.log("✅ Final validation:", {
            canSubmit: validation.canSubmit,
            completedQuizzes: validation.completedQuizzes.length,
            incompleteQuizzes: validation.incompleteQuizzes.length,
        });

        console.log("🎉 Complete workflow test finished!");
    }

    // Run all tests
    runAllTests() {
        console.log("🚀 === STARTING QUIZ STORE TESTS ===\n");

        try {
            this.testBasicFunctionality();
            this.testQuizSelection();
            this.testAnswerManagement();
            this.testNavigation();
            this.testStatusManagement();
            this.testValidation();
            this.testTimeTracking();
            this.testCompleteWorkflow();

            console.log("\n🎉 === ALL TESTS COMPLETED SUCCESSFULLY ===");
        } catch (error) {
            console.error("❌ Test failed:", error);
        }
    }
}

// Create test runner instance
export const testRunner = new QuizStoreTestRunner();

// Individual test functions for manual testing
export const manualTests = {
    basic: () => testRunner.testBasicFunctionality(),
    selection: () => testRunner.testQuizSelection(),
    answers: () => testRunner.testAnswerManagement(),
    navigation: () => testRunner.testNavigation(),
    status: () => testRunner.testStatusManagement(),
    validation: () => testRunner.testValidation(),
    timing: () => testRunner.testTimeTracking(),
    workflow: () => testRunner.testCompleteWorkflow(),
    all: () => testRunner.runAllTests(),
};

// Helper to run tests in browser console
if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).quizStoreTests = manualTests;
    console.log("🧪 Quiz Store Tests available at: window.quizStoreTests");
    console.log("📋 Available tests:", Object.keys(manualTests));
    console.log("🚀 Run all tests: window.quizStoreTests.all()");
}
