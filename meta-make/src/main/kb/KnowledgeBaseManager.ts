import { KnowledgeBase, KnowledgeBaseInfo } from '../../common/dto/KnowledgeBase'
import { papaStream } from '../utils/io'
import Essential from '../format/Essential'
import MetaFormat from '../../common/dto/MetaFormat'
import Basic from '../format/Basic'
import KnowledgeBaseModel from '../dto/KnowledgeBaseModel'
import Long from "../format/Long";

class KnowledgeBaseManager {
  // region MetaFormats
  private __metaFormats: Array<MetaFormat> = [Essential, Basic, Long]

  public getMetaFormatList(): string[] {
    return this.__metaFormats.map((kb) => kb.name)
  }

  public get metaFormats(): Array<MetaFormat> {
    return [...this.__metaFormats]
  }

  getMetaFormat(name: string): MetaFormat | undefined {
    return this.__metaFormats[name];
  }
  // endregion

  // region KnowledgeBases
  private __knowledgeBases: Array<KnowledgeBaseModel> = []

  getKnowledgeBaseList(): KnowledgeBaseInfo[] {
    return this.knowledgeBases.map((kb) => kb.info())
  }

  public get knowledgeBases(): Array<KnowledgeBaseModel> {
    return [...this.__knowledgeBases]
  }

  getKnowledgeBase(id: string): KnowledgeBase | undefined {
    return this.knowledgeBases.find((kb) => kb.id == id)
  }

  async setKnowledgeBase(kb: KnowledgeBase) {
    const knownKB = this.__knowledgeBases.find(kkb => kkb.id === kb.id);
    if (knownKB) {
      Object.assign(knownKB, kb);
      await knownKB.save();
    }
    else {
      const newKB: KnowledgeBaseModel = new KnowledgeBaseModel(kb.id, kb.name, kb.path, kb.format, kb.changedOn);
      this.__knowledgeBases.push(newKB);
      await newKB.save();
    }
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
  // endregion

  async init() {
    const kbIds = ['testkb001', 'testkb002', 'testkb003']

    await Promise.all(kbIds.map(async (id) => await KnowledgeBaseModel.load(id)))
      .then((kbms) => {
        console.log("KBMan.init() ->", kbms)
        this.__knowledgeBases.push(...kbms)
      })
  }

}

export default new KnowledgeBaseManager()
