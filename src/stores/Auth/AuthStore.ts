// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import apiClient from "EduSmart/hooks/apiClient";
import { loginAction, refreshAction } from "EduSmart/app/(auth)/action";

export interface AuthState {
  token: string | null;
  refreshTokenValue: string | null;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

type PersistedAuth = {
  token: string | null;
};

const cookieRawStorage = {
  getItem: (name: string) => Cookies.get(name) ?? null,
  setItem: (name: string, value: string) =>
    Cookies.set(name, value, { expires: 7, sameSite: "lax", path: "/" }),
  removeItem: (name: string) => Cookies.remove(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshTokenValue: null,

      reset: () => {
        set({ token: null, refreshTokenValue: null });
        Cookies.remove("auth-storage");
      },

      login: async (email, password) => {
        try {
          const resp = await loginAction({ email, password });
          const token = resp.accessToken;
          set({ token });
          apiClient.authService.setSecurityData({ token });
        } catch {
          throw new Error(
            "Đăng nhập thất bại, vui lòng kiểm tra email/mật khẩu.",
          );
        }
      },

      // 2) Refresh token và revoke khi cần
      refreshToken: async () => {
        console.log("vao")
        const res = await refreshAction();
        if (!res.ok || !res.accessToken) {
          set({ token: null });
          apiClient.authService.setSecurityData({ token: undefined });
          throw new Error(res.error || "Refresh failed");
        }
        set({ token: res.accessToken });
        apiClient.authService.setSecurityData({ token: res.accessToken });
      },

      logout: async () => {},
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage<PersistedAuth>(() => cookieRawStorage),
      partialize: (s) => ({
        token: s.token,
        refreshTokenValue: s.refreshTokenValue,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          apiClient.authService.setSecurityData({
            token: (state as PersistedAuth).token,
          });
        }
      },
    },
  ),
);
