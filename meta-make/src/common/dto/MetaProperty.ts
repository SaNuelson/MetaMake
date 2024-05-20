import Restructurable from './Restructurable'
import { ArityBounds } from "./ArityBounds";

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date';

export interface MetaChild {
  arity: ArityBounds
  property: MetaProperty
}

interface DomainEntry {
  value: any
}

export interface MetaPropertyParams {
  name: string,
  description?: string,
  domain?: DomainEntry[],
  isDomainStrict?: boolean,
  type: PropertyType,

  uri?: string
}

export default class MetaProperty extends Restructurable {
  readonly name: string;
  readonly description?: string;

  readonly type: PropertyType;

  readonly domain?: DomainEntry[];
  isDomainStrict?: boolean;

  readonly data: any;

  constructor({
    name,
    description,
    type,
    domain,
    isDomainStrict,
    ...rest
  }: MetaPropertyParams) {
    super()
    this.name = name
    this.description = description
    this.type = type

    this.domain = domain;
    this.isDomainStrict = isDomainStrict;

    this.data = rest;
  }

  isValid(...value: any | any[]): boolean {
    if (Array.isArray(value))
      return value.every(v => this.isValid(v));

    if (this.domain) {
      return this.domain.some(entry => entry.value === value);
    }

    return typeof value === this.type;
  }

  [Restructurable.from](obj: MetaProperty): MetaProperty {
    const prop = Object.create(MetaProperty.prototype)
    Object.assign(prop, obj);
    return prop;
  }
}

export interface StructuredMetaPropertyParams extends Omit<MetaPropertyParams, 'type'> {
  type?: PropertyType,
  children: Array<MetaChild>
}

export class StructuredMetaProperty extends MetaProperty {
  readonly children: {[key: string]: MetaChild};

  constructor({
    children,
    ...rest
  }: StructuredMetaPropertyParams) {
    super({type: 'object', ...rest});

    this.children = Object.fromEntries(children.map(child => [child.property.name, child]));
  }

  isValid(..._: any[]): boolean {
    throw new Error("Potentially undefined behavior");
  }

  [Restructurable.from](obj: StructuredMetaProperty): StructuredMetaProperty {
    const prop = Object.create(StructuredMetaProperty.prototype);
    Object.assign(prop, obj);
    return prop;
  }
}
