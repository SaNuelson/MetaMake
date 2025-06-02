import { DomainType, UseType, UseTypeArgs, UseTypeType } from './useType';
import { LocaleEn, numberConstants } from './parse.constants';
import { unique } from '../utils/array';
import { escapeRegExp } from '../utils/string';
import { logger } from '../../logger';

/**
 * Try to recognize possible formats of string-represented numbers in source array.
 * @param {string[]} source strings upon which format should be determined
 * @returns {NumberUseType[]} possible number formats of specified strings
 */
export function recognizeNumbers(source: string[], args): NumberUseType[] {
	logger.info(`recognizeNumbers for label ${args.label} started`, {args});

	const initialBatchSize = 5;

	if (!source || source.length === 0) {
		return [];
	}

	// populate initial batch with largest samples
	const initialBatch = source.slice(0, 5);

	let nuts = extractPossibleFormats(initialBatch, args);
	logger.info(`recognizeNumbers for lable ${args.label} found initial batch of number formats.`,
		{
			args,
			data: source.slice(0,5),
			useTypes: nuts.map(nut => nut.toString())
		});

	const isNutDisabled = nuts.map(_=> false);
	const matches = nuts.map(() => 0);
	const disabled = 0;
	for (let i = 0, il = source.length; i < il; i++) {
		const token = source[i];
		// cache of recovery use-types
		let potentialExpansion = undefined;
		for (let j = 0, jl = nuts.length; j < jl; j++) {
			if (!isNutDisabled[j]) {
				const num = nuts[j].deformat(token);
				if (num !== null) {
					matches[j]++;
					if (nuts[j].max < num) nuts[j].max = num;
					if (nuts[j].min > num) nuts[j].min = num;
				}
				else {
					if (!potentialExpansion) {
						potentialExpansion = extractPossibleFormats([token], args);
					}
					else {
					}
					let foundExpansion = false;
					for (let k = 0, kl = potentialExpansion.length; k < kl; k++) {
						if (potentialExpansion[k].isSupersetOf(nuts[j])) {

							foundExpansion = true;
							const currentParsed = potentialExpansion[k].deformat(token);
							potentialExpansion[k].min = Math.min(currentParsed, nuts[j].min);
							potentialExpansion[k].max = Math.max(currentParsed, nuts[j].max);
							nuts[j] = potentialExpansion[k];
							potentialExpansion.splice(k, 1);
							break;
						}
					}
					if (!foundExpansion) {
						isNutDisabled[j] = true;
					}
				}
			}
		}
		if (disabled === nuts.length) {
			logger.info(`recognizeNumbers for label ${args.label} did not find any suitable number formats.`, {args});
			return [];
		}
	}
	// nuts.forEach((nut, idx) => nut.confidence = matches[idx] / source.length)
	nuts = nuts.filter((nut, i) => !isNutDisabled[i]);

	return nuts;
}

/**
 * Slow method to be used on a small number of samples to generate all possible numeric use-types.
 */
