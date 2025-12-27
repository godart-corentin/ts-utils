import type { Validator } from "./common";
import { ValidationError } from "./error";

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
                throw new ValidationError([{ message: 'Value is not a string', path: '' }]);
            }

            if (opts?.minLen && val.length < opts.minLen) {
                throw new ValidationError([{ message: 'Value is too short', path: '' }]);
            }

            if (opts?.maxLen && val.length > opts.maxLen) {
                throw new ValidationError([{ message: 'Value is too long', path: '' }]);
            }

            if (opts?.pattern && !new RegExp(opts.pattern).test(val)) {
                throw new ValidationError([{ message: 'Value does not match the pattern', path: '' }]);
            }

            return val;
        }
    }
}