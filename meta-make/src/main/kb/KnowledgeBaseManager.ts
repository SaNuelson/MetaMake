import { KnowledgeBase, KnowledgeBaseInfo } from '../../common/dto/KnowledgeBase'
import { papaStream } from '../utils/io'
import Essential from '../format/Essential'
import MetaFormat from '../../common/dto/MetaFormat'
import Basic from '../format/Basic'

class KnowledgeBaseManager {
  private __metaFormats: Array<MetaFormat> = [Essential, Basic]

  public get metaFormats(): Array<MetaFormat> {
    return [...this.__metaFormats]
  }

  private __knowledgeBases: Array<KnowledgeBase> = [
    // TODO: Remove
    new KnowledgeBase('testkb001', 'Test KB 001', '/testkb001.kb', Essential, new Date(Date.now())),
    new KnowledgeBase('testkb002', 'Test KB 002', '/testkb002.kb', Essential, new Date(Date.now())),
    new KnowledgeBase('testbk003', 'Test KB 002', '/testkb003.kb', Basic, new Date(Date.now()))
  ]

  public get knowledgeBases(): Array<KnowledgeBase> {
    return [...this.__knowledgeBases]
  }

  public getMetaFormatList(): string[] {
    return this.__metaFormats.map((kb) => kb.name)
  }

  public addKB(kb: KnowledgeBase) {
    // TODO: Check if known, if not write to cache
    this.__knowledgeBases.push(kb)
  }

  public async loadKBs(path: string) {
    const stream = papaStream(path)
    stream.on('data', (data: string[]) => {
      // TODO: validate
      const [id, name, path, format, changedOnStr] = data
      const changedOn = new Date(Date.parse(changedOnStr))
      this.knowledgeBases.push(
        new KnowledgeBase(id, name, path, new MetaFormat(format, {}), changedOn)
      )
    })
  }

  getKnowledgeBaseList(): KnowledgeBaseInfo[] {
    return this.knowledgeBases.map((kb) => kb.info())
  }

  getKnowledgeBase(id: string): KnowledgeBase | undefined {
    return this.knowledgeBases.find((kb) => kb.id == id)
  }
}

export default new KnowledgeBaseManager()
