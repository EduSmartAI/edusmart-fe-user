import { Suspense } from "react";
import ChatHomePageClient from "./Client";

function ChatPageSuspenseFallback() {
  const heroLines = [280, 320, 260];
  const chips = ["Tối ưu cho sinh viên IT", "Cá nhân hóa lộ trình", "Giao diện tập trung"];
  const chatListSkeleton = Array.from({ length: 4 });

  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="flex h-full overflow-hidden bg-fixed bg-[radial-gradient(circle_at_top,_#dbeafe,_#eff6ff_40%,_#f9fafb_80%)] text-slate-900 transition-colors duration-300 dark:bg-[#030817] dark:bg-fixed dark:bg-[radial-gradient(circle_at_top,_rgba(25,118,210,0.12),_rgba(3,4,12,0.98)_65%,_#01030a_95%)] dark:text-slate-50">
        {/* left rail skeleton */}
        <div className="sticky top-0 flex h-screen w-14 flex-col items-center border-r border-slate-200/70 bg-white/90 px-1 py-3 text-slate-500 shadow-sm dark:border-slate-800/60 dark:bg-[#050a16]/90">
          <div className="h-9 w-9 rounded-full bg-slate-100/80 animate-pulse dark:bg-slate-800/70" />
          <div className="mt-6 flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-9 w-9 rounded-full bg-slate-100/70 animate-pulse dark:bg-slate-800/70"
              />
            ))}
          </div>
          <div className="mt-auto h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 opacity-70 animate-pulse" />
        </div>

        {/* main layout skeleton */}
        <div className="flex flex-1 min-h-0">
          {/* sidebar skeleton */}
          <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-slate-200/80 bg-white/85 p-3 text-sm dark:border-slate-800/60 dark:bg-[#050a16]/80 lg:flex">
            <div className="flex items-center justify-between px-1 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-400 via-sky-400 to-sky-500 opacity-70 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-24 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700" />
                  <div className="h-3 w-16 rounded-full bg-slate-200 animate-pulse dark:bg-slate-800" />
                </div>
              </div>
              <div className="h-6 w-12 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700" />
            </div>

            <div className="mt-3 h-9 rounded-full border border-slate-200 bg-white/80 px-3 animate-pulse dark:border-slate-700 dark:bg-slate-900/70" />

            <div className="mt-4 space-y-2 flex-1 overflow-hidden">
              <div className="flex items-center justify-between px-2 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                <div className="h-3 w-28 rounded-full bg-slate-200 animate-pulse dark:bg-slate-800" />
                <div className="h-3 w-3 rounded bg-slate-200 animate-pulse dark:bg-slate-800" />
              </div>
              <div className="space-y-2 px-1">
                {chatListSkeleton.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-12 rounded-lg border border-slate-200/70 bg-white/80 px-3 py-2 animate-pulse dark:border-slate-700 dark:bg-slate-900/60"
                  >
                    <div className="flex h-full items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-800" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="h-2 w-16 rounded-full bg-slate-100 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-slate-200/80 pt-3 dark:border-slate-800/80">
              <div className="flex items-center gap-2 px-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 opacity-70 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-24 rounded-full bg-slate-200 animate-pulse dark:bg-slate-800" />
                  <div className="h-2 w-12 rounded-full bg-slate-100 animate-pulse dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </aside>

          <main className="relative flex-1 overflow-x-hidden overflow-y-auto">
            <div className="pointer-events-none absolute inset-0 opacity-60 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_50%)]" />
            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-4 pb-10 pt-16 sm:px-6">
              <div className="inline-flex gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-1 shadow-sm animate-pulse dark:border-emerald-400/40 dark:bg-emerald-500/10">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="h-3 w-32 rounded-full bg-emerald-200 dark:bg-emerald-400/40" />
                <div className="h-3 w-12 rounded-full bg-emerald-200/70 dark:bg-emerald-400/30" />
              </div>

              <div className="mt-6 space-y-3">
                {heroLines.map((width, idx) => (
                  <div
                    key={idx}
                    className="h-7 rounded-full bg-white/70 shadow-sm animate-pulse dark:bg-slate-800/70"
                    style={{ width }}
                  />
                ))}
                <div className="mt-2 space-y-2">
                  <div className="h-4 rounded-full bg-slate-200/80 animate-pulse dark:bg-slate-800/70" />
                  <div className="h-4 rounded-full bg-slate-200/70 animate-pulse dark:bg-slate-800/60" />
                  <div className="h-4 rounded-full bg-slate-200/60 animate-pulse dark:bg-slate-800/50" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-lg animate-pulse dark:border-slate-800/70 dark:bg-slate-900/70"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-200/70 dark:bg-slate-800/60" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1">
                          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800/60" />
                          <div className="h-3 w-3/4 rounded-full bg-slate-100 dark:bg-slate-800/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((label) => (
                  <div
                    key={label}
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] text-slate-500 shadow-sm animate-pulse dark:border-slate-800/70 dark:bg-slate-900/70"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="mt-10 w-full max-w-2xl self-center rounded-full border border-slate-200 bg-white/90 px-4 py-3 shadow-[0_18px_45px_rgba(148,163,184,0.4)] animate-pulse dark:border-slate-800/70 dark:bg-slate-900/90">
                <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 flex gap-2">
                  <div className="h-6 flex-1 rounded-full bg-slate-100 dark:bg-slate-800/70" />
                  <div className="h-6 w-14 rounded-full bg-sky-400/70" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ChatHomePage() {
  return (
    <Suspense fallback={<ChatPageSuspenseFallback />}>
      <ChatHomePageClient />
    </Suspense>
  );
}

