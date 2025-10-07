// app/quiz-result/page.tsx
export const dynamic = "force-dynamic"; // luôn SSR động
export const revalidate = 0;
import { Suspense } from "react";
import QuizResultClient from "./QuizResultClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{padding: 24, textAlign: "center"}}>Loading…</div>}>
      <QuizResultClient />
    </Suspense>
  );
}
