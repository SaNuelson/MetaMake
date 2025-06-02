import { infill } from '../../utils/array';
import { Timestamp } from './timestamp';
import { getTokenDetailsByLabel, TimestampCategory, TimestampTokenDetails } from './tokens';
import { hasValidFormat } from './format';
import { UseTypeArgs } from '../useType';
import { logger } from '../../../logger';

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
export function recognizeTimestamps(source: string[], args: UseTypeArgs): Timestamp[] {
    const initialBatchSize = 5;

    // first try the most frequently used timestamps
    let expectedUseTypes = getExpectedUseTypes(args);
    expectedUseTypes = filterTimestampUseTypes(source, expectedUseTypes, args.hasNull ? args.nullVal : undefined);
    expectedUseTypes = filterDuplicatesAndSubtypes(expectedUseTypes);

    if (expectedUseTypes.length > 0) {
        logger.info("recognizeTimestamps - recognized a frequently used timestamp format",
            {data: source.slice(0,5), formats: expectedUseTypes.map(ut => ut.formatting)});
        return expectedUseTypes;
    }

    // otherwise do it the hard way
    const initialBatch = source.slice(0, initialBatchSize);
    let extractedUseTypes = extractTimestampUseTypes(initialBatch, args);

    extractedUseTypes = filterInvalidUseTypes(extractedUseTypes);

    extractedUseTypes = filterTimestampUseTypes(source, extractedUseTypes, args.hasNull ? args.nullVal : undefined);

    extractedUseTypes = filterDuplicatesAndSubtypes(extractedUseTypes);

    return extractedUseTypes;
}

/** For each string in source, find all possible mappable formattings */
function extractTimestampUseTypes(source: string[], args): Timestamp[] {

    const formattings = [];
    const memo: {[srcPlusCats: string]: string[][]} = {};
    const hashTable: {[format: string]: boolean} = {};
    const tokenHandles = Object.keys(TimestampTokenDetails);
    for (const string of source) {
        const combinations = extractTokenRecursive(string);
        combinations.forEach(combination => {
            if (!hashTable[combination.join('|')]) {
                hashTable[combination.join('|')] = true;
                formattings.push(combination);
            }
        });
    }

    const useTypes = formattings.map(f => new Timestamp({formatting: f}, args));
    return useTypes;

    function extractTokenRecursive(string: string, usedCategories: TimestampCategory[] = [], startingIndex: number = 0): string[][] {

        if (!string || string === '')
            return [[]];

        if (memo[[string, '|', usedCategories].join()]) {
            return memo[[string, '|', usedCategories].join()];
        }

        const retSet: string[][] = [];
        for (let i = startingIndex, l = tokenHandles.length; i < l; i++) {
            const token = TimestampTokenDetails[tokenHandles[i]];

            if (usedCategories.includes(token.category)) {
                continue;
            }

            const pattern: RegExp = new RegExp(token.regexBit);
            const match: RegExpMatchArray = string.match(pattern);
            if (match) {
                const newUsedCategories: TimestampCategory[] = [token.category, ...usedCategories];
                const parts: string[] = string.split(match[1]);
                const leftPart: string = parts[0];
                const rightPart: string = parts.slice(1).join(match[1]);

                const leftSplits = extractTokenRecursive(leftPart, newUsedCategories);
                for (const left of leftSplits) {

                    const leftUsedCategories = left
                        .map((label: string) => getTokenDetailsByLabel(label).category)
                        .filter(c => c !== TimestampCategory.Literal);
                    const newNewUsedCategories: TimestampCategory[] = [].concat(newUsedCategories, leftUsedCategories);

                    const rightSplits = extractTokenRecursive(rightPart, newNewUsedCategories);
                    for (const right of rightSplits) {
                        const comb = [].concat(left, [token.label], right);
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
function filterTimestampUseTypes(source: string[], useTypes: Timestamp[], skipVal?: string): Timestamp[] {
    for (let i = 0; i < source.length; i++) {

        if (skipVal !== undefined && source[i] === skipVal)
            continue;

        const areUseTypesDisabled = useTypes.map(_ => false);

        for (let j = 0; j < useTypes.length; j++){
            const useType = useTypes[j];
            const val = useType.deformat(source[i]);
            if (val === null) {
                areUseTypesDisabled[j] = true;
            }
        }

        const nextUseTypes = useTypes.filter((useType, j) => !areUseTypesDisabled[j]);

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
function filterDuplicatesAndSubtypes(useTypes: Timestamp[]): Timestamp[] {
    for (let i = 0; i < useTypes.length; i++) {
        const subtypes = [];
        for (let j = i + 1; j < useTypes.length; j++) {
            if (useTypes[i].isSupersetOf(useTypes[j]))
                subtypes.push(j);
        }
        useTypes = useTypes.filter((_, i) => !subtypes.includes(i));
    }

    return useTypes;
}

/** If present, select useTypes which belong to the expected set of timestamp formats */
let expectedUseTypesCache;

function getExpectedUseTypes(args: UseTypeArgs): Timestamp[] {
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

        const utcDatetimeBasic = [];
        for (const date of utcDateBasic)
            for (const time of utcTimeBasic)
                utcDatetimeBasic.push(date.concat(time));
        cache = cache.concat(utcDatetimeBasic);

        const utcTimeExtended = [
            ['{hh}', ':', '{mm}', ':', '{ss}', '.', '{nnn}'],
            ['{hh}', ':', '{mm}', ':', '{ss}'],
            ['{hh}', ':', '{mm}'],
        ];
        cache = cache.concat(utcTimeExtended);

        const utcDatetimeExtended = [];
        for (const date of utcDateExtended)
            for (const time of utcTimeExtended)
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

        const frequentDates = [];
        for (const date of frequentDateOrders)
            for (const sep of frequentDateSeparators)
                frequentDates.push(infill(date, sep));
        cache = cache.concat(frequentDates);

        const frequentTimes = [];
        for (const time of frequentTimeOrders)
            for (const sep of frequentTimeSeparators)
                frequentTimes.push(infill(time, sep));
        cache = cache.concat(frequentTimes);

        let frequentDatetimes = [];
        for (const date of frequentDates)
            for (const time of frequentTimes)
                frequentDatetimes = frequentDatetimes.concat(frequentDateTimeSeparators.map(sep => [].concat(date, [sep], time)));
        cache = cache.concat(frequentDatetimes);

        //#endregion

        expectedUseTypesCache = cache;
    }

}