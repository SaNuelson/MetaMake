import settings from "electron-settings";
import { Config } from "../../common/constants";
import { join } from "path";
import MetaFormat from "../format/MetaFormat";

export class KnowledgeBase {

  public id: string;
  public name: string;
  public format: MetaFormat;
  public changedOn: Date;
  public path: string;

  constructor(id: string | null, name: string, path: string | null, format: MetaFormat, changedOn: Date) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    // TODO: Make sure name is usable as filename, and/or normalize it
    this.path = path ?? join(settings.getSync(Config.KBBasePath) as string, this.name);
    this.format = format;
    this.changedOn = changedOn;
  }

}
