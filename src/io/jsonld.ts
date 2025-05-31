import { NamedNode, Quad, Store, Writer } from 'n3';
import { ReadStream } from 'fs';
import { JsonLdParser } from 'jsonld-streaming-parser';
import fs, { writeFileSync, WriteStream } from 'node:fs';
import jsonld from 'jsonld';
import { logger } from '../logger';
import { MetaStore } from '../memory/store';
import { writer } from 'node:repl';
import { CsvDataSource } from '../data/data-source';


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
    quads = quads.map(q => new Quad(q.subject, q.predicate, q.object, null));
    writer.addQuads(quads);

    let context: string;
    if (contextPath.startsWith('http'))
    {
        context = contextPath;
    }
    else {
        const contextText = fs.readFileSync(contextPath, {encoding: 'utf-8'});
        const contextJson = JSON.parse(contextText);
    }

    writer.end((error, result) => {
        if (error) {
            logger.error(error);
            return;
        }
        logger.info(result);
        jsonld.fromRDF(result, {format: 'application/n-quads'})
            .then(doc => jsonld.compact(doc, context as any, {
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
