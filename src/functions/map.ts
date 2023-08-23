export const map =
  <TValue, TReturnValue>(fn: (value: TValue) => TReturnValue) =>
  (value: TValue): TReturnValue =>
    fn(value);
