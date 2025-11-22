"use client";

import {
  Button,
  Card,
  Layout,
  message,
  Select,
  Spin,
  Splitter,
  Tag,
} from "antd";
import { useTheme } from "EduSmart/Provider/ThemeProvider";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { FiChevronDown, FiPlay, FiSend } from "react-icons/fi";
import type { CodeLanguageOption, PracticeProblem } from "../../app/code/page";
import { ThemeSwitch } from "EduSmart/components/Themes/Theme";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { MarkdownBlock } from "EduSmart/components/MarkDown/MarkdownBlock";
import {
  selectUserTemplateCodeList,
  checkPracticeTestCodeCreate,
} from "../../app/(codeQuiz)/action";
import { JudgeLanguageId, judgeLanguageToMonaco } from "EduSmart/enum/enum";
import "./code.css";
import TestCaseComponent, {
  JudgeRunRes,
} from "EduSmart/components/Code/TestCaseComponent";
import { handleEditorWillMount } from "EduSmart/utils/EditorCodeConfig";

const { Header, Content } = Layout;
const { Option } = Select;

const DEFAULT_SNIPPET = `using System;
using System.Collections.Generic;

public class Solution {
    public int Solve() {
        // TODO: implement solution here
        return 0;
    }
}
`;

export type SubmitItem = {
  languageId: JudgeLanguageId;
  sourceCode: string;
};

export type SubmitPayload = SubmitItem[];

type Props = {
  languages: CodeLanguageOption[];
  problems: PracticeProblem[];
  onSubmit?: (payload: SubmitPayload) => void;
};

const difficultyColor = (d?: string | null): string => {
  const v = (d || "").toLowerCase();
  if (v === "easy") return "green";
  if (v === "medium") return "gold";
  if (v === "hard") return "red";
  return "default";
};

