import { PathLike } from 'fs'
import { broadcastToWindows } from '../events'
import { EventType } from '../../common/constants'
import DataInfo from '../../common/dto/DataInfo'

export default class DataSource {
  protected dataPath: PathLike

  protected previewRowCount: number = 5
  private _preview: DataInfo | undefined = undefined

  public get preview(): DataInfo | undefined {
    return this._preview
  }

  public set preview(value: DataInfo) {
    if (this.preview == value) return
    // TODO: compare by value

    this._preview = value
    broadcastToWindows(EventType.DataChanged)
  }

  constructor(dataPath: PathLike) {
    this.dataPath = dataPath
  }

  getPreview() {
    console.log(`${this}::getPreview() => \n${this.preview}`)
    return this.preview
  }

  getData(dataCount: number): Promise<any> {
    throw new Error("Abstract method.");
  }
}
