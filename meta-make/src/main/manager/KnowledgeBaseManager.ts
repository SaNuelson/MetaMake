import { KnowledgeBase, KnowledgeBaseInfo } from '../../common/dto/KnowledgeBase'
import KnowledgeBaseModel from '../dto/KnowledgeBaseModel'
import { randomUUID } from 'node:crypto'
import MetaStore from '../data/MetaStore'
import { existsSync, mkdirSync } from 'fs'
import { Config, LogLevel } from '../../common/constants.js'
import { readdirSync } from 'node:fs'

class KnowledgeBaseManager {
  private knowledgeBases: {[id: string]: KnowledgeBaseModel} = {}
  private areKnowledgeBasesLoaded: boolean = false;

  getKnowledgeBaseList(formatName?: string): KnowledgeBaseInfo[] {
    if (!this.areKnowledgeBasesLoaded) {
      if (MetaStore.logLevel >= LogLevel.Warning)
        console.warn("KnowledgeBases accessed before loading.");
      return [];
    }

    const kbs = Object.values(this.knowledgeBases).map(kb => kb.info());
    if (formatName)
      return kbs.filter(kb => kb.format == formatName);
    return kbs;
  }

  getKnowledgeBase(id: string): KnowledgeBase | undefined {
    if (!this.areKnowledgeBasesLoaded) {
      if (MetaStore.logLevel >= LogLevel.Warning)
        console.warn("KnowledgeBases accessed before loading.");
      return undefined;
    }

    return this.knowledgeBases[id];
  }

  async setKnowledgeBase(kb: KnowledgeBase): Promise<string> {
    if (this.knowledgeBases[kb.id]) {
      await this.updateKnowledgeBase(kb);
    }
    else {
      await this.createKnowledgeBase(kb);
    }

    return kb.id;
  }

  private async updateKnowledgeBase(kb: KnowledgeBase) {
    const knownKB = this.knowledgeBases[kb.id];
    if (!knownKB)
      throw new Error(`KnowledgeBase not found: ${kb.id}`);
    Object.assign(knownKB, kb);
    await knownKB.save();
  }

  private async createKnowledgeBase(kb: KnowledgeBase) {
    const newKB: KnowledgeBaseModel = new KnowledgeBaseModel(randomUUID(), kb.name, kb.format, kb.model, kb.changedOn);
    this.knowledgeBases[newKB.id] = newKB;
    await newKB.save();
  }

  deleteKnowledgeBase(kbId: string) {
    if (!this.areKnowledgeBasesLoaded) {
      if (MetaStore.logLevel >= LogLevel.Warning)
        console.warn("KnowledgeBases accessed before loading.");
      return;
    }

    if (!this.knowledgeBases[kbId]) {
      if (MetaStore.logLevel >= LogLevel.Error)
        console.error(`Trying to delete non-existent KnowledgeBase ${kbId}.`);
    }

    delete this.knowledgeBases[kbId];
  }

  private async loadKnowledgeBases() {
    const kbIds = readdirSync(MetaStore.get(Config.kbPath), {withFileTypes: true})
      .filter(item => !item.isDirectory() && item.name.toLowerCase().endsWith(".json"))
      .map(item => item.name.slice(0, item.name.length - ".json".length));

    const loadedKBs = await Promise.allSettled(
      kbIds.map((kbId) => KnowledgeBaseModel.load(kbId)));

    for (let i = 0; i < loadedKBs.length; i++){
      const kbId = kbIds[i];
      const kbLoad = loadedKBs[i]
      if (kbLoad.status === 'rejected') {
        if (MetaStore.logLevel >= LogLevel.Warning)
          console.warn(`Failed to parse potential knowledge base '${kbId}' (${kbLoad.reason})`);
      }
      else {
        if (MetaStore.logLevel >= LogLevel.Verbose)
          console.log(`Successfully parsed potential knowledge base '${kbId}' (${kbLoad.value.name})`);
        this.knowledgeBases[kbId] = kbLoad.value;
      }
    }

    this.areKnowledgeBasesLoaded = true;
  }

  private isInit: boolean = false;
  public async init() {
    if (this.isInit)
      return;
    this.isInit = true;

    const kbPath = MetaStore.get(Config.kbPath);
    if (!existsSync(kbPath))
      mkdirSync(kbPath)

    await this.loadKnowledgeBases()
  }
}

export default new KnowledgeBaseManager()
