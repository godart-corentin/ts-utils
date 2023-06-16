type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends object
        ? `${K & string}.${DeepKeyOf<T[K]>}`
        : K & string;
    }[keyof T]
  : "";

const isDeepKeyOf = <TObj extends object>(
  key: unknown
): key is DeepKeyOf<TObj> => typeof key === "string" && key.includes(".");

type SplitedDeepKey<TObj extends object> = {
  firstKey: keyof TObj;
  restKeys: DeepKeyOf<TObj>;
};

const splitDeepKey = <TObj extends object>(
  key: DeepKeyOf<TObj>
): SplitedDeepKey<TObj> => {
  const [firstKey, ...restKeys] = key.split(".") as [
    keyof TObj,
    ...DeepKeyOf<TObj>[]
  ];

  return {
    firstKey,
    restKeys: restKeys.join(".") as DeepKeyOf<TObj>,
  };
};

export const groupBy = <TObj extends object, TKey extends DeepKeyOf<TObj>>(
  array: TObj[],
  key: TKey
): Record<string, TObj[]> => {
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

  return array.reduce<Record<string, TObj[]>>((acc, obj) => {
    const value = getValue(obj, key);

    if (value === undefined) return acc;

    if (value) {
      acc[value] = [...(acc[value] || []), obj];
    }
    return acc;
  }, {});
};
