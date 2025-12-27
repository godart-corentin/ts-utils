import { ValidationError, ValidationIssue } from "./error";

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

/**
 * Helper to add safeParse method to any validator
 * This avoids duplicating the try/catch logic in every validator
 */
export function withSafeParse<T>(validator: { parse: (value: unknown) => T }): Validator<T> {
    return {
        parse: validator.parse.bind(validator),
        safeParse(value: unknown): SafeParseResult<T> {
            try {
                return {
                    type: 'success',
                    data: validator.parse(value)
                };
            } catch (error) {
                if (error instanceof ValidationError) {
                    return {
                        type: 'error',
                        issues: error.issues
                    };
                }
                throw error;
            }
        }
    };
}