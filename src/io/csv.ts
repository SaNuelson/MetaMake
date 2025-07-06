import { Duplex, Readable } from 'node:stream';
import * as Papa from 'papaparse';

export function parseCsvStream(readStream: Readable): Duplex {
    return readStream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT));
}
