import { UseType, UseTypeType } from '../useType.js';

/**
 * Enum useType. Holds all possible values of a domain.
 * Is pretty much useless otherwise, mostly a compatibility wrapper similarly to StringUseType.
 */
export class EnumUseType extends UseType<string> {

    domain: string[] = [];
    compatibleTypes: UseTypeType[] = ['string'];
    type: UseTypeType = 'string';
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

    isSubsetOf(other: UseType<unknown>): boolean {
        if (!(other instanceof EnumUseType))
            return false;
        return this.domain.every(value => other.domain.includes(value));
    }

    isSupersetOf(other: UseType<unknown>): boolean {
        if (!(other instanceof EnumUseType))
            return false;
        return other.isSubsetOf(this);
    }

    isEqualTo(other) {
        if (!(other instanceof EnumUseType))
            return false;
        return this.isSubsetOf(other) && this.isSupersetOf(other);
    }

    isSimilarTo(other) {
        if (!(other instanceof EnumUseType))
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
