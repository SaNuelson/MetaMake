import MetaModel from './MetaModel.js'
import Restructurable from './Restructurable.js'

export interface PipelineInfo {
  id: string;
  name: string;
  changedOn: Date;
}

export interface ProcessorConfig {
  name: string,
  config: MetaModel
}

class Pipeline extends Restructurable {
  id: string;
  name: string;
  changedOn: Date;
  processorConfigs: Array<ProcessorConfig>

  constructor(id: string, name: string, changedOn?: Date, processors?: Array<ProcessorConfig>) {
    super()
    this.id = id;
    this.name = name;
    this.changedOn = changedOn ?? new Date();
    this.processorConfigs = processors ?? [];
  }

  info(): PipelineInfo {
    return {
      id: this.id,
      name: this.name,
      changedOn: this.changedOn
    }
  }

  static Empty(): Pipeline {
    return new Pipeline("new", 'New KnowledgeBase', new Date(), [])
  }

}

export default Pipeline;
