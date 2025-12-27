import type { Validator } from "../../common";
import { withSafeParse } from "../../withSafeParse";
import { ValidationError } from "../../error";
import { getValueType } from "../../getValueType";

type StringOptions = {
    minLen?: number;
    maxLen?: number;
    pattern?: string;
    coerce?: boolean;
}

const coerceString = (value: unknown): string => String(value);

export const str = (opts?: StringOptions): Validator<string> => {
    return withSafeParse({
        parse(value): string {
            const val = opts?.coerce ? coerceString(value) : value;

            if (typeof val !== 'string') {
                const valueType = getValueType(val);
                throw new ValidationError([{
                    message: `Value is ${valueType}, expected string`,
                    path: ''
                }]);
            }

            if (opts?.minLen && val.length < opts.minLen) {
                throw new ValidationError([{ message: `Value is too short, expected at least ${opts.minLen} characters`, path: '' }]);
            }

            if (opts?.maxLen && val.length > opts.maxLen) {
                throw new ValidationError([{ message: `Value is too long, expected at most ${opts.maxLen} characters`, path: '' }]);
            }

            if (opts?.pattern && !new RegExp(opts.pattern).test(val)) {
                throw new ValidationError([{ message: 'Value does not match the pattern', path: '' }]);
            }

            return val;
        }
    });
}
