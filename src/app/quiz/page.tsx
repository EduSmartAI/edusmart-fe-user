export const dynamic = "force-dynamic"; // luôn SSR động
export const revalidate = 0;
import React from "react";
import QuizMainFlow from "../../components/User/Quiz/QuizMainFlow";

export default function QuizPage() {
  return <QuizMainFlow />;
}
