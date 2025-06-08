import { Stats } from 'fs';
import { existsSync, statSync } from 'node:fs';
import { Duplex } from 'node:stream';
import { DataKind, DataSource, SourceKind } from './data-source';

export abstract class DataHolder<DataChunk> {
    public abstract add(data: DataChunk): void;
    public abstract get size(): number;
    public abstract getData(): DataChunk[];
}

export abstract class LocalDataSource<Data, Holder extends DataHolder<Data>>
    implements DataSource<Data> {
    public readonly filename: string;
    public readonly fileStats: Stats;
    protected fileStream: Duplex;

    protected constructor(filename: string) {
        this.filename = filename;

        if (!existsSync(filename)) {
            throw new Error(`File ${this.filename} does not exist`);
        }

        this.fileStats = statSync(this.filename);
    }

    public abstract get dataKind(): DataKind;

    public get sourceKind(): SourceKind {
        return SourceKind.LOCAL;
    }

    protected get isOpen(): boolean {
        return !!this.fileStream && !this.fileStream.closed;
    }

    public async reset(): Promise<boolean> {
        if (!this.isOpen)
            return true;

        this.fileStream.destroy();
        return true;
    }

    protected abstract open(): Promise<boolean>;

    protected abstract createHolder(): Holder;

    public async readNext(n?: number): Promise<Data[]> {
        if (!this.isOpen)
            await this.open();

        return new Promise<Data[]>((res, rej) => {

            const dataHolder: Holder = this.createHolder();
            let isStreamOpen = true;

            this.fileStream.on('end', () => {
                isStreamOpen = false;
                this.fileStream.pause();
                res(dataHolder.getData());
            });

            this.fileStream.on('data', chunk => {
                dataHolder.add(chunk);
                if (!isStreamOpen || dataHolder.size === n) {
                    this.fileStream.pause();
                    res(dataHolder.getData());
                }
            });

            this.fileStream.on('error', err => {
                rej(err);
            });
        });
    }
}
