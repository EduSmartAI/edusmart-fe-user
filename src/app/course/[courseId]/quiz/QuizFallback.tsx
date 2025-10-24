// app/(...)/[courseId]/quiz/QuizFallback.tsx
"use client";

import { Spin } from "antd";

export default function QuizFallback() {
  return (
    <div
      style={{
        minHeight: "40vh",
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
