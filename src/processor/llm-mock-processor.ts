import { MetaStore } from '../memory/store';
import { description, prefixToNamespace, title } from '../memory/vocabulary';
import { BlankNode, DataFactory as df, NamedNode } from 'n3';
import { Configuration, Processor } from './processor';
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

        store.add(dataset, title, df.literal('ChatGPT says title'), llmGraph);
        store.add(dataset, description, df.literal('ChatGPT says description'), llmGraph);
    }
}
