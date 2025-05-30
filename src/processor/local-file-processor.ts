import { CsvDataSource } from '../data/data-source';
import { MetaStore } from '../memory/store';
import { IsLocalDataSource } from '../data/local-data-source';
import { dataSet, isA, mm } from '../memory/vocabulary';
import * as voc from '../memory/vocabulary';
import { dateTimeLiteral } from '../memory/utils';
import { DataFactory, NamedNode } from 'n3';
import literal = DataFactory.literal;
import { Configuration, Data, Processor } from './processor';
import { LocalCsvDataSource } from '../data/local-csv-data-source';

const localFileProcessorGraph = mm('lfp');

export class LocalFileProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;


}

export default class LocalFileProcessor implements Processor<LocalFileProcessorConfiguration> {

    configure(config: LocalFileProcessorConfiguration): void {
    }

    execute(data: Data, store: MetaStore): void {

        if (!IsLocalDataSource(data))
            return;

        const dataset = store.oneOrDefault(null, isA, dataSet);

        if (!dataset)
            return;

        const distribution = mm('distribution');

        store.addQuad(dataset, voc.hasDistribution, distribution);

        store.addQuad(distribution, voc.isA, voc.Distribution, localFileProcessorGraph);
        store.addQuad(distribution, voc.isA, voc.file, localFileProcessorGraph);
        store.addQuad(distribution, voc.fileName, literal(data.filename), localFileProcessorGraph);
        store.addQuad(distribution, voc.modified, dateTimeLiteral(data.fileStats.mtime), localFileProcessorGraph);
        store.addQuad(distribution, voc.created, dateTimeLiteral(data.fileStats.birthtime), localFileProcessorGraph);

    }

}
