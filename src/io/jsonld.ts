import { Store } from 'n3';
import { ReadStream } from 'fs';
import { JsonLdParser } from 'jsonld-streaming-parser';


function storeJsonld(readStream: ReadStream, store: Store): Promise<void> {
    const jsonLdParser = new JsonLdParser();
    const jsonStream = readStream.pipe(jsonLdParser);
    jsonStream.on('data', quad => store.addQuad(quad))
    return new Promise((resolve, reject) => {
        jsonStream.on('end', resolve);
        jsonStream.on('error', reject);
    });
}

function dumpJsonld(writeStream: WritableStream, store: Store): Promise<void> {
    const jsonLdWriter = new JsonLdParser()
}