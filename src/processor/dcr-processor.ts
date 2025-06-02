import { BlankNode, NamedNode } from 'n3';
import { isCsvDataSource } from '../data/utils';
import { Catalogue } from '../dcr/core/Catalogue';
import { logger } from '../logger';
import { Configuration, Processor } from './processor';
import { MetaStore } from '../memory/store';
import { SourceManager } from '../data/source-manager';
import { CsvMediaType, hasDistribution, mediaType } from '../memory/vocabulary';
import { isBlankNode } from '../memory/utils';

export class DcrProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class DcrProcessor implements Processor<DcrProcessorConfiguration> {
    configure(config: DcrProcessorConfiguration): void {
    }

    async execute(data: SourceManager, store: MetaStore, dataset: BlankNode): Promise<void> {
        logger.debug(`DcrProcessor.execute() begin`);

        const csvDistributions = store.getObjects(dataset, hasDistribution, null)
            .filter(dist => isBlankNode(dist))
            .filter(dist => store.oneOrDefault(dist, mediaType, CsvMediaType));

        // TODO: What if more?
        const source = csvDistributions
            .map(dist => data.getSource(dist))
            .find(isCsvDataSource);

        if (!source) {
            logger.error('No CSV distribution found for dataset');
            return;
        }

        const catalogue = new Catalogue();
        catalogue.setData(await source.readNext(50));

        for (let i = 0; i < catalogue.useTypes.length; i++) {
            const useType = catalogue.useTypes[i];
            const allUseTypes = catalogue.allUseTypes[i];
            logger.info(useType.type, 'from', allUseTypes.map(ut => ut.type));
        }

        logger.debug(`DcrProcessor.execute() end.`);
    }

}
