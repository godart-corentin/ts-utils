import { describe, expect, it } from "vitest";
import { union } from "./union";
import { str } from "./string";
import { num } from "./number";
import { bool } from "./boolean";
import { lit } from "./literal";

describe.concurrent('Union validator', () => {
    it('should throw an error if the value is not a string or number', () => {
        expect(() => union([str(), num()]).parse(true)).toThrow('Value is not valid');
    });

    it('should throw an error if the value is not valid for any of the validators', () => {
        expect(() => union([str({ pattern: 'hello' }), str({ pattern: 'world' })]).parse('1234')).toThrow('Value is not valid');
    });

    it('should return the value if it is valid', () => {
        expect(union([str(), num()]).parse('1234')).toBe('1234');
        expect(union([str(), num()]).parse(1234)).toBe(1234);
        expect(union([str({ pattern: 'hello' }), str({ pattern: 'world' })]).parse('hello')).toBe('hello');
    });

    it('should validate in order and return on first match', () => {
        const validator = union([str(), num()]);
        expect(validator.parse('123')).toBe('123'); // Matches str first
        expect(validator.parse(123)).toBe(123); // Then tries num
    });

    it('should work with multiple types', () => {
        const validator = union([str(), num(), bool()]);
        expect(validator.parse('hello')).toBe('hello');
        expect(validator.parse(42)).toBe(42);
        expect(validator.parse(true)).toBe(true);
        expect(() => validator.parse(null)).toThrow('Value is not valid');
    });

    it('should work with literal validators in union', () => {
        const status = union([lit('pending'), lit('approved'), lit('rejected')]);
        expect(status.parse('pending')).toBe('pending');
        expect(status.parse('approved')).toBe('approved');
        expect(() => status.parse('unknown')).toThrow('Value is not valid');
    });

    it('should work with coercion in union members', () => {
        const validator = union([str({ coerce: true }), num({ coerce: true })]);
        expect(validator.parse('hello')).toBe('hello');
        expect(validator.parse(123)).toBe('123'); // Coerced to string by first validator
        expect(validator.parse(true)).toBe('true'); // Coerced to string by first validator
    });

    it('should handle edge values', () => {
        const validator = union([str(), num(), bool()]);
        expect(validator.parse('')).toBe('');
        expect(validator.parse(0)).toBe(0);
        expect(validator.parse(false)).toBe(false);
        expect(validator.parse(NaN)).toBe(NaN);
    });

    describe('safeParse', () => {
        it('should return success when union matches', () => {
            const result = union([str(), num()]).safeParse('hello');
            expect(result.type).toBe('success');
            if (result.type === 'success') {
                expect(result.data).toBe('hello');
            }
        });

        it('should return error when none match', () => {
            const result = union([str(), num()]).safeParse(true);
            expect(result.type).toBe('error');
            if (result.type === 'error') {
                expect(result.issues[0].message).toBe('Value is not valid');
            }
        });
    });
})