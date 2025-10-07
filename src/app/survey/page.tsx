"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SurveyMainFlow } from "EduSmart/components/User/Survey";

export default function SurveyPage() {
  const router = useRouter();

  const handleSurveyComplete = () => {
    console.log("Survey completed!");
    // Sau khi hoàn thành survey, chuyển sang màn hình chuyển giao
    router.push("/survey-to-quiz-transition");
  };

  const handleBack = () => {
    router.push("/home");
  };

  return (
    <SurveyMainFlow onComplete={handleSurveyComplete} onBack={handleBack} />
  );
}
