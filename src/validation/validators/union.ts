import type { Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError } from "../error";
import { getValueType } from "../getValueType";

// Extract union type from array of validators
export const union = <T extends [unknown, unknown, ...unknown[]]>(
    validators: { [K in keyof T]: Validator<T[K]> }
): Validator<T[number]> => {
    return withSafeParse({
        parse(value): T[number] {
            for (const validator of validators) {
                try {
                    return validator.parse(value);
                } catch (error) {
                    continue;
                }
            }

            const valueType = getValueType(value);
            throw new ValidationError([{ message: `Value is ${valueType}, expected one of the union values`, path: '' }]);
        }
    });
}