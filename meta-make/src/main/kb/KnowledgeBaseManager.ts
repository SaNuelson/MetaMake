import { KnowledgeBase } from './KnowledgeBase'
import { promisify } from "util";
import { readFile } from "fs";
import { parse } from "papaparse";
import { papaStream } from "../utils/io";
import assert from "assert";
import Essential from "../format/Essential";
import MetaFormat from "../format/MetaFormat";

const readFileAsync = promisify(readFile);

class KnowledgeBaseManager {
  private __metaFormats: Array<MetaFormat> = [
    Essential
  ];
  public get metaFormats(): Array<MetaFormat> {
    return [...this.__metaFormats];
  }


  private __knowledgeBases: Array<KnowledgeBase> = [
    // TODO: Remove
    new KnowledgeBase(
      "testkb001",
      "Test KB 001",
      "/testkb001.kb",
      Essential,
      new Date(Date.now())
    ),
    new KnowledgeBase(
      "testkb002",
      "Test KB 002",
      "/testkb002.kb",
      Essential,
      new Date(Date.now())
    )
  ];
  public get knowledgeBases(): Array<KnowledgeBase> {
    return [...this.__knowledgeBases];
  }

  public getMetaFormatList(): string[] {
    return this.__metaFormats.map(kb => kb.name);
  }

  public addKB(kb: KnowledgeBase) {
    // TODO: Check if known, if not write to cache
    this.__knowledgeBases.push(kb);
  }

  public async loadKBs(path: string) {
    const stream = papaStream(path);
    stream.on("data", (data: string[]) => {
      // TODO: validate
      const [id, name, path, format, changedOnStr] = data;
      const changedOn = new Date(Date.parse(changedOnStr));
      this.knowledgeBases.push(new KnowledgeBase(id, name, path, format, changedOn));
    });
  }
}

export default new KnowledgeBaseManager();
