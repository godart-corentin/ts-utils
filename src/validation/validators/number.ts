import type { Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError } from "../error";
import { getValueType } from "../getValueType";

type NumberOptions = {
    min?: number;
    max?: number;
    coerce?: boolean;
}

const coerceNumber = (value: unknown): number => {
    const coerced = Number(value);
    if (Number.isNaN(coerced)) {
        throw new ValidationError([{ message: 'Value cannot be coerced to a number', path: '' }]);
    }
    return coerced;
}

export const num = (opts?: NumberOptions): Validator<number> => {
    return withSafeParse({
        parse(value): number {
            const val = opts?.coerce ? coerceNumber(value) : value;

            if (typeof val !== 'number') {
                const valueType = getValueType(val);
                throw new ValidationError([{
                    message: `Value is ${valueType}, expected number`,
                    path: ''
                }]);
            }

            if (opts?.min && val < opts.min) {
                throw new ValidationError([{ message: `Value is too small, expected at least ${opts.min}`, path: '' }]);
            }

            if (opts?.max && val > opts.max) {
                throw new ValidationError([{ message: `Value is too big, expected at most ${opts.max}`, path: '' }]);
            }

            return val;
        }
    });
}