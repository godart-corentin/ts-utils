import { describe, expect, it } from "vitest";
import { url } from "./url";

describe.concurrent('URL validator', () => {
    it('should validate valid URLs', () => {
        expect(url().parse('https://example.com')).toBe('https://example.com');
        expect(url().parse('http://localhost:3000')).toBe('http://localhost:3000');
        expect(url().parse('mailto:user@example.com')).toBe('mailto:user@example.com');
    });

    it('should fail for invalid URLs', () => {
        expect(() => url().parse('example.com')).toThrow('Invalid URL');
        expect(() => url().parse('https://')).toThrow('Invalid URL');
        expect(() => url().parse('')).toThrow('Invalid URL');
    });

    it('should fail for non-string values', () => {
        expect(() => url().parse(123)).toThrow('Value is number, expected string');
    });
});
