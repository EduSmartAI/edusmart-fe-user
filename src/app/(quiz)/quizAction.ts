// app/(quiz)/quizAction.ts
"use server";

import { getAuthHeaderFromCookie } from "EduSmart/lib/authServer";

const BACKEND = process.env.API_URL!;

// Mock data imports (for development)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_QUIZ_MOCK === "true";

export interface QuizListItem {
    quizId: string;
    title: string;
    description: string;
    subjectCode: string;
    subjectCodeName: string;
    totalQuestions: number;
    difficultyLevel?: string;
}

export interface TestDetail {
    testId: string;
    testName: string;
    description: string;
    quizzes: Array<{
        quizId: string;
        title: string;
        description: string;
        questions: QuizQuestion[];
    }>;
}

export interface QuizQuestion {
    questionId: string;
    questionText: string;
    questionType: string;
    answers: QuizAnswer[];
}

export interface QuizAnswer {
    answerId: string;
    answerText: string;
    isCorrectAnswer?: boolean;
    selectedByStudent?: boolean;
}

export interface StudentTestResult {
    studentTestId: string;
    testId: string;
    testName: string;
    startedAt: string;
    finishedAt: string;
    quizzesResults: Array<{
        quizId: string;
        title: string;
        correctedQuestions: number;
        questionsResult: QuizQuestion[];
    }>;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    response: T;
    messageId?: string;
    detailErrors?: null;
}

async function fetchWithAuth(
    path: string,
    options: RequestInit = {},
): Promise<Response> {
    const authHeader = await getAuthHeaderFromCookie();
    const url = `${BACKEND}${path}`;

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...authHeader,
            ...options.headers,
        },
        cache: "no-store",
    });
}

function parseJson<T>(text: string): T | null {
    try {
        return JSON.parse(text) as T;
    } catch {
        return null;
    }
}

/**
 * Server Action: Get Quiz List
 */
export async function getQuizListAction(): Promise<
    | { ok: true; data: ApiResponse<QuizListItem[]> }
    | { ok: false; error: string; status?: number }
> {
    try {
        // Handle mock environment
        if (USE_MOCK) {
            console.log("🎭 Using mock quiz list in Server Action");
            const mockModule = await import("EduSmart/lib/quizMockAPI");
            const mockResult = await mockModule.mockQuizAPI.getQuizList();
            return {
                ok: true,
                data: mockResult as ApiResponse<QuizListItem[]>,
            };
        }

        // console.log("🌐 Using real quiz list API");
        const response = await fetchWithAuth("/quiz/api/v1/Quiz");
        const raw = await response.text();
        const data = parseJson<ApiResponse<QuizListItem[]>>(raw);

        if (response.ok && data) {
            return { ok: true, data };
        }

        return {
            ok: false,
            error: data?.message || "Failed to fetch quiz list",
            status: response.status,
        };
    } catch (error) {
        console.error("❌ Error in getQuizListAction:", error);
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch quiz list",
        };
    }
}

/**
 * Server Action: Create Test
 */
export async function createTestAction(
    quizIds: string[],
): Promise<
    | { ok: true; data: ApiResponse<TestDetail> }
    | { ok: false; error: string; status?: number }
> {
    try {
        // Handle mock environment
        if (USE_MOCK) {
            console.log("🎭 Using mock create test in Server Action");
            const mockModule = await import("EduSmart/lib/quizMockAPI");
            const mockResult = await mockModule.mockQuizAPI.createTest(quizIds);
            return { ok: true, data: mockResult as ApiResponse<TestDetail> };
        }

        console.log("🌐 Using real create test API");

        // Build query string for multiple QuizId params
        const queryParams = quizIds
            .map((id: string) => `QuizId=${id}`)
            .join("&");
        const urlWithParams = `/quiz/api/v1/Test?${queryParams}`;

        const response = await fetchWithAuth(urlWithParams);
        const raw = await response.text();
        const data = parseJson<ApiResponse<TestDetail>>(raw);

        if (response.ok && data) {
            return { ok: true, data };
        }

        return {
            ok: false,
            error: data?.message || "Failed to create test",
            status: response.status,
        };
    } catch (error) {
        console.error("❌ Error in createTestAction:", error);
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to create test",
        };
    }
}

/**
 * Server Action: Submit Student Test
 */
export async function submitStudentTestAction(testData: {
    testId: string;
    startedAt: string;
    answers: Array<{ questionId: string; answerId: string }>;
}): Promise<
    | { ok: true; data: ApiResponse<{ studentTestId: string }> }
    | { ok: false; error: string; status?: number }
> {
    try {
        // Handle mock environment
        if (USE_MOCK) {
            console.log("🎭 Using mock submit test in Server Action");
            const mockModule = await import("EduSmart/lib/quizMockAPI");

            // Transform to backend format for mock
            const payload = {
                testId: testData.testId,
                answers: testData.answers.map((answer) => ({
                    questionId: answer.questionId,
                    selectedAnswers: [answer.answerId],
                })),
            };

            const mockResult =
                await mockModule.mockQuizAPI.submitStudentTest(payload);
            return {
                ok: true,
                data: mockResult as ApiResponse<{ studentTestId: string }>,
            };
        }

        console.log("🌐 Using real submit test API");

        // Transform to backend format
        const payload = {
            testId: testData.testId,
            answers: testData.answers.map((answer) => ({
                questionId: answer.questionId,
                selectedAnswers: [answer.answerId],
            })),
        };

        const response = await fetchWithAuth(
            "/quiz/api/v1/StudentTest/submit",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );

        const raw = await response.text();
        const data = parseJson<ApiResponse<{ studentTestId: string }>>(raw);

        if (response.ok && data) {
            return { ok: true, data };
        }

        return {
            ok: false,
            error: data?.message || "Failed to submit test",
            status: response.status,
        };
    } catch (error) {
        console.error("❌ Error in submitStudentTestAction:", error);
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to submit test",
        };
    }
}

/**
 * Server Action: Get Student Test Result
 */
export async function getStudentTestResultAction(
    studentTestId: string,
): Promise<
    | { ok: true; data: ApiResponse<StudentTestResult> }
    | { ok: false; error: string; status?: number }
> {
    try {
        // Handle mock environment
        if (USE_MOCK) {
            console.log("🎭 Using mock student test result in Server Action");
            const mockModule = await import("EduSmart/lib/quizMockAPI");
            const mockResult =
                await mockModule.mockQuizAPI.getStudentTestResult(
                    studentTestId,
                );
            return {
                ok: true,
                data: mockResult as ApiResponse<StudentTestResult>,
            };
        }

        console.log("🌐 Using real student test result API");
        const response = await fetchWithAuth(
            `/quiz/api/v1/StudentTest?studentTestId=${studentTestId}`,
        );
        const raw = await response.text();
        const data = parseJson<ApiResponse<StudentTestResult>>(raw);

        if (response.ok && data) {
            return { ok: true, data };
        }

        return {
            ok: false,
            error: data?.message || "Failed to get test result",
            status: response.status,
        };
    } catch (error) {
        console.error("❌ Error in getStudentTestResultAction:", error);
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to get test result",
        };
    }
}
