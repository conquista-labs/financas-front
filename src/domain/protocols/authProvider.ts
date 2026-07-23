import type { GoogleAuth } from "@/domain/models";

export interface AuthProvider {
  getAuth: () => GoogleAuth;
  resetAuth: () => void;
}
