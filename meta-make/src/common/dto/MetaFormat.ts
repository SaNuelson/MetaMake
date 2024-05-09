import { StructuredMetaProperty } from "./MetaProperty";
import Restructurable from './Restructurable'

export default class MetaFormat extends Restructurable {
  public name: string
  public metaProps: StructuredMetaProperty

  constructor(name: string, metaProps: StructuredMetaProperty) {
    super()
    this.name = name
    this.metaProps = metaProps
  }

  serialize():string {
    return JSON.stringify(this, (key, value) => key !== '__className' ? value : undefined)
  }
}
