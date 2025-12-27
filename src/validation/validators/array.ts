import type { ExtractValidatorType, Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError, type ValidationIssue } from "../error";
import { getValueType } from "../getValueType";

type ArrayOptions = {
    minLen?: number;
    maxLen?: number;
}

type ArrayValidator<V extends Validator> = Validator<ExtractValidatorType<V>[]>;

export const arr = <V extends Validator>(arrayValidator: V, opts?: ArrayOptions): ArrayValidator<V> => {
    return withSafeParse({
        parse(value): ExtractValidatorType<V>[] {
            if (!Array.isArray(value)) {
                const valueType = getValueType(value);
                throw new ValidationError([{
                    message: `Value is ${valueType}, expected array`,
                    path: ''
                }]);
            }

            if (opts?.minLen && value.length < opts.minLen) {
                throw new ValidationError([{ message: `Value is too short, expected at least ${opts.minLen} elements`, path: '' }]);
            }

            if (opts?.maxLen && value.length > opts.maxLen) {
                throw new ValidationError([{ message: `Value is too long, expected at most ${opts.maxLen} elements`, path: '' }]);
            }

            const issues: ValidationIssue[] = [];
            const result: unknown[] = [];

            value.forEach((item, index) => {
                try {
                    result.push(arrayValidator.parse(item));
                } catch (error) {
                    if (error instanceof ValidationError) {
                        // Prepend the array index to all issues
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

            return result as ExtractValidatorType<V>[];
        }
    });
}
