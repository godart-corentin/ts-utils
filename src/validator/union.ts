import type { AtLeastTwo } from "../types";
import type { ExtractValidatorType, Validator } from "./common";

type UnionValidator<V extends Validator[]> = Validator<ExtractValidatorType<V[number]>>;

export const union = <V extends Validator[]>(
    validators: AtLeastTwo<V, Validator>
): UnionValidator<V> => {
    return {
        parse(value): ExtractValidatorType<V[number]> {
            for (const validator of validators) {
                try {
                    return validator.parse(value) as ExtractValidatorType<V[number]>;
                } catch (error) {
                    continue;
                }
            }

            throw new Error('Value is not valid');
        }
    }
}