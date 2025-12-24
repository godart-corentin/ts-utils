import type { Validator } from "./common";

type NumberOptions = {
    min?: number;
    max?: number;
    coerce?: boolean;
}

type NumberValidator = Validator<number>;

const coerceNumber = (value: unknown): number => {
    const coerced = Number(value);
    if (Number.isNaN(coerced)) {
        throw new Error('Value cannot be coerced to a number');
    }
    return coerced;
}

export const num = (opts?: NumberOptions): NumberValidator => {
    return {
        parse(value): number {
            const val = opts?.coerce ? coerceNumber(value) : value;

            if (typeof val !== 'number') {
                throw new Error('Value is not a number');
            }

            if (opts?.min && val < opts.min) {
                throw new Error('Value is too short');
            }

            if (opts?.max && val > opts.max) {
                throw new Error('Value is too big');
            }

            return val;
        }
    }
}