import { withSafeParse } from "../withSafeParse"
import { Validator } from "../common"
import { getValueType } from "../getValueType"
import { ValidationError } from "../error"

type DateOptions = {
    min?: Date;
    max?: Date;
}

type DateValidator = Validator<Date>

export const date = (opts?: DateOptions): DateValidator => {
    return withSafeParse({
        parse(value): Date {
            if (typeof value !== "string" && !(value instanceof Date)) {
                const valueType = getValueType(value);
                throw new ValidationError([
                    {
                        message: `Value is ${valueType}, expected string or Date`,
                        path: ''
                    }
                ])
            }

            const date = new Date(value)
            if (isNaN(date.getTime())) {
                throw new ValidationError([
                    {
                        message: "Invalid date",
                        path: ''
                    }
                ])
            }

            if (opts?.min && date < opts.min) {
                throw new ValidationError([
                    {
                        message: `Date is before ${opts.min.toISOString()}`,
                        path: ''
                    }
                ])
            }

            if (opts?.max && date > opts.max) {
                throw new ValidationError([
                    {
                        message: `Date is after ${opts.max.toISOString()}`,
                        path: ''
                    }
                ])
            }
            return date
        }
    })
}