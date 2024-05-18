import DataManager from "../data/DataManager";
import {KnowledgeBase} from "../../common/dto/KnowledgeBase";
import KnowledgeBaseManager from "../kb/KnowledgeBaseManager";
import { ThreadController } from "./openaiconnector";
import MetaModel from "../../common/dto/MetaModel";
import MetaProperty, { StructuredMetaProperty } from "../../common/dto/MetaProperty";
import MetaStore from "../data/MetaStore.js";
import { LogLevel } from "../../common/constants.js";
import DcatApCz from "../format/DcatApCz.js";

interface GuessResponse {
  value: string,
  confidence: number
}

const queryLocalization = {
  en: {
    initialMessage: (dataSlice: string) => `Here is a sample of the data - the first 20 rows:
  \`\`\`\n${dataSlice}\n\`\`\`
  Answer the following questions using format:
  {
      value: "Your guess here" (or null if your guess is the question can't be answered),
      confidence: "How confident your guess is from 0.0 to 1.0"
      process: "Your thought process behind the assumption."
  }
  `,
    guessRequest: (prop: MetaProperty) => `Provide your best guess in form of mentioned JSON for metadata ${prop.name} (${prop.description}):`
  },
  cz: {
    initialMessage: (dataSlice: string) => `Zde je malá ukázka - prvních 20 řádků z většího datasetu:
  \`\`\`\n${dataSlice}\n\`\`\`
  Na následující otázky odpovídej ve formátu:
  {
      value: "Tvůj tip tady" (nebo null pokud podle tebe nelze obpovědět),
      confidence: "Jak jistý jsi si svým tipem v rozmezí 0.0 do 1.0"
      process: "Proč si myslíš, že je tvá odpověď správná."
  }
  `,
    guessRequest: (prop: MetaProperty) => `Jaký je tvůj tip na metadata ${prop.name} (${prop.description})? Odpověz v JSON ve formátu zmíněným výše.`
  }
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

  const localization = queryLocalization[kb.format.name === DcatApCz.name ? 'cz' : 'en'];

  await connector.addMessage(localization.initialMessage(data.slice(0,20).join('  \n')));

  let answerLimit = 2;
  for (const [path, arity, prop, data] of kb.model.preOrderTraversal()) {
    if (prop instanceof StructuredMetaProperty) {
      continue;
    }

    if (--answerLimit <= 0) {
      newModel.setValue(path, `ChatGPT guess for ${prop.name}`);
      continue;
    }

    await connector.addMessage(localization.guessRequest(prop));

    const response = await connector.getResponse();

    try {
      const guess: GuessResponse = JSON.parse(response);
      newModel.setValue(path, guess.value);
    }
    catch(e) {
      console.error(e);
    }
  }

  if (MetaStore.logLevel >= LogLevel.Log)
    console.log("chatGPT generateMetadata() finished.");
  return newModel;
}
