import { LocaleEn, numberConstants } from '../parse.constants';
import { DomainType, UseType, UseTypeArgs, UseTypeType } from '../useType';

const nullNum = () => 1234567.654321;

/**
 * Number usetype. Mostly any numerical formats can be wrapped by this.
 * Usetypes such as prices, numbers...
 * @todo ratios, fractions
 */
export class NumberUseType extends UseType<number> {

    prefixes: string[] = [];
    suffixes: string[] = [];

    decimalSeparator: string = '';
    thousandSeparator: string = '';
    separateDecimalThousands: boolean = false;

    scientific: boolean = false;
    explicit: boolean = false;
    integral: boolean = false;
    strictlyPositive: boolean = false;

    min: number | undefined = undefined;
    max: number | undefined = undefined;

    integerPlaces: number | undefined = undefined;
    decimalPlaces: number | undefined = undefined;
    compatibleTypes: UseTypeType[] = ['number'];
    type: UseTypeType = 'number';
    domainType: DomainType = 'ordinal';
    priority = 2;
    private prefixPlaceholder: string | undefined;
    private suffixPlaceholder: string | undefined;

    constructor({
                    separators = [],
                    prefixes = [],
                    suffixes = [],
                    scientific = false,
                    strictlyPositive = false,
                    explicitSign = false,
                }, args: UseTypeArgs) {
        super(args);
        if (separators.length > 0 && separators[0] !== '') {
            this.thousandSeparator = separators[0];
        }
        if (separators.length > 1 && separators[1] !== '') {
            this.decimalSeparator = separators[1];
        } else {
            this.integral = true;
        }

        if (separators.length > 2 && separators[2] === separators[0]) {
            this.separateDecimalThousands = true;
        }

        this.scientific = !!scientific;
        this.strictlyPositive = !!strictlyPositive;
        this.explicit = !!explicitSign;
        this.prefixes = prefixes;

        const prefixIndicators = recognizeIndicators(this.prefixes);
        if (prefixIndicators.type !== 'unknown') {
            this.prefixes = prefixIndicators.domain;
            this.prefixPlaceholder = prefixIndicators.type;
        }

        this.suffixes = suffixes;
        const suffixIndicators = recognizeIndicators(this.suffixes);
        if (suffixIndicators.type !== 'unknown') {
            this.suffixes = suffixIndicators.domain;
            this.suffixPlaceholder = suffixIndicators.type;
        }

        if (this.hasNull) {
            if (this.deformat(this.nullVal) !== null) {
                this.hasNull = false;
                delete this.nullVal;
            }
        }
    }

    static getIdUsetype() {
        return new NumberUseType({strictlyPositive: true}, {potentialIds: true});
    }

    /**
     * Format passed in number as a string, using this UseType's config.
     * @param num number to convert to formatted string
     * @returns formatted number as string using self
     */
    format(num: number): string {
        function _addSeparator(str: string, sep: string, leftAligned: boolean): string {
            const bits = leftAligned ?
                str.match(/.{1,3}/g) :
                str.match(/.{1,3}(?=(.{3})*$)/g);
            return bits.join(sep);
        }

        let outPrefix = this.prefixPlaceholder ?? this.prefixes;
        let outSuffix = this.suffixPlaceholder ?? this.suffixes;

        if (this.scientific) {
            const exponent = num.toFixed(1).indexOf('.') - 1;
            num /= 10 ** exponent;
            outSuffix = 'e' + exponent + outSuffix;
        }

        if (this.explicit && num >= 0) {
            outPrefix += '+';
        }

        let numString;
        if (this.decimalPlaces)
            numString = num.toFixed(this.decimalPlaces);
        else {
            numString = num.toString();
        }

        const numParts = numString.split('.');

        let wholePart = numParts[0];

        if (this.integerPlaces > 0 && numParts[0].length < this.integerPlaces)
            wholePart = '0'.repeat(this.integerPlaces - wholePart.length) + wholePart;

        wholePart = _addSeparator(numParts[0], this.thousandSeparator, false);

        if (this.integral)
            return outPrefix + wholePart + outSuffix;

        let decimalPart = '0';

        if (numParts.length > 1)
            decimalPart = numParts[1];

        if (this.decimalPlaces > 0 && numParts[1].length < this.decimalPlaces)
            decimalPart = decimalPart + '0'.repeat(this.decimalPlaces - decimalPart.length);

        if (this.separateDecimalThousands)
            decimalPart = _addSeparator(numParts[1], this.thousandSeparator, true);

        return outPrefix + wholePart + this.decimalSeparator + decimalPart + outSuffix;
    }

