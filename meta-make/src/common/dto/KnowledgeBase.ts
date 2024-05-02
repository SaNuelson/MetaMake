import Restructurable from "./Restructurable";
import MetaFormat from "./MetaFormat";
import MetaModel from "./MetaModel";

export class KnowledgeBase extends Restructurable {
  public id: string
  public name: string
  public format: MetaFormat
  public model: MetaModel
  public changedOn: Date
  public path: string

  constructor(
    id: string,
    name: string,
    path: string | null,
    format: MetaFormat,
    changedOn: Date
  ) {
    super()
    this.id = id
    this.name = name
    // TODO: Make sure name is usable as filename, and/or normalize it
    this.path = path ?? 'Unknown'
    this.format = format
    this.model = new MetaModel(format)
    this.changedOn = changedOn
  }

  info(): KnowledgeBaseInfo {
    return {
      id: this.id,
      name: this.name,
      format: this.format.name,
      changedOn: this.changedOn
    }
  }

  static Empty(format: MetaFormat): KnowledgeBase {
    return new KnowledgeBase("new", 'New KnowledgeBase', null, format, new Date())
  }
}

export type KnowledgeBaseInfo = {
  id: string
  name: string
  format: string
  changedOn: Date
}
