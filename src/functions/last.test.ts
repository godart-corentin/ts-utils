import { describe, test, expect } from "vitest";
import { last } from "./last";

describe.concurrent("last", () => {
  test("if no item, returns undefined", () => {
    expect(last([])).toEqual(undefined);
  });

  test("returns last item", () => {
    expect(last([1, 2, 3])).toEqual(3);
  });
});
