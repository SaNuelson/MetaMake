import { Quad_Subject } from 'n3';
import { DataSource } from './data-source';
import store, { MetaStore } from '../memory/store';
import { Distribution, hasDistribution, isA, PrimaryDistribution } from '../memory/vocabulary';

export class SourceManager {
    private sources: Map<string, DataSource<any>> = new Map();
    private store: MetaStore;
    private dataset: Quad_Subject;

    constructor(store: MetaStore, dataset: Quad_Subject) {
        this.store = store;
        this.dataset = dataset;
    }

    register(distribution: Quad_Subject, source: DataSource<any>): void {
        const id = distribution.id;
        this.sources.set(id, source);

        if (!this.store.oneOrDefault(this.dataset, hasDistribution, distribution)) {
            this.store.addQuad(this.dataset, hasDistribution, distribution);
        }

        if (!this.store.oneOrDefault(distribution, isA, Distribution)) {
            this.store.addQuad(distribution, isA, Distribution);
        }
    }

    getPrimarySource(): DataSource<any> | null {
        const distributions = this.store.all(this.dataset, hasDistribution, null, null)
            .map(quad => quad.object);

        const primaryDistribution = distributions
            .find(dist => store.one(dist, isA, PrimaryDistribution));

        return primaryDistribution ? primaryDistribution : null;
    }

    getSource(distribution: Quad_Subject): DataSource<any> | null {
        const id = distribution.id;
        return this.sources.get(id) || null;
    }
}
