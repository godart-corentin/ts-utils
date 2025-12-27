import type { Validator } from "../../common";
import { withSafeParse } from "../../withSafeParse";
import { ValidationError } from "../../error";
import { getValueType } from "../../getValueType";

export const uuid = (): Validator<string> => {
    return withSafeParse({
        parse(value): string {
            if (typeof value !== 'string') {
                const valueType = getValueType(value);
                throw new ValidationError([{ message: `Value is ${valueType}, expected string`, path: '' }]);
            }

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(value)) {
                throw new ValidationError([{ message: 'Invalid UUID', path: '' }]);
            }

            return value;
        }
    });
}
