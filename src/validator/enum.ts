import { Validator } from "./common";
import { withSafeParse } from "./common";
import { ValidationError } from "./error";

type EnumValidator<T> = Validator<T>;

export const nativeEnum = <T extends Record<string, string | number>>(enumObj: T): EnumValidator<T[keyof T]> => {
    const values = Object.values(enumObj) as Array<T[keyof T]>;
    return withSafeParse({
        parse(value): T[keyof T] {
            const val = values.find((v) => v === value);

            if (val === undefined) {
                throw new ValidationError([{ message: 'Value is not in the enum', path: '' }]);
            }

            return val;
        }
    });
}
