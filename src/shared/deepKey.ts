export type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends object
        ? `${K & string}.${DeepKeyOf<T[K]>}`
        : K & string;
    }[keyof T]
  : "";

export const isDeepKeyOf = <TObj extends object>(
  key: unknown
): key is DeepKeyOf<TObj> => typeof key === "string" && key.includes(".");

export type SplitedDeepKey<TObj extends object> = {
  firstKey: keyof TObj;
  restKeys: DeepKeyOf<TObj>;
};

export const splitDeepKey = <TObj extends object>(
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
