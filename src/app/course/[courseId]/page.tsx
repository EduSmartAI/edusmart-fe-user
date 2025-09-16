export const revalidate = 120;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailUI from "./Client";
import { fetchCourseById } from "EduSmart/app/apiServer/courseAction";

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

  const api = await fetchCourseById(courseId);
  console.log("CourseDetail - api:", api);
  if (!api?.data?.courseId) return notFound();

  const { data, modulesCount = 0, lessonsCount = 0 } = api;

  return (
    <CourseDetailUI
      data={data}
      modulesCount={modulesCount}
      lessonsCount={lessonsCount}
    />
    // <div></div>
  );
}
