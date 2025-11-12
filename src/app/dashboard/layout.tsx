"use client";
import React, { useEffect, useState } from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import { MultiColorThemeProvider } from "EduSmart/components/Themes";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSessionAuthStore } from "EduSmart/stores/Auth/SessionAuthStore";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { Spin } from "antd";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, fetchSession, isLoading } = useSessionAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  const params = useParams();
  const pathname = usePathname();

  const isDynamicRoute = Object.keys(params).length > 0;
  const id = isDynamicRoute ? params["id"] || params["slug"] : "";

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
      path: `/dashboard/my-courses/${id}/performance`,
      breadcrumbTitle: [
        { title: "Tất Cả Lộ Trình" },
        { title: "Hiệu Suất Học Tập" },
      ],
    },
  ];

  const breadcrumbTitlesValue = DASHBOARD_ROUTES.find((route) => {
    return route.path === pathname;
  })?.breadcrumbTitle;

  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      await fetchSession();
      setIsChecking(false);
    };

    checkAuth();
  }, [fetchSession]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isChecking && !session) {
      console.log("User not authenticated - redirecting to login");
      message.warning({
        content: "Bạn cần đăng nhập để tiếp tục",
        duration: 4,
      });
      setTimeout(() => {
        router.push(`/Login?redirect=${pathname}`);
      }, 500);
      return;
    }
  }, [isChecking, session, router, pathname]);

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return (
      <MultiColorThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-6 text-gray-600 dark:text-gray-400">
              {/* Đang kiểm tra quyền truy cập... */}
            </div>
          </div>
        </div>
      </MultiColorThemeProvider>
    );
  }

  return (
    <MultiColorThemeProvider>
      <BaseScreenAdmin breadcrumbItems={breadcrumbTitlesValue || []}>
        {children}
      </BaseScreenAdmin>
    </MultiColorThemeProvider>
  );
}