export default function CodeEditor({ languages, problems, onSubmit }: Props) {
  const { isDarkMode } = useTheme();
  const hasProblems = problems.length > 0;

  // key để force remount Select khi danh sách problems đổi → tránh giữ label cũ
  const problemsKey = useMemo(
    () =>
      problems
        .map((p) => `${p.problemId}-${p.title}-${p.difficulty}`)
        .join("|"),
    [problems],
  );

  const [templateLoading, setTemplateLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JudgeRunRes | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [selectedLangId, setSelectedLangId] = useState<JudgeLanguageId>(
    JudgeLanguageId.CSharpMono,
  );
  const monacoLanguage = judgeLanguageToMonaco[selectedLangId] ?? "plaintext";

  const [activeProblemId, setActiveProblemId] = useState<string>(() =>
    hasProblems ? problems[0].problemId : "",
  );

  const [activeTestTab, setActiveTestTab] = useState<"testcase" | "result">(
    "testcase",
  );

  const editorRef = useRef<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);
  const monacoRef = useRef<Monaco | null>(null);

  const [codeByProblem, setCodeByProblem] = useState<Record<string, string>>(
    () => {
      const map: Record<string, string> = {};
      if (!hasProblems) {
        map["default"] = DEFAULT_SNIPPET;
      }
      return map;
    },
  );

  const [testInputsByProblem, setTestInputsByProblem] = useState<
    Record<string, string>
  >(() => {
    const map: Record<string, string> = {};
    if (hasProblems) {
      problems.forEach((p) => {
        const defaultInput =
          (p.testCases ?? [])
            .map((tc) => tc.inputData ?? "")
            .filter((x) => x && x.trim().length > 0)
            .join("\n\n") || "";
        map[p.problemId] = defaultInput;
      });
    } else {
      map["default"] = "";
    }
    return map;
  });

  // Khi danh sách problems đổi (ví dụ đổi từ Two Sum → Reverse String),
  // đồng bộ lại activeProblemId + codeByProblem + testInputsByProblem.
  useEffect(() => {
    if (!hasProblems) {
      setActiveProblemId("");
      setCodeByProblem({ default: DEFAULT_SNIPPET });
      setTestInputsByProblem({ default: "" });
      return;
    }

    // activeProblemId không còn tồn tại trong list mới → set về problem đầu tiên
    setActiveProblemId((prev) => {
      if (prev && problems.some((p) => p.problemId === prev)) {
        return prev;
      }
      return problems[0].problemId;
    });

    // giữ code cũ cho những problemId trùng, problem mới thì dùng snippet mặc định
    setCodeByProblem((prev) => {
      const map: Record<string, string> = {};
      problems.forEach((p) => {
        if (prev[p.problemId] !== undefined) {
          map[p.problemId] = prev[p.problemId];
        }
      });
      return map;
    });

    // giữ test input cũ nếu có, không thì build lại từ testCases
    setTestInputsByProblem((prev) => {
      const map: Record<string, string> = {};
      problems.forEach((p) => {
        const existing = prev[p.problemId];
        if (existing !== undefined) {
          map[p.problemId] = existing;
          return;
        }
        const defaultInput =
          (p.testCases ?? [])
            .map((tc) => tc.inputData ?? "")
            .filter((x) => x && x.trim().length > 0)
            .join("\n\n") || "";
        map[p.problemId] = defaultInput;
      });
      return map;
    });
  }, [hasProblems, problems]);

  const activeProblem: PracticeProblem | null = hasProblems
    ? (problems.find((p) => p.problemId === activeProblemId) ?? problems[0])
    : null;

  const currentProblemKey =
    activeProblem?.problemId ?? activeProblemId ?? "default";
  const currentTestInput = testInputsByProblem[currentProblemKey] ?? "";

  const onEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const key = activeProblem?.problemId ?? "default";
    const initial = codeByProblem[key] ?? DEFAULT_SNIPPET;
    editor.setValue(initial);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearMarkers = () => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    monacoRef.current.editor.setModelMarkers(model, "judge", []);
  };

  const setCompileErrorMarker = (errorMessage: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    let line = 1;
    let column = 1;

    // Main.cs(37,0): ...
    const m1 = errorMessage.match(/\((\d+),\s*(\d+)\)/);
    // Line 3: Char 17: ...
    const m2 = errorMessage.match(/Line\s+(\d+):\s*Char\s+(\d+)/i);

    if (m1) {
      line = Number(m1[1]);
      column = Number(m1[2]);
    } else if (m2) {
      line = Number(m2[1]);
      column = Number(m2[2]);
    }

    // đảm bảo >= 1 cho Monaco
    line = Math.max(line, 1);
    column = Math.max(column, 1);

    monacoRef.current.editor.setModelMarkers(model, "judge", [
      {
        startLineNumber: line,
        startColumn: column,
        endLineNumber: line,
        endColumn: column + 1,
        message: errorMessage,
        severity: monacoRef.current.MarkerSeverity.Error,
      },
    ]);
  };

  const runCode = async () => {
    const code = editorRef.current?.getValue() ?? "";
    if (!code.trim()) {
      message.warning("Bạn chưa nhập code.");
      return;
    }
    clearMarkers();

    if (!activeProblem || !activeProblem.problemId) {
      message.error("Không xác định được bài tập hiện tại.");
      return;
    }

    const rawInput = (testInputsByProblem[currentProblemKey] ?? "").trim();
    if (!rawInput) {
      message.warning("Bạn chưa nhập test case.");
      return;
    }

    const inputs = rawInput
      .split(/\r?\n\s*\r?\n/)
      .map((block) => block.trim())
      .filter((block) => block.length > 0);

    setLoading(true);
    setErrMsg(null);
    setActiveTestTab("result");
    message.open({
      type: "loading",
      content: "Đang chạy code…",
      key: "run",
      duration: 0,
    });

    try {
      const resp = await checkPracticeTestCodeCreate(
        activeProblem.problemId,
        selectedLangId,
        code,
        inputs,
      );

      if (!resp) {
        throw new Error("Không nhận được phản hồi từ server.");
      }

      if (!resp.success) {
        const firstError =
          resp.detailErrors && resp.detailErrors.length > 0
            ? resp.detailErrors[0].errorMessage
            : null;
        throw new Error(firstError || resp.message || "Chạy test thất bại.");
      }

      const payload = resp.response;
      if (!payload) {
        throw new Error("Server không trả về kết quả kiểm tra.");
      }

      const testResults = payload.testCaseResults ?? [];

      const tests =
        testResults.length > 0
          ? testResults.map((t, idx) => ({
              name:
                t.testCaseNumber !== undefined && t.testCaseNumber !== null
                  ? `Case ${t.testCaseNumber}`
                  : `Case ${idx + 1}`,
              status: t.status ?? null,
              time: t.executionTime ?? null,
              memory_kb: t.memory ?? null,
              stdout: t.output ?? "",
              stderr: t.error ?? "",
            }))
          : [];

      // >>> THÊM TỪ ĐÂY
      const isCompileError = (payload.overallStatus ?? "")
        .toLowerCase()
        .includes("compilation");

      if (isCompileError) {
        const firstErr =
          testResults[0]?.error ||
          testResults.find((t) => t.error)?.error ||
          payload.overallStatus ||
          "Compilation Error";

        setCompileErrorMarker(firstErr); // gạch đỏ trong editor
        setResult({
          overall: payload.overallStatus ?? null,
          max_time: null,
          max_memory_kb: null,
          tests,
        });
        setErrMsg(firstErr);

        message.open({
          type: "error",
          content: "Compilation Error",
          key: "run",
          duration: 2.2,
        });

        setLoading(false);
        return; // không chạy tiếp xuống phần success
      }

      const maxTime =
        testResults.length > 0
          ? testResults.reduce((max, t) => {
              const v =
                typeof t.executionTime === "number"
                  ? t.executionTime
                  : t.executionTime != null
                    ? Number(t.executionTime)
                    : 0;
              return v > max ? v : max;
            }, 0)
          : null;

      const maxMem =
        testResults.length > 0
          ? testResults.reduce((max, t) => {
              const v =
                typeof t.memory === "number"
                  ? t.memory
                  : t.memory != null
                    ? Number(t.memory)
                    : 0;
              return v > max ? v : max;
            }, 0)
          : null;

      const converted: JudgeRunRes = {
        overall: payload.overallStatus ?? null,
        max_time: maxTime,
        max_memory_kb: maxMem,
        tests,
      };

      setResult(converted);

      message.open({
        type: "success",
        content: payload.overallStatus || "Đã chạy xong ✔",
        key: "run",
        duration: 1.2,
      });
    } catch (error) {
      let msg = "Có lỗi khi chạy code.";
      if (error instanceof Error && error.message) {
        msg = error.message;
      }
      setErrMsg(msg);
      setResult(null);
      message.open({
        type: "error",
        content: msg,
        key: "run",
        duration: 2.2,
      });
      setActiveTestTab("result");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const currentKey = activeProblem?.problemId ?? activeProblemId ?? "default";
    const currentCode = editorRef.current?.getValue() ?? "";

    // merge code hiện tại vào state
    const mergedCodes: Record<string, string> = {
      ...codeByProblem,
      [currentKey]: currentCode,
    };

    // build mảng [ { languageId, sourceCode }, ... ]
    const payload: SubmitPayload = hasProblems
      ? problems.map((p) => ({
          languageId: selectedLangId,
          sourceCode: mergedCodes[p.problemId] ?? "",
        }))
      : [
          {
            languageId: selectedLangId,
            sourceCode: mergedCodes[currentKey] ?? "",
          },
        ];

    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log("[SUBMIT inside Client]:", payload);
    }
  };

  const handleChangeProblem = (problemId: string) => {
    if (!hasProblems) return;

    setCodeByProblem((prev) => {
      const map = { ...prev };
      const currentKey = activeProblem?.problemId ?? "default";
      if (editorRef.current) {
        map[currentKey] = editorRef.current.getValue() ?? "";
      }

      const nextCode = map[problemId] ?? DEFAULT_SNIPPET;
      if (editorRef.current) {
        editorRef.current.setValue(nextCode);
      }

      return map;
    });

    setActiveProblemId(problemId);
    setResult(null);
    setErrMsg(null);
    setActiveTestTab("testcase");
  };

  const loadUserTemplateCode = async (
    problemId: string,
    languageId: number,
  ) => {
    if (!problemId) return;
    setTemplateLoading(true);
    try {
      const template = (
        await selectUserTemplateCodeList(problemId, languageId)
      )?.response?.userTemplateCode?.trim();

      const finalCode =
        template && template.length > 0 ? template : DEFAULT_SNIPPET;

      setCodeByProblem((prev) => ({
        ...prev,
        [problemId]: finalCode,
      }));

      if (editorRef.current) {
        editorRef.current.setValue(finalCode);
      }
    } catch (e) {
      console.error("loadUserTemplateCode error:", e);
      message.warning("Không tải được template code, dùng snippet mặc định.");
    } finally {
      setTemplateLoading(false);
    }
  };

  useEffect(() => {
    if (!hasProblems || !activeProblemId || !editorRef.current) return;
    const saved = codeByProblem[activeProblemId];
    console.log("Checking saved template code...");
    if (saved !== undefined) {
      editorRef.current.setValue(saved);
      return;
    }
    loadUserTemplateCode(activeProblemId, selectedLangId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasProblems, activeProblemId, codeByProblem]);

  if (!mounted) return null;

  return (
    <Layout className="min-h-screen">
      {/* HEADER */}
      <Header className="flex items-center justify-between !px-3 md:!px-6 !bg-white dark:!bg-[#020712] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
          <div className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-50">
            {activeProblem ? activeProblem.title : "Practice coding problems"}
          </div>
          {activeProblem && (
            <Tag color={difficultyColor(activeProblem.difficulty)}>
              {activeProblem.difficulty ?? "Unknown"}
            </Tag>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasProblems && (
            <Select
              key={problemsKey} // force remount khi danh sách problems đổi
              value={activeProblemId}
              style={{ minWidth: 250 }}
              size="small"
              suffixIcon={<FiChevronDown />}
              onChange={(value) => handleChangeProblem(value as string)}
              placeholder="Chọn bài tập"
            >
              {problems.map((p, idx) => (
                <Option key={p.problemId} value={p.problemId}>
                  {idx + 1}. [{p.difficulty ?? "Unknown"}] {p.title}
                </Option>
              ))}
            </Select>
          )}

          <Select
            value={selectedLangId}
            style={{ minWidth: 170 }}
            size="small"
            suffixIcon={<FiChevronDown />}
            dropdownMatchSelectWidth={false}
            dropdownClassName="code-lang-dropdown"
            dropdownStyle={{ padding: 0 }}
            onChange={async (value) => {
              const langId = value as JudgeLanguageId;
              setSelectedLangId(langId);

              const currentKey = activeProblem?.problemId ?? "default";
              if (editorRef.current) {
                const currentCode = editorRef.current.getValue() ?? "";
                setCodeByProblem((prev) => ({
                  ...prev,
                  [currentKey]: currentCode,
                }));
              }

              await loadUserTemplateCode(currentKey, langId);
            }}
            placeholder="Chọn ngôn ngữ"
          >
            {languages.map((lang) => (
              <Option
                key={lang.judgeLanguageId}
                value={lang.judgeLanguageId as JudgeLanguageId}
              >
                {lang.name}
              </Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon={<FiPlay />}
            onClick={runCode}
            loading={loading}
            className="font-medium"
          >
            Run
          </Button>

          <Button
            type="default"
            icon={<FiSend />}
            onClick={handleSubmit}
            className="font-medium"
          >
            Submit
          </Button>

          <ThemeSwitch />
        </div>
      </Header>

      {/* BODY */}
      <Content className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 h-[calc(100vh-64px)]">
        <Splitter style={{ height: "100%" }} className="bg-transparent">
          {/* LEFT: DESCRIPTION */}
          <Splitter.Panel defaultSize="34%" min={260}>
            <Card
              className="h-full !bg-white dark:!bg-[#020712] !text-gray-900 dark:!text-gray-100 overflow-hidden"
              styles={{
                body: {
                  padding: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                },
              }}
            >
              {/* header giống LeetCode */}
              <div className="border-b border-gray-200 dark:border-gray-800 px-3 md:px-4 lg:px-5 py-2 text-xs md:text-[13px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Description
              </div>

              {/* body */}
              <div className="flex-1 overflow-auto px-3 md:px-4 lg:px-6 py-3 md:py-4">
                <div className="max-w-3xl mx-auto text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed space-y-4">
                  {activeProblem ? (
                    <>
                      {/* title */}
                      <div className="font-semibold text-base md:text-lg">
                        {activeProblem.title}
                      </div>

                      {/* mô tả chính – bỏ khung pre, chỉ giữ wrap */}
                      <div className="whitespace-pre-wrap">
                        {activeProblem.description}
                      </div>

                      {/* Examples */}
                      {activeProblem.examples?.length > 0 && (
                        <div className="pt-2 space-y-2">
                          <div className="font-semibold text-sm md:text-base">
                            Examples
                          </div>
                          {activeProblem.examples
                            .slice()
                            .sort((a, b) => a.exampleOrder - b.exampleOrder)
                            .map((ex) => (
                              <div
                                key={ex.exampleId}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[13px] md:text-[14px]"
                              >
                                <div className="font-semibold mb-1">
                                  Example {ex.exampleOrder}
                                </div>

                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                >
                                  {[
                                    "**Input:**",
                                    "```text",
                                    ex.inputData ?? "",
                                    "```",
                                    "",
                                    "**Output:**",
                                    "```text",
                                    ex.outputData ?? "",
                                    "```",
                                    ex.explanation
                                      ? `\n**Explanation:**\n${ex.explanation}`
                                      : "",
                                  ].join("\n")}
                                </ReactMarkdown>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Sample testcases */}
                      {activeProblem.testCases?.length > 0 && (
                        <div className="pt-2 space-y-2">
                          <div className="font-semibold text-sm md:text-base">
                            Sample testcases
                          </div>

                          <div className="space-y-2">
                            {activeProblem.testCases.map((tc, idx) => (
                              <div
                                key={tc.testcaseId}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[13px] md:text-[14px]"
                              >
                                <div className="font-semibold mb-1">
                                  Testcase {idx + 1}
                                </div>

                                <MarkdownBlock
                                  className="whitespace-pre-wrap font-mono text-[13px] md:text-[14px]"
                                  markdown={[
                                    "**Input:**",
                                    "```text",
                                    tc.inputData ?? "",
                                    "```",
                                    "",
                                    "**Expected:**",
                                    "```text",
                                    tc.expectedOutput ?? "",
                                    "```",
                                  ].join("\n")}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Không tải được danh sách bài tập. Vui lòng thử lại sau.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Splitter.Panel>

          {/* RIGHT: CODE + OUTPUT */}
          <Splitter.Panel min={360}>
            <Splitter layout="vertical" className="bg-transparent h-full">
              <Splitter.Panel defaultSize="65%" min={150}>
                <Card
                  className="h-full !bg-white dark:!bg-[#020712]"
                  styles={{
                    body: {
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    },
                  }}
                >
                  <div className="border-b border-gray-200 dark:border-gray-800 px-3 py-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Code
                  </div>

                  <div style={{ flex: 1, minHeight: 0 }} className="relative">
                    <Editor
                      height="100%"
                      language={monacoLanguage}
                      defaultValue={DEFAULT_SNIPPET}
                      beforeMount={handleEditorWillMount}
                      onMount={onEditorMount}
                      theme={isDarkMode ? "edusmart-night" : "edusmart-light"}
                      options={{
                        automaticLayout: true,
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineHeight: 22,
                        fontLigatures: true,
                      }}
                    />

                    {templateLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                        <Spin tip="Đang tải template..." />
                      </div>
                    )}
                  </div>
                </Card>
              </Splitter.Panel>

              <Splitter.Panel defaultSize="35%" min={140}>
                <TestCaseComponent
                  loading={loading}
                  errMsg={errMsg}
                  result={result}
                  testInput={currentTestInput}
                  onChangeTestInput={(value) => {
                    const key =
                      activeProblem?.problemId ?? activeProblemId ?? "default";
                    setTestInputsByProblem((prev) => ({
                      ...prev,
                      [key]: value,
                    }));
                  }}
                  activeTab={activeTestTab}
                  onChangeTab={(tab) => setActiveTestTab(tab)}
                />
              </Splitter.Panel>
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </Content>
    </Layout>
  );
}
