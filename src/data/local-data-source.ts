import { Stats } from 'fs';
import { existsSync, statSync } from 'node:fs';
import { DataKind, DataSource, SourceKind } from './data-source';

export abstract class LocalDataSource<Data> implements DataSource<Data> {
    abstract get dataKind(): DataKind;
    get sourceKind(): SourceKind {
        return SourceKind.LOCAL;
    }

    public readonly filename: string;

    public readonly fileStats: Stats;

    protected constructor(filename: string) {
        this.filename = filename;

        if (!existsSync(filename)) {
            throw new Error(`File ${this.filename} does not exist`);
        }

        this.fileStats = statSync(this.filename);
    }


    abstract reset(): Promise<boolean>;

    abstract readNext(n: number): Promise<Data>;
}
