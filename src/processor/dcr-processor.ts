import { CsvDataSource } from '../data/data-source';
import { BlankNode, NamedNode, Store } from 'n3';
import { Catalogue } from '../dcr/core/Catalogue';
import { logger } from '../logger';
import { Configuration, Data, Processor } from './processor';
import { MetaStore } from '../memory/store';

export class DcrProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class DcrProcessor implements Processor<DcrProcessorConfiguration> {
    configure(config: DcrProcessorConfiguration): void {
    }

    async execute(data: Data, store: MetaStore, dataset: BlankNode): Promise<void> {
        logger.debug(`DcrProcessor.execute() begin`);

        const catalogue = new Catalogue();
        catalogue.setData(await data.readNext(50));

        for (let i = 0; i < catalogue.useTypes.length; i++) {
            const useType = catalogue.useTypes[i];
            const allUseTypes = catalogue.allUseTypes[i];
            logger.info(useType.type, 'from', allUseTypes.map(ut => ut.type));
        }

        logger.debug(`DcrProcessor.execute() end.`);
    }

}
