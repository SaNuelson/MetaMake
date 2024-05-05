import Restructurable from "./Restructurable";
import MetaProperty, { ListMetaProperty, StructuredMetaProperty } from "./MetaProperty";
import MetaFormat from "./MetaFormat";

type Primitive = undefined | string | number | Date | boolean;
type PrimitiveMetaValue = {
  value: Primitive;
}
type ListMetaValue = {
  values: Primitive[];
}
type StructuredMetaValue = {
  [key: string]: MetaValue;
}
type MetaValue = PrimitiveMetaValue | ListMetaValue | StructuredMetaValue;

export default class MetaModel extends Restructurable {
  private metaFormat: MetaFormat;
  private metaValues: MetaValue;
  private metaPaths: Map<MetaProperty, MetaValue>;

  constructor(metaFormat: MetaFormat);
  constructor(metaFormat: MetaFormat, metaValue?: MetaValue);
  constructor(metaFormat: MetaFormat, metaValue?: MetaValue) {
    super();

    if (metaValue) {
      if (!validateMetaValue(metaFormat.metaProps, metaValue))
        throw new Error("Invalid meta values");
    }
    else {
      metaValue = createMetaValue(metaFormat.metaProps);
    }

    this.metaFormat = metaFormat;
    this.metaValues = metaValue;
    this.metaPaths = createPropertyPaths(metaFormat.metaProps, metaValue);
  }

  private hasMetaProperty(metaProperty: MetaProperty): boolean {
    return this.metaPaths.has(metaProperty);
  }

  getValue(metaProperty: ListMetaProperty): Array<Primitive> | undefined;
  getValue(metaProperty: MetaProperty): Primitive | undefined;
  getValue(metaProperty: MetaProperty): Primitive | Array<Primitive> | undefined {
    if (!this.hasMetaProperty(metaProperty))
      throw new Error(`Invalid MetaProperty "${metaProperty?.name}"`);

    const metaValue = this.metaPaths.get(metaProperty);
    if (metaProperty instanceof StructuredMetaProperty) {
      throw new Error("Cannot get structured meta property directly.");
    }
    else if (metaProperty instanceof ListMetaProperty) {
      return (metaValue as ListMetaValue).values;
    }
    else {
      return (metaValue as PrimitiveMetaValue).value;
    }
  }

  setValue(metaProperty: MetaProperty, value: any) {
    if (!this.hasMetaProperty(metaProperty))
      throw new Error(`Invalid MetaProperty "${metaProperty?.name}"`);

    if (!metaProperty.isValid(value))
      throw new Error(`Invalid MetaDatum "${value}" for "${metaProperty.name}"`);

    const metaValue = this.metaPaths.get(metaProperty);
    if (metaProperty instanceof StructuredMetaProperty) {
      throw new Error("Cannot set structured meta property directly.");
    }
    else if (metaProperty instanceof ListMetaProperty) {
      if (!Array.isArray(value))
        throw new Error("Value has to be array for ListMetaProperty");

      (metaValue as ListMetaValue).values = value;
    }
    else {
      (metaValue as PrimitiveMetaValue).value = value;
    }
  }

  [Restructurable.from](obj: MetaModel): MetaModel {
    return new MetaModel(obj.metaFormat, obj.metaValues);
  }
}

function createMetaValue(property: MetaProperty): MetaValue {
  if (property instanceof StructuredMetaProperty) {
    return Object.fromEntries(property.children.map(child => [child.name, createMetaValue(child)]));
  }
  else if (property instanceof ListMetaProperty) {
    return {values: []};
  }
  else {
    return {value: undefined};
  }
}

function validateMetaValue(property: MetaProperty, value: MetaValue): boolean {
  if (property instanceof StructuredMetaProperty) {
    return property.children.every(child => validateMetaValue(child, value[child.name]));
  }
  else if (property instanceof ListMetaProperty) {
    return (value as ListMetaValue).values.every(value => property.itemType === typeof value);
  }
  else {
    return property.type === typeof (value as PrimitiveMetaValue).value;
  }
}

function createPropertyPaths(property: MetaProperty, value: MetaValue, map: Map<MetaProperty, MetaValue> = new Map()): Map<MetaProperty, MetaValue> {
  map.set(property, value);
  if (property instanceof StructuredMetaProperty) {
      for (const child of property.children) {
          createPropertyPaths(child, value[child.name], map);
      }
  }
  return map;
}
