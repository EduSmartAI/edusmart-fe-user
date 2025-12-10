"use client";

import { ThemeSwitch } from "EduSmart/components/Themes/Theme";
import {
  useState,
  FormEvent,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AssistantMarkdownContent,
  assistantMessageClasses,
} from "EduSmart/components/MarkDown/AssistantMarkdownMessage";
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
  FiHome,
} from "react-icons/fi";
import { Drawer, Spin, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { getLearningPathAction } from "EduSmart/app/(learning-path)/learningPathAction";
import type { LearningPathData } from "EduSmart/app/(learning-path)/learningPathAction";
import LearningPathsCarousel from "EduSmart/components/AiChat/LearningPathsCarousel";
import {
  aiChatBotsChatWithAiLearningPathCreate,
  aiChatBotsLearningPathList,
  aiChatBotsLearningPathDetailList,
} from "EduSmart/app/apiServer/Ai/aiAction";
import { getAllLearningPathsAction } from "EduSmart/app/(learning-path)/learningPathAction";
import type { ChatSummaryDto, ChatHistoryLearningPathItemDto } from "EduSmart/api/api-ai-service";
import type { LearningPathSelectAllDto } from "EduSmart/api/api-student-service";
import { ChatBotRawReason } from "EduSmart/enum/enum";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  isTyping?: boolean;
  rawFinishReason?: string;
  learningPaths?: LearningPathSelectAllDto[];
};

const userMessageClasses =
  "max-w-[75%] sm:max-w-[65%] whitespace-pre-wrap break-words rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 px-4 pt-1 my-2 text-[15px] sm:text-[16px] leading-relaxed text-white shadow-lg shadow-sky-500/40";
// Loading Skeleton Component for messages
function LoadingSkeleton() {
  return (
    <div className="flex w-full justify-center">
      <div className={`${assistantMessageClasses} animate-pulse`}>
        <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-11/12 rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
          <div className="h-3 w-10/12 rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
          <div className="h-3 w-9/12 rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
        </div>
      </div>
    </div>
  );
}

// Chat List Skeleton Component
function ChatListSkeleton() {
  const widths = [70, 85, 65]; // Fixed widths for skeleton items
  return (
    <div className="space-y-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex w-full items-center px-2 py-2 animate-pulse"
        >
          <div 
            className="h-4 rounded bg-slate-200 dark:bg-slate-700" 
            style={{ width: `${widths[i - 1]}%` }} 
          />
        </div>
      ))}
    </div>
  );
}

// Typing Effect Component
function TypingMessage({ 
  content, 
  onComplete,
  onTypingUpdate
}: { 
  content: string; 
  onComplete?: () => void;
  onTypingUpdate?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        // Trigger scroll update on each character (but throttle it)
        if (onTypingUpdate && (currentIndex % 3 === 0 || currentIndex === content.length - 1)) {
          // Scroll every 3 characters and on last character
          requestAnimationFrame(() => {
            onTypingUpdate();
          });
        }
      }, 20); // Tốc độ typing (20ms mỗi ký tự)

      return () => clearTimeout(timeout);
    } else if (currentIndex === content.length && onComplete) {
      // Typing completed, remove typing state
      onComplete();
      // Final scroll when typing completes
      if (onTypingUpdate) {
        requestAnimationFrame(() => {
          setTimeout(() => onTypingUpdate(), 50);
          setTimeout(() => onTypingUpdate(), 200);
        });
      }
    }
  }, [currentIndex, content, onComplete, onTypingUpdate]);

  const styles = useSpring({
    from: { opacity: 0, transform: "translateY(6px) scale(0.98)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { tension: 240, friction: 20 },
  });

  return (
    <div className="flex w-full justify-center">
      <animated.div
        style={styles}
        className={`${assistantMessageClasses} whitespace-pre-line`}
      >
        {displayedText}
        {currentIndex < content.length && (
          <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-slate-500 dark:bg-slate-300" />
        )}
      </animated.div>
    </div>
  );
}

