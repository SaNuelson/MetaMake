import OpenAI from 'openai'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const basedir = path.join(dirname, '../../')
dotenv.config({ path: basedir + '/.env' })

const openai = new OpenAI()

const thread = await openai.beta.threads.create()

// const run = await openai.beta.threads.runs.createAndPoll(
//   thread.id,
//   {
//     assistant_id: "asst_lLg0nzhnP9mSEZlNI4UXa4CL",
//     instructions: "Fill 5 more rows in the table.html file and return it as html file."
//   }
// );
//
// if (run.status === 'completed') {
//   const messages = await openai.beta.threads.messages.list(
//     run.thread_id
//   );
//   for (const message of messages.data.reverse()) {
//     console.log(`${message.role} > ${message.content[0].text.value}`);
//   }
// } else {
//   console.log(run.status);
// }

const message = await openai.beta.threads.messages.create(thread.id, {
  role: 'user',
  content: 'Fill 5 more rows in the table.html file with data you made up.'
})

const run = openai.beta.threads.runs
  .stream(thread.id, {
    assistant_id: 'asst_lLg0nzhnP9mSEZlNI4UXa4CL'
  })
  .on('textCreated', (text) => process.stdout.write('\nassistant > '))
  .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
  .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
  .on('toolCallDelta', (toolCallDelta, snapshot) => {
    if (toolCallDelta.type === 'code_interpreter') {
      if (toolCallDelta.code_interpreter.input) {
        process.stdout.write(toolCallDelta.code_interpreter.input)
      }
      if (toolCallDelta.code_interpreter.outputs) {
        process.stdout.write('\noutput >\n')
        toolCallDelta.code_interpreter.outputs.forEach((output) => {
          if (output.type === 'logs') {
            process.stdout.write(`\n${output.logs}\n`)
          }
        })
      }
    }
  })
