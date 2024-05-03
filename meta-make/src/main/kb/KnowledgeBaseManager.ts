import { KnowledgeBase, KnowledgeBaseInfo } from '../../common/dto/KnowledgeBase'
import Essential from '../format/Essential'
import MetaFormat from '../../common/dto/MetaFormat'
import Basic from '../format/Basic'
import KnowledgeBaseModel from '../dto/KnowledgeBaseModel'
import Long from '../format/Long'
import { randomUUID } from 'node:crypto'
import MetaStore from '../data/MetaStore'

class KnowledgeBaseManager {
  // region MetaFormats
  private __metaFormats: {[name: string]: MetaFormat} = {
    [Essential.name]: Essential,
    [Basic.name]: Basic,
    [Long.name]: Long
  }

  public getMetaFormatList(): string[] {
    return Object.keys(this.__metaFormats);
  }

  public get metaFormats(): Array<MetaFormat> {
    return Object.values(this.__metaFormats)
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

  async setKnowledgeBase(kb: KnowledgeBase): Promise<string> {
    if (this.__knowledgeBases.some(kkb => kkb.id === kb.id)) {
      await this.updateKnowledgeBase(kb);
    }
    else {
      await this.createKnowledgeBase(kb);
    }

    return kb.id;
  }

  private async updateKnowledgeBase(kb: KnowledgeBase) {
    const knownKB = this.__knowledgeBases.find(kkb => kkb.id === kb.id);
    if (!knownKB)
      throw new Error(`KnowledgeBase not found: ${kb.id}`);
    Object.assign(knownKB, kb);
    await knownKB.save();
  }

  private async createKnowledgeBase(kb: KnowledgeBase) {
    const newKB: KnowledgeBaseModel = new KnowledgeBaseModel(randomUUID(), kb.name, kb.format, kb.model, kb.changedOn);
    this.__knowledgeBases.push(newKB);
    await newKB.save();
    MetaStore.addKnowledgeBase(newKB.id);
  }

  public async loadKBs() {
    const kbIds = MetaStore.getKnowledgeBases()
    this.__knowledgeBases = await Promise.all(kbIds.map((kbId) => KnowledgeBaseModel.load(kbId)))
  }
  // endregion
}

export default new KnowledgeBaseManager()
