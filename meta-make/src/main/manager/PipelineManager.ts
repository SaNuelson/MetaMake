import Pipeline, { PipelineInfo } from '../../common/dto/Pipeline.js'
import MetaStore from '../data/MetaStore.js'
import { Config, LogLevel } from '../../common/constants.js'
import { readdirSync } from 'node:fs'
import { existsSync, mkdirSync } from 'fs'
import PipelineModel from '../dto/PipelineModel.js'
import { ChatGPTDcatApCzProcessor } from '../processing/ChatGPTProcessor.js'
import MetaModel from '../../common/dto/MetaModel.js'


// TODO: Remove
const dcatApCzPipelineId = crypto.randomUUID()
const dcatApCzPipeline = new Pipeline(dcatApCzPipelineId, "DcatApCz with ChatGPT in CZ", new Date(), [
  {
    name: ChatGPTDcatApCzProcessor.getName(),
    config: new MetaModel(ChatGPTDcatApCzProcessor.getConfigFormat())
  }
])
dcatApCzPipeline.processorConfigs[0].config.setValue(".language", "cs")
dcatApCzPipeline.processorConfigs[0].config.setValue(".confidence", 0.25)

class PipelineManager {
  private pipelines: {[id: string]: Pipeline} = { [dcatApCzPipelineId]: dcatApCzPipeline }
  private arePipelinesLoaded: boolean = false;

  getPipelineList(): PipelineInfo[] {
    if (!this.arePipelinesLoaded) {
      if (MetaStore.logLevel >= LogLevel.Warning)
        console.warn("Pipelines accessed before loading.");
      return [];
    }

    return Object.values(this.pipelines).map(pipe => pipe.info());
  }

  getPipeline(id: string): Pipeline | undefined {
    if (!this.arePipelinesLoaded) {
      if (MetaStore.logLevel >= LogLevel.Warning)
        console.warn("Pipelines accessed before loading.");
      return undefined;
    }

    return this.pipelines[id];
  }

  async setPipeline(pipeline: Pipeline): Promise<string> {
    if (this.pipelines[pipeline.id]) {
      await this.updatePipeline(pipeline);
    }
    else {
      await this.createPipeline(pipeline);
    }

    return pipeline.id;
  }

  private async updatePipeline(pipeline: Pipeline) {
    const knownPipeline = this.pipelines[pipeline.id];
    if (!knownPipeline)
      throw new Error(`Pipeline not found: ${pipeline.id}`);
    Object.assign(knownPipeline, pipeline);
    await knownPipeline.save();
  }

  private async createPipeline(pipeline: Pipeline) {
    const newPipe = new PipelineModel(pipeline.id, pipeline.name, pipeline.changedOn, pipeline.processorConfigs)
    this.pipelines[pipeline.id] = newPipe;
    await newPipe.save();
  }

  deletePipeline(pipeId: string) {
    if (!this.arePipelinesLoaded) {
      if (MetaStore.logLevel >= LogLevel.Warning)
        console.warn("Pipelines accessed before loading.");
      return;
    }

    if (!this.pipelines[pipeId]) {
      if (MetaStore.logLevel >= LogLevel.Error)
        console.error(`Trying to delete non-existent Pipeline ${pipeId}.`);
    }

    delete this.pipelines[pipeId];
  }

  private async loadPipelines() {
    const pipelineIds = readdirSync(MetaStore.get(Config.pipePath), {withFileTypes: true})
      .filter(item => !item.isDirectory() && item.name.toLowerCase().endsWith(".json"))
      .map(item => item.name.slice(0, item.name.length - ".json".length));

    const loadedPipes = await Promise.allSettled(
      pipelineIds.map((pipeId) => PipelineModel.load(pipeId)));

    for (let i = 0; i < loadedPipes.length; i++){
      const pipeId = pipelineIds[i];
      const pipeLoad = loadedPipes[i]
      if (pipeLoad.status === 'rejected') {
        if (MetaStore.logLevel >= LogLevel.Warning)
          console.warn(`Failed to parse potential pipeline '${pipeId}'`);
      }
      else {
        if (MetaStore.logLevel >= LogLevel.Verbose)
          console.log(`Successfully parsed potential knowledge base '${pipeId}'`);
        this.pipelines[pipeId] = pipeLoad.value;
      }
    }

    this.arePipelinesLoaded = true;
  }

  private isInit: boolean = false;
  public async init() {
    if (this.isInit)
      return;
    this.isInit = true;

    const pipePath = MetaStore.get(Config.pipePath);
    if (!existsSync(pipePath))
      mkdirSync(pipePath)

    await this.loadPipelines()
  }
}

export default new PipelineManager();
