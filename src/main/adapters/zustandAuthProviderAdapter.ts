import { type AuthProvider } from "@/domain/protocols";
import { useAuthStore } from "@/presentation/store";

export class ZustandAuthProviderAdapter implements AuthProvider {
  getAuth() {
    return useAuthStore.getState().auth;
  }
  resetAuth() {
    return useAuthStore.getState().resetState();
  }
}
