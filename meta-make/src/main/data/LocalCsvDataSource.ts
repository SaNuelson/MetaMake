import { Readable } from 'stream'
import { isString } from '@sniptt/guards'
import { isURL } from '../../common/typeguards'
import DataSource from './DataSource'
import { papaStream } from '../utils/io'
import DataInfo from '../../common/dto/DataInfo'

export class LocalCsvDataSource extends DataSource {
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
    this.dataStream = papaStream(this.dataPath)
  }

  private loadPreview(): void {
    if (!this.dataStream) {
      return;
    }

    console.log(`${this}::preview()`)
    let headerRowCounter = 0
    const preview = [] as string[][]

    const previewReader = (data: string[]) => {
      console.log(`++ (${headerRowCounter})(${this.previewRowCount}) '${data.join("', '")}'`);
      preview.push(data)
      if (headerRowCounter++ >= this.previewRowCount) {
        console.log(`${this}::preview() done.`)
        this.resetStream()
        this.dataStream.off('data', previewReader);
        this.preview = new DataInfo(preview[0], preview.slice(1), -1)
      }
    }

    this.dataStream.on('data', previewReader);
    // TODO: data source with less than 6 lines never triggers
    this.dataStream.resume()
  }

  async getData(rowCount: number): Promise<Array<Array<string>>> {
    const result: Array<Array<string>> = [];
    return new Promise<Array<Array<string>>>(resolve => {

      let rowsLeft = rowCount;
      const dataReader = (data: string[]) => {
        console.log(`++ '${data.join("', '")}'`);
        result.push(data)
        if (rowsLeft-- <= 0) {
          console.log(`${this}::getData() done.`)
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
      return `LocalCsvDataSource(file::${this.dataPath})`
    } else if (isURL(this.dataPath)) {
      return `LocalCsvDataSource(${this.dataPath})`
    } else {
      return `LocalCsvDataSource(buff::${this.dataPath})`
    }
  }
}
