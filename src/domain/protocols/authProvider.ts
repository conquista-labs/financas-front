import type { Auth } from "@/domain/models";

export interface AuthProvider {
  getAuth: () => Auth;
  resetAuth: () => void;
}
