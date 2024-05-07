import Restructurable from './Restructurable'

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date'
type PropertySubType = 'email' | 'url'

type Arity = {
  min?: number,
  max?: number
}

export const Mandatory: Arity = {min: 1, max: 1};
export const Optional: Arity = {min: 0, max: 1};
export const Any: Arity = {};
export const Some: Arity = {min: 1};

export default class MetaProperty extends Restructurable {
  readonly name: string
  readonly description: string

  readonly arity: Arity

  readonly type: PropertyType
  readonly subType?: PropertySubType

  constructor(name: string, description: string, arity: Arity, type: PropertyType, subType?: PropertySubType) {
    super()
    this.name = name
    this.description = description

    this.arity = arity;

    this.type = type
    this.subType = subType
  }

  isValidArity(...values: any[]): boolean {
    return values.length >= (this.arity?.min ?? 0)
      && (!this.arity.max || values.length <= this.arity.max!);
  }

  isValid(...values: any[]): boolean {
    if (!this.isValidArity(...values))
      return false;

    return values.every(value => typeof value === this.type);
  }
}

export class StructuredMetaProperty extends MetaProperty {
  readonly children: MetaProperty[]

  constructor(name: string, description: string, arity: Arity, children: MetaProperty[], subType?: PropertySubType) {
    super(name, description, arity, 'object', subType);
    this.children = children;
  }

  isValid(..._: any[]): boolean {
    throw new Error("Potentially undefined behavior");
  }
}
