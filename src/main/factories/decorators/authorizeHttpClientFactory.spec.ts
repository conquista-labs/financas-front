import { describe, expect, it, vi } from "vitest";

import { type HttpClient } from "@/data/protocols/http";
import { type AuthProvider } from "@/domain/protocols";
import { AuthorizeHttpClientDecorator } from "@/main/decorators";
import { makeZustandAuthProviderFactory } from "@/main/factories/adapters";
import { makeAxiosHttpClient } from "@/main/factories/http";

import { makeAuthorizeHttpClient } from "./authorizeHttpClientFactory";

vi.mock("@/main/factories/http", () => ({
  makeAxiosHttpClient: vi.fn(),
}));

vi.mock("@/main/factories/adapters", () => ({
  makeZustandAuthProviderFactory: vi.fn(),
}));

describe("makeAuthorizeHttpClient", () => {
  it("deve instanciar AuthorizeHttpClientDecorator com as dependências corretas", () => {
    const httpClientStub: HttpClient = { request: vi.fn() };
    const authProviderStub: AuthProvider = {
      getAuth: vi.fn(),
      resetAuth: vi.fn(),
    };

    vi.mocked(makeAxiosHttpClient).mockReturnValue(httpClientStub);
    vi.mocked(makeZustandAuthProviderFactory).mockReturnValue(authProviderStub);

    const result = makeAuthorizeHttpClient();

    expect(result).toBeInstanceOf(AuthorizeHttpClientDecorator);
    expect(makeAxiosHttpClient).toHaveBeenCalled();
    expect(makeZustandAuthProviderFactory).toHaveBeenCalled();
  });
});
