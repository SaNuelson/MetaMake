import { createReadStream, ReadStream } from 'fs';

export function openReadableStream(fileName: string): ReadStream {
    const readableStream = createReadStream(fileName);

    readableStream.on('error', (err: NodeJS.ErrnoException) => {
        console.error(`There was an error opening the file: ${err.message}`);
    });

    return readableStream;
}