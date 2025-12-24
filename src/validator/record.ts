import type { ExtractValidatorType, Validator } from "./common";

type RecordValidator<K extends Validator<string>, V extends Validator> = Validator<
    Record<ExtractValidatorType<K>, ExtractValidatorType<V>>
>;

export const record = <K extends Validator<string>, V extends Validator>(
    keyValidator: K,
    valueValidator: V
): RecordValidator<K, V> => {
    return {
        parse(value): Record<ExtractValidatorType<K>, ExtractValidatorType<V>> {
            if (value === null || value === undefined) {
                throw new Error('Value is not an object');
            }

            if (typeof value !== 'object' || Array.isArray(value) || value instanceof Date) {
                throw new Error('Value is not an object');
            }

            const result = Object.fromEntries(
                Object.entries(value).map(([key, val]) => {
                    const validatedKey = keyValidator.parse(key) as ExtractValidatorType<K>;
                    const validatedValue = valueValidator.parse(val) as ExtractValidatorType<V>;
                    return [validatedKey, validatedValue];
                })
            );

            return result as Record<ExtractValidatorType<K>, ExtractValidatorType<V>>;
        }
    }
};
