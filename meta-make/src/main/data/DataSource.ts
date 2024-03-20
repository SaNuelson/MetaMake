import { PathLike, readFile } from 'fs'
import { promisify } from 'util'
import { broadcastToWindows } from '../events'
import { EventType } from '../../common/constants'
import { DataInfo } from '../../common/dto/DataInfo'

const readFileAsync = promisify(readFile)

export default class DataSource {
  protected dataPath: PathLike

  protected previewRowCount: number = 5
  protected __preview: DataInfo = null

  public get preview(): DataInfo {
    return this.__preview
  }

  public set preview(value: DataInfo) {
    if (this.preview == value) return
    // TODO: compare by value

    this.__preview = value
    broadcastToWindows(EventType.DataChanged)
  }

  constructor(dataPath: PathLike) {
    this.dataPath = dataPath
  }

  getPreview() {
    console.log(`${this}::getPreview() => \n${this.preview}`)
    return this.preview
  }
}
