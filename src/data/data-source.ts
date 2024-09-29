import { Store } from "n3"

export interface DataSource<Data> {
    reset(): Promise<boolean>
    readNext(n?: number): Promise<Data>
}

export interface CsvDataSource extends DataSource<string[][]> {

}

export interface JsonDataSource extends DataSource<object> {

}

export interface XmlDataSource extends DataSource<Document> {

}

export interface RdfDataSource extends DataSource<Store> {

}