import MetaFormat from "./MetaFormat";
import Property, { StructuredProperty } from "./Property.js";
import Restructurable from "./Restructurable";
import { ArityBounds, MandatoryArity } from "./ArityBounds";

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

  /**
   * Get MetaDatum at specified index. Run appropriate checks. Extend metadata array if arity allows.
   * @param arity Arity of meta property to limit index.
   * @param property Associated property of MetaDatum array elements.
   * @param data Array of MetaDatum to select from (and/or expand if appropriate).
   * @param index Index to select. Must be within arity and at most length of current data.
   * @throws Error if index out of arity or out of existing length
   */
  private stepIndex(arity: ArityBounds, property: Property, data: MetaDatum[], index: number): MetaDatum {
    // const minArity = (arity.min ?? 0);
    const maxArity = (arity.max ?? Number.MAX_SAFE_INTEGER);

    if (index < 0 || index >= maxArity) {
      throw new Error(`INDEX OUT OF ARITY: Expected index in arity ${arity}, got ${index} instead.`);
    }

    if (index > data.length) {
      throw new Error(`INDEX OUT OF RANGE: Expected index in range ${data.length} (inclusive in case of expansion), got ${data.length} instead.`);
    }

    if (index === data.length) {
      data.push(createMetaDatum(property));
    }

    return data[index];
  }

  /**
   * Get MetaDatum array of specified property name. Run appropriate checks.
   * @param prop MetaProperty associated with the data MetaDatum
   * @param data MetaDatum to select property from
   * @param propName Name of the property to select MetaDatum array of.
   * @throws Error If path shouldn't continue (MetaProperty isn't structured).
   * @throws Error If data is malformed (MetaDatum isn't structured despite MetaProperty being).
   * @throws Error If propName isn't known.
   */
  private stepProperty(prop: Property, data: MetaDatum, propName: string): [ArityBounds, Property, MetaDatum[]] {
    if (!(prop instanceof StructuredProperty)) {
      throw new Error(`PROP OF SIMPLE PROP: Expected end of path, got property ${propName} instead.`);
    }

    if (!(data instanceof StructuredMetaDatum)) {
      throw new Error(`BAD DATA: MetaDatum ${data.name} is unstructured, but underlying property ${prop.name} is structured.`);
    }

    const childProp = prop.propertyDefinitions[propName]?.property;
    if (!childProp) {
      throw new Error(`UNK PROP CHILD: Expected property of ${prop.name} (one of [${Object.keys(prop.propertyDefinitions)}]), got ${propName} instead.`);
    }

    return [
      prop.propertyDefinitions[propName].arity,
      childProp,
      data.data[propName]
    ];
  }

  /**
   * Get arity, property and data at the provided step of path (either index or property).
   * @param arity Arity of current prop / data.
   * @param prop MetaProperty of data.
   * @param data MetaDatum (or array of MetaDatum) in which to make next step.
   * @param edge Next step in form of property name or index.
   * @throws Error If step is an index but property is structured - property name is expected.
   * @throws Error If step is an index but datum is not structured - end of path is expected.
   * @throws Error If step is not an index but data is an array and there is no only datum - index is expected.
   */
  private step(arity: ArityBounds, prop: Property, data: MetaDatum | MetaDatum[], edge: string): [ArityBounds, Property, MetaDatum | MetaDatum[]] {
    const isIndex = /^\d+$/.test(edge);
    if (isIndex) {
      if (!Array.isArray(data)) {
        if (data instanceof StructuredMetaDatum)
          throw new Error(`INDEX OF STRUCT DATA: Expected property of ${data.name} (one of [${Object.keys(data.data)}]), got index ${edge} instead.`);
        else
          throw new Error(`INDEX OF SCALAR DATA: Expected end of path, got index ${edge} instead.`);
      }

      data = this.stepIndex(arity, prop, data, +edge);
    }
    // !isIndex
    else {
      if (Array.isArray(data)) {
        if (data.length > 1) {
          throw new Error(`PROP OF ARRAY DATA: Expected index for array of length ${data.length}, got property ${prop.name} instead.`);
        }
        if (arity.max === undefined || arity.max > 1) {
          throw new Error(`NO IMPLICIT FIRST: Expected index for array of length ${data.length}, got property ${prop.name} instead.`);
        }

        // Implicit first
        data = data[0];
      }

      return this.stepProperty(prop, data, edge);
    }

    return [arity, prop, data];
  }

  /**
   * Get model data on specified path.
   * @param path Path consisting of property names (delimited by dots) and indexes (wrapped in square brackets).
   * @example
   * const result = model.walk(".Authors[1].Degrees[1].AwardedBy");
   * // result === [Mandatory: Arity, AwardedByProperty: MetaProperty, AwardedByValues: string[]]
   */
  private walk(path: string | string[]): [ArityBounds, Property, MetaDatum | MetaDatum[]] {
    const parsedPath = Array.isArray(path) ? path : parsePath(path);

    let arity: ArityBounds = MandatoryArity;
    let prop: Property = this.metaFormat.metaProps;
    let data: MetaDatum | MetaDatum[] = this.root;

    for (const edge of parsedPath) {
      [arity, prop, data] = this.step(arity, prop, data, edge);
    }

    return [arity, prop, data];
  }

  /**
   * Get model data on specified path. Additionally, implicitly selects only metadata where appropriate.
   * @param path Path consisting of property names (delimited by dots) and indexes (wrapped in square brackets).
   * @example
   * const result = model.getData(".Authors[1].Degrees[1].AwardedBy");
   * // result === [Mandatory: Arity, AwardedByProperty: MetaProperty, AwardedByValue: string]
   */
  getData(path: string): [ArityBounds, Property, MetaDatum | MetaDatum[]] {
    const [arity, prop, data] = this.walk(path);

    if (Array.isArray(data) && data.length === 1 && arity.max === 1) {
        return [arity, prop, data[0]];
    }

    return [arity, prop, data];
  }

  /**
   * Get metadata on specified path.
   * @param path Path consisting of property names (delimited by dots) and indexes (wrapped in square brackets).
   * @returns
   * @example
   * const result = model.getValue(".Authors[1].Degrees[1].AwardedBy");
   * // result === AwardedByValue: string
   */
  getValue(path: string): Primitive | Primitive[] {
    const [arity, _, data] = this.walk(path);

    if (Array.isArray(data)) {
      if (data[0] instanceof StructuredMetaDatum) {
        throw new Error(`GET ARRAY STRUCT DATA: Cannot get list of structured property at ${path}.`);
      }

      // Implicit first
      if (data.length === 1 && arity.max === 1) {
        return (data[0] as PrimitiveMetaDatum<any>).value;
      }

      return data.map((pd: PrimitiveMetaDatum<any>) => pd.value);
    }
    else {
      if (data instanceof StructuredMetaDatum) {
        throw new Error(`GET SCALAR STRUCT DATA: Cannot get a structured property at ${path}.`);
      }

      return (data as PrimitiveMetaDatum<any>).value;
    }
  }

  /**
   * Set metadata on specified path.
   * @param path Path consisting of property names (delimited by dots) and indexes (wrapped in square brackets).
   * @param value Primitive value (non-object) to fill the property.
   * @example
   * const result = model.setValue(".Authors[1].Degrees[1].AwardedBy", "CUNI");
   * // result === AwardedByValue: string
   */
  setValue(path: string, value: Primitive) {
    let [_, __, data] = this.walk(path);

    if (Array.isArray(data)) {
      // TODO: Only implicitly get first if mandatory or optional
      if (data.length > 1) {
        throw new Error(`Cannot set a list of properties at ${path}`);
      }
      data = data[0];
    }

    if (data instanceof StructuredMetaDatum) {
      throw new Error(`Cannot set a structured property at ${path}.`);
    }

    (data as PrimitiveMetaDatum<any>).value = value;
  }

  addValue(path: string) {
    let [arity, prop, data] = this.walk(path);

    if (!Array.isArray(data)) {
      throw new Error(`Cennot add a value to non-list property ${path}`);
    }

    if (arity.max && data.length >= arity.max) {
      throw new Error(`Cannot add a value, maximum arity of ${arity.max} reached.`);
    }

    data.push(createMetaDatum(prop));
  }

  deleteValue(path: string) {
    const parsedPath = parsePath(path);
    const lastEdge = parsedPath.pop();
    let [arity, prop, data] = this.walk(parsedPath);

    if (!lastEdge) {
      throw new Error(`Cannot delete root.`);
    }

    if (data instanceof PrimitiveMetaDatum) {
      throw new Error(`Wrong path, expected end at ${data.name}, was followed by ${lastEdge}`);
    }

    if (!isNaN(+lastEdge)) {
      if (!Array.isArray(data)) {
        throw new Error(`Wrong path, expected list before end, got ${data.name}`);
      }

      if (data.length <= 0) {
        throw new Error(`Cannot remove from empty list of ${prop.name}.`);
      }

      if (arity.min && data.length <= arity.min) {
        throw new Error(`Cannot remove from list of ${prop.name}, already at minimum arity.`);
      }

      data.splice(+lastEdge, 1);
      return;
    }

    delete (data as StructuredMetaDatum).data[lastEdge];
  }

  *preOrderTraversal(path: string = "",
                     arity: ArityBounds = MandatoryArity,
                     metaProperty: Property = this.metaFormat.metaProps,
                     metaDatum: MetaDatum = this.root): Generator<[string, ArityBounds, Property, MetaDatum]> {
    if (!metaDatum)
      return;

    yield [path, arity, metaProperty, metaDatum];

    const isDataStructured = metaDatum instanceof StructuredMetaDatum;
    const isPropStructured = metaProperty instanceof StructuredProperty;

    if (isDataStructured !== isPropStructured) {
      throw new Error(`BAD DATA: MetaDatum ${metaDatum.name} is structurally inconsistent with underlying property ${metaProperty.name}.`);
    }

    if (isDataStructured && isPropStructured) {
      for (const key in metaDatum.data) {
        const childPath = `${path}.${key}`;
        const {arity: childArity, property: childMetaProperty} = metaProperty.propertyDefinitions[key];
        const childMetaData = metaDatum.data[key];

        for (const childMetaDatum of childMetaData) {
          yield* this.preOrderTraversal(childPath, childArity, childMetaProperty, childMetaDatum);
        }
      }
    }
  }

  [Restructurable.from](obj: MetaModel) {
    return new MetaModel(obj.metaFormat, obj.root);
  }
}

