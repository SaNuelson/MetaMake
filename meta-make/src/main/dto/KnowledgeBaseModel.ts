import { KnowledgeBase } from '../../common/dto/KnowledgeBase'
import path from 'node:path'
import { Config } from '../../common/constants'
import {
  readTextFromFile,
  writeTextToFile
} from '../utils/io'
import Restructurable from '../../common/dto/Restructurable'
import { chainJsonTransformers, dateTimeReviver, metaObjectReviver, metaObjectStripper } from "../utils/json";
import MetaStore from "../data/MetaStore";

export default class KnowledgeBaseModel extends KnowledgeBase {
  async save() {
    const text = JSON.stringify(this, metaObjectStripper, '    ');

    const savePath = path.join(MetaStore.get(Config.kbPath) as string, this.id + ".json");
    await writeTextToFile(savePath, text);
  }

  static kbModelReviver = chainJsonTransformers(true, metaObjectReviver, dateTimeReviver);

  static async load(id: string): Promise<KnowledgeBaseModel> {
    const loadPath = path.join(MetaStore.get(Config.kbPath) as string, id + ".json");
    const json = await readTextFromFile(loadPath);

    const parsed: object = JSON.parse(json, this.kbModelReviver);
    return Restructurable.restructure(parsed) as KnowledgeBaseModel
  }

  [Restructurable.from](obj: KnowledgeBaseModel): KnowledgeBaseModel {
    return new KnowledgeBaseModel(obj.id, obj.name, obj.format, obj.model, obj.changedOn);
  }
}
