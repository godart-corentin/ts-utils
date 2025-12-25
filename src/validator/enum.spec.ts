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
        expect(() => validator.parse('D')).toThrow();
    })

    it('should return the value if it is in the enum', () => {
        const validator = nativeEnum(TestEnum);
        expect(validator.parse('A')).toBe(TestEnum.A);
    })
})
