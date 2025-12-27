import type { AtLeastTwo } from "../types";
import type { ExtractValidatorType, Validator } from "./common";
import { ValidationError, type ValidationIssue } from "./error";

// Extract tuple type from array of validators
type InferTuple<T extends Validator[]> = {
    [K in keyof T]: T[K] extends Validator ? ExtractValidatorType<T[K]> : never
};

type TupleValidator<T extends Validator[]> = Validator<InferTuple<T>>;

export const tuple = <T extends Validator[]>(
    validators: AtLeastTwo<T, Validator>
): TupleValidator<T> => {
    return {
        parse(value): InferTuple<T> {
            if (!Array.isArray(value)) {
                throw new ValidationError([{ message: 'Value is not an array', path: '' }]);
            }

            if (value.length !== validators.length) {
                throw new ValidationError([{ message: `Expected ${validators.length} elements, got ${value.length}`, path: '' }]);
            }

            const issues: ValidationIssue[] = [];
            const result: unknown[] = [];

            validators.forEach((validator, index) => {
                try {
                    result.push(validator.parse(value[index]));
                } catch (error) {
                    if (error instanceof ValidationError) {
                        // Prepend the tuple index to all issues
                        const issuesWithPath = error.issues.map(issue => ({
                            message: issue.message,
                            path: issue.path
                                ? (issue.path.startsWith('[') ? `[${index}]${issue.path}` : `[${index}].${issue.path}`)
                                : `[${index}]`
                        }));
                        issues.push(...issuesWithPath);
                    } else {
                        // Non-validation error, re-throw
                        throw error;
                    }
                }
            });

            if (issues.length > 0) {
                throw new ValidationError(issues);
            }

            return result as InferTuple<T>;
        }
    }
};
