import { describe, it, expect } from 'vitest';
import { ValidationError } from './error';
import { obj } from './object';
import { str } from './string';
import { num } from './number';
import { arr } from './array';
import { record } from './record';
import { tuple } from './tuple';

describe('ValidationError with paths', () => {
    describe('Object validation errors', () => {
        it('should include property path in error message', () => {
            const validator = obj({
                name: str(),
                age: num()
            });

            expect(() => validator.parse({ name: 'John', age: 'not a number' })).toThrow(ValidationError);
            expect(() => validator.parse({ name: 'John', age: 'not a number' })).toThrow(/at path: age/);
        });

        it('should include nested property path in error message', () => {
            const validator = obj({
                user: obj({
                    name: str(),
                    age: num()
                })
            });

            expect(() => validator.parse({ user: { name: 'John', age: 'not a number' } })).toThrow(ValidationError);
            expect(() => validator.parse({ user: { name: 'John', age: 'not a number' } })).toThrow(/at path: user\.age/);
        });

        it('should include deeply nested property path', () => {
            const validator = obj({
                company: obj({
                    employees: obj({
                        manager: obj({
                            name: str(),
                        })
                    })
                })
            });

            expect(() => validator.parse({
                company: {
                    employees: {
                        manager: {
                            name: 123
                        }
                    }
                }
            })).toThrow(ValidationError);
            expect(() => validator.parse({
                company: {
                    employees: {
                        manager: {
                            name: 123
                        }
                    }
                }
            })).toThrow(/at path: company\.employees\.manager\.name/);
        });
    });

    describe('Array validation errors', () => {
        it('should include array index in error message', () => {
            const validator = arr(str());

            expect(() => validator.parse(['a', 'b', 123, 'd'])).toThrow(ValidationError);
            expect(() => validator.parse(['a', 'b', 123, 'd'])).toThrow(/at path: \[2\]/);
        });

        it('should include nested array index in object', () => {
            const validator = obj({
                tags: arr(str())
            });

            expect(() => validator.parse({ tags: ['valid', 123, 'also valid'] })).toThrow(ValidationError);
            expect(() => validator.parse({ tags: ['valid', 123, 'also valid'] })).toThrow(/at path: tags\[1\]/);
        });

        it('should include complex nested path with arrays and objects', () => {
            const validator = obj({
                users: arr(obj({
                    name: str(),
                    age: num()
                }))
            });

            expect(() => validator.parse({
                users: [
                    { name: 'John', age: 30 },
                    { name: 'Jane', age: 'invalid' },
                ]
            })).toThrow(ValidationError);
            expect(() => validator.parse({
                users: [
                    { name: 'John', age: 30 },
                    { name: 'Jane', age: 'invalid' },
                ]
            })).toThrow(/at path: users\[1\]\.age/);
        });
    });

    describe('Record validation errors', () => {
        it('should include key in error message for value validation', () => {
            const validator = record(str(), num());

            expect(() => validator.parse({ a: 1, b: 'invalid', c: 3 })).toThrow(ValidationError);
            expect(() => validator.parse({ a: 1, b: 'invalid', c: 3 })).toThrow(/at path: b/);
        });

        it('should indicate key validation failure', () => {
            const validator = record(str({ pattern: '^[a-z]+$' }), num());

            expect(() => validator.parse({ valid: 1, 'INVALID': 2 })).toThrow(ValidationError);
            expect(() => validator.parse({ valid: 1, 'INVALID': 2 })).toThrow(/<key: INVALID>/);
        });
    });

    describe('Tuple validation errors', () => {
        it('should include tuple index in error message', () => {
            const validator = tuple([str(), num(), str()]);

            expect(() => validator.parse(['valid', 123, 456])).toThrow(ValidationError);
            expect(() => validator.parse(['valid', 123, 456])).toThrow(/at path: \[2\]/);
        });

        it('should include nested tuple path', () => {
            const validator = obj({
                coordinates: tuple([num(), num()])
            });

            expect(() => validator.parse({ coordinates: [10, 'invalid'] })).toThrow(ValidationError);
            expect(() => validator.parse({ coordinates: [10, 'invalid'] })).toThrow(/at path: coordinates\[1\]/);
        });
    });

    describe('ValidationError methods', () => {
        it('should create error with path', () => {
            const error = new ValidationError([{ message: 'Test error', path: 'user.name' }]);
            expect(error.message).toContain('Test error');
            expect(error.message).toContain('at path: user.name');
            expect(error.issues[0].path).toBe('user.name');
        });

        it('should create error without path', () => {
            const error = new ValidationError([{ message: 'Test error', path: '' }]);
            expect(error.message).toBe('Test error');
            expect(error.issues[0].path).toBe('');
        });

        it('should prepend path with withPath', () => {
            const error = new ValidationError([{ message: 'Test error', path: 'name' }]);
            const newError = error.withPath('user');

            expect(newError.message).toContain('at path: user.name');
            expect(newError.issues[0].path).toBe('user.name');
        });
    });
});
