import DataManager from "../data/DataManager";
import { Catalogue } from '../dcr/core/Catalogue.js';
import {KnowledgeBase} from "../../common/dto/KnowledgeBase";
import KnowledgeBaseManager from "../kb/KnowledgeBaseManager";
import { ThreadController } from "./openaiconnector";

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

  kb.model.getData()

  const connector = await ThreadController.Create();
  console.log(await connector.send(`
  First 20 rows of the sample data:
  ${data.slice(0, 20).join('\n')}
  Respond with a json {"code":200} if you understood the data, {"fault":"Your reason here"} otherwise.
  `));

  for (const child of Object.values(kb.format.metaProps.children)) {
    console.log(`For property ${child.property.name}:`)
    console.log(await connector.send(`
    Property name: ${child.property.name}
    Property description: ${child.property.description}
    Provide your best guess for this metadatum as a JSON in format:
    {
      value: "Your guess here",
      confidence: "How confident your guess is from 0.0 to 1.0)"
    }`));
  }
}
