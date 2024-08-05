import { Quad, Store, DataFactory as df, NamedNode, DataFactory } from 'n3';
import Papa from 'papaparse';
import fs from 'node:fs';
import { Catalogue } from './dcr/core/Main.js';
import * as voc from './memory/constants';
import literal = DataFactory.literal;
import store from './memory/store';
import path from 'node:path';

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

function localFileProcessor(fileName: string, store: Store, root: NamedNode) {
    store.addQuad(
        root,
        voc.isA,
        voc.file
    );
    store.addQuad(
        root,
        voc.fileName,
        literal(fileName)
    );
}

function dcrProcessor(data: Papa.ParseResult<any>, store: Store, root: NamedNode) {
    const catalogue = new Catalogue();
    catalogue.setData(data);

    for (const useType of catalogue.usetypes) {
    }
}

async function main() {

    const filePath = 'resources\\input\\opendata-smlouvy-mc-praha-12-2023.csv';
    const fileName = path.basename(filePath);

    const store: Store<Quad, Quad, Quad, Quad> = new Store();

    const data = await readCsvFile(filePath);
    data.data.slice(0,5)
        .forEach(row => console.log(Object.values(row).join(", ")))
    const root = voc.resource;
    store.addQuad(
        root,
        voc.isA,
        voc.resource
    )

    localFileProcessor(fileName, store, root);

    const catalogue = new Catalogue();
    catalogue.setData(data);

    console.log(catalogue.usetypes);


}


console.log('Start');
main()
    .then(() => console.log('Done'));