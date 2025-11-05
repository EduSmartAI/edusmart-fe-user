"use client";
import React from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import { MultiColorThemeProvider } from "EduSmart/components/Themes";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();

  const isDynamicRoute = Object.keys(params).length > 0;
  const id = isDynamicRoute ? params["id"] : "";

  const DASHBOARD_ROUTES = [
    {
      path: `/dashboard/learning-paths`,
      breadcrumbTitle: [{ title: "Tất Cả Lộ Trình" }],
    },
    {
      path: `/dashboard/learning-paths/${id}`,
      breadcrumbTitle: [
        { title: "Tất Cả Lộ Trình" },
        { title: "Chi Tiết Lộ Trình" },
      ],
    },
    {
      path: `/dashboard/course-performance-demo-1`,
      breadcrumbTitle: [{ title: "Hiệu Suất Học Tập" }],
    },
  ];

  const breadcrumbTitlesValue = DASHBOARD_ROUTES.find((route) => {
    return route.path === pathname;
  })?.breadcrumbTitle;

  return (
    <BaseScreenAdmin breadcrumbItems={breadcrumbTitlesValue || []}>
      <MultiColorThemeProvider>{children}</MultiColorThemeProvider>
    </BaseScreenAdmin>
  );
}
