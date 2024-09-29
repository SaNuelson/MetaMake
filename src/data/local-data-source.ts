import { CsvDataSource, DataSource } from './data-source';
import { openReadableStream } from '../io/stream';
import { parseCsvStream } from '../io/csv';
import { Transform } from 'stream';
import { exists, existsSync } from 'node:fs';

export abstract class LocalDataSource<Data> implements DataSource<Data> {
    protected readonly filename: string;

    constructor(filename: string) {
        this.filename = filename;

        if(!existsSync(filename)) {
            throw new Error(`File ${this.filename} does not exist`);
        }
    }

    abstract reset(): Promise<boolean>;

    abstract readNext(n: number): Promise<Data>;
}

export class LocalCsvDataSource extends LocalDataSource<string[][]> implements CsvDataSource {

    fileStream: Transform;

    private get isOpen(): boolean {
        return !!this.fileStream && !this.fileStream.closed;
    }

    async open(): Promise<boolean> {
        let rawStream = openReadableStream(this.filename);
        this.fileStream = parseCsvStream(rawStream);
        return true;
    }

    async reset(): Promise<boolean> {
        if (!this.isOpen)
            return true;

        this.fileStream.destroy();
        return true;
    }

    async readNext(n?: number): Promise<string[][]> {
        if (!this.isOpen)
            await this.open();

        return new Promise<string[][]>((res, rej) => {

            const dataChunks: string[][] = [];
            let isStreamOpen = true;

            this.fileStream.on('end', () => {
                isStreamOpen = false;
                this.fileStream.pause();
                res(dataChunks);
            })

            this.fileStream.on('data', chunk => {
                dataChunks.push(chunk);
                if (!isStreamOpen || dataChunks.length === n) {
                    this.fileStream.pause();
                    res(dataChunks);
                }
            });

            this.fileStream.on('error', err => {
                rej(err);
            });
        });
    }
}