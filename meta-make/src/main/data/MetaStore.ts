import Store, { Schema } from "electron-store";
import { Config } from "../../common/constants";

interface MetaStore {
  [Config.kbPath]: string;
}

const metaStoreSchema: Schema<MetaStore>  = {
  [Config.kbPath]: {
    type: "string",
  }
}

export default new Store<MetaStore>({schema: metaStoreSchema});

// export default {get:()=>"A", set:()=>{}}
