// src/stores/useCourseStore.ts
import apiClient from "EduSmart/hooks/apiClient";
import { create } from "zustand";
import { useLoadingStore } from "../Loading/LoadingStore";
interface CourseState {
  enRollingCourseById: (id: string) => Promise<string>;
}

export const useCourseStore = create<CourseState>(() => ({
  enRollingCourseById: async (id) => {
    try {
        const setLoading = useLoadingStore.getState().setLoading;
        const hideLoading = useLoadingStore.getState().hideLoading;
      const res =
        await apiClient.courseService.api.v1CoursesEnrollmentCreate(id);
      setLoading(true);
      if (res.data?.success) {
        await hideLoading();
        return res.data.response || "";
      }
      await hideLoading();
      return "";
    } catch {
      return "";
    }
  },
}));
