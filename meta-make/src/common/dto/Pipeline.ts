import MetaModel from './MetaModel.js'
import Restructurable from './Restructurable.js'
import MetaFormat from './MetaFormat.js'

export interface PipelineInfo {
  id: string;
  name: string;
  changedOn: Date;
  outputFormat?: MetaFormat;
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
  private outputFormat?: MetaFormat

  constructor(id: string, name: string, changedOn?: Date, processors?: Array<ProcessorConfig>, outputFormat?: MetaFormat) {
    super()
    this.id = id;
    this.name = name;
    this.changedOn = changedOn ?? new Date();
    this.processorConfigs = processors ?? [];
    this.outputFormat = outputFormat;
  }

  info(): PipelineInfo {
    return {
      id: this.id,
      name: this.name,
      changedOn: this.changedOn,
      outputFormat: this.outputFormat
    }
  }

  static Empty(): Pipeline {
    return new Pipeline("new", 'New KnowledgeBase', new Date(), [] )
  }

}

export default Pipeline;
