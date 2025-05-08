import { Quad, Store, DataFactory as df, NamedNode, DataFactory, Writer } from 'n3';
import Papa from 'papaparse';
import fs, { writeFileSync } from 'node:fs';
import * as voc from './memory/vocabulary';
import literal = DataFactory.literal;
import store from './memory/store';
import path from 'node:path';
import { Catalogue } from './dcr/core/Catalogue';
import { logger } from './logger';
import { dateTimeLiteral } from './memory/utils';
import { dataSet, dateTimeType, description, isA, mmPrefix, title } from './memory/vocabulary';
import { ThreadController } from './processor/helper/chatgpt-connector';
import jsonld from 'jsonld';
import { IsLocalDataSource, LocalCsvDataSource } from './data/local-data-source';
import { CsvDataSource, DataSource } from './data/data-source';

const dcatApCzGraph = mmPrefix('dcat-ap-cz');

function readCsvFile(filePath: string): Promise<Papa.ParseResult<unknown>> {
    return new Promise((resolve, reject) => {
        const csvFile = fs.createReadStream(filePath);

        Papa.parse(csvFile, {
            header: false,
            complete: (results) => {
                resolve(results);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
}

function localFileProcessor(source: CsvDataSource, store: Store, root: NamedNode) {

    if (!IsLocalDataSource(source))
        return

    const localSource = source as LocalCsvDataSource;

    store.addQuad(
        root,
        voc.isA,
        voc.file,
    );
    store.addQuad(
        root,
        voc.fileName,
        literal(localSource.filename),
    );
    store.addQuad(
        root,
        voc.modified,
        dateTimeLiteral(source.fileStats.mtime),
    );
    store.addQuad(
        root,
        voc.created,
        dateTimeLiteral(source.fileStats.birthtime),
    );
}

async function llmProcessor(data: Papa.ParseResult<any>, store: Store, root: NamedNode) {

    store.addQuad(
        root,
        title,
        df.literal('ChatGPT says title')
    );

    store.addQuad(
        root,
        description,
        df.literal('ChatGPT says description')
    );

    return;
    // TODO

    const header = data.meta.fields;
    const dataPreview = data.data.slice(0, 5).map(x => Object.values(x));

    const thread = await ThreadController.Create();
    thread.addMessage(`Zde je malá ukázka - prvních 20 řádků z většího datasetu:
\`\`\`
${header}
${dataPreview.join('\n')}
\`\`\`
Na následující otázky odpovídej ve formátu:
{
    value: "Tvůj tip tady" (nebo null pokud podle tebe nelze obpovědět),
    confidence: "Jak jistý jsi si svým tipem v rozmezí 0.0 do 1.0"
    process: "Proč si myslíš, že je tvá odpověď správná."
}
  `);

    const propertiesToAsk = [
        title,
        description
    ]

    for(const property of propertiesToAsk) {
        await thread.addMessage(`Jakou hodnotu by jsi vyplnil pro metadata ${property.value}? Odpověz v JSON ve formátu zmíněným výše.`);

        const response = await thread.getResponse();

        try {
            const guess: {
                value: string
                confidence: number
            } = JSON.parse(response)
            store.addQuad(
                root,
                property,
                df.literal(guess.value)
            )
        } catch (e) {
            logger.error(e)
        }
    }
}

function dcrProcessor(data: Papa.ParseResult<any>, store: Store, root: NamedNode) {
    const catalogue = new Catalogue();
    catalogue.setData(data);

    for (let i = 0; i < catalogue.useTypes.length; i++) {
        const useType = catalogue.useTypes[i];
        const allUseTypes = catalogue.allUseTypes[i];
        logger.info(useType.type, 'from', allUseTypes.map(ut => ut.type));
    }
}

function dcatApCzExtractor(source: CsvDataSource, store: Store, root: NamedNode) {
    // find title
    const fileName = [...store.match(root, voc.fileName, null, null)][0];
    if (fileName) {
        store.addQuad(root, voc.title, fileName.object, dcatApCzGraph);
    }

    return;
    const titles = [...store.match(null, title, null, null)]
        .map(title => title.object);
    if (titles.length > 0) {
        store.addQuad(root, title, titles[0], dcatApCzGraph);
    }
}

function jsonldExporter(source: CsvDataSource, store: Store, root: NamedNode) {
    const writer = new Writer({format: 'N-Quads'})
    store.forEach(quad => {
        logger.info(`Write quad ${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`)
        writer.addQuad(new Quad(quad.subject, quad.predicate, quad.object, null));
    }, null, null, null, dcatApCzGraph)
    const contextText = fs.readFileSync('resources/context/rozhraní-katalogů-otevřených-dat.jsonld', {encoding: 'utf-8'});
    const contextJson = JSON.parse(contextText);
    writer.end((error, result) => {
        logger.info(result);
        jsonld.fromRDF(result, {format: 'application/n-quads'})
            .then(doc => jsonld.compact(doc, contextJson, {
                skipExpansion: true,
                compactToRelative: true
            }))
            .then(doc => {
                logger.info(JSON.stringify(doc, null, 2))
                writeFileSync("out.txt", JSON.stringify(doc, null, 2))
            });
    })
}

async function main() {

    const filePath = 'resources/input/address_points.csv';


    const store: Store<Quad, Quad, Quad, Quad> = new Store();

    const reader = new LocalCsvDataSource(filePath);

    const root = dataSet;
    store.addQuad(root, isA, voc.dataSet);

    localFileProcessor(reader, store, root);

    //dcrProcessor(reader, store, root);

    //await llmProcessor(reader, store, root);

    dcatApCzExtractor(reader, store, root)

    jsonldExporter(reader, store, root);
}

main()
    .then(() => console.log('Done'));
