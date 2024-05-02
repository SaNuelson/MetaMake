import { promisify } from 'util'
import { createReadStream, PathLike, readFile, writeFile } from 'fs'
import Papa from 'papaparse'
import { Readable } from 'stream'
import MetaFormat from "../../common/dto/MetaFormat";
import knowledgeBaseManager from "../kb/KnowledgeBaseManager";

export const readFileAsync = promisify(readFile)
export const writeFileAsync = promisify(writeFile);

/**
 * Create a paused Readable stream from specified file, passed through Papa.parse.
 * @param path Absolute path to local file.
 * @param encoding Encoding of the file, UTF-8 by default.
 * @returns Readable stream.
 */
export function papaStream(path: PathLike, encoding: BufferEncoding = "utf8"): Readable {
  let dataStream: Readable = createReadStream(path, encoding);
  dataStream.pause();
  dataStream = dataStream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT));
  return dataStream;
}

export function writeTextToFile(path: string, content: string, encoding: BufferEncoding = "utf8"): Promise<void> {
  return writeFileAsync(path, content, {encoding})
}

export function readTextFromFile(path: string, encoding: BufferEncoding = "utf8"): Promise<string> {
  return readFileAsync(path, {encoding})
}

export function chainJsonTransformers(breakOnChange: boolean = false, ...transformers: Array<(this: any, key: string, value: any) => any>) {
  return function (this: any, key: string, value: any): any {
    let newValue: any;
    for (const transformer of transformers) {
      newValue = transformer.call(this, key, value);
      if (breakOnChange && newValue !== value) {
        return newValue;
      }
      value = newValue;
    }
    return value;
  }
}

export function metaObjectStripper(this: any, key: string, value: any): any {
  if (value instanceof MetaFormat) {
    return {
      __rebind: MetaFormat.name,
      name: value.name
    };
  }
  return value;
}

export function metaObjectReviver(this: any, key: string, value: any): any {
  if (typeof value === 'object' && value.hasOwnProperty('__rebind')) {
    switch(value.__rebind) {
      case MetaFormat.name:
        return knowledgeBaseManager.getMetaFormat(value.name)
    }
  }
  return value;
}
