import { Processor } from '../processing/Processor.js'

export interface PipelineInfo {

}

class Pipeline {

  id: string;

  private processors: Array<Processor>

  constructor(processors?: Processor) {

  }

  info(): PipelineInfo {

  }

  async save() {

  }

  static load(pipeId: string): Pipeline {
  }
}

export default Pipeline;
