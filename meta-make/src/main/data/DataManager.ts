import DataSource from "./DataSource";
import { BrowserWindow } from "electron";
import { EventType } from "../../common/constants";
import { Readable, Writable } from "stream";
import { broadcastToWindows } from "../events";
import { LocalCsvDataSource } from "./LocalCsvDataSource";

class DataManager {
  // meta: Meta;
  // knowledgeBases: KnowledgeBase[];
  public dataSource: DataSource;

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
