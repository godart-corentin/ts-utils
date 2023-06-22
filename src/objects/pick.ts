export const pick = <TObj extends object, TKey extends keyof TObj>(
  obj: TObj,
  keys: TKey[]
): Pick<TObj, TKey> =>
  keys.reduce(
    (acc, key) => ({ ...acc, [key]: obj[key] }),
    {} as Pick<TObj, TKey>
  );
