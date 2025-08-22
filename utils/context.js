// Contexto do Leonardo - Assistente IA da EngeSEP
const Logger = require('./logger');

const CONFIG_HISTORICO = {
    maxPerguntas: 5,
    incluirRespostas: true,
    incluirTimestamp: true,
    separador: '\n────────────────────────────────────────────────────────\n',
    incluirDadosAPI: true
};

// Estrutura atualizada do histórico
let historicoInteracoes = new Map();

/**
 * Adiciona uma interação completa ao histórico
 */
function adicionarInteracaoHistorico(userId, pergunta, respostaOpenAI) {
    try {
        if (!historicoInteracoes.has(userId)) {
            historicoInteracoes.set(userId, []);
        }

        const historico = historicoInteracoes.get(userId);
        const novaInteracao = {
            timestamp: new Date().toISOString(),
            pergunta: pergunta,
            respostaOpenAI: respostaOpenAI,
            dadosAPI: null,
            tipoComando: null
        };

        historico.push(novaInteracao);

        // Manter apenas o número máximo configurado
        if (historico.length > CONFIG_HISTORICO.maxPerguntas) {
            historico.shift();
        }

        historicoInteracoes.set(userId, historico);
        
        Logger.debug(`Histórico atualizado para ${userId}: ${historico.length} interações`);
    } catch (error) {
        console.log(error);
        Logger.error('Erro ao adicionar interação ao histórico:', error);
    }
}

/**
 * Atualiza a última interação com dados da API
 */
function atualizarDadosAPI(userId, dadosAPI, tipoComando) {
    try {
        if (!historicoInteracoes.has(userId)) {
            return;
        }

        const historico = historicoInteracoes.get(userId);
        if (historico.length === 0) {
            return;
        }

        // Atualizar a última interação
        const ultimaInteracao = historico[historico.length - 1];
        ultimaInteracao.dadosAPI = dadosAPI;
        ultimaInteracao.tipoComando = tipoComando;

        historicoInteracoes.set(userId, historico);
        
        Logger.debug(`Dados API adicionados ao histórico: tipo=${tipoComando}`);
    } catch (error) {
        console.log(error);
        Logger.error('Erro ao atualizar dados da API no histórico:', error);
    }
}

