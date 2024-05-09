import OpenAI from 'openai'
import { TextContentBlock } from "openai/resources/beta/threads";

const openAi = new OpenAI()

export class ThreadController {

  // @ts-ignore
  thread: OpenAI.Beta.Thread

  private constructor() {}
  private async init(): Promise<void> {
    this.thread = await openAi.beta.threads.create()
  }

  public static async Create(): Promise<ThreadController> {
    const thread = new ThreadController();
    await thread.init();

    return thread;
  }

  public async send(body: string): Promise<string> {
    let run = await openAi.beta.threads.runs.createAndPoll(
      this.thread.id,
      {
        assistant_id: "asst_lLg0nzhnP9mSEZlNI4UXa4CL",
        instructions: body
      }
    )

    if (run.status === 'completed') {
      const messages = await openAi.beta.threads.messages.list(run.thread_id);
      return (messages.data[0].content[0] as TextContentBlock).text.value
    }

    throw new Error(`Failed to send message: ${run.status}`);
  }
}
