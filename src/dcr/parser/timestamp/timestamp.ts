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
export type DateTokenApplier = (date: Date, value: any) => void;
export type TodTokenApplier = (tod: TimeOfDay, value: any) => void;

type DateTimestampType = 'date' | 'datetime';
type TodTimestampType = 'timeofday';
type TimestampType<T = Date | TimeOfDay> = 'unknown' | (T extends Date ? DateTimestampType : TodTimestampType)

function nullDate(): Date { return new Date(0) }
function nullTod(): TimeOfDay { return [0, 0, 0, 0] }

export type TimestampArgs<T = Date | TimeOfDay> = {
    formatting: string[],
    skipValidation?: boolean,
    type?: T extends Date ? DateTimestampType : TodTimestampType,
    min?: T,
    max?: T
}

export class Timestamp<T = Date | TimeOfDay> extends UseType<T> {

    private _extractors: T extends Date ? DateTokenExtractor[] : TodTokenExtractor[];
    private _pattern: RegExp;
    private _appliers: T extends Date ? DateTokenApplier[] : TodTokenApplier[];

    min: T = undefined;
    max: T = undefined;
    formatting?: string[];
    timestampType: TimestampType = 'unknown';
    pattern?: string;
    replacement = null;
    type: UseTypeType = 'timestamp';
    domainType: DomainType = 'ordinal';
    priority = 3;

    constructor(args: TimestampArgs<T>, superArgs: UseTypeArgs) {
        super(superArgs);

        let explicitType: TimestampType = args.type;
        if (!explicitType)
            explicitType = 'unknown';

        let minType: TimestampType = 'unknown';
        if (args.min) {
            this.min = args.min;
            if (isValidDate(args.min)) {
                minType = 'datetime';
            } else if (isValidTimeOfDay(args.min)) {
                minType = 'timeofday';
            } else minType = 'unknown';
        }
        let maxType: TimestampType = 'unknown';
        if (args.max) {
            this.max = args.max;
            if (isValidDate(args.max)) {
                maxType = 'datetime';
            } else if (isValidTimeOfDay(args.max)) {
                maxType = 'timeofday';
            } else maxType = 'unknown';
        }

        const implicitType = determineTypeFromFormatting(args.formatting);

        let gatheredTypes = [minType, maxType, explicitType, implicitType];

        gatheredTypes = gatheredTypes.filter(type => type !== 'unknown');

        const allTypesEqual = gatheredTypes.every(type => type === gatheredTypes[0]);

        if (!allTypesEqual) {
            this.timestampType = 'unknown';
        }

        this.timestampType = gatheredTypes[0] as TimestampType<T>;

        this.formatting = [...args.formatting];

        // TODO: I have absolutely no clue why this doesn't work
        // @ts-ignore
        if (!args.skipValidation && !hasValidFormat(this)) {
            this.timestampType = 'unknown';
            return;
        }

        // format(date)
        // extract all bits from date, join them

        // deformat(string)
        // match with regex (which extracts all important groups)
        // apply those using appliers

        const regBits = [];

        const appliers = [];
        const extractors = [];

        let applyMethod = 'apply';
        let extractMethod = 'extract';

        if (this.timestampType === 'timeofday') {
            applyMethod = 'applyTod';
            extractMethod = 'extractTod';
        }

        this.formatting.forEach(bit => {
            if (existsLabel(bit)) {
                const token = getTokenDetailsByLabel(bit) as TimestampTokenDetail;
                regBits.push(token.regexBit);
                appliers.push(token[applyMethod]);
                extractors.push(token[extractMethod]);

            } else {
                regBits.push(escapeRegExp(bit));
                extractors.push(() => bit);
            }
        });
        const pattern = new RegExp(regBits.join(''));

        this._extractors = extractors;
        this._pattern = pattern;
        this._appliers = appliers;

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

    toFormatString() {
        return 'Chronometric (' + this.timestampType + ') "' + Timestamp.toShortFormatting(this.formatting) + '"';
    }

    format(date: T, verbose = false): string {
        return this._extractors.map(ex => ex(date, this.formatting)).join('');
    }

    deformat(string: string, verbose = false): T {
        let retval = null;
        if (this.timestampType === 'timeofday')
            retval = nullTod();
        else if (['time', 'date', 'datetime'].includes(this.timestampType))
            retval = nullDate();
        else {
            return retval;
        }

        const match = string.match(this._pattern);
        if (!match) {
            return null;
        }
        this._appliers.forEach((app, idx) => app(retval, match[idx + 1], this.formatting));

        // consistency check
        if (string !== this.format(retval, verbose)) {
            return null;
        }

        this._checkDomain(retval);
        return retval;
    }

    isSupersetOf(other: UseType<any>) {
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

            const otherSubtoken = TimestampTokenDetails[(otherToken as TimestampTokenDetail).subtoken];
            if (otherToken !== thisToken && otherSubtoken !== thisToken) {
                return false;
            }
        }

        return true;
    }

    isSubsetOf(other: UseType<any>): boolean {
        return other.isSupersetOf(this);
    }

    isEqualTo(other: UseType<any>): boolean {
        return this.isSubsetOf(other) && this.isSupersetOf(other);
    }

    isSimilarTo(other: UseType<any>): boolean {
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
