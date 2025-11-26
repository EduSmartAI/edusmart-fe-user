// app/(learning-path)/learningPathAction.ts
"use server";

import apiServer from "EduSmart/lib/apiServer";

export interface CourseItem {
  courseId?: string;
  semesterPosition?: number;
  subjectCode?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  slug?: string;
  courseImageUrl?: string;
  learnerCount?: number;
  durationMinutes?: number;
  durationHours?: number;
  level?: number;
  price?: number;
  dealPrice?: number;
  isEnrolled?: boolean;
  isWishList?: boolean;
}

export interface CourseGroupDto {
  subjectCode?: string;
  status?: number; // int32
  courses?: CourseItem[];
}

export interface BasicLearningPathDto {
  courseGroups?: CourseGroupDto[];
}

export interface InternalLearningPathDto {
  majorId?: string;
  majorCode?: string;
  reason?: string;
  positionIndex?: number | null;
  majorCourseGroups?: CourseGroupDto[];
}

export interface SuggestedCourse {
  title?: string;
  link?: string;
  provider?: string;
  reason?: string;
  level?: string;
  rating?: string | null;
  est_Duration_Weeks?: number | null;
}

export interface ExternalStep {
  title?: string;
  duration_Weeks?: number;
  suggested_Courses?: SuggestedCourse[];
}

export interface ExternalLearningPathDto {
  majorId?: string;
  majorCode?: string;
  reason?: string;
  steps?: ExternalStep[];
}

export interface LearningPathSelectDto {
  status?: number; // int32
  pathName?: string;
  completionPercent?: number; // double
  basicLearningPath?: BasicLearningPathDto;
  internalLearningPath?: InternalLearningPathDto[];
  externalLearningPath?: ExternalLearningPathDto[];
}

/** Export alias để component import như cũ */
export type LearningPathData = LearningPathSelectDto;

// Import shared error handler from quizAction
import { normalizeFetchError } from "EduSmart/app/(quiz)/quizAction";

/**
 * Get learning path by ID
 * @param learningPathId - UUID of the learning path
 * @returns Learning path data or error
 */
export async function getLearningPathAction(
  learningPathId: string,
): Promise<
  | { ok: true; data: LearningPathData }
  | { ok: false; error: string; status?: number }
> {
  try {
    const response = await apiServer.student.api.learningPathsList({
      LearningPathId: learningPathId,
    });

    if (!response.data?.success) {
      return {
        ok: false,
        error: response.data?.message || "Failed to fetch learning path",
        status: response.status,
      };
    }

    return {
      ok: true,
      data: response.data.response as LearningPathData,
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}

/**
 * Confirm learning path giữ nguyên (trả về lại getLearningPathAction)
 */
export async function confirmLearningPathAction(
  learningPathId: string,
  selectedMajorIds: string[],
): Promise<
  | { ok: true; message: string; status: number; data: LearningPathData }
  | { ok: false; error: string; status?: number }
> {
  try {
    const response = await apiServer.student.api.learningPathsChooseMajorUpdate(
      {
        learningPathId: learningPathId,
        internalMajorIds: selectedMajorIds,
      },
    );

    if (!response.data?.success) {
      return {
        ok: false,
        error: response.data?.message || "Failed to confirm learning path",
        status: response.status,
      };
    }

    const updated = await getLearningPathAction(learningPathId);
    if (!updated.ok) {
      return {
        ok: false,
        error: "Confirmed but failed to fetch updated status",
      };
    }

    return {
      ok: true,
      message: response.data.message || "Learning path confirmed successfully",
      status: updated.data.status ?? 0,
      data: updated.data,
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}

/**
 * Get all learning paths for the current user
 * @param pageIndex - Page number (default: 1)
 * @param pageSize - Page size (default: 10)
 * @returns Paginated learning paths
 */
export async function getAllLearningPathsAction(
  pageIndex: number = 0,
  pageSize: number = 1000,
): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { ok: true; data: any } | { ok: false; error: string; status?: number }
> {
  try {
    const response = await apiServer.student.api.learningPathsGetAllList({
      "Pagination.PageIndex": pageIndex,
      "Pagination.PageSize": pageSize,
    });

    if (!response.data?.success) {
      console.error(
        "❌ [Learning Path] Get All error:",
        response.data?.message,
      );
      return {
        ok: false,
        error: response.data?.message || "Failed to fetch learning paths",
        status: response.status,
      };
    }

    return {
      ok: true,
      data: response.data.response,
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    console.error("❌ [Learning Path] Get All exception:", nErr.message);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}

/**
 * Create learning path from previous survey and transcript (without taking quiz)
 * @param learningGoalId - UUID of the learning goal
 * @param learningGoalName - Name of the learning goal
 * @param learningGoalType - Type of the learning goal (enum)
 * @returns Learning path ID or error
 */
export async function createLearningPathFromTranscriptAction(
  learningGoalId: string,
  learningGoalName: string,
  learningGoalType: number,
): Promise<
  | { ok: true; learningPathId: string }
  | { ok: false; error: string; status?: number }
> {
  try {
    console.log("🔒 SERVER ACTION: Creating learning path from transcript", {
      learningGoalId,
      learningGoalName,
      learningGoalType,
    });

    const response =
      await apiServer.quiz.api.v1LearningPathInsertLearningPathWithPreviousSurveyAndTranscriptCreate(
        {
          learningGoalId,
          learningGoalName,
          learningGoalType,
        },
      );

    if (!response.data?.success) {
      console.error(
        "❌ [Learning Path] Create from transcript error:",
        response.data?.message,
      );
      return {
        ok: false,
        error:
          response.data?.message ||
          "Failed to create learning path from transcript",
        status: response.status,
      };
    }

    if (!response.data.response?.learningPathId) {
      console.error(
        "❌ [Learning Path] No learningPathId in response:",
        response.data,
      );
      return {
        ok: false,
        error: "No learning path ID returned from server",
        status: response.status,
      };
    }

    console.log(
      "✅ [Learning Path] Created from transcript successfully:",
      response.data.response.learningPathId,
    );

    return {
      ok: true,
      learningPathId: response.data.response.learningPathId,
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    console.error(
      "❌ [Learning Path] Create from transcript exception:",
      nErr.message,
    );
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}
