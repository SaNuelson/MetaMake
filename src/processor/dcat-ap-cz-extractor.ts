import { MetaStore } from '../memory/store';
import * as voc from '../memory/vocabulary';
import { Configuration, Processor } from './processor';
import { BlankNode, NamedNode } from 'n3';
import { SourceManager } from '../data/source-manager';

const mm = voc.prefixToNamespace['mm'];

export const dcatApCzGraph = mm('dcat-ap-cz');

export class DcatApCzExtractorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class DcatApCzExtractor implements Processor<DcatApCzExtractorConfiguration> {
    configure(config: DcatApCzExtractorConfiguration): void {
    }

    execute(data: SourceManager, store: MetaStore, dataset: BlankNode): void {

        const fileNames = store.all(null, voc.fileName, null, null);
        if (fileNames.length > 0) {
            // TODO: Select best

            const fileName = [...fileNames][0].object;
            store.add(dataset, voc.title, fileName, dcatApCzGraph);
        }
    }
}
