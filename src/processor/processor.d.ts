import { BlankNode, NamedNode } from 'n3';
import { SourceManager } from '../data/source-manager';
import { MetaStore } from '../memory/store';

interface Configuration {
    metaInput: Array<NamedNode>;
}

interface Processor<C extends Configuration> {
    configure(config: C): void;

    execute(data: SourceManager, store: MetaStore, dataset: BlankNode): void;
}
