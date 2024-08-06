import { infill } from '../../utils/array';
import { Timestamp } from './timestamp';
import { getTokenDetailsByLabel, TimestampCategory, TimestampTokenDetails } from './tokens';
import { hasValidFormat } from './format';

/**
 * @file Holds timestsamp parsing, recognizing logic along with format wrapper
 * @todo UTC time zones
 */

/**
 * Recognize possible timestamp formats in provided strings.
 * @param source array of strings with expected uniform formatting
 * @param args NYI, additional parameters for recognizer
 * @returns array of extracted timestamp useTypes
 */
export function recognizeTimestamps(source: string[], args): Timestamp[] {
    const initialBatchSize = 5;

    // first try the most frequently used timestamps
    let expectedUseTypes = getExpectedUseTypes(args);
    expectedUseTypes = filterTimestampUseTypes(source, expectedUseTypes);
    expectedUseTypes = filterDuplicatesAndSubtypes(expectedUseTypes);

    if (expectedUseTypes.length > 0) {
        return expectedUseTypes;
    }

    // otherwise do it the hard way
    let initialBatch = source.slice(0, initialBatchSize);
    let extractedUseTypes = extractTimestampUseTypes(initialBatch, args);

    extractedUseTypes = filterInvalidUseTypes(extractedUseTypes);

    extractedUseTypes = filterTimestampUseTypes(source, extractedUseTypes);

    extractedUseTypes = filterDuplicatesAndSubtypes(extractedUseTypes);

    return extractedUseTypes;
}

/** For each string in source, find all possible mappable formattings */
function extractTimestampUseTypes(source: string[], args): Timestamp[] {

    let formattings = [];
    let memo: {[srcPlusCats: string]: string[][]} = {};
    let hashTable: {[format: string]: boolean} = {};
    let tokenHandles = Object.keys(TimestampTokenDetails);
    for (let string of source) {
        let combinations = extractTokenRecursive(string);
        combinations.forEach(combination => {
            if (!hashTable[combination.join('|')]) {
                hashTable[combination.join('|')] = true;
                formattings.push(combination);
            }
        });
    }

    let useTypes = formattings.map(f => new Timestamp({formatting: f}, args));
    return useTypes;

    function extractTokenRecursive(string: string, usedCategories: TimestampCategory[] = [], startingIndex: number = 0): string[][] {

        if (!string || string === '')
            return [[]];

        if (memo[[string, '|', usedCategories].join()]) {
            return memo[[string, '|', usedCategories].join()];
        }

        let retSet: string[][] = [];
        for (let i = startingIndex, l = tokenHandles.length; i < l; i++) {
            let token = TimestampTokenDetails[tokenHandles[i]];

            if (usedCategories.includes(token.category)) {
                continue;
            }

            let pattern: RegExp = new RegExp(token.regexBit);
            let match: RegExpMatchArray = string.match(pattern);
            if (match) {
                let newUsedCategories: TimestampCategory[] = [token.category, ...usedCategories];
                let parts: string[] = string.split(match[1]);
                let leftPart: string = parts[0];
                let rightPart: string = parts.slice(1).join(match[1]);

                let leftSplits = extractTokenRecursive(leftPart, newUsedCategories);
                for (let left of leftSplits) {

                    let leftUsedCategories = left
                        .map((label: string) => getTokenDetailsByLabel(label).category)
                        .filter(c => c !== TimestampCategory.Literal);
                    let newNewUsedCategories: TimestampCategory[] = [].concat(newUsedCategories, leftUsedCategories);

                    let rightSplits = extractTokenRecursive(rightPart, newNewUsedCategories);
                    for (let right of rightSplits) {
                        let comb = [].concat(left, [token.label], right);
                        retSet.push(comb);
                    }
                }
            }
        }

        if (retSet.length > 0) {
            memo[[string, '|', usedCategories].join()] = retSet;
            return retSet;
        }

        // unknown string, considered literal
        memo[[string, '|', usedCategories].join()] = [[string]];
        return [[string]];
    }
}

/** For each string in source, check if each useType is applicable and correct */
function filterTimestampUseTypes(source, useTypes) {
    for (let i = 0; i < source.length; i++) {
        for (let useType of useTypes) {
            let val = useType.deformat(source[i]);
            if (val === null) {
                useType.disabled = true;
            }
        }

        let nextUseTypes = useTypes.filter(useType => !useType.disabled);

        // False positive on [1000, 1000, 5000, ...] with single useType ['{YYYY}']
        // if (nextUseTypes.length === 1) {
        //     return nextUseTypes;
        // }
        if (nextUseTypes.length === 0) {
            return [];
        }
        useTypes = nextUseTypes;
    }
    return useTypes;
}

