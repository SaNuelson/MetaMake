import Restructurable from "./Restructurable";
import MetaProperty, { StructuredMetaProperty } from "./MetaProperty";
import MetaFormat from "./MetaFormat";

export default class MetaModel extends Restructurable {
  private metaFormat: MetaFormat;
  private metaFormatProperties: Set<number> = new Set();
  private values: {[id: number]: any} = {};

  constructor(metaFormat: MetaFormat);
  constructor(metaFormat: MetaFormat, values?: {[id: number]: any});
  constructor(metaFormat: MetaFormat, values?: {[id: number]: any}) {
    super();
    this.metaFormat = metaFormat;
    this.metaFormatProperties = flattenMetaProperty(metaFormat?.metaProps);
    for (let key in values) {
      if (this.metaFormatProperties.has(+key)) {
        this.values[key] = values[key];
      }
    }
  }

  private hasMetaProperty(metaProperty: MetaProperty): boolean {
    return this.metaFormatProperties.has(metaProperty.id);
  }

  getValue(metaProperty: MetaProperty): any | undefined {
    if (!this.hasMetaProperty(metaProperty))
      throw new Error(`Invalid MetaProperty "${metaProperty?.name}"`);

    return this.values[metaProperty.id];
  }

  setValue(metaProperty: MetaProperty, value: any) {
    if (!this.hasMetaProperty(metaProperty))
      throw new Error(`Invalid MetaProperty "${metaProperty?.name}"`);

    if (!metaProperty.isValid(value))
      throw new Error(`Invalid MetaDatum "${value}" for "${metaProperty.name}"`);

    this.values[metaProperty.id] = value;
  }

  [Restructurable.from](obj: MetaModel): MetaModel {
    return new MetaModel(obj.metaFormat, obj.values);
  }
}

function flattenMetaProperty(property: MetaProperty, set: Set<number> = new Set()): Set<number> {
  set.add(property.id);
  if (property instanceof StructuredMetaProperty) {
    for (const child of property.children) {
      flattenMetaProperty(child, set);
    }
  }
  return set;
}
