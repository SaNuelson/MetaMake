import DataSource, { LocalCsvDataSource } from "./data/DataSource";
import { BrowserWindow } from "electron";
import { EventType } from "../common/constants";
import { Readable, Writable } from "stream";
import { broadcastToWindows } from "./events";

class DataManager {
  private dataStream: Readable;

  // meta: Meta;
  // knowledgeBases: KnowledgeBase[];
  private __dataSource: DataSource;
  public get dataSource() {
    return this.__dataSource;
  }
  private set dataSource(value: DataSource) {
    if (this.__dataSource === value)
      return;

    this.__dataSource = value;
    broadcastToWindows(EventType.DataChanged);
  }

  public async loadData(filePath: string): Promise<boolean> {
    const extension = filePath.split('.').slice(-1)[0].toLowerCase();
    switch(extension) {
      case "csv":
        this.dataSource = new LocalCsvDataSource(filePath);
        return true;
      default:
        console.error(`Parsing files with extension ${extension} is not implemented.`);
        return false;
    }
  }
}
export default new DataManager();
