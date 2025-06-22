import { getScopedLogger } from '../../logger';
import { recognizeEnums } from './enum/recognize';
import { EnumUseType } from './enum/useType';
import { recognizeNumbers } from './number/recognize';
import { recognizeTimestamps } from './timestamp/recognize';
import { recognizeStrings } from './string/recognize';

import { numberConstants, enumConstants, timestampConstants } from './parse.constants';
import { getCommonPrefix, getCommonSuffix } from '../utils/string';
import { UseType, UseTypeArgs } from './useType';

const logger = getScopedLogger('DCR.parse.main');

interface RecognizerArgs extends UseTypeArgs {
	skipConstants?: boolean,
	sizeHardLimit?: number,
	sampleSize?: number,
	label?: string
}

const defaultRecognizerArgs: RecognizerArgs = {
	skipConstants: false,
	sizeHardLimit: 50,
	sampleSize: 500,
}

/**
 * Try to recognize possible types of provided strings in a data array.
 * @param data array of strings to recognize, usually column from SourceData
 * @param args configuring arguments
 * @returns list of possible useTypes
 */
export function determineType(data: string[], args: RecognizerArgs): UseType<unknown>[] {
	logger.info(`determineType for ${args.label} started`, {args});

	args = Object.assign((args ?? {}), defaultRecognizerArgs);

	let gatheredUseTypes: UseType<unknown>[] = [];

	const isDataWithinLimit: boolean = preprocessHardLimitSize(data, args);

	let enumUseTypes: EnumUseType[] = [];
	if (isDataWithinLimit) {
		[data, enumUseTypes] = preprocessEnumlikeness(data, args);
		gatheredUseTypes.push(...enumUseTypes);
	}

	// [data, args] = preprocessIndicators(data, args);

	if ((!args.skipConstants || !args.isConstant) && isDataWithinLimit) {
		const numUseTypes = recognizeNumbers(data, args);
		gatheredUseTypes.push(...numUseTypes);

		const timestampUseTypes = recognizeTimestamps(data, args);
		gatheredUseTypes.push(...timestampUseTypes);
	}
	if (gatheredUseTypes.length === 0) {
		const stringUseTypes = recognizeStrings(data, args);
		gatheredUseTypes = stringUseTypes;
	}

	logger.info(`determineType for ${args.label} finished`,
		{args, useTypes: gatheredUseTypes.map(ut => ut.toString())});

	return gatheredUseTypes;
}

/**
 * In extreme cases when some columns contain large strings (e.g. records/JSONs...), it is necessary to identify and ignore these
 * to avoid extreme processing times, which in most cases return no useful information (these often can't be used as targets and shouldn't be used as source).
 * @param {string[]} source
 * @param {object} args
 * @returns {boolean}
 */
function preprocessHardLimitSize(source, args) {
	if (!args.sizeHardLimit)
		return true;
	const withinSizeLimit = source.every(sample => sample.length < args.sizeHardLimit);
	if (!withinSizeLimit)
		args.limitExceeded = true;
	return withinSizeLimit;
}

/**
 * Special wrapper for categorical recognizer.
 * Created due to its different nature and required additional preprocessing in some cases.
 * @param {string[]} source
 * @param {object} args
 * @returns {[string[], EnumUseType[]]}
 */
function preprocessEnumlikeness(source, args) {
	const enumUseTypes = recognizeEnums(source, args);

	if (args.hasNoval) {
		source = source.filter(value => value !== args.novalVal);
	}

	if (args.isConstant) {
		source = [source[0]];
	}

	return [source, enumUseTypes];
}

// Not implemented, would require internal changes to respective parsers
/**
 * A potential improvement, where prefixes and suffixes would be identified before individual recognizers are used.
 * These affixes could even help determining the most probable use-types (e.g. $ sign for numbers).
 * @param {string[]} source
 * @param {object} args
 */
