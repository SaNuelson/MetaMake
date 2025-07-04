import { ReadStream } from 'fs';
import jsonld from 'jsonld';
import { JsonLdParser } from 'jsonld-streaming-parser';
import { Quad, Store, Writer } from 'n3';
import fs, { WriteStream } from 'node:fs';
import { getScopedLogger } from '../logger.js';

const logger = getScopedLogger('io.jsonld');

export async function storeJsonld(readStream: ReadStream, store: Store) : Promise<void> {
    const jsonLdParser = new JsonLdParser();
    const jsonStream = readStream.pipe(jsonLdParser);
    jsonStream.on('data', quad => store.addQuad(quad))
    return new Promise((resolve, reject) => {
        jsonStream.on('end', resolve);
        jsonStream.on('error', reject);
    });
}

export async function dumpJsonld(
    writeStream: WriteStream,
    quads: Quad[],
    contextPath: string): Promise<void> {
    const writer = new Writer({format: 'N-Quads'})

    // Strip graph info
    quads = quads.map(q => new Quad(q.subject, q.predicate, q.object));
    writer.addQuads(quads);

    let context: string | object;
    if (!contextPath) {
        context = {};
    }
    else if (contextPath.startsWith('http'))
    {
        context = contextPath;
    }
    else {
        const contextText = fs.readFileSync(contextPath, {encoding: 'utf-8'});
        context = JSON.parse(contextText);
    }

    writer.end((error, result) => {
        if (error) {
            logger.error(error.toString());
            return;
        }
        logger.info(result);
        jsonld.fromRDF(result, {format: 'application/n-quads'})
            .then(doc => jsonld.compact(doc, context as never, {
                skipExpansion: true,
                compactToRelative: true,
            }))
            .then(doc => {
                logger.info(JSON.stringify(doc, null, 2));
                const jsonString = JSON.stringify(doc, null, 2);
                const textEncoder = new TextEncoder();
                const uint8Array = textEncoder.encode(jsonString);
                writeStream.write(uint8Array);
            });
    });
}