export type Primitive = number | string | boolean | Date;

// TODO: Make into type/interface to avoid unnecessary restructuring
export class MetaDatum extends Restructurable {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
export class PrimitiveMetaDatum<T extends Primitive> extends MetaDatum {
  value?: T;

  constructor(name: string, value?: T) {
    super(name);
    this.value = value;
  }
}
export class StructuredMetaDatum extends MetaDatum {
  data: {[name: string]: PrimitiveMetaDatum<any>[] | StructuredMetaDatum[]};

  constructor(name: string, data: {[name: string]: MetaDatum[]}) {
    super(name);
    this.data = data;
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
    const values: {[p: string]: MetaDatum[]} =
      Object.fromEntries(
        Object.values(property.propertyDefinitions)
          .map(({arity, property}) =>
            [
              property.name,
              // Instantiate according to minimal arity (unless optional, which is instantiated regardless)
              [... new Array((arity.max && arity.max <= 1) ? arity.max : arity.min)]
                .map(() => createMetaDatum(property))
            ]
      )
    );
    return new StructuredMetaDatum(property.name, values);
  }
  else {
    return new PrimitiveMetaDatum(property.name);
  }
}

function copyMetaDatum(property: Property, value: MetaDatum): MetaDatum {
  if (property instanceof StructuredProperty) {
    if (!(value instanceof StructuredMetaDatum)) {
      throw new Error(`Property ${property.name} is structured, value ${value.name} is not.`);
    }

    const copyData = Object.fromEntries(
      Object.entries(value.data)
        .map(([subPropName, subValues]) => {
          const subProperty = property.propertyDefinitions[subPropName].property;
          const subCopies = subValues.map(subValue => copyMetaDatum(subProperty, subValue));
          return [subPropName, subCopies];
        })
    )
    return new StructuredMetaDatum(property.name, copyData);
  }
  else {
    if (!(value instanceof PrimitiveMetaDatum)) {
      throw new Error(`Property ${property.name} is not structured, value ${value.name} is.`);
    }
    return new PrimitiveMetaDatum(property.name, value.value);
  }
}

