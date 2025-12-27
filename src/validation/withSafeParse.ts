import { SafeParseResult, Validator } from "./common";
import { ValidationError } from "./error";

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