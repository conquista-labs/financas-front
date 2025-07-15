import { describe, expect, it } from "vitest";

import { ZustandAuthProviderAdapter } from "@/main/adapters";

import { makeZustandAuthProviderFactory } from "./zustandAuthProviderFactory";

describe("makeZustandAuthProviderFactory", () => {
  it("deve retornar uma instância de ZustandAuthProviderAdapter", () => {
    const result = makeZustandAuthProviderFactory();
    expect(result).toBeInstanceOf(ZustandAuthProviderAdapter);
  });
});
