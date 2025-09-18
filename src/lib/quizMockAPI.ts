/*
 * Simple Mock Data for Quiz API Development
 * Updated to match exact backend API format
 * This will be removed when backend is ready - just change environment variable
 */

// Environment flag - easy to switch
const USE_MOCK =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_QUIZ_MOCK === "true";

// Mock data matching exact backend format
const mockQuizListResponse = {
    response: [
        {
            quizId: "58c84611-7615-4f05-8cdd-fd1fde774d93",
            title: "Cấu trúc dữ liệu và giải thuật",
            description:
                "Những câu hỏi cơ bản về thuật toán và cấu trúc dữ liệu",
            subjectCode: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            subjectCodeName: "Khoa học máy tính",
            totalQuestions: 15,
            difficultyLevel: "Trung bình",
        },
        {
            quizId: "c1c4e915-6891-4849-841d-3c228cfe2f37",
            title: "Lập trình hướng đối tượng",
            description: "Kiểm tra kiến thức về OOP và thiết kế hệ thống",
            subjectCode: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
            subjectCodeName: "Lập trình",
            totalQuestions: 12,
            difficultyLevel: "Khó",
        },
        {
            quizId: "a8b9c123-4567-8901-2345-6789abcdef01",
            title: "Cơ sở dữ liệu",
            description: "Những câu hỏi về SQL và thiết kế cơ sở dữ liệu",
            subjectCode: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
            subjectCodeName: "Cơ sở dữ liệu",
            totalQuestions: 10,
            difficultyLevel: "Dễ",
        },
    ],
    success: true,
    messageId: "I00001",
    message: "Lấy danh sách bài quiz thành công.",
    detailErrors: null,
};

