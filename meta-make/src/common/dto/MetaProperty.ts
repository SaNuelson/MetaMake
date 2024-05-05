import Restructurable from './Restructurable'

type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'date'
type PropertySubType = 'email' | 'url'

export default class MetaProperty extends Restructurable {
  readonly name: string
  readonly description: string
  readonly mandatory: boolean
  readonly type: PropertyType
  readonly subType?: PropertySubType

  constructor(name: string, description: string, mandatory: boolean, type: PropertyType, subType?: PropertySubType) {
    super()
    this.name = name
    this.description = description
    this.mandatory = mandatory
    this.type = type
    this.subType = subType
  }

  isValid(value: any): boolean {
    const valueType = typeof value;
    return valueType === this.type;
  }
}

export class StructuredMetaProperty extends MetaProperty {
  readonly children: MetaProperty[]

  constructor(name: string, description: string, children: MetaProperty[]) {
    super(name, description, true, 'object')
    this.children = children
  }

  isValid(values: any[]): boolean {
    return values.every(value => typeof value === this.type);
  }
}

export class ListMetaProperty extends MetaProperty {
  readonly itemType: PropertyType

  constructor(name: string, description: string, itemType: PropertyType) {
    super(name, description, true, 'array')
    this.itemType = itemType
  }
}
