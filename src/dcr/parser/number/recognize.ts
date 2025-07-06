import { getScopedLogger } from '../../../logger.js';
import { extractPossibleFormats } from './extract.js';
import { NumberUseType } from './useType.js';

const logger = getScopedLogger('DCR.number.recognize');

/**
 * Try to recognize possible formats of string-represented numbers in a source array.
 * @param {string[]} source strings upon which format should be determined
 * @returns {NumberUseType[]} possible number formats of specified strings
 */
export function recognizeNumbers(source: string[], args): NumberUseType[] {
    if (!source || source.length === 0) {
        return [];
    }

    // populate the initial batch with the largest samples
    const initialBatch = source.slice(0, 5);

    let nuts = extractPossibleFormats(initialBatch, args);
    logger.debug(`${args.label ?? ''} found initial batch of number formats`, {
        args, data: source.slice(0, 5), useTypes: nuts,
    });

    /** _[i] = if i-th NUT has failed the threshold of invalid matches. */
    const isNutDisabled: Array<boolean> = nuts.map(() => false);
    /** _[i] = how many tokens from the source has i-th NUT matched properly. */
    const matchCountForNut: Array<number> = nuts.map(() => 0);
    /** ...how many NUTs have been disabled in total. */
    const disabledNutCount = 0;
    for (const value of source) {

        // cache of recovery use-types
        let potentialExpansionNuts: Array<NumberUseType> = undefined;

        for (let j = 0; j < nuts.length; j++) {
            let nut = nuts[j];

            if (!isNutDisabled[j]) {
                const num = nuts[j].deformat(value);
                if (num !== null) {
                    // NUT fits the value, NUT's confidence goes up

                    matchCountForNut[j]++;
                    nut.max = Math.max(nut.max, num);
                    nut.min = Math.min(nut.min, num);
                } else {
                    // NUT does not fit the value
                    logger.debug(`${args.label ?? ''} failed to parse value`, {
                        value, useType: nut,
                    });

                    // Generate a new set of NUTs for value only when needed
                    if (!potentialExpansionNuts) {
                        potentialExpansionNuts = extractPossibleFormats([value], args);

                        logger.debug(`${args.label ?? ''} found extended batch of number formats`, {
                            value, useTypes: potentialExpansionNuts.map(nut => nut.toString()),
                        });
                    }

                    // See if any extend the current NUT
                    // If so, such extension fits both previous matches of the original NUT and current value

                    let foundExpansion = false;
                    for (let k = 0; k < potentialExpansionNuts.length; k++) {
                        const expansionNut = potentialExpansionNuts[k];

                        if (expansionNut.isSupersetOf(nut)) {
                            logger.debug(`${args.label ?? ''} successfully extended number format`, {
                                original: nut, extended: expansionNut,
                            });

                            foundExpansion = true;
                            const currentParsed = expansionNut.deformat(value);
                            expansionNut.min = Math.min(currentParsed, nut.min);
                            expansionNut.max = Math.max(currentParsed, nut.max);
                            nut = expansionNut;
                            potentialExpansionNuts.splice(k, 1);
                            break;
                        }
                    }

                    // TODO: Threshold to mitigate typos. Currently single invalid match invalidates a NUT.
                    if (!foundExpansion) {
                        isNutDisabled[j] = true;
                    }
                }
            }
        }
        if (disabledNutCount === nuts.length) {
            logger.info(`recognizeNumbers for label ${args.label} did not find any suitable number formats.`, {args});
            return [];
        }
    }
    // nuts.forEach((nut, idx) => nut.confidence = matches[idx] / source.length)
    nuts = nuts.filter((nut, i) => !isNutDisabled[i]);

    return nuts;
}

interface NumberUsetypeArgs {
    min?: number;
    max?: number;
    decimalSeparator?: string;
    thousandSeparator?: string;
    separateDecimalThousands?: boolean;
    prefix?: string;
    suffix?: string;
    integerPlaces?: number;
    decimalPlaces?: number;
    integral?: boolean;
}
