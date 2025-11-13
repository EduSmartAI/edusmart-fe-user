"use client";

import React from "react";
import CoursePerformanceDashboardV2 from "EduSmart/components/User/CoursePerformance/CoursePerformanceDashboardV2";

export default function CoursePerformanceDemoPage() {
  const courseInfo = {
    title: "SWD392 – Kiến Trúc & Thiết Kế Phần Mềm (Nâng Cao)",
    shortDescription:
      "Kiến trúc phần mềm: Layered, Clean, Hexagonal, CQRS, microservices.",
    level: 2,
    durationHours: 11.0,
  };

  return (
    <CoursePerformanceDashboardV2
      courseId="5c71103f-5000-4404-a277-fc688f6a2ef1"
      courseInfo={courseInfo}
    />
  );
}
