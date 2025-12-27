import type { AtLeastTwo } from "../../types";
import type { ExtractValidatorType, Validator } from "../common";
import { withSafeParse } from "../withSafeParse";
import { ValidationError } from "../error";
import { getValueType } from "../getValueType";

type UnionValidator<V extends Validator[]> = Validator<ExtractValidatorType<V[number]>>;

export const union = <V extends Validator[]>(
    validators: AtLeastTwo<V, Validator>
): UnionValidator<V> => {
    return withSafeParse({
        parse(value): ExtractValidatorType<V[number]> {
            for (const validator of validators) {
                try {
                    return validator.parse(value) as ExtractValidatorType<V[number]>;
                } catch (error) {
                    continue;
                }
            }

            const valueType = getValueType(value);
            throw new ValidationError([{ message: `Value is ${valueType}, expected one of the union values`, path: '' }]);
        }
    });
}