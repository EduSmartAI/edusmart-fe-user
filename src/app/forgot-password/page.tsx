export const dynamic = "force-dynamic";

import { Metadata } from "next";
import ForgotPasswordPage from "./Client";

export const metadata: Metadata = {
  title: "EduSmart – Quên mật khẩu",
  description:
    "Khôi phục quyền truy cập tài khoản EduSmart và tiếp tục hành trình học tập của bạn.",
  openGraph: {
    title: "EduSmart – Quên mật khẩu",
    description: "Đặt lại mật khẩu và quay lại EduSmart chỉ với vài bước.",
    url: "https://edusmart-frontend.vercel.app/forgot-password",
    images: [
      {
        url: "https://edusmart-frontend.vercel.app/emo.png",
        width: 1200,
        height: 630,
        alt: "EduSmart logo",
      },
    ],
    siteName: "EduSmart",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/emo.png",
        href: "/emo.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/emo.png",
        href: "/emo.png",
      },
    ],
  },
};

export default function Page() {
  return <ForgotPasswordPage />;
}
