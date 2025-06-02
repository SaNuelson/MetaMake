import {
    getTokenDetailsByLabel,
    TimestampCategory,
    TimestampLabelToToken,
    TimestampSpecificity,
    TimestampTokenDetails,
} from './tokens';
import { TimeOfDay } from '../../utils/time';
import { hasDuplicates } from '../../utils/array';
import { must } from '../../utils/logic';
import { Timestamp } from './timestamp';

export function determineTypeFromFormatting(format: string[]) {

    let tokens = format.map(label => TimestampLabelToToken[label]);
    tokens = tokens.filter(t => t);
    const tokenCategories = tokens.map(token => TimestampTokenDetails[token].category);

    const timeCategories = [
        TimestampCategory.Hours,
        TimestampCategory.Minutes,
        TimestampCategory.Seconds,
        TimestampCategory.Milliseconds,
    ];

    const dateCategories = [
        TimestampCategory.Years,
        TimestampCategory.Months,
        TimestampCategory.Days,
        TimestampCategory.Era,
    ];

    let containsDate = false;
    if (tokenCategories.some(category => dateCategories.includes(category)))
        containsDate = true;

    let containsTime = false;
    if (tokenCategories.some(category => timeCategories.includes(category)))
        containsTime = true;

    if (containsTime && containsDate)
        return 'datetime';

    if (containsTime)
        return 'timeofday';

    if (containsDate)
        return 'date';

    return 'unknown';
}

export function hasValidFormat(timestamp: Timestamp): boolean {
    return validateTimestampFormat(timestamp.formatting);
}

