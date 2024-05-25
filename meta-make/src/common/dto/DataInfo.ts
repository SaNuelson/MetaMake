import Restructurable from './Restructurable'
import {JsonToken} from "./JsonTokens.js";

type DataSourceExtension = 'csv' | 'json' | 'xml' | 'rdf';

export default class DataInfo extends Restructurable {
  public type: DataSourceExtension;

  constructor(type: DataSourceExtension) {
    super()
    this.type = type;
  }
}

export class CsvDataInfo extends DataInfo {

  public header: string[]
  public data: string[][]
  public rowCount: number

  constructor(header: string[], data: string[][], rowCount: number) {
    super('csv')
    this.header = header
    this.data = data
    this.rowCount = rowCount
  }

  public get width(): number {
    return this.header?.length ?? this.data[0]?.length ?? 0
  }
}

export class JsonDataInfo extends DataInfo {

  public tokens: JsonToken[]
  public tokenCount: number

  constructor(tokens: JsonToken[], tokenCount: number) {
    super('json')
    this.tokens = tokens
    this.tokenCount = tokenCount
  }
}
