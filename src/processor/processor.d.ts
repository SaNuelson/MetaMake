import { BlankNode, NamedNode } from 'n3';
import { MetaStore } from '../memory/store';
import { SourceManager } from '../data/source-manager';

interface Configuration {
    metaInput: Array<NamedNode>;
}

interface Processor<C extends Configuration> {
    configure(config: C): void;

    execute(data: SourceManager, store: MetaStore, dataset: BlankNode): void;
}
