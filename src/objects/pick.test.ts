import { describe, expect, test } from "vitest";
import { pick } from "./pick";

describe.concurrent("pick", () => {
  test("with a simple object", () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  test("with a deep object", () => {
    expect(pick({ a: 1, b: { c: 2, d: 3 } }, ["b"])).toEqual({
      b: { c: 2, d: 3 },
    });
  });
});
