import { Quad, Store, DataFactory as df, NamedNode, DataFactory, Writer } from 'n3';
import Papa from 'papaparse';
import fs from 'node:fs';
import * as voc from './memory/vocabulary';
import literal = DataFactory.literal;
import store from './memory/store';
import path from 'node:path';
import { Catalogue } from './dcr/core/Catalogue';
import { logger } from './logger';
import { dateTimeLiteral } from './memory/utils';
import { dateTimeType, description, title } from './memory/vocabulary';
import { ThreadController } from './processor/helper/chatgpt-connector';
import jsonld from 'jsonld';

const dcatApCzGraph = df.namedNode('http://metamake.com/dcat-ap-cz');

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

function localFileProcessor(filePath: string, store: Store, root: NamedNode) {
    const fileName = path.basename(filePath);

    const stats = fs.statSync(filePath);

    store.addQuad(
        root,
        voc.isA,
        voc.file,
    );
    store.addQuad(
        root,
        voc.fileName,
        literal(fileName),
    );
    store.addQuad(
        root,
        voc.modified,
        dateTimeLiteral(stats.mtime),
    );
    store.addQuad(
        root,
        voc.created,
        dateTimeLiteral(stats.birthtime),
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

function dcatApCzExtractor(data: Papa.ParseResult<any>, store: Store, root: NamedNode) {
    // find title
    const titles = [...store.match(null, title, null, null)]
        .map(title => title.object);
    if (titles.length > 0) {
        store.addQuad(root, title, titles[0], dcatApCzGraph);
    }
}

function jsonldExporter(data: Papa.ParseResult<any>, store: Store, root: NamedNode) {
    const writer = new Writer({format: 'N-Triples'})
    store.forEach(quad => writer.addQuad(quad), null, null, null, null)
    const contextText = fs.readFileSync('resources/context/rozhraní-katalogů-otevřených-dat.jsonld', {encoding: 'utf-8'});
    const contextJson = JSON.parse(contextText);
    writer.end((error, result) => {
        jsonld.fromRDF(result, {format: 'application/n-quads'})
            .then(doc => jsonld.compact(doc, contextJson, {
                skipExpansion: true,
                compactToRelative: true
            }))
            .then(doc => logger.info(doc))
    })
}

async function main() {

    const filePath = 'resources/input/address_points.csv';

    const store: Store<Quad, Quad, Quad, Quad> = new Store();

    const data = await readCsvFile(filePath);
    data.data.slice(0, 5)
        .forEach(row => console.log(Object.values(row).join(', ')));
    const root = voc.resource;
    store.addQuad(
        root,
        voc.isA,
        voc.resource,
    );

    localFileProcessor(filePath, store, root);

    dcrProcessor(data, store, root);

    await llmProcessor(data, store, root);

    dcatApCzExtractor(data, store, root)

    jsonldExporter(data, store, root);
}


console.log('Start');
main()
    .then(() => console.log('Done'));
