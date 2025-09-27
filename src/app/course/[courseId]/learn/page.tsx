export const revalidate = 120;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCourseById } from "EduSmart/app/apiServer/courseAction";
import CourseViewVideoPage from "./Client";

export const metadata: Metadata = {
  title: "EduSmart – Khóa học",
  description: "Đăng nhập vào EduSmart để tiếp tục hành trình chăm sóc tinh thần của bạn.",
  openGraph: {
    title: "EduSmart",
    description: "EduSmart",
    url: "https://EduSmart-frontend.vercel.app/Login",
    images: [{ url: "https://EduSmart-frontend.vercel.app/emo.png", width: 1200, height: 630, alt: "EduSmart logo" }],
    siteName: "EduSmart",
  },
  icons: { icon: [{ media: "(prefers-color-scheme: light)", url: "/emo.png", href: "/emo.png" }, { media: "(prefers-color-scheme: dark)", url: "/emo.png", href: "/emo.png" }] },
};

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  if (!courseId) {
    console.log("CourseDetail - courseId missing");
    return notFound();
  }

  const isLearning = await CheckCourseById(courseId);
  if (!isLearning?.data) return notFound();

  return (
    <CourseViewVideoPage
    />
    // <div></div>
  );
}
