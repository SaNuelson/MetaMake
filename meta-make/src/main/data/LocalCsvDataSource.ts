import { Readable } from 'stream'
import { isString } from '@sniptt/guards'
import { isURL } from '../../common/typeguards'
import DataSource from './DataSource'
import { papaStream } from '../utils/io'
import DataInfo from '../../common/dto/DataInfo'

export class LocalCsvDataSource extends DataSource {
  private dataStream?: Readable

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
    this.dataStream.on('data', (data: string[]) => {
      console.log(`++ '${data.join("', '")}'`)
      preview.push(data)
      if (headerRowCounter++ >= this.previewRowCount) {
        console.log(`${this}::preview() done.`)
        this.resetStream()
        this.preview = new DataInfo(preview[0], preview.slice(1), -1)
      }
    })
    // TODO: data source with less than 6 lines never triggers
    this.dataStream.resume()
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
