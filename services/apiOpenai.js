// index.js
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config(); // carrega OPENAI_API_KEY do .env

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askOpenAI(prompt, contexto) {
  try {
    console.log('--------------------------------');
    console.log('prompt:', prompt);
    console.log('--------------------------------');
    console.log('contexto:', contexto);
    console.log('--------------------------------');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: contexto
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.choices[0].message.content; // texto gerado
  } catch (err) {
    console.error("Erro na API OpenAI:", err.message);
    return null;
  }
}

module.exports = { askOpenAI };