import OpenAI from "openai";
import dotenv from "dotenv";
import {fileURLToPath} from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const basedir = path.join(dirname, '../../')
dotenv.config({path: basedir + '/.env'})

const openai = new OpenAI();
(async function() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
})();