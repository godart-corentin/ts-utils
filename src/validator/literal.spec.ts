import { describe, expect, it } from "vitest";
import { lit } from "./literal";

describe.concurrent("Literal validator", () => {
    it('should throw an error if the value is not the literal', () => {
        expect(() => lit('a').parse('b')).toThrow('Value is not the literal');
        expect(() => lit(3).parse(4)).toThrow('Value is not the literal');
        expect(() => lit(true).parse(false)).toThrow('Value is not the literal');
    });

    it('should return the value if it is the literal', () => {
        expect(lit('a').parse('a')).toBe('a');
        expect(lit(3).parse(3)).toBe(3);
        expect(lit(true).parse(true)).toBe(true);
        expect(lit(null).parse(null)).toBe(null);
        expect(lit(undefined).parse(undefined)).toBe(undefined);
    });

    it('should use strict equality (no type coercion)', () => {
        expect(() => lit(0).parse(false)).toThrow('Value is not the literal');
        expect(() => lit(1).parse(true)).toThrow('Value is not the literal');
        expect(() => lit('').parse(false)).toThrow('Value is not the literal');
        expect(() => lit('0').parse(0)).toThrow('Value is not the literal');
    });

    it('should work with edge case values', () => {
        expect(lit(0).parse(0)).toBe(0);
        expect(lit(-1).parse(-1)).toBe(-1);
        expect(lit('').parse('')).toBe('');
        expect(lit(false).parse(false)).toBe(false);
    });

    it('should reject undefined and null', () => {
        expect(() => lit('test').parse(null)).toThrow('Value is not the literal');
        expect(() => lit('test').parse(undefined)).toThrow('Value is not the literal');
        expect(() => lit(5).parse(null)).toThrow('Value is not the literal');
    });

    it('should work with special number values', () => {
        expect(lit(Infinity).parse(Infinity)).toBe(Infinity);
        expect(lit(-Infinity).parse(-Infinity)).toBe(-Infinity);
        // Note: NaN can't work with literal validator because NaN !== NaN
    });

    describe('safeParse', () => {
        it('should return success for matching literal', () => {
            const result = lit('hello').safeParse('hello');
            expect(result.type).toBe('success');
            if (result.type === 'success') {
                expect(result.data).toBe('hello');
            }
        });

        it('should return error for non-matching literal', () => {
            const result = lit(42).safeParse(43);
            expect(result.type).toBe('error');
            if (result.type === 'error') {
                expect(result.issues[0].message).toBe('Value is not the literal');
            }
        });
    });
})