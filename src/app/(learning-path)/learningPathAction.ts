// app/(learning-path)/learningPathAction.ts
"use server";

import apiServer from "EduSmart/lib/apiServer";

export interface LearningPathData {
  status: number;
  basicLearningPath: {
    subjectName: string;
    semester: string | null;
    courses: CourseItem[];
  };
  internalLearningPath: InternalLearningPath[];
  externalLearningPath: ExternalLearningPath[];
}

export interface CourseItem {
  courseId: string;
  semesterPosition: number;
  subjectCode: string;
  title: string;
  shortDescription: string;
  description: string;
  slug: string;
  courseImageUrl: string;
  learnerCount: number;
  durationMinutes: number;
  durationHours: number;
  level: number;
  price: number;
  dealPrice: number;
}

export interface InternalLearningPath {
  majorId: string;
  majorCode: string;
  reason: string;
  positionIndex: number | null;
  majorCourse: CourseItem[];
}

export interface ExternalLearningPath {
  majorId: string;
  majorCode: string;
  reason: string;
  steps: ExternalStep[];
}

export interface ExternalStep {
  title: string;
  duration_Weeks: number;
  suggested_Courses: SuggestedCourse[];
}

export interface SuggestedCourse {
  title: string;
  link: string;
  provider: string;
  reason: string;
  level: string;
  rating: string | null;
  est_Duration_Weeks: number | null;
}

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
      console.error("❌ [Learning Path] Error:", response.data?.message);
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
    console.error("❌ [Learning Path] Exception:", nErr.message);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}

/**
 * Confirm learning path with selected majors
 * @param learningPathId - UUID of the learning path
 * @param selectedMajorIds - Array of selected major IDs in order
 * @returns Success status with updated learning path data
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
      console.error(
        "❌ [Learning Path] Confirm error:",
        response.data?.message,
      );
      return {
        ok: false,
        error: response.data?.message || "Failed to confirm learning path",
        status: response.status,
      };
    }

    // Fetch updated learning path to get new status
    const updatedPath = await getLearningPathAction(learningPathId);

    if (!updatedPath.ok || !updatedPath.data) {
      console.error("❌ [Learning Path] Failed to fetch updated status");
      return {
        ok: false,
        error: "Confirmed but failed to fetch updated status",
      };
    }

    console.log("✅ [Learning Path] New status:", updatedPath.data.status);
    return {
      ok: true,
      message: response.data.message || "Learning path confirmed successfully",
      status: updatedPath.data.status,
      data: updatedPath.data,
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    console.error("❌ [Learning Path] Confirm exception:", nErr.message);
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
  pageIndex: number = 1,
  pageSize: number = 10,
): Promise<
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
