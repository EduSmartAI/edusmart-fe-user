"use server";
import {
  AIChatBotLearningPathResponse,
  GetAllChatsLearningPathResponse,
  GetChatDetailLearningPathResponse,
  SubjectAnalysisResponse,
} from "EduSmart/api/api-ai-service";
import apiServer from "EduSmart/lib/apiServer";

export async function aiChatBotsChatWithAiLearningPathCreate(
  message: string,
  id: string,
): Promise<{
  data: AIChatBotLearningPathResponse;
}> {
  try {
    const res = await apiServer.ai.api.aiChatBotsChatWithAiLearningPathCreate({
      request: {
        message: message,
        sessionId: id,
      },
    });
    console.log("AI Request:", { message: message, sessionId: id, response: res.data.response });
    if (res.data?.success && res.data.response) {
      console.log("AI Response:", res.data.response);
      return {
        data: res.data ?? {},
      };
    }
    return {
      data: res.data ?? {},
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
    };
  }
}

export async function aiChatBotsLearningPathList(): Promise<{
  data: GetAllChatsLearningPathResponse;
}> {
  try {
    const res = await apiServer.ai.api.aiChatBotsLearningPathList();
    if (res.data?.success && res.data.response) {
      console.log("AI Response aiChatBotsLearningPathList:", res.data.response);
      return {
        data: res.data ?? {},
      };
    }
    return {
      data: res.data ?? {},
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
    };
  }
}

export async function aiChatBotsLearningPathDetailList(
  sessionId: string,
): Promise<{
  data: GetChatDetailLearningPathResponse;
}> {
  try {
    const res = await apiServer.ai.api.aiChatBotsLearningPathDetailList({
      sessionId: sessionId,
    });
    if (res.data?.success && res.data.response) {
      console.log("AI Response aiChatBotsLearningPathList:", res.data.response);
      return {
        data: res.data ?? {},
      };
    }
    return {
      data: res.data ?? {},
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
    };
  }
}


export async function v1AiRecommendCourseSubjectAnalysisCreate(
  courseId: string,
): Promise<{
  data: SubjectAnalysisResponse;
}> {
  try {
    const res = await apiServer.ai.api.v1AiRecommendCourseSubjectAnalysisCreate({
      courseId: courseId,
    });
    if (res.data?.success && res.data.response) {
      console.log("AI Response:", res.data.response);
      return {
        data: res.data ?? {},
      };
    }
    return {
      data: res.data ?? {},
    };
  } catch (error) {
    console.error("Error fetching:", error);
    return {
      data: {},
    };
  }
}