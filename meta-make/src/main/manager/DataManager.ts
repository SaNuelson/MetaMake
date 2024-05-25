import DataSource from '../data/DataSource.js'
import { LocalCsvDataSource } from '../data/LocalCsvDataSource.js'
import {LocalJsonDataSource} from "../data/LocalJsonDataSource.js";

class DataManager {
  // meta: Meta;
  // knowledgeBases: KnowledgeBase[];
  public dataSource: DataSource

  public async loadData(filePath: string): Promise<boolean> {
    const extension = filePath.split('.').slice(-1)[0].toLowerCase()
    switch (extension) {
      case 'csv':
        this.dataSource = new LocalCsvDataSource(filePath)
        return true
      case 'json':
        this.dataSource = new LocalJsonDataSource(filePath)
        return true
      default:
        console.error(`Parsing files with extension ${extension} is not implemented.`)
        return false
    }
  }
}
export default new DataManager();
