import { promisify } from "util";
import { createReadStream, PathLike, readFile } from "fs";
import Papa from "papaparse";
import { Readable } from "stream";

export const readFileAsync = promisify(readFile);

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
