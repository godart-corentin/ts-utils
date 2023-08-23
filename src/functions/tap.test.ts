import { describe, expect, test, vi } from "vitest";
import { tap } from "./tap";

describe.concurrent("tap", () => {
  test("should call the function with the value", () => {
    const fn = vi.fn();
    const value = "value";
    tap(fn)(value);
    expect(fn).toHaveBeenCalledWith(value);
  });
});
