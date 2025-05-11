import * as Papa from 'papaparse';
import { Readable } from 'node:stream';

export function parseCsvStream(readStream: Readable) {
    return readStream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT))
}
