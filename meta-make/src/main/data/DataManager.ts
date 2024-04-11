import DataSource from './DataSource'
import { LocalCsvDataSource } from './LocalCsvDataSource'

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
      default:
        console.error(`Parsing files with extension ${extension} is not implemented.`)
        return false
    }
  }
}
export default new DataManager();
