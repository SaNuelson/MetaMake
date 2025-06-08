import * as Papa from 'papaparse';
import { Duplex, Readable } from 'node:stream';

export function parseCsvStream(readStream: Readable) : Duplex {
    return readStream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT))
}
