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
  private __knowledgeBases: {[id: string]: KnowledgeBaseModel} = {}

  getKnowledgeBaseList(formatName?: string): KnowledgeBaseInfo[] {
    const kbs = Object.values(this.__knowledgeBases).map(kb => kb.info());
    if (formatName)
      return kbs.filter(kb => kb.format == formatName);
    return kbs;
  }

  public get knowledgeBases(): Array<KnowledgeBaseModel> {
    return Object.values(this.__knowledgeBases);
  }

  getKnowledgeBase(id: string): KnowledgeBase | undefined {
    return this.__knowledgeBases[id];
  }

  async setKnowledgeBase(kb: KnowledgeBase): Promise<string> {
    if (this.__knowledgeBases[kb.id]) {
      await this.updateKnowledgeBase(kb);
    }
    else {
      await this.createKnowledgeBase(kb);
    }

    return kb.id;
  }

  private async updateKnowledgeBase(kb: KnowledgeBase) {
    const knownKB = this.__knowledgeBases[kb.id];
    if (!knownKB)
      throw new Error(`KnowledgeBase not found: ${kb.id}`);
    Object.assign(knownKB, kb);
    await knownKB.save();
  }

  private async createKnowledgeBase(kb: KnowledgeBase) {
    const newKB: KnowledgeBaseModel = new KnowledgeBaseModel(randomUUID(), kb.name, kb.format, kb.model, kb.changedOn);
    this.__knowledgeBases[newKB.id] = newKB;
    await newKB.save();
    MetaStore.addKnowledgeBase(newKB.id);
  }

  deleteKnowledgeBase(kbId: string) {
    if (!this.__knowledgeBases[kbId])
      console.error(`Trying to delete non-existent KnowledgeBase ${kbId}.`);
    delete this.__knowledgeBases[kbId];
    MetaStore.deleteKnowledgeBase(kbId);
  }

  public async loadKBs() {
    const kbIds = MetaStore.getKnowledgeBases()
    const kbs = await Promise.all(kbIds.map((kbId) => KnowledgeBaseModel.load(kbId)));
    this.__knowledgeBases = kbs.reduce((acc, kb) => {
      acc[kb.id] = kb;
      return acc;
    }, {});
  }
  // endregion
}

export default new KnowledgeBaseManager()
