import {
  CourseDetailForGuestDto,
  CourseDetailForStudentDto,
  CourseTagDto,
  GetCourseBySlugForGuestResponse,
  GetDetailsProgressByCourseSlugForStudentResponse,
  CourseSortBy as ApiCourseSortBy,
} from "EduSmart/api/api-course-service";
import { CourseSortBy as UiCourseSortBy } from "EduSmart/enum/enum";
import apiServer from "EduSmart/lib/apiServer";

export type Course = {
  id: string;
  imageUrl: string;
  title: string;
  descriptionLines: Array<string>;
  isWishList?: boolean;
  isEnroll?: boolean;
  instructor: string;
  price?: number;
  dealPrice?: number | null;
  routerPush: string;
  tagNames: string[];
  level: number | null;
  learnerCount: number | null;
};

const mapTagNames = (tags?: CourseTagDto[] | null): string[] =>
  (tags ?? [])
    .map((tag) => tag.tagName?.trim())
    .filter((tagName): tagName is string => Boolean(tagName));

export async function GetAllCourses() {
  try {
    const res = await apiServer.course.api.v1CoursesList({
      "Pagination.PageIndex": 0,
      "Pagination.PageSize": 999,
      "Filter.IsActive": true,
    });
    // Xử lý response data
    if (res.data?.success && res.data.response?.data) {
      const courses: Course[] = res.data.response.data.map((courseDto) => ({
        id: courseDto.courseId ?? "",
        isEnroll: courseDto.isEnrolled,
        isWishList: courseDto.isWishlist ?? false,
        imageUrl: courseDto.courseImageUrl || "/default-course-image.jpg",
        title: courseDto.title || "Untitled Course",
        descriptionLines: [
          courseDto.shortDescription || "",
          courseDto.description || "",
        ].filter((line) => line.length > 0),
        instructor: "Instructor Name",
        price: courseDto.price ?? undefined,
        dealPrice: courseDto.dealPrice ?? null, 
        // routerPush: `/courses/${courseDto.slug || courseDto.courseId}`,
        routerPush: `/course/${courseDto.courseId}`,
        tagNames: mapTagNames(courseDto.tags),
        level: courseDto.level ?? null,
        learnerCount: courseDto.learnerCount ?? null,
      }));

      return courses;
    }

    return [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
// sortBy: CourseSortBy
export async function fetchCourseByQuery(
  searchQuery: string,
  pageIndex: number,
  pageSize: number,
  sortBy: UiCourseSortBy = UiCourseSortBy.Latest,
): Promise<{ data: Course[]; totalPages: number; totalCount: number }> {
  try {
    const res = await apiServer.course.api.v1CoursesList({
      "Filter.Search": searchQuery,
      "Pagination.PageIndex": pageIndex - 1,
      "Pagination.PageSize": pageSize,
      "Filter.IsActive": true,
      "Filter.SortBy": sortBy as unknown as ApiCourseSortBy,
    });

    if (res.data?.success && res.data.response?.data) {
      const courses: Course[] = res.data.response.data.map((courseDto) => ({
        id: courseDto.courseId ?? "",
        isEnroll: courseDto.isEnrolled,
        isWishList: courseDto.isWishlist ?? false,
        imageUrl: courseDto.courseImageUrl || "/default-course-image.jpg",
        title: courseDto.title || "Untitled Course",
        descriptionLines: [
          courseDto.shortDescription || "",
          courseDto.description || "",
        ].filter((line: string) => line.length > 0),
        instructor: courseDto.teacherName || "Untitled Instructor",
        price: courseDto.price ?? undefined,
        dealPrice: courseDto.dealPrice ?? null,
        routerPush: `/course/${courseDto.courseId}`,
        tagNames: mapTagNames(courseDto.tags),
        level: courseDto.level ?? null,
        learnerCount: courseDto.learnerCount ?? null,
      }));
      return {
        data: courses,
        totalPages: res.data.response.totalPages ?? 0,
        totalCount: res.data.response.totalCount ?? 0,
      };
    }
    return { data: [], totalPages: 0, totalCount: 0 };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { data: [], totalPages: 0, totalCount: 0 };
  }
}

export async function fetchCourseByQueryForSlug(
  searchQuery: string,
  pageIndex: number,
  pageSize: number,
  sortBy: UiCourseSortBy = UiCourseSortBy.Latest,
): Promise<{ data: Course[]; totalPages: number; totalCount: number }> {
  try {
    const res = await apiServer.course.api.v1CoursesList({
      "Filter.Search": searchQuery,
      "Pagination.PageIndex": pageIndex - 1,
      "Pagination.PageSize": pageSize,
      "Filter.IsActive": true,
      "Filter.SortBy": sortBy as unknown as ApiCourseSortBy,
    });

    if (res.data?.success && res.data.response?.data) {
      const courses: Course[] = res.data.response.data.map((courseDto) => ({
        id: courseDto.courseId ?? "",
        isEnroll: courseDto.isEnrolled,
        isWishList: courseDto.isWishlist ?? false,
        imageUrl: courseDto.courseImageUrl || "/default-course-image.jpg",
        title: courseDto.title || "Untitled Course",
        descriptionLines: [
          courseDto.shortDescription || "",
          courseDto.description || "",
        ].filter((line: string) => line.length > 0),
        instructor: "Instructor Name",
        price: courseDto.price ?? undefined,
        dealPrice: courseDto.dealPrice ?? null,
        routerPush: `/course/${courseDto.slug || courseDto.courseId}`,
        tagNames: mapTagNames(courseDto.tags),
        level: courseDto.level ?? null,
        learnerCount: courseDto.learnerCount ?? null,
      }));
      return {
        data: courses,
        totalPages: res.data.response.totalPages ?? 0,
        totalCount: res.data.response.totalCount ?? 0,
      };
    }
    return { data: [], totalPages: 0, totalCount: 0 };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { data: [], totalPages: 0, totalCount: 0 };
  }
}

export async function fetchCourseById(
  id: string,
): Promise<{
  data: CourseDetailForGuestDto;
  modulesCount: number;
  lessonsCount: number;
}> {
  try {
    const res = await apiServer.course.api.v1CoursesDetail(id);
    if (res.data?.success && res.data.response) {
      return {
        data: res.data.response ?? {},
        lessonsCount: res.data.lessonsCount ?? 0,
        modulesCount: res.data.modulesCount ?? 0,
      };
    }
    return {
      data: {},
      lessonsCount: 0,
      modulesCount: 0,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
      lessonsCount: 0,
      modulesCount: 0,
    };
  }
}


export async function fetchCourseBySlug(
  slug: string,
): Promise<{
  data: GetCourseBySlugForGuestResponse;
  modulesCount: number;
  lessonsCount: number;
}> {
  try {
    console.log("fetchCourseBySlug - slug:", slug);
    const res = await apiServer.course.api.v1CoursesSlugDetail(slug);
    console.log("fetchCourseBySlug - res:", res);
    if (res.data) {
      return {
        data: res.data,
        lessonsCount: res.data.lessonsCount ?? 0,
        modulesCount: res.data.modulesCount ?? 0,
      };
    }
    return {
      data: {
        success: false,
        response: {} as CourseDetailForGuestDto,
      } as GetCourseBySlugForGuestResponse,
      lessonsCount: 0,
      modulesCount: 0,
    };
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    return {
      data: {
        success: false,
        response: {} as CourseDetailForGuestDto,
      } as GetCourseBySlugForGuestResponse,
      lessonsCount: 0,
      modulesCount: 0,
    };
  }
}


export async function CheckCourseById(
  id: string,
): Promise<{
  data: boolean;
}> {
  try {
    const res = await apiServer.course.api.studentLessonProgressEnrollmentList(id);
    if (res.data?.success && res.data.response === true) {
      console.log("CheckCourseById - res:", res.data.response)
      console.log("CheckCourseById - res:", res.data.success)
      return {
        data: res.data.response ?? {},
      };
    }
    return {
      data: false,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: false,
    };
  }
}

export async function GetStudentCourseProgressByCourseId(
  id: string,
): Promise<{
  data: CourseDetailForStudentDto;
}> {
  try {
    const res = await apiServer.course.api.studentLessonProgressDetail(id);
    if (res.data?.success && res.data.response) {
      console.log("CheckCourseById - res:", res.data.response)
      console.log("CheckCourseById - res:", res.data.success)
      return {
        data: res.data.response ?? {},
      };
    }
    return {
      data: res.data.response ?? {},
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
    };
  }
}

export async function GetStudentCourseProgressByCourseSlug(
  id: string,
): Promise<{
  data: GetDetailsProgressByCourseSlugForStudentResponse;
}> {
  try {
    const res = await apiServer.course.api.studentLessonProgressDetail2(id);
    if (res.data?.success && res.data.response) {
      console.log("CheckCourseById - res:", res.data.response)
      console.log("CheckCourseById - res:", res.data.success)
      return {
        data: res.data ?? {},
      };
    }
    return {
      data: res.data ?? {},
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
    };
  }
}

/**
 * Fetch module performance data for a course
 * @param courseId - Course ID
 * @returns Module performance data with modules, totals, etc.
 */
export async function fetchModulePerformance(courseId: string) {
  try {
    console.log("fetchModulePerformance - courseId:", courseId);
    const res = await apiServer.student.api.studentDashboardsGetModuleDashboardProcessList({ CourseId: courseId });
    console.log("fetchModulePerformance - res:", res);
    
    if (res.data?.success && res.data.response) {
      return {
        success: true,
        data: res.data.response,
      };
    }
    
    return {
      success: false,
      data: null,
      error: "Failed to fetch module performance",
    };
  } catch (error) {
    console.error("Error fetching module performance:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch lesson performance data for a course
 * @param courseId - Course ID
 * @returns Lesson performance data with modules, lessons, totals, etc.
 */
export async function fetchLessonPerformance(courseId: string) {
  try {
    console.log("fetchLessonPerformance - courseId:", courseId);
    const res = await apiServer.student.api.studentDashboardsGetLessonDashboardProcessList({ CourseId: courseId });
    console.log("fetchLessonPerformance - res:", res);
    
    if (res.data?.success && res.data.response) {
      return {
        success: true,
        data: res.data.response,
      };
    }
    
    return {
      success: false,
      data: null,
      error: "Failed to fetch lesson performance",
    };
  } catch (error) {
    console.error("Error fetching lesson performance:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch all performance data for a course (module + lesson) in parallel
 * @param courseId - Course ID
 * @returns Combined performance data
 */
export async function fetchAllCoursePerformance(courseId: string) {
  try {
    console.log("fetchAllCoursePerformance - courseId:", courseId);
    
    // Call both APIs in parallel
    const [modulePerf, lessonPerf] = await Promise.all([
      fetchModulePerformance(courseId),
      fetchLessonPerformance(courseId),
    ]);
    
    return {
      success: modulePerf.success && lessonPerf.success,
      modulePerformance: modulePerf.data,
      lessonPerformance: lessonPerf.data,
      errors: {
        module: modulePerf.error,
        lesson: lessonPerf.error,
      },
    };
  } catch (error) {
    console.error("Error fetching all course performance:", error);
    return {
      success: false,
      modulePerformance: null,
      lessonPerformance: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch overall performance data for a course
 * @param courseId - Course ID
 * @returns Overall performance data with progress, AI evaluation, performance metrics, and learning behavior
 */
export async function fetchOverallPerformance(courseId: string) {
  try {
    console.log("fetchOverallPerformance - courseId:", courseId);
    const res = await apiServer.student.api.studentDashboardsGetOverviewCourseDashboardProcessList({ CourseId: courseId });
    console.log("fetchOverallPerformance - res:", res);
    
    if (res.data?.success && res.data.response) {
      return {
        success: true,
        data: res.data.response,
      };
    }
    
    return {
      success: false,
      data: null,
      error: "Failed to fetch overall performance",
    };
  } catch (error) {
    console.error("Error fetching overall performance:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate and fetch improvement content from AI
 * @param improvementId - Improvement ID to generate content for
 * @returns Generated markdown content
 */
export async function fetchImprovementContent(improvementId: string) {
  try {
    console.log("fetchImprovementContent - improvementId:", improvementId);
    const res = await apiServer.student.api.studentDashboardsGenAndInsertImprovementByAiCreate({
      ImprovementId: improvementId,
    });
    console.log("fetchImprovementContent - res:", res);

    if (res.data?.success && res.data.response) {
      return {
        success: true,
        content: res.data.response,
      };
    }

    return {
      success: false,
      content: null,
      error: "Failed to generate improvement content",
    };
  } catch (error) {
    console.error("Error fetching improvement content:", error);
    return {
      success: false,
      content: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

