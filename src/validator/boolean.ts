import type { Validator } from "./common";

type BooleanOptions = {
    coerce?: boolean;
}

type BooleanValidator = Validator<boolean>;

const coerceBoolean = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value;
    if (value === 'true' || value === '1' || value === 1) return true;
    if (value === 'false' || value === '0' || value === 0 || value === '' || value === null || value === undefined) return false;

    return Boolean(value);
}

export const bool = (opts?: BooleanOptions): BooleanValidator => {
    return {
        parse(value): boolean {
            const val = opts?.coerce ? coerceBoolean(value) : value;

            if (typeof val !== 'boolean') {
                throw new Error('Value is not a boolean');
            }

            return val;
        }
    }
}