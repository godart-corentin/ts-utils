import type { Validator } from "./common";
import { ValidationError } from "./error";

type NumberOptions = {
    min?: number;
    max?: number;
    coerce?: boolean;
}

type NumberValidator = Validator<number>;

const coerceNumber = (value: unknown): number => {
    const coerced = Number(value);
    if (Number.isNaN(coerced)) {
        throw new ValidationError([{ message: 'Value cannot be coerced to a number', path: '' }]);
    }
    return coerced;
}

export const num = (opts?: NumberOptions): NumberValidator => {
    return {
        parse(value): number {
            const val = opts?.coerce ? coerceNumber(value) : value;

            if (typeof val !== 'number') {
                throw new ValidationError([{ message: 'Value is not a number', path: '' }]);
            }

            if (opts?.min && val < opts.min) {
                throw new ValidationError([{ message: 'Value is too short', path: '' }]);
            }

            if (opts?.max && val > opts.max) {
                throw new ValidationError([{ message: 'Value is too big', path: '' }]);
            }

            return val;
        }
    }
}