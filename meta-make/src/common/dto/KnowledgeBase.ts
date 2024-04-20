import Restructurable from './Restructurable'
import MetaFormat from './MetaFormat'

export class KnowledgeBase extends Restructurable {
  public id: string
  public name: string
  public format: MetaFormat
  public changedOn: Date
  public path: string

  constructor(
    id: string | null,
    name: string,
    path: string | null,
    format: MetaFormat,
    changedOn: Date
  ) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.name = name
    // TODO: Make sure name is usable as filename, and/or normalize it
    this.path = path ?? 'Unknown' // ?? join(settings.getSync(Config.KBBasePath) as string, this.name)
    this.format = format
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
    return new KnowledgeBase(null, 'New KnowledgeBase', null, format, new Date())
  }
}

export type KnowledgeBaseInfo = {
  id: string
  name: string
  format: string
  changedOn: Date
}