function preprocessIndicators(source, args) {

	const timestampConstantGroups = Object.values(timestampConstants).map(getFunc => getFunc(args.locale));
	const enumConstantGroups = Object.values(enumConstants).map(getFunc => getFunc(args.locale));
	const numberConstantGroups = Object.values(numberConstants).map(getFunc => getFunc(args.locale));
	const changeLimit = 10;

	let change = true;
	while (change) {
		change = false;

		const [prefix, suffix] = extractCommonAffixes(source);
		if (prefix) {
			args.prefixes = (args.prefixes || []).push([prefix]);
			source = source.map(value => value.substring(prefix.length));
			change = true;
		}
		if (suffix) {
			args.suffixes = (args.suffixes || []).push([suffix]);
			source = source.map(value => value.substring(value.length - suffix.length));
			change = true;
		}

		for (let i = 0; i < 3; i++) {
			const affixType = ["timestamp", "enum", "number"][i];
			const group = [timestampConstantGroups, enumConstantGroups, numberConstantGroups][i];

			const [prefixes, strippedSource, suffixes] = extractCommonIndicators(source, group);
			if (prefixes.length) {
				args.prefixes = (args.prefixes || []).push(prefixes);
				args.indicators = (args.indicators || []).push(affixType);
				source = strippedSource;
				change = true;
			}
			if (suffixes.length) {
				args.suffixes = (args.suffixes || []). push(suffixes);
				args.indicators = (args.indicators || []).push(affixType);
				source = strippedSource;
				change = true;
			}
		}

	}

	function extractCommonAffixes(source) {

		// construct common prefix and suffix
		let prefix = source[0];
		let suffix = source[0];
		let lastChange = 0;
		const counter = 1;
		while (lastChange < changeLimit && counter < source.length) {
			const newPrefix = getCommonPrefix(prefix, source[counter]);
			const newSuffix = getCommonSuffix(suffix, source[counter]);
			if (suffix !== newSuffix || prefix !== newPrefix) {
				lastChange = 0;
				prefix = newPrefix;
				suffix = newSuffix;
			}
		}
		return [prefix, suffix];
	}

	function extractCommonIndicators(source, groups) {
		const prefixesEnabled = groups.map(() => true);
		const suffixesEnabled = groups.map(() => true);
		let lastChange = 0;
		const counter = 0;
		while (lastChange < changeLimit && counter < source.length) {
			const sample = source[counter];

			for (let g = 0, l = groups.length; g < l; g++) {
				if (prefixesEnabled[g] && groups[g].every(indicator => !sample.startsWith(indicator))) {
					prefixesEnabled[g] = false;
					lastChange = 0;
				}
				if (suffixesEnabled[g] && groups[g].every(indicator => !sample.endsWith(indicator))) {
					suffixesEnabled[g] = false;
					lastChange = 0;
				}
			}

			const prefixCount = prefixesEnabled.reduce((a,n) => a + +n, 0);
			let extractedPrefixes = [];
			if (prefixCount > 1) {
				throw "extractCommonIndicators -- multiple prefixes found";
			}
			else if (prefixCount === 1) {
				const prefixIndex = prefixesEnabled.indexOf(true);
				extractedPrefixes = groups[prefixIndex];
			}

			const suffixCount = suffixesEnabled.reduce((a,n) => a + +n, 0);
			let extractedSuffixes = [];
			if (suffixCount > 1) {
				throw "extractCommonIndicators -- multiple suffixes found";
			}
			else if (prefixCount === 1) {
				const suffixIndex = suffixesEnabled.indexOf(true);
				extractedSuffixes = groups[suffixIndex];
			}

			const strippedSource = [];
			for (let i = 0, l = source.length; i < l; i++) {
				let sample = source[i];
				for (const prefix of extractedPrefixes) {
					if (sample.startsWith(prefix)) {
						sample = sample.replace(prefix, "");
						break;
					}
				}
				for (const suffix of extractedSuffixes) {
					if (sample.endsWith(suffix)) {
						sample = sample.replace(suffix, "");
						break;
					}
				}
				strippedSource.push(sample);
			}

			return [extractedPrefixes, strippedSource, extractedSuffixes];
		}

	}

}
