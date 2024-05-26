import { Processor, ProcessorInfo } from '../processing/Processor.js'
import { ChatGPTDcatApCzProcessor } from '../processing/ChatGPTProcessor.js'
import JSONSchemaProcessor from '../processing/JSONSchemaProcessor.js'

class ProcessorManager {
  private processors: {[name: string]: Processor} = {
    ChatGPTDcatApCzProcessor: ChatGPTDcatApCzProcessor,
    JSONSchemaProcessor: JSONSchemaProcessor,
  }

  public getProcessorList(): ProcessorInfo[] {
    return Object.values(this.processors)
      .map(proc => ({
        name: proc.getName(),
        description: proc.getDescription(),
        inputFormatNames: proc.getInputFormats().map(f => f.name),
        configFormat: proc.getConfigFormat(),
        outputFormatName: proc.getOutputFormat().name
      }));
  }

  getProcessor(id: string): Processor | undefined {
    return this.processors[id];
  }
}

export default new ProcessorManager();
