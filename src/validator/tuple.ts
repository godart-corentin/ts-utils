import type { AtLeastTwo } from "../types";
import type { ExtractValidatorType, Validator } from "./common";

// Extract tuple type from array of validators
type InferTuple<T extends Validator[]> = {
    [K in keyof T]: T[K] extends Validator ? ExtractValidatorType<T[K]> : never
};

type TupleValidator<T extends Validator[]> = Validator<InferTuple<T>>;

export const tuple = <T extends Validator[]>(
    validators: AtLeastTwo<T, Validator>
): TupleValidator<T> => {
    return {
        parse(value): InferTuple<T> {
            if (!Array.isArray(value)) {
                throw new Error('Value is not an array');
            }

            if (value.length !== validators.length) {
                throw new Error(`Expected ${validators.length} elements, got ${value.length}`);
            }

            return validators.map((validator, index) =>
                validator.parse(value[index])
            ) as InferTuple<T>;
        }
    }
};
