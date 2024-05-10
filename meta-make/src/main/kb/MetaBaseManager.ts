import { KnowledgeBase } from "../../common/dto/KnowledgeBase";
import MetaFormat from "../../common/dto/MetaFormat";
import generateMetadata from "../processing/generator";
import { broadcastToWindows } from "../events";
import { EventType } from "../../common/constants";
import { MetaBase } from "../../common/dto/MetaModelSource";

class MetaBaseManager {

  private _format?: MetaFormat;
  get format(): MetaFormat {
    if (!this._active)
      throw new Error("Inactive MetaBaseManager");
    return this._format!;
  }

  private _models?: MetaBase;
  get models(): MetaBase {
    if (!this._active)
      throw new Error("Inactive MetaBaseManager");
    return [...this._models!];
  }

  private _active: boolean = false;
  get active(): boolean {
    return this._active;
  }

  private _processed: boolean = false;
  get processed(): boolean {
    return this._processed;
  }

  private reset() {
    delete this._format;
    delete this._models;
    this._active = false;
    this._processed = false;
  }

  fromKnowledgeBase(kb: KnowledgeBase): boolean {
    try {
      this.reset();

      this._format = kb.format;
      this._models = [[kb.model, {name: kb.name, label: "KB"}]];

      this._active = true;
    }
    catch (error) {
      console.error(error);
    }

    this.startProcessing();
    return this._active;
  }

  fromMetaFormat(metaFormat: MetaFormat) {
    try {

      this.reset();

      this._format = metaFormat;
      this._models = [];

      this._active = true;
    }
    catch (error) {
      console.error(error);
    }

    this.startProcessing();
    return this._active;
  }

  private async startProcessing() {
    const chatGptModel = await generateMetadata(this.format.name);

    this._models!.push([chatGptModel, {name: "ChatGPT", label: "ChatGPT"}]);
    this._processed = true;
    broadcastToWindows(EventType.DataProcessed);
  }
}

export default new MetaBaseManager()
