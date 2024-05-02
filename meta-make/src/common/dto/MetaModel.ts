import Restructurable from "./Restructurable";
import MetaProperty, { StructuredMetaProperty } from "./MetaProperty";
import MetaFormat from "./MetaFormat";

export default class MetaModel extends Restructurable {
  private metaFormat: MetaFormat;
  private metaFormatProperties: Set<MetaProperty> = new Set();
  private values: Map<MetaProperty, any> = new Map();

  constructor(metaFormat: MetaFormat) {
    super();
    this.metaFormat = metaFormat;
    this.metaFormatProperties = flattenMetaProperty(metaFormat?.metaProps);
  }

  private hasMetaProperty(metaProperty: MetaProperty): boolean {
    return this.metaFormatProperties.has(metaProperty);
  }

  getValue(metaProperty: MetaProperty): any | undefined {
    if (!this.hasMetaProperty(metaProperty))
      throw new Error(`Invalid MetaProperty "${metaProperty?.name}"`);

    return this.values.get(metaProperty);
  }

  setValue(metaProperty: MetaProperty, value: any) {
    if (!this.hasMetaProperty(metaProperty))
      throw new Error(`Invalid MetaProperty "${metaProperty?.name}"`);

    if (!metaProperty.isValid(value))
      throw new Error(`Invalid MetaDatum "${value}" for "${metaProperty.name}"`);

    this.values.set(metaProperty, value);
  }
}

function flattenMetaProperty(property: MetaProperty, set: Set<MetaProperty> = new Set()): Set<MetaProperty> {
  set.add(property);
  if (property instanceof StructuredMetaProperty) {
    for (const child of property.children) {
      flattenMetaProperty(child, set);
    }
  }
  return set;
}
