import { type Validator } from "../common";
import { withSafeParse } from "../withSafeParse";

export const nullable = <T>(
    validator: Validator<T>
): Validator<T | null> => {
    return withSafeParse({
        parse(value): T | null {
            if (value === null) {
                return null;
            }
            return validator.parse(value);
        }
    })
};
