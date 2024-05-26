import MetaFormat from "./MetaFormat";
import Property, { ListProperty, StructuredProperty } from './Property.js'
import Restructurable from "./Restructurable";
import { ArityBounds, MandatoryArity } from "./ArityBounds";

export type Primitive = number | string | boolean | Date;

function isMetaDatum(obj: any): obj is MetaDatum {
  if (!obj)
   return false;

  return typeof obj.name === 'string';
}

export interface MetaDatum {
  name: string;
}

export function isPrimitiveMetaDatum(obj: any): obj is PrimitiveMetaDatum<any> {
  if (!obj)
    return false;

  return typeof obj.name === 'string' && typeof obj.value !== 'undefined';
}

export interface PrimitiveMetaDatum<T extends Primitive> extends MetaDatum {
  value?: T | null;
}

export function isListMetaDatum(obj: any): obj is ListMetaDatum<any> {
  if (!obj)
    return false;

  return typeof obj.name === 'string' && Array.isArray(obj.values);
}

export interface ListMetaDatum<T extends MetaDatum> extends MetaDatum {
  values: T[];
}

export function isStructuredMetaDatum(obj: any): obj is StructuredMetaDatum {
  if (!obj)
    return false;

  return typeof obj.name === 'string' && typeof obj.data === 'object';
}

export interface StructuredMetaDatum extends MetaDatum {
  data: {[name: string]: MetaDatum};
}

/**
 * Get MetaDatum at specified index. Run appropriate checks. Extend metadata array if arity allows.
 * @param property Associated property of MetaDatum array elements.
 * @param datum Array of MetaDatum to select from (and/or expand if appropriate).
 * @param index Index to select. Must be within arity and at most length of current data.
 * @throws Error If index out of arity or out of existing length
 */
function getDatumAtIndex(property: ListProperty, datum: ListMetaDatum<any>, index: number): [Property, MetaDatum] {
  if (index > datum.values.length)
    throw new Error(`Datum ${datum.name} has ${datum.values.length} items but index ${index} requested.`);

  // Expand if possible
  if (index === datum.values.length) {
    if (index >= property.maxSize)
      throw new Error(`Datum ${datum.name} has ${datum.values.length} items but index ${index} requested (and reached max items).`);

    datum.values.push(createMetaDatum(property.itemProperty));
  }

  return [property.itemProperty, datum.values[index]];
}

/**
 * Get MetaDatum array of specified property name. Run appropriate checks.
 * @param property MetaProperty associated with the data MetaDatum
 * @param datum MetaDatum to select property from
 * @param name Name of the property to select MetaDatum array of.
 * @throws Error If name is not member of property or datum.
 */
function getDatumAtProperty(property: StructuredProperty, datum: StructuredMetaDatum, name: string): [Property, MetaDatum] {
  if (!(name in property.propertyDefinitions))
    throw new Error(`Property ${property.name} has no item ${name} (only ${Object.keys(property.propertyDefinitions)})`);

  if (!(name in datum.data))
    throw new Error(`Datum ${datum.name} has no item ${name} (only ${Object.keys(datum.data)})`);

  return [property.propertyDefinitions[name].property, datum.data[name]];
}

/**
 * Get property and data at the provided step of path (either index or property)
 * @param property MetaProperty of data.
 * @param datum MetaDatum (or array of MetaDatum) in which to make next step.
 * @param edge Next step in form of property name or index.
 * @throws Error If edge is not a valid step in current property and datum.
 */
function getDatumAtEdge(property: Property, datum: MetaDatum, edge: string): [Property, MetaDatum] {
  if (property instanceof ListProperty) {
    if (!isListMetaDatum(datum))
      throw new Error(`Found list property ${property.name}, but datum wasn't list.`)

    if (isNaN(+edge))
      throw new Error(`Found list property ${property.name}, but next edge ${edge} wasn't index.`);

    return getDatumAtIndex(property, datum, +edge);
  }

  if (property instanceof StructuredProperty) {

    if (!isStructuredMetaDatum(datum))
      throw new Error(`Found structured property ${property.name}, but datum wasn't structured.`)

    return getDatumAtProperty(property, datum, edge);
  }

  throw new Error(`Found primitive property ${property.name} with edge ${edge}`);
}

