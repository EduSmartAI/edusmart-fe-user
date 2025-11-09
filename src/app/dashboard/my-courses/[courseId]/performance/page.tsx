export const dynamic = "force-dynamic";
export const revalidate = 120;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import CoursePerformanceClient from "./CoursePerformanceClient";
import {
  fetchCourseById,
  fetchAllCoursePerformance,
} from "EduSmart/app/apiServer/courseAction";

export const metadata: Metadata = {
  title: "EduSmart – Hiệu suất khóa học",
  description: "Xem phân tích hiệu suất học tập chi tiết của khóa học",
};

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePerformancePage({ params }: PageProps) {
  const { courseId } = await params;

  if (!courseId) {
    console.log("CoursePerformancePage - courseId missing");
    return notFound();
  }

  // Fetch all data in parallel: course info + module performance + lesson performance
  const [courseData, performanceData] = await Promise.all([
    fetchCourseById(courseId),
    fetchAllCoursePerformance(courseId),
  ]);

  if (!courseData?.data?.courseId) {
    console.log("CoursePerformancePage - course not found");
    return notFound();
  }

  const { data: courseDetail, modulesCount = 0, lessonsCount = 0 } = courseData;

  return (
    <CoursePerformanceClient
      courseDetail={courseDetail}
      modulesCount={modulesCount}
      lessonsCount={lessonsCount}
      modulePerformance={performanceData.modulePerformance}
      lessonPerformance={performanceData.lessonPerformance}
    />
  );
}
