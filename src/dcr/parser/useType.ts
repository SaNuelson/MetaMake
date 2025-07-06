export interface UseTypeArgs {
    hasNull?: boolean,
    nullVal?: string,
    isConstant?: boolean,
    constantVal?: string,
    potentialIds?: boolean,
    ambiguousSets?: number[][],
    limitExceeded?: boolean
}

export type UseTypeType = 'undefined' | 'string' | 'number' | 'timestamp';
export type DomainType = 'none' | 'ordinal' | 'nominal';

/**
 * Base class for all useTypes, basically an interface.
 * Always bound to a specific primary datatype (e.g. Enum <-> String[]),
 * for which it is essentially a glorified wrapper.
 * Some can also have secondary compatible types.
 * @interface
 * @abstract
 * @template T
 */
export abstract class UseType<T> {

    hasNull: boolean = false;
    nullVal: string | undefined;

    isConstant: boolean = false;
    constantVal: string | undefined;

    potentialIds: boolean;

    ambiguousSets: number[][] | undefined;

    ignored: boolean = false;

    limitExceeded: boolean = false;
    /**
     * Possible underlying types for this UseType subclass.
     */
    compatibleTypes: UseTypeType[] = [];
    /**
     * Underlying type for this UseType instance.
     */
    type: UseTypeType = 'undefined';
    /**
     * Type of the universe. Can be ordinal or nominal.
     */
    domainType: DomainType = 'none';
    /**
     * Priority with respect to other UseType instances.
     * Could be intertwined with confidence. For now basically depends on its subclass.
     */
    priority: number = -1;

    constructor(args: UseTypeArgs) {
        if (this.constructor === UseType) {
            throw new Error('Cannot instantiate base UseType class.');
        }
        if (args.hasNull) {
            this.hasNull = true;
            this.nullVal = args.nullVal;
        }
        if (args.isConstant) {
            this.isConstant = args.isConstant;
            this.constantVal = args.constantVal;
        }
        if (args.potentialIds) {
            this.potentialIds = true;
        }
        if (args.ambiguousSets) {
            this.ambiguousSets = args.ambiguousSets;
        }
        if (args.limitExceeded) {
            this.ignored = true;
        }
    }

    /** Transform the value of an underlying type to formatted string
     * @returns {string}
     */
    abstract format(x: T): string;

    /**
     * Transform formatted string (conforming to this one's format) to underlying type
     * @param {string} x to try to parse
     * @returns {T|null} instance of an underlying type if successful, null otherwise.
     */
    abstract deformat(x: string): T | null;

    abstract toString(): string;

    abstract toFormatString(): string;

    abstract toDebugString(): string;

    /**
     * Check if other useType is a superset (if any string is parsable by this, it is parsable by other).
     */
    abstract isSubsetOf(other: UseType<unknown>): boolean;

    /**
     * Check if this useType is a superset (if any string is parsable by other, it is parsable by this).
     */
    abstract isSupersetOf(other: UseType<unknown>): boolean;

    /**
     * Check if this useType is equal to other (both parse the same set of strings).
     * Usually implemented as isSupersetOf && isSubsetOf
     */
    abstract isEqualTo(other: UseType<unknown>): boolean;

    /**
     * Check if this useType is similar to other (parsed strings convey the same meaning).
     * Usually implemented as isSupersetOf || isSubsetOf
     */
    abstract isSimilarTo(other: UseType<unknown>): boolean;
}
