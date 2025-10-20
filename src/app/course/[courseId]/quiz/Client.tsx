"use client";

import QuizPlayerComponent, {
  QuestionType,
  QuizData,
  type QuizResult, // <-- dùng type import
} from "EduSmart/components/Course/Quiz/QuizPlayerComponent";
import { QuizOutDto } from "EduSmart/api/api-course-service";
import { useMemo } from "react";

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

  // Không chặn render khi không được làm bài — để component tự vào chế độ xem kết quả (isAttemp=false)
  if (canAttempt === false) {
    console.warn("Không được phép làm bài lúc này", { studentQuizResultId });
  }

  const handleSubmit = async (payload: unknown): Promise<void> => {
    console.log("Submitting quiz:", { payload, quizId, chosenId, courseId, isHasModule });
  }

  return (
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
  );
}
