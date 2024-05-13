import Restructurable from './Restructurable'
import { ArityBounds, isValidArity } from "./ArityBounds";

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date'
type PropertySubType = 'email' | 'url' | 'fileType' | 'mediaType' | 'conformsTo' | 'frequency' | 'dataTheme' | 'spatial' | 'geographical' | 'eurovoc'

export interface MetaChild {
  arity: ArityBounds
  property: MetaProperty
}

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

    StructuredMetaProperty.validateStructure(children);
    this.children = Object.fromEntries((children ?? []).map(child => [child.property.name, child]));
  }

  private static validateStructure(children?: Array<MetaChild>) {
    if (!children) {
      throw new Error(`StructuredMetaProperty '${this.name}' has no children.`);
    }

    const keys = new Set();
    for (const {arity, property} of children) {
      if (!isValidArity(arity)) {
        throw new Error(`StructuredMetaProperty '${this.name}' has a child '${property.name}' with invalid arity '${arity}'`);
      }

      if (keys.has(property.name)) {
        throw new Error(`StructuredMetaProperty '${this.name}' has multiple children of name '${property.name}'.`);
      }
      keys.add(property.name);
    }
  }

  isValid(..._: any[]): boolean {
    throw new Error("Potentially undefined behavior");
  }

  [Restructurable.from](obj: StructuredMetaProperty): StructuredMetaProperty {
    return new StructuredMetaProperty(obj.name, obj.description, Object.values(obj.children), obj.subType);
  }
}