function getDatum(property: Property, datum: MetaDatum, path: string[]): [Property, MetaDatum] {
  for (const edge of path) {
    [property, datum] = getDatumAtEdge(property, datum, edge);
  }
  return [property, datum];
}

function getValue(property: Property, datum: MetaDatum, path: string): Primitive {
  const [_, finalDatum] = getDatum(property, datum, parsePath(path));
  if (!isPrimitiveMetaDatum(finalDatum))
    throw new Error(`Expected to find primitive datum at path ${path}, but found ${finalDatum.name}`);

  return finalDatum.value;
}

function setValue(property: Property, datum: MetaDatum, path: string, value: Primitive) {
  const [_, finalDatum] = getDatum(property, datum, parsePath(path));
  if (!isPrimitiveMetaDatum(finalDatum))
    throw new Error(`Expected to find primitive datum at path ${path}, but found ${finalDatum.name}`);

  finalDatum.value = value;
}

function addValue(property: Property, datum: MetaDatum, path: string) {
  const parsedPath = parsePath(path);
  const lastEdge = parsedPath.pop();
  const [_, finalDatum] = getDatum(property, datum, parsePath(path));

  if (!lastEdge)
    throw new Error(`Cannot delete root.`);

  if (!isPrimitiveMetaDatum(finalDatum))
    throw new Error(`Expected to find primitive datum at path ${path}, but found ${finalDatum.name}`);

  if (isNaN(+lastEdge))
    throw new Error(`Expected last edge to be index, found ${lastEdge} instead`);

  if (!(property instanceof ListProperty))
    throw new Error(`Expected list property at end of ${path}, got ${property.name} instead.`);

  if (!isListMetaDatum(datum))
    throw new Error(`Expected list datum at end of ${path}, got ${datum.name} instead.`);

  if (property.maxSize <= datum.values.length)
    throw new Error(`Cannot add to datum ${datum.name} of length ${datum.values.length} with limit ${property.maxSize}.`);

  datum.values.splice(+lastEdge, 1);
}

function delValue(property: Property, datum: MetaDatum, path: string) {
  const parsedPath = parsePath(path);
  const lastEdge = parsedPath.pop();
  const [_, finalDatum] = getDatum(property, datum, parsePath(path));

  if (!lastEdge)
    throw new Error(`Cannot delete root.`);

  if (!isPrimitiveMetaDatum(finalDatum))
    throw new Error(`Expected to find primitive datum at path ${path}, but found ${finalDatum.name}`);

  if (isNaN(+lastEdge))
    throw new Error(`Expected last edge to be index, found ${lastEdge} instead`);

  if (!(property instanceof ListProperty))
    throw new Error(`Expected list property at end of ${path}, got ${property.name} instead.`);

  if (!isListMetaDatum(datum))
    throw new Error(`Expected list datum at end of ${path}, got ${datum.name} instead.`);

  if (datum.values.length <= 0)
    throw new Error(`Cannot remove from empty list of ${property.name}.`);

  if (property.minSize >= datum.values.length)
    throw new Error(`Cannot remove from list of ${property.name}, already at minimum arity.`);

  datum.values.splice(+lastEdge, 1);
}

export default class MetaModel extends Restructurable {
  metaFormat: MetaFormat;
  root: MetaDatum;

  constructor(metaFormat: MetaFormat);
  constructor(metaFormat: MetaFormat, metaData: MetaDatum);
  constructor(metaFormat: MetaFormat, metaData?: MetaDatum) {
    super();
    this.metaFormat = metaFormat;
    this.root = metaData
      ? copyMetaDatum(metaFormat.metaProps, metaData)
      : createMetaDatum(metaFormat.metaProps);
  }

  getData(path: string): [Property, MetaDatum] {
    return getDatum(this.metaFormat.metaProps, this.root, parsePath(path));
  }

  getValue(path: string): Primitive {
    return getValue(this.metaFormat.metaProps, this.root, path);
  }

