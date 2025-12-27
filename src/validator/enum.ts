import { Validator } from "./common";
import { ValidationError } from "./error";

type EnumValidator<T> = Validator<T>;

export const nativeEnum = <T extends string | number>(enumObj: Record<string, T>): EnumValidator<T> => {
    const values = Object.values<T>(enumObj);

    return {
        parse(value: unknown): T {
            const val = values.find((v) => v === value);

            if (val === undefined) {
                throw new ValidationError([{ message: 'Value is not in the enum', path: '' }]);
            }

            return val;
        }
    }
}
