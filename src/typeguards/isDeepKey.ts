import { DeepKeyOf } from "../types";

export const isDeepKey = <TObj extends object>(
  key: unknown
): key is DeepKeyOf<TObj> => typeof key === "string" && key.includes(".");
