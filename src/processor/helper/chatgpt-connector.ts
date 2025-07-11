import OpenAI from 'openai';
// @ts-expect-error TS2307: Cannot find module openai/resources/beta/threads or its corresponding type declarations.
import { TextContentBlock } from 'openai/resources/beta/threads';
import { getScopedLogger } from '../../logger.js';

const logger = getScopedLogger('ChatGPT Connector')

const openAi = new OpenAI();

export class ThreadController {

    thread: OpenAI.Beta.Thread;

    private constructor() {
    }

    public static async Create(): Promise<ThreadController> {
        const thread = new ThreadController();
        await thread.init();

        return thread;
    }

    public async addMessage(body: string) {
        logger.info(`ChatGPT <<\n${body}`);
        await openAi.beta.threads.messages.create(this.thread.id, {
            role: 'user', content: body,
        });
    }

    public async getResponse() {
        const run = await openAi.beta.threads.runs.createAndPoll(this.thread.id, {
            assistant_id: 'asst_lLg0nzhnP9mSEZlNI4UXa4CL',
        });

        if (run.status === 'completed') {
            const messages = await openAi.beta.threads.messages.list(run.thread_id);

            const response = (messages.data[0].content[0] as TextContentBlock).text.value;

            logger.info(`ChatGPT >> ${response}`);

            return response;
        }

        throw new Error(`Failed to send message: ${run.status}`);
    }

    private async init(): Promise<void> {
        this.thread = await openAi.beta.threads.create();
    }
}
