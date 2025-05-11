import { CsvDataSource } from '../data/data-source';
import { MetaStore } from '../memory/store';
import { csvTableSchema, dataSet, description, isA, mm, title } from '../memory/vocabulary';
import { DataFactory as df, NamedNode } from 'n3';
import { ThreadController } from './helper/chatgpt-connector';
import { logger } from '../logger';
import { Configuration, Data, Processor } from './processor';
import { LlmProcessorConfiguration } from './llm-processor';

const llmGraph = mm('llm');

export class LlmMockProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class LlmMockProcessor implements Processor<LlmMockProcessorConfiguration> {
    configure(config: LlmProcessorConfiguration): void {
    }

    execute(data: Data, store: MetaStore): void {

        const dataset = store.oneOrDefault(null, isA, dataSet);

        store.addQuad(dataset, title, df.literal('ChatGPT says title'), llmGraph);
        store.addQuad(dataset, description, df.literal('ChatGPT says description'), llmGraph);
    }
}
