export type AtLeastTwo<T extends C[], C = unknown> =
    T extends [C, C, ...C[]]
    ? T
    : never;
