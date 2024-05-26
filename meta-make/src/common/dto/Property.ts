import Restructurable from './Restructurable'

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date';

export interface PropertyDefinition {
  mandatory: boolean,
  property: Property,
  uri?: string,
}

export interface DomainEntry {
  value: any
}

export interface PropertyParams {
  name: string,
  description?: string,
  domain?: DomainEntry[],
  isDomainStrict?: boolean,
  type: PropertyType,

  uri?: string
}

export default class Property extends Restructurable {
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
  }: PropertyParams) {
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

  [Restructurable.from](obj: Property): Property {
    const prop = Object.create(Property.prototype)
    Object.assign(prop, obj);
    return prop;
  }
}

export interface ListPropertyParams extends Omit<PropertyParams, 'type'> {
  minSize: number,
  maxSize: number,
  property: Property
}

export class ListProperty extends Property {
  minSize: number;
  maxSize: number;
  itemProperty: Property;

  constructor({
    property,
    minSize,
    maxSize,
    ...rest
  }: ListPropertyParams) {
    super({type: 'array', ...rest});
    this.itemProperty = property;
    this.minSize = minSize;
    this.maxSize = maxSize;
  }

  [Restructurable.from](obj: StructuredProperty): StructuredProperty {
    const prop = Object.create(ListProperty.prototype);
    Object.assign(prop, obj);
    return prop;
  }
}

export interface StructuredPropertyParams extends Omit<PropertyParams, 'type'> {
  propertyDefinitions: Array<PropertyDefinition>
}

export class StructuredProperty extends Property {
  readonly propertyDefinitions: {[key: string]: PropertyDefinition};

  constructor({
    propertyDefinitions,
    ...rest
  }: StructuredPropertyParams) {
    super({type: 'object', ...rest});

    this.propertyDefinitions = Object.fromEntries(propertyDefinitions.map(propDef => [propDef.property.name, propDef]));
  }

  isValid(..._: any[]): boolean {
    throw new Error("Potentially undefined behavior");
  }

  [Restructurable.from](obj: StructuredProperty): StructuredProperty {
    const prop = Object.create(StructuredProperty.prototype);
    Object.assign(prop, obj);
    return prop;
  }
}
