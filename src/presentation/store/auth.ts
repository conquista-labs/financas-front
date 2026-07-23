import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GoogleAuth } from "@/domain/models";

const initialState = {
  auth: {} as GoogleAuth,
};

interface AuthState {
  auth: GoogleAuth;
  setAuth: (auth?: GoogleAuth) => void;
  resetState: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: initialState.auth,
      setAuth: (auth?: GoogleAuth) => set(() => ({ auth })),
      resetState: () => set({ auth: initialState.auth }),
      isAuthenticated: () => !!get().auth?.token,
    }),
    {
      name: "auth",
    },
  ),
);
