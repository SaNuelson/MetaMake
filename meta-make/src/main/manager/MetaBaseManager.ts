import { KnowledgeBase } from '../../common/dto/KnowledgeBase'
import MetaFormat from '../../common/dto/MetaFormat'
import { broadcastToWindows } from '../events'
import { EventType, LogLevel } from "../../common/constants";
import MetaModelSource, { MetaBase } from '../../common/dto/MetaModelSource'
import MetaModel from '../../common/dto/MetaModel'
import { Processor } from '../processing/Processor.js'
import MetaStore from "../data/MetaStore.js";
import DataManager from "./DataManager.js";
import ChatGPTProcessor from "../processing/ChatGPTProcessor.js";

class MetaBaseManager {
  private _format?: MetaFormat
  get format(): MetaFormat {
    if (!this._active) throw new Error('Inactive MetaBaseManager')
    return this._format!
  }

  private _models: [MetaModel, MetaModelSource][] = []
  get models(): [MetaModel, MetaModelSource][] {
    if (!this._active) throw new Error('Inactive MetaBaseManager')
    return this._models!
  }

  // TODO
  private _processors: Processor[] = [
    ChatGPTProcessor
  ]

  getModels(formatName?: string): [MetaModel, MetaModelSource][] {
    if (formatName) return this._models.filter((model) => model[0].metaFormat.name === formatName)
    return this._models
  }

  get metaBase(): MetaBase {
    if (!this._active || !this._models || !this._format) {
      throw new Error('No active metabase.')
    }

    return {
      format: this._format,
      models: this._models
    }
  }

  private _active: boolean = false
  get active(): boolean {
    return this._active
  }

  private _processed: boolean = false
  get processed(): boolean {
    return this._processed
  }

  private reset() {
    delete this._format
    this._models = []
    this._active = false
    this._processed = false
  }

  fromKnowledgeBase(kb: KnowledgeBase): boolean {
    try {
      this.reset()

      this._format = kb.format
      this._models = [[kb.model, { name: kb.name, label: 'KB' }]]

      this._active = true
    } catch (error) {
      console.error(error)
    }

    this.startProcessing()
    return this._active
  }

  fromMetaFormat(metaFormat: MetaFormat) {
    try {
      this.reset()

      this._format = metaFormat
      this._models = []

      this._active = true
    } catch (error) {
      console.error(error)
    }

    this.startProcessing()
    return this._active
  }

  private async startProcessing() {

    if (!this._format) {
      throw new Error("MetaBaseManager cannot process when no format selected");
    }

    const usedFormats: MetaFormat[] = [];

    for (const processor of this._processors) {
      processor.initialize(this._format, usedFormats);
    }

    for (const processor of this._processors) {
      const inputs = processor.getInputFormats();

      for (const inputFormat of inputs) {
        if (!usedFormats.includes(inputFormat)) {
          if (MetaStore.logLevel >= LogLevel.Warning)
            console.warn(`Pipeline module ${processor.getName} accepts ${inputFormat.name}, which isn't produced by any previous module.`);
        }
      }

      const output = processor.getOutputFormat();
      usedFormats.push(output);
    }

    const modelMap = new Map<MetaFormat, MetaModel[]>();

    for (const processor of this._processors) {
      const model = await processor.execute(DataManager.dataSource, modelMap);
      this._models!.push([model, { name: processor.getName(), label: processor.getName() }])
      const format = processor.getOutputFormat()

      if (!modelMap.has(format)) {
        modelMap.set(format, []);
      }

      modelMap.get(format)!.push(model);
    }

    this._processed = true
    broadcastToWindows(EventType.DataProcessed)
  }
}

export default new MetaBaseManager()