const mockTestDetailResponse = {
    response: {
        testId: "4946743a-439e-4c59-b238-a1e09a83d0ca",
        testName: "Kiểm tra đầu vào",
        description: "Bài kiểm tra đầu vào đánh giá năng lực của sinh viên",
        quizzes: [
            {
                quizId: "58c84611-7615-4f05-8cdd-fd1fde774d93",
                title: "Cấu trúc dữ liệu và giải thuật",
                description:
                    "Những câu hỏi cơ bản về thuật toán và cấu trúc dữ liệu",
                subjectCode: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                subjectCodeName: "Khoa học máy tính",
                totalQuestions: 2,
                difficultyLevel: "Trung bình",
                questions: [
                    {
                        questionId: "8e1ca949-3135-45cb-b9ff-3af9d0b55b74",
                        questionText:
                            "Độ phức tạp thời gian của fun() là gì?\nint fun(int n) {\r\n int count = 0;\r\n for (int i = n; i > 0; i /= 2)\r\n for (int j = 0; j < i; j++)\r\n count += 1;\r\n return count;\r\n}",
                        questionType: "single_choice",
                        answers: [
                            {
                                answerId:
                                    "ba531885-9fc4-431c-87ed-205f28c1def6",
                                answerText: "O(n²)",
                            },
                            {
                                answerId:
                                    "19392c97-a157-45c6-8af1-d1efd5ef66ff",
                                answerText: "O(nlog(n))",
                            },
                            {
                                answerId:
                                    "e7aaa43e-36ff-44d1-ad45-99364ed953b6",
                                answerText: "O(n)",
                            },
                            {
                                answerId:
                                    "542d7fdf-76c7-487a-8c56-797ead4baaf8",
                                answerText: "O(nlog(n*Log(n)))",
                            },
                        ],
                    },
                    {
                        questionId: "4e70ebdd-6393-49fe-9115-7ca8318cc81a",
                        questionText: "OOP viết tắt của",
                        questionType: "single_choice",
                        answers: [
                            {
                                answerId:
                                    "4e5cd206-ead3-408e-838f-2a0319674d25",
                                answerText: "Object-Oriented Programming",
                            },
                            {
                                answerId:
                                    "ef222e87-270a-4259-b47d-7db697df9ff8",
                                answerText: "Object-Oriented Programmin",
                            },
                            {
                                answerId:
                                    "54c506ce-53c7-4038-8787-a4d7956e1c5d",
                                answerText: "Obje-Oriented Programming",
                            },
                            {
                                answerId:
                                    "21351e90-14a3-4cde-ad32-df42205438e2",
                                answerText: "ahihi đồ ngốc",
                            },
                        ],
                    },
                ],
            },
            {
                quizId: "c1c4e915-6891-4849-841d-3c228cfe2f37",
                title: "Lập trình hướng đối tượng",
                description: "Kiểm tra kiến thức về OOP và thiết kế hệ thống",
                subjectCode: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
                subjectCodeName: "Lập trình",
                totalQuestions: 1,
                difficultyLevel: "Khó",
                questions: [
                    {
                        questionId: "9f2db8e7-4c5a-6b9d-8e1f-2a3b4c5d6e7f",
                        questionText:
                            "Nguyên lý nào sau đây KHÔNG phải là nguyên lý cơ bản của OOP?",
                        questionType: "single_choice",
                        answers: [
                            {
                                answerId:
                                    "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                                answerText: "Encapsulation (Đóng gói)",
                            },
                            {
                                answerId:
                                    "b2c3d4e5-f6g7-8901-2345-67890abcdef1",
                                answerText: "Inheritance (Kế thừa)",
                            },
                            {
                                answerId:
                                    "c3d4e5f6-g7h8-9012-3456-7890abcdef12",
                                answerText: "Polymorphism (Đa hình)",
                            },
                            {
                                answerId:
                                    "d4e5f6g7-h8i9-0123-4567-890abcdef123",
                                answerText: "Compilation (Biên dịch)",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    success: true,
    messageId: "I00001",
    message: "Lấy thông tin bài test thành công.",
    detailErrors: null,
};

const mockStudentTestResultResponse = {
    response: {
        studentTestId: "838ee770-40c8-46c9-93f9-74462721e0b5",
        testId: "4946743a-439e-4c59-b238-a1e09a83d0ca",
        testName: "Kiểm tra đầu vào",
        description: "Bài kiểm tra đầu vào đánh giá năng lực của sinh viên",
        startedAt: "2025-09-17T17:23:51.543Z",
        finishedAt: "2025-09-17T17:37:09.3726867Z",
        quizzesResults: [
            {
                quizId: "58c84611-7615-4f05-8cdd-fd1fde774d93",
                title: "Cấu trúc dữ liệu và giải thuật",
                description:
                    "Những câu hỏi cơ bản về thuật toán và cấu trúc dữ liệu",
                subjectCode: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                subjectCodeName: "Khoa học máy tính",
                totalQuestions: 2,
                difficultyLevel: "Trung bình",
                correctedQuestions: 1,
                questionsResult: [
                    {
                        questionId: "8e1ca949-3135-45cb-b9ff-3af9d0b55b74",
                        questionText:
                            "Độ phức tạp thời gian của fun() là gì?\nint fun(int n) {\r\n int count = 0;\r\n for (int i = n; i > 0; i /= 2)\r\n for (int j = 0; j < i; j++)\r\n count += 1;\r\n return count;\r\n}",
                        questionType: "single_choice",
                        answers: [
                            {
                                answerId:
                                    "ba531885-9fc4-431c-87ed-205f28c1def6",
                                answerText: "O(n²)",
                                isCorrectAnswer: true,
                                selectedByStudent: false,
                            },
                            {
                                answerId:
                                    "19392c97-a157-45c6-8af1-d1efd5ef66ff",
                                answerText: "O(nlog(n))",
                                isCorrectAnswer: false,
                                selectedByStudent: true,
                            },
                            {
                                answerId:
                                    "e7aaa43e-36ff-44d1-ad45-99364ed953b6",
                                answerText: "O(n)",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                            {
                                answerId:
                                    "542d7fdf-76c7-487a-8c56-797ead4baaf8",
                                answerText: "O(nlog(n*Log(n)))",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                        ],
                        answerExplanation:
                            "Đây là độ phức tạp O(n²) vì vòng lặp ngoài chạy log(n) lần và vòng lặp trong chạy n, n/2, n/4... lần, tổng cộng là n + n/2 + n/4 + ... ≈ 2n = O(n²)",
                    },
                    {
                        questionId: "4e70ebdd-6393-49fe-9115-7ca8318cc81a",
                        questionText: "OOP viết tắt của",
                        questionType: "single_choice",
                        answers: [
                            {
                                answerId:
                                    "4e5cd206-ead3-408e-838f-2a0319674d25",
                                answerText: "Object-Oriented Programming",
                                isCorrectAnswer: true,
                                selectedByStudent: true,
                            },
                            {
                                answerId:
                                    "ef222e87-270a-4259-b47d-7db697df9ff8",
                                answerText: "Object-Oriented Programmin",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                            {
                                answerId:
                                    "54c506ce-53c7-4038-8787-a4d7956e1c5d",
                                answerText: "Obje-Oriented Programming",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                            {
                                answerId:
                                    "21351e90-14a3-4cde-ad32-df42205438e2",
                                answerText: "ahihi đồ ngốc",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                        ],
                        answerExplanation:
                            "OOP là viết tắt của Object-Oriented Programming (Lập trình hướng đối tượng)",
                    },
                ],
            },
            {
                quizId: "c1c4e915-6891-4849-841d-3c228cfe2f37",
                title: "Lập trình hướng đối tượng",
                description: "Kiểm tra kiến thức về OOP và thiết kế hệ thống",
                subjectCode: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
                subjectCodeName: "Lập trình",
                totalQuestions: 1,
                difficultyLevel: "Khó",
                correctedQuestions: 1,
                questionsResult: [
                    {
                        questionId: "9f2db8e7-4c5a-6b9d-8e1f-2a3b4c5d6e7f",
                        questionText:
                            "Nguyên lý nào sau đây KHÔNG phải là nguyên lý cơ bản của OOP?",
                        questionType: "single_choice",
                        answers: [
                            {
                                answerId:
                                    "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                                answerText: "Encapsulation (Đóng gói)",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                            {
                                answerId:
                                    "b2c3d4e5-f6g7-8901-2345-67890abcdef1",
                                answerText: "Inheritance (Kế thừa)",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                            {
                                answerId:
                                    "c3d4e5f6-g7h8-9012-3456-7890abcdef12",
                                answerText: "Polymorphism (Đa hình)",
                                isCorrectAnswer: false,
                                selectedByStudent: false,
                            },
                            {
                                answerId:
                                    "d4e5f6g7-h8i9-0123-4567-890abcdef123",
                                answerText: "Compilation (Biên dịch)",
                                isCorrectAnswer: true,
                                selectedByStudent: true,
                            },
                        ],
                        answerExplanation:
                            "Compilation (Biên dịch) không phải là nguyên lý cơ bản của OOP. Các nguyên lý cơ bản của OOP gồm: Encapsulation, Inheritance, Polymorphism và Abstraction.",
                    },
                ],
            },
        ],
    },
    success: true,
    messageId: "I00001",
    message: "Lấy thông tin bài kiểm tra của học sinh thành công.",
    detailErrors: null,
};

// Mock API delay simulation
const mockDelay = (ms: number = 800) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockQuizAPI = {
    // GET /api/v1/quiz
    getQuizList: async () => {
        if (!USE_MOCK) return null;
        console.log("🎭 Using Mock Quiz List API");
        await mockDelay();
        return mockQuizListResponse;
    },

    // POST /api/v1/test
    createTest: async (quizIds: string[]) => {
        if (!USE_MOCK) return null;
        console.log("🎭 Using Mock Test Creation API", { quizIds });
        await mockDelay();
        return mockTestDetailResponse;
    },

    // GET /api/v1/student-test/{studentTestId}
    getStudentTestResult: async (studentTestId: string) => {
        if (!USE_MOCK) return null;
        console.log("🎭 Using Mock Student Test Result API", { studentTestId });
        await mockDelay();
        return mockStudentTestResultResponse;
    },

    // POST /api/v1/student-test (submit answers)
    submitStudentTest: async (testData: {
        testId: string;
        answers: Array<{
            questionId: string;
            selectedAnswers: string[];
        }>;
    }) => {
        if (!USE_MOCK) return null;
        console.log("🎭 Using Mock Submit Test API", { testData });
        await mockDelay();
        // Return a studentTestId for getStudentTestResult
        return {
            response: {
                studentTestId: "838ee770-40c8-46c9-93f9-74462721e0b5",
            },
            success: true,
            messageId: "I00001",
            message: "Nộp bài thành công.",
            detailErrors: null,
        };
    },
};
