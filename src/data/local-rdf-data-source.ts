import { Quad } from 'n3';
import { parseRdfStream } from '../io/rdf.js';
import { openReadableStream } from '../io/stream.js';
import logger from '../logger.js';
import { isDevelopment } from '../utils/env.js';
import { DataKind, RdfDataSource, SourceKind } from './data-source.js';
import { DataHolder, LocalDataSource } from './local-data-source.js';

class QuadHolder implements DataHolder<Quad> {
    private quads: Quad[] = [];

    public get size(): number {
        return this.quads.length;
    }

    public add(data: Quad): void {
        this.quads.push(data);
    }

    public getData(): Quad[] {
        return this.quads;
    }
}

export class LocalRdfDataSource extends LocalDataSource<Quad, QuadHolder> implements RdfDataSource {

    get dataKind(): DataKind.RDF {
        return DataKind.RDF;
    }

    get sourceKind(): SourceKind {
        return SourceKind.LOCAL;
    }

    public static async create(filename: string): Promise<LocalRdfDataSource> {

        const dataSource = new LocalRdfDataSource(filename);

        if (isDevelopment()) {
            logger.info(`LocalRdfDataSource( ${filename} ) created:` + (await dataSource.readNext(1))[0] + '...');
        }

        return dataSource;
    }

    protected async open(): Promise<boolean> {
        const rawStream = openReadableStream(this.filename);
        this.fileStream = parseRdfStream(rawStream);
        return true;
    }

    protected createHolder(): QuadHolder {
        return new QuadHolder();
    }
}
