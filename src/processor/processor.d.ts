import { BlankNode, NamedNode } from 'n3';
import { DataSource } from '../data/data-source';
import { MetaStore } from '../memory/store';
import { SourceManager } from '../data/source-manager';

type Data = DataSource<any>;


interface Configuration {
    metaInput: Array<NamedNode>;
}

interface Processor<C extends Configuration> {
    configure(config: C): void;

    execute(data: SourceManager, store: MetaStore, dataset: BlankNode): void;
}
