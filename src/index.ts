import { BlankNode, Quad } from 'n3';
import fs from 'node:fs';
import { LocalCsvDataSource } from './data/local-csv-data-source.js';
import { SourceManager } from './data/source-manager.js';
import { dumpJsonld } from './io/jsonld.js';
import logger from './logger.js';
import { MetaStore } from './memory/store.js';
import * as voc from './memory/vocabulary.js';
import { isA } from './memory/vocabulary.js';
import DcrProcessor from './processor/dcr-processor.js';
import LlmMockProcessor from './processor/llm-mock-processor.js';
import LocalFileProcessor from './processor/local-file-processor.js';
import MetadataExtractor, { dcatApCzGraph } from './processor/metadata-extractor.js';

async function main() {

    const filePath = 'resources/input/address_points.csv';

    const store: MetaStore = MetaStore.getDefaultStore();

    const dataSource = await LocalCsvDataSource.create(filePath);

    // Create the dataset node that will be the subject of all metadata
    const dataset = new BlankNode('Dataset');
    store.add(dataset, isA, voc.DataSet);

    const sourceManager = new SourceManager(store, dataset);
    sourceManager.register(new BlankNode('Distribution'), dataSource, true);

    const localFileProcessor = new LocalFileProcessor();
    localFileProcessor.execute(sourceManager, store, dataset);

    const dcrProcessor = new DcrProcessor();
    await dcrProcessor.execute(sourceManager, store, dataset);

    const llmProcessor = new LlmMockProcessor();
    llmProcessor.execute(sourceManager, store, dataset);

    const dcatApCzExtractor = new MetadataExtractor();
    dcatApCzExtractor.execute(sourceManager, store, dataset);

    const output = fs.createWriteStream('out/address_points.jsonld');
    const outQuads = store
        .all(null, null, null, dcatApCzGraph)
        .map(quad => new Quad(quad.subject, quad.predicate, quad.object));

    logger.info('Out quads:', {count: outQuads.length});

    // const contextPath = 'resources/context/rozhraní-katalogů-otevřených-dat.jsonld';
    const contextPath = 'https://ofn.gov.cz/dcat-ap-cz-rozhraní-katalogů-otevřených-dat/2024-05-28/kontexty/rozhraní-katalogů-otevřených-dat.jsonld';
    await dumpJsonld(output, outQuads, contextPath);

    const debugOutput = fs.createWriteStream('out/address_points_debug.jsonld');
    const allQuads = store.all();

    logger.info('All quads:', {count: allQuads.length});

    await dumpJsonld(debugOutput, allQuads, null);
}

await main();
