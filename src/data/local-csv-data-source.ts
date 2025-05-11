import { CsvDataSource } from './data-source';
import { Transform } from 'stream';
import { openReadableStream } from '../io/stream';
import { parseCsvStream } from '../io/csv';
import { LocalDataSource } from './local-data-source';
import { Duplex } from 'node:stream';
import { logger } from '../logger';
import { isDevelopment } from '../utils/env';

export class LocalCsvDataSource extends LocalDataSource<string[][]> implements CsvDataSource {

    fileStream: Duplex;

    protected constructor(filename: string) {
        super(filename);
    }

    public static async create(filename: string): Promise<LocalCsvDataSource> {
        const dataSource = new LocalCsvDataSource(filename);

        if (isDevelopment()) {
            logger.info(
                `LocalCsvDataSource( ${filename} ) created:` +
                (await dataSource.readNext(1))[0] +
                "...")
        }

        return dataSource;
    }

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
            });

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
