import type { ExtractValidatorType, Validator } from "./common";

export const nullable = <V extends Validator>(
    validator: V
): Validator<ExtractValidatorType<V> | null> => {
    return {
        parse(value): ExtractValidatorType<V> | null {
            if (value === null) {
                return null;
            }
            return validator.parse(value) as ExtractValidatorType<V>;
        }
    }
};
