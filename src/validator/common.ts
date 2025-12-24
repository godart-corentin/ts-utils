export type Validator<T = unknown> = {
    parse: (value: unknown) => T;
}

export type ExtractValidatorType<V> = V extends Validator<infer T> ? T : never;