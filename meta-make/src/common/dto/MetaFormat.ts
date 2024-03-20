import MetaProperty from './MetaProperty'
import Restructurable from './Restructurable'

export default class MetaFormat extends Restructurable {
  public name: string
  public metaProps: { [name: string]: MetaProperty }

  constructor(name: string, metaProps: { [p: string]: MetaProperty }) {
    super()
    this.name = name
    this.metaProps = metaProps
  }
}
