import Restructurable from './Restructurable'

type PropertyType = 'string' | 'email' | 'number' | 'object'

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
}

export class StructuredMetaProperty extends MetaProperty {
  readonly children: MetaProperty[]

  constructor(name: string, description: string, children: MetaProperty[]) {
    super(name, description, 'object')
    this.children = children
  }
}

export class ListMetaProperty extends MetaProperty {
  
}
