
"use client";

import apiClient from "EduSmart/hooks/apiClient";

export interface ImprovementContentResponse {
  success: boolean;
  content: string | null;
  error?: string;
}

/**
 * CLIENT API: Fetch improvement markdown content by ImprovementId.
 * Falls back with readable error messages on failure.
 */
export async function fetchImprovementContentClient(
  improvementId: string,
): Promise<ImprovementContentResponse> {
  if (!improvementId) {
    return {
      success: false,
      content: null,
      error: "Thiếu improvementId",
    };
  }

  try {
    const response =
      await apiClient.studentService.api.studentDashboardsGenAndInsertImprovementByAiCreate(
        {
          ImprovementId: improvementId,
        },
      );

    if (response.data?.success && response.data.response) {
      return {
        success: true,
        content: response.data.response,
      };
    }

    return {
      success: false,
      content: null,
      error:
        response.data?.message ||
        "Không thể tải nội dung gợi ý cải thiện. Vui lòng thử lại.",
    };
  } catch (error) {
    console.error("Error fetching improvement content (client):", error);
    return {
      success: false,
      content: null,
      error:
        error instanceof Error
          ? error.message
          : "Không thể tải nội dung gợi ý cải thiện.",
    };
  }
}

