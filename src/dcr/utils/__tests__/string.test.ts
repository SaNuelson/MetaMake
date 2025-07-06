import { escapeRegExp, getCommonPrefix, getCommonSuffix } from '../string.js';

describe('String utilities', () => {
    describe('escapeRegExp', () => {
        test('escapes RegExp special characters', () => {
            expect(escapeRegExp('test.string?')).toBe('test\\.string\\?');
            expect(escapeRegExp('a*b+c?d^e$f{g}h|i[j]k\\l')).toBe('a\\*b\\+c\\?d\\^e\\$f\\{g\\}h\\|i\\[j\\]k\\\\l');
        });

        test('does not modify strings without special characters', () => {
            expect(escapeRegExp('abcdef')).toBe('abcdef');
            expect(escapeRegExp('123456')).toBe('123456');
        });

        test('handles empty string', () => {
            expect(escapeRegExp('')).toBe('');
        });

        test('practical usage in RegExp construction', () => {
            const userInput = 'test.value+';
            const escapedInput = escapeRegExp(userInput);
            const regex = new RegExp(escapedInput);

            expect(regex.test('test.value+')).toBe(true);
            expect(regex.test('testxvalue+')).toBe(false);
        });
    });

    describe('getCommonPrefix', () => {
        test('finds common prefix of two strings', () => {
            expect(getCommonPrefix('abcdef', 'abcxyz')).toBe('abc');
            expect(getCommonPrefix('prefix_test', 'prefix_another')).toBe('prefix_');
        });

        test('returns empty string when no common prefix exists', () => {
            expect(getCommonPrefix('abc', 'xyz')).toBe('');
        });

        test('returns empty string with empty input', () => {
            expect(getCommonPrefix('', 'xyz')).toBe('');
            expect(getCommonPrefix('abc', '')).toBe('');
            expect(getCommonPrefix('', '')).toBe('');
        });

        test('returns full string when one is prefix of the other', () => {
            expect(getCommonPrefix('abc', 'abcdef')).toBe('abc');
        });

        test('handles case sensitivity correctly', () => {
            expect(getCommonPrefix('ABCdef', 'ABCxyz')).toBe('ABC');
            expect(getCommonPrefix('abcDEF', 'ABCdef')).toBe('');
        });
    });

    describe('getCommonSuffix', () => {
        test('finds common suffix of two strings', () => {
            expect(getCommonSuffix('xyzabc', 'defoabc')).toBe('abc');
            expect(getCommonSuffix('test_suffix', 'another_suffix')).toBe('_suffix');
        });

        test('returns empty string when no common suffix exists', () => {
            expect(getCommonSuffix('abc', 'xyz')).toBe('');
        });

        test('returns empty string with empty input', () => {
            expect(getCommonSuffix('', 'xyz')).toBe('');
            expect(getCommonSuffix('abc', '')).toBe('');
            expect(getCommonSuffix('', '')).toBe('');
        });

        test('returns full string when one is suffix of the other', () => {
            expect(getCommonSuffix('xyzabc', 'abc')).toBe('abc');
        });

        test('handles case sensitivity correctly', () => {
            expect(getCommonSuffix('defABC', 'xyzABC')).toBe('ABC');
            expect(getCommonSuffix('ABCdef', 'abcDEF')).toBe('');
        });
    });
});
