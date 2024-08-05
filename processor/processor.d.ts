import { Store } from 'n3';

interface Processor {
    run(data store: Store)
}