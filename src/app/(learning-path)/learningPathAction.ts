// app/(learning-path)/learningPathAction.ts
"use server";

import { Api } from "EduSmart/api/api-student-service";
import { getAuthHeaderFromCookie } from "EduSmart/lib/authServer";

const BACKEND = process.env.API_URL!;

// Create API instance for server-side calls
const createStudentApi = async () => {
  const auth = await getAuthHeaderFromCookie();
  return new Api({
    baseUrl: `${BACKEND}/student`,
    baseApiParams: {
      credentials: "include",
      headers: auth ?? {},
    },
  });
};

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

export type NormalizedHttpError = {
  message: string;
  details?: string;
  status?: number;
};

export async function normalizeFetchError(
  err: unknown,
): Promise<NormalizedHttpError> {
  // Lỗi do fetch ném ra Response
  if (err instanceof Response) {
    let details = "";
    try {
      const clone = err.clone();
      const ct = clone.headers.get("content-type") ?? "";
      details = ct.includes("application/json")
        ? JSON.stringify(await clone.json())
        : await clone.text();
    } catch {
      // ignore
    }
    return {
      message: `HTTP ${err.status} ${err.statusText}`,
      details,
      status: err.status,
    };
  }

  // Một số lib bọc lỗi có err.cause là Response
  const unknownErr = err as unknown;
  if (
    typeof unknownErr === "object" &&
    unknownErr !== null &&
    "cause" in unknownErr &&
    (unknownErr as { cause?: unknown }).cause instanceof Response
  ) {
    const cause = (unknownErr as { cause: Response }).cause;
    let details = "";
    try {
      const clone = cause.clone();
      const ct = clone.headers.get("content-type") ?? "";
      details = ct.includes("application/json")
        ? JSON.stringify(await clone.json())
        : await clone.text();
    } catch {}
    return {
      message: `HTTP ${cause.status} ${cause.statusText}`,
      details,
      status: cause.status,
    };
  }

  // Fallback
  return {
    message:
      unknownErr && typeof unknownErr === "object" && "message" in unknownErr
        ? String((unknownErr as { message?: unknown }).message)
        : String(err),
  };
}

/**
 * Get learning path by ID
 * @param learningPathId - UUID of the learning path
 * @returns Learning path data or null if error
 */
export async function getLearningPathAction(learningPathId: string) {
  try {
    console.group("🎯 [Learning Path Action] Fetching learning path");
    console.log("Learning Path ID:", learningPathId);

    const api = await createStudentApi();
    const response = await api.api.learningPathsList({
      LearningPathId: learningPathId,
    });

    console.log("API Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));

    if (!response.ok || !response.data.success) {
      console.error("❌ API Error:", response.data.message);
      console.groupEnd();
      return {
        success: false,
        error: response.data.message || "Failed to fetch learning path",
      };
    }

    console.log("✅ Learning path fetched successfully");
    console.log("Status:", response.data.response?.status);
    console.groupEnd();

    return {
      success: true,
      data: response.data.response as LearningPathData,
    };
  } catch (error) {
    const fetchError = await normalizeFetchError(error);
    console.error("❌ [Learning Path Action] Error:", fetchError);
    console.groupEnd();
    return {
      success: false,
      error: fetchError.message,
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
  selectedMajorIds: string[]
): Promise<
  | { success: true; message: string; status: number; data: LearningPathData }
  | { success: false; error: string }
> {
  try {
    console.group("✅ [Learning Path Action] Confirming learning path");
    console.log("Learning Path ID:", learningPathId);
    console.log("Selected Major IDs:", selectedMajorIds);

    const api = await createStudentApi();
    const response = await api.api.learningPathsChooseMajorUpdate({
      learningPathId: learningPathId,
      internalMajorIds: selectedMajorIds,
    });

    console.log("API Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));

    if (!response.ok || !response.data.success) {
      console.error("❌ API Error:", response.data.message);
      console.groupEnd();
      return {
        success: false,
        error: response.data.message || "Failed to confirm learning path",
      };
    }

    console.log("✅ Learning path confirmed successfully");
    console.log("🔄 Fetching updated learning path to check status...");

    // Fetch updated learning path to get new status
    const updatedPath = await getLearningPathAction(learningPathId);

    if (!updatedPath.success || !updatedPath.data) {
      console.error("❌ Failed to fetch updated learning path");
      console.groupEnd();
      return {
        success: false,
        error: "Confirmed but failed to fetch updated status",
      };
    }

    console.log("📊 Updated Learning Path Status:", updatedPath.data.status);
    console.log(
      "✅ Status meaning:",
      updatedPath.data.status === 2 ? "In Progress" : `Status ${updatedPath.data.status}`
    );
    console.groupEnd();

    return {
      success: true,
      message: response.data.message || "Learning path confirmed successfully",
      status: updatedPath.data.status,
      data: updatedPath.data,
    };
  } catch (error) {
    const fetchError = await normalizeFetchError(error);
    console.error("❌ [Learning Path Action] Error:", fetchError);
    console.groupEnd();
    return {
      success: false,
      error: fetchError.message,
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
  pageSize: number = 10
) {
  try {
    console.group("📋 [Learning Path Action] Fetching all learning paths");
    console.log("Page Index:", pageIndex);
    console.log("Page Size:", pageSize);

    const api = await createStudentApi();
    const response = await api.api.learningPathsGetAllList({
      "Pagination.PageIndex": pageIndex,
      "Pagination.PageSize": pageSize,
    });

    console.log("API Response Status:", response.status);

    if (!response.ok || !response.data.success) {
      console.error("❌ API Error:", response.data.message);
      console.groupEnd();
      return {
        success: false,
        error: response.data.message || "Failed to fetch learning paths",
      };
    }

    console.log("✅ Learning paths fetched successfully");
    console.log("Total Count:", response.data.response?.totalCount);
    console.groupEnd();

    return {
      success: true,
      data: response.data.response,
    };
  } catch (error) {
    const fetchError = await normalizeFetchError(error);
    console.error("❌ [Learning Path Action] Error:", fetchError);
    console.groupEnd();
    return {
      success: false,
      error: fetchError.message,
    };
  }
}
