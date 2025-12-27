import { describe, expect, it } from "vitest";
import { email } from "./email";

describe.concurrent('Email validator', () => {
    it('should validate valid emails', () => {
        expect(email().parse('test@example.com')).toBe('test@example.com');
        expect(email().parse('user.name+tag@example.co.uk')).toBe('user.name+tag@example.co.uk');
    });

    it('should fail for invalid emails', () => {
        expect(() => email().parse('test')).toThrow('Invalid email address');
        expect(() => email().parse('test@')).toThrow('Invalid email address');
        expect(() => email().parse('@example.com')).toThrow('Invalid email address');
        expect(() => email().parse('test@example')).toThrow('Invalid email address');
    });

    it('should fail for non-string values', () => {
        expect(() => email().parse(123)).toThrow('Value is number, expected string');
        expect(() => email().parse(null)).toThrow('Value is null, expected string');
    });
});
