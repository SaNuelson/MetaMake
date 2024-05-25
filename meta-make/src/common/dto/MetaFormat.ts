import Property from "./Property.js";
import Restructurable from './Restructurable'

export default class MetaFormat extends Restructurable {
  public name: string
  public metaProps: Property

  constructor(name: string, metaProps: Property) {
    super()
    this.name = name
    this.metaProps = metaProps
  }

  serialize():string {
    return JSON.stringify(this, (key, value) => key !== '__className' ? value : undefined)
  }
}
