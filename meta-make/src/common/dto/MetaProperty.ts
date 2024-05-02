import Restructurable from './Restructurable'

type PropertyType = 'string' | 'email' | 'number' | 'object' | 'array' | 'boolean'

export default class MetaProperty extends Restructurable {
  readonly name: string
  readonly description: string
  readonly type: PropertyType

  constructor(name: string, description: string, type: PropertyType) {
    super()
    this.name = name
    this.description = description
    this.type = type
  }

  isValid(value: any): boolean {
    const valueType = typeof value;
    return valueType === this.type;
  }
}

export class StructuredMetaProperty extends MetaProperty {
  readonly children: MetaProperty[]

  constructor(name: string, description: string, children: MetaProperty[]) {
    super(name, description, 'object')
    this.children = children
  }

  isValid(values: any[]): boolean {
    return values.every(value => typeof value === this.type);
  }
}

export class ListMetaProperty extends MetaProperty {
  readonly itemType: PropertyType

  constructor(name: string, description: string, itemType: PropertyType) {
    super(name, description, 'array')
    this.itemType = itemType
  }
}
