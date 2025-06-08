import { isLocalDataSource } from '../data/utils';
import { MetaStore } from '../memory/store';
import { IsLocalDataSource } from '../data/local-data-source';
import { prefixToNamespace } from '../memory/vocabulary';
import * as voc from '../memory/vocabulary';
import { dateTimeLiteral, getCompactName } from '../memory/utils';
import { BlankNode, DataFactory, NamedNode, Quad } from 'n3';
import literal = DataFactory.literal;
import { Configuration, Processor } from './processor';
import { getScopedLogger, ScopedLogger } from '../logger';
import { SourceManager } from '../data/source-manager';

const mm = prefixToNamespace['mm'];

const localFileProcessorGraph = mm('lfp');

export class LocalFileProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;


}

export default class LocalFileProcessor implements Processor<LocalFileProcessorConfiguration> {
    private logger: ScopedLogger;

    constructor() {
        this.logger = getScopedLogger(this.constructor.name);
    }

    configure(config: LocalFileProcessorConfiguration): void {
    }

    execute(data: SourceManager, store: MetaStore, dataset: BlankNode): void {
        this.logger.debug(`execute begin`);

        const source = data.getPrimarySource()

        if (!isLocalDataSource(source))
            return;

        const distribution = new BlankNode('Distribution');

        store.add(dataset, voc.hasDistribution, distribution);

        store.add(distribution, voc.isA, voc.Distribution, localFileProcessorGraph);
        store.add(distribution, voc.isA, voc.file, localFileProcessorGraph);
        store.add(distribution, voc.fileName, literal(source.filename), localFileProcessorGraph);
        store.add(distribution, voc.modified, dateTimeLiteral(source.fileStats.mtime), localFileProcessorGraph);
        store.add(distribution, voc.created, dateTimeLiteral(source.fileStats.birthtime), localFileProcessorGraph);

        this.logger.debug(getCompactName(new Quad(distribution, voc.fileName, literal(source.filename), localFileProcessorGraph)));
        this.logger.debug(getCompactName(new Quad(distribution, voc.modified, dateTimeLiteral(source.fileStats.mtime), localFileProcessorGraph)));
        this.logger.debug(getCompactName(new Quad(distribution, voc.created, dateTimeLiteral(source.fileStats.birthtime), localFileProcessorGraph)));

        this.logger.debug(`execute end.`);
    }
}
