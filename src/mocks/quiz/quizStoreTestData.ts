import {
    QuizSeries,
    Quiz,
    Question,
    QuestionType,
    QuizStatus,
} from "EduSmart/types";

// Mock Questions for Quiz 1 - React Fundamentals
const quiz1Questions: Question[] = [
    {
        id: "q1_1",
        type: QuestionType.SINGLE_CHOICE,
        text: "What is React?",
        options: [
            {
                id: "opt1_1",
                text: "A JavaScript library for building user interfaces",
            },
            { id: "opt1_2", text: "A database management system" },
            { id: "opt1_3", text: "A CSS framework" },
            { id: "opt1_4", text: "A testing tool" },
        ],
    },
    {
        id: "q1_2",
        type: QuestionType.MULTIPLE_CHOICE,
        text: "Which are React Hooks? (Select all that apply)",
        options: [
            { id: "opt2_1", text: "useState" },
            { id: "opt2_2", text: "useEffect" },
            { id: "opt2_3", text: "useRouter" },
            { id: "opt2_4", text: "useContext" },
            { id: "opt2_5", text: "useDatabase" },
        ],
    },
    {
        id: "q1_3",
        type: QuestionType.SINGLE_CHOICE,
        text: "What is JSX?",
        options: [
            { id: "opt3_1", text: "A syntax extension for JavaScript" },
            { id: "opt3_2", text: "A new programming language" },
            { id: "opt3_3", text: "A database query language" },
        ],
    },
];

// Mock Questions for Quiz 2 - TypeScript Essentials
const quiz2Questions: Question[] = [
    {
        id: "q2_1",
        type: QuestionType.SINGLE_CHOICE,
        text: "What is TypeScript?",
        options: [
            { id: "opt4_1", text: "A superset of JavaScript" },
            { id: "opt4_2", text: "A replacement for JavaScript" },
            { id: "opt4_3", text: "A CSS preprocessor" },
        ],
    },
    {
        id: "q2_2",
        type: QuestionType.MULTIPLE_CHOICE,
        text: "TypeScript benefits include: (Select all that apply)",
        options: [
            { id: "opt5_1", text: "Type safety" },
            { id: "opt5_2", text: "Better IDE support" },
            { id: "opt5_3", text: "Automatic performance optimization" },
            { id: "opt5_4", text: "Early error detection" },
        ],
    },
];

// Mock Questions for Quiz 3 - State Management
const quiz3Questions: Question[] = [
    {
        id: "q3_1",
        type: QuestionType.SINGLE_CHOICE,
        text: "What is Zustand?",
        options: [
            { id: "opt6_1", text: "A state management library" },
            { id: "opt6_2", text: "A testing framework" },
            { id: "opt6_3", text: "A routing library" },
        ],
    },
    {
        id: "q3_2",
        type: QuestionType.SINGLE_CHOICE,
        text: "Zustand vs Redux: What's a key difference?",
        options: [
            { id: "opt7_1", text: "Zustand has less boilerplate" },
            { id: "opt7_2", text: "Redux is faster" },
            { id: "opt7_3", text: "Zustand requires more configuration" },
        ],
    },
    {
        id: "q3_3",
        type: QuestionType.MULTIPLE_CHOICE,
        text: "Zustand features: (Select all that apply)",
        options: [
            { id: "opt8_1", text: "TypeScript support" },
            { id: "opt8_2", text: "Devtools integration" },
            { id: "opt8_3", text: "Built-in router" },
            { id: "opt8_4", text: "Persistence middleware" },
        ],
    },
];

// Mock Quizzes
const mockQuizzes: Quiz[] = [
    {
        id: "quiz_1",
        title: "React Fundamentals",
        description:
            "Test your knowledge of React basics, components, and hooks",
        questions: quiz1Questions,
        status: QuizStatus.NOT_STARTED,
    },
    {
        id: "quiz_2",
        title: "TypeScript Essentials",
        description: "Understanding TypeScript fundamentals and benefits",
        questions: quiz2Questions,
        status: QuizStatus.NOT_STARTED,
    },
    {
        id: "quiz_3",
        title: "State Management with Zustand",
        description: "Learn about Zustand state management library",
        questions: quiz3Questions,
        status: QuizStatus.NOT_STARTED,
    },
];

// Mock Quiz Series
export const mockQuizSeries: QuizSeries = {
    id: "series_frontend_basics",
    title: "Frontend Development Fundamentals",
    description:
        "A comprehensive quiz series covering React, TypeScript, and state management concepts essential for modern frontend development.",
    quizzes: mockQuizzes,
};

