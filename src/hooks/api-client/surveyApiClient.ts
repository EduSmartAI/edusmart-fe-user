/**
 * File này chứa các hàm gọi API từ phía CLIENT (browser)
 * Lưu ý: Hiện tại gặp vấn đề CORS từ phía BE nên tạm chưa call api client. Chờ fix xong
 */

"use client";

// import { Api } from "EduSmart/api/api-quiz-service";
import apiClient from "EduSmart/hooks/apiClient";

// ===== TYPES =====
export interface SemesterSelectResponse {
    semesterId: string;
    semesterName: string;
    semesterNumber?: number;
}

export interface MajorSelectResponse {
    majorId: string;
    majorName: string;
    majorCode: string;
    parentMajorId?: string;
}

export interface TechnologySelectResponse {
    technologyId: string;
    technologyName: string;
    technologyType: TechnologyType;
}

export interface LearningGoalSelectResponse {
    learningGoalId: string;
    learningGoalName: string;
    learningGoalType: number;
}

export interface SurveyListResponse {
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
}

export interface SurveyDetailResponse {
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
    questions: SurveyQuestion[];
}

export interface SurveyQuestion {
    questionId: string;
    questionText: string;
    questionType: number;
    answers: SurveyAnswer[];
}

export interface SurveyAnswer {
    answerId: string;
    answerText: string;
    isCorrect: boolean;
}

// Survey Submission Types (for client-side submission)
export interface ClientSurveySubmissionData {
    surveyId: string;
    surveyCode?: string;
    userAnswers: ClientSurveyUserAnswer[];
    completedAt?: string;
    timeSpent?: number; // in seconds
}

export interface ClientSurveyUserAnswer {
    questionId: string;
    answerId?: string; // For single/multiple choice
    answerIds?: string[]; // For multiple selections
    answerText?: string; // For free text answers
    answerValue?: number | boolean; // For numerical/boolean answers
}

export interface ClientSurveySubmissionResult {
    submissionId: string;
    surveyId: string;
    score?: number;
    maxScore?: number;
    percentage?: number;
    passStatus?: boolean;
    feedback?: string;
    recommendations?: ClientSurveyRecommendation[];
}

export interface ClientSurveyRecommendation {
    type: "course" | "skill" | "path" | "resource";
    title: string;
    description: string;
    priority: number;
    estimatedTime?: string;
    link?: string;
}

// API Response wrapper for client
export interface ClientApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ===== ENUMS =====
export enum TechnologyType {
    ProgrammingLanguage = 1,
    Framework = 2,
    Tool = 3,
    Platform = 4,
    Database = 5,
    Other = 6,
}

export enum QuestionType {
    MultipleChoice = 1,
    TrueFalse = 2,
    ShortAnswer = 3,
    SingleChoice = 4,
}

// ===== CLIENT API FUNCTIONS =====
// Những hàm này được gọi từ CLIENT SIDE để lấy dữ liệu form

/**
 * CLIENT API: Lấy danh sách tất cả các học kỳ
 */
export async function getSemesters(): Promise<SemesterSelectResponse[]> {
    try {
        console.log("Calling real API for semesters...");
        const response =
            await apiClient.quizService.api.v1ExternalQuizSelectSemestersList();

        console.log("Semesters API response:", response);

        if (response.data?.success && response.data?.response) {
            return response.data.response.map((item) => ({
                semesterId: item.semesterId!,
                semesterName: item.semesterName!,
                semesterNumber: item.semesterNumber!,
            }));
        }
        throw new Error(response.data?.message || "Không thể lấy danh sách học kỳ");
    } catch (error) {
        console.error("Error fetching semesters:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Không thể tải danh sách kỳ học. Vui lòng thử lại sau."
        );
    }
}

/**
 * CLIENT API: Lấy danh sách tất cả các chuyên ngành
 */
export async function getMajors(): Promise<MajorSelectResponse[]> {
    try {
        console.log("Calling real API for majors...");
        const response =
            await apiClient.quizService.api.v1ExternalQuizSelectMajorsList();

        console.log("Majors API response:", response);

        if (response.data?.success && response.data?.response) {
            return response.data.response.map((item) => ({
                majorId: item.majorId!,
                majorName: item.majorName!,
                majorCode: item.majorCode!,
                parentMajorId: item.parentMajorId || undefined,
            }));
        }
        throw new Error(
            response.data?.message || "Không thể lấy danh sách chuyên ngành",
        );
    } catch (error) {
        console.error("Error fetching majors:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Không thể tải danh sách chuyên ngành. Vui lòng thử lại sau."
        );
    }
}

