"use client";

import QuizPlayerComponent, {
  Question,
  QuestionType,
  QuizData,
  QuizResponseItem,
  type QuizResult, // <-- dùng type import
} from "EduSmart/components/Course/Quiz/QuizPlayerComponent";
import { QuizOutDto } from "EduSmart/api/api-course-service";
import { useMemo, useState, useTransition } from "react";
import { useCourseStore } from "EduSmart/stores/course/courseStore";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";

type Props = {
  quizId?: string;
  chosenId?: string;
  courseId?: string;
  tilte?: string;
  quiz?: QuizOutDto;
  canAttempt?: boolean;
  studentQuizResultId?: string;
  isHasModule?: boolean;
  /** NEW: kết quả từ BE để hiển thị khi không được làm bài */
  quizResult?: QuizResult;
};

// map number (BE) -> QuestionType enum (FE)
// LƯU Ý: Enum của component hiện là 1=MultipleChoice, 2=TrueFalse, 3=SingleChoice.
// Nếu BE của bạn khác mapping, chỉnh lại switch-case cho khớp.
function mapQuestionType(n?: number): QuestionType {
  switch (n) {
    case 1:
      return QuestionType.MultipleChoice;
    case 2:
      return QuestionType.TrueFalse;
    case 3:
      return QuestionType.SingleChoice;
    default:
      return QuestionType.SingleChoice;
  }
}

// map QuizOutDto (BE) -> QuizData (FE)
function toQuizData(quiz?: QuizOutDto): QuizData {
  return {
    questions:
      quiz?.questions?.map((q) => ({
        questionId: q.questionId ?? "",
        questionText: q.questionText ?? "",
        questionType: mapQuestionType(q.questionType),
        answers:
          q.answers?.map((a) => ({
            answerId: a.answerId ?? "",
            answerText: a.answerText ?? "",
          })) ?? [],
      })) ?? [],
  };
}

type SubmitPayload = {
  questions: Question[];
  responses: QuizResponseItem[];
};

function LoadingBackdrop({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.08)",
        backdropFilter: "blur(1.5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-busy
      aria-live="polite"
      role="status"
    >
      <Spin size="large" />
    </div>
  );
}

export default function QuizClient({
  quizId,
  chosenId,
  courseId,
  tilte,
  quiz,
  canAttempt,
  studentQuizResultId,
  isHasModule,
  quizResult, // NEW
}: Props) {
  const data = useMemo(() => toQuizData(quiz), [quiz]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition()
  // Không chặn render khi không được làm bài — để component tự vào chế độ xem kết quả (isAttemp=false)
  if (canAttempt === false) {
    console.warn("Không được phép làm bài lúc này", { studentQuizResultId });
  }
  const submitLessonOrModuleQuiz = useCourseStore(
    (s) => s.submitLessonOrModuleQuiz,
  );

  const handleSubmit = async ({ responses }: SubmitPayload): Promise<void> => {
    const key = "submit-quiz";

    if (!quizId || !courseId || !chosenId || typeof isHasModule !== "boolean") {
      console.error("Thiếu tham số bắt buộc khi submit quiz.");
      return;
    }
    const answersForApi = responses.map((r) => ({
      questionId: r.questionId,
      selectedAnswerIds: r.selectedAnswerIds ?? [],
    }));
    const lessonId = isHasModule ? "" : chosenId;
    const moduleId = isHasModule ? chosenId : "";

    try {
      setSubmitting(true);
      message.loading({ key, content: "Đang nộp bài...", duration: 0 });

      const resultMsg = await submitLessonOrModuleQuiz(
        lessonId,
        moduleId,
        quizId,
        isHasModule,
        courseId,
        answersForApi,
      );

      // Thông báo + bật lại quyền làm bài (yêu cầu của bạn)
      message.success({
        key,
        content: resultMsg.message || "Nộp bài thành công!",
        duration: 1.2,
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('_t', Date.now().toString());
      router.replace(currentUrl.toString());
      startTransition(() => {
        router.refresh(); // sẽ kích hoạt loading.tsx + isRefreshing=true
      });
      
    } catch (err: unknown) {
      // Narrow the unknown error to extract a usable message safely
      let errorMessage = "Nộp bài thất bại. Vui lòng thử lại.";
      if (err instanceof Error) {
        console.error("Submit quiz error:", err);
        errorMessage = err.message || errorMessage;
      } else {
        console.error("Submit quiz error:", err);
      }
      message.error({
        key,
        content: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <QuizPlayerComponent
        data={data}
        title={`Bài Quiz${tilte ? ` – ${tilte}` : ""}`}
        onSubmit={handleSubmit}
        defaultIndex={0}
        initialSelections={{}}
        showSidebar={true}
        isAttemp={canAttempt}
        result={quizResult}
      />
      <LoadingBackdrop visible={submitting || isRefreshing} />
    </div>
  );
}
