import { Quad, Store, StreamParser } from 'n3';
import { Duplex, Readable } from 'node:stream';

export function parseRdfStream(readStream: Readable, format: string = 'text/turtle'): Duplex {
    const parser = new StreamParser({format});
    return readStream.pipe(parser);
}

const RDF_FORMAT_MAP: Record<string, string> = {
    '.ttl': 'text/turtle',
    '.nt': 'application/n-triples',
    '.nq': 'application/n-quads',
    '.trig': 'application/trig',
    '.n3': 'text/n3',
    '.jsonld': 'application/ld+json',
    '.rdf': 'application/rdf+xml',
    '.owl': 'application/rdf+xml',
} as const;

export function getFormatFromExtension(extension: string): string {
    return RDF_FORMAT_MAP[extension] || 'text/turtle'; // Default to Turtle
}

export async function storeRdfStream(readStream: Readable, store: Store = new Store(), format: string = RDF_FORMAT_MAP['.ttl']): Promise<Store> {
    return new Promise<Store>((resolve, reject) => {
        const parser = parseRdfStream(readStream, format);

        parser.on('data', (quad: Quad) => store.addQuad(quad));
        parser.on('error', (err: Error) => reject(err));
        parser.on('end', () => resolve(store));
    });
}
