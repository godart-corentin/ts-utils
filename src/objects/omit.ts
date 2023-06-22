export const omit = <TObj extends object, TKey extends keyof TObj>(
  obj: TObj,
  keys: TKey[]
): Omit<TObj, TKey> =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key as TKey)) return acc;

    return {
      ...acc,
      [key]: value,
    };
  }, {} as Omit<TObj, TKey>);
