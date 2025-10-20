export const revalidate = 120;

import { Metadata } from "next";
import QuizClient from "./Client";
import { notFound } from "next/navigation";
import {
  CheckCourseById,
  GetStudentCourseProgressByCourseId,
} from "EduSmart/app/apiServer/courseAction";
import {
  StudentLessonDetailDto,
  QuizOutDto,
  ModuleDetailForStudentDto,
} from "EduSmart/api/api-course-service";
import { GetResultOfQuizByQuizResultId } from "EduSmart/app/apiServer/course/quizAction";
import {
  StudentCourseQuizSelectResponseEntity,
  StudentQuizCourseAnswerDetailResponse,
} from "EduSmart/api/api-quiz-service";
import { QuizResult } from "EduSmart/components/Course/Quiz/QuizPlayerComponent";

export const metadata: Metadata = {
  title: "EduSmart – Quiz",
  description: "Làm bài quiz trong khóa học.",
};

type PageProps = {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ moduleId?: string; lessonId?: string }>;
};

function toFEQuizResult(
  be?: StudentCourseQuizSelectResponseEntity,
): QuizResult | undefined {
  if (!be) return undefined;
  return {
    totalQuestions: be.totalQuestions ?? 0,
    totalCorrectAnswers: be.totalCorrectAnswers ?? 0,
    questionResults:
      be.questionResults?.map((q) => ({
        questionId: q.questionId ?? "",
        explanation: q.explanation ?? null,
        answers:
          q.answers?.map((a: StudentQuizCourseAnswerDetailResponse) => ({
            answerId: a.answerId ?? "",
            isCorrectAnswer: a.isCorrectAnswer,
            selectedByStudent: a.selectedByStudent,
          })) ?? [],
      })) ?? [],
  };
}

export default async function Page(props: PageProps) {
  const [{ courseId }, sp] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  if (!courseId) return notFound();

  const isLearning = await CheckCourseById(courseId);
  if (!isLearning?.data) return notFound();

  const data = await GetStudentCourseProgressByCourseId(courseId);
  const modules = (data.data?.modules ?? []) as ModuleDetailForStudentDto[];
  const lessons: StudentLessonDetailDto[] = modules.flatMap(
    (m) => m.lessons ?? [],
  );
  const keysInOrder = Object.keys(sp);
  const priorityKey = keysInOrder.find(
    (k) => k === "moduleId" || k === "lessonId",
  ) as "moduleId" | "lessonId" | undefined;

  const moduleId = sp.moduleId;
  const lessonId = sp.lessonId;

  let chosenModule: ModuleDetailForStudentDto | undefined;
  let chosenLesson: StudentLessonDetailDto | undefined;

  if (priorityKey === "moduleId" && moduleId) {
    // moduleId xuất hiện trước → phải hiện moduleQuiz
    chosenModule = modules.find((m) => m.moduleId === moduleId);
    if (!chosenModule?.moduleQuiz?.quizId) return notFound();
  } else if (priorityKey === "lessonId" && lessonId) {
    // lessonId xuất hiện trước → phải hiện lessonQuiz
    chosenLesson = lessons.find((l) => l.lessonId === lessonId);
    if (!chosenLesson?.lessonQuiz?.quizId) return notFound();
  } else {
    chosenLesson = lessons.find((l) => !!l.lessonQuiz?.quizId);
    if (!chosenLesson) {
      chosenModule = modules.find((m) => !!m.moduleQuiz?.quizId);
      if (!chosenModule) return notFound();
    }
  }

  const isHasModule = !!chosenModule;
  console.log("isHasModule:", isHasModule);
  // Lấy quiz & meta tương ứng
  const quiz: QuizOutDto | undefined =
    (chosenLesson?.lessonQuiz as QuizOutDto) ??
    (chosenModule?.moduleQuiz as QuizOutDto);

  if (!quiz?.quizId) return notFound();

  const canAttempt = (chosenLesson?.canAttempt ?? chosenModule?.canAttempt) as
    | boolean
    | undefined;

  const studentQuizResultId = (chosenLesson?.studentQuizResultId ??
    chosenModule?.studentQuizResultId) as string | undefined;

  const quizResult = await GetResultOfQuizByQuizResultId(
    studentQuizResultId ?? "",
  );

  const title = (chosenLesson?.title ??
    chosenModule?.moduleName ??
    "") as string;

  return (
    <QuizClient
      courseId={courseId}
      quizId={quiz.quizId!}
      chosenId={isHasModule ? chosenModule?.moduleId : chosenLesson?.lessonId} // moduleQuiz thì undefined
      tilte={title}
      quiz={quiz}
      canAttempt={canAttempt}
      isHasModule={isHasModule}
      studentQuizResultId={studentQuizResultId}
      quizResult={toFEQuizResult(quizResult.data.response)}
    />
  );
}
