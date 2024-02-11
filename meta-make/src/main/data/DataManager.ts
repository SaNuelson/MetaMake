import { readFileSync } from "fs";

export default class DataManager {

  private path: string;
  private data: string;

  constructor(path: string) {
    this.path = path;

    this.data = readFileSync(path, {encoding: 'utf8'})
  }

  getPreview() {
    return this.data.split('\n').slice(0,5).join('\n');
  }
}
