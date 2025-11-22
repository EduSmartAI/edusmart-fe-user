"use client";

import { ThemeSwitch } from "EduSmart/components/Themes/Theme";
import { useState, FormEvent, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import {
  FiPlus,
  FiMic,
  FiMessageCircle,
  FiChevronDown,
  FiSidebar,
  FiEdit3,
  FiSearch,
  FiUser,
  FiBookOpen,
  FiCheckCircle,
} from "react-icons/fi";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type MessageBubbleProps = {
  message: Message;
};

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const styles = useSpring({
    from: { opacity: 0, transform: "translateY(6px) scale(0.98)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { tension: 240, friction: 20 },
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <animated.div
        style={styles}
        className={`max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed ${
          isUser
            ? "bg-sky-500 text-white"
            : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
        }`}
      >
        {message.content}
      </animated.div>
    </div>
  );
}

export default function ChatHomePage() {
  const [prompt, setPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = prompt.trim();
    if (!question) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    const botMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content:
        "Đây là câu trả lời mẫu. Hãy nối API chatbot vào handleSubmit để trả về câu trả lời thật nhé. 👋",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setPrompt("");
  };

  // auto scroll xuống cuối khi có message mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length]);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const openSidebar = () => {
    if (!sidebarOpen) setSidebarOpen(true);
  };

  const railIconBase =
    "flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[17px] transition-colors duration-150 hover:border-slate-200/80 hover:bg-slate-100 active:scale-95 dark:hover:border-slate-700 dark:hover:bg-slate-800";

  const suggestionLabels = [
    "Gợi ý bài học theo lộ trình",
    "Giải thích lại khái niệm khó hiểu",
    "Tạo quiz ôn tập nhanh",
    "Tóm tắt nội dung buổi học",
  ];

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen w-full">
      {/* nền tổng */}
      <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#eff6ff_40%,_#f9fafb_80%)] text-slate-900 transition-colors duration-300 dark:bg-gradient-to-b dark:from-[#020617] dark:via-[#020617] dark:to-[#020617] dark:text-slate-50">
        {/* LEFT RAIL nhỏ luôn hiện */}
        <div className="sticky top-0 flex h-screen w-14 flex-col items-center border-r border-slate-200/70 bg-white/95 px-1 py-3 text-slate-500 shadow-sm dark:border-slate-800/80 dark:bg-[#050509] dark:text-slate-400">
          <button
            type="button"
            onClick={toggleSidebar}
            className={`${railIconBase} bg-slate-50/80 dark:bg-slate-900/70`}
            title={sidebarOpen ? "Thu gọn thanh bên" : "Mở thanh bên"}
          >
            <FiSidebar
              className={`transition-transform duration-200 ${
                sidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={openSidebar}
              className={railIconBase}
              title="Đoạn chat mới"
            >
              <FiEdit3 />
            </button>
            <button
              type="button"
              onClick={openSidebar}
              className={railIconBase}
              title="Tìm kiếm"
            >
              <FiSearch />
            </button>
            <button
              type="button"
              onClick={openSidebar}
              className={railIconBase}
              title="Chatbot"
            >
              <FiMessageCircle />
            </button>
          </div>

          <button
            type="button"
            className="mt-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 text-[13px] font-semibold text-slate-900 shadow-sm transition-transform duration-150 active:scale-95"
            title="Tài khoản"
          >
            <FiUser />
          </button>
        </div>

        {/* PHẦN CÒN LẠI: sidebar + main */}
        <div className="flex flex-1">
          {/* SIDEBAR LỚN */}
          <aside
            className={`sticky top-0 hidden h-screen flex-col border-r border-slate-200/80 bg-white/85 p-3 text-sm backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] dark:border-slate-800/80 dark:bg-[#050509]/80 lg:flex overflow-hidden
            ${
              sidebarOpen
                ? "w-64 translate-x-0 opacity-100"
                : "w-0 -translate-x-6 opacity-0 pointer-events-none"
            }`}
          >
            {/* header */}
            <div className="flex items-center justify-between px-1 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 via-sky-400 to-sky-500 text-xs font-semibold text-slate-900 shadow-sm">
                  E
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold leading-tight">
                    EduSmart AI
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400"
                  >
                    <span>Chatbot</span>
                    <FiChevronDown className="text-[10px]" />
                  </button>
                </div>
              </div>

              <ThemeSwitch />
            </div>

            {/* new chat */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium shadow-sm transition-all duration-150 hover:border-sky-400/80 hover:bg-sky-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-500 dark:hover:bg-slate-900/90"
              >
                <FiPlus className="text-[14px]" />
                <span>Đoạn chat mới</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>Tìm kiếm đoạn chat</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>Thư viện</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>Codex</span>
              </button>
            </div>

            {/* GPT section */}
            <div className="mt-2 space-y-1 rounded-xl p-1">
              <div className="px-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                GPT
              </div>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-all duration-150 hover:bg-slate-100/80 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">
                  Mới
                </span>
                <span>Khám phá</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>image generator</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>GPT API Key Assistance</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span>Tailwind UI Design Assistant</span>
              </button>
            </div>

            {/* Projects */}
            <div className="mt-2 space-y-1 rounded-xl p-1">
              <div className="px-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Dự án
              </div>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-all duration-150 hover:bg-slate-100/80 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] dark:border-slate-600">
                  +
                </span>
                <span>Dự án mới</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                <span>NA EmoEase Development</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>EdusmartAI</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-slate-500 transition-colors duration-150 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/70"
              >
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>NA System Design</span>
              </button>
            </div>

            {/* footer user */}
            <div className="mt-auto border-t border-slate-200/80 pt-3 dark:border-slate-800/80">
              <div className="flex items-center gap-2 px-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 text-[11px] font-medium text-slate-900">
                  DT
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium">Duy Anh Trần</span>
                  <span className="text-[11px] text-emerald-400">Plus</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main className="relative flex flex-1 justify-center">
            {/* radial glow cho dark mode */}
            <div className="pointer-events-none absolute inset-0 opacity-80 dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_65%)]" />

            {/* 2 layout: chưa chat & đã chat */}
            {!hasMessages ? (
              // ===== LANDING VIEW (chưa gõ chat) =====
              <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:pt-24">
                {/* HERO */}
                <section className="w-full space-y-5">
                  {/* badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-100/50 px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-sm dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>EduSmart Study Assistant</span>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      BETA
                    </span>
                  </div>

                  {/* title */}
                  <div className="space-y-1">
                    <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-[34px]">
                      <span className="bg-gradient-to-r from-emerald-400 via-sky-500 to-sky-600 bg-clip-text text-transparent">
                        Chúng ta học IT thông minh hơn
                      </span>
                      <br />
                      <span className="text-slate-900 dark:text-slate-50">
                        chứ không phải chăm hơn.
                      </span>
                    </h1>
                    <p className="max-w-xl text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                      EduSmart Chatbot giúp bạn tóm tắt bài, giải thích code,
                      tạo quiz ôn tập và gợi ý lộ trình học cá nhân hóa – ngay
                      trong một khung chat quen thuộc.
                    </p>
                  </div>

                  {/* feature cards */}
                  <div className="mt-4 grid max-w-4xl gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-[0_18px_35px_rgba(148,163,184,0.35)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                          <FiMessageCircle className="text-[18px]" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                            Hỏi bất kỳ điều gì
                          </div>
                          <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                            Từ giải thích khái niệm khó đến gợi ý cách học phù
                            hợp với tốc độ của bạn.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-[0_18px_35px_rgba(148,163,184,0.35)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                          <FiBookOpen className="text-[18px]" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                            Gắn với bài học
                          </div>
                          <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                            Kết nối trực tiếp với nội dung môn học và lộ trình
                            học hiện tại của bạn.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-[0_18px_35px_rgba(148,163,184,0.35)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-400">
                          <FiCheckCircle className="text-[18px]" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                            Quiz &amp; thực hành
                          </div>
                          <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                            Tạo quiz ôn tập nhanh, ví dụ thực tế, checklist
                            trước kỳ thi chỉ với một prompt.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* chips */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                      Tối ưu cho sinh viên IT
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                      Cá nhân hóa theo lộ trình học
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                      Giao diện tối giản, tập trung
                    </span>
                  </div>
                </section>

                {/* Ô CHAT landing */}
                <section className="mt-10 flex w-full justify-center">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl space-y-2"
                  >
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-2 py-2 shadow-[0_18px_40px_rgba(148,163,184,0.55)] backdrop-blur-md transition-all duration-150 focus-within:border-sky-400 focus-within:shadow-[0_20px_45px_rgba(56,189,248,0.45)] focus-within:ring-2 focus-within:ring-sky-300/70 dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_18px_50px_rgba(0,0,0,0.75)] dark:focus-within:border-sky-500 dark:focus-within:ring-sky-500/60">
                      <button
                        type="button"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-150 hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        aria-label="New chat"
                      >
                        <FiPlus className="text-[15px]" />
                      </button>

                      <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Hỏi bất kỳ điều gì để bắt đầu"
                        className="flex-1 bg-transparent text-[14px] text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50 dark:placeholder:text-slate-500"
                      />

                      <button
                        type="button"
                        className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-150 hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 sm:flex"
                        aria-label="Voice input"
                      >
                        <FiMic className="text-[16px]" />
                      </button>

                      <button
                        type="submit"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/60 transition-all duration-150 hover:bg-sky-400 hover:shadow-sky-400/70 active:scale-95"
                        aria-label="Send"
                      >
                        <FiMessageCircle className="text-[16px]" />
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestionLabels.map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setPrompt(label)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600 shadow-sm transition-all duration-150 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-sky-500 dark:hover:bg-slate-900/80 dark:hover:text-sky-300"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </form>
                </section>
              </div>
            ) : (
              // ===== CHAT VIEW (sau khi đã gửi chat) =====
              <div className="relative z-10 mx-auto flex w-full max-w-5xl min-h-screen flex-col px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
                {/* messages */}
                <section className="flex-1 space-y-3 pb-6 pt-2 text-[13px] overflow-y-auto">
                  {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))}
                  <div ref={messagesEndRef} />
                </section>

                {/* INPUT sticky đáy */}
                <section className="sticky bottom-0 flex w-full flex-col items-center border-t border-slate-200/60 bg-gradient-to-t from-slate-50/95 via-slate-50/90 to-transparent pb-3 pt-3 dark:border-slate-800/80 dark:from-[#020617]/95 dark:via-[#020617]/90 dark:to-transparent">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl space-y-2"
                  >
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-2 py-2 shadow-[0_18px_40px_rgba(148,163,184,0.55)] backdrop-blur-md transition-all duration-150 focus-within:border-sky-400 focus-within:shadow-[0_20px_45px_rgba(56,189,248,0.45)] focus-within:ring-2 focus-within:ring-sky-300/70 dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_18px_50px_rgba(0,0,0,0.75)] dark:focus-within:border-sky-500 dark:focus-within:ring-sky-500/60">
                      <button
                        type="button"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-150 hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        aria-label="New chat"
                      >
                        <FiPlus className="text-[15px]" />
                      </button>

                      <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Hỏi bất kỳ điều gì để bắt đầu"
                        className="flex-1 bg-transparent text-[14px] text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50 dark:placeholder:text-slate-500"
                      />

                      <button
                        type="button"
                        className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-150 hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 sm:flex"
                        aria-label="Voice input"
                      >
                        <FiMic className="text-[16px]" />
                      </button>

                      <button
                        type="submit"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/60 transition-all duration-150 hover:bg-sky-400 hover:shadow-sky-400/70 active:scale-95"
                        aria-label="Send"
                      >
                        <FiMessageCircle className="text-[16px]" />
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestionLabels.map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setPrompt(label)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600 shadow-sm transition-all duration-150 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-sky-500 dark:hover:bg-slate-900/80 dark:hover:text-sky-300"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </form>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
