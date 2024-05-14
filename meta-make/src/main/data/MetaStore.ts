import Store, { Options, Schema } from "electron-store";
import { Config } from "../../common/constants";

interface MetaStore {
  [Config.kbPath]: string;
  [Config.kbList]: Array<string>;
  [funcCallCache]: {[fname: string]: [Date, any]}
}

const funcCallCache = 'FuncCallCache';

const metaStoreSchema: Schema<MetaStore>  = {
  [Config.kbPath]: {
    type: "string",
  },
  [Config.kbList]: {
    type: "array"
  },
  [funcCallCache]: {
    type: "object"
  }
}

class MetaElectronStore extends Store<MetaStore> {

  private startedAt: Date;

  constructor(options: Options<MetaStore>) {
    super(options);
    this.startedAt = new Date();
  }

  addKnowledgeBase(id: string) {
    const list = this.get(Config.kbList, []);
    list.push(id);
    this.set(Config.kbList, list);
  }

  getKnowledgeBases(): Array<string> {
    return this.get(Config.kbList, []);
  }

  deleteKnowledgeBase(kbId: string) {
    let list = this.get(Config.kbList, []);
    list = list.filter(item => item !== kbId);
    this.set(Config.kbList, list);
  }

  async getCached<T>(computeFunc: () => Promise<T>, minutesToLive?: number, handle?: string): Promise<T> {
    minutesToLive ??= 30;

    const funcHandle = handle ?? computeFunc.name;
    const memHandle = `${funcCallCache}.${funcHandle}`

    if (!funcHandle || funcHandle === 'anonymous') {
      console.trace("Received an unknown or anonymous function, and no handle was provided.");
      return computeFunc();
    }

    const cached : [string, T] = this.get(memHandle);
    if (cached) {
      const [cachedAt, cachedValue] = cached;

      if (cachedAt === this.startedAt.toJSON()) {
        console.trace(`Encountered non-first cache of ${funcHandle}.`);
      }

      const invalidAt = new Date(Date.parse(cachedAt) + minutesToLive * 60000);

      if (invalidAt >= this.startedAt) {
        return cachedValue;
      }
    }

    const retval = await computeFunc();
    this.set(memHandle, [this.startedAt, retval]);
    return retval;
  }

  reset() {
    for (const key in metaStoreSchema) {
      this.delete(key as keyof MetaStore);
    }
  }
}

export default new MetaElectronStore({schema: metaStoreSchema});

// export default {get:()=>"A", set:()=>{}}
