"use client";

import React, { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { IoTimeOutline } from "react-icons/io5";
import { ThemeSwitch } from "EduSmart/components/Themes/Theme";
import { FadeInUp } from "EduSmart/components/Animation/FadeInUp";

/* ===== Types & Enums khớp với backend ===== */
export type Answer = { answerId: string; answerText: string };
export type Question = {
  questionId: string;
  questionText: string;
  questionType: number; // 1 = MultipleChoice, 2 = TrueFalse, 3 = SingleChoice
  answers: Answer[];
};
export type QuizData = { questions: Question[] };

export enum QuestionType {
  MultipleChoice = 1,
  TrueFalse = 2,
  SingleChoice = 3,
}

export type QuizResponseItem = {
  questionId: string;
  questionType: number;
  selectedAnswerIds: string[];
};

/* ===== NEW: Result types (theo payload BE) ===== */
type ResultAnswer = {
  answerId: string;
  isCorrectAnswer?: boolean;
  selectedByStudent?: boolean;
};
type ResultQuestion = {
  questionId: string;
  explanation?: string | null;
  answers?: ResultAnswer[];
};
export type QuizResult = {
  totalQuestions?: number;
  totalCorrectAnswers?: number;
  questionResults?: ResultQuestion[];
};

export interface QuizPlayerProps {
  data: QuizData;
  title?: string;
  onSubmit?: (payload: {
    questions: Question[];
    responses: QuizResponseItem[];
  }) => Promise<void> | void;
  defaultIndex?: number;
  initialSelections?: Record<string, string[]>;
  showSidebar?: boolean;
  className?: string;

  /* ===== NEW: bật xem kết quả ===== */
  isShowResult?: boolean;
  /* ===== NEW: nếu isAttemp === false -> tự bật xem kết quả ===== */
  isAttemp?: boolean;
  /* ===== NEW: dữ liệu kết quả từ BE ===== */
  result?: QuizResult;
}

export default function QuizPlayerComponent({
  data,
  title = "Quiz",
  onSubmit,
  defaultIndex = 0,
  initialSelections = {},
  showSidebar = true,
  className = "",
  /* NEW props */
  isShowResult,
  isAttemp,
  result,
}: QuizPlayerProps) {
  const panelShadow = "shadow-[0_8px_30px_rgba(0,0,0,0.25)]";

  /* ===== NEW: quyết định có hiển thị kết quả không ===== */
  const showResult = (isShowResult ?? isAttemp === false) === true;

  // ===== State =====
  const total = data.questions.length;
  const [currentIdx, setCurrentIdx] = useState(() =>
    Math.min(Math.max(defaultIndex, 0), Math.max(total - 1, 0)),
  );
  const [selections, setSelections] = useState<Record<string, string[]>>(
    () => ({ ...initialSelections }),
  );

  const currentQ = data.questions[currentIdx];

  /* ===== NEW: helpers lấy meta kết quả ===== */
  const findQResult = (qid: string) =>
    result?.questionResults?.find((q) => q.questionId === qid);

  const getAnswerMeta = (qid: string, aid: string) =>
    findQResult(qid)?.answers?.find((a) => a.answerId === aid);

  // ===== Progress =====
  const answeredCount = useMemo(() => {
    if (showResult && result?.questionResults?.length) {
      // tính theo những câu có chọn (selectedByStudent) trong kết quả
      return result.questionResults.reduce(
        (acc, qr) =>
          acc + (qr.answers?.some((a) => a.selectedByStudent) ? 1 : 0),
        0,
      );
    }
    return data.questions.reduce(
      (acc, q) => acc + ((selections[q.questionId] ?? []).length > 0 ? 1 : 0),
      0,
    );
  }, [showResult, result, data.questions, selections]);

  const progressPct = useMemo(
    () => (total > 0 ? Math.round((answeredCount / total) * 100) : 0),
    [answeredCount, total],
  );

  // ===== Helpers =====
  const letterOf = (i: number) => String.fromCharCode(65 + i);
  const isMultiple = currentQ?.questionType === QuestionType.MultipleChoice;

  // ===== Handlers =====
  const handlePick = (answerId: string) => {
    if (showResult) return; // NEW: khoá chọn khi đang xem kết quả

    const qid = currentQ.questionId;
    const type = currentQ.questionType;

    setSelections((prev) => {
      const cur = new Set(prev[qid] ?? []);
      if (type === QuestionType.MultipleChoice) {
        if (cur.has(answerId)) cur.delete(answerId);
        else cur.add(answerId);
        return { ...prev, [qid]: Array.from(cur) };
      } else {
        return { ...prev, [qid]: [answerId] };
      }
    });
  };

  const goPrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const goNext = () =>
    currentIdx < total - 1 ? setCurrentIdx((i) => i + 1) : handleSubmit();

  const handleSubmit = async () => {
    if (showResult) return; // NEW: không nộp khi đang xem kết quả

    const responses: QuizResponseItem[] = data.questions.map((q) => ({
      questionId: q.questionId,
      questionType: q.questionType,
      selectedAnswerIds: selections[q.questionId] ?? [],
    }));

    const payload = { questions: data.questions, responses };
    if (onSubmit) await onSubmit(payload);
    else {
      alert("Nộp bài thành công!");
      console.log("Submitting payload:", payload);
    }
  };

  if (!currentQ) {
    return (
      <div
        className={
          "relative w-full text-slate-900 bg-transparent dark:text-neutral-100 " +
          className
        }
      >
        <div className="mx-auto max-w-2xl p-6 text-center text-slate-600 dark:text-neutral-300">
          Không có câu hỏi nào.
        </div>
      </div>
    );
  }

  /* ===== NEW: dữ liệu kết quả cho câu hiện tại ===== */
  const qResult = findQResult(currentQ.questionId);

  return (
    <div className={className}>
      {/* ===== Background giữ nguyên ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* LIGHT base */}
        <div className="absolute inset-0 z-0 dark:hidden bg-gradient-to-bl from-emerald-200 via-teal-300 to-indigo-400 opacity-70" />
        {/* LIGHT blobs */}
        <div
          className="
            absolute inset-0 z-10 dark:hidden
            [mask-image:radial-gradient(165%_145%_at_58%_50%,#000_55%,transparent_82%)]
            [-webkit-mask-image:radial-gradient(165%_145%_at_58%_50%,#000_55%,transparent_82%)]
            [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]
            [mask-size:cover] [-webkit-mask-size:cover]
            bg-[radial-gradient(1200px_700px_at_62%_48%,rgba(60,180,255,0.28),transparent_56%),radial-gradient(980px_560px_at_84%_12%,rgba(155,92,255,0.22),transparent_58%),radial-gradient(760px_520px_at_10%_88%,rgba(255,150,110,0.14),transparent_62%)]
            mix-blend-soft-light
          "
        />
        {/* DARK base */}
        <div className="absolute inset-0 z-0 hidden dark:block bg-gradient-to-bl from-[#0a0d18] via-[#0f1630] to-[#05070c]" />
        {/* DARK blobs */}
        <div
          className="
            absolute inset-0 z-10 hidden dark:block
            [mask-image:radial-gradient(165%_145%_at_58%_50%,#000_60%,transparent_86%)]
            [-webkit-mask-image:radial-gradient(165%_145%_at_58%_50%,#000_60%,transparent_86%)]
            [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]
            [mask-size:cover] [-webkit-mask-size:cover]
            bg-[radial-gradient(880px_560px_at_30%_40%,rgba(80,130,255,0.2),transparent_80%),radial-gradient(520px_380px_at_84%_18%,rgba(168,132,255,0.16),transparent_58%),radial-gradient(660px_480px_at_8%_88%,rgba(255,120,80,0.08),transparent_64%)]
            mix-blend-screen
          "
        />
      </div>
      <main className="relative w-full text-slate-900 bg-transparent dark:text-neutral-100">
        {/* Top bar (đã sửa để title luôn 1 dòng, căn giữa) */}
        <div className="relative lg:mb-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-2 z-0 h-[84px]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-b-3xl backdrop-blur-xl backdrop-saturate-150 ring-1 bg-white/55 ring-black/5 shadow-[0_14px_32px_rgba(2,6,23,0.18)] dark:bg-white/[0.06] dark:ring-white/[0.06] dark:shadow-[0_18px_40px_rgba(0,0,0,0.35)] [mask-image:linear-gradient(to_bottom,black,black,transparent)]" />
            <div className="absolute inset-x-0 -bottom-px h-4 bg-gradient-to-b from-black/8 to-transparent dark:from-black/24" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="relative flex items-center justify-between gap-3">
              <button
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm backdrop-blur
                  border-slate-200 bg-white/80 text-slate-800 hover:bg-white shadow-sm
                  dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10 ${panelShadow}`}
                aria-label="Back"
                onClick={() => window.history.back?.()}
              >
                <HiChevronLeft className="text-xl" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="justify-self-end">
                <ThemeSwitch />
              </div>

              <h1
                className="
                  pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                  whitespace-nowrap truncate text-center leading-tight
                  text-base sm:text-lg font-semibold
                  max-w-[min(70ch,calc(100%-220px))]
                "
                title={title}
              >
                {title}
              </h1>
            </div>
          </div>
        </div>

        <FadeInUp>
          {/* Progress */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-neutral-400">
              <span>
                Câu {Math.min(currentIdx + 1, total)} / {total}
              </span>
              <span>
                {showResult && typeof result?.totalCorrectAnswers === "number"
                  ? `Đúng ${result.totalCorrectAnswers}/${result.totalQuestions ?? total}`
                  : `${progressPct}% Completed`}
              </span>
            </div>
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="h-full rounded-full transition-all bg-indigo-600 dark:bg-violet-500"
                style={{ width: `${progressPct}%` }}
                aria-label="progress"
              />
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
            {/* Left */}
            <section className="space-y-4">
              {/* Question card */}
              <div
                className={`rounded-2xl border p-5 backdrop-blur border-slate-200 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-100 ${panelShadow}`}
              >
                <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-medium bg-sky-600/10 text-sky-700 dark:bg-violet-500/15 dark:text-violet-300">
                    {currentIdx + 1}/{total}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-neutral-300">
                      <IoTimeOutline className="text-base text-rose-400" />
                      00:00
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 bg-slate-100 dark:bg-white/5
                      ${isMultiple ? "ring-2 ring-indigo-400/60 text-indigo-600 font-semibold dark:ring-violet-400/60 dark:text-violet-300" : "text-slate-700 dark:text-neutral-300"}
                    `}
                      title={
                        isMultiple
                          ? "Bạn có thể chọn nhiều đáp án"
                          : "Chỉ chọn một đáp án"
                      }
                    >
                      {isMultiple ? (
                        <>
                          <span className="h-2.5 w-2.5 rounded-[3px] border border-current relative">
                            <span className="absolute inset-[3px] bg-current/80" />
                          </span>
                          Chọn nhiều đáp án
                        </>
                      ) : (
                        <>
                          <span className="h-2.5 w-2.5 rounded-full border border-current relative">
                            <span className="absolute inset-[4px] rounded-full bg-current/80" />
                          </span>
                          Một đáp án
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <p className="text-[22px] font-semibold leading-relaxed md:text-[26px]">
                  {currentQ.questionText}
                </p>

                {/* NEW: Explanation nếu có */}
                {showResult && qResult?.explanation && (
                  <div className="mt-3 rounded-xl border px-4 py-3 text-sm border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                    {qResult.explanation}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {currentQ.answers.map((a, idx) => {
                  /* lựa chọn đang hiển thị */
                  const selectedIds = showResult
                    ? new Set(
                        findQResult(currentQ.questionId)
                          ?.answers?.filter((x) => x.selectedByStudent)
                          .map((x) => x.answerId) ?? [],
                      )
                    : new Set(selections[currentQ.questionId] ?? []);

                  const picked = selectedIds.has(a.answerId);

                  /* NEW: trạng thái kết quả cho đáp án */
                  const meta = getAnswerMeta(currentQ.questionId, a.answerId);
                  const isCorrect = showResult
                    ? !!meta?.isCorrectAnswer
                    : false;
                  const isWrongPicked = showResult
                    ? picked && !isCorrect
                    : false;

                  const base =
                    "group relative overflow-hidden flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition " +
                    "backdrop-blur will-change-transform motion-safe:duration-300 motion-safe:ease-out";
                  const tone =
                    "border-slate-200 bg-white hover:bg-white shadow-sm " +
                    "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10";

                  /* giữ hiệu ứng pick cũ khi chưa chấm */
                  const pickedState =
                    picked && !showResult
                      ? "border-indigo-500/60 ring-2 ring-indigo-400/60 bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 " +
                        "dark:border-violet-500/60 dark:ring-violet-400/60 dark:from-violet-500/10 dark:to-violet-500/5 motion-safe:scale-[1.01]"
                      : "";

                  /* NEW: màu theo kết quả */
                  const resultState = showResult
                    ? isCorrect
                      ? "border-emerald-500/60 ring-2 ring-emerald-400/70 bg-emerald-500/5"
                      : isWrongPicked
                        ? "border-rose-500/60 ring-2 ring-rose-400/70 bg-rose-500/5"
                        : ""
                    : "";

                  return (
                    <button
                      key={a.answerId}
                      onClick={() => handlePick(a.answerId)}
                      aria-pressed={picked}
                      disabled={showResult} /* NEW: khoá khi xem kết quả */
                      className={[
                        base,
                        tone,
                        pickedState,
                        resultState,
                        "hover:-translate-y-[1px] active:translate-y-[0.5px] focus:outline-none",
                        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-white",
                        "disabled:cursor-default disabled:opacity-100",
                        "dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-transparent",
                      ].join(" ")}
                    >
                      {/* Sheen */}
                      <span
                        aria-hidden
                        className={[
                          "pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-[18deg]",
                          "before:content-[''] before:absolute before:inset-0",
                          "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                          "dark:before:via-white/6",
                          "opacity-0 active:opacity-100 group-focus-visible:opacity-100",
                          "before:translate-x-[-120%] active:before:translate-x-[140%] group-focus-visible:before:translate-x-[140%]",
                          "transition-opacity duration-300",
                          "before:transition-transform before:duration-500",
                        ].join(" ")}
                      />

                      <div className="flex items-center gap-4">
                        {/* Badge chữ cái */}
                        <span
                          className={[
                            "grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold transition",
                            "motion-safe:duration-300 motion-safe:ease-out",
                            "group-hover:scale-[1.05]",
                            picked && !showResult
                              ? "border-indigo-500 bg-indigo-600 text-white dark:border-violet-500 dark:bg-violet-600"
                              : isCorrect
                                ? "border-emerald-500 bg-emerald-600 text-white"
                                : isWrongPicked
                                  ? "border-rose-500 bg-rose-600 text-white"
                                  : "border-slate-200 bg-white text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-neutral-200",
                          ].join(" ")}
                        >
                          {letterOf(idx)}
                        </span>

                        {/* Text đáp án */}
                        <span
                          className={[
                            "font-medium transition motion-safe:duration-300",
                            picked && !showResult
                              ? "text-indigo-900 dark:text-violet-200"
                              : isCorrect
                                ? "text-emerald-800 dark:text-emerald-200"
                                : isWrongPicked
                                  ? "text-rose-800 dark:text-rose-200"
                                  : "text-slate-900 dark:text-neutral-100",
                          ].join(" ")}
                        >
                          {a.answerText}
                        </span>
                      </div>

                      {/* Indicator: check */}
                      <span
                        className={[
                          "grid h-6 w-6 place-items-center rounded-full border text-xs font-bold transition-all",
                          "motion-safe:duration-300 motion-safe:ease-out",
                          picked && !showResult
                            ? "scale-100 opacity-100 border-indigo-500 bg-indigo-600 text-white dark:border-violet-500 dark:bg-violet-600"
                            : isCorrect
                              ? "scale-100 opacity-100 border-emerald-500 bg-emerald-600 text-white"
                              : isWrongPicked
                                ? "scale-100 opacity-100 border-rose-500 bg-rose-600 text-white"
                                : "scale-75 opacity-0 border-slate-200 bg-white text-transparent dark:border-white/10 dark:bg-white/5",
                        ].join(" ")}
                        aria-hidden
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={currentIdx === 0}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm backdrop-blur
                  ${
                    currentIdx === 0
                      ? "cursor-not-allowed opacity-60 border-slate-200 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400"
                      : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
                  }`}
                >
                  Quay lại
                </button>

                <button
                  onClick={goNext}
                  disabled={
                    showResult
                  } /* NEW: không cho bấm khi đang xem kết quả */
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold !text-white shadow-md active:translate-y-[1px] ${
                    showResult
                      ? "bg-slate-400 cursor-not-allowed"
                      : currentIdx === total - 1
                        ? "bg-emerald-600 hover:bg-emerald-500"
                        : "bg-sky-700 hover:bg-sky-600 dark:bg-violet-600 dark:hover:bg-violet-500"
                  }`}
                >
                  {showResult
                    ? "Đã chấm"
                    : currentIdx === total - 1
                      ? "Nộp bài"
                      : "Tiếp tục"}
                </button>
              </div>
            </section>

            {/* Right: Stats */}
            {showSidebar && (
              <aside className="space-y-4">
                <div
                  className={`rounded-2xl border p-5 backdrop-blur border-slate-200 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-100 ${panelShadow}`}
                >
                  <h3 className="mb-3 text-lg font-semibold">
                    Thống kê bài làm
                  </h3>

                  <div className="space-y-4">
                    <div className="rounded-xl border p-4 border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-100">
                      <div className="text-sm text-slate-500 dark:text-neutral-400">
                        Tiến độ hoàn thành
                      </div>
                      <div className="mt-1 text-xl font-semibold">
                        {showResult &&
                        typeof result?.totalCorrectAnswers === "number"
                          ? `Đúng ${result.totalCorrectAnswers}/${result.totalQuestions ?? total}`
                          : `${answeredCount}/${total} đã trả lời`}
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full transition-all bg-sky-600 dark:bg-violet-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border p-4 border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-100">
                      <div className="text-sm text-slate-500 dark:text-neutral-400">
                        Đi tới câu
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {data.questions.map((q, i) => {
                          const isCurrent = i === currentIdx;

                          // NEW: đánh dấu đúng/sai trên navigator khi xem kết quả
                          const r = findQResult(q.questionId);
                          const isAnyPicked = r?.answers?.some(
                            (a) => a.selectedByStudent,
                          );
                          const isCorrect = r?.answers?.every((a) =>
                            a.isCorrectAnswer
                              ? a.selectedByStudent
                              : !a.selectedByStudent,
                          ); // đúng nếu chọn đúng tất cả (đơn giản hoá)

                          return (
                            <button
                              key={q.questionId}
                              onClick={() => setCurrentIdx(i)}
                              aria-label={`Đi tới câu ${i + 1}`}
                              aria-current={isCurrent ? "page" : undefined}
                              className={[
                                "relative h-9 w-9 rounded-lg border text-sm font-medium transition",
                                isCurrent
                                  ? "bg-sky-700 !text-white border-transparent dark:bg-violet-600"
                                  : "border-slate-200 bg-white text-slate-800 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10",
                                showResult && isAnyPicked && !isCurrent
                                  ? isCorrect
                                    ? "ring-2 ring-emerald-400/70"
                                    : "ring-2 ring-rose-400/70"
                                  : "",
                              ].join(" ")}
                            >
                              {i + 1}
                              {showResult && isAnyPicked && !isCurrent && (
                                <span
                                  className={`absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold text-white ${
                                    isCorrect ? "bg-emerald-500" : "bg-rose-500"
                                  }`}
                                >
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </FadeInUp>
      </main>
    </div>
  );
}
