"use server";

import {
  Survey1FormValues,
  Survey2FormValues,
  Survey3FormValues,
} from "EduSmart/types";
import { normalizeFetchError } from "EduSmart/app/(quiz)/quizAction";
import apiServer from "EduSmart/lib/apiServer";

// ======================== API RESPONSE TYPES ========================
export interface SurveySubmissionResponse {
  surveyId: string;
  submittedAt: string;
  status: "success" | "pending" | "failed";
  recommendations?: {
    suggestedCourses: string[];
    learningPath: string[];
    nextSteps: string[];
  };
}

export interface SurveyRecommendationResponse {
  userId: string;
  surveyId: string;
  generatedAt: string;
  recommendations: {
    courses: Array<{
      courseId: string;
      courseName: string;
      difficulty: string;
      priority: number;
    }>;
    learningPath: Array<{
      stepId: string;
      stepName: string;
      description: string;
      estimatedWeeks: number;
    }>;
    skills: Array<{
      skillId: string;
      skillName: string;
      currentLevel: string;
      targetLevel: string;
    }>;
  };
}

// ======================== HELPER FUNCTIONS ========================

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Log payload structure for debugging
 */
function logPayloadStructure(
  payload: {
    studentInformation?: {
      majorId?: string;
      semesterId?: string;
      technologies?: Array<unknown>;
      learningGoal?: {
        learningGoalId?: string;
        learningGoalType?: number;
      };
    };
    studentSurveys?: Array<{
      surveyId?: string;
      surveyCode?: string;
      answers?: Array<unknown>;
    }>;
  },
  title: string = "Payload Structure",
): void {
  console.log(`\n🔍 ${title}:`);
  console.log("├── studentInformation:");
  console.log(
    "│   ├── majorId:",
    payload.studentInformation?.majorId ? "✅" : "❌",
  );
  console.log(
    "│   ├── semesterId:",
    payload.studentInformation?.semesterId ? "✅" : "❌",
  );
  console.log(
    "│   ├── technologies:",
    `[${payload.studentInformation?.technologies?.length || 0} items]`,
  );
  console.log("│   └── learningGoal:");
  console.log(
    "│       ├── learningGoalId:",
    payload.studentInformation?.learningGoal?.learningGoalId ? "✅" : "❌",
  );
  console.log(
    "│       └── learningGoalType:",
    payload.studentInformation?.learningGoal?.learningGoalType,
  );
  console.log(
    "└── studentSurveys:",
    `[${payload.studentSurveys?.length || 0} surveys]`,
  );
  payload.studentSurveys?.forEach((survey, index) => {
    console.log(`    ├── Survey ${index + 1}:`);
    console.log(`    │   ├── surveyId: ${survey.surveyId ? "✅" : "❌"}`);
    console.log(`    │   ├── surveyCode: ${survey.surveyCode}`);
    console.log(
      `    │   └── answers: [${survey.answers?.length || 0} answers]`,
    );
  });
}

/**
 * Validate survey payload before submission
 */
