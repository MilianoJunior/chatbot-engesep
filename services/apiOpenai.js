// index.js
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config(); //carrega OPENAI_API_KEY do .env

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askOpenAI(prompt, contexto) {
  try {
    // console.log('🤖 Chamando OpenAI API...');
    // console.log('🤖 Prompt:', prompt ? prompt.substring(0, 200) + '...' : 'vazio');
    // console.log('🤖 Contexto:', contexto ? contexto.substring(0, 200) + '...' : 'vazio');
    console.log('----------------------------')
    // console.log("contexto", contexto);
    // console.log("prompt", prompt);
    console.log("quantidade de contexto", contexto.length);
    console.log("quantidade de prompt", prompt.length);
    console.log('----------------------------')
    

    if (!prompt) {
      const erro = 'Prompt vazio ou nulo fornecido para OpenAI';
      console.error('❌ ' + erro);
      throw new Error(erro);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini-2025-08-07",
      messages: [
        {
          role: "system",
          content: contexto || "Você é um assistente útil."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 1000
      // temperature: 0.7
    });

    if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
      const erro = 'Resposta inválida da API OpenAI';
      console.error('❌ ' + erro, { response });
      throw new Error(erro);
    }

    const conteudo = response.choices[0].message.content;
    console.log('✅ OpenAI respondeu com sucesso, tamanho:', conteudo ? conteudo.length : 0);
    
    return conteudo;
  } catch (err) {
    console.error("🚨 ERRO na API OpenAI:", err);
    console.error("🚨 Stack:", err.stack);
    
    if (err.code === 'insufficient_quota') {
      throw new Error('Cota da API OpenAI esgotada');
    } else if (err.code === 'invalid_api_key') {
      throw new Error('Chave da API OpenAI inválida');
    } else if (err.code === 'rate_limit_exceeded') {
      throw new Error('Limite de requisições da OpenAI excedido');
    } else {
      throw new Error(`Erro na OpenAI: ${err.message}`);
    }
  }
}

module.exports = { askOpenAI };