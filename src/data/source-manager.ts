import { Quad_Subject } from 'n3';
import { getScopedLogger, ScopedLogger } from '../logger.js';
import { MetaStore } from '../memory/store.js';
import { isBlankNode } from '../memory/utils.js';
import { Distribution, hasDistribution, isA, PrimaryDistribution } from '../memory/vocabulary.js';
import { DataSource } from './data-source.js';

export class SourceManager {
    private sources: Map<string, DataSource<unknown>> = new Map();
    private store: MetaStore;
    private dataset: Quad_Subject;
    private logger: ScopedLogger;

    constructor(store: MetaStore, dataset: Quad_Subject) {
        this.logger = getScopedLogger(this.constructor.name);
        this.store = store;
        this.dataset = dataset;
    }

    register(distribution: Quad_Subject, source: DataSource<unknown>, isPrimary: boolean = false): void {
        this.logger.info(`Registering source ${source.sourceKind} ${source.dataKind} for distribution ${distribution.id} (primary: ${isPrimary})`);

        const id = distribution.id;
        this.sources.set(id, source);

        if (!this.store.oneOrDefault(this.dataset, hasDistribution, distribution)) {
            this.store.add(this.dataset, hasDistribution, distribution);
        }

        if (!this.store.oneOrDefault(distribution, isA, Distribution)) {
            this.store.add(distribution, isA, Distribution);
        }

        if (isPrimary) {
            if (!this.store.oneOrDefault(distribution, isA, PrimaryDistribution)) {
                this.store.add(distribution, isA, PrimaryDistribution);
            }
        }
    }

    getPrimarySource(): DataSource<unknown> | null {
        const distributions = this.store.all(this.dataset, hasDistribution, null, null)
            .map(quad => quad.object);

        const primaryDistribution = distributions
            .filter(dist => isBlankNode(dist))
            .find(dist => this.store.oneOrDefault(dist, isA, PrimaryDistribution));

        if (primaryDistribution) {
            return this.sources.get(primaryDistribution.id) ?? null;
        }

        this.logger.error(`No primary distribution found for dataset ${this.dataset.id}.`);
        return null;
    }

    getSource(distribution: Quad_Subject): DataSource<unknown> | null {
        const id = distribution.id;
        return this.sources.get(id) || null;
    }
}
