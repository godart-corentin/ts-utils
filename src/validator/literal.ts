import type { Validator } from "./common";

type LiteralType = string | number | boolean | null | undefined;

type LiteralValidator<T extends LiteralType> = Validator<T>;

export const lit = <T extends LiteralType>(literal: T): LiteralValidator<T> => {
    return {
        parse(value): T {
            if (value !== literal) {
                throw new Error('Value is not the literal');
            }

            return value as T;
        }
    }
}