    /**
     * Transform formatted string to number
     * @param str to try to parse
     * @returns {number} number represented by input string
     */
    deformat(str: string): number {
        // TODO
        let temp = str;
        this.prefixes.forEach(prefix => temp.startsWith(prefix) && (temp = temp.slice(prefix.length)));
        this.suffixes.forEach(suffix => temp.endsWith(suffix) && (temp = temp.slice(0, temp.length - suffix.length)));
        if (this.decimalSeparator)
            temp = temp.split(this.decimalSeparator).join('.');
        if (this.thousandSeparator)
            temp = temp.split(this.thousandSeparator).join('');
        if (isNaN(+temp))
            return null;

        this._checkDomain(+temp);

        return +temp;
    }

    isSupersetOf(other: UseType<unknown>): boolean {
        if (!(other instanceof NumberUseType)) {
            return false;
        }

        if (!other.prefixes.every(prefix => this.prefixes.includes(prefix))) {
            return false;
        }

        if (!other.suffixes.every(suffix => this.suffixes.includes(suffix))) {
            return false;
        }

        if (other.decimalSeparator &&
            this.decimalSeparator !== other.decimalSeparator) {
            return false;
        }

        if (other.thousandSeparator &&
            this.thousandSeparator !== other.thousandSeparator) {
            return false;
        }

        return true;
    }

    _checkDomain(num: number) {
        if (this.min === undefined || this.min > num)
            this.min = num;
        if (this.max === undefined || this.max < num)
            this.max = num;
    }

    isSubsetOf(other: UseType<unknown>): boolean {
        return other.isSupersetOf(this);
    }

    isEqualTo(other: UseType<unknown>): boolean {
        return this.isSupersetOf(other) && other.isSupersetOf(this);
    }

    isSimilarTo(other: UseType<unknown>): boolean {
        if (this.isEqualTo(other))
            return false;
        if (!(other instanceof NumberUseType))
            return false;
        const thisSize = this.max - this.min;
        const otherSize = other.max - other.min;
        const intersection = Math.min(this.max, other.max) - Math.max(this.min, other.min);
        return intersection >= (thisSize + otherSize - intersection) / 10;
    }

    toString() {
        if (this.min) {
            return 'N{' + this.format(this.min) + '-' + this.format(this.max) + '}';
        } else {
            return 'N{' + this.format(nullNum()) + '}';
        }
    }

    toFormatString() {
        let ret = 'Number';
        if (this.scientific) ret += ', scientific';
        if (this.strictlyPositive) ret += ', strictly positive';
        if (this.decimalSeparator) ret += ', decimal';
        else ret += ', whole';
        if (this.prefixes.length > 0) ret += ', ' + (this.prefixPlaceholder ?? '') + ' prefixed';
        if (this.suffixes.length > 0) ret += ', ' + (this.suffixPlaceholder ?? '') + ' suffixed';
        return ret;
    }

    toDebugString() {
        return 'Usetype::Number()';
    }
}

function recognizeIndicators(indicators) {
    const currCodes = numberConstants.getCurrencyCodes();

    if (!indicators ||
        !(indicators instanceof Array) ||
        indicators.length === 0 ||
        indicators.every(ind => ind.match(/^\s*$/))) {
        return {type: 'unknown', format: 'unknown', domain: []};
    }

    if (indicators.every(indicator => currCodes.includes(indicator))) {
        return {type: 'currency', format: 'code', domain: [...currCodes]};
    }

    const currSymbols = numberConstants.getCurrencySymbols();
    if (indicators.every(indicator => currSymbols.includes(indicator))) {
        return {type: 'currency', format: 'symbol', domain: [...currSymbols]};
    }

    const metricPrefixSymbols = numberConstants.getMetricPrefixSymbols(LocaleEn);
    const cardinalityPrefixSymbols = numberConstants.getCardinalityPrefixSymbols(LocaleEn);
    const magnitudePrefixSymbols = [].concat(metricPrefixSymbols, cardinalityPrefixSymbols);
    if (indicators.every(indicator => magnitudePrefixSymbols.includes(indicator))) {
        return {type: 'magnitude', format: 'symbol', domain: [...magnitudePrefixSymbols]};
    }

    const metricPrefixNames = numberConstants.getMetricPrefixes(LocaleEn);
    if (indicators.every(indicator => metricPrefixNames.includes(indicator)))
        return {type: 'magnitude', format: 'prefix', domain: [...metricPrefixNames]};

    return {type: 'unknown', format: 'unknown', domain: []};
}
