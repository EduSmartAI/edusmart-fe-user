// app/quiz-result/page.tsx
import { Suspense } from "react";
import QuizResultClient from "./QuizResultClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{padding: 24, textAlign: "center"}}>Loading…</div>}>
      <QuizResultClient />
    </Suspense>
  );
}
