import { DeepKeyOf, isDeepKeyOf, splitDeepKey } from "../shared/deepKey";

export const countBy = <TObj extends object, TKey extends DeepKeyOf<TObj>>(
  array: TObj[],
  key: TKey
): Record<string, number> => {
  const getValue = (
    obj: TObj,
    key: DeepKeyOf<TObj> | keyof TObj
  ): string | undefined => {
    if (isDeepKeyOf<TObj>(key)) {
      const { firstKey, restKeys } = splitDeepKey<TObj>(key);
      return getValue(obj[firstKey], restKeys);
    }

    return obj[key];
  };

  return array.reduce<Record<string, number>>((acc, obj) => {
    const value = getValue(obj, key);

    if (value === undefined) return acc;

    return {
      ...acc,
      [value]: (acc[value] || 0) + 1,
    };
  }, {});
};
