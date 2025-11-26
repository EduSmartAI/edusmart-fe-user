// app/(quiz)/quizAction.ts
"use server";

import apiServer from "EduSmart/lib/apiServer";

export interface QuizListItem {
  quizId: string;
  title: string;
  description: string;
  subjectCode: string;
  subjectCodeName: string;
  totalQuestions: number;
  difficultyLevel?: string;
}

export interface TestDetail {
  testId: string;
  testName: string;
  description: string;
  quizzes: Array<{
    quizId: string;
    title: string;
    description: string;
    subjectCode?: string;
    subjectCodeName?: string;
    totalQuestions?: number;
    difficultyLevel?: string;
    questions: QuizQuestion[];
  }>;
}

export interface QuizQuestion {
  questionId: string;
  questionText: string;
  questionType: string;
  difficultyLevel?: number | string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  answerId: string;
  answerText: string;
  isCorrectAnswer?: boolean;
  selectedByStudent?: boolean;
}

export interface StudentTestResult {
  studentTestId: string;
  testId: string;
  testName: string;
  testDescription?: string;
  startedAt: string;
  finishedAt: string;
  quizzesResults: Array<{
    quizId: string;
    title: string;
    description?: string;
    subjectCode?: string;
    subjectCodeName?: string;
    totalQuestions?: number;
    totalCorrectAnswers?: number;
    correctedQuestions: number;
    questionsResult: QuizQuestion[];
  }>;
}

export interface DetailError {
  field?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  response: T;
  messageId?: string;
  detailErrors?: DetailError[] | null;
}

/**
 * Server Action: Get Quiz List
 */

export type NormalizedHttpError = {
  message: string;
  details?: string;
  status?: number;
};

export async function normalizeFetchError(
  err: unknown,
): Promise<NormalizedHttpError> {
  // Lỗi do fetch ném ra Response
  if (err instanceof Response) {
    let details = "";
    try {
      const clone = err.clone();
      const ct = clone.headers.get("content-type") ?? "";
      details = ct.includes("application/json")
        ? JSON.stringify(await clone.json())
        : await clone.text();
    } catch {
      // ignore
    }
    return {
      message: `HTTP ${err.status} ${err.statusText}`,
      details,
      status: err.status,
    };
  }

  // Một số lib bọc lỗi có err.cause là Response
  const unknownErr = err as unknown;
  if (
    typeof unknownErr === "object" &&
    unknownErr !== null &&
    "cause" in unknownErr &&
    (unknownErr as { cause?: unknown }).cause instanceof Response
  ) {
    const cause = (unknownErr as { cause: Response }).cause;
    let details = "";
    try {
      const clone = cause.clone();
      const ct = clone.headers.get("content-type") ?? "";
      details = ct.includes("application/json")
        ? JSON.stringify(await clone.json())
        : await clone.text();
    } catch {}
    return {
      message: `HTTP ${cause.status} ${cause.statusText}`,
      details,
      status: cause.status,
    };
  }

  // Fallback
  return {
    message:
      unknownErr && typeof unknownErr === "object" && "message" in unknownErr
        ? String((unknownErr as { message?: unknown }).message)
        : String(err),
  };
}

export async function getQuizListAction(): Promise<
  | { ok: true; data: ApiResponse<QuizListItem[]> }
  | { ok: false; error: string; status?: number }
