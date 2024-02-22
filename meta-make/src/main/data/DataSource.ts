import { createReadStream, PathLike, readFile } from "fs";
import { promisify } from "util";
import Papa from "papaparse";
import { Readable } from "stream";
import { isString } from "@sniptt/guards";
import { isURL } from "../../common/typeguards";

const readFileAsync = promisify(readFile);

export default class DataSource {

  protected dataPath: PathLike;

  protected previewRowCount: number = 5;
  protected preview: string[][] = [];

  constructor(dataPath: PathLike) {
    this.dataPath = dataPath;
  }

  getPreview() {
    // return this.dataPath.split('\n').slice(0,5).join('\n');
    console.log(`${this}::getPreview() => \n${this.preview}`);
    return this.preview;
  }
}

export class LocalCsvDataSource extends DataSource {
  private dataStream: Readable;

  constructor(filePath: string) {
    super(filePath);
    console.log(`${this}::new()`);
    this.resetStream();
    this.loadPreview();
  }

  private resetStream() {
    if (this.dataStream) {
      this.dataStream.destroy();
    }

    // TODO: Check if exists and validate

    console.log(`${this}::reset()`);
    this.dataStream = createReadStream(this.dataPath, {encoding: "utf8"})
    this.dataStream.pause();
    this.dataStream = this.dataStream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT));
  }

  private loadPreview() {
    console.log(`${this}::preview()`);
    let headerRowCounter = 0;
    this.dataStream.on("data", (data: string[]) => {
      console.log(`++ '${data.join("', '")}'`);
      this.preview.push(data);
      if (headerRowCounter++ >= this.previewRowCount) {
        console.log(`${this}::preview() done.`);
        this.resetStream();
      }
    })
    this.dataStream.resume();
  }

  override toString(): string {
    if (isString(this.dataPath)) {
      const fileName = this.dataPath.split(/[\\\/]/).slice(-1)[0];
      return `LocalCsvDataSource(file::${this.dataPath})`;
    }
    else if (isURL(this.dataPath)) {
      return `LocalCsvDataSource(${this.dataPath})`;
    }
    else {
      return `LocalCsvDataSource(buff::${this.dataPath})`;
    }
  }
}
