"use server";
import {
  PracticeTestCodeCheckResponse,
  PracticeTestLanguageSelectsResponse,
  PracticeTestSelectResponse,
  PracticeTestSelectsResponse,
  PracticeTestUserTemplateCodeSelectResponse,
} from "EduSmart/api/api-quiz-service";
import { quizService } from "EduSmart/lib/apiServer";

export async function selectCodeLangues(): Promise<PracticeTestLanguageSelectsResponse | null> {
  try {
    const resp = await quizService.api.v1PracticeTestSelectCodeLanguagesList();
    return resp.data as PracticeTestLanguageSelectsResponse;
  } catch (error) {
    console.error("selectCodeLangues error:", error);
    return null;
  }
}

export async function selectPracticeTestsList(): Promise<PracticeTestSelectsResponse | null> {
  try {
    const resp = await quizService.api.v1PracticeTestSelectPracticeTestsList();
    return resp.data as PracticeTestSelectsResponse;
  } catch (error) {
    console.error("selectCodeLangues error:", error);
    return null;
  }
}

export async function selectPracticeTestDetailList(
  ProblemId: string,
): Promise<PracticeTestSelectResponse | null> {
  try {
    const resp =
      await quizService.api.v1PracticeTestSelectPracticeTestDetailList({
        ProblemId: ProblemId,
      });
    return resp.data as PracticeTestSelectResponse;
  } catch (error) {
    console.error("selectCodeLangues error:", error);
    return null;
  }
}

export async function selectUserTemplateCodeList(
  ProblemId: string,
  LanguageId: number,
): Promise<PracticeTestUserTemplateCodeSelectResponse | null> {
  try {
    const resp = await quizService.api.v1PracticeTestSelectUserTemplateCodeList(
      {
        ProblemId: ProblemId,
        LanguageId: LanguageId,
      },
    );
    return resp.data as PracticeTestUserTemplateCodeSelectResponse;
  } catch (error) {
    console.error("selectCodeLangues error:", error);
    return null;
  }
}

export async function checkPracticeTestCodeCreate(
  ProblemId: string,
  LanguageId: number,
  sourceCode: string,
  inputs: string[],
): Promise<PracticeTestCodeCheckResponse | null> {
  try {
    const resp =
      await quizService.api.v1PracticeTestCheckPracticeTestCodeCreate({
        problemId: ProblemId,
        languageId: LanguageId,
        sourceCode: sourceCode,
        inputs: inputs,
      });
    console.log("resp", resp.data.response);
    return resp.data as PracticeTestCodeCheckResponse;
  } catch (error) {
    console.error("checkPracticeTestCodeCreate error:", error);
    return null;
  }
}

export async function submitPracticeTestCreate(
  ProblemId: string,
  LanguageId: number,
  sourceCode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> {
  try {
    const resp = await quizService.api.v1PracticeTestSubmitPracticeTestCreate({
      problemId: ProblemId,
      languageId: LanguageId,
      sourceCode: sourceCode,
    });
    console.log("Practice test submitted:", resp.data);
    return resp.data;
  } catch (error) {
    console.error("submitPracticeTestCreate error:", error);
    return null;
  }
}
