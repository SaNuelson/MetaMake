import { compareDates, compareTods, dateToTimeOfDay, isValidDate, isValidTimeOfDay, TimeOfDay } from '../../utils/time';
import { DomainType, UseType, UseTypeArgs, UseTypeType } from '../useType';
import { escapeRegExp } from '../../utils/string';
import {
    existsLabel,
    getTokenDetailsByLabel, isLiteral,
    TimestampTokenDetail,
    TimestampTokenDetails,
} from './tokens';
import { determineTypeFromFormatting, hasValidFormat } from './format';

export type DateTokenExtractor = (date: Date, format?: string[]) => string;
export type TodTokenExtractor = (tod: TimeOfDay, format?: string[]) => string;
export type DateTokenApplier = (date: Date, value: string) => void;
export type TodTokenApplier = (tod: TimeOfDay, value: string) => void;

export enum TimestampType {
    UNKNOWN = 'unknown',
    TIME = 'time',
    DATE = 'date',
    DATETIME = 'datetime',
    TIMEOFDAY = 'timeofday'
}
type DateTimestampType = TimestampType.DATETIME | TimestampType.DATE | TimestampType.TIME;

function nullDate(): Date { return new Date(0) }
function nullTod(): TimeOfDay { return [0, 0, 0, 0] }

export type TimestampArgs<T = Date | TimeOfDay> = {
    formatting: string[],
    skipValidation?: boolean,
    type?: T extends Date ? DateTimestampType : TimestampType.TIMEOFDAY,
    min?: T,
    max?: T
}

export class Timestamp<T = Date | TimeOfDay> extends UseType<T> {

    /**
     * Pattern constructed during initialization.
     * Used during {@link deformat} for matching a source string,
     * and dividing it into groups, with each group corresponding
     * to its respective token / literal.
     */
    private readonly _pattern: RegExp;

    /**
     * A set of functions used during {@link format}.
     * These are used in sequence on the source value to construct a formatted string.
     */
    private _extractors: T extends Date ? DateTokenExtractor[] : TodTokenExtractor[] = [];

    /**
     * A set of functions used during {@link deformat}.
     * These are used in sequence on their groups matched from source string to modify the output value.
     * @private
     */
    private _appliers: T extends Date ? DateTokenApplier[] : TodTokenApplier[] = [];

    /** Minimal observed value */
    min: T = undefined;
    /** Maximal observed value */
    max: T = undefined;

    /**
     * Array of {@link TimestampTokenDetail} labels and literals in order in which they form the timestamp.
     * @example ['{hh}', ':', '{mm}', ':', '{ss}']
     */
    formatting?: string[];

    timestampType: TimestampType = TimestampType.UNKNOWN;

    pattern?: string;
    replacement = null;
    type: UseTypeType = 'timestamp';
    domainType: DomainType = 'ordinal';
    priority = 3;

    constructor(args: TimestampArgs<T>, superArgs: UseTypeArgs) {
        super(superArgs);

        let explicitType: TimestampType = args.type;
        if (!explicitType)
            explicitType = TimestampType.UNKNOWN;

        let minType: TimestampType = TimestampType.UNKNOWN;
        if (args.min) {
            this.min = args.min;
            if (isValidDate(args.min)) {
                minType = TimestampType.DATETIME;
            } else if (isValidTimeOfDay(args.min)) {
                minType = TimestampType.TIMEOFDAY;
            } else minType = TimestampType.UNKNOWN;
        }

        let maxType: TimestampType = TimestampType.UNKNOWN;
        if (args.max) {
            this.max = args.max;
            if (isValidDate(args.max)) {
                maxType = TimestampType.DATETIME;
            } else if (isValidTimeOfDay(args.max)) {
                maxType = TimestampType.TIMEOFDAY;
            } else maxType = TimestampType.UNKNOWN;
        }

        const implicitType: TimestampType = determineTypeFromFormatting(args.formatting);

        const gatheredTypes: Array<TimestampType> = [minType, maxType, explicitType, implicitType]
            .filter(type => type !== TimestampType.UNKNOWN);

        const allTypesEqual = gatheredTypes.every(type => type === gatheredTypes[0]);

        if (!allTypesEqual) {
            this.timestampType = TimestampType.UNKNOWN;
        }
        else {
            this.timestampType = gatheredTypes[0] as TimestampType;
        }

        this.formatting = [...args.formatting];

        if (!args.skipValidation && !hasValidFormat(this)) {
            this.timestampType = TimestampType.UNKNOWN;
            return;
        }

        // format(date)
        // extract all bits from date, join them

        // deformat(string)
        // match with regex (which extracts all important groups)
        // apply those using appliers

        const regexBits = [];

        this.formatting.forEach(bit => {
            if (existsLabel(bit)) {
                // Token matching value
                const token = getTokenDetailsByLabel(bit) as TimestampTokenDetail;
                regexBits.push(token.regexBit);

                if (this.timestampType === TimestampType.TIMEOFDAY) {
                    (this._appliers as Array<TodTokenApplier>).push(token.applyTod);
                    (this._extractors as Array<TodTokenExtractor>).push(token.extractTod);
                }
                else {
                    (this._appliers as Array<DateTokenApplier>).push(token.apply);
                    (this._extractors as Array<DateTokenExtractor>).push(token.extract);
                }
            } else {
                // Literal
                regexBits.push(escapeRegExp(bit));
                this._extractors.push(() => bit);
            }
        });
        this._pattern = new RegExp(regexBits.join(''));

        if (this.hasNull) {
            if (this.deformat(this.nullVal) !== null) {
                this.hasNull = false;
                delete this.nullVal;
            }
        }
    }

