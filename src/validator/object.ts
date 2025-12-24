import type { ExtractValidatorType, Validator } from "./common";

// Extract the parsed object type from a schema
type InferObjectType<Schema extends Record<string, Validator>> = {
    [K in keyof Schema]: ExtractValidatorType<Schema[K]>
};

type ObjectValidator<Schema extends Record<string, Validator>> = Validator<InferObjectType<Schema>>;

export const obj = <Schema extends Record<string, Validator>>(schema: Schema): ObjectValidator<Schema> => {
    return {
        parse(value): InferObjectType<Schema> {
            if (value === null || value === undefined) {
                throw new Error('Value is not an object');
            }

            if (typeof value !== 'object' || Array.isArray(value) || value instanceof Date) {
                throw new Error('Value is not an object');
            }

            const result = Object.fromEntries(
                Object.entries(schema).map(([key, validator]) => {
                    const inputValue = value[key as keyof typeof value];

                    // Let the validator handle undefined - this allows optional() with defaults to work
                    return [key, validator.parse(inputValue)];
                })
            );

            return result as InferObjectType<Schema>;
        }
    }
}