import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/presentation/store";

import { ZustandAuthProviderAdapter } from "./zustandAuthProviderAdapter";

vi.mock("@/presentation/store", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

describe("ZustandAuthProviderAdapter", () => {
  const authMock = { token: "valid_token", user: { name: "John Doe" } };
  const resetStateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      auth: authMock,
      resetState: resetStateMock,
      setAuth: vitest.fn(),
    });
  });

  it("deve retornar o estado auth da store", () => {
    const adapter = new ZustandAuthProviderAdapter();
    const auth = adapter.getAuth();

    expect(auth).toEqual(authMock);
    expect(useAuthStore.getState).toHaveBeenCalled();
  });

  it("deve chamar resetState da store", () => {
    const adapter = new ZustandAuthProviderAdapter();
    adapter.resetAuth();

    expect(resetStateMock).toHaveBeenCalled();
    expect(useAuthStore.getState).toHaveBeenCalled();
  });
});
