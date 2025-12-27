import { Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError } from "../error";
import { getValueType } from "../getValueType";

type EnumValidator<T> = Validator<T>;

export const nativeEnum = <T extends Record<string, string | number>>(enumObj: T): EnumValidator<T[keyof T]> => {
    const values = Object.values(enumObj) as Array<T[keyof T]>;
    return withSafeParse({
        parse(value): T[keyof T] {
            const val = values.find((v) => v === value);

            if (val === undefined) {
                const valueType = getValueType(value);
                throw new ValidationError([{
                    message: `Value is ${valueType}, expected value from enum`,
                    path: ''
                }]);
            }

            return val;
        }
    });
}