function obterHistoricoFormatado(userId) {
    if (!historicoInteracoes.has(userId)) return '';
    const historico = historicoInteracoes.get(userId);
    if (!historico.length) return '';
  
    let out = '\n\n=== HISTÓRICO DE INTERAÇÕES ANTERIORES ===\n';
    out += `Total de interações no contexto: ${historico.length}\n\n`;
  
    historico.forEach((item, i) => {
        out += `🔹 INTERAÇÃO ${i + 1}\n`;
        if (CONFIG_HISTORICO.incluirTimestamp) {
            out += `Data/Hora: ${new Date(item.timestamp).toLocaleString('pt-BR')}\n`;
        }
        out += `Pergunta do usuário: "${item.pergunta}"\n`;
  
        // Resposta OpenAI (comando x texto)
        if (item.respostaOpenAI) {
            try {
                const json = JSON.parse(item.respostaOpenAI);
                if (json.comando) {
                    out += `Comando gerado: ${json.comando}\n`;
                    if (json.parametros) {
                        out += `Parâmetros: ${JSON.stringify(json.parametros)}\n`;
                    }
                } else {
                    out += `Resposta direta: ${item.respostaOpenAI.substring(0, 100)}...\n`;
                }
            } catch {
                const resumo = item.respostaOpenAI.substring(0, 100);
                out += `Resposta: ${resumo}${item.respostaOpenAI.length > 100 ? '...' : ''}\n`;
            }
        }
  
        // Dados da API quando não forem nulos
        if (CONFIG_HISTORICO.incluirDadosAPI && item.dadosAPI) {
            const tipo = item.tipoComando || 'N/A';
            out += `Tipo de consulta API: ${tipo}\n`;
  
            if (tipo === 'historico') {
                out += `Dados históricos consultados:\n`;
                out += `  Usina: ${item.dadosAPI.usina || 'N/A'}\n`;
                out += `  Período: ${item.dadosAPI.periodo || 'N/A'}\n`;
                
                const res = item.dadosAPI.resultado;
                if (res && typeof res === 'object') {
                    const keys = Object.keys(res);
                    out += `  Unidades geradoras: ${keys.join(', ')}\n`;
                    
                    // Calcular totais aproximados
                    let totalGeral = 0;
                    keys.forEach(k => {
                        const dados = res[k];
                        if (Array.isArray(dados)) {
                            const soma = dados.reduce((acc, it) => {
                                const v = it.producao_Mwh || it.producao_mwh || it.MWh || it.mwh || it.valor || it.value || 0;
                                return acc + (typeof v === 'number' ? v : 0);
                            }, 0);
                            totalGeral += soma;
                            out += `     ${k}: ${dados.length} registros, soma: ${soma.toFixed(2)} MWh\n`;
                        }
                    });
                    if (totalGeral > 0) {
                        out += `  Total geral aproximado: ${totalGeral.toFixed(2)} MWh\n`;
                    }
                }
  
            } else if (tipo === 'leitura') {
                out += `Dados em tempo real consultados:\n`;
                out += `  Usina: ${item.dadosAPI.usina || 'N/A'}\n`;
                out += `  Timestamp: ${item.dadosAPI.timestamp || 'N/A'}\n`;
                
                const ugs = item.dadosAPI.unidades_geradoras || item.dadosAPI.ugs || null;
                if (ugs && typeof ugs === 'object') {
                    Object.keys(ugs).forEach(ug => {
                        const u = ugs[ug] || {};
                        out += `  ${ug}:\n`;
                        if (u.erro) {
                            out += `    Erro: ${u.erro}\n`;
                        } else if (u.dados) {
                            Object.keys(u.dados).forEach(tipoDado => {
                                const dadoValor = u.dados[tipoDado];
                                out += `    ${tipoDado}: `;
                                if (dadoValor && typeof dadoValor === 'object') {
                                    // Se é um objeto, mostrar suas propriedades
                                    const valores = Object.keys(dadoValor).map(k => `${k}: ${dadoValor[k]}`).join(', ');
                                    out += `{${valores}}\n`;
                                } else {
                                    // Se é um valor simples
                                    out += `${dadoValor}\n`;
                                }
                            });
                        } else {
                            out += `    Sem dados disponíveis\n`;
                        }
                    });
                }
            }
        }
        out += '\n';
    });
  
    out += '=== FIM DO HISTÓRICO ===\n\n';
    return out;
}

/**
 * Obtém contexto completo com histórico
 */
function getContextoComHistorico(userId, usinasPermitidas) {
    const contextoBase = getContextoLeonardo(userId, usinasPermitidas);
    const historico = obterHistoricoFormatado(userId);
    
    return contextoBase + historico;
}

/**
 * Limpa o histórico de um usuário específico
 */
function limparHistoricoUsuario(userId) {
    historicoInteracoes.delete(userId);
}

/**
 * Limpa todo o histórico de todos os usuários
 */
function limparTodoHistorico() {
    historicoInteracoes.clear();
}

/**
 * Obtém estatísticas do histórico
 */
function obterEstatisticasHistorico() {
    const totalUsuarios = historicoInteracoes.size;
    let totalPerguntas = 0;
    
    for (const historico of historicoInteracoes.values()) {
        totalPerguntas += historico.length;
    }
    
    return {
        totalUsuarios,
        totalPerguntas,
        maxPerguntasPorUsuario: CONFIG_HISTORICO.maxPerguntas,
        configuracao: { ...CONFIG_HISTORICO }
    };
}

/**
 * Atualiza a configuração do histórico
 */
function atualizarConfigHistorico(novaConfig) {
    Object.assign(CONFIG_HISTORICO, novaConfig);
}