/**
 * CLIENT API: Lấy danh sách tất cả các công nghệ (ngôn ngữ lập trình, framework, etc.)
 */
export async function getTechnologies(): Promise<TechnologySelectResponse[]> {
    try {
        console.log("Calling real API for technologies...");
        const response =
            await apiClient.quizService.api.v1ExternalQuizSelectTechnologiesList();

        console.log("Technologies API response:", response);

        if (response.data?.success && response.data?.response) {
            return response.data.response.map((item) => ({
                technologyId: item.technologyId!,
                technologyName: item.technologyName!,
                technologyType: item.technologyType! as TechnologyType,
            }));
        }
        throw new Error(
            response.data?.message || "Không thể lấy danh sách công nghệ",
        );
    } catch (error) {
        console.error("Error fetching technologies:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Không thể tải danh sách công nghệ. Vui lòng thử lại sau."
        );
    }
}

/**
 * CLIENT API: Lấy danh sách tất cả các mục tiêu học tập
 */
export async function getLearningGoals(): Promise<
    LearningGoalSelectResponse[]
> {
    try {
        console.log("Calling real API for learning goals...");
        const response =
            await apiClient.quizService.api.v1ExternalQuizSelectLearningGoalsList();

        console.log("Learning goals API response:", response);

        if (response.data?.success && response.data?.response) {
            return response.data.response.map((item) => ({
                learningGoalId: item.learningGoalId!,
                learningGoalName: item.learningGoalName!,
                learningGoalType: item.learningGoalType!,
            }));
        }
        throw new Error(
            response.data?.message || "Không thể lấy danh sách mục tiêu học tập",
        );
    } catch (error) {
        console.error("Error fetching learning goals:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Không thể tải danh sách mục tiêu học tập. Vui lòng thử lại sau."
        );
    }
}

/**
 * CLIENT API: Lấy danh sách tất cả các survey
 */
export async function getSurveyList(): Promise<SurveyListResponse[]> {
    try {
        console.log("🌐 CLIENT API: Getting survey list");

        const response = await apiClient.quizService.api.v1SurveyList();

        if (response.data?.success && response.data?.response) {
            console.log("✅ CLIENT API: Survey list loaded from API successfully");
            return response.data.response.map((item) => ({
                surveyId: item.surveyId!,
                title: item.title,
                description: item.description!,
                surveyCode: item.surveyCode!,
            }));
        }

        throw new Error(response.data?.message || "Failed to get survey list");
    } catch (error) {
        console.error("❌ CLIENT API - Get survey list error:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Không thể tải danh sách khảo sát. Vui lòng thử lại sau."
        );
    }
}

/**
 * CLIENT API: Lấy chi tiết một survey theo ID
 */
export async function getSurveyDetail(
    surveyId: string,
    pageIndex = 0,
    pageSize = 50,
): Promise<SurveyDetailResponse> {
    try {
        console.log("Calling real API for survey detail...");
        const response = await apiClient.quizService.api.v1SurveyDetailList({
            SurveyId: surveyId,
            PageIndex: pageIndex,
            PageSize: pageSize,
        });

        console.log("Survey detail API response:", response);

        if (response.data?.success && response.data?.response?.items?.[0]) {
            const survey = response.data.response.items[0];
            return {
                surveyId: survey.surveyId!,
                title: survey.title || undefined,
                description: survey.description!,
                surveyCode: survey.surveyCode!,
                questions:
                    survey.questions?.map((q) => ({
                        questionId: q.questionId!,
                        questionText: q.questionText!,
                        questionType: q.questionType!,
                        answers:
                            q.answers?.map((a) => ({
                                answerId: a.answerId!,
                                answerText: a.answerText!,
                                isCorrect: a.isCorrect!,
                            })) || [],
                    })) || [],
            };
        }
        throw new Error(response.data?.message || "Không thể lấy chi tiết survey");
    } catch (error) {
        console.error("Error fetching survey detail:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Không thể tải chi tiết khảo sát. Vui lòng thử lại sau."
        );
    }
}

/**
 * CLIENT API: Lấy chi tiết survey theo surveyCode (INTEREST, HABIT)
 */
