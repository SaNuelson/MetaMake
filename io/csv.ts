import { ReadStream } from 'fs';
import * as Papa from 'papaparse';
import { Transform, TransformOptions } from 'stream';

export function parseCsvStream(readStream: ReadStream): Transform {
    const transformOptions: TransformOptions = {
        transform(chunk: Buffer, encoding, callback) {
            Papa.parse(chunk.toString(), {
                complete: results => {
                    results.data.forEach(row => {
                        this.push(JSON.stringify(row));
                    });
                    callback();
                },
                error: error => callback(error)
            });
        },
        readableObjectMode: true
    };

    const parsedStream = readStream.pipe(new Transform(transformOptions));

    parsedStream.on('error', (err: NodeJS.ErrnoException) => {
        console.error(`There was an error parsing the CSV: ${err.message}`);
    });

    return parsedStream;
}