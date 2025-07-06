import { BlankNode, DataFactory as df, NamedNode } from 'n3';
import { SourceManager } from '../data/source-manager.js';
import { MetaStore } from '../memory/store.js';
import { description, prefixToNamespace, title } from '../memory/vocabulary.js';
import { Configuration, Processor } from './processor.js';

const mm = prefixToNamespace['mm'];

const llmGraph = mm('llm');

export class LlmProcessorConfiguration implements Configuration {
    metaInput: Array<NamedNode>;

}

export default class LlmProcessor implements Processor<LlmProcessorConfiguration> {
    configure(config: LlmProcessorConfiguration): void {
    }

    execute(data: SourceManager, store: MetaStore, dataset: BlankNode): void {

        // TODO
        store.add(dataset, title, df.literal('ChatGPT says title'), llmGraph);
        store.add(dataset, description, df.literal('ChatGPT says description'), llmGraph);
        /*
                const schemas = store.match(null, isA, csvTableSchema);

                if (schemas.size === 0)
                    return;

                for(const schema of schemas) {
                    const header =
                }

                const header = source.meta.fields;
                const dataPreview = data.data.slice(0, 5).map(x => Object.values(x));

                const thread = await ThreadController.Create();
                thread.addMessage(`Zde je malá ukázka - prvních 20 řádků z většího datasetu:
        \`\`\`
        ${header}
        ${dataPreview.join('\n')}
        \`\`\`
        Na následující otázky odpovídej ve formátu:
        {
            value: "Tvůj tip tady" (nebo null pokud podle tebe nelze obpovědět),
            confidence: "Jak jistý jsi si svým tipem v rozmezí 0.0 do 1.0"
            process: "Proč si myslíš, že je tvá odpověď správná."
        }
          `);

                const propertiesToAsk = [
                    title,
                    description
                ]

                for(const property of propertiesToAsk) {
                    await thread.addMessage(`Jakou hodnotu by jsi vyplnil pro metadata ${property.value}? Odpověz v JSON ve formátu zmíněným výše.`);

                    const response = await thread.getResponse();

                    try {
                        const guess: {
                            value: string
                            confidence: number
                        } = JSON.parse(response)
                        store.addQuad(
                            root,
                            property,
                            df.literal(guess.value)
                        )
                    } catch (e) {
                        logger.error(e)
                    }
                }
        */
    }

}
