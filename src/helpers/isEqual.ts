import { isDate, isObject } from "../typeguards";

export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (isDate(a) && isDate(b)) return a.getTime() === b.getTime();

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((el, index) => el === b[index]);
  }

  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a) as (keyof typeof a)[];
    const bKeys = Object.keys(b) as (keyof typeof b)[];

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
};
