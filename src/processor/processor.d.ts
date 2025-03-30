import { NamedNode, Store } from 'n3';
import { DataSource } from '../data/data-source';

type Data = DataSource<any>;



interface Configuration {
    metaInput: Array<NamedNode>
}

interface Processor<C extends Configuration> {
    configure(config: C): void;

    execute(data: Data, store: Store): void;
}