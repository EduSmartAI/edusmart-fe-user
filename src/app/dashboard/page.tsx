"use client";
import React from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <>
      <div>Demo Dashboard</div>

      <div className="mt-4 flex gap-4">
        {/* Xem tất cả lộ trình học tập */}
        <Button
          type="primary"
          onClick={() => {
            router.push("/dashboard/learning-paths");
          }}
        >
          Xem tất cả lộ trình học tập
        </Button>
        {/* Xem Course Performance (cấp độ module) */}
        <Button
          type="primary"
          onClick={() => {
            router.push("/dashboard/course-performance-demo");
          }}
        >
          Xem course progress (demo cấp độ module)
        </Button>
      </div>
    </>
  );
}
