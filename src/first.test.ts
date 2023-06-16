import { describe, test, expect } from "vitest";
import { first } from "./first";

describe.concurrent("first", () => {
  test("if no item, returns undefined", () => {
    expect(first([])).toEqual(undefined);
  });

  test("returns first item", () => {
    expect(first([1, 2, 3])).toEqual(1);
  });
});
