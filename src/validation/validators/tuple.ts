import type { Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError, type ValidationIssue } from "../error";
import { getValueType } from "../getValueType";

// Extract tuple type from array of validators
export const tuple = <T extends [unknown, unknown, ...unknown[]]>(
    validators: { [K in keyof T]: Validator<T[K]> }
): Validator<T> => {
    return withSafeParse({
        parse(value): T {
            if (!Array.isArray(value)) {
                const valueType = getValueType(value);
                throw new ValidationError([{
                    message: `Value is ${valueType}, expected array`,
                    path: ''
                }]);
            }

            if (value.length !== validators.length) {
                throw new ValidationError([{ message: `Expected ${validators.length} elements, got ${value.length}`, path: '' }]);
            }

            const { result, issues } = validators.reduce<{ result: T[number][], issues: ValidationIssue[] }>((acc, validator, index) => {
                try {
                    return {
                        ...acc,
                        result: [...acc.result, validator.parse(value[index])]
                    };
                } catch (error) {
                    if (error instanceof ValidationError) {
                        // Prepend the tuple index to all issues
                        const issuesWithPath = error.issues.map(issue => ({
                            message: issue.message,
                            path: issue.path
                                ? (issue.path.startsWith('[') ? `[${index}]${issue.path}` : `[${index}].${issue.path}`)
                                : `[${index}]`
                        }));
                        return {
                            ...acc,
                            issues: [...acc.issues, ...issuesWithPath]
                        };
                    } else {
                        // Non-validation error, re-throw
                        throw error;
                    }
                }
            }, { result: [], issues: [] });

            if (issues.length > 0) {
                throw new ValidationError(issues);
            }

            return result as T;
        }
    });
};
