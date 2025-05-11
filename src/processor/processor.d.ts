import { NamedNode, Store } from 'n3';
import { DataSource } from '../data/data-source';
import { MetaStore } from '../memory/store';

type Data = DataSource<any>;



interface Configuration {
    metaInput: Array<NamedNode>
}

interface Processor<C extends Configuration> {
    configure(config: C): void;

    execute(data: Data, store: MetaStore): void;
}
