export const revalidate = 120;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CheckCourseById,
  GetStudentCourseProgressByCourseId,
} from "EduSmart/app/apiServer/courseAction";
import {
  CourseDetailForStudentDto,
  StudentLessonDetailDto,
} from "EduSmart/api/api-course-service";
import CourseVideoClient from "./Client";

function pickInitialLessonId(
  course: CourseDetailForStudentDto,
  requested?: string,
): string | undefined {
  const modules = course.modules ?? [];
  const allLessons: StudentLessonDetailDto[] = modules.flatMap(
    (m) => m.lessons ?? [],
  );

  const hasId = (id?: string) =>
    !!id && allLessons.some((l) => l.lessonId === id);

  if (hasId(requested)) return requested;

  const firstIncomplete = allLessons.find((l) => !l.isCompleted)?.lessonId;
  if (hasId(firstIncomplete)) return firstIncomplete;

  return allLessons[0]?.lessonId;
}

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

type PageProps = {
  /** Next.js 15: params/searchParams là Promise */
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lessonId?: string }>;
};

export default async function Page(props: PageProps) {
  const [{ courseId }, { lessonId }] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  if (!courseId) return notFound();

  const isLearning = await CheckCourseById(courseId);
  if (!isLearning?.data) return notFound();

  const data = await GetStudentCourseProgressByCourseId(courseId);
  const initialLessonId = pickInitialLessonId(data.data, lessonId);

  return (
    <CourseVideoClient
      course={data.data}
      initialLessonId={initialLessonId}
    />
  );
}