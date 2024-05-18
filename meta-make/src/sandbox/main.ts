import Restructurable from './Restructurable'
import { ArityBounds, isValidArity } from "./ArityBounds";

import { CodebookEntry } from "./CodebookEntry.js";
import { MandatoryArity } from "../common/dto/ArityBounds.js";

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date';
type PropertyTypes = {
  'string': string,
  'number': number,
  'object': object,
  'array': any[],
  'boolean': boolean,
  'date': Date
};

export interface MetaChild {
  arity: ArityBounds
  property: MetaProperty
}

type Primitive = string | number | boolean | Date;
type List<T extends Primitive> = T[];

class MetaProperty<T extends keyof PropertyTypes> {
  readonly name: string
  readonly description: string

  readonly type: T

  constructor(name: string, description: string, type: T) {
    this.name = name
    this.description = description
    this.type = type
  }
}

class StructuredMetaProperty<T extends keyof PropertyTypes> extends MetaProperty<T> {
  readonly children: {[key: string]: MetaChild};

  constructor(name: string, description: string, children: Array<MetaChild>) {
    super(name, description, 'object');
  }
}

class MetaDatum<T extends keyof PropertyTypes> {
  value: PropertyTypes[T]

  constructor(property: MetaProperty<T>, value: PropertyTypes[T]) {
    this.value = value;
  }
}

const TestFormat = new StructuredMetaProperty(
  'Test',
  'Test desc.',
  [
    {arity: MandatoryArity, property: new MetaProperty("Title", "Title desc", "string")}
  ]
)

const TestDatum = new MetaDatum(new MetaProperty("AA","AA","string"), "abrakadabra")
