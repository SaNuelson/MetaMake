import { KnowledgeBase, KnowledgeBaseInfo } from '../../common/dto/KnowledgeBase'
import { papaStream } from '../utils/io'
import Essential from '../format/Essential'
import MetaFormat from '../../common/dto/MetaFormat'
import Basic from '../format/Basic'
import KnowledgeBaseModel from '../dto/KnowledgeBaseModel'
import Long from "../format/Long";

class KnowledgeBaseManager {
  private __metaFormats: Array<MetaFormat> = [Essential, Basic, Long]

  public getMetaFormatList(): string[] {
    return this.__metaFormats.map((kb) => kb.name)
  }

  public get metaFormats(): Array<MetaFormat> {
    return [...this.__metaFormats]
  }

  private __knowledgeBases: Array<KnowledgeBaseModel> = []

  public get knowledgeBases(): Array<KnowledgeBaseModel> {
    return [...this.__knowledgeBases]
  }

  public async loadKBs(path: string) {
    const stream = papaStream(path)
    stream.on('data', (data: string[]) => {
      // TODO: validate
      const [id, name, path, format, changedOnStr] = data
      const changedOn = new Date(Date.parse(changedOnStr))
      this.knowledgeBases.push(
        new KnowledgeBaseModel(id, name, path, new MetaFormat(format, {}), changedOn)
      )
    })
  }

  public async saveKBs(): Promise<void> {

  }

  getKnowledgeBaseList(): KnowledgeBaseInfo[] {
    return this.knowledgeBases.map((kb) => kb.info())
  }

  getKnowledgeBase(id: string): KnowledgeBase | undefined {
    return this.knowledgeBases.find((kb) => kb.id == id)
  }

  async init() {
    const kbIds = ['testkb001', 'testkb002', 'testkb003']

    await Promise.all(kbIds.map(async (id) => await KnowledgeBaseModel.load(id)))
      .then((kbms) => {
        console.log("KBMan.init() ->", kbms)
        this.__knowledgeBases.push(...kbms)
      })
  }

  setKnowledgeBase(kb: KnowledgeBase) {
    const knownKB = this.__knowledgeBases.find(kkb => kkb.id === kb.id);
    if (knownKB) {
      Object.assign(knownKB, kb);
    }
    else {
      this.__knowledgeBases.push(new KnowledgeBaseModel(kb.id, kb.name, kb.path, kb.format, kb.changedOn));
    }
  }

  getMetaFormat(name: string): MetaFormat | undefined {
    return this.__metaFormats[name];
  }
}

export default new KnowledgeBaseManager()
