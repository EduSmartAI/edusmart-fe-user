"use client";

import apiClient from "EduSmart/hooks/apiClient";
import { StudentTranscriptRecord } from "EduSmart/app/(student)/studentAction";

export interface GetTranscriptResponse {
  response: StudentTranscriptRecord[] | null;
  success: boolean;
  messageId: string;
  message: string;
  detailErrors: null | unknown;
}

export interface UploadTranscriptResponse {
  response: null;
  success: boolean;
  messageId: string;
  message: string;
  detailErrors: null | unknown;
}

/**
 * CLIENT API: Get student transcript
 * Calls v1StudentSelectStudentTranscriptList endpoint
 */
export async function getStudentTranscriptClient(): Promise<GetTranscriptResponse> {
  try {
    const response =
      await apiClient.studentService.api.v1StudentSelectStudentTranscriptList();

    if (response.data?.success && response.data?.response) {
      return {
        response: response.data.response as StudentTranscriptRecord[],
        success: true,
        messageId: response.data.messageId || "I00001",
        message: response.data.message || "Lấy bảng điểm thành công",
        detailErrors: null,
      };
    }

    // No transcript found
    return {
      response: null,
      success: false,
      messageId: response.data?.messageId || "I00000",
      message: response.data?.message || "Chưa có bảng điểm nào được nhập",
      detailErrors: null,
    };
  } catch (error) {
    console.error("❌ CLIENT API - Get transcript error:", error);
    return {
      response: null,
      success: false,
      messageId: "E00001",
      message:
        error instanceof Error
          ? error.message
          : "Không thể tải bảng điểm. Vui lòng thử lại sau.",
      detailErrors: error instanceof Error ? error.message : null,
    };
  }
}

/**
 * CLIENT API: Upload student transcript file
 * Calls v1StudentInsertStudentTranscriptCreate endpoint
 */
/**
 * CLIENT API: Get student profile
 */
export async function getStudentProfileClient() {
  try {
    const response =
      await apiClient.studentService.api.v1StudentSelectStudentProfileList();

    if (response.data?.success && response.data?.response) {
      return {
        success: true,
        data: response.data.response,
        message: response.data.message || "Lấy thông tin thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Không thể lấy thông tin cá nhân",
    };
  } catch (error) {
    console.error("❌ CLIENT API - Get profile error:", error);
    return {
      success: false,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Không thể tải thông tin. Vui lòng thử lại sau.",
    };
  }
}

export async function uploadTranscriptClient(
  file: File,
): Promise<UploadTranscriptResponse> {
  try {
    const response =
      await apiClient.studentService.api.v1StudentInsertStudentTranscriptCreate(
        {
          TranscriptFile: file,
        },
      );

    return {
      response: null,
      success: response.data?.success ?? false,
      messageId: response.data?.messageId || "E00001",
      message: response.data?.message || "Có lỗi xảy ra khi upload bảng điểm",
      detailErrors: response.data?.detailErrors || null,
    };
  } catch (error) {
    console.error("❌ CLIENT API - Upload transcript error:", error);
    return {
      response: null,
      success: false,
      messageId: "E00001",
      message:
        error instanceof Error
          ? error.message
          : "Không thể upload bảng điểm. Vui lòng thử lại sau.",
      detailErrors: error instanceof Error ? error.message : null,
    };
  }
}

/**
 * CLIENT API: Update student profile
 */
export async function updateStudentProfileClient(data: {
  FirstName?: string;
  LastName?: string;
  DateOfBirth?: string;
  PhoneNumber?: string;
  Gender?: number;
  Avatar?: File;
  Address?: string;
  Bio?: string;
  MajorId?: string;
  SemesterId?: string;
  Technologies?: string[];
  LearningGoals?: string[];
}) {
  try {
    // Create proper FormData object
    const formData = new FormData();

    // Add basic fields - always append all fields to match Postman behavior
    // This ensures backend receives all fields even if some are empty
    formData.append("FirstName", data.FirstName ?? "");
    formData.append("LastName", data.LastName ?? "");
    formData.append("DateOfBirth", data.DateOfBirth ?? "");
    formData.append("PhoneNumber", data.PhoneNumber ?? "");
    formData.append("Gender", data.Gender !== undefined ? data.Gender.toString() : "");
    formData.append("Address", data.Address ?? "");
    formData.append("Bio", data.Bio ?? "");
    formData.append("MajorId", data.MajorId ?? "");
    formData.append("SemesterId", data.SemesterId ?? "");

    // Add Avatar if provided
    if (data.Avatar) {
      formData.append("Avatar", data.Avatar);
    }

    // Add Technologies - IMPORTANT: Backend requires at least 1 item (@minItems 1)
    // Always append each technology separately to match Postman's --form behavior
    if (data.Technologies && data.Technologies.length > 0) {
      data.Technologies.forEach((techId) => {
        formData.append("Technologies", techId);
      });
    }

    // Add LearningGoals - IMPORTANT: Backend requires at least 1 item (@minItems 1)
    // Always append each learning goal separately to match Postman's --form behavior
    if (data.LearningGoals && data.LearningGoals.length > 0) {
      data.LearningGoals.forEach((goalId) => {
        formData.append("LearningGoals", goalId);
      });
    }

    // Debug log FormData contents
    console.log("📤 FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `  ${key}:`,
        value instanceof File ? `File: ${value.name}` : value,
      );
    }

    const response =
      await apiClient.studentService.api.v1StudentUpdateStudentProfileUpdate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData as any,
        {
          headers: {
            Accept: "text/plain",
            // Don't set Content-Type for FormData - let browser set it with boundary
            // This is critical for multipart/form-data to work correctly
          },
        },
      );

    console.log("📥 API Response:", response.data);

    return {
      success: response.data?.success ?? false,
      messageId: response.data?.messageId || "E00001",
      message: response.data?.message || "Có lỗi xảy ra khi cập nhật thông tin",
      detailErrors: response.data?.detailErrors || null,
    };
  } catch (error) {
    console.error("❌ CLIENT API - Update profile error:", error);

    // Extract more detailed error info
    let errorMessage = "Không thể cập nhật thông tin. Vui lòng thử lại sau.";
    let detailErrors = null;

    if (error instanceof Error) {
      errorMessage = error.message;
      detailErrors = error.message;
    }

    // Check if it's an Axios error with response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any)?.response?.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = (error as any).response.data;
      console.error("📋 Server error response:", responseData);

      if (responseData.message) {
        errorMessage = responseData.message;
      }
      if (responseData.detailErrors) {
        detailErrors = responseData.detailErrors;
      }
    }

    return {
      success: false,
      messageId: "E00001",
      message: errorMessage,
      detailErrors: detailErrors,
    };
  }
}
