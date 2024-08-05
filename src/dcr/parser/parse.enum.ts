import { UseType } from './useType';

/**
 * Try to recognize possible formats of string-represented enums in source array.
 * @param source strings upon which format should be determined
 * @returns possible enum formats of specified strings
 */
export function recognizeEnums(source: string[], args): Enum[] {
    if (!source || source.length === 0)
        return [];

    let valueIndexes: { [value: string]: number[] } = {};
    for (let i = 0; i < source.length; i++) {
        if (!valueIndexes[source[i]])
            valueIndexes[source[i]] = [];
        valueIndexes[source[i]].push(i);
    }

    let valueCounts: [string, number][] = [];
    for (let value in valueIndexes) {
        valueCounts.push([value, valueIndexes[value].length]);
    }
    valueCounts = valueCounts.sort((a, b) => a[1] - b[1]);

    // TODO: single val for whole column. Should be ignored?
    if (valueCounts.length === 1) {
        args.isConstant = true;
        args.constantVal = valueCounts[0][0];
        return [];
    }

    // no repeated value means possible ID column
    if (valueCounts.length === source.length) {
        args.potentialIds = true;
        args.ambiguousSets = [];
        return [];
    }

    // create info about non-uniqueness to be used in mapping step
    let ambiguousSets: number[][] = [];
    for (let value in valueIndexes) {
        if (valueIndexes[value].length > 1)
            ambiguousSets.push(valueIndexes[value]);
    }
    args.ambiguousSets = ambiguousSets;

    // Check if found set is enum-like
    // - domain is small enough
    // - has at least 2 keys
    let reductionFactor = source.length / valueCounts.length;
    if (reductionFactor > 0.5 && valueCounts[0][1] >= 2 && valueCounts.length > 2) {
        return [new Enum({domain: valueCounts.map(a => a[0])}, {ambiguousSets: ambiguousSets})];
    }

    // otherwise check for NOVAL
    // TODO: False positive {"1000": 213, "2000": 62, ...}, need better NOVAL criteria
    if (valueCounts[valueCounts.length - 1][1] / valueCounts[valueCounts.length - 2][1] > 2 && valueCounts[valueCounts.length - 2][1] > 0) {
        args.hasNoval = true;
        args.novalVal = valueCounts[valueCounts.length - 1][0];
        return [];
    }

    return [];
}

/**
 * Enum useType. Holds all possible values of a domain.
 * Is pretty much useless otherwise, mostly a compatibility wrapper similarly to StringUseType.
 */
export class Enum extends UseType<string> {

    domain: string[] = [];
    compatibleTypes = ['string'];
    type = 'string';
    domainType: 'none' | 'ordinal' | 'nominal' = 'nominal';
    priority = 1;

    /**
     * @param domain Set of possible enum values.
     */
    constructor({domain = []}: { domain: string[] }, args) {
        super(args);
        if (domain)
            this.domain = domain;
    }

    format(string: string): string {
        return this.domain.includes(string) ? string : undefined;
    }

    deformat(value: string): string {
        return this.domain.includes(value) ? value : undefined;
    }

    isSubsetOf(other: UseType<any>): boolean {
        if (!(other instanceof Enum))
            return false;
        return this.domain.every(value => other.domain.includes(value));
    }

    isSupersetOf(other: UseType<any>): boolean {
        if (!(other instanceof Enum))
            return false;
        return other.isSubsetOf(this);
    }

    isEqualTo(other) {
        if (!(other instanceof Enum))
            return false;
        return this.isSubsetOf(other) && this.isSupersetOf(other);
    }

    isSimilarTo(other) {
        if (!(other instanceof Enum))
            return false;
        return this.isSubsetOf(other) || this.isSupersetOf(other);
    }

    size() {
        return this.domain.length;
    }

    toString() {
        return `E{[${this.domain}]}`;
    }

    toFormatString() {
        return 'Categorical';
    }

    toDebugString() {
        return `UseType.Enum([${this.domain}])`;
    }

}