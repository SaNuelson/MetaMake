import { BlankNode, NamedNode } from 'n3';
import { isCsvDataSource } from '../data/utils';
import { Catalogue } from '../dcr/core/Catalogue';
import { getScopedLogger, ScopedLogger } from '../logger';
import { Configuration, Processor } from './processor';
import { MetaStore } from '../memory/store';
import { SourceManager } from '../data/source-manager';
import { CsvMediaType, hasDistribution, mediaType } from '../memory/vocabulary';
import { isBlankNode } from '../memory/utils';

export class DcrProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class DcrProcessor implements Processor<DcrProcessorConfiguration> {
    private logger: ScopedLogger;

    constructor() {
        this.logger = getScopedLogger(this.constructor.name);
    }

    configure(config: DcrProcessorConfiguration): void {
    }

    async execute(data: SourceManager, store: MetaStore, dataset: BlankNode): Promise<void> {
        this.logger.debug(`execute begin`);

        const csvDistributions = store.getObjects(dataset, hasDistribution, null)
            .filter(dist => isBlankNode(dist))
            .filter(dist => store.oneOrDefault(dist, mediaType, CsvMediaType));

        // TODO: What if more?
        const source = csvDistributions
            .map(dist => data.getSource(dist))
            .find(isCsvDataSource);

        if (!source) {
            this.logger.error('No CSV distribution found for dataset');
            return;
        }

        const catalogue = new Catalogue();
        catalogue.setData(await source.readNext(50));

        for (let i = 0; i < catalogue.useTypes.length; i++) {
            const useType = catalogue.useTypes[i];
            const allUseTypes = catalogue.allUseTypes[i];
            this.logger.info(`${useType.type} from ${allUseTypes.map(ut => ut.type)}`);
        }

        this.logger.debug(`execute end.`);
    }

}
