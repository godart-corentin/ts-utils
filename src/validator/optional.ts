import type { ExtractValidatorType, Validator } from "./common";

// Overload signatures for better type inference
export function optional<V extends Validator>(
    validator: V
): Validator<ExtractValidatorType<V> | undefined>;

export function optional<V extends Validator>(
    validator: V,
    defaultValue: ExtractValidatorType<V>
): Validator<ExtractValidatorType<V>>;

// Implementation
export function optional<V extends Validator>(
    validator: V,
    defaultValue?: ExtractValidatorType<V>
): Validator<ExtractValidatorType<V> | undefined> | Validator<ExtractValidatorType<V>> {
    const hasDefault = arguments.length === 2;

    return {
        parse(value): ExtractValidatorType<V> | undefined {
            if (value === undefined) {
                return hasDefault ? defaultValue! : undefined;
            }
            return validator.parse(value) as ExtractValidatorType<V>;
        }
    };
}
