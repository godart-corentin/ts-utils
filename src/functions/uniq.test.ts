import { describe, test, expect } from "vitest";
import { uniq } from "./uniq";

describe.concurrent("uniq", () => {
  test("with array of primitives", () => {
    expect(uniq([1, 2, 3])).toEqual([1, 2, 3]);
    expect(uniq([1, 2, 2, 3])).toEqual([1, 2, 3]);

    expect(uniq(["a", "b", "c"])).toEqual(["a", "b", "c"]);
    expect(uniq(["a", "b", "b", "c"])).toEqual(["a", "b", "c"]);

    expect(uniq([true, false])).toEqual([true, false]);
    expect(uniq([true, false, false])).toEqual([true, false]);

    expect(uniq([null, undefined])).toEqual([null, undefined]);
    expect(uniq([null, undefined, undefined])).toEqual([null, undefined]);
  });

  test("with array of objects", () => {
    expect(
      uniq([
        { type: "a", value: 1 },
        { type: "b", value: 2 },
        { type: "a", value: 3 },
      ])
    ).toEqual([
      { type: "a", value: 1 },
      { type: "b", value: 2 },
      { type: "a", value: 3 },
    ]);
  });

  test("with array of arrays", () => {
    expect(uniq([[1], [2], [3]])).toEqual([[1], [2], [3]]);
    expect(uniq([[1], [2], [2], [3]])).toEqual([[1], [2], [3]]);
  });

  test("with array of mixed types", () => {
    expect(uniq([1, "a", true, null, undefined])).toEqual([
      1,
      "a",
      true,
      null,
      undefined,
    ]);
    expect(
      uniq([1, "a", true, null, undefined, 1, "a", true, null, undefined])
    ).toEqual([1, "a", true, null, undefined]);
  });
});
