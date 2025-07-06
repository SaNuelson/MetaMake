import {
    CsvDataSource, DataKind, DataSource, JsonDataSource, RdfDataSource, SourceKind, XmlDataSource,
} from './data-source.js';
import { DataHolder, LocalDataSource } from './local-data-source.js';

export function isLocalDataSource<T>(ds: DataSource<T>): ds is LocalDataSource<T, DataHolder<T>> {
    return ds.sourceKind === SourceKind.LOCAL;
}

// export function isRemoteDataSource<T>(ds: DataSource<T>): ds is RemoteDataSource<T> {
//     return ds.sourceKind === SourceKind.REMOTE;
// }

export function isCsvDataSource(ds: DataSource<unknown>): ds is CsvDataSource {
    return ds.dataKind === DataKind.CSV;
}

export function isJsonDataSource(ds: DataSource<unknown>): ds is JsonDataSource {
    return ds.dataKind === DataKind.JSON;
}

export function isXmlDataSource(ds: DataSource<unknown>): ds is XmlDataSource {
    return ds.dataKind === DataKind.XML;
}

export function isRdfDataSource(ds: DataSource<unknown>): ds is RdfDataSource {
    return ds.dataKind === DataKind.RDF;
}
