import { describe, expect, test } from "vitest";
import { omit } from "./omit";

describe.concurrent("omit", () => {
  test("with a simple object", () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ b: 2 });
  });

  test("with a deep object", () => {
    expect(omit({ a: 1, b: { c: 2, d: 3 } }, ["b"])).toEqual({
      a: 1,
    });
  });
});
