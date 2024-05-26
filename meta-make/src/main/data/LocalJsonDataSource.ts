import { Readable } from 'stream'
import { isString } from '@sniptt/guards'
import { isURL } from '../../common/typeguards'
import DataSource from './DataSource'
import Parser from "stream-json/Parser.js";
import fs from "fs";
import { JsonDataInfo } from "../../common/dto/DataInfo.js";
import { JsonToken } from "../../common/dto/JsonTokens.js";

export class LocalJsonDataSource extends DataSource {
  private dataStream!: Readable

  constructor(filePath: string) {
    super(filePath)
    console.log(`${this}::new()`)
    this.resetStream()
    this.loadPreview()
  }

  private resetStream(): void {
    if (this.dataStream) {
      this.dataStream.destroy()
    }

    // TODO: Check if exists and validate

    console.log(`${this}::reset()`)
    const parser = new Parser({packKeys: true, packStrings: true, packNumbers: true});
    this.dataStream = fs.createReadStream(this.dataPath).pipe(parser)
  }

  private loadPreview(): void {
    if (!this.dataStream) {
      return;
    }

    console.log(`${this}::preview()`)
    let tokenCounter = 0
    const preview = [] as JsonToken[]

    const previewReader = (data: JsonToken) => {
      if (!['startKey', 'stringChunk', 'endKey', 'startString', 'endString', 'startNumber', 'numberChunk', 'endNumber'].includes(data.name)) {
        preview.push(data);
        tokenCounter++;
      }
      if (tokenCounter >= 10 * this.previewRowCount) {
        console.log(`${this}::preview() done.`)
        this.resetStream()
        this.dataStream.off('data', previewReader);
        this.preview = new JsonDataInfo(preview, -1);
      }
    }
    this.dataStream.on('data', previewReader);
    this.dataStream.resume()
  }

  async getData(dataCount: number): Promise<JsonToken[]> {
    const result: JsonToken[] = [];
    return new Promise(resolve => {

      let tokensLeft = dataCount;
      const dataReader = (data: JsonToken) => {
        if (!['startKey', 'stringChunk', 'endKey', 'startString', 'endString', 'startNumber', 'numberChunk', 'endNumber'].includes(data.name)) {
          result.push(data);
        }
        if (tokensLeft-- <= 0) {
          this.resetStream()
          this.dataStream.off('data', dataReader);
          this.dataStream.on('end', readEndListener);
          resolve(result);
        }
      }

      const readEndListener = () => {
        this.resetStream()
        this.dataStream.off('data', dataReader);
        this.dataStream.on('end', readEndListener);
        resolve(result);
      }

      this.dataStream.on('data', dataReader);
      this.dataStream.on('end', readEndListener);
      this.dataStream.resume();
    })
  }

  override toString(): string {
    if (isString(this.dataPath)) {
      //const fileName = this.dataPath.split(/[\\\/]/).slice(-1)[0]
      return `LocalJsonDataSource(file::${this.dataPath})`
    } else if (isURL(this.dataPath)) {
      return `LocalJsonDataSource(${this.dataPath})`
    } else {
      return `LocalJsonDataSource(buff::${this.dataPath})`
    }
  }
}
