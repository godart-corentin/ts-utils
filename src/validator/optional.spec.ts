import { describe, expect, it } from "vitest";
import { optional } from "./optional";
import { str } from "./string";
import { num } from "./number";
import { bool } from "./boolean";
import { arr } from "./array";
import { obj } from "./object";

describe.concurrent('Optional validator', () => {
    describe('without default value', () => {
        it('should accept undefined', () => {
            expect(optional(str()).parse(undefined)).toBe(undefined);
            expect(optional(num()).parse(undefined)).toBe(undefined);
            expect(optional(bool()).parse(undefined)).toBe(undefined);
        });

        it('should accept valid values', () => {
            expect(optional(str()).parse('hello')).toBe('hello');
            expect(optional(num()).parse(123)).toBe(123);
            expect(optional(bool()).parse(false)).toBe(false);
        });

        it('should reject null', () => {
            expect(() => optional(str()).parse(null)).toThrow('Value is not a string');
        });

        it('should reject invalid values', () => {
            expect(() => optional(str()).parse(123)).toThrow('Value is not a string');
            expect(() => optional(num()).parse('hello')).toThrow('Value is not a number');
        });

        it('should work with arrays', () => {
            expect(optional(arr(num())).parse(undefined)).toBe(undefined);
            expect(optional(arr(num())).parse([1, 2, 3])).toEqual([1, 2, 3]);
        });

        it('should work with objects', () => {
            const validator = optional(obj({ age: num() }));
            expect(validator.parse(undefined)).toBe(undefined);
            expect(validator.parse({ age: 30 })).toEqual({ age: 30 });
        });

        it('should work with coercion', () => {
            const validator = optional(str({ coerce: true }));
            expect(validator.parse(undefined)).toBe(undefined);
            expect(validator.parse(123)).toBe('123');
            expect(validator.parse(true)).toBe('true');
        });

        it('should handle empty string vs undefined', () => {
            expect(optional(str()).parse('')).toBe('');
            expect(optional(str()).parse(undefined)).toBe(undefined);
        });

        it('should handle false vs undefined', () => {
            expect(optional(bool()).parse(false)).toBe(false);
            expect(optional(bool()).parse(undefined)).toBe(undefined);
        });
    });

    describe('with default value', () => {
        it('should return default value when undefined', () => {
            expect(optional(str(), 'default').parse(undefined)).toBe('default');
            expect(optional(num(), 0).parse(undefined)).toBe(0);
            expect(optional(bool(), false).parse(undefined)).toBe(false);
        });

        it('should return actual value when provided', () => {
            expect(optional(str(), 'default').parse('hello')).toBe('hello');
            expect(optional(num(), 0).parse(123)).toBe(123);
            expect(optional(bool(), false).parse(true)).toBe(true);
        });

        it('should still validate non-undefined values', () => {
            expect(() => optional(str(), 'default').parse(123)).toThrow('Value is not a string');
            expect(() => optional(num(), 0).parse('hello')).toThrow('Value is not a number');
        });

        it('should work with empty string as default', () => {
            expect(optional(str(), '').parse(undefined)).toBe('');
            expect(optional(str(), '').parse('hello')).toBe('hello');
        });

        it('should work with zero as default', () => {
            expect(optional(num(), 0).parse(undefined)).toBe(0);
            expect(optional(num(), 0).parse(42)).toBe(42);
        });

        it('should work with false as default', () => {
            expect(optional(bool(), false).parse(undefined)).toBe(false);
            expect(optional(bool(), false).parse(true)).toBe(true);
        });

        it('should work with array as default', () => {
            const defaultArray = [1, 2, 3];
            expect(optional(arr(num()), defaultArray).parse(undefined)).toBe(defaultArray);
            expect(optional(arr(num()), defaultArray).parse([4, 5])).toEqual([4, 5]);
        });

        it('should work with object as default', () => {
            const defaultObj = { name: 'Guest', age: 0 };
            const validator = optional(obj({ name: str(), age: num() }), defaultObj);
            expect(validator.parse(undefined)).toBe(defaultObj);
            expect(validator.parse({ name: 'Alice', age: 30 })).toEqual({ name: 'Alice', age: 30 });
        });

        it('should work with negative numbers as default', () => {
            expect(optional(num(), -1).parse(undefined)).toBe(-1);
            expect(optional(num(), -1).parse(5)).toBe(5);
        });
    });

    describe('common use cases', () => {
        it('should work for primitive defaults', () => {
            const host = optional(str(), 'localhost');
            const port = optional(num(), 3000);
            const debug = optional(bool(), false);

            expect(host.parse(undefined)).toBe('localhost');
            expect(port.parse(undefined)).toBe(3000);
            expect(debug.parse(undefined)).toBe(false);

            expect(host.parse('0.0.0.0')).toBe('0.0.0.0');
            expect(port.parse(8080)).toBe(8080);
            expect(debug.parse(true)).toBe(true);
        });

        it('should work for complex defaults', () => {
            const tags = optional(arr(str()), ['default', 'tags']);
            expect(tags.parse(undefined)).toEqual(['default', 'tags']);
            expect(tags.parse(['custom'])).toEqual(['custom']);
        });

        it('should work in object schemas', () => {
            const userSchema = obj({
                name: str(),
                role: optional(str(), 'user'),
                age: optional(num(), 18),
                active: optional(bool(), true)
            });

            // With all undefined - defaults are used
            expect(userSchema.parse({
                name: 'Alice',
                role: undefined,
                age: undefined,
                active: undefined
            })).toEqual({
                name: 'Alice',
                role: 'user',
                age: 18,
                active: true
            });

            // With actual values
            expect(userSchema.parse({
                name: 'Bob',
                role: 'admin',
                age: 25,
                active: false
            })).toEqual({
                name: 'Bob',
                role: 'admin',
                age: 25,
                active: false
            });

            // Mix of undefined and values
            expect(userSchema.parse({
                name: 'Charlie',
                role: 'moderator',
                age: undefined,
                active: undefined
            })).toEqual({
                name: 'Charlie',
                role: 'moderator',
                age: 18,
                active: true
            });
        });
    });

    describe('safeParse', () => {
        it('should return success for undefined', () => {
            const result = optional(str()).safeParse(undefined);
            expect(result.type).toBe('success');
            if (result.type === 'success') {
                expect(result.data).toBeUndefined();
            }
        });

        it('should return success for valid value', () => {
            const result = optional(str()).safeParse('hello');
            expect(result.type).toBe('success');
            if (result.type === 'success') {
                expect(result.data).toBe('hello');
            }
        });

        it('should return error for invalid value', () => {
            const result = optional(num()).safeParse('invalid');
            expect(result.type).toBe('error');
            if (result.type === 'error') {
                expect(result.issues[0].message).toBe('Value is not a number');
            }
        });
    });
});
