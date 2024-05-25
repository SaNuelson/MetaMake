import { Processor, ProcessorInfo } from '../processing/Processor.js'
import ChatGPTProcessor from '../processing/ChatGPTProcessor.js'
import JSONSchemaProcessor from '../processing/JSONSchemaProcessor.js'

class ProcessorManager {
  private processors: {[name: string]: Processor} = {
    ChatGPTProcessor: ChatGPTProcessor,
    JSONSchemaProcessor: JSONSchemaProcessor,
  }

  public getProcessorList(): ProcessorInfo[] {
    return Object.values(this.processors)
      .map(proc => ({
        name: proc.getName(),
        description: proc.getDescription(),
        configFormat: proc.getConfigFormat()
      }));
  }

  getProcessor(id: string): Processor | undefined {
    return this.processors[id];
  }
}

export default new ProcessorManager();