function validateSurveyPayload(payload: {
  studentInformation: {
    majorId: string;
    semesterId: string;
    technologies: Array<{
      technologyId: string;
      technologyName: string;
      technologyType: number;
    }>;
    learningGoal: {
      learningGoalId: string;
      learningGoalType: number;
    };
  };
  studentSurveys: Array<{
    surveyId: string;
    surveyCode: string;
    answers: Array<{
      questionId: string;
      answerId: string;
    }>;
  }>;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate student information
  if (!payload.studentInformation) {
    errors.push("Student information is required");
  } else {
    if (!payload.studentInformation.majorId) {
      errors.push("Major ID is required");
    } else if (!isValidUUID(payload.studentInformation.majorId)) {
      errors.push("Major ID must be a valid UUID");
    }

    if (!payload.studentInformation.semesterId) {
      errors.push("Semester ID is required");
    } else if (!isValidUUID(payload.studentInformation.semesterId)) {
      errors.push("Semester ID must be a valid UUID");
    }

    if (!payload.studentInformation.learningGoal?.learningGoalId) {
      errors.push("Learning Goal ID is required");
    } else if (
      !isValidUUID(payload.studentInformation.learningGoal.learningGoalId)
    ) {
      errors.push("Learning Goal ID must be a valid UUID");
    }

    if (
      typeof payload.studentInformation.learningGoal?.learningGoalType !==
      "number"
    ) {
      errors.push("Learning Goal Type must be a number");
    }
  }

  // Validate student surveys
  if (payload.studentSurveys && Array.isArray(payload.studentSurveys)) {
    payload.studentSurveys.forEach((survey, index) => {
      if (!survey.surveyId) {
        errors.push(`Survey ${index + 1}: Survey ID is required`);
      } else if (!isValidUUID(survey.surveyId)) {
        errors.push(`Survey ${index + 1}: Survey ID must be a valid UUID`);
      }

      if (!survey.surveyCode) {
        errors.push(`Survey ${index + 1}: Survey code is required`);
      }

      if (!survey.answers || !Array.isArray(survey.answers)) {
        errors.push(`Survey ${index + 1}: Answers array is required`);
      } else {
        survey.answers.forEach((answer, answerIndex) => {
          if (!answer.questionId) {
            errors.push(
              `Survey ${index + 1}, Answer ${answerIndex + 1}: Question ID is required`,
            );
          } else if (!isValidUUID(answer.questionId)) {
            errors.push(
              `Survey ${index + 1}, Answer ${answerIndex + 1}: Question ID must be a valid UUID`,
            );
          }

          if (!answer.answerId) {
            errors.push(
              `Survey ${index + 1}, Answer ${answerIndex + 1}: Answer ID is required`,
            );
          } else if (!isValidUUID(answer.answerId)) {
            errors.push(
              `Survey ${index + 1}, Answer ${answerIndex + 1}: Answer ID must be a valid UUID`,
            );
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ======================== SERVER ACTIONS ========================

/**
 * Get all semesters - SERVER SIDE API CALL
 */
export async function getSemesterAction(): Promise<{
  ok: boolean;
  data?: Array<{
    semesterId: string;
    semesterName: string;
    semesterNumber: number;
  }>;
  error?: string;
}> {
  try {
    console.log("🔒 SERVER ACTION: Getting semesters via server");

    const response =
      await apiServer.quiz.api.v1ExternalQuizSelectSemestersList();

    if (response.data?.success && response.data?.response) {
      return {
        ok: true,
        data: response.data.response.map((item) => ({
          semesterId: item.semesterId!,
          semesterName: item.semesterName!,
          semesterNumber: item.semesterNumber!,
        })),
      };
    }

    throw new Error(response.data?.message || "Failed to get semesters");
  } catch (error) {
    console.error("Server Action - Get semesters error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get semesters";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all majors - SERVER SIDE API CALL
 */
export async function getMajorAction(): Promise<{
  ok: boolean;
  data?: Array<{
    majorId: string;
    majorName: string;
    majorCode: string;
    parentMajorId?: string;
  }>;
  error?: string;
}> {
  try {
    console.log("🔒 SERVER ACTION: Getting majors via server");

    const response = await apiServer.quiz.api.v1ExternalQuizSelectMajorsList();

    if (response.data?.success && response.data?.response) {
      return {
        ok: true,
        data: response.data.response.map((item) => ({
          majorId: item.majorId!,
          majorName: item.majorName!,
          majorCode: item.majorCode!,
          parentMajorId: item.parentMajorId,
        })),
      };
    }

    throw new Error(response.data?.message || "Failed to get majors");
  } catch (error) {
    console.error("Server Action - Get majors error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get majors";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all learning goals - SERVER SIDE API CALL
 */
export async function getLearningGoalAction(): Promise<{
  ok: boolean;
  data?: Array<{
    learningGoalId: string;
    learningGoalName: string;
    learningGoalType: number;
  }>;
  error?: string;
}> {
  try {
    console.log("🔒 SERVER ACTION: Getting learning goals via server");

    const response =
      await apiServer.quiz.api.v1ExternalQuizSelectLearningGoalsList();

    if (response.data?.success && response.data?.response) {
      return {
        ok: true,
        data: response.data.response.map((item) => ({
          learningGoalId: item.learningGoalId!,
          learningGoalName: item.learningGoalName!,
          learningGoalType: item.learningGoalType!,
        })),
      };
    }

    throw new Error(response.data?.message || "Failed to get learning goals");
  } catch (error) {
    console.error("Server Action - Get learning goals error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get learning goals";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all technologies - SERVER SIDE API CALL
 */
export async function getTechnologyAction(): Promise<{
  ok: boolean;
  data?: Array<{
    technologyId: string;
    technologyName: string;
    technologyType: number;
  }>;
  error?: string;
}> {
  try {
    console.log("🔒 SERVER ACTION: Getting technologies via server");

    const response =
      await apiServer.quiz.api.v1ExternalQuizSelectTechnologiesList();

    if (response.data?.success && response.data?.response) {
      return {
        ok: true,
        data: response.data.response.map((item) => ({
          technologyId: item.technologyId!,
          technologyName: item.technologyName!,
          technologyType: item.technologyType!,
        })),
      };
    }

    throw new Error(response.data?.message || "Failed to get technologies");
  } catch (error) {
    console.error("Server Action - Get technologies error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get technologies";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * Get survey list - SERVER SIDE API CALL
 */
export async function getSurveyListAction(): Promise<{
  ok: boolean;
  data?: Array<{
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
  }>;
  error?: string;
}> {
  try {
    console.log("🔒 SERVER ACTION: Getting survey list via server");

    // Try actual API call
    const response = await apiServer.quiz.api.v1SurveyList();

    if (response.data?.success && response.data?.response) {
      return {
        ok: true,
        data: response.data.response.map((item) => ({
          surveyId: item.surveyId!,
          title: item.title,
          description: item.description!,
          surveyCode: item.surveyCode!,
        })),
      };
    }

    throw new Error(response.data?.message || "Failed to get survey list");
  } catch (error) {
    console.error("Server Action - Get survey list error:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to get survey list",
    };
  }
}

/**
 * Get survey detail by ID - SERVER SIDE API CALL
 */
export async function getSurveyDetailAction(
  surveyId: string,
  pageIndex = 0,
  pageSize = 50,
): Promise<{
  ok: boolean;
  data?: {
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
    questions?: Array<{
      questionId: string;
      questionText: string;
      questionType: number;
      answers: Array<{
        answerId: string;
        answerText: string;
        isCorrect: boolean;
      }>;
    }>;
  };
  error?: string;
}> {
  try {
    console.log(
      `🔒 SERVER ACTION: Getting survey detail ${surveyId} via server (page: ${pageIndex}, size: ${pageSize})`,
    );

    // Try actual API call
    const response = await apiServer.quiz.api.v1SurveyDetailList({
      SurveyId: surveyId,
      PageIndex: pageIndex,
      PageSize: pageSize,
    });

    if (
      response.data?.success &&
      response.data?.response?.items &&
      response.data.response.items.length > 0
    ) {
      const surveyData = response.data.response.items[0]; // Get first survey from paged result
      return {
        ok: true,
        data: {
          surveyId: surveyData.surveyId!,
          title: surveyData.title,
          description: surveyData.description!,
          surveyCode: surveyData.surveyCode!,
          questions:
            surveyData.questions?.map((q) => ({
              questionId: q.questionId!,
              questionText: q.questionText!,
              questionType: q.questionType!,
              answers:
                q.answers?.map((a) => ({
                  answerId: a.answerId!,
                  answerText: a.answerText!,
                  isCorrect: a.isCorrect || false,
                })) || [],
            })) || [],
        },
      };
    }

    throw new Error(response.data?.message || "Failed to get survey detail");
  } catch (error) {
    console.error("Server Action - Get survey detail error:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to get survey detail",
    };
  }
}

/**
 * Get survey by code - SERVER SIDE API CALL
 */
export async function getSurveyByCodeAction(surveyCode: string): Promise<{
  ok: boolean;
  data?: {
    surveyId: string;
    title?: string;
    description: string;
    surveyCode: string;
    questions?: Array<{
      questionId: string;
      questionText: string;
      questionType: number;
      answers: Array<{
        answerId: string;
        answerText: string;
        isCorrect: boolean;
      }>;
    }>;
  };
  error?: string;
}> {
  try {
    console.log(
      `🔒 SERVER ACTION: Getting survey by code ${surveyCode} via server`,
    );

    // First get survey list to find survey by code
    const listResponse = await apiServer.quiz.api.v1SurveyList();

    if (listResponse.data?.success && listResponse.data?.response) {
      // Find survey with matching code
      const targetSurvey = listResponse.data.response.find(
        (survey) => survey.surveyCode === surveyCode,
      );

      if (targetSurvey?.surveyId) {
        // Now get detail for this survey
        const detailResponse = await apiServer.quiz.api.v1SurveyDetailList({
          SurveyId: targetSurvey.surveyId,
          PageIndex: 0,
          PageSize: 50,
        });

        if (
          detailResponse.data?.success &&
          detailResponse.data?.response?.items &&
          detailResponse.data.response.items.length > 0
        ) {
          const surveyData = detailResponse.data.response.items[0];
          return {
            ok: true,
            data: {
              surveyId: surveyData.surveyId!,
              title: surveyData.title,
              description: surveyData.description!,
              surveyCode: surveyData.surveyCode!,
              questions:
                surveyData.questions?.map((q) => ({
                  questionId: q.questionId!,
                  questionText: q.questionText!,
                  questionType: q.questionType!,
                  answers:
                    q.answers?.map((a) => ({
                      answerId: a.answerId!,
                      answerText: a.answerText!,
                      isCorrect: a.isCorrect || false,
                    })) || [],
                })) || [],
            },
          };
        }
      }
    }

    throw new Error(`Survey with code ${surveyCode} not found`);
  } catch (error) {
    console.error("Server Action - Get survey by code error:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to get survey by code",
    };
  }
}

/**
 * Submit complete survey data - SERVER SIDE API CALL
 */
export async function submitSurveyAction(surveyData: {
  survey1Data?: Survey1FormValues;
  survey2Data?: Survey2FormValues;
  survey3Data?: Survey3FormValues;
}): Promise<{
  ok: boolean;
  surveyId?: string;
  error?: string;
}> {
  try {
    const { survey1Data, survey2Data, survey3Data } = surveyData;

    if (!survey1Data) {
      return { ok: false, error: "Survey 1 data is required" };
    }

    // Prepare student information from Survey 1
    const allTechnologies: Array<{
      technologyId: string;
      technologyName: string;
      technologyType: number;
    }> = [];

    // Get technology types from API to map to survey data
    const technologyTypesMap: Map<string, number> = new Map();
    const techResult = await getTechnologyAction();
    if (techResult.ok && techResult.data) {
      techResult.data.forEach((tech) => {
        technologyTypesMap.set(tech.technologyId, tech.technologyType);
      });
    } else {
      throw new Error(techResult.error || "Failed to get technology types");
    }

    // Collect all technologies from Survey 2
    if (survey2Data) {
      if (survey2Data.programmingLanguages) {
        allTechnologies.push(
          ...survey2Data.programmingLanguages.map((tech) => ({
            technologyId: tech.technologyId,
            technologyName: tech.technologyName,
            technologyType: technologyTypesMap.get(tech.technologyId) || 1, // Get from API or default to Programming Language
          })),
        );
      }
      if (survey2Data.frameworks) {
        allTechnologies.push(
          ...survey2Data.frameworks.map((tech) => ({
            technologyId: tech.technologyId,
            technologyName: tech.technologyName,
            technologyType: technologyTypesMap.get(tech.technologyId) || 2, // Get from API or default to Framework
          })),
        );
      }
      if (survey2Data.tools) {
        allTechnologies.push(
          ...survey2Data.tools.map((tech) => ({
            technologyId: tech.technologyId,
            technologyName: tech.technologyName,
            technologyType: technologyTypesMap.get(tech.technologyId) || 3, // Get from API or default to Tool
          })),
        );
      }
      if (survey2Data.platforms) {
        allTechnologies.push(
          ...survey2Data.platforms.map((tech) => ({
            technologyId: tech.technologyId,
            technologyName: tech.technologyName,
            technologyType: technologyTypesMap.get(tech.technologyId) || 4, // Get from API or default to Platform
          })),
        );
      }
      if (survey2Data.databases) {
        allTechnologies.push(
          ...survey2Data.databases.map((tech) => ({
            technologyId: tech.technologyId,
            technologyName: tech.technologyName,
            technologyType: technologyTypesMap.get(tech.technologyId) || 5, // Get from API or default to Database
          })),
        );
      }
      if (survey2Data.others) {
        allTechnologies.push(
          ...survey2Data.others.map((tech) => ({
            technologyId: tech.technologyId,
            technologyName: tech.technologyName,
            technologyType: technologyTypesMap.get(tech.technologyId) || 6, // Get from API or default to Other
          })),
        );
      }
    }

    // Get learningGoalType from API data
    const learningGoalsResult = await getLearningGoalAction();
    if (!learningGoalsResult.ok || !learningGoalsResult.data) {
      throw new Error(
        learningGoalsResult.error || "Failed to get learning goals",
      );
    }

    const selectedGoal = learningGoalsResult.data.find(
      (goal) => goal.learningGoalId === survey1Data.learningGoal,
    );
    if (!selectedGoal) {
      throw new Error("Selected learning goal not found");
    }
    const learningGoalType = selectedGoal.learningGoalType;

    const studentInformation = {
      majorId: survey1Data.specialization || survey1Data.major, // Use specialization if available, otherwise major
      semesterId: survey1Data.semester,
      technologies: allTechnologies,
      learningGoal: {
        learningGoalId: survey1Data.learningGoal,
        learningGoalType: learningGoalType,
      },
    };

    // Prepare student surveys array
    const studentSurveys: Array<{
      surveyId: string;
      surveyCode: string;
      answers: Array<{
        questionId: string;
        answerId: string;
      }>;
    }> = [];

    // Add INTEREST survey if we have interest survey answers
    if (
      survey1Data.interestSurveyAnswers &&
      survey1Data.interestSurveyAnswers.length > 0
    ) {
      // Get INTEREST survey ID dynamically
      const interestSurveyResult = await getSurveyByCodeAction("INTEREST");
      if (!interestSurveyResult.ok || !interestSurveyResult.data?.surveyId) {
        throw new Error(
          interestSurveyResult.error || "Failed to get INTEREST survey",
        );
      }

      studentSurveys.push({
        surveyId: interestSurveyResult.data.surveyId,
        surveyCode: "INTEREST",
        answers: survey1Data.interestSurveyAnswers.map((answer) => ({
          questionId: answer.questionId,
          answerId: answer.selectedAnswerId,
        })),
      });
    }

    // Add HABIT survey if we have survey 3 data
    if (survey3Data?.studyHabits && survey3Data.studyHabits.length > 0) {
      // Convert studyHabits to API format
      const habitAnswers: Array<{ questionId: string; answerId: string }> = [];

      survey3Data.studyHabits.forEach((habit) => {
        // For each selected answer in the habit question
        habit.selectedAnswers.forEach((answerId) => {
          habitAnswers.push({
            questionId: habit.questionId,
            answerId: answerId,
          });
        });
      });

      if (habitAnswers.length > 0) {
        const habitSurveyResult = await getSurveyByCodeAction("HABIT");
        if (!habitSurveyResult.ok || !habitSurveyResult.data?.surveyId) {
          throw new Error(
            habitSurveyResult.error || "Failed to get HABIT survey",
          );
        }

        studentSurveys.push({
          surveyId: habitSurveyResult.data.surveyId,
          surveyCode: "HABIT",
          answers: habitAnswers,
        });
      }
    }

    // Prepare final payload
    const finalPayload = {
      studentInformation: {
        majorId: studentInformation.majorId,
        semesterId: studentInformation.semesterId,
        technologies: studentInformation.technologies,
        learningGoal: {
          learningGoalId: studentInformation.learningGoal.learningGoalId,
          learningGoalType: studentInformation.learningGoal.learningGoalType,
        },
      },
      studentSurveys: studentSurveys,
    };

    // Validate payload before sending
    const validation = validateSurveyPayload(finalPayload);
    if (!validation.isValid) {
      console.error("❌ Payload validation failed:", validation.errors);
      return {
        ok: false,
        error: `Validation failed: ${validation.errors.join(", ")}`,
      };
    }

    // 🚀 DETAILED SURVEY SUBMISSION LOGGING
    console.group("🔥 SURVEY SUBMISSION PAYLOAD DEBUG");
    console.log("📋 Complete Survey Payload:", JSON.stringify(finalPayload, null, 2));
    console.log("🎓 Student Information:");
    console.log("  - Major ID:", finalPayload.studentInformation.majorId);
    console.log("  - Semester ID:", finalPayload.studentInformation.semesterId);
    console.log("  - Technologies Count:", finalPayload.studentInformation.technologies.length);
    console.log("  - Learning Goal ID:", finalPayload.studentInformation.learningGoal.learningGoalId);
    console.log("  - Learning Goal Type:", finalPayload.studentInformation.learningGoal.learningGoalType);
    
    console.log("📝 Student Surveys:");
    finalPayload.studentSurveys.forEach((survey, index) => {
      console.log(`  📖 Survey ${index + 1}:`);
      console.log(`    - Survey ID: ${survey.surveyId}`);
      console.log(`    - Survey Code: ${survey.surveyCode}`);
      console.log(`    - Answers Count: ${survey.answers.length}`);
      survey.answers.forEach((answer, answerIndex) => {
        console.log(`      ${answerIndex + 1}. Question: ${answer.questionId} -> Answer: ${answer.answerId}`);
      });
    });
    
    console.log("🔍 Payload Validation Status: PASSED ✅");
    console.groupEnd();
    
    logPayloadStructure(finalPayload, "Final Submission Payload");

    // Submit to API with validated payload
    const response =
      await apiServer.quiz.api.v1StudentSurveyInsertStudentSurveyCreate(
        finalPayload,
      );

    console.group("📤 SURVEY API RESPONSE DEBUG");
    console.log("✅ API Response Status:", response.status);
    console.log("📋 API Response Data:", JSON.stringify(response.data, null, 2));
    console.log("🎯 Success:", response.data?.success);
    console.log("💬 Message:", response.data?.message);
    console.log("🆔 Response ID:", response.data?.response);
    console.groupEnd();

    if (response.data?.success) {
      return {
        ok: true,
        surveyId: response.data.response || `survey_${Date.now()}`,
      };
    } else {
      return {
        ok: false,
        error: response.data?.message || "Failed to submit survey",
      };
    }
  } catch (error: unknown) {
    const fetchError = normalizeFetchError(error);
    console.error("Submit survey error:", fetchError);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit survey";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * Get survey recommendations
 */
export async function getSurveyRecommendationsAction(
  surveyId: string,
): Promise<{
  ok: boolean;
  data?: SurveyRecommendationResponse;
  error?: string;
}> {
  try {
    // TODO: Implement actual API call when backend is ready
    // For now, return error to indicate API not implemented
    throw new Error("Survey recommendations API not implemented yet");
  } catch (error: unknown) {
    const fetchError = normalizeFetchError(error);
    console.error("Get recommendations error:", fetchError);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get recommendations";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * Save survey draft
 */
export async function saveSurveyDraftAction(
  surveyData: Partial<{
    survey1Data?: Survey1FormValues;
    survey2Data?: Survey2FormValues;
    survey3Data?: Survey3FormValues;
  }>,
): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    // TODO: Implement actual API call when backend is ready
    // For now, return error to indicate API not implemented
    throw new Error("Save survey draft API not implemented yet");
  } catch (error: unknown) {
    const fetchError = normalizeFetchError(error);
    console.error("Save draft error:", fetchError);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save draft";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * Load survey draft
 */
export async function loadSurveyDraftAction(): Promise<{
  ok: boolean;
  data?: {
    survey1Data?: Survey1FormValues;
    survey2Data?: Survey2FormValues;
    survey3Data?: Survey3FormValues;
    lastStep: number;
  };
  error?: string;
}> {
  try {
    // TODO: Implement actual API call when backend is ready
    // For now, return error to indicate API not implemented
    throw new Error("Load survey draft API not implemented yet");
  } catch (error: unknown) {
    const fetchError = normalizeFetchError(error);
    console.error("Load draft error:", fetchError);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load draft";
    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/**
 * SERVER ACTION: Submit survey (WRITE OPERATION - RECOMMENDED FOR PRODUCTION)
 * This uses the server-side API for secure survey submission
 */
export async function submitSurveyServerAction(submissionData: {
  surveyId: string;
  surveyCode?: string;
  userAnswers: Array<{
    questionId: string;
    answerId?: string;
    answerIds?: string[];
    answerText?: string;
    answerValue?: number | boolean;
  }>;
  completedAt?: string;
  timeSpent?: number;
}): Promise<{
  ok: boolean;
  data?: {
    submissionId: string;
    status: "success" | "pending" | "failed";
    message?: string;
  };
  error?: string;
}> {
  try {
    console.group("🔒 SERVER ACTION: Survey Submission (Alternative Method)");
    console.log("📋 Submission Data:", JSON.stringify(submissionData, null, 2));
    console.groupEnd();

    // Prepare data for API call using the correct structure
    const apiPayload = {
      studentInformation: {
        majorId: "default-major", // You may need to get this from context/auth
        semesterId: "default-semester", // You may need to get this from context/auth
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
    };

    // Try actual API call
    const response =
      await apiServer.quiz.api.v1StudentSurveyInsertStudentSurveyCreate(
        apiPayload,
      );

    if (response.data?.success) {
      return {
        ok: true,
        data: {
          submissionId: response.data.response || `sub_${Date.now()}`,
          status: "success" as const,
          message: response.data.message || "Survey submitted successfully",
        },
      };
    } else {
      throw new Error(response.data?.message || "Failed to submit survey");
    }
  } catch (error) {
    console.error("Server Action - Submit survey error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to submit survey",
    };
  }
}

/**
 * SERVER ACTION: Get survey results by submission ID
 */
export async function getSurveyResultsAction(submissionId: string): Promise<{
  ok: boolean;
  data?: {
    submissionId: string;
    surveyId: string;
    score?: number;
    maxScore?: number;
    percentage?: number;
    passStatus?: boolean;
    feedback?: string;
    completedAt: string;
    recommendations?: Array<{
      type: string;
      title: string;
      description: string;
      priority: number;
    }>;
  };
  error?: string;
}> {
  try {
    console.log("🔒 SERVER ACTION: Getting survey results via server");

    // Try to get student survey by ID (if submissionId is a student survey ID)
    const response =
      await apiServer.quiz.api.v1StudentSurveySelectStudentSurveyList({
        request: {
          studentSurveyId: submissionId,
          pageIndex: 0,
          pageSize: 1,
        },
      });

    if (
      response.data?.success &&
      response.data?.response &&
      response.data.response.length > 0
    ) {
      const surveyData = response.data.response[0];
      return {
        ok: true,
        data: {
          submissionId,
          surveyId: surveyData.studentSurveyId || "unknown",
          score: 85, // Default since API doesn't provide
          maxScore: 100,
          percentage: 85,
          passStatus: true,
          feedback: `Khảo sát "${surveyData.survey?.title || "Survey"}" đã hoàn thành.`,
          completedAt: new Date().toISOString(),
          recommendations: [
            {
              type: "course",
              title: "Recommended Course",
              description: "Based on your survey responses",
              priority: 1,
            },
          ],
        },
      };
    } else {
      throw new Error(response.data?.message || "Failed to get survey results");
    }
  } catch (error) {
    console.error("Server Action - Get survey results error:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to get survey results",
    };
  }
}

/**
 * SERVER ACTION: Get user survey history
 */
export async function getUserSurveyHistoryAction(userId?: string): Promise<{
  ok: boolean;
  data?: Array<{
    submissionId: string;
    surveyId: string;
    surveyCode: string;
    surveyTitle?: string;
    score?: number;
    maxScore?: number;
    percentage?: number;
    passStatus?: boolean;
    completedAt: string;
    timeSpent?: number;
  }>;
  error?: string;
}> {
  try {
    console.log(
      `🔒 SERVER ACTION: Getting user survey history via server ${userId ? `for user ${userId}` : ""}`,
    );

    // Try actual API call
    const response =
      await apiServer.quiz.api.v1StudentSurveySelectStudentSurveyList({
        request: {
          userId: userId,
          pageIndex: 0,
          pageSize: 50,
        },
      });

    if (response.data?.success && response.data?.response) {
      return {
        ok: true,
        data: response.data.response.map((item) => ({
          submissionId: item.studentSurveyId || `sub_${Date.now()}`,
          surveyId: item.studentSurveyId || "", // Use studentSurveyId as surveyId
          surveyCode: "UNKNOWN", // API doesn't provide surveyCode in this structure
          surveyTitle: item.survey?.title || "Survey",
          score: 0, // API doesn't provide score in this structure
          maxScore: 100,
          percentage: 0,
          passStatus: true,
          completedAt: new Date().toISOString(), // API doesn't provide completedAt
          timeSpent: 0, // API doesn't provide timeSpent
        })),
      };
    }

    throw new Error(
      response.data?.message || "Failed to get user survey history",
    );
  } catch (error) {
    console.error("Server Action - Get user survey history error:", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get user survey history",
    };
  }
}
