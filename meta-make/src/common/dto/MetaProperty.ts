import Restructurable from './Restructurable'

type PropertyType = 'string' | 'email' | 'number' | 'object' | 'array' | 'boolean' | 'date'

export default class MetaProperty extends Restructurable {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly type: PropertyType

  constructor(id: number, name: string, description: string, type: PropertyType) {
    super()
    this.id = id;
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

  constructor(id: number, name: string, description: string, children: MetaProperty[]) {
    super(id, name, description, 'object')
    this.children = children
  }

  isValid(values: any[]): boolean {
    return values.every(value => typeof value === this.type);
  }
}

export class ListMetaProperty extends MetaProperty {
  readonly itemType: PropertyType

  constructor(id: number, name: string, description: string, itemType: PropertyType) {
    super(id, name, description, 'array')
    this.itemType = itemType
  }
}
