// test_queries.js - Script para testar funcionalidades do bot WhatsApp Leonardo
// Rode com: node test_queries.js
// Simula mensagens e processa sem WhatsApp real

const { processarMensagem } = require('./index');  // Importa do seu index.js
const Logger = require('./utils/logger');

// Mock de client WhatsApp (para evitar envios reais)
const mockClient = {
  sendMessage: async (numero, mensagem) => {
    console.log(`[SIMULADO] Mensagem enviada para ${numero}: ${mensagem}`);
  }
};

// Mock de mensagem WhatsApp
function createMockMessage(body, from = '554998385500@c.us') {
  return {
    body,
    from,
    getChat: async () => ({ isGroup: false, id: { _serialized: from } })
  };
}

// Lista de queries de teste
const testQueries = [
  // Testes de Histórico Expandido
  '@leo: energia gerada nos últimos 3 dias na CGH-FAE?',  // producao-acumulada, periodo D
  '@leo: potências ontem na PCH-PEDRAS?',  // grupo-usina, grupo "potencia"
  '@leo: temperaturas da UG-01 nas ultimas 2 horas na CGH-APARECIDA?',  // grupo-usina, grupo "temperaturas"
  '@leo: nível montante hoje na CGH-FAE?',  // sensor-usina, variavel "Nível Montante"
  '@leo: Qual a geração de energia da CGH FAE no dia 17/08/2025?',
  '@leo: Qual a geração de energia da CGH Hoppen no mês de agosto de 2025?',
// //   '@leo: todos os dados brutos ontem na CGH-HOPPEN?',  // tabela-usina (dump completo)

//   // Testes de Tempo Real (leitura)
  '@leo: potência atual da CGH-PICADAS-ALTAS?',  // leitura, tipo "potencias"
  '@leo: temperaturas agora na PCH-PEDRAS?',  // leitura, tipo "temperaturas"
  '@leo: nível de água neste momento na CGH-FAE?',  // leitura, tipo "nivel_agua"

  // Testes RT rápidos (respostas curtas - 1 UG ou 1 dado)
  '@leo: potência ativa agora na CGH-APARECIDA?',  // leitura, 1 UG → resposta curta
  '@leo: gerador da CGH-HOPPEN agora?',  // leitura, tipo "gerador"
  '@leo: nível de água atual da CGH-HOPPEN?',  // leitura, nivel_agua

  // Testes Histórico curtos (1 dia / 1 usina pequena)
  '@leo: energia gerada hoje na CGH-APARECIDA?',  // producao-acumulada, 1 dia, 1 UG
  '@leo: nível jusante ontem na CGH-FAE?',  // sensor-usina, variavel "Nível Jusante"

  // Testes de Resumo e Comandos Especiais
  '@leo: resumo da CGH-APARECIDA?',  // resumo
  '@leo: resumo da PCH-PEDRAS?',  // resumo
  '@leo: resumo da CGH-HOPPEN?',  // resumo
  '@leo: resumo da CGH-PICADAS-ALTAS?',  // resumo
  '@leo: resumo da CGH-FAE?',  // resumo
  
  '@leo: lista',  // lista de usuários
  '@leo: ajuda'   // ajuda com comandos
];

// Função para rodar testes sequencialmente
async function runTests() {
  const startTimeG = Date.now();
  for (const query of testQueries) {
    console.log(`\n=== TESTANDO QUERY: ${query} ===`);
    const startTime = Date.now();
    const mockMsg = createMockMessage(query);
    try {
      await processarMensagem(mockMsg, mockClient);
    } catch (error) {
      Logger.error(`Erro no teste da query "${query}":`, error);
    }
    const endTime = Date.now();
    console.log(`Tempo de execução: ${(endTime - startTime) / 1000}s`);
    await new Promise(resolve => setTimeout(resolve, 1000));  // Delay de 1s entre testes
  }
  console.log('\n=== TESTES CONCLUÍDOS ===');
  const endTimeG = Date.now();
  console.log(`Tempo total de execução: ${(endTimeG - startTimeG) / 1000}s`);
}

// Inicie os testes
runTests();