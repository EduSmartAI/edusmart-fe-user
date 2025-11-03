// import { CourseSortBy } from "EduSmart/api/api-course-service";
import {
  CourseDetailForGuestDto,
  CourseDetailForStudentDto,
  GetCourseBySlugForGuestResponse,
  GetDetailsProgressByCourseSlugForStudentResponse,
} from "EduSmart/api/api-course-service";
import apiServer from "EduSmart/lib/apiServer";

export type Course = {
  imageUrl: string;
  title: string;
  descriptionLines: Array<string>;
  instructor: string;
  price?: number;
  dealPrice?: number | null;
  routerPush: string;
};

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
): Promise<{ data: Course[]; totalPages: number; totalCount: number }> {
  try {
    const res = await apiServer.course.api.v1CoursesList({
      "Filter.Search": searchQuery,
      "Pagination.PageIndex": pageIndex - 1,
      "Pagination.PageSize": pageSize,
      "Filter.IsActive": true,
    });

    if (res.data?.success && res.data.response?.data) {
      const courses: Course[] = res.data.response.data.map((courseDto) => ({
        imageUrl: courseDto.courseImageUrl || "/default-course-image.jpg",
        title: courseDto.title || "Untitled Course",
        descriptionLines: [
          courseDto.shortDescription || "",
          courseDto.description || "",
        ].filter((line: string) => line.length > 0),
        instructor: "Instructor Name",
        price: courseDto.price ?? undefined,
        dealPrice: courseDto.dealPrice ?? null,
        routerPush: `/course/${courseDto.courseId}`,
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
): Promise<{ data: Course[]; totalPages: number; totalCount: number }> {
  try {
    const res = await apiServer.course.api.v1CoursesList({
      "Filter.Search": searchQuery,
      "Pagination.PageIndex": pageIndex - 1,
      "Pagination.PageSize": pageSize,
      "Filter.IsActive": true,
    });

    if (res.data?.success && res.data.response?.data) {
      const courses: Course[] = res.data.response.data.map((courseDto) => ({
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
    console.log("fetchCourseById - id:", id);
    const res = await apiServer.course.api.v1CoursesDetail(id);
    console.log("fetchCourseById - res:", res);
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
  id: string,
): Promise<{
  data: GetCourseBySlugForGuestResponse;
  modulesCount: number;
  lessonsCount: number;
}> {
  try {
    console.log("fetchCourseById - id:", id);
    const res = await apiServer.course.api.v1CoursesSlugDetail(id);
    console.log("fetchCourseById - res:", res);
    if (res.data?.success && res.data.response) {
      return {
        data: res.data ?? {},
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

