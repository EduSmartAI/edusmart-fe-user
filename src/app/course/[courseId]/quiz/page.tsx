// app/(...)/[courseId]/quiz/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import QuizContentRSC from "./QuizContentRSC";
import QuizFallback from "./QuizFallback";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "EduSmart – Quiz",
  description: "Làm bài quiz trong khóa học.",
};

type PageProps = {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ moduleId?: string; lessonId?: string }>;
};

export default function Page(props: PageProps) {
  // KHÔNG await ở đây → để QuizContentRSC tự await và 'suspend'
  return (
    <Suspense fallback={<QuizFallback />}>
      <QuizContentRSC
        paramsPromise={props.params}
        searchParamsPromise={props.searchParams}
      />
    </Suspense>
  );
}
