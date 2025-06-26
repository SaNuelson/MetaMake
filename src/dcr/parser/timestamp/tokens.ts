import { DateTokenApplier, DateTokenExtractor, TodTokenApplier, TodTokenExtractor } from './useType';
import { TimeOfDay } from '../../utils/time';
import { escapeRegExp } from '../../utils/string';

// TODO: From constants
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthAbbrevs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekDayAbbrevs = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export enum TimestampCategory {
    Years = 1,
    Months = 2,
    Days = 3,
    Hours = 4,
    Minutes = 5,
    Seconds = 6,
    Milliseconds = 7,
    Era = 8,
    Meridiem = 9,
    DayOfWeek = 10,
    Literal = 11,
}

export enum TimestampSpecificity {
    NumericShort = 0,
    NumericMedium = 1,
    NumericLong = 2,
    WordShort = 3,
    WordLong = 4,
}

export type TimestampTokenDetail = {
    /** Token label used within a formatting string */
    label: string,
    /** Partial regex used to extract this token */
    regexBit: string,
    /** Specific category of this token's value */
    category: TimestampCategory,
    /** Flag whether a token's value is numeric */
    numeric: boolean,
    /** Optionally label of token that is identical but less strict version */
    subtoken?: string,
    /** Method to apply the provided value to a date */
    apply: DateTokenApplier,
    /** Method to apply provided value to a time of day */
    applyTod: TodTokenApplier,
    /** Method to extract this token's value from a date */
    extract: DateTokenExtractor,
    /** Method to extract this token's value from a time of day */
    extractTod: TodTokenExtractor,
    /** Whether token is a literal */
    literal?: boolean
};

export function createTokenLiteral(value: string): TimestampTokenDetail {
    return {
        label: value,
        numeric: false,
        regexBit: escapeRegExp(value),
        category: TimestampCategory.Literal,
        literal: true,
        apply: () => {},
        applyTod: () => {},
        extract: () => '',
        extractTod: () => '',
    };
}

