import { Readable } from "stream";
import { createReadStream } from "fs";
import Papa from "papaparse";
import { isString } from "@sniptt/guards";
import { isURL } from "../../common/typeguards";
import DataSource from "./DataSource";
import { papaStream } from "../utils/io";
import { DataInfo } from "../../common/type";

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
    this.dataStream = papaStream(this.dataPath);
  }

  private loadPreview() {
    console.log(`${this}::preview()`);
    let headerRowCounter = 0;
    let preview = [] as string[][];
    this.dataStream.on("data", (data: string[]) => {
      console.log(`++ '${data.join("', '")}'`);
      preview.push(data);
      if (headerRowCounter++ >= this.previewRowCount) {
        console.log(`${this}::preview() done.`);
        this.resetStream();
        this.preview = {
          header: preview[0],
          data: preview.slice(1),
          rowCount: -1
        };
      }
    });
    // TODO: data source with less than 6 lines never triggers
    this.dataStream.resume();
  }

  override toString(): string {
    if (isString(this.dataPath)) {
      const fileName = this.dataPath.split(/[\\\/]/).slice(-1)[0];
      return `LocalCsvDataSource(file::${this.dataPath})`;
    } else if (isURL(this.dataPath)) {
      return `LocalCsvDataSource(${this.dataPath})`;
    } else {
      return `LocalCsvDataSource(buff::${this.dataPath})`;
    }
  }
}
