import { testRunner, manualTests } from "./quizStoreTests";

// Demo script to test the Quiz Store
export function runQuizStoreDemo() {
    console.log("🎯 === QUIZ STORE DEMO ===\n");

    // Quick demo of key functionality
    console.log("1️⃣ Basic Store Demo:");
    testRunner.testBasicFunctionality();

    console.log("\n2️⃣ Selection Demo:");
    testRunner.testQuizSelection();

    console.log("\n3️⃣ Answer Management Demo:");
    testRunner.testAnswerManagement();

    console.log("\n4️⃣ Complete Workflow Demo:");
    testRunner.testCompleteWorkflow();

    console.log("\n🎉 Demo completed! Check console for detailed output.");
}

// Instructions for manual testing
export const testingInstructions = {
    quickStart: `
🚀 QUICK START TESTING:

1. Open browser console
2. Run: window.quizStoreTests.all() 
   - This runs all tests automatically

3. Or run individual tests:
   - window.quizStoreTests.basic()     // Basic functionality
   - window.quizStoreTests.selection() // Quiz selection
   - window.quizStoreTests.answers()   // Answer management
   - window.quizStoreTests.navigation() // Navigation
   - window.quizStoreTests.workflow()   // Complete workflow

4. Watch console output for results
`,

    testScenarios: `
🧪 TEST SCENARIOS INCLUDED:

✅ Complete Workflow
   - Select all quizzes
   - Answer all questions correctly
   - Validate submission

✅ Partial Completion  
   - Select 2 quizzes
   - Complete 1, partially complete another
   - Test validation

✅ Selection Changes
   - Change quiz selection multiple times
   - Test state consistency

✅ Wrong Answers
   - Submit incorrect answers
   - Test validation logic

✅ Edge Cases
   - Invalid quiz IDs
   - Navigation boundaries
   - Empty states
`,

    expectedResults: `
📊 EXPECTED RESULTS:

✅ Basic Functionality:
   - Store initializes with mock data
   - Data access helpers work
   - Series status starts at QUIZ_SELECTION

✅ Quiz Selection:
   - Individual and bulk selection work
   - Invalid selections filtered out
   - Series progress updates correctly

✅ Answer Management:
   - Answers created and updated correctly
   - Multiple choice answers handled
   - Clear operations work
   - Progress calculated accurately

✅ Navigation:
   - Navigation info calculated correctly
   - Next/previous navigation works
   - Direct navigation works
   - Permissions validated

✅ Status Management:
   - Quiz statuses update automatically
   - Series status transitions correctly
   - Completion detection works

✅ Validation:
   - Submission validation accurate
   - Missing requirements identified
   - Completion status correct

✅ Time Tracking:
   - Start times marked correctly
   - Completion times tracked
   - Time calculations accurate
`,
};

// Browser-friendly testing interface
if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).quizStoreDemo = {
        run: runQuizStoreDemo,
        instructions: testingInstructions,
        tests: manualTests,
    };

    console.log("🎯 Quiz Store Demo available at: window.quizStoreDemo");
    console.log("📋 Quick start: window.quizStoreDemo.run()");
    console.log("📖 Instructions: window.quizStoreDemo.instructions");
}