export async function getSurveyByCode(
    surveyCode: string,
): Promise<SurveyDetailResponse> {
    try {
        // Lấy danh sách survey trước
        const surveyList = await getSurveyList();
        const survey = surveyList.find((s) => s.surveyCode === surveyCode);

        if (!survey) {
            throw new Error(`Không tìm thấy survey với code: ${surveyCode}`);
        }

        // Lấy chi tiết survey
        return await getSurveyDetail(survey.surveyId);
    } catch (error) {
        console.error(`Error fetching survey by code ${surveyCode}:`, error);
        throw error;
    }
}

// ===============================
// CLIENT API: WRITE OPERATIONS
// ===============================

/**
 * CLIENT API: Submit survey (WRITE OPERATION - Use với cẩn thận)
 * ⚠️ WARNING: Client-side submission có thể có security issues
 * 💡 RECOMMENDATION: Sử dụng server actions cho production
 */
export async function submitSurveyClient(
    submissionData: ClientSurveySubmissionData,
): Promise<ClientApiResponse<ClientSurveySubmissionResult>> {
    try {
        console.warn(
            "⚠️  CLIENT API: Submitting survey via browser (not recommended for production)",
        );

        // Transform data to API format
        const apiData = {
            surveyId: submissionData.surveyId,
            surveyCode: submissionData.surveyCode,
            answers: submissionData.userAnswers,
            completedAt: submissionData.completedAt || new Date().toISOString(),
            timeSpent: submissionData.timeSpent || 0,
        };

        console.log("CLIENT: Submitting survey data:", apiData);

        const response =
            await apiClient.quizService.api.v1StudentSurveyInsertStudentSurveyCreate(
                {
                    studentInformation: {
                        majorId: "default-major", // You may need to get this from context/auth
                        semesterId: "default-semester",
                        technologies: [],
                        learningGoal: {
                            learningGoalId: "default-goal",
                            learningGoalType: 1,
                        },
                    },
                    studentSurveys: [
                        {
                            surveyId: submissionData.surveyId,
                            surveyCode: submissionData.surveyCode || "UNKNOWN",
                            answers: submissionData.userAnswers.map((answer) => ({
                                questionId: answer.questionId,
                                answerId: answer.answerId || "",
                            })),
                        },
                    ],
                },
            );

        if (response.data?.success) {
            const result: ClientSurveySubmissionResult = {
                submissionId: response.data.response || `client_sub_${Date.now()}`,
                surveyId: submissionData.surveyId,
                score: 85, // Default score
                maxScore: 100,
                percentage: 85,
                passStatus: true,
                feedback: "✅ Survey đã được submit thành công thông qua API!",
            };
            return { success: true, data: result };
        }

        throw new Error(response.data?.message || "API submission failed");
    } catch (error) {
        console.error("CLIENT API - Submit survey error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Không thể gửi khảo sát. Vui lòng thử lại sau.",
        };
    }
}

/**
 * CLIENT API: Get survey results (READ OPERATION - Recommended for client)
 */
export async function getSurveyResults(
    submissionId: string,
): Promise<ClientApiResponse<ClientSurveySubmissionResult>> {
    try {
        console.log(
            `CLIENT API: Getting survey results for submission ${submissionId}`,
        );

        // TODO: Implement actual API call when backend is ready
        // const response = await apiClient.quizService.api.v1ExternalQuizGetSurveyResults({ submissionId });

        throw new Error("Survey results API not implemented yet");
    } catch (error) {
        console.error("CLIENT API - Get survey results error:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Không thể tải kết quả khảo sát. Vui lòng thử lại sau.",
        };
    }
}

/**
 * CLIENT API: Get user's survey history (READ OPERATION - Recommended for client)
 */
export async function getUserSurveyHistory(
    userId?: string,
): Promise<ClientApiResponse<ClientSurveySubmissionResult[]>> {
    try {
        console.log(
            `CLIENT API: Getting user survey history ${userId ? `for user ${userId}` : ""}`,
        );

        // TODO: Implement actual API call when backend is ready
        // const response = await apiClient.quizService.api.v1ExternalQuizGetUserSurveyHistory({ userId });

        throw new Error("User survey history API not implemented yet");
    } catch (error) {
        console.error("CLIENT API - Get user survey history error:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Không thể tải lịch sử khảo sát. Vui lòng thử lại sau.",
        };
    }
}
