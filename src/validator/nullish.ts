import type { ExtractValidatorType, Validator } from "./common";
import { withSafeParse } from "./common";

// Overload signatures for better type inference
export function nullish<V extends Validator>(
    validator: V
): Validator<ExtractValidatorType<V> | null | undefined>;

export function nullish<V extends Validator>(
    validator: V,
    defaultValue: ExtractValidatorType<V>
): Validator<ExtractValidatorType<V>>;

// Implementation
export function nullish<V extends Validator>(
    validator: V,
    defaultValue?: ExtractValidatorType<V>
): Validator<ExtractValidatorType<V> | null | undefined> | Validator<ExtractValidatorType<V>> {
    const hasDefault = arguments.length === 2;

    return withSafeParse({
        parse(value): ExtractValidatorType<V> | null | undefined {
            if (value === null || value === undefined) {
                return hasDefault ? defaultValue! : value;
            }
            return validator.parse(value) as ExtractValidatorType<V>;
        }
    });
}
