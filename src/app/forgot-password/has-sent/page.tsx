import { Suspense } from "react";
import SentPageClient from "./sent-page-client";

function SentPageFallback() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/15" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/15" />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#0000000d_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="relative z-10 max-w-md rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-slate-200/70 dark:ring-white/5 space-y-5">
        <div className="h-4 w-24 mx-auto rounded-full bg-slate-200 animate-pulse" />
        <div className="space-y-3">
          <div className="h-3 w-full rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3 w-3/4 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>
    </main>
  );
}

export default function SentPage() {
  return (
    <Suspense fallback={<SentPageFallback />}>
      <SentPageClient />
    </Suspense>
  );
}
