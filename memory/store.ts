import N3 = require('n3');
import { Quad, Store } from 'n3';

type QuadStore = Store<Quad, Quad, Quad, Quad>;

const store: QuadStore = new N3.Store()
export default store;

const storeDict: {[identifier: string]: QuadStore} = {};

export function getStore(identifier: string): QuadStore {
    if (!storeDict[identifier]) {
        storeDict[identifier] = new N3.Store();
    }
    return storeDict[identifier];
}