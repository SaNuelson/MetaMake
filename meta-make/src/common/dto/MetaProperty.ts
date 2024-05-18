import Restructurable from './Restructurable'
import { ArityBounds, isValidArity } from "./ArityBounds";

import { CodebookEntry } from "./CodebookEntry.js";

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date';
type PropertySubType = 'email' | 'url' | 'fileType' | 'mediaType' | 'conformsTo' | 'frequency' | 'dataTheme' | 'spatial' | 'geographical' | 'eurovoc' |'enum';

export interface MetaChild {
  arity: ArityBounds
  property: MetaProperty
}

export interface Options {
  subType?: PropertySubType
  uri?: string
}

export default class MetaProperty extends Restructurable {
  readonly name: string
  readonly description: string

  readonly type: PropertyType
  readonly subType?: PropertySubType
  readonly uri?: string

  constructor(name: string, description: string, type: PropertyType, { subType, uri }: Options = {}) {
    super()
    this.name = name
    this.description = description

    this.type = type
    this.subType = subType
    this.uri = uri;
  }

  isValid(...values: any[]): boolean {
    return values.every((value) => typeof value === this.type)
  }

  [Restructurable.from](obj: MetaProperty): MetaProperty {
    return new MetaProperty(obj.name, obj.description, obj.type, { subType: obj.subType, uri: obj.uri });
  }
}

export interface EnumOptions {
  canBeCustom?: boolean
  uri?: string
}

export class EnumMetaProperty extends MetaProperty {
  readonly domain: CodebookEntry[]
  readonly strict: boolean

  constructor(name: string, description: string, domain: CodebookEntry[], type: PropertyType, { canBeCustom, uri }: EnumOptions = {}) {
    super(name, description, type, {subType: 'enum', uri})
    this.domain = domain;
    this.strict = !canBeCustom;
  }

  isValid(...values: any[]): boolean {
    return super.isValid(...values) && values.every(value => this.domain.find(entry => entry.label === value));
  }

  [Restructurable.from](obj: EnumMetaProperty): EnumMetaProperty {
    return new EnumMetaProperty(obj.name, obj.description, obj.domain,  obj.type,{ canBeCustom: !obj.strict, uri: obj.uri });
  }
}

export interface StructuredOptions {
  subType?: PropertySubType
  uri?: string
}

export class StructuredMetaProperty extends MetaProperty {
  readonly children: {[key: string]: MetaChild};

  constructor(name: string, description: string, children: Array<MetaChild>, { subType, uri }: StructuredOptions = {}) {
    super(name, description, 'object', {subType, uri});

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
    return new StructuredMetaProperty(obj.name, obj.description, Object.values(obj.children), {subType: obj.subType, uri: obj.uri});
  }
}
