import { describe, expect, it } from "vitest";
import { nativeEnum } from "./enum";

enum TestEnum {
    A = 'A',
    B = 'B',
    C = 'C'
}

describe.concurrent("Enum validator", () => {
    it('should throw an error if the value is not in the enum', () => {
        const validator = nativeEnum(TestEnum);
        expect(() => validator.parse('D')).toThrow('Value is string, expected value from enum');
        // But if we pass a different type
        expect(() => validator.parse(123)).toThrow('Value is number, expected value from enum');
        expect(() => validator.parse(null)).toThrow('Value is null, expected value from enum');
        expect(() => validator.parse(undefined)).toThrow('Value is undefined, expected value from enum');
    })

    it('should return the value if it is in the enum', () => {
        const validator = nativeEnum(TestEnum);
        expect(validator.parse('A')).toBe(TestEnum.A);
    })

    describe('safeParse', () => {
        it('should return success for valid enum value', () => {
            const result = nativeEnum(TestEnum).safeParse('A');
            expect(result.type).toBe('success');
            if (result.type === 'success') {
                expect(result.data).toBe(TestEnum.A);
            }
        });

        it('should return error for invalid enum value', () => {
            const result = nativeEnum(TestEnum).safeParse('D');
            expect(result.type).toBe('error');
            if (result.type === 'error') {
                expect(result.issues[0].message).toBe('Value is string, expected value from enum');
            }
        });
    });
})