export const TimestampTokenDetails: { [label: string]: TimestampTokenDetail } = {

    /** e.g. year 50 BC */
    era: {
        label: '{EE}',
        regexBit: '(AD|BC)',
        category: TimestampCategory.Era,
        numeric: false,
        // apply is valid since one can expect year preceding era in a format (BC 1500 makes little sense)
        apply: (date, val) => date.getUTCFullYear() > 0 && val === 'BC' && date.setUTCFullYear(-date.getUTCFullYear()),
        applyTod: () => undefined,
        extract: (date) => date.getUTCFullYear() >= 0 ? 'AD' : 'BC',
        extractTod: () => undefined,
    },

    /** e.g. 3.1.1998 */
    yearFull: {
        label: '{YYYY}',
        regexBit: '([12][0-9]{3,})',
        category: TimestampCategory.Years,
        numeric: true,
        subtoken: 'yearShort',
        apply: (date, val) => date.setUTCFullYear(+val),
        applyTod: () => undefined,
        extract: (date) => date.getUTCFullYear().toString().padStart(4, '0'),
        extractTod: () => undefined,
    },

    /** e.g. 3.1.'98 */
    yearShort: {
        label: '{YY}',
        regexBit: '([0-9]{2})',
        category: TimestampCategory.Years,
        numeric: true,
        apply: (date, val) => date.setUTCFullYear(+val),
        applyTod: () => undefined,
        extract: (date) => date.getUTCFullYear().toString(),
        extractTod: () => undefined,
    },

    /** e.g. 03.01.1998 */
    monthFull: {
        label: '{MM}',
        regexBit: '(0\\d|1[012])',
        category: TimestampCategory.Months,
        numeric: true,
        apply: (date, val) => date.setUTCMonth(+val - 1),
        applyTod: () => undefined,
        extract: (date) => (date.getUTCMonth() + 1).toString().padStart(2, '0'),
        extractTod: () => undefined,
    },

    /** e.g. 3.1.1998 */
    monthShort: {
        label: '{M}',
        regexBit: '(0?\\d|1[012])',
        category: TimestampCategory.Months,
        numeric: true,
        subtoken: 'monthFull',
        apply: (date, val) => date.setUTCMonth(+val - 1),
        applyTod: () => undefined,
        extract: (date) => (date.getUTCMonth() + 1).toString(),
        extractTod: () => undefined,
    },

    /** e.g. January 3rd 1998 */
    monthName: {
        label: '{MMMM}',
        regexBit: '(' + monthNames.map(m => '(?:' + m + ')').join('|') + ')',
        category: TimestampCategory.Months,
        numeric: false,
        apply: (date, val) => date.setUTCMonth(monthNames.indexOf(val)),
        applyTod: () => undefined,
        extract: (date) => monthNames[date.getUTCMonth()],
        extractTod: () => undefined,
    },

    /** e.g. Jan 3rd, 1998 */
    monthAbbrev: {
        label: '{MMM}',
        regexBit: '(' + monthAbbrevs.map(m => '(?:' + m + ')').join('|') + ')',
        category: TimestampCategory.Months,
        numeric: false,
        apply: (date, val) => date.setUTCMonth(monthAbbrevs.indexOf(val)),
        applyTod: () => undefined,
        extract: (date) => monthAbbrevs[date.getUTCMonth()],
        extractTod: () => undefined,
    },

    /** e.g. 03.01.1998 */
    dayFull: {
        label: '{DD}',
        regexBit: '(0[1-9]|[12]\\d|3[01])',
        category: TimestampCategory.Days,
        numeric: true,
        apply: (date, val) => date.setUTCDate(+val),
        applyTod: () => undefined,
        extract: (date) => date.getUTCDate().toString().padStart(2, '0'),
        extractTod: () => undefined,
    },

    /** e.g. 3.1.1998 */
    dayShort: {
        label: '{D}',
        regexBit: '(0?[1-9]|[12]\\d|3[01])',
        category: TimestampCategory.Days,
        numeric: true,
        subtoken: 'dayFull',
        apply: (date, val) => date.setUTCDate(+val),
        applyTod: () => undefined,
        extract: (date) => date.getUTCDate().toString(),
        extractTod: () => undefined,
    },

    /** e.g. Saturday 3.1. 1998 */
    dayOfWeekFull: {
        label: '{DDDD}',
        category: TimestampCategory.DayOfWeek,
        numeric: false,
        regexBit: '(' + weekDays.map(d => '(?:' + d + ')').join('|') + ')',
        apply: () => undefined,
        applyTod: () => undefined,
        extract: (date) => weekDays[date.getUTCDay()],
        extractTod: () => undefined,
    },

    /** e.g. Sat 3.1. 1998 */
    dayOfWeekShort: {
        label: '{DDD}',
        category: TimestampCategory.DayOfWeek,
        numeric: false,
        regexBit: '(' + weekDayAbbrevs.map(d => '(?:' + d + ')').join('|') + ')',
        apply: () => undefined,
        applyTod: () => undefined,
        extract: (date) => weekDayAbbrevs[date.getUTCDay()],
        extractTod: () => undefined,
    },

    /** e.g. 7:30 AM */
    meridiem: {
        label: '{RR}',
        regexBit: '(AM|PM)',
        category: TimestampCategory.Meridiem,
        numeric: false,
        // same like era, it should be safe to assume meridiem won't be preceding hours (e.g. AM 7:30)
        apply: (date, val) => {
            const hours = date.getUTCHours();
            if (val === 'PM' && hours < 12)
                date.setUTCHours(hours + 12); // all after noon
            else if (val === 'AM' && hours === 12)
                date.setUTCHours(0); // midnight
        },
        applyTod: () => undefined,
        extract: (date) => date.getUTCHours() < 12 || date.getUTCHours() === 0 ? 'AM' : 'PM',
        extractTod: (tod) => tod[0] < 12 || tod[0] === 0 ? 'AM' : 'PM',
    },

    /** e.g. 07:05:32 */
    hourFull: {
        label: '{hh}',
        regexBit: '([01]\\d|2[0-3])',
        category: TimestampCategory.Hours,
        numeric: true,
        apply: (date, val) => date.setUTCHours(+val),
        applyTod: (tod, val) => tod[0] = +val,
        extract: (date, format) => {
            let extracted = date.getUTCHours();
            if (format && format.includes(TimestampTokenDetails.meridiem.label))
                extracted %= 12;
            return extracted.toString().padStart(2, '0');
        },
        extractTod: (tod, format) => {
            let extracted = tod[0];
            if (format && format.includes(TimestampTokenDetails.meridiem.label))
                extracted %= 12;
            return extracted.toString().padStart(2, '0');
        },
    },

    /** e.g. 7:05 AM */
    hourShort: {
        label: '{h}',
        regexBit: '([01]?\\d|2[0-3])',
        category: TimestampCategory.Hours,
        numeric: true,
        subtoken: 'hourFull',
        apply: (date, val) => date.setUTCHours(+val),
        applyTod: (tod, val) => tod[0] = +val,
        extract: (date, format) => {
            let extracted = date.getUTCHours();
            if (format && format.includes(TimestampTokenDetails.meridiem.label))
                extracted %= 12;
            return extracted.toString();
        },
        extractTod: (tod, format) => {
            let extracted = tod[0];
            if (format && format.includes(TimestampTokenDetails.meridiem.label))
                extracted %= 12;
            return extracted.toString();
        },
    },

    /** e.g. 07:05:32 */
    minuteFull: {
        label: '{mm}',
        regexBit: '([0-5]\\d)',
        category: TimestampCategory.Minutes,
        numeric: true,
        apply: (date, val) => date.setUTCMinutes(+val),
        applyTod: (tod, val) => tod[1] = +val,
        extract: (date) => date.getUTCMinutes().toString().padStart(2, '0'),
        extractTod: (tod) => tod[1].toString().padStart(2, '0'),
    },

    /** e.g. 5m 32s */
    minuteShort: {
        label: '{m}',
        regexBit: '([0-5]?\\d)',
        category: TimestampCategory.Minutes,
        numeric: true,
        subtoken: 'minuteFull',
        apply: (date, val) => date.setUTCMinutes(+val),
        applyTod: (tod, val) => tod[1] = +val,
        extract: (date) => date.getUTCMinutes().toString(),
        extractTod: (tod) => tod[1].toString(),
    },

    /** e.g. 14:15:08 */
    secondFull: {
        label: '{ss}',
        regexBit: '([0-5]\\d)',
        category: TimestampCategory.Seconds,
        numeric: true,
        apply: (date, val) => date.setUTCSeconds(+val),
        applyTod: (tod, val) => tod[2] = +val,
        extract: (date) => date.getUTCSeconds().toString().padStart(2, '0'),
        extractTod: (tod) => tod[2].toString().padStart(2, '0'),
    },

    /** e.g. 6.32 s */
    secondShort: {
        label: '{s}',
        regexBit: '([0-5]?\\d)',
        category: TimestampCategory.Seconds,
        numeric: true,
        subtoken: 'secondFull',
        apply: (date, val) => date.setUTCSeconds(+val),
        applyTod: (tod, val) => tod[2] = +val,
        extract: (date) => date.getUTCSeconds().toString(),
        extractTod: (tod) => tod[2].toString(),
    },

    /** e.g. 35.027s */
    millisecondFull: {
        label: '{nnn}',
        regexBit: '(\\d{3})',
        category: TimestampCategory.Milliseconds,
        numeric: true,
        apply: (date, val) => date.setUTCMilliseconds(+val),
        applyTod: (tod, val) => tod[3] = +val,
        extract: (date) => date.getUTCMilliseconds().toString().padStart(3, '0'),
        extractTod: (tod) => tod[3].toString().padStart(3, '0'),
    },

    /** e.g. 35s 27ms */
    millisecondShort: {
        label: '{n}',
        regexBit: '(\\d{,3})',
        category: TimestampCategory.Milliseconds,
        numeric: true,
        subtoken: 'millisecondFull',
        apply: (date, val) => date.setUTCMilliseconds(+val),
        applyTod: (tod, val) => tod[3] = +val,
        extract: (date) => date.getUTCMilliseconds().toString(),
        extractTod: (tod) => tod[3].toString(),
    },
};
(function () {
    delete TimestampTokenDetails.yearShort;
    delete TimestampTokenDetails.millisecondShort;
})();


/** Dictionary mapping token labels to their names/keys. */
export const TimestampLabelToToken: { [label: string]: string } = Object
    .entries(TimestampTokenDetails)
    .reduce((labelToToken, [tokenKey, tokenDetail]) => {
        labelToToken[tokenDetail.label] = tokenKey; // Map label to token key
        return labelToToken;
    }, {} as { [label: string]: string });

function getTokenByLabel(label: string): string {
    return TimestampLabelToToken[label];
}

function getTokenDetails(token: string): TimestampTokenDetail {
    return TimestampTokenDetails[token];
}

export function getTokenDetailsByLabel(label: string): TimestampTokenDetail {
    const token = getTokenDetails(getTokenByLabel(label));
    return token ? token : createTokenLiteral(label);
}

export function existsLabel(label: string): boolean {
    return TimestampLabelToToken[label] !== undefined;
}

export function isLiteral(token: any): token is { literal: true } {
    return token && token.literal === true;
}
