import { DomainType, UseType, UseTypeType } from '../useType.js';

export class StringUseType extends UseType<string> {
    isUnique: boolean;
    constantValue: string;

    kind: string;
    compatibleTypes: UseTypeType[] = ['string'];
    /**
     * Underlying type for this UseType instance.
     * @type {string}
     */
    type: UseTypeType = 'string';
    domainType: DomainType = 'nominal';
    priority = 0;

    constructor(args) {
        super(args);
        if (args.potentialIds) {
            this.isUnique = true;
        }

        if (args.constant) {
            this.isConstant = true;
            this.constantValue = args.constant;
        }

        if (args.type) {
            this.kind = args.type;
        }
    }

    format(x: string): string {
        return x.toString();
    }

    deformat(x: string): string {
        return x.toString();
    }

    isSubsetOf(other: UseType<unknown>): boolean {
        return (other.type === this.type) || (this.type && !other.type);
    }

    isSupersetOf(other: UseType<unknown>): boolean {
        return other.isSubsetOf(this);
    }

    isEqualTo(other: UseType<unknown>): boolean {
        return this.isSubsetOf(other) && this.isSupersetOf(other);
    }

    isSimilarTo(other: UseType<unknown>): boolean {
        return this.isSubsetOf(other) || this.isSupersetOf(other);
    }

    toString(): string {
        if (this.isUnique) {
            return 'SID{' + (this.type ?? '') + '}';
        }

        if (this.isConstant) {
            return 'SC(' + this.constantValue + '){' + (this.type ?? '') + '}';
        }

        return 'S{' + (this.kind ?? '') + '}';
    }

    toDebugString(): string {
        throw new Error('Method not implemented.');
    }

    toFormatString(): string {
        let ret = 'Custom/Unknown';
        if (this.kind) ret += ' of kind ' + this.kind;
        return ret;
    }
}
