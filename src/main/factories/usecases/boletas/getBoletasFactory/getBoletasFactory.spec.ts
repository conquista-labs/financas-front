import { describe, expect, it, vi } from "vitest";

import { GetBoletas } from "@/data/usecases";
import type { AxiosHttpClient } from "@/infra";
import * as httpFactory from "@/main/factories/http";

import { makeBoletasFactory } from "./getBoletasFactory";

describe("makeBoletasFactory", () => {
  it("should create an instance of GetBoletas with correct arguments", () => {
    const mockUrl = "/v1/boletas";
    const fakeUrl = "http://fake-api.com";
    const fakeHttpClient = {} as AxiosHttpClient;

    const makeApiUrlSpy = vi
      .spyOn(httpFactory, "makeApiUrl")
      .mockReturnValue(fakeUrl);
    const makeAxiosHttpClientSpy = vi
      .spyOn(httpFactory, "makeAxiosHttpClient")
      .mockReturnValue(fakeHttpClient);

    const instance = makeBoletasFactory();

    expect(instance).toBeInstanceOf(GetBoletas);
    expect(makeApiUrlSpy).toHaveBeenCalledWith(mockUrl);
    expect(makeAxiosHttpClientSpy).toHaveBeenCalled();
  });
});
