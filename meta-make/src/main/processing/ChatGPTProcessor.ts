import MetaFormat from "../../common/dto/MetaFormat";
import MetaModel from '../../common/dto/MetaModel'
import { Processor } from './Processor'
import Property, { StructuredProperty } from "../../common/dto/Property.js";
import DataSource from "../data/DataSource.js";
import { ThreadController } from "./openaiconnector.js";
import DcatApCz from "../custom/format/DcatApCz.js"
import MetaStore from "../data/MetaStore.js";
import { LogLevel } from "../../common/constants.js";
import { MandatoryArity } from '../../common/dto/ArityBounds.js'

export const ChatGPTConfigFormat = new MetaFormat(
  "ChatGPTConfigFormat",
  new StructuredProperty({
    name: "ChatGPTConfig",
    description: "Configuration for the JSON Schema processor",
    propertyDefinitions: [
      {
        arity: MandatoryArity,
        property: new Property({
          name: "Language",
          description: "Language of the ChatGPT prompts (ideally identical to MetaFormat)",
          type: 'string',
          domain: [{value: 'en'}, {value: 'cs'}],
          isDomainStrict: true
        })
      },
      {
        arity: MandatoryArity,
        property: new Property({
          name: "Minimal confidence",
          description: "Confidence of the ChatGPT's responses below which guesses won't be considered.",
          type: 'number'
        })
      }
    ]
  })
)

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
    guessRequest: (prop: Property) => `Provide your best guess in form of mentioned JSON for metadata ${prop.name} (${prop.description}):`
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
    guessRequest: (prop: Property) => `Jaký je tvůj tip na metadata ${prop.name} (${prop.description})? Odpověz v JSON ve formátu zmíněným výše.`
  }
}

class ChatGPTProcessor<T extends MetaFormat> implements Processor {
  outputFormat: T
  config?: MetaModel

  constructor(outputFormat: T) {
    this.outputFormat = outputFormat;
  }

  getName() {
    return `ChatGPTProcessor<${this.outputFormat.name}>`
  }

  getDescription(): string {
    return `Processor using OpenAI's ChatGPT API which creates a ${this.outputFormat.name} model using ChatGPT's guesses.`
  }

  initialize(targetFormat: T, _knownFormats: MetaFormat[], config?: MetaModel): void {
    if (targetFormat.name !== this.outputFormat.name)
      throw new Error(`${this.getName()} incompatible with ${targetFormat.name}`);

    this.config = config
  }

  getInputFormats(): MetaFormat[] {
    return []
  }

  getConfigFormat(): MetaFormat {
    return ChatGPTConfigFormat
  }

  getOutputFormat(): MetaFormat {
    return this.outputFormat
  }

  async execute(
    dataSource: DataSource,
    inputModels: Map<MetaFormat, MetaModel[]>
  ): Promise<MetaModel> {
    const dataPreview = await dataSource.getData(20)

    const newModel = new MetaModel(this.outputFormat)

    const connector = await ThreadController.Create()

    // TODO
    const localization = queryLocalization[this.outputFormat.name === DcatApCz.name ? 'cz' : 'en']

    await connector.addMessage(localization.initialMessage(dataPreview.join('  \n')))

    let answerLimit = 0
    for (const [path, arity, prop, data] of newModel.preOrderTraversal()) {
      if (prop instanceof StructuredProperty) {
        continue
      }

      if (--answerLimit <= 0) {
        newModel.setValue(path, `ChatGPT guess for ${prop.name}`)
        continue
      }

      await connector.addMessage(localization.guessRequest(prop))

      const response = await connector.getResponse()

      try {
        const guess: GuessResponse = JSON.parse(response)
        newModel.setValue(path, guess.value)
      } catch (e) {
        console.error(e)
      }
    }

    if (MetaStore.logLevel >= LogLevel.Log) console.log('chatGPT generateMetadata() finished.')

    return newModel
  }
}

export const ChatGPTDcatApCzProcessor = new ChatGPTProcessor(DcatApCz);
