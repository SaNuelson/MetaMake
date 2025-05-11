import { DataSource } from './data-source';
import { existsSync, statSync } from 'node:fs';
import { Stats } from 'fs';

export function IsLocalDataSource<T>(source: DataSource<T>): source is LocalDataSource<T> {
    return Object.hasOwn(source, 'filename');
}

export abstract class LocalDataSource<Data> implements DataSource<Data> {
    public readonly filename: string;

    public readonly fileStats: Stats;

    protected constructor(filename: string) {
        this.filename = filename;

        if(!existsSync(filename)) {
            throw new Error(`File ${this.filename} does not exist`);
        }

        this.fileStats = statSync(this.filename);
    }

    abstract reset(): Promise<boolean>;

    abstract readNext(n: number): Promise<Data>;
}
