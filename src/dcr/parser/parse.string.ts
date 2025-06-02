import { DomainType, UseType, UseTypeType } from './useType';

export function recognizeStrings(source, args): StringUseType[] {
    // TODO: internal logic and string recognition
	const stringArgs = Object.assign({}, args);
	if (source.slice(0, 10).every(string => validateUrl(string)))
		stringArgs.type = 'url';
    return [new StringUseType(stringArgs)];
}

class StringUseType extends UseType<string> {
	isUnique: boolean;
	constantValue: string;

	kind: string;

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
	
	format(x: string): string { return x.toString(); }
	deformat(x: string): string { return x.toString(); }

	isSubsetOf(other: UseType<any>): boolean {
		return (other.type === this.type) || (this.type && !other.type);
	}

	isSupersetOf(other: UseType<any>): boolean {
		return other.isSubsetOf(this);
	}

	isEqualTo(other: UseType<any>): boolean {
		return this.isSubsetOf(other) && this.isSupersetOf(other);
	}

	isSimilarTo(other: UseType<any>): boolean {
		return this.isSubsetOf(other) || this.isSupersetOf(other);
	}

	toString(): string {
		if (this.isUnique) {
			return "SID{" + (this.type ?? "") + "}";
		}

		if (this.isConstant) {
			return "SC(" + this.constantValue + "){" + (this.type ?? "") + "}";
		}

		return "S{" + (this.kind ?? "") + "}";
	}

	toFormatString(): string {
		let ret = "Custom/Unknown";
		if (this.kind) ret += " of kind " + this.kind;
		return ret;
	}
	
    compatibleTypes: UseTypeType[] = ["string"];

    /**
     * Underlying type for this UseType instance.
     * @type {string}
     */
    type: UseTypeType = "string";

	domainType: DomainType = 'nominal';

	priority = 0;
}

function validateUrl(value) {
	return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}