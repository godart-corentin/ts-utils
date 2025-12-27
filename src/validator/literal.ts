import type { Validator } from "./common";
import { ValidationError } from "./error";

type LiteralType = string | number | boolean | null | undefined;

type LiteralValidator<T extends LiteralType> = Validator<T>;

export const lit = <T extends LiteralType>(literal: T): LiteralValidator<T> => {
    return {
        parse(value): T {
            if (value !== literal) {
                throw new ValidationError([{ message: 'Value is not the literal', path: '' }]);
            }

            return value as T;
        }
    }
}