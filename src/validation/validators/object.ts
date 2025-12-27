import type { ExtractValidatorType, Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError, type ValidationIssue } from "../error";
import { getValueType } from "../getValueType";

// Extract the parsed object type from a schema
type InferObjectType<Schema extends Record<string, Validator>> = {
    [K in keyof Schema]: ExtractValidatorType<Schema[K]>
};

type ObjectValidator<Schema extends Record<string, Validator>> = Validator<InferObjectType<Schema>>;

export const obj = <Schema extends Record<string, Validator>>(schema: Schema): ObjectValidator<Schema> => {
    return withSafeParse({
        parse(value): InferObjectType<Schema> {
            if (value === null || value === undefined || typeof value !== 'object' || Array.isArray(value) || value instanceof Date) {
                const valueType = getValueType(value);
                throw new ValidationError([{
                    message: `Value is ${valueType}, expected object`,
                    path: ''
                }]);
            }

            const issues: ValidationIssue[] = [];
            const result: Record<string, unknown> = {};

            Object.entries(schema).forEach(([key, validator]) => {
                const inputValue = value[key as keyof typeof value];

                try {
                    result[key] = validator.parse(inputValue);
                } catch (error) {
                    if (error instanceof ValidationError) {
                        const issuesWithPath = error.issues.map(issue => ({
                            message: issue.message,
                            path: issue.path
                                ? (issue.path.startsWith('[') ? `${key}${issue.path}` : `${key}.${issue.path}`)
                                : key
                        }));
                        issues.push(...issuesWithPath);
                    } else {
                        throw error;
                    }
                }
            });

            if (issues.length > 0) {
                throw new ValidationError(issues);
            }

            return result as InferObjectType<Schema>;
        }
    });
}