function extractPossibleFormats(source: string[], args): NumberUseType[] {

	/* Unicode character not currently working well, need to find a workaround */
	const knownThousandSeparators = ['.', ',', ' ', '\xa0']; //...unicodeConstants.getUtf16Whitespace()];
	const knownDecimalSeparators = ['.', ','];
	const allKnownSeparators = unique(knownThousandSeparators.concat(knownDecimalSeparators));
	const pureNumericFormPattern = new RegExp('^[' + allKnownSeparators.join('') + '\\d]+$');
	const determinedPrefixes = [];
	const determinedSuffixes = [];

	let determinedMinus = false; // whether format contains negative numbers as well
	let determinedPlus = false; // whether format explicitly uses plus sign

	let determinedLeftEllipsis = false;
	let determinedRightEllipsis = false;

	let determinedScientific = false; // whether format uses scientific notation
	let determinedDelimiterSets = []; // tuples of thousand and decimal separators found

	// Potential numeric-like feature format:
	// SAMPLE = PREFIX NUMBER SUFFIX
	// PREFIX, SUFFIX = non-numeric sequence
	// NUMBER can be
	// 		- scientific (contains e12345 at the end)
	//		- unsigned/signed/explicit (contains no signs / only minus / both minus and plus)
	//		- whole/decimal (does not / contains decimal part)
	//			DECIMAL - left/right/not ellipsed (can contain forms ".NUM" / "NUM." / only "NUM.NUM")
	//		- fully/partially/not separated (each 3 digits / each 3 decimal digits / no digits are separated by separator)
	for (let i = 0, upto = source.length; i < upto; i++) {
		let sample = source[i];

		let potentialPrefix = "";
		const potentialPrefixMatch = sample.match(/^[^0-9]*[^0-9+-]/);
		if (potentialPrefixMatch) {
			potentialPrefix = potentialPrefixMatch[0];
			sample = sample.replace(potentialPrefixMatch[0], "");
		}
		// sample is now without prefix

		let potentialSuffix = "";
		const potentialSuffixMatch = sample.match(/[^.0-9][^0-9]*$/);
		if (potentialSuffixMatch) {
			potentialSuffix = potentialSuffixMatch[0];
			sample = sample.replace(potentialSuffixMatch[0], "");
		}
		// sample now without suffix

		let potentialScientific = false
		const potentialScientificMatch = sample.match(/[eE][0-9]+$/);
		if (potentialScientificMatch) {
			potentialScientific = true;
			sample = sample.replace(potentialScientificMatch[0], "");
		}
		// sample now without scientific notation

		let potentialMinus = false;
		let potentialPlus = false;
		const potentialSignMatch = sample.match(/^[-+]/);
		if (potentialSignMatch) {
			if (potentialSignMatch[0] === "+")
				potentialPlus = true;
			potentialMinus = true;
			sample = sample.replace(potentialSignMatch[0], "");
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
			potentialSeparatorSets.push(["", ""]);
		}
		// CASE only decimal or only thousands separator
		else if (containedSeparators.length === 1) {
			const sep = containedSeparators[0];
			if (isValidThousandSeparator(sample, sep)) {
				potentialSeparatorSets.push([sep, ""]);
			}
			if (isValidDecimalSeparator(sample, sep)) {
				potentialSeparatorSets.push(["", sep]);
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

					const parseSample = sample.split(tsep).join("").split(dsep).join(".");

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
			explicitSign: determinedPlus
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
				}
				else if (numutypes[j].isSupersetOf(numutypes[i])) {
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
	const decimalMatch = string.match(new RegExp(escapeRegExp(sep), "g"));
	return decimalMatch && decimalMatch.length === 1;
}

/**
 * Try to parse a number based on provided format
 * @param {string} source
 * @param {import('./usetype.js').Number} format Usetype.Number instance containing format info
 * @returns Parsed num if possible, NaN otherwise
 */
export function parseNum(source: string, format: NumberUseType): number;
export function parseNum(source: string[], format: NumberUseType): number[];
export function parseNum(source: string | string[], format: NumberUseType): number | number[] {
	if (Array.isArray(source))
		return source.map(format.deformat);
	return format.deformat(source);
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

const nullNum = () => 1234567.654321;

/**
 * Number usetype. Mostly any numerical formats can be wrapped by this.
 * Usetypes such as prices, numbers...
 * @todo ratios, fractions
 */
export class NumberUseType extends UseType<number> {

	prefixes: string[] = [];
	suffixes: string[] = [];

	decimalSeparator: string = "";
	thousandSeparator: string = "";
	separateDecimalThousands: boolean = false;

	scientific: boolean = false;
	explicit: boolean = false;
	integral: boolean = false;
	strictlyPositive: boolean = false;

	min: number | undefined = undefined;
	max: number | undefined = undefined;

	integerPlaces: number | undefined = undefined;
	decimalPlaces: number | undefined = undefined;

	private prefixPlaceholder: string | undefined;
	private suffixPlaceholder: string | undefined;

	compatibleTypes: UseTypeType[] = ["number"];
	type: UseTypeType = "number";
	domainType: DomainType = 'ordinal';
	priority = 2;

	constructor({
		separators = [],
		prefixes = [],
		suffixes = [],
		scientific = false,
		strictlyPositive = false,
		explicitSign = false
	}, args: UseTypeArgs) {
		super(args);
		if (separators.length > 0 && separators[0] !== "") {
			this.thousandSeparator = separators[0];
		}
		if (separators.length > 1 && separators[1] !== "") {
			this.decimalSeparator = separators[1];
		}
		else {
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

	/**
	 * Format passed in number as a string, using this UseType's config.
	 * @param num number to convert to formatted string
	 * @returns formatted number as string using self
	 */
	format(num: number): string {
		function _addSeparator(str: string, sep: string, leftAligned: boolean): string {
			const bits = leftAligned ?
				str.match(/.{1,3}/g) :
				str.match(/.{1,3}(?=(.{3})*$)/g)
			return bits.join(sep);
		}

		let outPrefix = this.prefixPlaceholder ?? this.prefixes;
		let outSuffix = this.suffixPlaceholder ?? this.suffixes;

		if (this.scientific) {
			const exponent = num.toFixed(1).indexOf(".") - 1;
			num /= 10 ** exponent;
			outSuffix = "e" + exponent + outSuffix;
		}

		if (this.explicit && num >= 0) {
			outPrefix += "+";
		}

		let numString;
		if (this.decimalPlaces)
			numString = num.toFixed(this.decimalPlaces);
		else {
			numString = num.toString();
		}

		const numParts = numString.split(".");

		let wholePart = numParts[0];

		if (this.integerPlaces > 0 && numParts[0].length < this.integerPlaces)
			wholePart = "0".repeat(this.integerPlaces - wholePart.length) + wholePart;

		wholePart = _addSeparator(numParts[0], this.thousandSeparator, false);

		if (this.integral)
			return outPrefix + wholePart + outSuffix;

		let decimalPart = "0";

		if (numParts.length > 1)
			decimalPart = numParts[1];

		if (this.decimalPlaces > 0 && numParts[1].length < this.decimalPlaces)
			decimalPart = decimalPart + "0".repeat(this.decimalPlaces - decimalPart.length);

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

	isSupersetOf(other: UseType<any>): boolean {
		if (!(other instanceof NumberUseType)) {
			return false;
		}

		if (!other.prefixes.every(prefix => this.prefixes.includes(prefix))) {
			const exceptions = other.prefixes.filter(prefix => !this.prefixes.includes(prefix));
			return false;
		}

		if (!other.suffixes.every(suffix => this.suffixes.includes(suffix))) {
			const exceptions = other.suffixes.filter(suffix => !this.suffixes.includes(suffix));
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

	isSubsetOf(other: UseType<any>): boolean {
		return other.isSupersetOf(this);
	}

	isEqualTo(other: UseType<any>): boolean {
		return this.isSupersetOf(other) && other.isSupersetOf(this);
	}

	isSimilarTo(other: UseType<any>): boolean {
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
			return "N{" + this.format(this.min) + "-" + this.format(this.max) + "}";
		}
		else {
			return "N{" + this.format(nullNum()) + "}";
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
	toDebugString() { return "Usetype::Number()"; }

	static getIdUsetype() {
		return new NumberUseType({ strictlyPositive: true }, { potentialIds: true });
	}
}

function recognizeIndicators(indicators) {
	const currCodes = numberConstants.getCurrencyCodes();

	if (!indicators ||
		!(indicators instanceof Array) ||
		indicators.length === 0 ||
		indicators.every(ind => ind.match(/^\s*$/))) {
		return { type: 'unknown', format: 'unknown', domain: [] };
	}

	if (indicators.every(indicator => currCodes.includes(indicator))) {
		return { type: 'currency', format: 'code', domain: [...currCodes] };
	}

	const currSymbols = numberConstants.getCurrencySymbols();
	if (indicators.every(indicator => currSymbols.includes(indicator))) {
		return { type: 'currency', format: 'symbol', domain: [...currSymbols] };
	}

	const metricPrefixSymbols = numberConstants.getMetricPrefixSymbols(LocaleEn);
	const cardinalityPrefixSymbols = numberConstants.getCardinalityPrefixSymbols(LocaleEn);
	const magnitudePrefixSymbols = [].concat(metricPrefixSymbols, cardinalityPrefixSymbols);
	if (indicators.every(indicator => magnitudePrefixSymbols.includes(indicator))) {
		return { type: 'magnitude', format: 'symbol', domain: [...magnitudePrefixSymbols] };
	}

	const metricPrefixNames = numberConstants.getMetricPrefixes(LocaleEn);
	if (indicators.every(indicator => metricPrefixNames.includes(indicator)))
		return { type: 'magnitude', format: 'prefix', domain: [...metricPrefixNames] };

	return { type: 'unknown', format: 'unknown', domain: [] };
}
