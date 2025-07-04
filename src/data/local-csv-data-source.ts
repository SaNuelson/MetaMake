import { parseCsvStream } from '../io/csv';
import { openReadableStream } from '../io/stream';
import logger from '../logger';
import { isDevelopment } from '../utils/env';
import { CsvDataSource, DataKind, SourceKind } from './data-source';
import { DataHolder, LocalDataSource } from './local-data-source';

class CsvDataHolder implements DataHolder<string[]> {
    private data: string[][];

    public add(data: string[]): void {
        this.data.push(data);
    }

    public get size(): number {
        return this.data.length;
    }

    public getData(): string[][] {
        return this.data;
    }
}

export class LocalCsvDataSource extends LocalDataSource<string[], CsvDataHolder> implements CsvDataSource {

    get dataKind(): DataKind.CSV {
        return DataKind.CSV;
    }

    get sourceKind(): SourceKind {
        return SourceKind.LOCAL;
    }

    public static async create(filename: string): Promise<LocalCsvDataSource> {
        const dataSource = new LocalCsvDataSource(filename);

        if (isDevelopment()) {
            logger.info(
                `LocalCsvDataSource( ${filename} ) created:` +
                (await dataSource.readNext(1))[0] +
                '...');
        }

        return dataSource;
    }

    protected async open(): Promise<boolean> {
        const rawStream = openReadableStream(this.filename);
        this.fileStream = parseCsvStream(rawStream);
        return true;
    }

    protected createHolder(): CsvDataHolder {
        throw new Error('Method not implemented.');
    }
}
