import { describe, expect, it } from "vitest";

import { getNameInitials } from "./getNameInitials";

describe("getNameInitials", () => {
  it("should return the uppercase initial for a single-word name", () => {
    expect(getNameInitials("John")).toBe("J");
  });

  it("should return the initials of the first and last word", () => {
    expect(getNameInitials("John Doe")).toBe("JD");
  });

  it("should return an empty string for an empty name", () => {
    expect(getNameInitials("")).toBe("");
  });
});
