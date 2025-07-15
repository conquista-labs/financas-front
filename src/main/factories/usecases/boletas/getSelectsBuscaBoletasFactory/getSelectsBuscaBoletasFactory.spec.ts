import { describe, expect, it, vi } from "vitest";

import { GetSelectsBuscaBoletas } from "@/data/usecases";
import type { AxiosHttpClient } from "@/infra";
import * as decoratorFactory from "@/main/factories/decorators";
import * as httpFactory from "@/main/factories/http";

import { makeGetSelectsBuscaBoletasFactory } from "./getSelectsBuscaBoletasFactory";

describe("makeGetSelectsBuscaBoletasFactory", () => {
  it("should create an instance of GetBoletas with correct arguments", () => {
    const mockUrl = "/v1/boletas/selects";
    const fakeUrl = "http://fake-url.com";
    const fakeHttpClient = {} as AxiosHttpClient;

    const makeApiUrlSpy = vi
      .spyOn(httpFactory, "makeApiUrl")
      .mockReturnValue(fakeUrl);
    const makeAuthorizeHttpClientSpy = vi
      .spyOn(decoratorFactory, "makeAuthorizeHttpClient")
      .mockReturnValue(fakeHttpClient);

    const instance = makeGetSelectsBuscaBoletasFactory();

    expect(instance).toBeInstanceOf(GetSelectsBuscaBoletas);
    expect(makeApiUrlSpy).toHaveBeenCalledWith(mockUrl);
    expect(makeAuthorizeHttpClientSpy).toHaveBeenCalled();
  });
});
