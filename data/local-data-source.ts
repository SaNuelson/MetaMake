import { CsvDataSource, DataSource } from './data-source';
import { openReadableStream } from '../io/stream';
import { parseCsvStream } from '../io/csv';
import { Readable, Transform } from 'stream';
import { ReadStream } from 'fs';
import { createInterface, Interface } from 'readline';

export abstract class LocalDataSource<Data> implements DataSource<Data> {
    protected readonly filename: string;

    constructor(filename: string) {
        this.filename = filename;
    }

    abstract readNext(n: number): Promise<Data>;
}

export class LocalCsvDataSource extends LocalDataSource<string[][]> implements CsvDataSource {

    fileStream: Interface;

    async open(): Promise<boolean> {
        let rawStream = openReadableStream(this.filename);
        let papaStream = parseCsvStream(rawStream);
        this.fileStream
        return true;
    }

    async readNext(n: number): Promise<string[][]> {
        if (!this.isOpen)
            await this.open();


    }
}