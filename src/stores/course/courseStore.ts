// src/stores/useCourseStore.ts
import apiClient from "EduSmart/hooks/apiClient";
import { create } from "zustand";
import { useLoadingStore } from "../Loading/LoadingStore";
import { StudentQuizCourseInsertResponse } from "EduSmart/api/api-quiz-service";
import { UpsertUserLessonProgressResponse } from "EduSmart/api/api-course-service";
import {
  AIChatBotResponse,
  ChatHistoryItem,
} from "EduSmart/api/api-ai-service";
import { UserBehaviourActionType, UserBehaviourInsertResponse } from "EduSmart/api/api-student-service";

interface SubmitAnswerDto {
  questionId: string;
  selectedAnswerIds: string[];
}
interface CourseState {
  enRollingCourseById: (id: string) => Promise<string>;
  submitLessonOrModuleQuiz: (
    lessonId: string,
    moduleId: string,
    quizId: string,
    isHasModule: boolean,
    courseId: string,
    answers: SubmitAnswerDto[],
  ) => Promise<StudentQuizCourseInsertResponse>;
  studentLessonProgressUpdate: (
    lessonId: string,
    lastPositionSec?: number | null,
    watchedDeltaSec?: number | null,
  ) => Promise<UpsertUserLessonProgressResponse>;
  aiChatBotsCreate: (
    message?: string,
    history?: ChatHistoryItem[],
    lessonId?: string,
  ) => Promise<AIChatBotResponse>;
  insertUserBehaviour: (
    actionType?: number,
    targetId?: string,
    targetType?: number,
    parentTargetId?: string,
    metadata?: string,
  ) => Promise<UserBehaviourInsertResponse>;
}

export const useCourseStore = create<CourseState>(() => ({
  enRollingCourseById: async (id) => {
    const setLoading = useLoadingStore.getState().setLoading;
    const hideLoading = useLoadingStore.getState().hideLoading;
    setLoading(true);
    try {
      const res =
        await apiClient.courseService.api.studentLessonProgressEnrollmentCreate(
          id,
        );
      if (res.data?.success) {
        return res.data.response || "";
      }
      return "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const status = e?.response?.status;
      throw status ?? e;
    } finally {
      hideLoading();
    }
  },
  submitLessonOrModuleQuiz: async (
    lessonId,
    moduleId,
    quizId,
    isHasModule,
    courseId,
    answers,
  ) => {
    try {
      const studentQuizAnswers = answers.flatMap((answer) =>
        answer.selectedAnswerIds.map((answerId) => ({
          questionId: answer.questionId,
          answerId: answerId,
        })),
      );

      const res =
        await apiClient.quizService.api.v1CourseQuizInsertStudentQuizCourseCreate(
          {
            lessonId: isHasModule ? undefined : lessonId,
            moduleId: isHasModule ? moduleId : undefined,
            quizId: quizId,
            courseId: courseId,
            studentQuizAnswers: studentQuizAnswers,
          },
        );
      console.log("Enrollment failed:", res.data);
      if (res.data?.success && res.data.response) {
        console.log("CheckCourseById - res:", res.data.response);
        console.log("CheckCourseById - res:", res.data.success);
        return res.data as StudentQuizCourseInsertResponse;
      }
      return res.data as StudentQuizCourseInsertResponse;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        data: {},
      };
    }
  },
  studentLessonProgressUpdate: async (
    lessonId,
    lastPositionSec,
    watchedDeltaSec,
  ) => {
    try {
      const res = await apiClient.courseService.api.studentLessonProgressUpdate(
        {
          lessonId: lessonId,
          userLessonProgress: {
            lastSeenPositionSec: lastPositionSec,
            watchedDeltaSec: watchedDeltaSec,
          },
        },
      );
      console.log("Enrollment failed:", res.data);
      if (res.data?.success && res.data.response) {
        console.log("CheckCourseById - res:", res.data.response);
        console.log("CheckCourseById - res:", res.data.success);
        return res.data as StudentQuizCourseInsertResponse;
      }
      return res.data as StudentQuizCourseInsertResponse;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        data: {},
      };
    }
  },
  aiChatBotsCreate: async (message, history, lessonId) => {
    try {
      const res = await apiClient.aiService.api.aiChatBotsCreate({
        request: {
          message: message ?? "",
          lessionId: lessonId ?? "",
          history: history,
        },
      });
      console.log("Enrollment failed:", res.data);
      if (res.data?.success && res.data.response) {
        console.log("CheckCourseById - res:", res.data.response);
        console.log("CheckCourseById - res:", res.data.success);
        return res.data as AIChatBotResponse;
      }
      return res.data as AIChatBotResponse;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        data: {},
      };
    }
  },
 insertUserBehaviour: async (
    actionType,
    targetId,
    targetType,
    parentTargetId,
    metadata,
  ) => {
    try {

      const res =
        await apiClient.studentService.api.v1UserBehaviourInsertUserBehaviourCreate(
          {
            actionType: actionType as UserBehaviourActionType,
            targetId: targetId,
            targetType: targetType,
            parentTargetId: parentTargetId,
            metadata: metadata,
          }
        );

      if (res.data?.success && res.data.response) {
        console.log("InsertUserBehaviour - res:", res.data.response);
        return res.data as UserBehaviourInsertResponse;
      }

      return res.data as UserBehaviourInsertResponse;
    } catch (error) {
      console.error("Error inserting user behaviour:", error);
      return { data: {} } as unknown as UserBehaviourInsertResponse;
    }
  },
}));
