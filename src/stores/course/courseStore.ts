// src/stores/useCourseStore.ts
import apiClient from "EduSmart/hooks/apiClient";
import { create } from "zustand";
import { useLoadingStore } from "../Loading/LoadingStore";
import { StudentQuizCourseInsertResponse } from "EduSmart/api/api-quiz-service";
import {
  UpsertUserLessonProgressResponse,
  CreateCommentBody,
  CreateCommentResponse,
  GetCourseCommentsResponse,
  ReplyToCommentResponse,
  CreateNoteDto,
  CreateNoteResponse,
  GetLessonNotesResponse,
  UpdateNoteDto,
  UpdateNoteResponse,
  DeleteNoteResponse,
  UserLessonProgressEntity,
} from "EduSmart/api/api-course-service";
import {
  AIChatBotResponse,
  ChatHistoryItem,
} from "EduSmart/api/api-ai-service";
import {
  UserBehaviourActionType,
  UserBehaviourInsertResponse,
} from "EduSmart/api/api-student-service";

interface SubmitAnswerDto {
  questionId: string;
  selectedAnswerIds: string[];
}
interface CourseState {
  lessonProgressById: Record<string, UserLessonProgressEntity | undefined>;
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
  courseCommentsCreate: (
    data: CreateCommentBody,
    query?: { courseId?: string },
  ) => Promise<{ data: CreateCommentResponse }>;
  courseCommentsList: (query?: {
    courseId?: string;
    page?: number;
    size?: number;
  }) => Promise<{ data: GetCourseCommentsResponse }>;
  courseCommentsRepliesCreate: (
    parentCommentId: string,
    data: CreateCommentBody,
    query?: { courseId?: string },
  ) => Promise<{ data: ReplyToCommentResponse }>;
  lessonNotesCreate: (
    data: CreateNoteDto,
    query?: { lessonId?: string },
  ) => Promise<{ data: CreateNoteResponse }>;
  lessonNotesList: (query?: {
    lessonId?: string;
    page?: number;
    size?: number;
  }) => Promise<{ data: GetLessonNotesResponse }>;
  lessonNotesUpdate: (
    noteId: string,
    data: UpdateNoteDto,
    query?: { lessonId?: string },
  ) => Promise<{ data: UpdateNoteResponse }>;
  lessonNotesDelete: (
    noteId: string,
    query?: { lessonId?: string },
  ) => Promise<{ data: DeleteNoteResponse }>;
}

export const useCourseStore = create<CourseState>((set) => ({
  lessonProgressById: {},
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
      const progressEntity = res.data?.response;
      if (progressEntity?.lessonId && progressEntity.completedAt) {
        const lessonKey: string = progressEntity.lessonId;
        set((state) => ({
          lessonProgressById: {
            ...state.lessonProgressById,
            [lessonKey]: progressEntity,
          },
        }));
      }
      if (res.data?.success && res.data.response) {
        console.log("CheckCourseById - res:", res.data.response);
        console.log("CheckCourseById - res:", res.data.success);
        return res.data as UpsertUserLessonProgressResponse;
      }
      return res.data as UpsertUserLessonProgressResponse;
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
          },
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
  courseCommentsCreate: async (data, query) => {
    try {
      const res = await apiClient.courseService.api.courseCommentsCreate(
        data,
        query,
      );
      return { data: res.data };
    } catch (error) {
      console.error("Error creating course comment:", error);
      throw error;
    }
  },
  courseCommentsList: async (query) => {
    try {
      const res = await apiClient.courseService.api.courseCommentsList(query);
      return { data: res.data };
    } catch (error) {
      console.error("Error fetching course comments:", error);
      throw error;
    }
  },
  courseCommentsRepliesCreate: async (parentCommentId, data, query) => {
    try {
      const res = await apiClient.courseService.api.courseCommentsRepliesCreate(
        parentCommentId,
        data,
        query,
      );
      return { data: res.data };
    } catch (error) {
      console.error("Error creating comment reply:", error);
      throw error;
    }
  },
  lessonNotesCreate: async (data, query) => {
    try {
      const res = await apiClient.courseService.api.lessonNotesCreate(
        data,
        query,
      );
      return { data: res.data };
    } catch (error) {
      console.error("Error creating lesson note:", error);
      throw error;
    }
  },
  lessonNotesList: async (query) => {
    try {
      const res = await apiClient.courseService.api.lessonNotesList(query);
      return { data: res.data };
    } catch (error) {
      console.error("Error fetching lesson notes:", error);
      throw error;
    }
  },
  lessonNotesUpdate: async (noteId, data, query) => {
    try {
      const res = await apiClient.courseService.api.lessonNotesUpdate(
        noteId,
        data,
        query,
      );
      return { data: res.data };
    } catch (error) {
      console.error("Error updating lesson note:", error);
      throw error;
    }
  },
  lessonNotesDelete: async (noteId, query) => {
    try {
      const res = await apiClient.courseService.api.lessonNotesDelete(
        noteId,
        query,
      );
      return { data: res.data };
    } catch (error) {
      console.error("Error deleting lesson note:", error);
      throw error;
    }
  },
}));
