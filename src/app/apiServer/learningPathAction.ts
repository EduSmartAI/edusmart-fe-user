"use server";
import { UpdateStatusLearningPathResponse } from "EduSmart/api/api-student-service";
import apiServer from "EduSmart/lib/apiServer";

export async function learningPathsChooseMajorUpdate(
    id: string,
    majorIds: string[],
  ): Promise<{
    data: UpdateStatusLearningPathResponse;
  }> {
    try {
      const res = await apiServer.student.api.learningPathsChooseMajorUpdate({
        learningPathId: id,
        internalMajorIds: majorIds,
      });
      if (res.data) {
        return {
          data: res.data,
        };
      }
      return {
        data: {},
      };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        data: {},
      };
    }
  }


  export async function learningPathsUpdateSubjectToSkippedUpdate(
    subjectCodes: string[],
  ): Promise<{
    data: UpdateStatusLearningPathResponse;
  }> {
    try {
      const res = await apiServer.student.api.learningPathsUpdateSubjectToSkippedUpdate({
        subjectCode: subjectCodes,
      });
      if (res.data) {
        return {
          data: res.data,
        };
      }
      return {
        data: {},
      };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        data: {},
      };
    }
  }