"use client";

import React from "react";
import { useParams } from "next/navigation";
import CoursePerformanceDashboard from "EduSmart/components/User/CoursePerformance/CoursePerformanceDashboard";

export default function CoursePerformancePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return <CoursePerformanceDashboard courseId={courseId} />;
}
