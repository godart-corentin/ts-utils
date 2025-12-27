import type { Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError } from "../error";
import { getValueType } from "../getValueType";

type LiteralType = string | number | boolean | null | undefined;

type LiteralValidator<T extends LiteralType> = Validator<T>;

export const lit = <T extends LiteralType>(literal: T): LiteralValidator<T> => {
    return withSafeParse({
        parse(value): T {
            if (value !== literal) {
                const valueType = getValueType(value);
                throw new ValidationError([{
                    message: `Value is ${valueType}, expected literal`,
                    path: ''
                }]);
            }

            return value as T;
        }
    });
}