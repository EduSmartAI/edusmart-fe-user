// app/(...)/[courseId]/quiz/QuizContentRSC.tsx
import QuizClient from "./Client";
import { notFound } from "next/navigation";
import {
  CheckCourseById,
  GetStudentCourseProgressByCourseId,
} from "EduSmart/app/apiServer/courseAction";
import {
  ModuleDetailForStudentDto,
  StudentLessonDetailDto,
  QuizOutDto,
} from "EduSmart/api/api-course-service";
import { GetResultOfQuizByQuizResultId } from "EduSmart/app/apiServer/course/quizAction";
import {
  StudentCourseQuizSelectResponseEntity,
  StudentQuizCourseAnswerDetailResponse,
} from "EduSmart/api/api-quiz-service";
import { QuizResult } from "EduSmart/components/Course/Quiz/QuizPlayerComponent";
import { unstable_noStore } from "next/cache";

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

type Props = {
  // truyền Promise vào để Page không phải await → phần này sẽ suspend trong Suspense
  paramsPromise: Promise<{ courseId: string }>;
  searchParamsPromise: Promise<{ moduleId?: string; lessonId?: string }>;
};

export default async function QuizContentRSC({
  paramsPromise,
  searchParamsPromise,
}: Props) {
  unstable_noStore();
  const [{ courseId }, sp] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
  ]);
  if (!courseId) return notFound();

  const isLearning = await CheckCourseById(courseId);
  if (!isLearning?.data) return notFound();

  const data = await GetStudentCourseProgressByCourseId(courseId);
  const modules = (data.data?.modules ?? []) as ModuleDetailForStudentDto[];
  const lessons: StudentLessonDetailDto[] = modules.flatMap(
    (m) => m.lessons ?? [],
  );

  // Ưu tiên theo thứ tự xuất hiện trong URL (moduleId trước hoặc lessonId trước)
  const keysInOrder = Object.keys(sp || {});
  const priorityKey = keysInOrder.find(
    (k) => k === "moduleId" || k === "lessonId",
  ) as "moduleId" | "lessonId" | undefined;

  const moduleId = sp?.moduleId;
  const lessonId = sp?.lessonId;

  let chosenModule: ModuleDetailForStudentDto | undefined;
  let chosenLesson: StudentLessonDetailDto | undefined;

  if (priorityKey === "moduleId" && moduleId) {
    chosenModule = modules.find((m) => m.moduleId === moduleId);
    if (!chosenModule?.moduleQuiz?.quizId) return notFound();
  } else if (priorityKey === "lessonId" && lessonId) {
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

  const quiz: QuizOutDto | undefined =
    (chosenLesson?.lessonQuiz as QuizOutDto) ??
    (chosenModule?.moduleQuiz as QuizOutDto);

  if (!quiz?.quizId) return notFound();

  const canAttempt = (chosenLesson?.canAttempt ?? chosenModule?.canAttempt) as
    | boolean
    | undefined;

  const studentQuizResultId = (chosenLesson?.studentQuizResultId ??
    chosenModule?.studentQuizResultId) as string | undefined;

  const beResult =
    !canAttempt && studentQuizResultId
      ? await GetResultOfQuizByQuizResultId(studentQuizResultId)
      : undefined;

  console.log("quizResultId:", studentQuizResultId);
  console.log("canAttempt:", canAttempt);
  console.log("beResult:", beResult);

  const title = (chosenLesson?.title ??
    chosenModule?.moduleName ??
    "") as string;

  return (
    <QuizClient
      courseId={courseId}
      quizId={quiz.quizId!}
      chosenId={isHasModule ? chosenModule?.moduleId : chosenLesson?.lessonId}
      tilte={title}
      quiz={quiz}
      canAttempt={canAttempt}
      isHasModule={isHasModule}
      studentQuizResultId={studentQuizResultId}
      quizResult={toFEQuizResult(beResult?.data.response)}
    />
  );
}
