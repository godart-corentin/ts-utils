import { withSafeParse, type ExtractValidatorType, type Validator } from "./common";

export const nullable = <V extends Validator>(
    validator: V
): Validator<ExtractValidatorType<V> | null> => {
    return withSafeParse({
        parse(value): ExtractValidatorType<V> | null {
            if (value === null) {
                return null;
            }
            return validator.parse(value) as ExtractValidatorType<V>;
        }
    })
};
