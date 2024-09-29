import { Store } from 'n3';

type Data = any;

interface Configuration<T extends Processor> {
    processor?: T;
}

interface Processor {
    configure(config: Configuration<Processor>): void;

    execute(data: Data, store: Store): void;
}