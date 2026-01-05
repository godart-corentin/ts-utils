import type { Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError, type ValidationIssue } from "../error";
import { getValueType } from "../getValueType";

type RecordValidator<K extends PropertyKey, V> = Validator<
    Record<K, V>
>;

export const record = <K extends PropertyKey, V>(
    keyValidator: Validator<K>,
    valueValidator: Validator<V>
): RecordValidator<K, V> => {
    return withSafeParse({
        parse(value): Record<K, V> {
            if (value === null || value === undefined || typeof value !== 'object' || Array.isArray(value) || value instanceof Date) {
                const valueType = getValueType(value);
                throw new ValidationError([{ message: `Value is ${valueType}, expected object`, path: '' }]);
            }

            const { result, issues } = Object.entries(value).reduce<{ result: Partial<Record<K, V>>, issues: ValidationIssue[] }>((acc, [key, val]) => {
                try {
                    keyValidator.parse(key);
                } catch (error) {
                    if (error instanceof ValidationError) {
                        const issuesWithPath = error.issues.map(issue => ({
                            message: issue.message,
                            path: `<key: ${key}>`
                        }));
                        return {
                            ...acc,
                            issues: [...acc.issues, ...issuesWithPath]
                        };
                    } else {
                        throw error;
                    }
                }

                try {
                    const parsedValue = valueValidator.parse(val);
                    return {
                        ...acc,
                        result: { ...acc.result, [key]: parsedValue }
                    };
                } catch (error) {
                    if (error instanceof ValidationError) {
                        const issuesWithPath = error.issues.map(issue => ({
                            message: issue.message,
                            path: issue.path
                                ? (issue.path.startsWith('[') ? `${key}${issue.path}` : `${key}.${issue.path}`)
                                : key
                        }));
                        return {
                            ...acc,
                            issues: [...acc.issues, ...issuesWithPath]
                        };
                    } else {
                        throw error;
                    }
                }
            }, { result: {}, issues: [] });

            if (issues.length > 0) {
                throw new ValidationError(issues);
            }

            return result as Record<K, V>;
        }
    });
};
