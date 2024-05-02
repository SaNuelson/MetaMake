import { promisify } from 'util'
import { createReadStream, PathLike, readFile, writeFile } from 'fs'
import Papa from 'papaparse'
import { Readable } from 'stream'

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

