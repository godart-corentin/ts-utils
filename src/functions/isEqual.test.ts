import { describe, test, expect } from "vitest";
import { isEqual } from "./isEqual";

describe.concurrent("isEqual", () => {
  test("with primitives", () => {
    expect(isEqual(1, 1)).toEqual(true);
    expect(isEqual(1, 2)).toEqual(false);

    expect(isEqual("a", "a")).toEqual(true);
    expect(isEqual("a", "b")).toEqual(false);

    expect(isEqual(true, true)).toEqual(true);
    expect(isEqual(true, false)).toEqual(false);

    expect(isEqual(null, null)).toEqual(true);
    expect(isEqual(null, undefined)).toEqual(false);
    expect(isEqual(undefined, undefined)).toEqual(true);

    expect(isEqual(Symbol("a"), Symbol("a"))).toEqual(false); // Symbols are unique
    expect(isEqual(Symbol("a"), Symbol("b"))).toEqual(false);

    expect(isEqual(0, false)).toEqual(false);
    expect(isEqual(1, true)).toEqual(false);
    expect(isEqual(1, "1")).toEqual(false);
  });

  test("with dates", () => {
    expect(isEqual(new Date("2020-01-01"), new Date("2020-01-01"))).toEqual(
      true
    );
    expect(isEqual(new Date("2020-01-01"), new Date("2020-01-02"))).toEqual(
      false
    );
  });

  test("with arrays", () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toEqual(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toEqual(false);
  });

  test("with one level deep objects", () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toEqual(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toEqual(false);
    expect(isEqual({ a: "a" }, { a: "a" })).toEqual(true);
    expect(isEqual({ a: "a" }, { a: "b" })).toEqual(false);
    expect(isEqual({ a: true }, { a: true })).toEqual(true);
    expect(isEqual({ a: true }, { a: false })).toEqual(false);
  });

  test("with more levels deep objects", () => {
    expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toEqual(true);
    expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toEqual(false);
    expect(isEqual({ a: { b: "a" } }, { a: { b: "a" } })).toEqual(true);
    expect(isEqual({ a: { b: "a" } }, { a: { b: "b" } })).toEqual(false);
    expect(isEqual({ a: { b: true } }, { a: { b: true } })).toEqual(true);
    expect(isEqual({ a: { b: true } }, { a: { b: false } })).toEqual(false);
  });
});