function getContextoLeonardo(userId, usinasPermitidas) {
    // Obter data e hora atual
    const agora = new Date();
    const dataAtual = agora.toLocaleDateString('pt-BR');
    const horaAtual = agora.toLocaleTimeString('pt-BR');
    const diaSemana = agora.toLocaleDateString('pt-BR', { weekday: 'long' });
    const mesAtual = agora.toLocaleDateString('pt-BR', { month: 'long' });
    const anoAtual = agora.getFullYear();
    
    // Calcular datas relativas importantes
    const ontem = new Date(agora);
    ontem.setDate(agora.getDate() - 1);
    const dataOntem = ontem.toLocaleDateString('pt-BR');
    
    // Últimos 3 meses para consultas
    const mes1Atras = new Date(agora);
    mes1Atras.setMonth(agora.getMonth() - 1);
    const dataMes1Atras = `01/${String(mes1Atras.getMonth() + 1).padStart(2, '0')}/${mes1Atras.getFullYear()}`;
    const fimMes1Atras = new Date(mes1Atras.getFullYear(), mes1Atras.getMonth() + 1, 0);
    const dataFimMes1Atras = fimMes1Atras.toLocaleDateString('pt-BR');
    
    const mes2Atras = new Date(agora);
    mes2Atras.setMonth(agora.getMonth() - 2);
    const dataMes2Atras = `01/${String(mes2Atras.getMonth() + 1).padStart(2, '0')}/${mes2Atras.getFullYear()}`;
    const fimMes2Atras = new Date(mes2Atras.getFullYear(), mes2Atras.getMonth() + 1, 0);
    const dataFimMes2Atras = fimMes2Atras.toLocaleDateString('pt-BR');
    
    const mes3Atras = new Date(agora);
    mes3Atras.setMonth(agora.getMonth() - 3);
    const dataMes3Atras = `01/${String(mes3Atras.getMonth() + 1).padStart(2, '0')}/${mes3Atras.getFullYear()}`;
    const fimMes3Atras = new Date(mes3Atras.getFullYear(), mes3Atras.getMonth() + 1, 0);
    const dataFimMes3Atras = fimMes3Atras.toLocaleDateString('pt-BR');
    
    // Últimos 3 dias
    const tresDiasAtras = new Date(agora);
    tresDiasAtras.setDate(agora.getDate() - 3);
    const dataTresDiasAtras = tresDiasAtras.toLocaleDateString('pt-BR');

    return `
INSTRUÇÕES SISTEMA LEONARDO - ASSISTENTE IA ENGESEP

IDENTIDADE E FUNÇÃO:
Nome: Leonardo
Papel: Assistente virtual especializado em usinas hidroelétricas
Empresa: EngeSEP
Interface: WhatsApp
Tom: Profissional, técnico, objetivo e prestativo

CONTEXTO TEMPORAL ATUAL:
Data/Hora: ${dataAtual} às ${horaAtual}
Dia da semana: ${diaSemana}
Mês/Ano: ${mesAtual} de ${anoAtual}

O ${userId} tem acesso às seguintes usinas: ${usinasPermitidas.join(', ')}, sendo assim, não responda com dados de usinas não permitidas, apenas envie uma menssagem que ele não tem acesso.

🏭 DADOS DAS USINAS HIDROELÉTRICAS:

🔹 CGH APARECIDA:
• Razão Social: CGH Aparecida Energia LTDA
• CNPJ: 23.607.291/0001-86
• Localização: Entre Rios, SC
• Capacidade: 3,2 MW (Turbina Kaplan + Gerador 3,65 MW)
• Início: 06/08/2018
• Geração histórica: 2021: 5.645 MWh | 2022: 8.559 MWh | 2023: 5.354 MWh | 2024: 8.402 MWh
• Acionistas: Denilson Casal (56%), Gelson Oliveira (5%), José Caramori (14%), Jelder Bavaresco (15%), Luciano Ribeiro (1,5%), José Gustamann (1,5%)

🔹 CGH FAE:
• Razão Social: Fae Energética Ltda
• CNPJ: 32.927.636/0001-70
• Localização: Capinzal, SC
• Capital Social: R$ 3.500.000,00
• Início: 01/03/2019

🔹 CGH PICADAS ALTAS:
• Razão Social: CGH Picadas Altas Energia SPE Ltda
• CNPJ: 41.234.054/0001-07
• Localização: Marema, SC
• Capital Social: R$ 2.000.000,00
• Início: 16/03/2021

🔹 CGH HOPPEN:
• Razão Social: CGH Hoppen Caveiras Energia Ltda
• CNPJ: 38.352.880/0001-38
• Localização: Lages, SC
• Capital Social: R$ 12.000.000,00
• Início: 04/09/2020

🔹 PCH DAS PEDRAS:
• Razão Social: Euclides Maciel Energética S.A.
• CNPJ: 08.812.700/0001-92
• Localização: Xanxerê, SC
• Capacidade: 5,6 MW
• Operação comercial: 23/12/2017

Possibilidades de acesso:

Suas respostas serão analisadas por uma função que vai verificar se existe um comando JSON válido.
Se existir, elas vão ser tratadas, podendo gerar uma consulta em uma API de tempo real ou histórico.
Se não existir, sua resposta vai retornar diretamente para o usuário.

Para acessar a API de tempo real, você deve gerar um comando JSON com o seguinte formato:
{"comando":"leitura","parametros":{"tipo":"potencias|nivel_agua|gerador|temperaturas","usina":"NOME_DA_USINA"}}

Ou então, para acessar a API de histórico:
{"comando":"historico","parametros":{"usina":"nome_usina","data_inicio":"DD/MM/YYYY","data_fim":"DD/MM/YYYY","periodo":"day|month"}}

Quando houver QUALQUER referência de tempo:
Palavras-chave: hoje, ontem, anteontem, últimos X dias, semana passada, mês passado, 
últimos X meses, este mês, este ano, janeiro, fevereiro, etc.
Gere o comando JSON para consulta na API de dados históricos.

Quando não houver referência de tempo e o usuário peguntar sobre valores instantâneos:
Palavras-chave: agora, atual, neste momento, tempo real, status atual
Gere o comando JSON para consulta na API de dados em tempo real.

Se não houver referência a valores instantâneos ou históricos, você deve pesquisar nas interações e responder diretamente para o usuário conforme contexto.

DATAS DE REFERÊNCIA CALCULADAS:
• Hoje: ${dataAtual}
• Ontem: ${dataOntem}
• Últimos 3 dias: ${dataTresDiasAtras} até ${dataAtual}
• Mês passado: ${dataMes1Atras} até ${dataFimMes1Atras}
• 2 meses atrás: ${dataMes2Atras} até ${dataFimMes2Atras}
• 3 meses atrás: ${dataMes3Atras} até ${dataFimMes3Atras}

REGRAS:

- Respostas devem ser sempre em português brasileiro.
- Sempre analisar se a pergunta contém referência temporal!
- Suas respostas tem integração de contexto para respostas anteriores.
- Suas respostas são unitárias, sendo necessário novo comando para emitir outra resposta.

EXEMPLOS PRÁTICOS DE COMANDOS:

CONSULTAS HISTÓRICAS (sempre usar "historico"):

    Geração da FAE nos últimos 3 meses:
    {"comando":"historico","parametros":{"usina":"cgh_fae","data_inicio":"${dataMes3Atras}","data_fim":"${dataAtual}","periodo":"month"}}

    Produção da Hoppen hoje:
    {"comando":"historico","parametros":{"usina":"cgh_hoppen","data_inicio":"${dataAtual}","data_fim":"${dataAtual}","periodo":"day"}}

    Dados da Aparecida últimos 3 dias:
    {"comando":"historico","parametros":{"usina":"cgh_aparecida","data_inicio":"${dataTresDiasAtras}","data_fim":"${dataAtual}","periodo":"day"}}

    Geração mensal da PCH Pedras em julho 2025:
    {"comando":"historico","parametros":{"usina":"pch_pedras","data_inicio":"01/07/2025","data_fim":"31/07/2025","periodo":"month"}}
    OBS: Essas respostas vão ser formatadas em código para enviar para o usuário, não sendo retrasmitidas para você.
    Os dados Históricos estão disponíveis apenas para a geração de energia elétrica em MWh, temperaturas, nível de água e alarmes não estão disponíveis.

CONSULTAS TEMPO REAL (usar "leitura"):

    Potência atual da CGH Aparecida:
    {"comando":"leitura","parametros":{"tipo":"potencias","usina":"CGH-APARECIDA"}}

    Temperatura atual da FAE:
    {"comando":"leitura","parametros":{"tipo":"temperaturas","usina":"CGH-FAE"}}

    Nível de água atual da CGH Aparecida:
    {"comando":"leitura","parametros":{"tipo":"nivel_agua","usina":"CGH-APARECIDA"}}

NOMENCLATURA IMPORTANTE:
• Para "historico": usar lowercase com underscore (cgh_fae, cgh_hoppen, pch_pedras, cgh_picadas_altas, cgh_aparecida)
• Para "leitura": usar UPPERCASE com hífen (CGH-FAE, CGH-HOPPEN, PCH-PEDRAS, CGH-PICADAS-ALTAS, CGH-APARECIDA)

INSTRUÇÕES CRÍTICAS:
1. SEMPRE retornar JSON válido para consultas de dados em tempo real ou histórico
2. NUNCA responder "vou consultar" ou "aguarde" 
3. Para dados estáticos (CNPJ, razão social), responder em linguagem natural
4. Usar as datas de referência calculadas automaticamente
5. Para múltiplos meses, fazer UMA consulta com data_inicio do mês mais antigo
6. Se os dados não estiverem disponíveis no contexto de interações anteriores, faça uma consulta na API de dados em tempo real ou histórico.
`;
}