function filterInvalidUseTypes(useTypes) {
    return useTypes.filter(hasValidFormat);
}

/** For each useType, check if there is more specific useType in the set */
function filterDuplicatesAndSubtypes(useTypes) {
    for (let i = 0; i < useTypes.length; i++) {
        let subtypes = [];
        for (let j = i + 1; j < useTypes.length; j++) {
            if (useTypes[i].isSupersetOf(useTypes[j]))
                subtypes.push(j);
        }
        useTypes = useTypes.filter((_, i) => !subtypes.includes(i));
    }

    return useTypes;
}

/** If present, select useTypes which belong to the expected set of timestamp formats */
var expectedUseTypesCache;

function getExpectedUseTypes(args) {
    if (!expectedUseTypesCache)
        generateExpectedUseTypes();
    return expectedUseTypesCache.map((format: string[]) => new Timestamp({
        formatting: format,
        skipValidation: true,
    }, args));

    function generateExpectedUseTypes() {
        // TODO: Move to json and fetch from there.
        let cache = [];

        //#region UTC

        const utcDateBasic = [
            ['{YYYY}', '{MM}', '{DD}'],
            ['--', '{MM}', '{DD}'],
        ];
        cache = cache.concat(utcDateBasic);

        const utcDateExtended = [
            ['{YYYY}', '-', '{MM}', '-', '{DD}'],
            ['{YYYY}', '-', '{MM}'],
            ['--', '{MM}', '-', '{DD}'],
        ];
        cache = cache.concat(utcDateExtended);

        const utcDateTimeConnector = 'T';

        const utcTimeBasic = [
            ['T', '{hh}', '{mm}', '{ss}', '.', '{nnn}'],
            ['T', '{hh}', '{mm}', '{ss}'],
            ['T', '{hh}', '{mm}'],
            ['T', '{hh}'],
        ];
        cache = cache.concat(utcTimeBasic);

        let utcDatetimeBasic = [];
        for (let date of utcDateBasic)
            for (let time of utcTimeBasic)
                utcDatetimeBasic.push(date.concat(time));
        cache = cache.concat(utcDatetimeBasic);

        const utcTimeExtended = [
            ['{hh}', ':', '{mm}', ':', '{ss}', '.', '{nnn}'],
            ['{hh}', ':', '{mm}', ':', '{ss}'],
            ['{hh}', ':', '{mm}'],
        ];
        cache = cache.concat(utcTimeExtended);

        let utcDatetimeExtended = [];
        for (let date of utcDateExtended)
            for (let time of utcTimeExtended)
                utcDatetimeExtended.push(date.concat([utcDateTimeConnector], time));
        cache = cache.concat(utcDatetimeExtended);

        //#endregion

        //#region Frequent

        const frequentDateSeparators = ['.', '-', '/'];
        const frequentTimeSeparators = [':', '.'];
        const frequentDateTimeSeparators = [' ', '\t'];
        const frequentDateOrders = [
            ['{DD}', '{MM}', '{YYYY}'],
            ['{DD}', '{MM}', '{YY}'],
            ['{MM}', '{DD}', '{YYYY}'],
            ['{MM}', '{DD}', '{YY}'],
            ['{YYYY}', '{MM}', '{DD}'],
        ];

        const frequentTimeOrders = [
            ['{hh}', '{mm}', '{ss}', '{nnn}'],
            ['{hh}', '{mm}', '{ss}'],
            ['{hh}', '{mm}'],
        ];

        let frequentDates = [];
        for (let date of frequentDateOrders)
            for (let sep of frequentDateSeparators)
                frequentDates.push(infill(date, sep));
        cache = cache.concat(frequentDates);

        let frequentTimes = [];
        for (let time of frequentTimeOrders)
            for (let sep of frequentTimeSeparators)
                frequentTimes.push(infill(time, sep));
        cache = cache.concat(frequentTimes);

        let frequentDatetimes = [];
        for (let date of frequentDates)
            for (let time of frequentTimes)
                frequentDatetimes = frequentDatetimes.concat(frequentDateTimeSeparators.map(sep => [].concat(date, [sep], time)));
        cache = cache.concat(frequentDatetimes);

        //#endregion

        expectedUseTypesCache = cache;
    }

}