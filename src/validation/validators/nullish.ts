import type { Validator } from "../common";
import { withSafeParse } from "../withSafeParse";

// Overload signatures for better type inference
export function nullish<T>(
    validator: Validator<T>
): Validator<T | null | undefined>;

export function nullish<T>(
    validator: Validator<T>,
    defaultValue: T
): Validator<T>;

// Implementation
export function nullish<T>(
    validator: Validator<T>,
    defaultValue?: T
): Validator<T | null | undefined> {
    const hasDefault = arguments.length === 2;

    return withSafeParse({
        parse(value): T | null | undefined {
            if (value === null || value === undefined) {
                return hasDefault ? defaultValue! : value;
            }
            return validator.parse(value);
        }
    });
}
