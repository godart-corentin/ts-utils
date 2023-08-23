export const tap =
  <T>(fn: (value: T) => void) =>
  (value: T): void =>
    fn(value);
