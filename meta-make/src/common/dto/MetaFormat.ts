import { StructuredProperty } from "./Property.js";
import Restructurable from './Restructurable'

export default class MetaFormat extends Restructurable {
  public name: string
  public metaProps: StructuredProperty

  constructor(name: string, metaProps: StructuredProperty) {
    super()
    this.name = name
    this.metaProps = metaProps
  }

  serialize():string {
    return JSON.stringify(this, (key, value) => key !== '__className' ? value : undefined)
  }
}
