import {
    unique,
    count,
    sum,
    avg,
    findIndexes,
    hasDuplicates,
    groupBy,
    areEqual,
    isSubsetOf,
    intersection,
    infill,
    filterInclusionMinima,
    filterInclusionMaxima,
} from '../array';

describe('Array utilities', () => {

    describe('unique', () => {
        test('returns array with unique values', () => {
            expect(unique([1, 2, 3, 2, 1])).toEqual([1, 2, 3]);
            expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
        });
    });

    describe('count', () => {
        test('counts occurrences of values in array', () => {
            const result = count(['a', 'b', 'a', 'c', 'b', 'a']);
            expect(result).toEqual({a: 3, b: 2, c: 1});
        });

        test('works with numbers', () => {
            const result = count([1, 2, 1, 3, 2, 1]);
            expect(result).toEqual({'1': 3, '2': 2, '3': 1});
        });
    });

    describe('sum', () => {
        test('sums array of numbers', () => {
            expect(sum([1, 2, 3, 4])).toBe(10);
            expect(sum([-1, 1])).toBe(0);
        });
    });

    describe('avg', () => {
        test('calculates average of array of numbers', () => {
            expect(avg([2, 4, 6])).toBe(4);
            expect(avg([1, 2, 3, 4])).toBe(2.5);
        });
    });

    describe('findIndexes', () => {
        test('finds indexes of elements that match condition', () => {
            const arr = [10, 20, 30, 40, 50];
            expect(findIndexes(arr, x => x > 25, null)).toEqual([2, 3, 4]);
            expect(findIndexes(arr, x => x % 20 === 0, null)).toEqual([1, 3]);
        });
    });

    describe('hasDuplicates', () => {
        test('detects if array has duplicates', () => {
            expect(hasDuplicates([1, 2, 3, 4])).toBe(false);
            expect(hasDuplicates([1, 2, 2, 3])).toBe(true);
        });
    });

    describe('groupBy', () => {
        test('groups objects by key', () => {
            const objects = [
                {type: 'A', value: 1},
                {type: 'B', value: 2},
                {type: 'A', value: 3},
                {type: 'C', value: 4},
            ];
            const result = groupBy(objects, 'type');
            expect(result).toEqual({
                A: [{type: 'A', value: 1}, {type: 'A', value: 3}],
                B: [{type: 'B', value: 2}],
                C: [{type: 'C', value: 4}],
            });
        });

        test('can drop objects without specified key', () => {
            const objects = [
                {type: 'A', value: 1},
                {value: 2}, // No type
                {type: 'C', value: 4},
            ];
            const result = groupBy(objects, 'type', true);
            expect(result).toEqual({
                A: [{type: 'A', value: 1}],
                C: [{type: 'C', value: 4}],
            });
        });
    });

    describe('areEqual', () => {
        test('checks if arrays are equal', () => {
            expect(areEqual([1, 2, 3], [1, 2, 3])).toBe(true);
            expect(areEqual([1, 2, 3], [1, 2, 4])).toBe(false);
            expect(areEqual([1, 2], [1, 2, 3])).toBe(false);
        });
    });

    describe('isSubsetOf', () => {
        test('checks if first array is subset of second', () => {
            expect(isSubsetOf([1, 2], [1, 2, 3, 4])).toBe(true);
            expect(isSubsetOf([1, 5], [1, 2, 3, 4])).toBe(false);
        });

      test('empty array is subset of any array', () => {
        expect(isSubsetOf([], [1, 2, 3])).toBe(true);
      });

      test('array is subset of itself', () => {
        expect(isSubsetOf([1, 2, 3], [1, 2, 3])).toBe(true);
      });

      test('array is not subset of empty array', () => {
        expect(isSubsetOf([1, 2, 3], [])).toBe(false);
      });

      test('works with string arrays', () => {
        expect(isSubsetOf(['a', 'b'], ['a', 'b', 'c'])).toBe(true);
        expect(isSubsetOf(['a', 'd'], ['a', 'b', 'c'])).toBe(false);
      });

      test('works with object arrays', () => {
        const obj1 = { id: 1 };
        const obj2 = { id: 2 };
        const obj3 = { id: 3 };

        expect(isSubsetOf([obj1, obj2], [obj1, obj2, obj3])).toBe(true);
        expect(isSubsetOf([obj1, { id: 4 }], [obj1, obj2, obj3])).toBe(false);
      });

      // TODO
      // test('works with nested arrays', () => {
      //   expect(isSubsetOf([[1], [2]], [[1], [2], [3]])).toBe(true);
      //   expect(isSubsetOf([[1, 2], [3]], [[1], [2], [3]])).toBe(false);
      // });
    });

    describe('intersection', () => {
        test('returns intersection of two arrays', () => {
            expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
            expect(intersection([1, 2], [3, 4])).toEqual([]);
        });
    });

    describe('infill', () => {
        test('inserts element between array elements', () => {
            expect(infill(['a', 'b', 'c'], 'X')).toEqual(['a', 'X', 'b', 'X', 'c']);
        });

        test('can add element at start and end', () => {
            expect(infill(['a', 'b'], 'X', true, true)).toEqual(['X', 'a', 'X', 'b', 'X']);
        });
    });

    describe('filterInclusionMinima', () => {
        test('finds minimal subsets', () => {
            const groups = [[1, 2], [1], [2], [3, 4, 5], [3, 4], [3, 5]];
            expect(filterInclusionMinima(groups)).toEqual([[1], [2], [3, 4], [3, 5]]);
        });

        test('handles empty input', () => {
            expect(filterInclusionMinima([])).toEqual([]);
        });
    });

    describe('filterInclusionMaxima', () => {
        test('finds maximal supersets', () => {
            const groups = [[1, 2, 3], [1, 2], [2, 3], [4, 5], [4]];
            expect(filterInclusionMaxima(groups)).toEqual([[1, 2, 3], [4, 5]]);
        });

        test('handles case where no subset relationships exist', () => {
            const groups = [[1], [2], [3], [4]];
            expect(filterInclusionMaxima(groups)).toEqual([[1], [2], [3], [4]]);
        });

        test('handles the specific example in the code comment', () => {
            const groups = [[1, 2], [1], [2], [3, 4, 5], [3, 4], [3, 5]];
            // The maxima should be the sets that are not subsets of any other set
            expect(filterInclusionMaxima(groups)).toEqual([[1, 2], [3, 4, 5]]);
        });

        test('handles empty input', () => {
            expect(filterInclusionMaxima([])).toEqual([]);
        });

        // TODO
        // test('handles nested arrays correctly', () => {
        //     const groups = [[[1, 2], 3], [[1], 3], [[2], 3]];
        //     expect(filterInclusionMaxima(groups)).toEqual([[[1, 2], 3]]);
        // });
    });
});
