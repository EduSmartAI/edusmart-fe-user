"use client";

import VerificationSentCard from "./sent";

export default function SentPage() {


  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* nền gradient + hoa văn */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/15" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/15" />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#0000000d_1px,transparent_1px)] [background-size:20px_20px]" />

      <VerificationSentCard
        email={sessionStorage.getItem("justRegisteredEmail") || ""}
        backHref="/home"
        manageHref="/Register"
        brand="EduSmart"
        cooldownSec={30}
      />
    </main>
  );
}
