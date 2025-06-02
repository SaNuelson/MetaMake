import N3 = require('n3');
import {
    BlankNode,
    NamedNode,
    Quad, Quad_Graph,
    Quad_Object,
    Quad_Predicate,
    Quad_Subject,
    Term, Util,
} from 'n3';
import * as RDF from '@rdfjs/types';
import { Processor } from '../processor/processor';
import {
    hasObject,
    hasPredicate,
    hasSubject,
    isA,
    prefixToNamespace,
    ProvenanceEntity,
    Statement,
    wasDerivedFrom, wasGeneratedBy,
} from './vocabulary';
import { getCompactName, isDefaultGraph } from './utils';

const mm = prefixToNamespace['mm'];

const ProvenanceMappingGraph = mm('ProvenanceMappingGraph');
const hasProvenanceGraph = mm('hasProvenanceGraph');
const BaseProvenanceGraph = mm('BaseProvenanceGraph');

export class MetaStore extends N3.Store {

    private provenanceEntityCounter: number = 0;

    /**
     * Get a singular quad matching the query.
     * @throws Error if not exactly one match is found.
     */
    public one(subject?: Quad_Subject | null,
               predicate?: Quad_Predicate | null,
               object?: Quad_Object | null,
               graph?: Quad_Graph | null)
        : RDF.Quad {
        const match = this.match(subject, predicate, object, graph);

        if (match.size !== 1)
            throw new Error(`Failed to match single statement for 
            S| ${getCompactName(subject)} 
            P| ${getCompactName(predicate)} 
            O| ${getCompactName(object)} 
            G| ${getCompactName(graph)}. 
        Found ${match.size}`);

        return [...match][0];
    }

    /**
     * Get a singular quad matching the query, or null if none found.
     * @throws Error if more than one match is found.
     */
    public oneOrNone(subject?: Quad_Subject | null,
                     predicate?: Quad_Predicate | null,
                     object?: Quad_Object | null,
                     graph?: Quad_Graph | null)
        : RDF.Quad | null {
        const match = this.match(subject, predicate, object, graph);

        if (match.size === 0)
            return null;

        if (match.size > 1)
            throw new Error(`Failed to match single statement for ${subject} ${predicate} ${object} ${graph}. Found ${match.size}`);

        return [...match][0];
    }

    /**
     * Get a singular quad matching the query, or null if none or multiple found.
     */
    public oneOrDefault(subject?: Quad_Subject | null,
                        predicate?: Quad_Predicate | null,
                        object?: Quad_Object | null,
                        graph?: Quad_Graph | null)
        : RDF.Quad | null {
        const match = this.match(subject, predicate, object, graph);

        if (match.size !== 1)
            return null;

        return [...match][0];
    }

    /**
     * Get all quads matching the query.
     */
    public all(subject?: Quad_Subject | null,
               predicate?: Quad_Predicate | null,
               object?: Quad_Object | null,
               graph?: Quad_Graph | null)
        : RDF.Quad[] {
        return [...this.getQuads(subject, predicate, object, graph)];
    }

    public getProvenanced(subject: Quad_Subject,
                          predicate: Quad_Predicate,
                          object: Quad_Object,
                          graph: Quad_Graph)
        : Quad_Subject | null {
        const provenanceGraph = this.getProvenanceGraph(graph);

        const candidatesBySubject = this.getSubjects(hasSubject, subject, provenanceGraph);

        for (const statement of candidatesBySubject) {
            const existingPredicates = this.countQuads(statement, hasPredicate, null, provenanceGraph);
            const existingObjects = this.countQuads(statement, hasObject, null, provenanceGraph);

            if (existingPredicates && existingObjects) {
                return statement;
            }
        }

        return null;
    }

    public addProvenanced(subject: Quad_Subject,
                          predicate: Quad_Predicate,
                          object: Quad_Object,
                          graph: Quad_Graph | null,
                          origin: Quad | null,
                          author: Processor<any>,
                          details: [Term, Term][],
    ): void {

        this.add(new Quad(subject, predicate, object, graph));

        const provenanceGraph = this.getProvenanceGraph(graph);

        const provenanceEntity = new BlankNode('ProvenanceEntity' + this.provenanceEntityCounter++);

        this.add(new Quad(provenanceEntity, isA, ProvenanceEntity, provenanceGraph));
        this.add(new Quad(provenanceEntity, isA, Statement, provenanceGraph));
        this.add(new Quad(provenanceEntity, hasSubject, subject, provenanceGraph));
        this.add(new Quad(provenanceEntity, hasPredicate, object, provenanceGraph));
        this.add(new Quad(provenanceEntity, hasObject, object, provenanceGraph));

        if (origin) {
            const originStatement = this.getProvenanced(origin.subject, origin.predicate, origin.object, origin.graph);
            if (originStatement) {
                this.add(new Quad(provenanceEntity, wasDerivedFrom, originStatement, provenanceGraph));
            }
        }

        if (author) {
            // TODO: Add processor names
            // TODO: Ideally, add processors as prov:Activity (during execution etc.)
            // this.add(new Quad(provenanceEntity, wasGeneratedBy, author));
        }

        if (details) {
            for (const detail of details) {
                const [predicate, object] = detail;
                this.add(new Quad(provenanceEntity, predicate, object, provenanceGraph));
            }
        }
    }

    private getProvenanceGraph(graph: Quad_Graph | null): Term {
        if (!graph || isDefaultGraph(graph)) {
            return BaseProvenanceGraph;
        }

        let provenanceGraph = this
            .oneOrNone(graph, hasProvenanceGraph, null, ProvenanceMappingGraph)
            .object;

        if (!provenanceGraph) {
            provenanceGraph = new NamedNode((graph as NamedNode).id + '/provenance');
            this.add(new Quad(graph, hasProvenanceGraph, ProvenanceMappingGraph));
        }

        return provenanceGraph as NamedNode;
    }
}

const store: MetaStore = new MetaStore();
export default store;

const storeDict: { [identifier: string]: MetaStore } = {};

export function getStore(identifier: string): MetaStore {
    if (!storeDict[identifier]) {
        storeDict[identifier] = new MetaStore();
    }
    return storeDict[identifier];
}
