"use client";

import React from "react";
import { CoursePerformanceDashboard } from "EduSmart/components/User/CoursePerformance";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";

export default function CoursePerformanceDemoPage() {
  return <CoursePerformanceDashboard courseId="demo-course-123" />;
}
