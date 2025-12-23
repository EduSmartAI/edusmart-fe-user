// ví dụ: src/app/ClientBoot.tsx
"use client";
import { useEffect } from "react";
import { cleanupAction } from "../(auth)/action";

export default function ClientBoot() {
  useEffect(() => {
    // Redirect www to non-www in production only (client-side fallback)
    // Đảm bảo redirect ngay lập tức để tránh render sai
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
      const host = window.location.host;
      if (host === "www.edusmart.pro.vn") {
        // Dùng window.location.replace để tránh thêm vào history và force reload
        const newUrl = `https://edusmart.pro.vn${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.replace(newUrl);
        return;
      }
    }

    // Cleanup action (existing logic)
    cleanupAction().catch(() => {});
  }, []);
  return null;
}
