import { describe, expect, it } from "vitest";
import { bool } from "./boolean";

describe.concurrent('Boolean validator', () => {
    describe('strict mode (default)', () => {
        it('should throw an error if the value is not a boolean', () => {
            expect(() => bool().parse('hello')).toThrow('Value is string, expected boolean');
            expect(() => bool().parse('true')).toThrow('Value is string, expected boolean');
            expect(() => bool().parse(1)).toThrow('Value is number, expected boolean');
            expect(() => bool().parse(0)).toThrow('Value is number, expected boolean');
            expect(() => bool().parse(null)).toThrow('Value is null, expected boolean');
            expect(() => bool().parse(undefined)).toThrow('Value is undefined, expected boolean');
        });

        it('should return the value if it is a boolean', () => {
            expect(bool().parse(true)).toBe(true);
            expect(bool().parse(false)).toBe(false);
        });
    });

    describe('coerce mode', () => {
        it('should coerce string "true"/"false" to boolean', () => {
            expect(bool({ coerce: true }).parse('true')).toBe(true);
            expect(bool({ coerce: true }).parse('false')).toBe(false);
        });

        it('should coerce numbers 1/0 to boolean', () => {
            expect(bool({ coerce: true }).parse(1)).toBe(true);
            expect(bool({ coerce: true }).parse(0)).toBe(false);
        });

        it('should coerce string numbers "1"/"0" to boolean', () => {
            expect(bool({ coerce: true }).parse('1')).toBe(true);
            expect(bool({ coerce: true }).parse('0')).toBe(false);
        });

        it('should coerce empty string, null, undefined to false', () => {
            expect(bool({ coerce: true }).parse('')).toBe(false);
            expect(bool({ coerce: true }).parse(null)).toBe(false);
            expect(bool({ coerce: true }).parse(undefined)).toBe(false);
        });

        it('should use truthy/falsy for other values', () => {
            expect(bool({ coerce: true }).parse('hello')).toBe(true);
            expect(bool({ coerce: true }).parse(42)).toBe(true);
            expect(bool({ coerce: true }).parse([])).toBe(true);
            expect(bool({ coerce: true }).parse({})).toBe(true);
        });

        it('should pass through actual booleans', () => {
            expect(bool({ coerce: true }).parse(true)).toBe(true);
            expect(bool({ coerce: true }).parse(false)).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('should only accept boolean in strict mode', () => {
            expect(() => bool().parse(0)).toThrow('Value is number, expected boolean');
            expect(() => bool().parse(1)).toThrow('Value is number, expected boolean');
            expect(() => bool().parse('')).toThrow('Value is string, expected boolean');
            expect(() => bool().parse('false')).toThrow('Value is string, expected boolean');
        });

        it('should handle case sensitivity in coerce mode', () => {
            expect(bool({ coerce: true }).parse('true')).toBe(true);
            expect(bool({ coerce: true }).parse('false')).toBe(false);
            expect(bool({ coerce: true }).parse('TRUE')).toBe(true); // truthy, not 'true'
            expect(bool({ coerce: true }).parse('FALSE')).toBe(true); // truthy, not 'false'
        });

        it('should handle all falsy values in coerce mode', () => {
            expect(bool({ coerce: true }).parse(false)).toBe(false);
            expect(bool({ coerce: true }).parse(0)).toBe(false);
            expect(bool({ coerce: true }).parse('0')).toBe(false);
            expect(bool({ coerce: true }).parse('')).toBe(false);
            expect(bool({ coerce: true }).parse(null)).toBe(false);
            expect(bool({ coerce: true }).parse(undefined)).toBe(false);
        });

        it('should handle all truthy values in coerce mode', () => {
            expect(bool({ coerce: true }).parse(true)).toBe(true);
            expect(bool({ coerce: true }).parse(1)).toBe(true);
            expect(bool({ coerce: true }).parse('1')).toBe(true);
            expect(bool({ coerce: true }).parse('any string')).toBe(true);
            expect(bool({ coerce: true }).parse([])).toBe(true);
            expect(bool({ coerce: true }).parse({})).toBe(true);
            expect(bool({ coerce: true }).parse(42)).toBe(true);
        });
    });

    describe('safeParse', () => {
        it('should return success for valid boolean', () => {
            const result = bool().safeParse(true);
            expect(result.type).toBe('success');
            if (result.type === 'success') {
                expect(result.data).toBe(true);
            }
        });

        it('should return error for invalid boolean', () => {
            const result = bool().safeParse('yes');
            expect(result.type).toBe('error');
            if (result.type === 'error') {
                expect(result.issues[0].message).toBe('Value is string, expected boolean');
            }
        });
    });
})