// Helper function to get specific quiz by ID
export const getQuizById = (quizId: string): Quiz | null => {
    return mockQuizSeries.quizzes.find((q) => q.id === quizId) || null;
};

// Helper function to get specific question by IDs
export const getQuestionById = (
    quizId: string,
    questionId: string,
): Question | null => {
    const quiz = getQuizById(quizId);
    return quiz?.questions.find((q) => q.id === questionId) || null;
};

// Test scenarios for different user behaviors
export const testScenarios = {
    // Scenario 1: Complete workflow
    completeWorkflow: {
        description:
            "User selects all quizzes, answers all questions, and submits",
        selectedQuizzes: ["quiz_1", "quiz_2", "quiz_3"],
        answers: {
            quiz_1: [
                { questionId: "q1_1", selectedOptions: ["opt1_1"] }, // Correct: React is JS library
                {
                    questionId: "q1_2",
                    selectedOptions: ["opt2_1", "opt2_2", "opt2_4"],
                }, // Correct: useState, useEffect, useContext
                { questionId: "q1_3", selectedOptions: ["opt3_1"] }, // Correct: JSX is syntax extension
            ],
            quiz_2: [
                { questionId: "q2_1", selectedOptions: ["opt4_1"] }, // Correct: TypeScript is superset
                {
                    questionId: "q2_2",
                    selectedOptions: ["opt5_1", "opt5_2", "opt5_4"],
                }, // Correct benefits
            ],
            quiz_3: [
                { questionId: "q3_1", selectedOptions: ["opt6_1"] }, // Correct: state management
                { questionId: "q3_2", selectedOptions: ["opt7_1"] }, // Correct: less boilerplate
                {
                    questionId: "q3_3",
                    selectedOptions: ["opt8_1", "opt8_2", "opt8_4"],
                }, // Correct features
            ],
        },
    },

    // Scenario 2: Partial completion
    partialCompletion: {
        description:
            "User selects 2 quizzes, completes 1, partially completes another",
        selectedQuizzes: ["quiz_1", "quiz_2"],
        answers: {
            quiz_1: [
                { questionId: "q1_1", selectedOptions: ["opt1_1"] },
                { questionId: "q1_2", selectedOptions: ["opt2_1", "opt2_2"] },
                { questionId: "q1_3", selectedOptions: ["opt3_1"] },
            ],
            quiz_2: [
                { questionId: "q2_1", selectedOptions: ["opt4_1"] },
                // q2_2 not answered - quiz incomplete
            ],
        },
    },

    // Scenario 3: Quiz selection changes
    selectionChanges: {
        description: "User changes quiz selection multiple times",
        initialSelection: ["quiz_1", "quiz_2", "quiz_3"],
        finalSelection: ["quiz_1", "quiz_3"],
        answers: {
            quiz_1: [{ questionId: "q1_1", selectedOptions: ["opt1_1"] }],
            quiz_2: [
                { questionId: "q2_1", selectedOptions: ["opt4_1"] }, // Will be deselected later
            ],
            quiz_3: [{ questionId: "q3_1", selectedOptions: ["opt6_1"] }],
        },
    },

    // Scenario 4: Wrong answers
    wrongAnswers: {
        description: "User gives incorrect answers to test validation",
        selectedQuizzes: ["quiz_1"],
        answers: {
            quiz_1: [
                { questionId: "q1_1", selectedOptions: ["opt1_2"] }, // Wrong: database system
                { questionId: "q1_2", selectedOptions: ["opt2_3", "opt2_5"] }, // Wrong: useRouter, useDatabase
                { questionId: "q1_3", selectedOptions: ["opt3_2"] }, // Wrong: new programming language
            ],
        },
    },
};

// Answer reference for testing correctness
export const correctAnswers = {
    quiz_1: {
        q1_1: ["opt1_1"], // React is JS library
        q1_2: ["opt2_1", "opt2_2", "opt2_4"], // useState, useEffect, useContext
        q1_3: ["opt3_1"], // JSX is syntax extension
    },
    quiz_2: {
        q2_1: ["opt4_1"], // TypeScript is superset
        q2_2: ["opt5_1", "opt5_2", "opt5_4"], // Type safety, IDE support, error detection
    },
    quiz_3: {
        q3_1: ["opt6_1"], // State management library
        q3_2: ["opt7_1"], // Less boilerplate
        q3_3: ["opt8_1", "opt8_2", "opt8_4"], // TypeScript, devtools, persistence
    },
};
