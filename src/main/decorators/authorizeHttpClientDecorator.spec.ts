import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from "@/data/protocols/http";
import { HttpStatusCode } from "@/data/protocols/http";
import type { AuthProvider } from "@/domain/protocols";
import * as Router from "@/presentation/router/router.definitions";

import { AuthorizeHttpClientDecorator } from "./authorizeHttpClientDecorator";

describe("AuthorizeHttpClientDecorator", () => {
  const makeHttpRequest = (): HttpRequest => ({
    url: "/test-url",
    method: "get",
  });

  let httpClientMock: HttpClient;
  let authProviderMock: AuthProvider;
  let navigateToSpy: ReturnType<typeof vi.spyOn>;
  let resetAuthSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    httpClientMock = {
      request: vi.fn(),
    };

    resetAuthSpy = vi.fn();

    authProviderMock = {
      getAuth: vi.fn().mockReturnValue({ token: "any_token" }),
      resetAuth: resetAuthSpy,
    };

    navigateToSpy = vi.spyOn(Router, "navigateTo").mockImplementation(() => {});
  });

  it("deve adicionar o token no header se estiver presente", async () => {
    const sut = new AuthorizeHttpClientDecorator(
      httpClientMock,
      authProviderMock,
    );

    const request = makeHttpRequest();
    const expectedResponse = { statusCode: 200, body: {} };
    vi.mocked(httpClientMock.request).mockResolvedValue(expectedResponse);

    await sut.request(request);

    expect(httpClientMock.request).toHaveBeenCalledWith({
      ...request,
      headers: {
        Authorization: "Bearer any_token",
      },
    });
  });

  it("não deve adicionar Authorization se não houver token", async () => {
    authProviderMock.getAuth = vi.fn().mockReturnValue({ token: "" });

    const sut = new AuthorizeHttpClientDecorator(
      httpClientMock,
      authProviderMock,
    );

    const request = makeHttpRequest();
    const expectedResponse = { statusCode: 200, body: {} };
    vi.mocked(httpClientMock.request).mockResolvedValue(expectedResponse);

    await sut.request(request);

    expect(httpClientMock.request).toHaveBeenCalledWith(request);
  });

  it("deve redirecionar e resetar auth em caso de 401", async () => {
    const sut = new AuthorizeHttpClientDecorator(
      httpClientMock,
      authProviderMock,
    );

    const request = makeHttpRequest();
    const unauthorizedResponse: HttpResponse<unknown> = {
      statusCode: HttpStatusCode.unauthorized,
      body: {},
    };
    vi.mocked(httpClientMock.request).mockResolvedValue(unauthorizedResponse);

    await sut.request(request);

    expect(navigateToSpy).toHaveBeenCalledWith(Router.urlRouters.login);

    // Espera para setTimeout simular
    await new Promise((r) => setTimeout(r, 60));

    expect(resetAuthSpy).toHaveBeenCalled();
  });

  it("deve apenas retornar o response em status != 401", async () => {
    const sut = new AuthorizeHttpClientDecorator(
      httpClientMock,
      authProviderMock,
    );

    const request = makeHttpRequest();
    const expectedResponse = {
      statusCode: HttpStatusCode.ok,
      body: { data: 123 },
    };
    vi.mocked(httpClientMock.request).mockResolvedValue(expectedResponse);

    const response = await sut.request(request);

    expect(response).toEqual(expectedResponse);
    expect(navigateToSpy).not.toHaveBeenCalled();
    expect(resetAuthSpy).not.toHaveBeenCalled();
  });
});
