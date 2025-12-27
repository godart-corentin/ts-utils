import { describe, expect, it } from "vitest";
import { str } from "./string";

describe.concurrent('String validator', () => {
    describe('strict mode (default)', () => {
        it('should throw an error if the value is not a string', () => {
            expect(() => str().parse(3)).toThrow('Value is number, expected string');
            expect(() => str().parse(true)).toThrow('Value is boolean, expected string');
            expect(() => str().parse(null)).toThrow('Value is null, expected string');
        });

        it('should throw an error if the value is too short', () => {
            expect(() => str({ minLen: 5 }).parse('1234')).toThrow('Value is too short, expected at least 5 characters');
        });

        it('should throw an error if the value is too long', () => {
            expect(() => str({ maxLen: 5 }).parse('123456')).toThrow('Value is too long, expected at most 5 characters');
        });

        it('should throw an error if the value does not match the pattern', () => {
            expect(() => str({ pattern: '^[0-9]+$' }).parse('abc')).toThrow('Value does not match the pattern');
        });

        it('should return the value if it is valid', () => {
            expect(str().parse('1234')).toBe('1234');
        });
    });

    describe('coerce mode', () => {
        it('should coerce numbers to string', () => {
            expect(str({ coerce: true }).parse(123)).toBe('123');
            expect(str({ coerce: true }).parse(42.5)).toBe('42.5');
        });

        it('should coerce booleans to string', () => {
            expect(str({ coerce: true }).parse(true)).toBe('true');
            expect(str({ coerce: true }).parse(false)).toBe('false');
        });

        it('should coerce null and undefined to string', () => {
            expect(str({ coerce: true }).parse(null)).toBe('null');
            expect(str({ coerce: true }).parse(undefined)).toBe('undefined');
        });

        it('should coerce objects/arrays to string', () => {
            expect(str({ coerce: true }).parse({})).toBe('[object Object]');
            expect(str({ coerce: true }).parse([])).toBe('');
            expect(str({ coerce: true }).parse([1, 2, 3])).toBe('1,2,3');
        });

        it('should pass through actual strings', () => {
            expect(str({ coerce: true }).parse('hello')).toBe('hello');
        });

        it('should apply validation after coercion', () => {
            expect(() => str({ coerce: true, minLen: 5 }).parse(123)).toThrow('Value is too short, expected at least 5 characters');
            expect(str({ coerce: true, minLen: 3 }).parse(123)).toBe('123');

            expect(() => str({ coerce: true, pattern: '^[0-9]+$' }).parse(true)).toThrow('Value does not match the pattern');
            expect(str({ coerce: true, pattern: '^[0-9]+$' }).parse(123)).toBe('123');
        });
    });

    describe('edge cases', () => {
        it('should handle empty strings', () => {
            expect(str().parse('')).toBe('');
            expect(() => str({ minLen: 1 }).parse('')).toThrow('Value is too short, expected at least 1 characters');
        });

        it('should handle unicode characters', () => {
            expect(str().parse('Hello 👋 World 🌍')).toBe('Hello 👋 World 🌍');
            expect(str({ minLen: 5 }).parse('Hello 👋')).toBe('Hello 👋');
        });

        it('should handle special characters in patterns', () => {
            expect(str({ pattern: '^[a-zA-Z0-9_-]+$' }).parse('hello-world_123')).toBe('hello-world_123');
            expect(() => str({ pattern: '^[a-zA-Z0-9_-]+$' }).parse('hello@world')).toThrow('Value does not match the pattern');
        });

        it('should work with combined validations', () => {
            const validator = str({ minLen: 3, maxLen: 10, pattern: '^[a-z]+$' });
            expect(validator.parse('hello')).toBe('hello');
            expect(() => validator.parse('hi')).toThrow('Value is too short, expected at least 3 characters');
            expect(() => validator.parse('verylongstring')).toThrow('Value is too long, expected at most 10 characters');
            expect(() => validator.parse('HELLO')).toThrow('Value does not match the pattern');
        });

        it('should handle exact length validation', () => {
            const exactLength = str({ minLen: 5, maxLen: 5 });
            expect(exactLength.parse('hello')).toBe('hello');
            expect(() => exactLength.parse('hi')).toThrow('Value is too short, expected at least 5 characters');
            expect(() => exactLength.parse('toolong')).toThrow('Value is too long, expected at most 5 characters');
        });
    });

    describe('safeParse', () => {
        it('should return success for valid string', () => {
            const result = str().safeParse('hello');
            expect(result.type).toBe('success');
            if (result.type === 'success') {
                expect(result.data).toBe('hello');
            }
        });

        it('should return error for invalid string', () => {
            const result = str().safeParse(123);
            expect(result.type).toBe('error');
            if (result.type === 'error') {
                expect(result.issues).toHaveLength(1);
                expect(result.issues[0].message).toBe('Value is number, expected string');
                expect(result.issues[0].path).toBe('');
            }
        });

        it('should return error for validation failures', () => {
            const result = str({ minLen: 5 }).safeParse('hi');
            expect(result.type).toBe('error');
            if (result.type === 'error') {
                expect(result.issues[0].message).toBe('Value is too short, expected at least 5 characters');
            }
        });
    });
})
