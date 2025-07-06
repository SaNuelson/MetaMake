import { getScopedLogger } from '../../../logger.js';
import { EnumUseType } from './useType.js';

const logger = getScopedLogger('DCR.enum.recognize');
const commonNullVals = ['', '-', 'n/a', 'null', 'none', 'nan'];

/**
 * Try to recognize possible formats of string-represented enums in source array.
 * @param source strings upon which format should be determined
 * @returns possible enum formats of specified strings
 */
export function recognizeEnums(source: string[], args): EnumUseType[] {
    logger.info('recognizeEnums start', {data: source.slice(0, 5), args});

    if (!source || source.length === 0) return [];

    const valueIndexes: { [value: string]: number[] } = {};
    for (let i = 0; i < source.length; i++) {
        if (!valueIndexes[source[i]]) valueIndexes[source[i]] = [];
        valueIndexes[source[i]].push(i);
    }

    let valueCounts: [string, number][] = [];
    for (const value in valueIndexes) {
        valueCounts.push([value, valueIndexes[value].length]);
    }
    valueCounts = valueCounts.sort((a, b) => a[1] - b[1]);

    // TODO: single val for whole column. Should be ignored?
    if (valueCounts.length === 1) {
        args.isConstant = true;
        args.constantVal = valueCounts[0][0];

        logger.info(`recognizeEnums for ${args.label} determined constant column of value ${args.constantVal}`, {args});
        return [];
    }

    // no repeated value means possible ID column
    if (valueCounts.length === source.length) {
        args.potentialIds = true;
        args.ambiguousSets = [];

        logger.info(`recognizeEnums for ${args.label} determined potential ID column`, {args});
        return [];
    }

    // create info about non-uniqueness to be used in mapping step
    const ambiguousSets: number[][] = [];
    for (const value in valueIndexes) {
        if (valueIndexes[value].length > 1) ambiguousSets.push(valueIndexes[value]);
    }
    args.ambiguousSets = ambiguousSets;

    // Check if found set is enum-like
    // - domain is small enough
    // - has at least 2 keys
    const reductionFactor = source.length / valueCounts.length;
    if (reductionFactor > 0.5 && valueCounts[0][1] >= 2 && valueCounts.length > 2) {
        const enumUseType = new EnumUseType({domain: valueCounts.map(a => a[0])}, {ambiguousSets: ambiguousSets});
        logger.info(`recongnizeEnums for ${args.label} determined potential enum`, {
            args,
            useType: enumUseType.toString(),
        });
        return [enumUseType];
    }

    // otherwise check for NOVAL
    const likelyNullValIdx = valueCounts.findIndex(x => commonNullVals.some(nullVal => x[0].toUpperCase() === nullVal.toUpperCase()));
    if (likelyNullValIdx >= 0) {
        args.hasNoval = true;
        args.novalVal = valueCounts[likelyNullValIdx][0];

        logger.info(`recognizeEnums for ${args.label} determined potential noVal with common value '${args.novalVal}'.`);
        return [];
    }

    // TODO: False positive {"1000": 213, "2000": 62, ...}, need better NOVAL criteria
    if (valueCounts[valueCounts.length - 1][1] / valueCounts[valueCounts.length - 2][1] > 2 && valueCounts[valueCounts.length - 2][1] > 0) {
        args.hasNoval = true;
        args.novalVal = valueCounts[valueCounts.length - 1][0];

        logger.info(`recognizeEnums for ${args.label} determined potential noVal with value ${args.novalVal}.`, {
            args,
            noVal: args.novalVal,
        });
        return [];
    }

    logger.info(`recognizeEnums for ${args.label} finished with no findings.`, {args});
    return [];
}
