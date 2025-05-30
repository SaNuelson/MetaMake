import * as voc from './memory/vocabulary';
import { MetaStore } from './memory/store';
import { DataSet, dataSet, isA } from './memory/vocabulary';
import LocalFileProcessor from './processor/local-file-processor';
import DcrProcessor from './processor/dcr-processor';
import LlmMockProcessor from './processor/llm-mock-processor';
import DcatApCzExtractor, { dcatApCzGraph } from './processor/dcat-ap-cz-extractor';
import { dumpJsonld } from './io/jsonld';
import fs from 'node:fs';
import { LocalCsvDataSource } from './data/local-csv-data-source';
import { BlankNode, Quad } from 'n3';

async function main() {

    const filePath = 'resources/input/address_points.csv';

    const store: MetaStore = new MetaStore();

    const dataSource = await LocalCsvDataSource.create(filePath);

    const root = new BlankNode('Dataset');
    store.addQuad(root, isA, voc.DataSet);

    const localFileProcessor = new LocalFileProcessor();
    localFileProcessor.execute(dataSource, store);

    const dcrProcessor = new DcrProcessor();
    await dcrProcessor.execute(dataSource, store);

    const llmProcessor = new LlmMockProcessor();
    llmProcessor.execute(dataSource, store);

    const dcatApCzExtractor = new DcatApCzExtractor();
    dcatApCzExtractor.execute(dataSource, store);

    const output = fs.createWriteStream('out/address_points.jsonld');
    const outQuads = store
        .getQuads(null, null, null, dcatApCzGraph)
        .map(quad => new Quad(quad.subject, quad.predicate, quad.object));
    const contextPath = 'resources/context/rozhraní-katalogů-otevřených-dat.jsonld';
    await dumpJsonld(output, outQuads, contextPath);
}

main()
    .then(() => console.log('Done'));
