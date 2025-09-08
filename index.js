// ========================================
// LEONARDO CHATBOT - ARQUIVO PRINCIPAL
// ========================================


const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// require('dotenv').config();
const { askOpenAI } = require('./services/apiOpenai');
const { 
    getContextoComHistorico, 
    adicionarInteracaoHistorico,
    atualizarDadosAPI 
} = require('./utils/context');
const { 
    tratarRespostaLeonardo, 
    formatarRespostaHistorico, 
    formatarRespostaTempoReal 
} = require('./utils/response');
const ApiHistorico = require('./services/apiHistorico');
const ApiService = require('./services/apiReadRT');
const configUsuarios = require('./config/usuarios');
const configUsinas = require('./config/usinas');
const Logger = require('./utils/logger');

// Instanciar APIs
const apiHistorico = new ApiHistorico();
const apiReadRT = new ApiService();


// const verificarUsuario = (numero) => configUsuarios.usuariosPermitidos.find(u => u.numero === numero);


const obterRespostaOpenAI = async (pergunta, contexto) => {
    try {
        const resposta = await askOpenAI(pergunta, contexto);
        return { resposta, comando: null };
    } catch (error) {
        Logger.error('Erro OpenAI:', error);
        return { resposta: null, comando: null };
    }
};

const processarComando = async (comandos, userId) => {
    try {
        console.log('🔄 Processando comando:', JSON.stringify(comandos, null, 2));
        
        const comando = comandos.comando;
        const parametros = comandos.parametros;
        let dadosAPI, respostaFormatada;

        if (!comando) {
            const erro = 'Comando não especificado';
            Logger.error('processarComando: ' + erro, { comandos });
            return `❌ ${erro}`;
        }

        if (!parametros) {
            const erro = 'Parâmetros não especificados';
            Logger.error('processarComando: ' + erro, { comandos });
            return `❌ ${erro}`;
        }

        if (comando === 'leitura') {            
            if (!parametros.usina || !parametros.tipo) {
                const erro = 'Parâmetros obrigatórios ausentes para leitura (usina e tipo)';
                Logger.error('processarComando leitura: ' + erro, { parametros });
                return `❌ ${erro}`;
            }
            
            Logger.state(14, 'APITempoReal', `Consultando dados em tempo real da usina ${parametros.usina}, tipo: ${parametros.tipo}`);
            console.log('🌐 Chamando apiReadRT.getLeitura com:', { usina: parametros.usina, tipo: parametros.tipo });
            
            dadosAPI = await apiReadRT.getLeitura(parametros.usina, parametros.tipo);
            console.log('📊 Dados recebidos da API Tempo Real:', dadosAPI ? 'OK' : 'ERRO - dados nulos');
            
            if (!dadosAPI) {
                const erro = 'API de tempo real retornou dados nulos';
                Logger.error('processarComando: ' + erro);
                return `❌ ${erro}`;
            }
            
            Logger.state(15, 'FormatandoResposta', 'Formatando dados em tempo real para WhatsApp');
            console.log('dadosAPI:', dadosAPI);
            respostaFormatada = formatarRespostaTempoReal(dadosAPI);
            
        } else if (comando === 'historico') {
            if (!parametros.usina || !parametros.data_inicio || !parametros.data_fim) {
                const erro = 'Parâmetros obrigatórios ausentes para histórico (usina, data_inicio, data_fim)';
                Logger.error('processarComando historico: ' + erro, { parametros });
                return `❌ ${erro}`;
            }
            
            Logger.state(14, 'APIHistorico', `Consultando histórico da usina ${parametros.usina}, intervalo: ${parametros.data_inicio} a ${parametros.data_fim}, período: ${parametros.periodo}`);
            console.log('🌐 Chamando apiHistorico.getDadosHistoricos com:', parametros);
            
            dadosAPI = await apiHistorico.getDadosHistoricos(parametros.usina, parametros.data_inicio, parametros.data_fim, parametros.periodo);
            console.log('📊 Dados recebidos da API Histórico:', dadosAPI ? 'OK' : 'ERRO - dados nulos');
            
            if (!dadosAPI) {
                const erro = 'API de histórico retornou dados nulos';
                Logger.error('processarComando: ' + erro);
                return `❌ ${erro}`;
            }
            
            Logger.state(15, 'FormatandoResposta', 'Formatando dados históricos para WhatsApp');
            console.log('dadosAPI:', dadosAPI);
            respostaFormatada = formatarRespostaHistorico(dadosAPI);
            
        } else {
            const erro = `Comando não reconhecido: ${comando}`;
            Logger.error('processarComando: ' + erro, { comandos });
            return `❌ ${erro}`;
        }
        
        if (!respostaFormatada) {
            const erro = 'Falha na formatação da resposta';
            Logger.error('processarComando: ' + erro, { dadosAPI });
            return `❌ ${erro}`;
        }
        
        console.log('✅ Resposta formatada com sucesso, tamanho:', respostaFormatada.length);
        
        Logger.state(17, 'ArmazenandoDadosAPI', 'Salvando dados brutos da API no histórico');
        try {
            atualizarDadosAPI(userId, dadosAPI, comando);
        } catch (error) {
            Logger.error('Erro ao salvar dados no histórico (não crítico):', error);
        }
        
        return respostaFormatada;
        
    } catch (error) {
        const mensagemErro = `Erro crítico ao processar comando: ${error.message}`;
        Logger.error('processarComando ERRO CRÍTICO:', error);
        console.error('🚨 ERRO CRÍTICO no processarComando:', error);
        console.error('🚨 Stack:', error.stack);
        return `❌ ${mensagemErro}`;
    }
};

