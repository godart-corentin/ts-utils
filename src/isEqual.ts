const isDate = (value: unknown): value is Date => value instanceof Date;

const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null;

export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (isDate(a) && isDate(b)) return a.getTime() === b.getTime();

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
