import { KnowledgeBase } from '../../common/dto/KnowledgeBase'
import ElectronStore from 'electron-store'
import path from 'node:path'
import { Config } from '../../common/constants'
import {
  chainJsonTransformers,
  metaObjectReviver,
  metaObjectStripper,
  readTextFromFile,
  writeTextToFile
} from '../utils/io'
import Restructurable from '../../common/dto/Restructurable'
import { dateTimeReviver } from '../../common/utils/json'

const store = new ElectronStore()

export default class KnowledgeBaseModel extends KnowledgeBase {
  async save() {
    const text = JSON.stringify(this, metaObjectStripper, '    ');

    const savePath = path.join(store.get(Config.kbPath) as string, this.id + ".json");
    await writeTextToFile(savePath, text);
  }

  static kbModelReviver = chainJsonTransformers(true, metaObjectReviver, dateTimeReviver);

  static async load(id: string): Promise<KnowledgeBaseModel> {
    const loadPath = path.join(store.get(Config.kbPath) as string, id + ".json");
    const json = await readTextFromFile(loadPath);

    const parsed: object = JSON.parse(json, this.kbModelReviver);
    return Restructurable.restructure(parsed) as KnowledgeBaseModel
  }
}
