import { describe, test, expect } from "vitest";
import { countBy } from "./countBy";

describe.concurrent("countBy", () => {
  test("should count by a single key", () => {
    const array = [
      { name: "Alice", age: 21 },
      { name: "Bob", age: 21 },
      { name: "Eve", age: 20 },
    ];

    expect(countBy(array, "age")).toEqual({
      20: 1,
      21: 2,
    });
  });

  test("should count by a deep key", () => {
    const array = [
      { name: "Alice", age: 21, address: { city: "London" } },
      { name: "Bob", age: 21, address: { city: "London" } },
      { name: "Eve", age: 20, address: { city: "Paris" } },
    ];

    expect(countBy(array, "address.city")).toEqual({
      London: 2,
      Paris: 1,
    });
  });
});
