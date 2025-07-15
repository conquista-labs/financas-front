import { randUrl } from "@ngneat/falso";

import { HttpClientSpy } from "@/data/mocks";
import { mockGetBoletasRequest, mockGetBoletasResponse } from "@/data/mocks";
import { HttpStatusCode } from "@/data/protocols";
import { GetBoletas } from "@/data/usecases";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type { GetBoletasModel } from "@/domain/usecases";

type SutTypes = {
  sut: GetBoletas;
  httpClientSpy: HttpClientSpy<GetBoletasModel>;
};

const makeSut = (url: string = randUrl()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<GetBoletasModel>();
  const sut = new GetBoletas(url, httpClientSpy);
  return {
    sut,
    httpClientSpy,
  };
};

describe("GetBoletas", () => {
  it("should call HttpClient with correct values", async () => {
    const url = randUrl();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
    };
    await sut.get(mockGetBoletasRequest());
    expect(httpClientSpy.url).toContain(`${url}`);
    expect(httpClientSpy.method).toBe("get");
  });

  it("should throw InvalidCredentialsError if HttpClient returns 401", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized,
    };
    await expect(sut.get(mockGetBoletasRequest())).rejects.toThrow(
      new InvalidCredentialsError(),
    );
  });

  it("should throw UnexpectedError if HttpClient returns 400", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };
    await expect(sut.get(mockGetBoletasRequest())).rejects.toThrow(
      new UnexpectedError(),
    );
  });

  it("should throw UnexpectedError if HttpClient returns 500", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };
    await expect(sut.get(mockGetBoletasRequest())).rejects.toThrow(
      new UnexpectedError(),
    );
  });

  it("should throw UnexpectedError if HttpClient returns 404", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    await expect(sut.get(mockGetBoletasRequest())).rejects.toThrow(
      new UnexpectedError(),
    );
  });

  it("should return an CepModel if HttpClient returns 200", async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockGetBoletasResponse();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const response = await sut.get(mockGetBoletasRequest());
    expect(response).toEqual(httpResult);
  });
});
