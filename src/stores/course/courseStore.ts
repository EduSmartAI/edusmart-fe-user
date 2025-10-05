// src/stores/useCourseStore.ts
import apiClient from "EduSmart/hooks/apiClient";
import { create } from "zustand";
import { useLoadingStore } from "../Loading/LoadingStore";
interface CourseState {
  enRollingCourseById: (id: string) => Promise<string>;
}

export const useCourseStore = create<CourseState>(() => ({
  enRollingCourseById: async (id) => {
    const setLoading = useLoadingStore.getState().setLoading;
    const hideLoading = useLoadingStore.getState().hideLoading;
    setLoading(true);
    try {
      const res =
        await apiClient.courseService.api.studentLessonProgressEnrollmentCreate(id);
      if (res.data?.success) {
        return res.data.response || "";
      }
      return "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const status = e?.response?.status;
      throw status ?? e;
    } finally {
      hideLoading();
    }
  },
}));
