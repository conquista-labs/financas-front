import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Auth } from "@/domain/models";

const initialState = {
  auth: {} as Auth,
};

interface AuthState {
  auth: Auth;
  setAuth: (auth?: Auth) => void;
  resetState: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: initialState.auth,
      setAuth: (auth?: Auth) => set(() => ({ auth })),
      resetState: () => set({ auth: initialState.auth }),
      isAuthenticated: () => !!get().auth?.access_token,
    }),
    {
      name: "auth",
    },
  ),
);
