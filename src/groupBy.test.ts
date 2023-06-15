import { describe, test, expect } from "vitest";
import { groupBy } from "./groupBy";

describe.concurrent("groupBy", () => {
  test.concurrent("groups by key", () => {
    const data = [
      { type: "a", value: 1 },
      { type: "b", value: 2 },
      { type: "a", value: 3 },
    ];

    const result = groupBy(data, "type");

    expect(result).toEqual({
      a: [
        { type: "a", value: 1 },
        { type: "a", value: 3 },
      ],
      b: [{ type: "b", value: 2 }],
    });
  });

  test.concurrent("groups by deep key", () => {
    const data = [
      { type: { value: "a" }, value: 1 },
      { type: { value: "b" }, value: 2 },
      { type: { value: "a" }, value: 3 },
    ];

    const result = groupBy(data, "type.value");

    expect(result).toEqual({
      a: [
        { type: { value: "a" }, value: 1 },
        { type: { value: "a" }, value: 3 },
      ],
      b: [{ type: { value: "b" }, value: 2 }],
    });
  });
});
