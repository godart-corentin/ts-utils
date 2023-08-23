import { describe, expect, test } from "vitest";
import { map } from "./map";

describe.concurrent("map", () => {
  test("returning the same type", () => {
    const double = map((x: number) => x * 2);
    expect(double(2)).toBe(4);

    const hello = map((x: string) => `Hello ${x}`);
    expect(hello("world")).toBe("Hello world");

    const reverseBoolean = map((x: boolean) => !x);
    expect(reverseBoolean(true)).toBe(false);

    const uppercaseArray = map((x: string[]) => x.map((y) => y.toUpperCase()));
    expect(uppercaseArray(["a", "b", "c"])).toEqual(["A", "B", "C"]);

    const uppercaseObject = map((x: Record<string, string>) =>
      Object.entries(x).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value.toUpperCase() }),
        {}
      )
    );
    expect(uppercaseObject({ a: "a", b: "b", c: "c" })).toEqual({
      a: "A",
      b: "B",
      c: "C",
    });
  });

  test("returning a different type", () => {
    const toString = map((x: number) => x.toString());
    expect(toString(2)).toBe("2");

    const stringToNumber = map((x: string) => Number(x));
    expect(stringToNumber("2")).toBe(2);

    const toBoolean = map((x: string) => Boolean(x));
    expect(toBoolean("")).toBe(false);

    const toNull = map((x) => null);
    expect(toNull("")).toBe(null);

    const toUndefined = map((x) => undefined);
    expect(toUndefined("")).toBe(undefined);

    const dateToString = map((x: Date) => x.toISOString());
    expect(dateToString(new Date("2020-01-01"))).toBe(
      "2020-01-01T00:00:00.000Z"
    );

    const arrayToString = map((x: number[]) => x.join(","));
    expect(arrayToString([1, 2, 3])).toBe("1,2,3");

    const objectToArray = map((x: Record<string, string>) =>
      Object.entries(x).map(([key, value]) => ({ key, value }))
    );
    expect(objectToArray({ a: "a", b: "b", c: "c" })).toEqual([
      { key: "a", value: "a" },
      { key: "b", value: "b" },
      { key: "c", value: "c" },
    ]);
  });
});
