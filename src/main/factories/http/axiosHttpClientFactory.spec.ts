import { describe, expect, it } from "vitest";

import { AxiosHttpClient } from "@/infra/http";

import { makeAxiosHttpClient } from "./axiosHttpClientFactory";

describe("makeAxiosHttpClient", () => {
  it("deve retornar uma instância de AxiosHttpClient", () => {
    const result = makeAxiosHttpClient();
    expect(result).toBeInstanceOf(AxiosHttpClient);
  });
});
