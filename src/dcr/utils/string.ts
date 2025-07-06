/**
 * Escape any RegExp characters present in a string.
 * Beneficial when such a string is used in the construction of another RegExp (to avoid broken code).
 * @param string to sanitize
 * @returns provided string with back-slashed RegExp operators
 * @example
 * let a = "test.string?"
 * escapeRegExp(a);
 * // "test\\.string\\?"
 */
export function escapeRegExp(string: string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function getCommonPrefix(str1: string, str2: string): string {
    const len = Math.min(str1.length, str2.length);
    const prefix = [];
    for (let i = 0; i < len; i++) {
        if (str1[i] === str2[i]) prefix.push(str1[i]); else break;
    }
    return prefix.join('');
}

export function getCommonSuffix(str1: string, str2: string): string {
    const len = Math.min(str1.length, str2.length);
    const str1l = str1.length;
    const str2l = str2.length;
    const suffix = [];
    for (let i = 1; i <= len; i++) {
        if (str1[str1l - i] === str2[str2l - i]) suffix.push(str1[str1l - i]); else break;
    }
    return suffix.reverse().join('');
}
