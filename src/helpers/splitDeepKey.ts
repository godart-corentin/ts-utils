import { DeepKeyOf } from "../types";

type SplitedDeepKey<TObj extends object> = {
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
