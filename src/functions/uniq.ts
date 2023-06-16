import { isEqual } from "./isEqual";

export const uniq = <T>(array: T[]): T[] =>
  array.reduce<T[]>((acc, item) => {
    if (
      acc.findIndex((a) => {
        return isEqual(a, item);
      }) > -1
    )
      return acc;

    return [...acc, item];
  }, []);
