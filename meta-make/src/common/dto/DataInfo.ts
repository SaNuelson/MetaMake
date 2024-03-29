import Restructurable from './Restructurable'

export default class DataInfo extends Restructurable {
  public header: string[]
  public data: string[][]
  public rowCount: number

  constructor(header: string[], data: string[][], rowCount: number) {
    super()
    this.header = header
    this.data = data
    this.rowCount = rowCount
  }

  public get width(): number {
    return this.header?.length ?? this.data[0]?.length ?? 0
  }
}
Restructurable.addClass(DataInfo)
