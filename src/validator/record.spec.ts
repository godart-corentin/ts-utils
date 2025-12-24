import { describe, expect, it } from "vitest";
import { record } from "./record";
import { str } from "./string";
import { num } from "./number";
import { bool } from "./boolean";
import { arr } from "./array";
import { obj } from "./object";
import { union } from "./union";
import { nullable } from "./nullable";
import { lit } from "./literal";

describe.concurrent('Record validator', () => {
    it('should throw an error if the value is not an object', () => {
        expect(() => record(str(), num()).parse('hello')).toThrow('Value is not an object');
        expect(() => record(str(), num()).parse(123)).toThrow('Value is not an object');
        expect(() => record(str(), num()).parse(true)).toThrow('Value is not an object');
    });

    it('should throw an error if the value is null or undefined', () => {
        expect(() => record(str(), num()).parse(null)).toThrow('Value is not an object');
        expect(() => record(str(), num()).parse(undefined)).toThrow('Value is not an object');
    });

    it('should throw an error if the value is an array', () => {
        expect(() => record(str(), num()).parse([])).toThrow('Value is not an object');
        expect(() => record(str(), num()).parse([1, 2, 3])).toThrow('Value is not an object');
    });

    it('should throw an error if the value is a Date', () => {
        expect(() => record(str(), num()).parse(new Date())).toThrow('Value is not an object');
    });

    it('should validate keys with the key validator', () => {
        const validator = record(str({ pattern: '^[a-z]+$' }), num());
        expect(() => validator.parse({ 'INVALID': 123 })).toThrow('Value does not match the pattern');
        expect(() => validator.parse({ 'key-with-dash': 123 })).toThrow('Value does not match the pattern');
    });

    it('should validate values with the value validator', () => {
        const validator = record(str(), num());
        expect(() => validator.parse({ key: 'not a number' })).toThrow('Value is not a number');
        expect(() => validator.parse({ a: 1, b: '2' })).toThrow('Value is not a number');
    });

    it('should return the value if it is valid', () => {
        expect(record(str(), num()).parse({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(record(str(), str()).parse({ name: 'Alice', city: 'NYC' })).toEqual({ name: 'Alice', city: 'NYC' });
    });

    it('should handle empty objects', () => {
        expect(record(str(), num()).parse({})).toEqual({});
    });

    it('should work with different value types', () => {
        expect(record(str(), bool()).parse({ active: true, disabled: false })).toEqual({
            active: true,
            disabled: false
        });
    });

    it('should work with arrays as values', () => {
        const validator = record(str(), arr(num()));
        expect(validator.parse({
            scores: [90, 85, 88],
            grades: [100, 95]
        })).toEqual({
            scores: [90, 85, 88],
            grades: [100, 95]
        });
    });

    it('should work with objects as values', () => {
        const validator = record(str(), obj({
            name: str(),
            age: num()
        }));

        expect(validator.parse({
            user1: { name: 'Alice', age: 30 },
            user2: { name: 'Bob', age: 25 }
        })).toEqual({
            user1: { name: 'Alice', age: 30 },
            user2: { name: 'Bob', age: 25 }
        });
    });

    it('should work with unions as values', () => {
        const validator = record(str(), union([str(), num()]));
        expect(validator.parse({
            name: 'Alice',
            age: 30,
            city: 'NYC'
        })).toEqual({
            name: 'Alice',
            age: 30,
            city: 'NYC'
        });
    });

    it('should work with nullable values', () => {
        const validator = record(str(), nullable(num()));
        expect(validator.parse({
            a: 1,
            b: null,
            c: 3
        })).toEqual({
            a: 1,
            b: null,
            c: 3
        });
    });

    it('should work with validation options', () => {
        const validator = record(
            str({ minLen: 2 }),
            num({ min: 0, max: 100 })
        );

        expect(validator.parse({ ab: 50, cd: 75 })).toEqual({ ab: 50, cd: 75 });
        expect(() => validator.parse({ a: 50 })).toThrow('Value is too short');
        expect(() => validator.parse({ ab: 150 })).toThrow('Value is too big');
    });

    it('should work with coercion', () => {
        const validator = record(
            str({ coerce: true }),
            num({ coerce: true })
        );

        // Keys should already be strings in JavaScript objects
        expect(validator.parse({ a: '123', b: '456' })).toEqual({ a: 123, b: 456 });
    });

    describe('edge cases', () => {
        it('should handle special characters in keys', () => {
            const validator = record(str(), num());
            expect(validator.parse({
                'key-with-dash': 1,
                'key_with_underscore': 2,
                'key.with.dots': 3
            })).toEqual({
                'key-with-dash': 1,
                'key_with_underscore': 2,
                'key.with.dots': 3
            });
        });

        it('should handle numeric string keys', () => {
            const validator = record(str(), str());
            expect(validator.parse({
                '0': 'zero',
                '1': 'one',
                '123': 'one-two-three'
            })).toEqual({
                '0': 'zero',
                '1': 'one',
                '123': 'one-two-three'
            });
        });

        it('should validate all entries', () => {
            const validator = record(str(), num());
            expect(() => validator.parse({
                a: 1,
                b: 2,
                c: 'invalid',
                d: 4
            })).toThrow('Value is not a number');
        });

        it('should handle values with zero and empty string', () => {
            const validator = record(str(), union([num(), str()]));
            expect(validator.parse({
                count: 0,
                name: ''
            })).toEqual({
                count: 0,
                name: ''
            });
        });
    });

    describe('common use cases', () => {
        it('should work for scores/grades', () => {
            const grades = record(str(), num());
            expect(grades.parse({
                alice: 90,
                bob: 85,
                charlie: 92
            })).toEqual({
                alice: 90,
                bob: 85,
                charlie: 92
            });
        });

        it('should work for configuration objects', () => {
            const config = record(str(), union([str(), num(), bool()]));
            expect(config.parse({
                host: 'localhost',
                port: 3000,
                debug: true,
                apiKey: 'secret'
            })).toEqual({
                host: 'localhost',
                port: 3000,
                debug: true,
                apiKey: 'secret'
            });
        });

        it('should work for user maps', () => {
            const userMap = record(str(), obj({
                name: str(),
                email: str(),
                active: bool()
            }));

            expect(userMap.parse({
                'user-123': { name: 'Alice', email: 'alice@example.com', active: true },
                'user-456': { name: 'Bob', email: 'bob@example.com', active: false }
            })).toEqual({
                'user-123': { name: 'Alice', email: 'alice@example.com', active: true },
                'user-456': { name: 'Bob', email: 'bob@example.com', active: false }
            });
        });

        it('should work for nested records', () => {
            const nestedRecord = record(str(), record(str(), num()));
            expect(nestedRecord.parse({
                group1: { a: 1, b: 2 },
                group2: { x: 10, y: 20 }
            })).toEqual({
                group1: { a: 1, b: 2 },
                group2: { x: 10, y: 20 }
            });
        });

        it('should work for literal key validation', () => {
            const statusCodes = record(
                union([lit('success'), lit('error'), lit('pending')]),
                num()
            );

            expect(statusCodes.parse({
                success: 200,
                error: 500,
                pending: 102
            })).toEqual({
                success: 200,
                error: 500,
                pending: 102
            });

            expect(() => statusCodes.parse({
                invalid: 999
            })).toThrow('Value is not valid');
        });
    });
});
