import { describe, test, expect } from "vitest";
import { chunk } from "./chunk";

describe.concurrent("chunk", () => {
  test("chunk", () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
  });
});