function dateToTimeOfDay(date: Date): TimeOfDay {
    return [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
}

function validateTimestampFormat(format: string[]): boolean {

    const tokenLabels = format.filter(label => Object.values(TimestampTokenDetails).some(token => token.label === label));
    if (hasDuplicates(tokenLabels)) {
        return false;
    }
    let tokens = format.map(label => TimestampLabelToToken[label]);
    tokens = tokens.filter(l => l);
    const categories = tokens.map(token => TimestampTokenDetails[token].category);

    if (hasDuplicates(categories))
        return false;

    if (!enforceCustomRules(format))
        return false;

    return true;
}

function enforceCustomRules(format: string[]): boolean {

    function has(...categories: TimestampCategory[]) {
        return function (format: string[]) {
            return categories.every(category =>
                format.some(label =>
                    getTokenDetailsByLabel(label).category === category));
        }
    }

    function areInOrder(...cats: TimestampCategory[]) {
        return function (format: string[]) {
            const formatCats = format.map(label => getTokenDetailsByLabel(label).category);
            return cats
                .map(cat => formatCats.indexOf(cat))
                .map((cat, idx, arr) => idx === arr.length - 1 || cat < arr[idx + 1])
                .reduce((acc, cat) => acc && cat, true);
        }
    }

    function areInOrderIfExist(cat1: TimestampCategory, cat2: TimestampCategory): (format: string[]) => boolean;
    function areInOrderIfExist(cat1: TimestampCategory[], cat2: TimestampCategory[]): (format: string[]) => boolean;
    function areInOrderIfExist(cat1: TimestampCategory | TimestampCategory[], cat2: TimestampCategory | TimestampCategory[]): (format: string[]) => boolean {

        if (Array.isArray(cat1) && Array.isArray(cat2)) {
            return function (format) {
                const formatCats = format
                    .map(label => getTokenDetailsByLabel(label).category)
                    .filter(c => c);
                const cat1idxs = cat1.map(cat => formatCats.indexOf(cat)).filter(idx => idx >= 0);
                const cat2idxs = cat2.map(cat => formatCats.indexOf(cat)).filter(idx => idx >= 0);
                return Math.max(...cat1idxs) < Math.min(...cat2idxs);
            }
        }

        if (Array.isArray(cat1) || Array.isArray(cat2)) {
            throw new Error("areInOrderIfExist - either both array or neither");
        }

        return must.imply(
            has(cat1, cat2),
            areInOrder(cat1, cat2)
        );
    }

    // function isBefore(cat: TimestampCategory, otherCats: TimestampCategory[]) {
    //     return function (format: string[]) {
    //         let rules = otherCats.map(otherCat => ordered(otherCat, cat));
    //         return must.all(...rules);
    //     }
    // }
    //
    // function isAfter(cat: TimestampCategory, otherCats: TimestampCategory[]) {
    //     return function (format: string[]) {
    //         let rules = otherCats.map(otherCat => ordered(cat, otherCat));
    //         return must.all(...rules);
    //     }
    // }

    // Return true if specified set of categories has no other non-literal tokens inbetween in format.
    function grouped(...categories: TimestampCategory[]) {
        return function (format: string[]) {
            let formatCats = format.map(label => getTokenDetailsByLabel(label).category);
            formatCats = formatCats.filter(c => c);
            let areCatsRelevant = formatCats.map(c => categories.includes(c));
            areCatsRelevant = areCatsRelevant.slice(areCatsRelevant.indexOf(true), areCatsRelevant.lastIndexOf(true));
            return areCatsRelevant.reduce((a, n) => a && n, true);
        }
    }

    // If format contains 2 mandatory date/datetime/time tokens,
    // it has to contain all inbetween (has year, has minutes, should have months, days, hours)
    const compliesInclusion = (format: string[]) => {
        const categoriesInOrder = [
            TimestampCategory.Years,
            TimestampCategory.Months,
            TimestampCategory.Days,
            TimestampCategory.Hours,
            TimestampCategory.Minutes,
            TimestampCategory.Seconds,
            TimestampCategory.Milliseconds
        ];
        const hasCategories = categoriesInOrder.map((category) => has(category)(format));
        const firstPresent = hasCategories.indexOf(true);
        const lastPresent = hasCategories.lastIndexOf(true);
        return hasCategories.slice(firstPresent, lastPresent).reduce((a, n) => a && n, true);
    }

    // Presence of specific tokens implies presence of others
    // Meridiem makes no sense without hours, era without years...
    const compliesContinuity = must.all(
        must.imply(
            has(TimestampCategory.Milliseconds),
            has(TimestampCategory.Seconds)
        ),
        must.imply(
            has(TimestampCategory.Meridiem),
            has(TimestampCategory.Hours)
        ),
        must.imply(
            has(TimestampCategory.Era),
            has(TimestampCategory.Years)
        )
    );

    // Despite various nature of datetime formats, some things are constant
    const compliesSuccession = must.all(
        // time tokens are in direct order (hours, minutes, seconds, milliseconds)
        areInOrderIfExist(TimestampCategory.Hours, TimestampCategory.Minutes),
        areInOrderIfExist(TimestampCategory.Minutes, TimestampCategory.Seconds),
        areInOrderIfExist(TimestampCategory.Seconds, TimestampCategory.Milliseconds),
        areInOrderIfExist(TimestampCategory.Hours, TimestampCategory.Meridiem),

        // era comes only after year (AD 500 makes no sense)
        areInOrderIfExist(TimestampCategory.Years, TimestampCategory.Era),

        // time comes only after date, both are grouped
        areInOrderIfExist(
            [
                TimestampCategory.Years,
                TimestampCategory.Months,
                TimestampCategory.Days,
                TimestampCategory.Era,
                TimestampCategory.DayOfWeek
            ],
            [
                TimestampCategory.Hours,
                TimestampCategory.Minutes,
                TimestampCategory.Seconds,
                TimestampCategory.Milliseconds,
                TimestampCategory.Meridiem
            ]),

        must.imply(
            has(
                TimestampCategory.Years,
                TimestampCategory.Months,
                TimestampCategory.Days
            ),
            must.any(
                // UTC format
                areInOrder(
                    TimestampCategory.Years,
                    TimestampCategory.Months,
                    TimestampCategory.Days
                ),
                // common format
                areInOrder(
                    TimestampCategory.Days,
                    TimestampCategory.Months,
                    TimestampCategory.Years
                ),
                // american format
                areInOrder(
                    TimestampCategory.Months,
                    TimestampCategory.Days,
                    TimestampCategory.Years
                )
            )
        )
    );

    const compliesNumericSeparation = (format) => {
        const numericSpecificities = [
            TimestampSpecificity.NumericLong,
            TimestampSpecificity.NumericMedium,
            TimestampSpecificity.NumericShort
        ];

        const startsNumerically = (label) => {
            const token = getTokenDetailsByLabel(label);
            if (token.literal) {
                return /^[0-9]/.test(label);
            }
            else {
                return token.numeric;
            }
        }

        const endsNumerically = (label) => {
            const token = getTokenDetailsByLabel(label);
            if (token.literal) {
                return /[0-9]$/.test(label);
            }
            else {
                return token.numeric;
            }
        }

        for (let i = 0; i < format.length - 1; i++) {
            if (endsNumerically(format[i]) && startsNumerically(format[i + 1])) {
                return false;
            }
        }
        return true;
    }

    return compliesInclusion(format) && compliesContinuity(format) && compliesSuccession(format) && compliesNumericSeparation(format);
}