  setValue(path: string, value: Primitive) {
    setValue(this.metaFormat.metaProps, this.root, path, value);
  }

  addValue(path: string) {
    addValue(this.metaFormat.metaProps, this.root, path);
  }

  deleteValue(path: string) {
    delValue(this.metaFormat.metaProps, this.root, path);
  }

  *preOrderTraversal(path: string = "",
                     property: Property = this.metaFormat.metaProps,
                     datum: MetaDatum = this.root): Generator<[string, Property, MetaDatum]> {
    if (!datum)
      return;

    yield [path, property, datum];

    if (isStructuredMetaDatum(datum)) {
      if (!(property instanceof StructuredProperty)) {
        throw new Error(`Found structured datum ${datum.name} but property was not`);
      }

      for (const key in datum.data) {
        const childPath = `${path}.${key}`;
        const { property: childProperty} = property.propertyDefinitions[key];
        const childDatum = datum.data[key];

        if (isListMetaDatum(childDatum)) {
          for (const childMetaDatum of childDatum.values) {
            yield* this.preOrderTraversal(childPath, childProperty, childMetaDatum);
          }
        }
        else {
          yield [childPath, childProperty, childDatum];
        }
      }
    }
  }

  [Restructurable.from](obj: MetaModel) {
    return new MetaModel(obj.metaFormat, obj.root);
  }
}

// const pathNodePattern = /(\w+)|\[(\d+)]/g;
function parsePath(path: string) {
  // TODO: Validation and possibly fix regex

  return path.split(/[.\[\]]/g).filter(x=>x);
}

function createMetaDatum(property: Property): MetaDatum {
  if (property instanceof StructuredProperty) {
    // Instantiate StructuredMetaDatum child metadata
    const structuredMetaDatum: StructuredMetaDatum = {
      name: property.name,
      data: {}
    }

    for (const propName in property.propertyDefinitions) {
      const propDef = property.propertyDefinitions[propName];
      structuredMetaDatum.data[propName] = createMetaDatum(propDef.property);
    }

    return structuredMetaDatum;
  }
  else if (property instanceof ListProperty) {

    const listMetaDatum: ListMetaDatum<any> = {
      name: property.name,
      values: []
    }

    for (let i = 0; i < property.minSize; i++) {
      listMetaDatum.values.push(createMetaDatum(property.itemProperty))
    }

    return listMetaDatum;
  }
  else {
    const primitiveMetaDatum: PrimitiveMetaDatum<any> = {
      name: property.name,
      value: null
    };

    return primitiveMetaDatum;
  }
}

function copyMetaDatum(property: Property, datum: MetaDatum): MetaDatum {
  if (property instanceof StructuredProperty) {
    if (!isStructuredMetaDatum(datum)) {
      throw new Error(`Property ${property.name} is structured, value ${datum.name} is not.`);
    }

    const structuredMetaDatum: StructuredMetaDatum = {
      name: property.name,
      data: {}
    }

    for (const propName in property.propertyDefinitions) {
      const propDef = property.propertyDefinitions[propName];
      const propVal = datum.data[propName];
      structuredMetaDatum.data[propName] = copyMetaDatum(propDef.property, propVal);
    }

    return structuredMetaDatum
  }
  else if (property instanceof ListProperty) {
    if (!isListMetaDatum(datum)) {
      throw new Error(`Property ${property.name} is list, value ${datum.name} is not.`);
    }

    const listMetaDatum: ListMetaDatum<any> = {
      name: property.name,
      values: []
    }

    for (let i = 0; i < datum.values.length; i++) {
      listMetaDatum.values.push(copyMetaDatum(property.itemProperty, datum.values[i]));
    }

    return listMetaDatum;
  }
  else {
    if (!isPrimitiveMetaDatum(datum)) {
      throw new Error(`Property ${property.name} is not structured, value ${datum.name} is.`);
    }

    const primitiveMetaDatum: PrimitiveMetaDatum<any> = {
      name: property.name,
      value: datum.value
    }

    return primitiveMetaDatum;
  }
}

