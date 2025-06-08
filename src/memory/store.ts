import N3, {
    BlankNode, DataFactory,
    NamedNode,
    OTerm,
    Quad,
    Quad_Graph,
    Quad_Object,
    Quad_Predicate,
    Quad_Subject,
    Store,
    Term,
} from 'n3';
import { getScopedLogger, ScopedLogger } from '../logger';
import { Configuration, Processor } from '../processor/processor';
import { getCompactName, isDefaultGraph } from './utils';
import {
    hasObject,
    hasPredicate,
    hasSubject,
    isA,
    prefixToNamespace,
    ProvenanceEntity,
    Statement,
    wasDerivedFrom,
} from './vocabulary';
import defaultGraph = DataFactory.defaultGraph;

const mm = prefixToNamespace['mm'];

const ProvenanceMappingGraph = mm('ProvenanceMappingGraph');
const hasProvenanceGraph = mm('hasProvenanceGraph');
const BaseProvenanceGraph = mm('BaseProvenanceGraph');

export class MetaStore {
    //#region Instance Manager
    private static defaultStore: MetaStore = new MetaStore("DefaultStore");
    private static storeDict: { [identifier: string]: MetaStore } = {};
    public static getStore(identifier?: string): MetaStore {
        if (!identifier)
            return this.defaultStore;

        if (!MetaStore.storeDict[identifier]) {
            MetaStore.storeDict[identifier] = new MetaStore();
        }
        return MetaStore.storeDict[identifier];
    }
    public static getDefaultStore(): MetaStore {
        return this.defaultStore;
    }
    //#endregion

    private id: string;
    private logger: ScopedLogger;
    private static idCounter: number= 0;

    private store: Store<Quad, Quad, Quad, Quad>;

    private constructor(id?: string) {
        this.id = id ?? `Store#${MetaStore.idCounter++}`;
        this.logger = getScopedLogger(`${this.id}`);
        this.store = new N3.Store();
    }

    private provenanceEntityCounter: number = 0;

    /**
     * Get a singular quad matching the query.
     * @throws Error if not exactly one match is found.
     */
    public one(subject?: Quad_Subject | null,
               predicate?: Quad_Predicate | null,
               object?: Quad_Object | null,
               graph?: Quad_Graph | null)
        : Quad {
        const match = this.store.match(subject, predicate, object, graph);

        if (match.size !== 1)
            throw new Error(`Failed to match single statement for 
            S| ${getCompactName(subject)} 
            P| ${getCompactName(predicate)} 
            O| ${getCompactName(object)} 
            G| ${getCompactName(graph)}. 
        Found ${match.size}`);

        return ([...match] as Quad[])[0];
    }

    /**
     * Get a singular quad matching the query, or null if none found.
     * @throws Error if more than one match is found.
     */
    public oneOrNone(subject?: Quad_Subject | null,
                     predicate?: Quad_Predicate | null,
                     object?: Quad_Object | null,
                     graph?: Quad_Graph | null)
        : Quad | null {
        const match = this.store.match(subject, predicate, object, graph);

        if (match.size === 0)
            return null;

        if (match.size > 1)
            throw new Error(`Failed to match single statement for ${subject} ${predicate} ${object} ${graph}. Found ${match.size}`);

        return ([...match] as Quad[])[0];
    }

    /**
     * Get a singular quad matching the query, or null if none or multiple found.
     */
    public oneOrDefault(subject?: Quad_Subject | null,
                        predicate?: Quad_Predicate | null,
                        object?: Quad_Object | null,
                        graph?: Quad_Graph | null)
        : Quad | null {
        const match = this.store.match(subject, predicate, object, graph);

        if (match.size !== 1)
            return null;

        return ([...match] as Quad[])[0];
    }

    /**
     * Get all quads matching the query.
     */
    public all(subject?: Quad_Subject | null,
               predicate?: Quad_Predicate | null,
               object?: Quad_Object | null,
               graph?: Quad_Graph | null)
        : Quad[] {
        return [...this.store.getQuads(subject, predicate, object, graph)];
    }

    public getProvenanced(subject: Quad_Subject,
                          predicate: Quad_Predicate,
                          object: Quad_Object,
                          graph: Quad_Graph)
        : Quad_Subject | null {
        const provenanceGraph = this.getProvenanceGraph(graph);

        const candidatesBySubject = this.store.getSubjects(hasSubject, subject, provenanceGraph);

        for (const statement of candidatesBySubject) {
            const existingPredicates = this.store.countQuads(statement, hasPredicate, null, provenanceGraph);
            const existingObjects = this.store.countQuads(statement, hasObject, null, provenanceGraph);

            if (existingPredicates && existingObjects) {
                return statement;
            }
        }

        return null;
    }

    public add(subject: Quad_Subject,
               predicate: Quad_Predicate,
               object: Quad_Object,
               graph?: Quad_Graph | null,
               origin?: Quad | null,
               author?: Processor<Configuration>,
               details?: [Term, Term][],
    ): void {
        this.logger.debug(`+ QUAD : ${getCompactName(subject)} ${getCompactName(predicate)} ${getCompactName(object)} ${getCompactName(graph) ?? ''}`,
            origin || author || details ? { data: { origin, author, ...details } } : undefined);

        graph ??= defaultGraph();

        this.store.add(new Quad(subject, predicate, object, graph));

        const provenanceGraph = this.getProvenanceGraph(graph);

        const provenanceEntity = new BlankNode('ProvenanceEntity' + this.provenanceEntityCounter++);

        this.store.add(new Quad(provenanceEntity, isA, ProvenanceEntity, provenanceGraph));
        this.store.add(new Quad(provenanceEntity, isA, Statement, provenanceGraph));
        this.store.add(new Quad(provenanceEntity, hasSubject, subject, provenanceGraph));
        this.store.add(new Quad(provenanceEntity, hasPredicate, predicate, provenanceGraph));
        this.store.add(new Quad(provenanceEntity, hasObject, object, provenanceGraph));

        if (origin) {
            const originStatement = this.getProvenanced(origin.subject, origin.predicate, origin.object, origin.graph);
            if (originStatement) {
                this.store.add(new Quad(provenanceEntity, wasDerivedFrom, originStatement, provenanceGraph));
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
                this.store.add(new Quad(provenanceEntity, predicate, object, provenanceGraph));
            }
        }
    }

    private getProvenanceGraph(graph: Quad_Graph | null): Term {
        if (!graph || isDefaultGraph(graph)) {
            return BaseProvenanceGraph;
        }

        let provenanceGraph = this
            .oneOrNone(graph, hasProvenanceGraph, null, ProvenanceMappingGraph)
            ?.object;

        if (!provenanceGraph) {
            provenanceGraph = new NamedNode((graph as NamedNode).id + '/provenance');
            this.store.add(new Quad(graph, hasProvenanceGraph, ProvenanceMappingGraph));
        }

        return provenanceGraph as NamedNode;
    }

    getSubjects(predicate: OTerm, object: OTerm, graph: OTerm) {
        return this.store.getObjects(predicate, object, graph);
    }

    getPredicates(subject: OTerm, object: OTerm, graph: OTerm) {
        return this.store.getObjects(subject, object, graph);
    }

    getObjects(subject: OTerm, predicate: OTerm, graph: OTerm) {
        return this.store.getObjects(subject, predicate, graph);
    }
}
