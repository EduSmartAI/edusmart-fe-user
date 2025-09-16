export const dynamic = "force-dynamic";

import { Metadata } from "next";
import CourseListPage from "./Client";
import { fetchCourseByQuery, GetAllCourses } from "../apiServer/courseAction";
export const metadata: Metadata = {
  title: "EduSmart – Khóa học",
  description:
    "Đăng nhập vào EduSmart để tiếp tục hành trình chăm sóc tinh thần của bạn.",
  openGraph: {
    title: "EduSmart",
    description: "EduSmart",
    url: "https://EduSmart-frontend.vercel.app/Login",
    images: [
      {
        url: "https://EduSmart-frontend.vercel.app/emo.png",
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

type SP = Record<string, string | string[] | undefined>;
const PAGE_SIZE = 9 as const;
export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const sp: SP = (searchParams ? await searchParams : {}) as SP;

  const pick = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const page = Number(pick(sp.page) ?? 1) || 1;
  const search = pick(sp.search) ?? "";

  const { data, totalCount } = await fetchCourseByQuery(search, page, PAGE_SIZE);
  const searchCoursedata = await GetAllCourses();

  return (
    <CourseListPage
      courses={data}
      totalCount={totalCount}
      page={page}
      size={PAGE_SIZE}
      searchCoursedata={searchCoursedata}
    />
  );
}
