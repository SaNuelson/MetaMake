import { CsvDataSource } from '../data/data-source';
import { MetaStore } from '../memory/store';
import * as voc from '../memory/vocabulary';
import { fileName, mm, title } from '../memory/vocabulary';
import { Configuration, Data, Processor } from './processor';
import { NamedNode } from 'n3';

export const dcatApCzGraph = mm('dcat-ap-cz');

export class DcatApCzExtractorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class DcatApCzExtractor implements Processor<DcatApCzExtractorConfiguration> {
    configure(config: DcatApCzExtractorConfiguration): void {
    }

    execute(data: Data, store: MetaStore): void {

        const dataset = store.oneOrDefault(null, voc.isA, voc.dataSet);

        if (!dataset)
            return;

        const fileNames = store.match(null, voc.fileName, null, null);
        if (fileNames.size > 0) {
            // TODO: Select best

            const fileName = [...fileNames][0].object;
            store.addQuad(dataset, voc.title, fileName, dcatApCzGraph);
        }
    }
}
