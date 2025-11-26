export const dynamic = "force-dynamic";
export const revalidate = 120;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Result } from "antd";
import CoursePerformanceClient from "./CoursePerformanceClient";
import {
  fetchCourseById,
  fetchAllCoursePerformance,
  fetchOverallPerformance,
  CheckCourseById,
} from "EduSmart/app/apiServer/courseAction";

export const metadata: Metadata = {
  title: "EduSmart – Hiệu suất khóa học",
  description: "Xem phân tích hiệu suất học tập chi tiết của khóa học",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePerformancePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    console.log("CoursePerformancePage - id missing");
    return notFound();
  }

  // Fetch course by id directly
  const courseDataResponse = await fetchCourseById(id);

  if (!courseDataResponse?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Result
          status="404"
          title="Khóa học không tồn tại"
          extra={
            <Button href="/" type="primary" size="large">
              Quay về trang chủ
            </Button>
          }
          className="max-w-lg"
        />
      </div>
    );
  }

  const courseDetail = courseDataResponse.data;
  const courseId = id;

  const enrollmentResult = await CheckCourseById(courseId);

  if (!enrollmentResult.data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Result
          status="403"
          title="Bạn chưa đăng ký khóa học này"
          extra={
            <Button type="primary" href="/" size="large">
              Quay về trang chủ
            </Button>
          }
          className="max-w-lg"
        />
      </div>
    );
  }

  // Fetch all performance data in parallel using courseId
  const [performanceData, overallPerformanceData] = await Promise.all([
    fetchAllCoursePerformance(courseId),
    fetchOverallPerformance(courseId),
  ]);

  const modulesCount = courseDataResponse.modulesCount ?? 0;
  const lessonsCount = courseDataResponse.lessonsCount ?? 0;

  return (
    <CoursePerformanceClient
      courseDetail={courseDetail}
      modulesCount={modulesCount}
      lessonsCount={lessonsCount}
      modulePerformance={performanceData.modulePerformance}
      lessonPerformance={performanceData.lessonPerformance}
      overallPerformance={overallPerformanceData.data}
    />
  );
}
