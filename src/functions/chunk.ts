import { last } from "./last";

export const chunk = <T>(array: T[], size: number): T[][] =>
  array.reduce<T[][]>((acc, item) => {
    if (acc.length === 0) return [[item]];

    const lastChunk = last(acc);

    if (lastChunk !== undefined && lastChunk.length < size) {
      return [...acc.slice(0, -1), [...lastChunk, item]];
    }

    return [...acc, [item]];
  }, []);
