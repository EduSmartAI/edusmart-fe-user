"use server";

import { studentService } from "EduSmart/lib/apiServer";

export interface StudentTranscriptRecord {
  studentTranscriptId: string;
  semester: string;
  semesterNumber: number;
  subjectCode: string;
  prerequisite: string;
  subjectName: string;
  credit: number;
  grade: number;
  status: string;
  createdAt: string;
}

export interface GetTranscriptResponse {
  response: StudentTranscriptRecord[] | null;
  success: boolean;
  messageId: string;
  message: string;
  detailErrors: null | unknown;
}

/**
 * SERVER ACTION: Get student transcript
 * Calls v1StudentSelectStudentTranscriptList endpoint
 */
export async function getStudentTranscriptServer(): Promise<GetTranscriptResponse> {
  try {
    const response =
      await studentService.api.v1StudentSelectStudentTranscriptList();

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
    console.error("❌ SERVER ACTION - Get transcript error:", error);
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
