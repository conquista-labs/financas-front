import type {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from "@/data/protocols/http";
import { HttpStatusCode } from "@/data/protocols/http";
import { navigateTo } from "@/presentation/router/router.definitions";

import { ErrorInterceptorHttpClient } from "./errorInterceptorHttpClient";

vi.mock("@/presentation/router/router.definitions", () => ({
  navigateTo: vi.fn(),
  urlRouters: {
    error: "/error",
  },
}));

const makeHttpClientStub = <T>(response: HttpResponse<T>): HttpClient => ({
  request: vi.fn().mockResolvedValue(response),
});

const fakeRequest: HttpRequest = {
  url: "/any-url",
  method: "get",
};

describe("ErrorInterceptorHttpClient", () => {
  beforeEach(() => vitest.clearAllMocks());

  it("deve redirecionar para a tela de erro se status for 500", async () => {
    const response: HttpResponse<unknown> = {
      statusCode: HttpStatusCode.serverError,
      body: undefined,
    };
    const httpClient = makeHttpClientStub(response);
    const sut = new ErrorInterceptorHttpClient(httpClient);

    const result = await sut.request(fakeRequest);

    expect(result).toEqual(response);
    expect(navigateTo).toHaveBeenCalledWith("/error");
  });

  it("não deve redirecionar se status for diferente de 500", async () => {
    const response: HttpResponse<unknown> = {
      statusCode: HttpStatusCode.ok,
      body: "ok",
    };
    const httpClient = makeHttpClientStub(response);
    const sut = new ErrorInterceptorHttpClient(httpClient);

    const result = await sut.request(fakeRequest);

    expect(result).toEqual(response);
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it("deve delegar a requisição corretamente para o httpClient original", async () => {
    const response: HttpResponse<unknown> = {
      statusCode: HttpStatusCode.ok,
      body: undefined,
    };
    const requestSpy = vi.fn().mockResolvedValue(response);
    const httpClient: HttpClient = { request: requestSpy };
    const sut = new ErrorInterceptorHttpClient(httpClient);

    await sut.request(fakeRequest);

    expect(requestSpy).toHaveBeenCalledWith(fakeRequest);
  });
});