function hasPrefix(text) {
    if (!text) return false;
    return /^@leo(\s|:|$)/i.test(String(text).trim());
  }

const processarMensagem = async (msg, client) => {
    try {
        Logger.state(5, 'ProcessandoMensagem', 'Mensagem recebida, iniciando processamento');
        
        const comandoLeonardo = hasPrefix(msg.body);
        // Orientações claras e resposta imediata
        if (!comandoLeonardo) {
            Logger.state(7, 'SemPrefixo', 'Mensagem sem prefixo @leo, informando usuário');
            return;
        }
        const pergunta = msg.body.replace(/^@leo[:,]?/i, '').trim();
        if (!pergunta) {
            await msg.reply('Envie sua pergunta após @leo.');
            return;
        }
        if (pergunta.toLowerCase() === 'lista') {
            const lista = configUsuarios.usuariosPermitidos
                .map(u => `- ${u.nome}: ${u.numero} (${Array.isArray(u.usina) ? u.usina.join(', ') : u.usina})`)
                .join('\n');
            await msg.reply(`Usuários permitidos:\n${lista}`);
            return;
        }
        if (pergunta.toLowerCase() === 'ajuda') {
            const lista = 'Comandos disponíveis:\n' +
                '0. @leo: ajuda - Mostra os comandos disponíveis\n' +
                '1. @leo: lista - Lista os usuários permitidos\n' +
                '2. @leo: temperaturas em tempo real da CGH FAE\n' +
                '3. @leo: potência ativa em tempo real da CGH FAE\n' +
                '4. @leo: nível de água instantâneo da CGH FAE\n' +
                '5. @leo: valores do gerador em tempo real da CGH FAE\n' +
                '6. @leo: Qual a geração de energia da CGH FAE no mês de agosto de 2025?\n' +
                '7. @leo: Qual a geração de energia da CGH FAE no mês de julho de 2025?\n' +
                '8. @leo: Qual a geração de energia da CGH FAE hoje?\n' +
                '9. @leo: Qual a geração de energia da CGH FAE no dia 17/08/2025?';
            await msg.reply(lista);
            return;
        }
        // ESTADO 8: Preparar contexto com histórico
        Logger.state(8, 'PreparandoContexto', 'Montando contexto com histórico de interações');
        const contexto = getContextoComHistorico(msg.from, msg.body);
        console.log('contexto:', contexto);

        // ESTADO 9: Consultar OpenAI
        Logger.state(9, 'ConsultandoOpenAI', 'Enviando pergunta para OpenAI com contexto histórico');
        const respostaOpenAI = await obterRespostaOpenAI(pergunta, contexto);
        
        if (!respostaOpenAI.resposta) {
            await msg.reply('Não consegui processar sua pergunta. Tente reformular.');
            return;
        }

        // ESTADO 10: Armazenar resposta da IA imediatamente
        Logger.state(10, 'ArmazenandoRespostaIA', 'Salvando pergunta e resposta OpenAI no histórico');
        adicionarInteracaoHistorico(msg.from, pergunta, respostaOpenAI.resposta);
        
        // ESTADO 11: Processar resposta
        Logger.state(11, 'ProcessandoResposta', 'Analisando tipo de resposta (comando ou direta)');
        const respostaProcessada = await tratarRespostaLeonardo(respostaOpenAI.resposta);
        
        try {
            // Tentar processar como comando JSON usando a resposta processada
            const comando = typeof respostaProcessada === 'object' ? respostaProcessada : JSON.parse(respostaOpenAI.resposta);
            if (comando.comando) {

                // ESTADO 12: Comando detectado
                Logger.state(12, 'ConsultandoAPI', `Comando JSON detectado: ${comando.comando}`);

                // Processar comando (estados 14 ou 15, depois 16 para armazenar dados API)
                const resultado = await processarComando(comando, msg.from);
                
                // ESTADO 17: Enviar resposta formatada
                Logger.state(17, 'EnviandoResposta', 'Enviando resposta formatada da API');
                await msg.reply(resultado);
                return resultado;
            }
        } catch (e) {
            Logger.debug('Resposta não é JSON válido, tratando como resposta direta');
        }

        // ESTADO 16: Formatar resposta direta (sem API)
        Logger.state(16, 'FormatandoResposta', 'Formatando resposta direta da OpenAI');
        const respostaFinal = typeof respostaProcessada === 'object' ? 
            JSON.stringify(respostaProcessada) : respostaProcessada;

        // ESTADO 17: Enviar resposta
        Logger.state(17, 'EnviandoResposta', 'Enviando resposta direta');
        await msg.reply(respostaFinal);
        return respostaFinal;

    } catch (error) {
        const mensagemErro = `Erro crítico ao processar mensagem: ${error.message}`;
        console.error('processarMensagem ERRO CRÍTICO:', error);
    }
};

const client = new Client({ authStrategy: new LocalAuth({ clientId: 'default' }) });

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('Client is ready!'));

// Mensagem de saída do cliente do WhatsApp
client.on('message', msg => processarMensagem(msg, client));

// Mensagem de entrada enviada para mim mesmo
client.on('message_create', async msg => {
  if (!hasPrefix(msg.body)) {
    console.log('Ignorado (sem prefixo @leo) usuário: ' + msg.author);
    return;
  }

  
  console.log(msg.body);
//   const resposta = await askOpenAI(msg.body, contexto);
//   console.log(resposta);
//   msg.reply(resposta);
});

client.initialize();