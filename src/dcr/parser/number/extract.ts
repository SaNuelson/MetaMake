import { unique } from '../../utils/array';
import { escapeRegExp } from '../../utils/string';

import { NumberUseType } from './useType';

/**
 * Slow method to be used on a small number of samples to generate all possible numeric use-types.
 */
export function extractPossibleFormats(source: string[], args): NumberUseType[] {

    /* Unicode character not currently working well, need to find a workaround */
    const knownThousandSeparators = ['.', ',', ' ', '\xa0']; //...unicodeConstants.getUtf16Whitespace()];
    const knownDecimalSeparators = ['.', ','];
    const allKnownSeparators = unique(knownThousandSeparators.concat(knownDecimalSeparators));
    const pureNumericFormPattern = new RegExp('^[' + allKnownSeparators.join('') + '\\d]+$');

    const determinedPrefixes = [];
    const determinedSuffixes = [];

    // whether the format contains negative numbers as well
    let determinedMinus = false;
    // whether the format explicitly uses plus sign
    let determinedPlus = false;

    // whether the format permits missing leading 0 in sub-1 decimals
    let determinedLeftEllipsis = false;
    // whether the format permits missing
    let determinedRightEllipsis = false;

    // whether the format uses scientific notation
    let determinedScientific = false;
    // tuples of thousand and decimal separators found
    let determinedDelimiterSets = [];

    // Potential numeric-like feature format:
    // SAMPLE = PREFIX NUMBER SUFFIX
    // PREFIX, SUFFIX = non-numeric sequence
    // NUMBER can be
    // 		- scientific (contains e12345 at the end)
    //		- unsigned/signed/explicit (contains no signs / only minus / both minus and plus)
    //		- whole/decimal (does not / contains decimal part)
    //			DECIMAL - left/right/not ellipsed (can contain forms ".NUM" / "NUM" / only "NUM.NUM")
    //		- fully/partially/not separated (each 3 digits / each 3 decimal digits / no digits are separated by separator)

    for (let sample of source) {
        let potentialPrefix = '';
        const potentialPrefixMatch = sample.match(/^[^0-9]*[^0-9+-]/);
        if (potentialPrefixMatch) {
            potentialPrefix = potentialPrefixMatch[0];
            sample = sample.replace(potentialPrefixMatch[0], '');
        }
        // sample is now without a prefix

        let potentialSuffix = '';
        const potentialSuffixMatch = sample.match(/[^.0-9][^0-9]*$/);
        if (potentialSuffixMatch) {
            potentialSuffix = potentialSuffixMatch[0];
            sample = sample.replace(potentialSuffixMatch[0], '');
        }
        // sample now without a suffix

        let potentialScientific = false;
        const potentialScientificMatch = sample.match(/[eE][0-9]+$/);
        if (potentialScientificMatch) {
            potentialScientific = true;
            sample = sample.replace(potentialScientificMatch[0], '');
        }
        // sample now without scientific notation

        let potentialMinus = false;
        let potentialPlus = false;
        const potentialSignMatch = sample.match(/^[-+]/);
        if (potentialSignMatch) {
            if (potentialSignMatch[0] === '+')
                potentialPlus = true;
            potentialMinus = true;
            sample = sample.replace(potentialSignMatch[0], '');
        }
        // sample now without sign

        // sample should now contain only numbers and separators
        if (!sample.match(pureNumericFormPattern)) {
            continue;
        }

        const potentialThousandSeparators = knownThousandSeparators.filter(sep => sample.includes(sep));
        const potentialDecimalSeparators = knownDecimalSeparators.filter(sep => sample.includes(sep));
        const potentialSeparatorSets = [];
        const containedSeparators = allKnownSeparators.filter(sep => sample.includes(sep));

        // CASE "nothing left"
        if (sample.length === 0) {
            continue;
        }
        // CASE no separators
        else if (containedSeparators.length === 0) {
            potentialSeparatorSets.push(['', '']);
        }
        // CASE only decimal or only thousands separator
        else if (containedSeparators.length === 1) {
            const sep = containedSeparators[0];
            if (isValidThousandSeparator(sample, sep)) {
                potentialSeparatorSets.push([sep, '']);
            }
            if (isValidDecimalSeparator(sample, sep)) {
                potentialSeparatorSets.push(['', sep]);
            }
        }
        // CASE both decimal and thousands separators present
        else {
            let builtinParseSuccess = false;
            for (const tsep of potentialThousandSeparators) {
                for (const dsep of potentialDecimalSeparators) {
                    if (tsep === dsep)
                        continue;

                    if (!isValidThousandSeparator(sample, tsep))
                        continue;

                    if (!isValidDecimalSeparator(sample, dsep))
                        continue;

                    const parseSample = sample.split(tsep).join('').split(dsep).join('.');

                    if (!isNaN(parseFloat(parseSample))) {
                        potentialSeparatorSets.push([tsep, dsep]);
                        builtinParseSuccess = true;
                    }
                }
            }
            if (!builtinParseSuccess) {
                continue;
            }
        }

        /* TODO: Potentially check for ellipses, and separation (full/partial) */
        // let potentialLeftEllipsis = false;
        // let potentialLeftEllipsisMatch = sample.match(/^\./);
        // if (potentialLeftEllipsisMatch)
        // 	potentialLeftEllipsis = true;

        // let potentialRightEllipsis = false;
        // let potentialRightEllipsisMatch = sample.match(/\.$/);

        /* TODO: Potential strict mode where inconsistencies are considered errors */
        if (potentialPrefix)
            determinedPrefixes.push(potentialPrefix);
        if (potentialSuffix)
            determinedSuffixes.push(potentialSuffix);

        determinedMinus &&= potentialMinus;
        determinedPlus &&= potentialPlus;

        determinedLeftEllipsis = false;
        determinedRightEllipsis = false;

        determinedScientific &&= potentialScientific;
        determinedDelimiterSets = determinedDelimiterSets.concat(potentialSeparatorSets);

    }

    const numutypes = [];
    for (const delimset of determinedDelimiterSets) {
        const numutype = new NumberUseType({
            prefixes: determinedPrefixes,
            suffixes: determinedSuffixes,
            separators: delimset,
            scientific: determinedScientific,
            explicitSign: determinedPlus,
        }, args);
        numutypes.push(numutype);
    }

    let change = true;
    while (change) {
        change = false;
        for (let i = 0; i < numutypes.length; i++) {
            for (let j = 0; j < numutypes.length; j++) {
                if (i === j)
                    continue;
                if (numutypes[i].isEqualTo(numutypes[j]) ||
                    numutypes[i].isSupersetOf(numutypes[j])) {
                    numutypes.splice(j);
                    change = true;
                } else if (numutypes[j].isSupersetOf(numutypes[i])) {
                    numutypes.splice(i);
                    change = true;
                }
                if (change) break;
            }
            if (change) break;
        }
    }

    return numutypes;
}

function isValidThousandSeparator(string: string, sep: string): boolean {
    // thousands separator is valid only if it separates groups of 3 digits,
    // with the exception of first part, last part, and the part with decimal separator
    const split = string.split(sep);
    if (split[0].length > 3)
        return false;
    if (split[split.length - 1].length !== 3 && split[split.length - 1].match(/^[0-9]+$/))
        return false;
    return split.slice(1, -1).every(part => part.length === 3 || part.match(/\D/));
}

function isValidDecimalSeparator(string: string, sep: string): boolean {
    // decimal separator is valid only if it occurs once
    const decimalMatch = string.match(new RegExp(escapeRegExp(sep), 'g'));
    return decimalMatch && decimalMatch.length === 1;
}
