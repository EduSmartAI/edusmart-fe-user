// ví dụ: src/app/ClientBoot.tsx
"use client";
import { useEffect } from "react";
import { cleanupAction } from "../(auth)/action";

export default function ClientBoot() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Redirect www to non-www in production only (client-side fallback)
    if (process.env.NODE_ENV === "production") {
      const host = window.location.host;
      if (host === "www.edusmart.pro.vn") {
        // Dùng window.location.replace để tránh thêm vào history và force reload
        const newUrl = `https://edusmart.pro.vn${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.replace(newUrl);
        return;
      }

      // Nhận biết nếu đã redirect từ www sang non-www (check referrer hoặc sessionStorage)
      // Nếu có referrer từ www hoặc flag trong sessionStorage, reload lại để đảm bảo components load đúng
      const referrer = document.referrer;
      const wasRedirectedFromWww = sessionStorage.getItem("redirected-from-www");
      
      if (
        (referrer.includes("www.edusmart.pro.vn") || wasRedirectedFromWww) &&
        host === "edusmart.pro.vn"
      ) {
        // Xóa flag để tránh reload vô hạn
        sessionStorage.removeItem("redirected-from-www");
        // Reload lại để đảm bảo tất cả components được re-render đúng
        window.location.reload();
        return;
      }

      // Nếu đang ở www, set flag để detect khi redirect
      if (host === "www.edusmart.pro.vn") {
        sessionStorage.setItem("redirected-from-www", "true");
      }
    }

    // Cleanup action (existing logic)
    cleanupAction().catch(() => {});
  }, []);
  return null;
}
