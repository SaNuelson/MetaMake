import { CsvDataSource } from '../data/data-source';
import { MetaStore } from '../memory/store';
import { csvTableSchema, DataSet, dataSet, description, isA, prefixToNamespace, title } from '../memory/vocabulary';
import { BlankNode, DataFactory as df, NamedNode } from 'n3';
import { ThreadController } from './helper/chatgpt-connector';
import { logger } from '../logger';
import { Configuration, Data, Processor } from './processor';
import { LlmProcessorConfiguration } from './llm-processor';
import { SourceManager } from '../data/source-manager';

const mm = prefixToNamespace['mm'];

const llmGraph = mm('llm');

export class LlmMockProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class LlmMockProcessor implements Processor<LlmMockProcessorConfiguration> {
    configure(config: LlmProcessorConfiguration): void {
    }

    execute(data: SourceManager, store: MetaStore, dataset: BlankNode): void {

        store.addQuad(dataset, title, df.literal('ChatGPT says title'), llmGraph);
        store.addQuad(dataset, description, df.literal('ChatGPT says description'), llmGraph);
    }
}
