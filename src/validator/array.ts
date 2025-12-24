import type { ExtractValidatorType, Validator } from "./common";

type ArrayOptions = {
    minLen?: number;
    maxLen?: number;
}

type ArrayValidator<V extends Validator> = Validator<ExtractValidatorType<V>[]>;

export const arr = <V extends Validator>(arrayValidator: V, opts?: ArrayOptions): ArrayValidator<V> => {
    return {
        parse(value): ExtractValidatorType<V>[] {
            if (!Array.isArray(value)) {
                throw new Error('Value is not an array');
            }

            if (opts?.minLen && value.length < opts.minLen) {
                throw new Error('Value is too short');
            }

            if (opts?.maxLen && value.length > opts.maxLen) {
                throw new Error('Value is too long');
            }

            return value.map(item => arrayValidator.parse(item)) as ExtractValidatorType<V>[];
        }
    }
}
