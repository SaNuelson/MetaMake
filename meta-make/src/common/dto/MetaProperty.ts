import Restructurable from './Restructurable'

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date'
type PropertySubType = 'email' | 'url'

export interface Arity {
  min?: number
  max?: number
}

export interface MetaChild {
  arity: Arity
  property: MetaProperty
}

export const Mandatory: Arity = {min: 1, max: 1};
export const Optional: Arity = {min: 0, max: 1};
export const Any: Arity = {};
export const Some: Arity = {min: 1};

export default class MetaProperty extends Restructurable {
  readonly name: string
  readonly description: string

  readonly type: PropertyType
  readonly subType?: PropertySubType

  constructor(name: string, description: string, type: PropertyType, subType?: PropertySubType) {
    super()
    this.name = name
    this.description = description

    this.type = type
    this.subType = subType
  }

  isValid(...values: any[]): boolean {
    return values.every(value => typeof value === this.type);
  }
}

export class StructuredMetaProperty extends MetaProperty {
  readonly children: {[key: string]: MetaChild};

  constructor(name: string, description: string, children?: Array<MetaChild>, subType?: PropertySubType) {
    super(name, description, 'object', subType);
    this.children = Object.fromEntries((children ?? []).map(child => [child.property.name, child]));
  }

  isValid(..._: any[]): boolean {
    throw new Error("Potentially undefined behavior");
  }
}
