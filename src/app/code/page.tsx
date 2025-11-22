import CodeEditor from "../../components/Code/CodeEditor";
import {
  PracticeTestLanguageSelectsResponse,
  PracticeTestLanguageSelectsResponseEntity,
  PracticeTestSelectsResponse,
  PracticeTestSelectsResponseEntity,
} from "EduSmart/api/api-quiz-service";
import {
  selectCodeLangues,
  selectPracticeTestsList,
  selectPracticeTestDetailList,
} from "../(codeQuiz)/action";

export type CodeLanguageOption = {
  judgeLanguageId: number;
  name: string;
};

export type PracticeExample = {
  exampleId: string;
  exampleOrder: number;
  inputData: string;
  outputData: string;
  explanation?: string | null;
};

export type PracticeTestCase = {
  testcaseId: string;
  inputData: string;
  expectedOutput: string;
};

export type PracticeProblem = {
  problemId: string;
  title: string;
  description: string;
  difficulty: string;
  examples: PracticeExample[];
  testCases: PracticeTestCase[];
};

function isLanguageEntity(
  value: PracticeTestLanguageSelectsResponseEntity | undefined,
): value is PracticeTestLanguageSelectsResponseEntity {
  return (
    typeof value?.languageId === "number" &&
    typeof value.name === "string" &&
    value.name.length > 0
  );
}

function mapLanguages(
  response: PracticeTestLanguageSelectsResponse | null,
): CodeLanguageOption[] {
  if (!response || !Array.isArray(response.response)) return [];

  return response.response
    .filter(isLanguageEntity)
    .map((item) => ({
      judgeLanguageId: item.languageId!,
      name: item.name!,
    }));
}

function isPracticeEntity(
  value: PracticeTestSelectsResponseEntity | undefined,
): value is PracticeTestSelectsResponseEntity {
  return (
    typeof value?.problemId === "string" &&
    typeof value.title === "string" &&
    value.title.length > 0 &&
    typeof value.description === "string" &&
    value.description.length > 0
  );
}

// map list API (summary)
function mapPracticeTests(
  response: PracticeTestSelectsResponse | null,
): PracticeProblem[] {
  const items = response?.response?.items;
  if (!Array.isArray(items)) return [];

  return items.filter(isPracticeEntity).map((item) => ({
    problemId: item.problemId!,
    title: item.title!,
    description: item.description!,
    difficulty: item.difficulty ?? "Unknown",
    examples: [],
    testCases: [],
  }));
}

export default async function Page() {
  const [langRes, testsRes] = await Promise.all([
    selectCodeLangues(),
    selectPracticeTestsList(),
  ]);

  let languages = mapLanguages(langRes);
  if (languages.length === 0) {
    languages = [{ judgeLanguageId: 51, name: "C# (.NET/Mono)" }];
  }

  const baseProblems = mapPracticeTests(testsRes);
  if (baseProblems.length === 0) {
    return <CodeEditor languages={languages} problems={[]} />;
  }

  // Gọi detail cho từng problemId để lấy examples + testCases
  const detailResponses = await Promise.all(
    baseProblems.map((p) => selectPracticeTestDetailList(p.problemId)),
  );

  const problems: PracticeProblem[] = baseProblems.map((p, idx) => {
    const detail = detailResponses[idx]?.response;

    const examples: PracticeExample[] = Array.isArray(detail?.examples)
      ? detail!.examples!.map((e) => ({
          exampleId: e.exampleId ?? `${p.problemId}-${e.exampleOrder ?? 0}`,
          exampleOrder: e.exampleOrder ?? 0,
          inputData: e.inputData ?? "",
          outputData: e.outputData ?? "",
          explanation: e.explanation ?? null,
        }))
      : [];

    const testCases: PracticeTestCase[] = Array.isArray(detail?.testCases)
      ? detail!.testCases!.map((t) => ({
          testcaseId: t.testcaseId ?? "",
          inputData: t.inputData ?? "",
          expectedOutput: t.expectedOutput ?? "",
        }))
      : [];

    return {
      ...p,
      description: detail?.description ?? p.description,
      difficulty: detail?.difficulty ?? p.difficulty,
      examples,
      testCases,
    };
  });

  return <CodeEditor languages={languages} problems={problems} />;
}
