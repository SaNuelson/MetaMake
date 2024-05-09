import DataManager from "../data/DataManager";
import { Catalogue } from '../dcr/core/Catalogue.js';
import {KnowledgeBase} from "../../common/dto/KnowledgeBase";
import KnowledgeBaseManager from "../kb/KnowledgeBaseManager";
import { ThreadController } from "./openaiconnector";

interface GuessResponse {
  value: string,
  confidence: number
}

export default async function generateMetadata(formatName: string, kbId?: string) {
  const data = await DataManager.dataSource.getData(5000);


  const catalogue = new Catalogue();
  catalogue.setData({data})

  const kb: KnowledgeBase = kbId
    ? KnowledgeBaseManager.getKnowledgeBase(kbId)!
    : KnowledgeBase.Empty(KnowledgeBaseManager.getMetaFormat(formatName)!)

  console.log(JSON.stringify(kb))
  // console.log(res)
  const types = catalogue.usetypes.map(ut => ut.type)

  const connector = await ThreadController.Create();
  console.log(await connector.send(`
  First 20 rows of the sample data:
  ${data.slice(0, 20).join('\n')}
  Respond with a json {"code":200} if you understood the data, {"fault":"Your reason here"} otherwise.
  `));

  for (const [path, arity, prop, data] of kb.model.preOrderTraversal()) {
    console.log(`For property ${prop.name}:`)
    const response = await connector.send(`
    Property name: ${prop.name}
    Property description: ${prop.description}
    Provide your best guess for this metadatum as a JSON in format:
    {
      value: "Your guess here",
      confidence: "How confident your guess is from 0.0 to 1.0)"
    }`);

    try {
      const guess: GuessResponse = JSON.parse(response);
      if (guess.confidence > 0.8) {
        kb.model.setValue(path, guess.value);
      }
    }
    catch(e) {
      console.error(e);
    }
  }
}
