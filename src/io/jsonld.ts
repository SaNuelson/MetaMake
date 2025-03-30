import { Store, Writer } from 'n3';
import { ReadStream } from 'fs';
import { JsonLdParser } from 'jsonld-streaming-parser';
import fs from 'node:fs';
import jsonld from 'jsonld';
import { logger } from '../logger';


async function storeJsonld(readStream: ReadStream, store: Store): Promise<void> {
    const jsonLdParser = new JsonLdParser();
    const jsonStream = readStream.pipe(jsonLdParser);
    jsonStream.on('data', quad => store.addQuad(quad))
    return new Promise((resolve, reject) => {
        jsonStream.on('end', resolve);
        jsonStream.on('error', reject);
    });
}

async function dumpJsonld(writeStream: WritableStream, store: Store): Promise<void> {
    const writer = new Writer({format: 'N-Quads'})
    store.forEach(quad => writer.addQuad(quad), null, null, null, null)
    const contextText = fs.readFileSync('resources/context/rozhraní-katalogů-otevřených-dat.jsonld', {encoding: 'utf-8'});
    const contextJson = JSON.parse(contextText);
    writer.end((error, result) => {
        jsonld.fromRDF(result, {format: 'application/n-quads'})
            .then(doc => jsonld.compact(doc, contextJson))
            .then(doc => logger.info(doc))
    })
}