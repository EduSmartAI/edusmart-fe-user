"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to learning-paths when accessing /dashboard
    router.replace("/dashboard/learning-paths");
  }, [router]);

  return null;
}
