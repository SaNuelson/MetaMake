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

export function wrapJsonTokenStream(data: JsonToken[]): object {
  const nestStack: string[] = [];
  const objStack : object[] = [{}];
  let key: string | undefined = undefined;
  let heldObject: object | undefined = objStack[0];
  for (const token of data.slice(1)) {
    switch (token.name) {
      case 'keyValue':
        key = token.value;
        break;
      case 'startArray':
        nestStack.push("[");
        const newArr = [];
        heldObject[key] = newArr;
        objStack.push(heldObject);
        heldObject = newArr;
        break;
      case 'endArray':
        nestStack.pop()
        heldObject = objStack.pop()
        break;
      case 'startObject':
        nestStack.push('{')
        const newObj = {};
        if (Array.isArray(heldObject))
          heldObject.push(newObj);
        else
          heldObject[key] = newObj;
        objStack.push(heldObject)
        heldObject = newObj;
        break;
      case 'endObject':
        nestStack.pop()
        heldObject = objStack.pop()
        break;
      case 'nullValue':
      case 'trueValue':
      case 'falseValue':
      case 'stringValue':
        if (Array.isArray(heldObject))
          heldObject.push(token.value);
        else
          heldObject[key] = token.value;
        break;
      case 'numberValue':
        if (Array.isArray(heldObject))
          heldObject.push(+token.value);
        else
          heldObject[key] = +token.value;
        break;
      default:
        throw new Error("How");
    }
  }

  return objStack[0] ?? heldObject;
}
