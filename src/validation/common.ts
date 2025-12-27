import { ValidationIssue } from "./error";

export type SafeParseResult<T> = {
    type: 'success';
    data: T;
} | {
    type: 'error';
    issues: ValidationIssue[];
}

export type Validator<T = unknown> = {
    parse: (value: unknown) => T;
    safeParse: (value: unknown) => SafeParseResult<T>;
}

export type ExtractValidatorType<V> = V extends Validator<infer T> ? T : never;