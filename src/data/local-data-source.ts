import { Stats } from 'fs';
import { existsSync, statSync } from 'node:fs';
import { Duplex } from 'node:stream';
import { getScopedLogger, ScopedLogger } from '../logger.js';
import { DataKind, DataSource, SourceKind } from './data-source.js';

export abstract class DataHolder<DataChunk> {
    public abstract get size(): number;

    public abstract add(data: DataChunk): void;

    public abstract getData(): DataChunk[];
}

export abstract class LocalDataSource<Data, Holder extends DataHolder<Data>> implements DataSource<Data> {
    public readonly filename: string;
    public readonly fileStats: Stats;
    protected fileStream: Duplex;

    protected logger: ScopedLogger;

    protected constructor(filename: string) {
        this.logger = getScopedLogger(this.constructor.name);

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
        this.logger.info(`${this.constructor.name}(${this.filename}) reset.`);

        if (!this.isOpen) return true;

        this.fileStream.destroy();
        return true;
    }

    public async readNext(n?: number): Promise<Data[]> {
        this.logger.info(`${this.constructor.name}(${this.filename}) read ${n}.`);
        if (!this.isOpen) await this.open();

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

    protected abstract open(): Promise<boolean>;

    protected abstract createHolder(): Holder;
}