> {
  try {
    const res = await apiServer.quiz.api.v1QuizSelectQuizzesList();

    if (!res.data?.success) {
      return {
        ok: false,
        error: res.data?.message || "Failed to fetch quiz list",
        status: 400,
      };
    }

    const backendItems = res.data.response ?? [];
    const items: QuizListItem[] = backendItems.map((q) => ({
      quizId: q.quizId ?? "",
      title: q.title ?? "",
      description: q.description ?? "",
      subjectCode: q.subjectCode ?? "",
      subjectCodeName: q.subjectCodeName ?? "",
      totalQuestions: q.totalQuestions ?? 0,
    }));

    return {
      ok: true,
      data: {
        success: true,
        message: res.data.message ?? "OK",
        response: items,
        messageId: res.data.messageId,
        detailErrors: res.data.detailErrors ?? null,
      },
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    console.error("❌ getQuizListAction failed:", nErr);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}

/**
 * Server Action: Create Test (Select Quizzes)
 */
export async function createTestAction(
  quizIds: string[],
): Promise<
  | { ok: true; data: ApiResponse<TestDetail> }
  | { ok: false; error: string; status?: number }
> {
  try {
    const res = await apiServer.quiz.api.v1TestSelectTestList({
      QuizId: quizIds,
    });

    if (!res.data.success) {
      return {
        ok: false,
        error: "Failed to fetch quiz list",
      };
    }

    const test = res.data.response;

    const mapped: TestDetail = {
      testId: test?.testId ?? "",
      testName: test?.testName ?? "",
      description: test?.description ?? "",
      quizzes: (test?.quizzes ?? []).map((q) => ({
        quizId: q?.quizId ?? "",
        title: q?.title ?? "",
        description: q?.description ?? "",
        subjectCode: q?.subjectCode ?? "",
        subjectCodeName: q?.subjectCodeName ?? "",
        totalQuestions: q?.totalQuestions ?? q?.questions?.length ?? 0,
        questions: (q?.questions ?? []).map((ques) => ({
          questionId: ques?.questionId ?? "",
          questionText: ques?.questionText ?? "",
          questionType:
            typeof ques?.questionType === "number"
              ? String(ques?.questionType)
              : ((typeof ques?.questionType === "string"
                  ? ques?.questionType
                  : "") ?? ""),
          difficultyLevel: ques?.difficultyLevel ?? "",
          answers: (ques?.answers ?? []).map((a) => ({
            answerId: a?.answerId ?? "",
            answerText: a?.answerText ?? "",
            isCorrectAnswer: undefined,
            selectedByStudent: undefined,
          })),
        })),
      })),
    };

    return {
      ok: true,
      data: {
        success: res.data.success ?? true,
        message: res.data.message ?? "OK",
        response: mapped,
        messageId: res.data.messageId,
        detailErrors: res.data.detailErrors ?? null,
      },
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    console.error("❌ Error in createTestAction:", nErr);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}

/**
 * Server Action: Submit Student Test
 */
export async function submitStudentTestAction(testData: {
  testId: string;
  startedAt: string;
  quizIds: string[];
  answers: Array<{ questionId: string; answerId: string }>;
  practiceTestAnswers?: Array<{
    problemId: string;
    languageId: number;
    codeSubmission: string;
  }>;
}): Promise<
  | { ok: true; data: ApiResponse<{ learningPathId: string }> }
  | { ok: false; error: string; status?: number }
> {
  try {
    // Use exact payload structure as specified
    const payload: {
      testId: string;
      startedAt: string;
      quizIds: string[];
      answers: Array<{ questionId: string; answerId: string }>;
      practiceTestAnswers?: Array<{
        problemId: string;
        languageId: number;
        codeSubmission: string;
      }>;
    } = {
      testId: testData.testId,
      startedAt: testData.startedAt,
      quizIds: testData.quizIds,
      answers: testData.answers.map((answer) => ({
        questionId: answer.questionId,
        answerId: answer.answerId,
      })),
    };

    // Add practiceTestAnswers if provided
    if (
      testData.practiceTestAnswers &&
      testData.practiceTestAnswers.length > 0
    ) {
      payload.practiceTestAnswers = testData.practiceTestAnswers.map(
        (answer) => ({
          problemId: answer.problemId,
          languageId: answer.languageId,
          codeSubmission: answer.codeSubmission,
        }),
      );
    }

    console.log("📤 Final payload:", payload);

    const res =
      await apiServer.quiz.api.v1StudentTestInsertStudentTestCreate(payload);

    console.log("✅ Submit test response:", res);

    if (!res.data.success) {
      return {
        ok: false,
        error: res.data.message || "Failed to submit test",
        status: 400,
      };
    }

    // Response is learningPathId (UUID string or object with learningPathId)
    const learningPathId =
      typeof res.data.response === "string"
        ? res.data.response
        : ((res.data.response as any)?.learningPathId ?? "");

    return {
      ok: true,
      data: {
        success: res.data.success ?? true,
        message: res.data.message ?? "OK",
        response: { learningPathId },
        messageId: res.data.messageId,
        detailErrors: res.data.detailErrors ?? null,
      },
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    console.error("❌ Error in submitStudentTestAction:", nErr);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}

/**
 * Server Action: Get Student Test Result
 */
export async function getStudentTestResultAction(
  studentTestId: string,
): Promise<
  | { ok: true; data: ApiResponse<StudentTestResult> }
  | { ok: false; error: string; status?: number }
> {
  try {
    const res = await apiServer.quiz.api.v1StudentTestSelectStudentTestList({
      studentTestId,
    });

    const dto = res.data;
    if (!dto?.success) {
      return {
        ok: false,
        error: dto?.message || "Failed to get test result",
        status: 400,
      };
    }

    const entity = dto.response;

    const mapped: StudentTestResult = {
      studentTestId: entity?.studentTestId ?? "",
      testId: entity?.testId ?? "",
      testName: entity?.testName ?? "",
      testDescription: entity?.testDescription ?? "",
      startedAt: entity?.startedAt ?? "",
      finishedAt: entity?.finishedAt ?? "",
      quizzesResults: (entity?.quizResults ?? []).map((qr) => {
        const corrected = (qr?.questionResults ?? []).reduce((acc, ques) => {
          const anyCorrectSelected = (ques?.answers ?? []).some(
            (a) => a?.selectedByStudent === true && a?.isCorrectAnswer === true,
          );
          return acc + (anyCorrectSelected ? 1 : 0);
        }, 0);

        return {
          quizId: qr?.quizId ?? "",
          title: qr?.title ?? "",
          description: qr?.description ?? "",
          subjectCode: qr?.subjectCode ?? "",
          subjectCodeName: qr?.subjectCodeName ?? "",
          totalQuestions: qr?.totalQuestions ?? 0,
          totalCorrectAnswers: qr?.totalCorrectAnswers ?? 0,
          correctedQuestions: corrected,
          questionsResult: (qr?.questionResults ?? []).map((ques) => ({
            questionId: ques?.questionId ?? "",
            questionText: ques?.questionText ?? "",
            questionType:
              typeof ques?.questionType === "number"
                ? String(ques.questionType)
                : ((ques?.questionType as unknown as string) ?? ""),
            difficultyLevel: ques?.difficultyLevel ?? "",
            answers: (ques?.answers ?? []).map((a) => ({
              answerId: a?.answerId ?? "",
              answerText: a?.answerText ?? "",
              isCorrectAnswer: a?.isCorrectAnswer,
              selectedByStudent: a?.selectedByStudent,
            })),
          })),
        };
      }),
    };

    return {
      ok: true,
      data: {
        success: dto.success ?? true,
        message: dto.message ?? "OK",
        response: mapped,
        messageId: dto.messageId,
        detailErrors: dto.detailErrors ?? null,
      },
    };
  } catch (error) {
    const nErr = await normalizeFetchError(error);
    console.error("❌ Error in getStudentTestResultAction:", nErr);
    return {
      ok: false,
      error: nErr.details ? `${nErr.message} — ${nErr.details}` : nErr.message,
      status: nErr.status,
    };
  }
}
