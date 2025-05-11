
export function unique(arr: any[]): any[] {
    return [...new Set(arr)];
}

export function charsToRegex (arr: string[]): RegExp {
    return new RegExp('[' + arr.join('') + ']');
}


/**
 * Reduce array into object containing its values as keys with values being occurences
 * @param arr
 * @returns object with keys equal to unique values in arr, their values being number of occurences
 */
export function count(arr: any[]): {[key: string]: number } {
    return arr.reduce((acc, next) => {
        acc[next] ? acc[next]++ : acc[next] = 1;
        return acc;
    }, {});
}


/**
 * Sum elements in array (concat if strings)
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


/**
 * Find indexes using the lambda function provided
 * @param domain domain (e.g. array or string) to search the element in
 * @param [callbackFn] function taking (element, index, array) as parameters, returning boolean
 * @param [thisArg] object to use as "this" when calling callbackFn
 * @returns {number[]} indexes of elements for which callbackFn returns true
 */
export function findIndexes(domain: any[] | string, callbackFn: (item: any) => boolean, thisArg: any): number[] {
    if (!callbackFn)
        callbackFn = (el) => !!el;
    if (!thisArg)
        thisArg = this;
    let idxs = [];
    for (let i = 0; i < domain.length; i++) {
        if (callbackFn.call(thisArg, domain[i], i, domain))
            idxs.push(i);
    }
    return idxs;
}


/**
 * Convert object to array with elements in form [key, object[key]]
 * @example
 * let o = {a: 1, b: "2", c: {d: "three"}};
 * let a = toKvp(o);
 * // [["a", 1], ["b", "2"], ["c", {d: "three"}]]
 */
export function toKvp<T>(obj: {[key: string]: T}): [string, T][] {
    let arr = [];
    for (let key in obj) {
        arr.push([key, obj[key]]);
    }
    return arr;
}

/**
 * Check if array has any duplicates (shallow?)
 */
export function hasDuplicates(array: any[]): boolean {
    return (new Set(array)).size !== array.length;
}

/**
 * Group objects in array by specific key
 * @param {*[]} xs array to group
 * @param {*} key key to group by
 * @param {boolean} dropKeyless whether to skip objects lacking specified key or not
 * @returns {*} object with keys equal to grouping keys, values being arrays of objects
 * @example
 * let objs = [{'a':5},{'a':10},{'b':20},{'a':false}]
 * let grouped = groupBy(objs, 'a', true);
 * // {'5':[{'a':5}], '10':[{'a':10}], 'false':{'a':false}]}
 */
export function groupBy(xs: any[], key: any, dropKeyless: boolean = true): object {
    if (dropKeyless)
        xs = xs.filter(x => x[key] || x[key] === 0);

    let groups = {};
    for (let x of xs) {
        groups[x[key]] = (groups[x[key]] || []);
        groups[x[key]].push(x);
    }
    return groups;
}

/**
 * Check if two arrays are equal element-wise (shallow)
 * @param {*[]} ax
 * @param {*[]} bx
 * @returns {boolean} true if of same size and all eleements equal, false otherwise
 */
export function areEqual(ax: any[], bx: any[]): boolean {
    if (ax.length !== bx.length)
        return false;
    for (let i in ax)
        if (ax[i] !== bx[i])
            return false;
    return true;
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
 * console.log(infill(arr, filler, true, false));
 * // ["X", "a", "X", "b", "X", "c", "X", "d"];
 */
export function infill(arr, el, start = false, end = false) {
    let infilled = arr.map(a => [a, el]).flat(1);
    if (start)
        infilled.splice(0, 0, el);
    if (!end)
        infilled.splice(-1, 1);
    return infilled;
}

/**
 * Return a subset containing only minimas with respect to inclusion
 * @param {any[][]} ass
 * @example
 * filterInclusionMinimas([[1, 2], [1], [2], [3, 4, 5], [3, 4], [3, 5]]);
 * // [[1], [2], [3, 4], [3, 5]]
 */
export function filterInclusionMinimas(ass) {
    let retset = [];
    for (let i = 0; i < ass.length; i++) {
        let minimal = true;
        for (let j = 0; j < ass.length; j++) {
            if (i === j)
                continue;

            if (isSubsetOf(ass[j], ass[i])) {
                minimal = false;
                break;
            }
        }
        if (minimal)
            retset.push(ass[i]);
    }
    return retset;
}

/** See filterInclusionMinimas */
export function filterInclusionMaximas(ass) {
    let retset = [];
    for (let i = 0; i < ass.length; i++) {
        let minimal = true;
        for (let j = 0; j < ass.length; j++) {
            if (isSubsetOf(ass[i], ass[j])) {
                minimal = false;
                break;
            }
        }
        if (minimal)
            retset.push(ass[i]);
    }
    return retset;
}
