import type { Validator } from "./common";

type StringOptions = {
    minLen?: number;
    maxLen?: number;
    pattern?: string;
    coerce?: boolean;
}

type StringValidator = Validator<string>;

const coerceString = (value: unknown): string => String(value);

export const str = (opts?: StringOptions): StringValidator => {
    return {
        parse(value): string {
            const val = opts?.coerce ? coerceString(value) : value;

            if (typeof val !== 'string') {
                throw new Error('Value is not a string');
            }

            if (opts?.minLen && val.length < opts.minLen) {
                throw new Error('Value is too short');
            }

            if (opts?.maxLen && val.length > opts.maxLen) {
                throw new Error('Value is too long');
            }

            if (opts?.pattern && !new RegExp(opts.pattern).test(val)) {
                throw new Error('Value does not match the pattern');
            }

            return val;
        }
    }
}