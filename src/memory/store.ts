import N3 = require('n3');
import { Quad, Store, Term } from 'n3';
import * as RDF from '@rdfjs/types';
import * as voc from './vocabulary';

export class MetaStore extends N3.Store {

    /**
     * Get a singular quad matching the query.
     * @throws Error if not exactly one match is found.
     */
    public one(subject?: Term | null,
               predicate?: Term | null,
               object?: Term | null,
               graph?: Term | null,)
        : RDF.Quad
    {
        const match = store.match(subject, predicate, object, graph);

        if (match.size !== 1)
            throw new Error(`Failed to match single statement for ${subject} ${predicate} ${object} ${graph}. Found ${match.size}`);

        return [...match][0];
    }

    /**
     * Get a singular quad matching the query, or null if none found.
     * @throws Error if more than one match is found.
     */
    public oneOrNone(subject?: Term | null,
                     predicate?: Term | null,
                     object?: Term | null,
                     graph?: Term | null,)
        : RDF.Quad | null
    {
        const match = store.match(subject, predicate, object, graph);

        if (match.size === 0)
            return null;

        if (match.size > 1)
            throw new Error(`Failed to match single statement for ${subject} ${predicate} ${object} ${graph}. Found ${match.size}`);

        return [...match][0];
    }

    /**
     * Get a singular quad matching the query, or null if none or multiple found.
     */
    public oneOrDefault(subject?: Term | null,
                     predicate?: Term | null,
                     object?: Term | null,
                     graph?: Term | null,)
        : RDF.Quad | null
    {
        const match = store.match(subject, predicate, object, graph);

        if (match.size !== 1)
            return null;

        return [...match][0];
    }
}

const store: MetaStore = new MetaStore()
export default store;

const storeDict: {[identifier: string]: MetaStore} = {};
export function getStore(identifier: string): MetaStore {
    if (!storeDict[identifier]) {
        storeDict[identifier] = new MetaStore();
    }
    return storeDict[identifier];
}
