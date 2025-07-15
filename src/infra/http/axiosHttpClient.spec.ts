import * as faker from "@ngneat/falso";
import type axios from "axios";
import type { Mocked, MockInstance } from "vitest";
import { describe, expect, it, vi } from "vitest";

import { mockHttpRequest } from "@/data/mocks";
import { mockAxios, mockHttpResponse } from "@/infra/mocks";

import { AxiosHttpClient } from "./axiosHttpClient";

vi.mock("axios");

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: Mocked<typeof axios>;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios({
    content: faker.randJSON(),
    message: faker.randPhrase(),
  });
  return {
    sut,
    mockedAxios,
  };
};

describe.skip("AxiosHttpClient", () => {
  it("should call axios with correct values", async () => {
    const request = mockHttpRequest();
    const { sut, mockedAxios } = makeSut();
    await sut.request(request);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      data: request.body,
      headers: request.headers,
      method: request.method,
      params: request.params,
    });
  });

  it("should return correct response", async () => {
    const { sut, mockedAxios } = makeSut();
    const httpResponse = await sut.request(mockHttpRequest());
    const axiosResponse = await mockedAxios.request.mock.results[0].value;

    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
      message: axiosResponse.data.message,
    });
  });

  it("should return correct error", () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      response: mockHttpResponse(),
    });
    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });

  it("should return correct error response when axios throws an AxiosError", async () => {
    const { sut, mockedAxios } = makeSut();
    const mockErrorResponse = {
      response: mockHttpResponse(),
    };
    (mockedAxios.isAxiosError as MockInstance) = vi
      .fn()
      .mockReturnValueOnce(true);
    mockedAxios.request.mockRejectedValueOnce({
      ...mockErrorResponse,
      isAxiosError: true, // Simula um erro identificado pelo isAxiosError
    });

    const httpResponse = await sut.request(mockHttpRequest());

    expect(httpResponse).toEqual({
      statusCode: mockErrorResponse.response.status,
      body: mockErrorResponse.response.data,
      message: "Unknown error",
    });
  });

  it("should return a server error response when axios throws a non-AxiosError", async () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce(new Error("Unexpected error"));

    const httpResponse = await sut.request(mockHttpRequest());

    expect(httpResponse).toEqual({
      statusCode: 500, // serverError
      body: null,
      message: "An unexpected error occurred",
    });
  });

  it("should return a default error response when axios error response is undefined", async () => {
    const { sut, mockedAxios } = makeSut();
    (mockedAxios.isAxiosError as MockInstance) = vi
      .fn()
      .mockReturnValueOnce(true);
    mockedAxios.request.mockRejectedValueOnce({
      isAxiosError: true,
      response: undefined, // Sem resposta no erro
    });

    const httpResponse = await sut.request(mockHttpRequest());

    expect(httpResponse).toEqual({
      statusCode: 500, // serverError como fallback
      body: null,
      message: "Unknown error",
    });
  });
});