    toString() {
        let ret = '';
        if (this.min && this.max)
            ret = this.format(this.min) + '-' + this.format(this.max);
        else if (this.min || this.max)
            ret = this.format(this.min ? this.min : this.max);
        else {
            if (this.timestampType === 'datetime')
                ret = this.format(nullDate() as T);
            else if (this.timestampType === 'date')
                ret = this.format(nullDate() as T);
            else if (this.timestampType === 'timeofday')
                ret = this.format(dateToTimeOfDay(nullDate()) as T);
        }
        let prefix = 'X';
        if (this.timestampType === 'date')
            prefix = 'D';
        else if (this.timestampType === 'datetime')
            prefix = 'DT';
        else if (this.timestampType === 'timeofday')
            prefix = 'TOD';
        return prefix + '{' + ret + '}';
    }

    toDebugString(): string {
        return 'Usetype::Timestamp()';
    }

    toFormatString() {
        return 'Chronometric (' + this.timestampType + ') "' + Timestamp.toShortFormatting(this.formatting) + '"';
    }

    format(date: T, verbose = false): string {
        return this._extractors.map(ex => ex(date, this.formatting)).join('');
    }

    deformat(string: string, verbose = false): T {
        let value: T = null;
        if (this.timestampType === TimestampType.TIMEOFDAY)
            (value as TimeOfDay) = nullTod();
        else if ([TimestampType.TIME, TimestampType.DATE, TimestampType.DATETIME].includes(this.timestampType))
            (value as Date) = nullDate();
        else {
            return value;
        }

        const match = string.match(this._pattern);
        if (!match) {
            return null;
        }
        this._appliers.forEach((app, idx) => app(value, match[idx + 1], this.formatting));

        // consistency check
        if (string !== this.format(value, verbose)) {
            return null;
        }

        this._checkDomain(value);
        return value;
    }

    isSupersetOf(other: UseType<unknown>) {
        if (!(other instanceof Timestamp)) {
            return false;
        }

        if (this.formatting.length !== other.formatting.length) {
            return false;
        }

        for (let i = 0, l = this.formatting.length; i < l; i++) {
            const thisToken = getTokenDetailsByLabel(this.formatting[i]);
            const otherToken = getTokenDetailsByLabel(other.formatting[i]);

            if (isLiteral(thisToken) !== isLiteral(otherToken)) {
                // TODO: Expect possibility of split literal, e.g. "at " vs "at", " "
                return false;
            }

            if (isLiteral(thisToken) && isLiteral(otherToken) && this.formatting[i] !== other.formatting[i]) {
                return false;
            }

            const otherSubtoken = (otherToken as TimestampTokenDetail).subtoken ?
                TimestampTokenDetails[(otherToken as TimestampTokenDetail).subtoken] :
                undefined;
            if (otherToken !== thisToken && otherSubtoken !== thisToken) {
                return false;
            }
        }

        return true;
    }

    isSubsetOf(other: UseType<unknown>): boolean {
        return other.isSupersetOf(this);
    }

    isEqualTo(other: UseType<unknown>): boolean {
        return this.isSubsetOf(other) && this.isSupersetOf(other);
    }

    isSimilarTo(other: UseType<unknown>): boolean {
        return this.isSubsetOf(other) || this.isSupersetOf(other);
    }

    _checkDomain(value: T) {
        let compFunc;
        if (this.timestampType === 'timeofday')
            compFunc = compareTods;
        else if (this.timestampType === 'datetime' || this.timestampType === 'date')
            compFunc = compareDates;
        else
            return;

        if (this.min === undefined || compFunc(this.min, value) > 0)
            this.min = value;

        if (this.max === undefined || compFunc(this.max, value) < 0)
            this.max = value;
    }

    /**
     * Try to generate timestamp useType from short string formatting
     * @param {string} string usual formatting joined into string (without curly brackets)
     * @warning volatile, should be used only for debugging purposes.
     */
    static fromShortFormatting(string) {
        const strippedLabels = [];
        for (const key in TimestampTokenDetails)
            strippedLabels.push(TimestampTokenDetails[key].label.slice(1, -1));
        let temp = string;
        let properLabels = [];
        while (temp.length > 0) {
            const matched = strippedLabels.filter(label => temp.startsWith(label));
            if (matched.length > 0) {
                const longest = matched.reduce((l, n) => l.length < n.length ? n : l, '');
                properLabels.push('{' + longest + '}');
                temp = temp.slice(longest.length);
            } else {
                properLabels.push(temp[0]);
                temp = temp.slice(1);
            }
        }
        properLabels[0] = [properLabels[0]];
        properLabels = properLabels.reduce((acc, next) => {
            if (acc[acc.length - 1].endsWith('}') || next.startsWith('{')) {
                acc.push(next);
                return acc;
            } else {
                acc[acc.length - 1] = acc[acc.length - 1] + next;
                return acc;
            }
        });
        return new Timestamp({formatting: properLabels}, {});
    }

    static toShortFormatting(formatting) {
        return formatting.map(f => f.replace(/\{(.*)\}/, '$1')).join('');
    }
}
