export const dynamic = "force-dynamic";
export const revalidate = 120;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Result } from "antd";
import CoursePerformanceClient from "./CoursePerformanceClient";
import {
  fetchCourseBySlug,
  fetchAllCoursePerformance,
  fetchOverallPerformance,
  CheckCourseById,
} from "EduSmart/app/apiServer/courseAction";

export const metadata: Metadata = {
  title: "EduSmart – Hiệu suất khóa học",
  description: "Xem phân tích hiệu suất học tập chi tiết của khóa học",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePerformancePage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    console.log("CoursePerformancePage - slug missing");
    return notFound();
  }

  // First fetch course by slug to get courseId
  const courseDataResponse = await fetchCourseBySlug(slug);

  if (!courseDataResponse?.data?.success || !courseDataResponse.data.response) {
    const decodedSlug = decodeURIComponent(slug);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Result
          status="404"
          title={`Khóa học ${decodedSlug} không tồn tại`}
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

  const courseDetail = courseDataResponse.data.response;

  if (!courseDetail.courseId) {
    console.log("CoursePerformancePage - courseId missing in response");
    const decodedSlug = decodeURIComponent(slug);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Result
          status="warning"
          title={`Khóa học ${decodedSlug} không tồn tại`}
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

  const courseId = courseDetail.courseId;

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
