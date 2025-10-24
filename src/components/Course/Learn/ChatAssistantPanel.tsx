"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Card, Input, Tag, Tooltip, Spin } from "antd";
import {
  SendOutlined,
  StopOutlined,
  ReloadOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import type {
  AIChatBotResponse,
  ChatHistoryItem,
} from "EduSmart/api/api-ai-service";
import { useCourseStore } from "EduSmart/stores/course/courseStore";
import MarkdownMessage from "EduSmart/components/MarkDown/MarkdownMessage";

type Role = "user" | "assistant" | "system";
type Msg = { id: string; role: Role; content: string };

export type ChatAssistantPanelProps = {
  courseId?: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  videoTimeSec?: number;
  showQuickPrompts?: boolean;
  ask?: (payload: {
    messages: { role: Role; content: string }[];
    context: Record<string, unknown>;
    signal?: AbortSignal;
  }) => Promise<string>;
  defaultOpen?: boolean;
  maxHeightPx?: number;
};

const THINKING_TOKEN = "__thinking__";

function rid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatAssistantPanel({
  courseId,
  courseTitle,
  lessonId,
  lessonTitle,
  videoTimeSec,
  showQuickPrompts = true,
  defaultOpen = true,
  maxHeightPx = 360,
  ask,
}: ChatAssistantPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: rid(),
      role: "assistant",
      content:
        "Chào bạn! Mình là trợ giảng AI. Mình có thể tóm tắt bài, giải thích khái niệm, tạo câu hỏi luyện tập, hoặc giải đáp thắc mắc về đoạn video đang xem.",
    },
  ]);

  const controllerRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const thinkingIdRef = useRef<string | null>(null);

  // lấy hàm gọi API từ store
  const aiChatBotsCreate = useCourseStore((s) => s.aiChatBotsCreate);

  // id riêng cho textarea để chủ động focus
  const textAreaId = useMemo(() => `ai-assistant-ta-${rid()}`, []);

  const context = useMemo(
    () => ({
      courseId,
      courseTitle,
      lessonId,
      lessonTitle,
      videoTimeSec,
      source: "CourseVideoSidebar",
    }),
    [courseId, courseTitle, lessonId, lessonTitle, videoTimeSec],
  );

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const focusTextarea = useCallback(() => {
    const node = document.getElementById(
      textAreaId,
    ) as HTMLTextAreaElement | null;
    if (node) {
      node.focus();
      const len = node.value.length;
      node.setSelectionRange(len, len);
    }
  }, [textAreaId]);

  useEffect(() => {
    if (open) requestAnimationFrame(focusTextarea);
  }, [open, focusTextarea]);

  useEffect(() => {
    if (!sending && open) requestAnimationFrame(focusTextarea);
  }, [sending, open, focusTextarea]);

  // 🔁 Map FE messages -> BE ChatHistoryItem
  const toHistory = (
    msgs: { role: Role; content: string }[],
  ): ChatHistoryItem[] =>
    msgs.map((m) => ({
      role: m.role as ChatHistoryItem["role"],
      content: m.content,
    }));

  // ✅ defaultAsk dùng AI ChatBots API từ store + hỗ trợ Abort
  const defaultAsk = async ({
    messages,
    signal,
  }: {
    messages: { role: Role; content: string }[];
    context: Record<string, unknown>;
    signal?: AbortSignal;
  }) => {
    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const history = toHistory(messages);

    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const res = (await Promise.race([
      aiChatBotsCreate(lastUser, history, lessonId),
      new Promise((_, reject) =>
        signal?.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        ),
      ),
    ])) as AIChatBotResponse;

    const answer =
      res.response?.reply ??
      res.message ??
      "Xin lỗi, mình chưa nhận được phản hồi từ AI.";

    return String(answer);
  };

  const doAsk = ask ?? defaultAsk;

  const addThinkingBubble = () => {
    const id = rid();
    thinkingIdRef.current = id;
    const placeholder: Msg = { id, role: "assistant", content: THINKING_TOKEN };
    setMessages((m) => [...m, placeholder]);
  };

  const replaceThinkingBubble = (finalContent: string) => {
    const id = thinkingIdRef.current;
    if (!id) {
      // nếu vì lý do nào đó không có placeholder, thêm mới
      setMessages((m) => [
        ...m,
        { id: rid(), role: "assistant", content: finalContent },
      ]);
      return;
    }
    setMessages((m) =>
      m.map((msg) => (msg.id === id ? { ...msg, content: finalContent } : msg)),
    );
    thinkingIdRef.current = null;
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    const userMsg: Msg = { id: rid(), role: "user", content };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    // thêm bubble "đang suy nghĩ…"
    addThinkingBubble();

    const abort = new AbortController();
    controllerRef.current = abort;

    try {
      const answer = await doAsk({
        messages: [...messages, userMsg].map(({ role, content }) => ({
          role,
          content,
        })),
        context,
        signal: abort.signal,
      });

      replaceThinkingBubble(answer);
    } catch (err: unknown) {
      let text: string;
      if (err instanceof DOMException && err.name === "AbortError") {
        text = "⏹️ Đã dừng phản hồi.";
      } else if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        text = `⚠️ Có lỗi khi gọi AI: ${(err as { message?: string }).message}`;
      } else {
        text = `⚠️ Có lỗi khi gọi AI: Unknown error`;
      }
      replaceThinkingBubble(text);
    } finally {
      setSending(false);
      controllerRef.current = null;
    }
  };

  const stop = () => controllerRef.current?.abort();

  const clear = () => {
    setMessages([
      {
        id: rid(),
        role: "assistant",
        content:
          "Đã xoá hội thoại. Hỏi mình bất cứ điều gì về bài học này nhé!",
      },
    ]);
    setInput("");
    requestAnimationFrame(focusTextarea);
  };

  const quickPrompts = [
    "Tóm tắt nhanh nội dung bài đang học.",
    "Giải thích đơn giản khái niệm chính trong bài.",
    "Tạo 5 câu hỏi trắc nghiệm ôn tập kèm đáp án.",
    "Cho ví dụ áp dụng kiến thức vào thực tế.",
  ];

  return (
    <Card
      size="small"
      className="rounded-xl border-neutral-200/70 dark:border-neutral-800/60 shadow-sm"
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined />
          <span className="font-semibold">AI Assistant</span>
          <Tag color="purple" className="m-0">
            Beta
          </Tag>
        </div>
      }
      extra={
        <div className="flex items-center gap-2">
          <Tooltip title={open ? "Thu gọn" : "Mở khung chat"}>
            <Button size="small" type="text" onClick={() => setOpen((o) => !o)}>
              {open ? "Hide" : "Show"}
            </Button>
          </Tooltip>
          <Tooltip title="Xoá hội thoại">
            <Button
              size="small"
              type="text"
              icon={<ClearOutlined />}
              onClick={clear}
            />
          </Tooltip>
        </div>
      }
    >
      {open && (
        <div className="flex flex-col gap-3">
          {/* danh sách tin nhắn */}
          <div
            ref={scrollRef}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 p-2 overflow-y-auto"
            style={{ maxHeight: maxHeightPx }}
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-white/80 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 backdrop-blur"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                    {m.role === "user" ? (
                      <>
                        <UserOutlined /> Bạn
                      </>
                    ) : (
                      <>
                        <RobotOutlined /> Trợ giảng
                      </>
                    )}
                  </div>

                  {/* nội dung: nếu là THINKING_TOKEN thì hiển thị Spin */}
                  {m.content === THINKING_TOKEN ? (
                    <div className="flex items-center gap-2 py-1">
                      <Spin size="small" />
                      <span>Trợ giảng đang suy nghĩ…</span>
                    </div>
                  ) : (
                    <div className="leading-6">
                      <MarkdownMessage
                        text={m.content}
                        typingSpeedMs={m.role === "assistant" ? 12 : 0}
                        step={2}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* gợi ý nhanh */}
          {showQuickPrompts && messages.length <= 2 && (
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((q) => (
                <Button
                  key={q}
                  size="small"
                  type="default"
                  onClick={() => {
                    setInput(q);
                    requestAnimationFrame(focusTextarea);
                  }}
                  className="rounded-full border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:!border-violet-400"
                >
                  {q}
                </Button>
              ))}
            </div>
          )}

          {/* Ô nhập */}
          <div className="relative">
            <Input.TextArea
              id={textAreaId}
              value={input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi cho AI… (Enter để gửi, Shift+Enter xuống dòng)"
              autoSize={{ minRows: 2, maxRows: 6 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              readOnly={sending} // giữ focus khi đang gửi
              aria-disabled={sending}
              className="!rounded-2xl !pr-24 !py-3 !text-[14px] !bg-white dark:!bg-neutral-900/70 !border-neutral-200 dark:!border-neutral-700 focus:!border-violet-500 focus:!ring-2 focus:!ring-violet-500/25"
            />

            <div className="pointer-events-auto absolute right-2 bottom-2 flex gap-2">
              <Tooltip title="Gửi">
                <Button
                  type="primary"
                  shape="round"
                  icon={<SendOutlined />}
                  onMouseDown={(e) => e.preventDefault()} // tránh cướp focus
                  onClick={() => send()}
                  disabled={!input.trim() || sending}
                  className="shadow-sm"
                />
              </Tooltip>

              {sending ? (
                <Tooltip title="Dừng phản hồi">
                  <Button
                    shape="round"
                    icon={<StopOutlined />}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={stop}
                    danger
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Làm mới prompt">
                  <Button
                    shape="round"
                    icon={<ReloadOutlined />}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setInput("");
                      requestAnimationFrame(focusTextarea);
                    }}
                  />
                </Tooltip>
              )}
            </div>

            <div className="mt-1 text-[11px] text-neutral-500">
              Enter để gửi • Shift+Enter để xuống dòng
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