// Dados das usinas para validação e referência
const USINAS_DISPONIVEIS = {
    'CGH-APARECIDA': {
        nome: 'CGH Aparecida',
        cnpj: '23.607.291/0001-86',
        localizacao: 'Entre Rios, SC',
        capacidade: '3.2 MW'
    },
    'CGH-FAE': {
        nome: 'CGH FAE',
        cnpj: '32.927.636/0001-70',
        localizacao: 'Capinzal, SC',
        capacidade: '2.0 MW'
    },
    'CGH-PICADAS-ALTAS': {
        nome: 'CGH Picadas Altas',
        cnpj: '41.234.054/0001-07',
        localizacao: 'Marema, SC',
        capacidade: '1 MW'
    },
    'CGH-HOPPEN': {
        nome: 'CGH Hoppen Caveiras',
        cnpj: '38.352.880/0001-38',
        localizacao: 'Lages, SC',
        capacidade: '2.6 MW'
    },
    'PCH-PEDRAS': {
        nome: 'PCH das Pedras',
        cnpj: '08.812.700/0001-92',
        localizacao: 'Xanxerê, SC',
        capacidade: '5.6 MW'
    }
};

// Função para obter contexto formatado para o usuário
function getContextoFormatado(usuario, usinasDisponiveis) {
    return `Usuário: ${usuario.nome}
Usinas disponíveis: ${usinasDisponiveis.join(', ')}
${getContextoLeonardo()}`;
}

// Função para validar nome de usina
function validarNomeUsina(nome) {
    const nomesValidos = Object.keys(USINAS_DISPONIVEIS);
    return nomesValidos.includes(nome.toUpperCase());
}

// Função para obter dados da usina
function getDadosUsina(nome) {
    return USINAS_DISPONIVEIS[nome.toUpperCase()] || null;
}

// Função para obter lista de usinas disponíveis
function getListaUsinas() {
    return Object.keys(USINAS_DISPONIVEIS);
}

// Função para obter contexto atualizado (com data/hora)
function getContextoAtualizado() {
    return getContextoLeonardo();
}

module.exports = {
    getContextoAtualizado,
    adicionarInteracaoHistorico,
    atualizarDadosAPI,
    getContextoComHistorico,
    obterHistoricoFormatado,
    limparHistoricoUsuario,
    limparTodoHistorico,
    obterEstatisticasHistorico,
    atualizarConfigHistorico,
    USINAS_DISPONIVEIS,
    getContextoFormatado,
    validarNomeUsina,
    getDadosUsina,
    getListaUsinas
};