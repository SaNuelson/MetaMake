import DataManager from "../data/DataManager";
import {KnowledgeBase} from "../../common/dto/KnowledgeBase";
import KnowledgeBaseManager from "../kb/KnowledgeBaseManager";
import { ThreadController } from "./openaiconnector";
import MetaModel from "../../common/dto/MetaModel";
import { StructuredMetaProperty } from "../../common/dto/MetaProperty";
import MetaStore from "../data/MetaStore.js";
import { LogLevel } from "../../common/constants.js";

interface GuessResponse {
  value: string,
  confidence: number
}

export default async function generateMetadata(formatName: string, kbId?: string) {
  const data = await DataManager.dataSource.getData(5000);

  // const catalogue = new Catalogue();
  // const types = catalogue.usetypes.map(ut => ut.type)

  const kb: KnowledgeBase = kbId
    ? KnowledgeBaseManager.getKnowledgeBase(kbId)!
    : KnowledgeBase.Empty(KnowledgeBaseManager.getMetaFormat(formatName)!)
  const newModel = new MetaModel(kb.model.metaFormat);

  const connector = await ThreadController.Create();

  await connector.addMessage(`Here is a sample of the data - the first 20 rows of the CSV:
  \`\`\`csv
  ${data.slice(0, 20).join('  \n')}
  \`\`\`
  Answer the following questions using format:
  {
      value: "Your guess here" (or null if your guess is the question can't be answered),
      confidence: "How confident your guess is from 0.0 to 1.0"
      process: "Your thought process behind the assumption."
  }
  `);

  for (const [path, arity, prop, data] of kb.model.preOrderTraversal()) {
    if (prop instanceof StructuredMetaProperty) {
      continue;
    }

    // TODO: Remove
    newModel.setValue(path, `ChatGPT val for ${prop.name}`);
    continue;

    await connector.addMessage(`Provide your best guess in form of mentioned JSON for metadata ${prop.name} (${prop.description}):`);

    const response = await connector.getResponse();

    try {
      const guess: GuessResponse = JSON.parse(response);
      if (guess.confidence > 0.8) {
        newModel.setValue(path, guess.value);
      }
    }
    catch(e) {
      console.error(e);
    }
  }

  if (MetaStore.logLevel >= LogLevel.Log)
    console.log("chatGPT generateMetadata() finished.");
  return newModel;
}
