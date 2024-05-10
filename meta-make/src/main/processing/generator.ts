import DataManager from "../data/DataManager";
import { Catalogue } from '../dcr/core/Catalogue.js';
import {KnowledgeBase} from "../../common/dto/KnowledgeBase";
import KnowledgeBaseManager from "../kb/KnowledgeBaseManager";
import { ThreadController } from "./openaiconnector";
import MetaModel from "../../common/dto/MetaModel";
import { StructuredMetaProperty } from "../../common/dto/MetaProperty";

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

  const initialResponse = await connector.send(`
  Here is the first 20 rows of the CSV data about which you will be later asked to make educated guesses:
  \`\`\`csv
  ${data.slice(0, 20).join('  \n')}
  \`\`\`
  If the instructions are clear and you understand the data, respond with JSON: {"processed": true}.
  Otherwise, respond with {"processed": false, "reason": "Description of the error" }.
  `);

  await connector.send(`Can you send me the current date and time on a JSON?`);

  await connector.send(`What was my previous message about? Respond in JSON {"prev_message_content": "Description"`);

  for (const [path, arity, prop, data] of kb.model.preOrderTraversal()) {
    if (prop instanceof StructuredMetaProperty) {
      continue;
    }

    const response = await connector.send(`
    Property name: ${prop.name}
    Property description: ${prop.description}
    Provide your best guess for this metadatum as a JSON in format:
    {
      value: "Your guess here",
      confidence: "How confident your guess is from 0.0 to 1.0"
      process: "Your thought process on how you arrived to this guess."
    }`);

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

  console.log("chatGPT generateMetadata() finished.");
  return newModel;
}
