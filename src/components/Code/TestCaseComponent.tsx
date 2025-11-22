import React from "react";
import { Card, Spin, Tag, Input, Tabs } from "antd";
import "./testcase.css"

const { TextArea } = Input;

export type JudgeTest = {
  name?: string | null;
  status?: string | null;
  time?: number | string | null;
  memory_kb?: number | string | null;
  stdout?: string | null; // output
  stderr?: string | null; // error
};

export type JudgeRunRes = {
  overall?: string | null;
  max_time?: number | string | null; // giây
  max_memory_kb?: number | string | null;
  tests?: JudgeTest[];
};

type Props = {
  loading: boolean;
  errMsg: string | null;
  result: JudgeRunRes | null;
  testInput: string;
  onChangeTestInput: (value: string) => void;

  // điều khiển tab từ bên ngoài
  activeTab: "testcase" | "result";
  onChangeTab: (tab: "testcase" | "result") => void;
};

const safeNumber = (v: number | string | null | undefined): number | null => {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const statusTagColor = (s: string | null | undefined) => {
  const text = (s || "").toLowerCase();

  if (!text) return "default" as const;
  if (text.includes("accepted") || text.includes("passed")) return "success";
  if (
    text.includes("compilation") ||
    text.includes("runtime") ||
    text.includes("http") ||
    text.includes("wrong")
  )
    return "error";
  if (text.includes("time limit") || text.includes("memory limit"))
    return "warning";
  if (text.includes("processing") || text.includes("queue"))
    return "processing";

  return "default" as const;
};

const TestCaseComponent: React.FC<Props> = ({
  loading,
  errMsg,
  result,
  testInput,
  onChangeTestInput,
  activeTab,
  onChangeTab,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [result]);

  const tests = result?.tests ?? [];

  // mỗi test case cách nhau 1 dòng trống
  const inputBlocks = React.useMemo(
    () =>
      testInput
        .split(/\r?\n\s*\r?\n/)
        .map((b) => b.trim())
        .filter((b) => b.length > 0),
    [testInput],
  );

  const activeTest = tests[activeIndex] ?? tests[0] ?? null;
  const activeInput =
    inputBlocks[activeIndex] ?? inputBlocks[0] ?? testInput.trim();

  const maxTime = safeNumber(result?.max_time);
  const maxMem = safeNumber(result?.max_memory_kb);
  const runtimeMs = maxTime !== null ? Math.round(maxTime * 1000) : null;

  return (
    <Card
      className="h-full flex flex-col overflow-hidden !bg-white dark:!bg-[#020712]"
      styles={{
        body: {
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => onChangeTab(key as "testcase" | "result")}
        size="small"
        tabBarGutter={24}
        tabBarStyle={{ paddingInline: 12, marginBottom: 0 }}
        className="flex-1 flex flex-col testcase-tabs"
        items={[
          {
            key: "testcase",
            label: "Testcase",
            children: (
              <div className="p-3">
                <TextArea
                  value={testInput}
                  onChange={(e) => onChangeTestInput(e.target.value)}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  className="font-mono text-xs"
                  placeholder={`Nhập input, ví dụ:\n[2,7,11,15]\n9\n\n[3,2,4]\n6`}
                />
              </div>
            ),
          },
          {
            key: "result",
            label: "Test Result",
            children: (
              <div className="p-3 flex-1 min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Spin />
                  </div>
                ) : errMsg ? (
                  <div className="text-red-500 break-words text-sm h-full overflow-auto">
                    {errMsg}
                  </div>
                ) : result && activeTest ? (
                  <div className="flex flex-col h-full gap-3 overflow-auto text-sm">
                    {/* Header: Accepted + Runtime */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Tag color={statusTagColor(result.overall)}>
                        {result.overall ?? "Result"}
                      </Tag>

                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        Runtime:{" "}
                        {runtimeMs !== null ? `${runtimeMs} ms` : "N/A"}
                      </span>

                      {maxMem !== null && (
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Max Mem: {maxMem} KB
                        </span>
                      )}
                    </div>

                    {/* Case 1 | Case 2 | ... */}
                    {tests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tests.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            className={`px-3 py-1 rounded-full border text-xs transition
                              ${
                                idx === activeIndex
                                  ? "bg-emerald-500 text-white border-emerald-500"
                                  : "bg-transparent text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                              }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input / Output / Error */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="mb-1 font-semibold text-gray-600 dark:text-gray-300">
                          Input
                        </div>
                        <pre className="whitespace-pre-wrap rounded bg-gray-50 dark:bg-gray-900/40 px-3 py-2 font-mono">
                          {activeInput || ""}
                        </pre>
                      </div>

                      <div>
                        <div className="mb-1 font-semibold text-gray-600 dark:text-gray-300">
                          Output
                        </div>
                        <pre className="whitespace-pre-wrap rounded bg-gray-50 dark:bg-gray-900/40 px-3 py-2 font-mono">
                          {activeTest.stdout ?? ""}
                        </pre>
                      </div>

                      <div>
                        <div className="mb-1 font-semibold text-gray-600 dark:text-gray-300">
                          Error
                        </div>
                        <pre className="whitespace-pre-wrap rounded bg-gray-50 dark:bg-gray-900/40 px-3 py-2 font-mono">
                          {activeTest.stderr ?? ""}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Nhấn <span className="font-semibold">Run</span> để chạy
                    test với input ở tab{" "}
                    <span className="font-semibold">Testcase</span>.
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default TestCaseComponent;