function MessageBubble({ 
  message, 
  onTypingComplete,
  onScrollUpdate,
  onLearningPathClick,
}: { 
  message: Message; 
  onTypingComplete?: (messageId: number) => void;
  onScrollUpdate?: () => void;
  onLearningPathClick?: (pathId: string, pathName?: string) => void;
}) {
  const isUser = message.role === "user";

  const styles = useSpring({
    from: { opacity: 0, transform: "translateY(6px) scale(0.98)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { tension: 240, friction: 20 },
  });

  // Show loading skeleton
  if (message.isLoading) {
    return <LoadingSkeleton />;
  }

  // Show typing effect for assistant messages
  if (message.isTyping && !isUser) {
    return (
      <TypingMessage 
        content={message.content} 
        onComplete={() => onTypingComplete?.(message.id)}
        onTypingUpdate={onScrollUpdate}
      />
    );
  }

  return (
    <div className={`flex w-full flex-col ${isUser ? "items-end" : "items-start"}`}>
      <animated.div
        style={styles}
        className={isUser ? userMessageClasses : assistantMessageClasses}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <AssistantMarkdownContent content={message.content} />
        )}
      </animated.div>
      {/* Learning Paths Carousel */}
      {!isUser && message.learningPaths && message.learningPaths.length > 0 && (
        <LearningPathsCarousel 
          learningPaths={message.learningPaths}
          onPathClick={onLearningPathClick}
        />
      )}
    </div>
  );
}


function ChatHomePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(
    searchParams.get("sessionId")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatList, setChatList] = useState<ChatSummaryDto[]>([]);
  const [isLoadingChatList, setIsLoadingChatList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [newChatLoadingId, setNewChatLoadingId] = useState<string | null>(null);
  const [isChatListExpanded, setIsChatListExpanded] = useState(true);
  const mobileOverlayTransition = useTransition(isMobileSidebarOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 240, friction: 26 },
  });
  const mobileSidebarTransition = useTransition(isMobileSidebarOpen, {
    from: { opacity: 0, transform: "translateX(-18px) scale(0.98)" },
    enter: { opacity: 1, transform: "translateX(0px) scale(1)" },
    leave: { opacity: 0, transform: "translateX(-18px) scale(0.98)" },
    config: { tension: 280, friction: 28 },
  });
  const isDesktopViewport = () =>
    typeof window !== "undefined" && window.innerWidth >= 1024;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLElement | null>(null);
  const scrollAnimationFrame = useRef<number | null>(null);
  const lastLoadedSessionRef = useRef<string | null>(null);
  const hasMessages = messages.length > 0;
  const shouldShowChatView = hasMessages || isLoadingDetail || !!sessionId;

  // Learning Path Detail Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [pathDetailLoading, setPathDetailLoading] = useState(false);
  const [pathDetailData, setPathDetailData] = useState<LearningPathData | null>(null);
  const [pathDetailError, setPathDetailError] = useState<string | null>(null);

  // Listen for drawer open events
  useEffect(() => {
    const handleOpenDrawer = (event: CustomEvent<{ pathId: string }>) => {
      const { pathId } = event.detail;
      setSelectedPathId(pathId);
      setDrawerOpen(true);
      setPathDetailError(null);
      setPathDetailData(null);
    };

    window.addEventListener('openLearningPathDrawer', handleOpenDrawer as EventListener);
    return () => {
      window.removeEventListener('openLearningPathDrawer', handleOpenDrawer as EventListener);
    };
  }, []);

  // Fetch learning path detail when drawer opens
  useEffect(() => {
    if (drawerOpen && selectedPathId) {
      const fetchDetail = async () => {
        setPathDetailLoading(true);
        setPathDetailError(null);
        try {
          const result = await getLearningPathAction(selectedPathId);
          if (result.ok) {
            setPathDetailData(result.data);
          } else {
            setPathDetailError(result.error || "Không thể tải chi tiết lộ trình");
          }
        } catch (err) {
          setPathDetailError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        } finally {
          setPathDetailLoading(false);
        }
      };
      fetchDetail();
    }
  }, [drawerOpen, selectedPathId]);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPathId(null);
    setPathDetailData(null);
    setPathDetailError(null);
  };

  // Handle learning path click - điền ID vào input chat
  const handleLearningPathClick = useCallback((pathId: string, pathName?: string) => {
    // Tạo prompt với ID để chatbot có thể xác định chính xác lộ trình
    const promptText = pathName 
      ? `Chi tiết về lộ trình "${pathName}" (ID: ${pathId})`
      : `Chi tiết về lộ trình học tập (ID: ${pathId})`;
    
    setPrompt(promptText);
    
    // Focus vào input field sau khi set prompt và scroll đến input
    setTimeout(() => {
      const inputElement = document.querySelector('input[placeholder*="Hỏi bất kỳ"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        // Scroll đến input một cách mượt mà
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  const loadChatList = useCallback(async (showSkeleton = false) => {
    if (showSkeleton) {
      setIsLoadingChatList(true);
    }
    try {
      const result = await aiChatBotsLearningPathList();
      if (result.data?.success && result.data.response) {
        setChatList(result.data.response);
        setNewChatLoadingId(null); // Clear loading state after data loaded
      }
    } catch (error) {
      console.error("Error loading chat list:", error);
    } finally {
      if (showSkeleton) {
        setIsLoadingChatList(false);
      }
    }
  }, []);

  const loadChatDetail = useCallback(async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const result = await aiChatBotsLearningPathDetailList(id);
      if (result.data?.success && result.data.response) {
        const chatDetail = result.data.response;
        if (chatDetail.messages) {
          const formattedMessages: Message[] = await Promise.all(
            chatDetail.messages.map(async (msg: ChatHistoryLearningPathItemDto, index: number) => {
              const message: Message = {
                id: Date.now() + index,
                role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
                content: msg.content || "",
                rawFinishReason: msg.rawFinishReason,
              };

              // If this message has GetAllLearningPath reason, fetch learning paths
              if (msg.rawFinishReason === ChatBotRawReason.GetAllLearningPath) {
                try {
                  const learningPathsResult = await getAllLearningPathsAction(0, 1000);
                  if (learningPathsResult.ok && learningPathsResult.data?.data) {
                    message.learningPaths = learningPathsResult.data.data;
                  }
                } catch (error) {
                  console.error("Error fetching learning paths for history:", error);
                }
              }

              return message;
            })
          );
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error("Error loading chat detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // Load chat list on component mount (load all chats)
  useEffect(() => {
    loadChatList(true); // Show skeleton on initial load
  }, [loadChatList]);

  // Sync sessionId with URL param and fetch detail when it changes
  useEffect(() => {
    const urlSessionId = searchParams.get("sessionId");

    if (urlSessionId) {
      setSessionId((prev) => (prev === urlSessionId ? prev : urlSessionId));

      if (lastLoadedSessionRef.current !== urlSessionId) {
        lastLoadedSessionRef.current = urlSessionId;
        loadChatDetail(urlSessionId);
      }
    } else {
      setSessionId((prev) => (prev === null ? prev : null));
      setMessages([]);
      lastLoadedSessionRef.current = null;
    }
  }, [searchParams, loadChatDetail]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = prompt.trim();
    if (!question) return;

    setIsLoading(true);

    // Generate new UUID for sessionId if this is a new chat
    const isNewChat = !sessionId;
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      setSessionId(currentSessionId);
      // Update URL immediately with new sessionId
      router.push(`/chat/ai?sessionId=${currentSessionId}`);
    }

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    // Add loading skeleton for assistant response
    const loadingMsgId = Date.now() + 1;
    const loadingMsg: Message = {
      id: loadingMsgId,
      role: "assistant",
      content: "",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setPrompt("");
    scrollToBottom(true);

    try {
      const result = await aiChatBotsChatWithAiLearningPathCreate(
        question,
        currentSessionId
      );

      console.log("Full API Response:", JSON.stringify(result, null, 2));
      console.log("Response data:", result.data);
      console.log("Response success:", result.data?.success);
      console.log("Response response:", result.data?.response);
      console.log("Response reply:", result.data?.response?.reply);

      // Check if we have a reply in the response (prioritize reply over success flag)
      const reply = result.data?.response?.reply;
      const rawFinishReason = result.data?.response?.rawFinishReason;
      
      if (reply !== undefined && reply !== null && reply !== "") {
        // Check if we need to fetch learning paths
        let learningPaths: LearningPathSelectAllDto[] | undefined;
        if (rawFinishReason === ChatBotRawReason.GetAllLearningPath) {
          try {
            const learningPathsResult = await getAllLearningPathsAction(0, 1000);
            if (learningPathsResult.ok && learningPathsResult.data?.data) {
              learningPaths = learningPathsResult.data.data;
            }
          } catch (error) {
            console.error("Error fetching learning paths:", error);
          }
        }

        // Replace loading skeleton with typing message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMsgId
              ? {
                  id: loadingMsgId,
                  role: "assistant" as const,
                  content: reply,
                  isTyping: true,
                  rawFinishReason: rawFinishReason,
                  learningPaths: learningPaths,
                }
              : msg
          )
        );
        
        // Scroll after updating to typing message
        scrollToBottom();

        // Only reload chat list when creating a new chat (first message)
        if (isNewChat) {
          // Add skeleton item to chat list (only if we already have data)
          if (chatList.length > 0) {
            setNewChatLoadingId(currentSessionId);
            setChatList((prev) => [
              {
                id: currentSessionId,
                name: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messageCount: 0,
              } as ChatSummaryDto,
              ...prev,
            ]);
          }
          
          // Load chat list to get real data (without showing full skeleton)
          await loadChatList(false);
        }
      } else {
        // No valid reply found - replace loading with error
        const errorMessage = result.data?.message || result.data?.detailErrors?.[0]?.errorMessage || "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMsgId
              ? {
                  id: loadingMsgId,
                  role: "assistant" as const,
                  content: errorMessage,
                }
              : msg
          )
        );
        console.error("No valid reply in response:", result);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Replace loading with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? {
                id: loadingMsgId,
                role: "assistant" as const,
                content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setPrompt("");
    router.push("/chat/ai");
  };

  const handleChatClick = (chatId: string) => {
    if (chatId) {
      setSessionId(chatId);
      router.push(`/chat/ai?sessionId=${chatId}`);
      loadChatDetail(chatId);
      if (!isDesktopViewport()) {
        setIsMobileSidebarOpen(false);
      }
    }
  };

  // Function to scroll to bottom - improved version
  const scrollToBottom = (force = false) => {
    if (typeof window === "undefined") return;

    if (scrollAnimationFrame.current !== null) {
      window.cancelAnimationFrame(scrollAnimationFrame.current);
    }

    scrollAnimationFrame.current = window.requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      const endMarker = messagesEndRef.current;

      if (container) {
        if (force) {
          container.scrollTop = container.scrollHeight;
        } else {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      }

      if (endMarker) {
        endMarker.scrollIntoView({
          behavior: force ? "auto" : "smooth",
          block: "end",
          inline: "nearest",
        });
      }

      scrollAnimationFrame.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (scrollAnimationFrame.current !== null && typeof window !== "undefined") {
        window.cancelAnimationFrame(scrollAnimationFrame.current);
      }
    };
  }, []);

  // auto scroll xuống cuối khi có message mới hoặc khi typing
  useLayoutEffect(() => {
    if (!messages.length || isLoadingDetail) return;
    scrollToBottom(true);
  }, [messages, isLoadingDetail]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isDesktopViewport()) {
      setSidebarOpen((v) => !v);
    } else {
      setIsMobileSidebarOpen((v) => !v);
    }
  };

  const openSidebar = () => {
    if (isDesktopViewport()) {
      if (!sidebarOpen) setSidebarOpen(true);
    } else if (!isMobileSidebarOpen) {
      setIsMobileSidebarOpen(true);
    }
  };

  const railIconBase =
    "flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[17px] transition-colors duration-150 hover:border-slate-200/80 hover:bg-slate-100 active:scale-95 dark:hover:border-slate-700 dark:hover:bg-slate-800";

  const suggestionLabels = [
    "Gợi ý bài học theo lộ trình",
    "Giải thích lại khái niệm khó hiểu",
    "Tạo quiz ôn tập nhanh",
    "Tóm tắt nội dung buổi học",
  ];

  const renderSidebarContent = () => (
    <>
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
          onClick={handleNewChat}
          className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium shadow-sm transition-all duration-150 hover:border-sky-400/80 hover:bg-sky-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-500 dark:hover:bg-slate-900/90"
        >
          <FiPlus className="text-[14px]" />
          <span>Đoạn chat mới</span>
        </button>
      </div>

      {/* Chat History List */}
      <div className="chat-sidebar-scroll mt-4 overflow-y-auto pr-1 pb-5 flex-1 min-h-0">
        <button
          type="button"
          onClick={() => setIsChatListExpanded(!isChatListExpanded)}
          className="flex w-full items-center justify-between px-2 py-2 text-[13px] font-medium text-slate-900 dark:text-slate-50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors rounded"
        >
          <span>Các đoạn chat của bạn</span>
          <FiChevronDown 
            className={`text-[12px] text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
              isChatListExpanded ? "" : "-rotate-90"
            }`}
          />
        </button>
        {isChatListExpanded && (
          <>
            {isLoadingChatList ? (
              <div className="px-2">
                <ChatListSkeleton />
              </div>
            ) : chatList.length > 0 ? (
              <div className="space-y-2 px-2">
                {chatList.map((chat) => {
                  // Show skeleton for loading item
                  if (chat.id === newChatLoadingId) {
                    return (
                      <div
                        key={chat.id}
                        className="flex w-full items-center gap-2 px-2 py-2 animate-pulse"
                      >
                        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                      </div>
                    );
                  }
                  
                  const isActive = chat.id === sessionId;
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => chat.id && handleChatClick(chat.id)}
                      className={`group flex w-full items-center gap-2 rounded-md border px-2 py-2.5 text-[13px] text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 active:scale-[0.99] ${
                        isActive
                          ? "border-sky-300/80 bg-sky-50/70 text-slate-900 shadow-sm dark:border-sky-500/60 dark:bg-sky-500/10 dark:text-slate-50"
                          : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <span
                        className={`inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-semibold uppercase transition-colors duration-200 ${
                          isActive
                            ? "bg-sky-500/90 text-white shadow-sky-500/40 shadow"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {chat.name?.slice(0, 1)?.toUpperCase() || "L"}
                      </span>
                      <span className="truncate flex-1">
                        {chat.name || `Chat ${chat.messageCount || 0} tin nhắn`}
                      </span>
                      <span
                        className={`text-[11px] font-medium transition-colors ${
                          isActive
                            ? "text-sky-500 dark:text-sky-300"
                            : "text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300"
                        }`}
                      >
                        {chat.messageCount ?? 0} tin
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-3 text-[12px] text-slate-500 dark:text-slate-400">
                Chưa có chat nào
              </div>
            )}
          </>
        )}
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
    </>
  );

  return (
    <>
    <div className="h-screen w-full overflow-hidden">
      {/* nền tổng */}
      <div className="flex h-full overflow-hidden bg-fixed bg-[radial-gradient(circle_at_top,_#dbeafe,_#eff6ff_40%,_#f9fafb_80%)] text-slate-900 transition-colors duration-300 dark:bg-[#030817] dark:bg-fixed dark:bg-[radial-gradient(circle_at_top,_rgba(25,118,210,0.12),_rgba(3,4,12,0.98)_65%,_#01030a_95%)] dark:text-slate-50">
        {/* LEFT RAIL nhỏ luôn hiện */}
        <div className="sticky top-0 flex h-screen w-14 flex-col items-center border-r border-slate-200/70 bg-white/95 px-1 py-3 text-slate-500 shadow-sm dark:border-slate-800/60 dark:bg-[#050a16]/90 dark:text-slate-400">
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
        <div className="flex flex-1 min-h-0">
          {mobileOverlayTransition((styles, item) =>
            item ? (
              <animated.div
                style={styles}
                className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            ) : null
          )}
          {mobileSidebarTransition((styles, item) =>
            item ? (
              <animated.div
                style={styles}
                className="fixed inset-y-0 left-14 z-40 flex h-full w-64 max-w-[calc(100vw-3.5rem)] flex-col overflow-hidden rounded-r-2xl border border-slate-200/80 bg-white/95 p-3 text-sm shadow-2xl dark:border-slate-800/80 dark:bg-[#050a16]/95 lg:hidden"
              >
                {renderSidebarContent()}
              </animated.div>
            ) : null
          )}

          {/* SIDEBAR LỚN */}
          <aside
            className={`sticky top-0 hidden h-screen flex-col text-sm backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] lg:flex overflow-hidden
            ${
              sidebarOpen
                ? "w-64 translate-x-0 opacity-100 border-r border-slate-200/80 bg-white/85 p-3 dark:border-slate-800/60 dark:bg-[#050a16]/80"
                : "w-0 -translate-x-6 opacity-0 pointer-events-none border-r border-transparent bg-transparent p-0 dark:border-transparent dark:bg-transparent"
            }`}
          >
            {renderSidebarContent()}
          </aside>

          {/* MAIN */}
          <main
            ref={messagesContainerRef}
            className="relative flex-1 overflow-x-hidden overflow-y-auto chat-main-scroll"
          >
            {/* radial glow cho dark mode */}
            <div className="pointer-events-none absolute inset-0 opacity-70 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_50%)]" />

            {/* back to home */}
            <div className="sticky top-4 z-20 flex w-full justify-end px-4 sm:px-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-white hover:shadow-[0_10px_25px_rgba(59,130,246,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:bg-slate-900/90 dark:hover:shadow-[0_10px_30px_rgba(14,165,233,0.35)] dark:focus-visible:ring-offset-slate-900 active:scale-95"
              >
                <FiHome className="text-[15px]" />
                <span>Về trang chủ</span>
              </button>
            </div>

            {/* 2 layout: chưa chat & đã chat */}
            {!shouldShowChatView ? (
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
                        onClick={handleNewChat}
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
                        disabled={isLoading}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/60 transition-all duration-150 hover:bg-sky-400 hover:shadow-sky-400/70 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send"
                      >
                        {isLoading ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiMessageCircle className="text-[16px]" />
                        )}
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
              <div className="relative z-10 mx-auto flex w-full max-w-4xl min-h-full flex-col px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
                {/* messages */}
                <section 
                  className="flex-1 space-y-3 pb-6 pt-2 text-[13px]"
                >
                  {isLoadingDetail ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      {messages.map((m) => (
                        <MessageBubble 
                          key={m.id} 
                          message={m}
                          onTypingComplete={(messageId) => {
                            // Remove typing state when typing completes, but keep learningPaths
                            setMessages((prev) =>
                              prev.map((msg) =>
                                msg.id === messageId
                                  ? { ...msg, isTyping: false }
                                  : msg
                              )
                            );
                          }}
                          onScrollUpdate={scrollToBottom}
                          onLearningPathClick={handleLearningPathClick}
                        />
                      ))}
                      <div ref={messagesEndRef} className="h-px scroll-mb-32" />
                    </>
                  )}
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
                        onClick={handleNewChat}
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
                        disabled={isLoading}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/60 transition-all duration-150 hover:bg-sky-400 hover:shadow-sky-400/70 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send"
                      >
                        {isLoading ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiMessageCircle className="text-[16px]" />
                        )}
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
    <style jsx global>{`
      .chat-sidebar-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(56, 189, 248, 0.45) transparent;
      }

      .chat-sidebar-scroll::-webkit-scrollbar {
        width: 6px;
      }

      .chat-sidebar-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .chat-sidebar-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(56, 189, 248, 0.45);
        border-radius: 9999px;
      }

      .chat-sidebar-scroll:hover::-webkit-scrollbar-thumb {
        background-color: rgba(56, 189, 248, 0.75);
      }

      .chat-main-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(59, 130, 246, 0.7) transparent;
      }

      .chat-main-scroll::-webkit-scrollbar {
        width: 8px;
      }

      .chat-main-scroll::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.35);
        border-radius: 9999px;
        margin: 6px 0;
      }

      .chat-main-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(59, 130, 246, 0.85), rgba(14, 165, 233, 0.85));
        border-radius: 9999px;
        box-shadow: inset 0 0 0 2px rgba(15, 23, 42, 0.35);
      }

      .chat-main-scroll:hover::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(96, 165, 250, 0.95), rgba(14, 165, 233, 1));
      }
    `}</style>
    
    {/* Learning Path Detail Drawer - Single instance for all cards */}
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 text-white">
            <FiBookOpen className="text-[16px]" />
          </div>
          <span>Chi tiết lộ trình học tập</span>
        </div>
      }
      placement="right"
      onClose={handleCloseDrawer}
      open={drawerOpen}
      width={600}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleCloseDrawer}
        />
      }
    >
      {pathDetailLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spin size="large" />
        </div>
      ) : pathDetailError ? (
        <div className="py-8 text-center text-red-500 dark:text-red-400">
          {pathDetailError}
        </div>
      ) : pathDetailData ? (
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {pathDetailData.pathName || "Lộ trình học tập"}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                pathDetailData.status === 1
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
              }`}>
                {pathDetailData.status === 1 ? "Đã xác nhận" : "Chưa xác nhận"}
              </span>
              {pathDetailData.completionPercent !== undefined && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Hoàn thành: {Math.round(pathDetailData.completionPercent)}%
                </span>
              )}
            </div>
          </div>

          {pathDetailData.basicLearningPath?.courseGroups && pathDetailData.basicLearningPath.courseGroups.length > 0 && (
            <div>
              <h4 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-50">
                Nhóm khóa học
              </h4>
              <div className="space-y-3">
                {pathDetailData.basicLearningPath.courseGroups.map((group, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="mb-2 font-medium text-slate-900 dark:text-slate-50">
                      {group.subjectCode || `Nhóm ${idx + 1}`}
                    </div>
                    {group.courses && group.courses.length > 0 && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {group.courses.length} khóa học
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!pathDetailData.basicLearningPath?.courseGroups || pathDetailData.basicLearningPath.courseGroups.length === 0) && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              Chưa có thông tin chi tiết về lộ trình này.
            </div>
          )}
        </div>
      ) : null}
    </Drawer>
    </>
  );
}

export default ChatHomePageClient;
