import { Store } from 'n3';

export enum SourceKind {
    LOCAL = 0,
    REMOTE = 1
}

export enum DataKind {
    CSV = 'csv',
    JSON = 'json',
    XML = 'xml',
    RDF = 'rdf'
}

export interface DataSource<Data> {
    get sourceKind(): SourceKind;

    get dataKind(): DataKind;

    reset(): Promise<boolean>;

    readNext(n?: number): Promise<Data>;
}

export interface CsvDataSource extends DataSource<string[][]> {
    get dataKind(): DataKind.CSV;
}

export interface JsonDataSource extends DataSource<object> {
    get dataKind(): DataKind.JSON;
}

export interface XmlDataSource extends DataSource<Document> {
    get dataKind(): DataKind.XML;
}

export interface RdfDataSource extends DataSource<Store> {
    get dataKind(): DataKind.RDF;
}
