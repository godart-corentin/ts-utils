export type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends object
        ? T[K] extends Date
          ? `${K & string}`
          : `${K & string}.${DeepKeyOf<T[K]>}`
        : K & string;
    }[keyof T]
  : "";
