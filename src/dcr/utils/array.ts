export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

export function charsToRegex(arr: string[]): RegExp {
    return new RegExp('[' + arr.join('') + ']');
}


/**
 * Reduce an array into an object containing its values as keys with values being occurrences
 * @param arr Array in which to count occurrences.
 * @returns object with keys being the unique values in arr, their values being number of occurrences
 */
export function count<T>(arr: Array<T>): { [key: string]: number } {
    return arr.reduce((acc: { [key: string]: number }, next): { [key: string]: number } => {
        const key = next.toString();
        if (acc[key]) acc[key]++; else acc[key] = 1;
        return acc;
    }, {});
}


/**
 * Sum elements in an array (concat if strings)
 */
export function sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b);
}


/**
 * Average elements in array
 */
export function avg(arr: number[]): number {
    return sum(arr) / arr.length;
}

type genericCallback<T> = (item: T, index: number, array: T[]) => boolean;
type stringCallback = (item: string) => boolean;

/**
 * Find indexes using the lambda function provided.
 * @param domain domain (e.g., array or string) to search the element in
 * @param [callbackFn] function taking (an element, index, array) as parameters, returning boolean
 * @param [thisArg] object to use as "this" when calling callbackFn
 * @returns {number[]} indexes of elements for which callbackFn returns true
 */
export function findIndexes<T>(domain: T[], callbackFn: genericCallback<T>, thisArg?: unknown): number[];
export function findIndexes(domain: string, callbackFn: stringCallback, thisArgs?: unknown): number[];
export function findIndexes<T>(domain: T[] | string, callbackFn: genericCallback<T> | stringCallback, thisArg?: unknown): number[] {
    if (!callbackFn) callbackFn = (el) => !!el;
    const indices = [];
    for (let i = 0; i < domain.length; i++) {
        if (callbackFn.call(thisArg, domain[i], i, domain)) indices.push(i);
    }
    return indices;
}

/**
 * Check if an array has any duplicates (shallow?)
 */
export function hasDuplicates<T>(array: T[]): boolean {
    return (new Set(array)).size !== array.length;
}

/**
 * Group objects in an array by specific key
 * @param {*[]} xs array to group
 * @param {*} key key to group by
 * @param {boolean} dropKeyless whether to skip objects lacking specified key or not
 * @returns {*} object with keys equal to grouping keys, values being arrays of objects
 * @example
 * let objs = [{'a':5},{'a':10},{'b':20},{'a':false}]
 * let grouped = groupBy(objs, 'a', true);
 * // {'5':[{'a':5}], '10':[{'a':10}], 'false':{'a':false}]}
 */
export function groupBy(xs: object[], key: string, dropKeyless: boolean = true): object {
    if (dropKeyless) xs = xs.filter(x => x[key] || x[key] === 0);

    const groups = {};
    for (const x of xs) {
        groups[x[key]] = (groups[x[key]] || []);
        groups[x[key]].push(x);
    }
    return groups;
}

/**
 * Check if two arrays are equal element-wise (shallow)
 * @param {*[]} ax
 * @param {*[]} bx
 * @returns {boolean} true if of same size and all elements equal, false otherwise
 */
export function areEqual(ax: unknown[], bx: unknown[]): boolean {
    if (ax.length !== bx.length) return false;
    return ax.every((a, i) => a === bx[i]);
}

export function isSubsetOf(as, bs) {
    return as.every(a => bs.includes(a));
}

export function intersection(as, bs) {
    return as.filter(a => bs.includes(a));
}

/**
 * Insert element el between every two elements of arr.
 * @param {any[]} arr array to infill (won't be mutated)
 * @param {any} el infilling element (shallow copy)
 * @param {boolean} [start=false] (=false) whether to put one element at the start
 * @param {boolean} [end=false] (=false) whether to put one element at the end
 * @example
 * let arr = ["a","b","c","d"];
 * let filler = "X";
 * console.log(infill (arr, filler, true, false));
 * // ["X", "a", "X", "b", "X", "c", "X", "d"];
 */
export function infill(arr: Array<unknown>, el: unknown, start: boolean = false, end: boolean = false): Array<unknown> {
    const infilled = arr.map(a => [a, el]).flat(1);
    if (start) infilled.splice(0, 0, el);
    if (!end) infilled.splice(-1, 1);
    return infilled;
}

/**
 * Return a subset containing only minima with respect to inclusion
 * @param {any[][]} groups
 * @example
 * filterInclusionMinima([[1, 2], [1], [2], [3, 4, 5], [3, 4], [3, 5]]);
 * // [[1], [2], [3, 4], [3, 5]]
 */
export function filterInclusionMinima(groups: unknown[][]): unknown[] {
    const minima: unknown[] = [];
    for (let i = 0; i < groups.length; i++) {
        let isMinimal = true;
        for (let j = 0; j < groups.length; j++) {
            if (i === j) continue;

            if (isSubsetOf(groups[j], groups[i])) {
                isMinimal = false;
                break;
            }
        }
        if (isMinimal) minima.push(groups[i]);
    }
    return minima;
}

/** @see filterInclusionMinima */
export function filterInclusionMaxima(groups: unknown[][]): unknown[] {
    const maxima: unknown[] = [];
    for (let i = 0; i < groups.length; i++) {
        let isMaximal = true;
        for (let j = 0; j < groups.length; j++) {
            if (i === j) continue;

            if (isSubsetOf(groups[i], groups[j])) {
                isMaximal = false;
                break;
            }
        }
        if (isMaximal) maxima.push(groups[i]);
    }
    return maxima;
}
