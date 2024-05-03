import Store, { Schema } from "electron-store";
import { Config } from "../../common/constants";

interface MetaStore {
  [Config.kbPath]: string;
  [Config.kbList]: Array<string>;
}

const metaStoreSchema: Schema<MetaStore>  = {
  [Config.kbPath]: {
    type: "string",
  },
  [Config.kbList]: {
    type: "array"
  }
}

class MetaElectronStore extends Store<MetaStore> {

  addKnowledgeBase(id: string) {
    const list = this.get(Config.kbList, []);
    list.push(id);
    this.set(Config.kbList, list);
  }

  getKnowledgeBases(): Array<string> {
    return this.get(Config.kbList, []);
  }

}

export default new MetaElectronStore({schema: metaStoreSchema});

// export default {get:()=>"A", set:()=>{}}
