// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. processarMensagem → coordena análise da mensagem da usina
// 2. obterRespostaOpenAI → consulta a IA com histórico
// 3. processarComando → chama APIs operacionais
// 4. enviarMensagem → devolve resultado ao WhatsApp
// 5. hasPrefix → valida prefixo @leo
// -------------------------------------------------------------------

// CONFIGURAÇÕES E DEPENDÊNCIAS
const WhatsAppService = require('./utils/ClientWhatsAPP');
require('dotenv').config();
const { askOpenAI } = require('./services/apiOpenai');
const {
    getContextoComHistorico,
    adicionarInteracaoHistorico,
    atualizarDadosAPI
} = require('./utils/context');
const {
    tratarRespostaLeonardo,
    formatarRespostaHistorico,
    formatarRespostaTempoReal,
    formatarRespostaResumo
} = require('./utils/response');
const { filtrarUsinasPorContexto } = require('./utils/textHelper'); // Importando helper
const ApiHistorico = require('./services/apiHistorico');
const ApiService = require('./services/apiReadRT');
const ResumoService = require('./services/resumoService');
const configUsuarios = require('./config/usuarios');
// const configUsinas = require('./config/usinas');
const Logger = require('./utils/logger');

// Instanciar APIs
const wa = new WhatsAppService({ dataPath: './sessions', headless: true });
const apiHistorico = new ApiHistorico();
const apiReadRT = new ApiService();
const resumoService = new ResumoService(apiReadRT, apiHistorico);

const enviarMensagem = async (client, mensagem, numero) => {
    try {
        await client.sendMessage(numero, mensagem);
        console.log('--------------------------------');
        console.log('Mensagem enviada com sucesso para:', numero);
        console.log('Mensagem:', mensagem);
        console.log('--------------------------------');
        return true;
    } catch (error) {
        return false;
    }
};

const obterRespostaOpenAI = async (pergunta, contexto) => {
    try {
        const resposta = await askOpenAI(pergunta, contexto);
        return { resposta, comando: null };
    } catch (error) {
        return { resposta: null, comando: null };
    }
};

const errors = {
    param: (p) => `❌ Parâmetros obrigatórios ausentes: ${p}`,
    servico: (s) => `❌ Serviço desconhecido ou inválido: ${s}`,
    dados: (s) => `❌ Dados nulos retornados pelo serviço: ${s}`,
    format: (s) => `❌ Falha ao formatar resposta: ${s}`,
    save: (e) => `⚠️ Erro não-crítico ao salvar histórico: ${e.message}`,
    process: (e) => `❌ Erro no processamento: ${e.message}`
};

const services = {
    leitura: async ({ usina, tipo }) => {
        if (!usina || !tipo) throw new Error(errors.param(`leitura (usina, tipo): usina=${usina}, tipo=${tipo}`));
        const dados = await apiReadRT.getLeitura(usina, tipo);
        return { dados, resposta: formatarRespostaTempoReal(dados) };
    },
    historico: async ({ usina, data_inicio, data_fim, periodo }) => {
        if (!usina || !data_inicio || !data_fim) throw new Error(errors.param(`histórico (usina, data_inicio, data_fim): usina=${usina}, data_inicio=${data_inicio}, data_fim=${data_fim}`));
        const dados = await apiHistorico.getDadosHistoricos(usina, data_inicio, data_fim, periodo);
        return { dados, resposta: formatarRespostaHistorico(dados) };
    },
    resumo: async ({ usina }) => {
        if (!usina) throw new Error(errors.param(`resumo (usina): usina=${usina}`));
        const resultado = await resumoService.gerar_resumo_operativo(usina);
        const dados = { tipo: 'resumo', usina, resultado };
        return { dados, resposta: formatarRespostaResumo(dados) };
    },
    lista: async () => {
        return configUsuarios.usuariosPermitidos
            .map(u => `- ${u.nome}: ${u.numero} (${Array.isArray(u.usina) ? u.usina.join(', ') : u.usina})`)
            .join('\n');
    },
    ajuda: async () => {
        return 'Comandos disponíveis:\n' +
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
    }
};

const processarServico = async (serviceName, parametros, userId) => {
    try {
        const strategy = services[serviceName];
        if (!strategy) throw new Error(errors.servico(serviceName));

        const { resposta, dados } = await strategy(parametros);
        if (!resposta) throw new Error(errors.format(serviceName));
        if (!dados) throw new Error(errors.dados(serviceName));

        atualizarDadosAPI(userId, dados, serviceName);

        return resposta;

    } catch (error) { return errors.process(error); }
};

function hasPrefix(text) {
    if (!text) return false;
    return /^@leo(\s|:|$)/i.test(String(text).trim());
}

function UsuarioParaUsina(numero) {
    const grupo = configUsuarios.gruposPermitidos.find(g => g.grupos.includes(numero));
    if (grupo) return grupo.usinas;

    const usuario = configUsuarios.usuariosPermitidos.find(u => u.numero === numero);
    if (usuario) return usuario.usina;

    return null;
}

const processarMensagem = async (msg, client) => {
    try {
        // ESTADO 1: Verificar prefixo @leo
        if (!hasPrefix(msg.body)) return;

        // Recuperar informações do chat para garantir ID correto
        const chat = await msg.getChat();

        // Se for grupo, o ID correto para validação é o do grupo (chat.id._serialized)
        // Se for privado, o ID é o do remetente (msg.from)
        const idParaValidar = chat.isGroup ? chat.id._serialized : msg.from;

        // ESTADO 2: Associar usuário à usina
        // Agora passamos sempre o ID correto (do grupo ou do user)
        const usina = UsuarioParaUsina(idParaValidar);

        if (!usina) {
            Logger.info('❌ ID não autorizado ou não associado a usina:', idParaValidar);
            return;
        }

        // ESTADO 2: Remover prefixo @leo e separar pergunta
        const pergunta = msg.body.replace(/^@leo[:,]?/i, '').trim();
        if (!pergunta) return await enviarMensagem(client, 'Envie sua pergunta após @leo.', msg.from);

        // ESTADO 3: Listar usuários permitidos
        if (pergunta.toLowerCase() === 'lista') {
            const lista = await services.lista();
            await enviarMensagem(client, lista, msg.from);
            return;
        }

        // ESTADO 4: Listar comandos disponíveis
        if (pergunta.toLowerCase() === 'ajuda') {
            const resposta = await services.ajuda();
            await enviarMensagem(client, resposta, msg.from);
            return;
        }
        // encontrar o nome da usina na pergunta e filtrar o contexto
        // Se a pergunta mencionar uma usina específica (e permitida), o contexto terá apenas ela.
        // Se não mencionar, terá todas as usinas permitidas.
        const usinasContexto = filtrarUsinasPorContexto(pergunta, usina);

        // ESTADO 5: Preparar contexto com histórico
        // Passamos agora a lista filtrada de usinas
        const contexto = getContextoComHistorico(msg.from, usinasContexto);

        // ESTADO 6: Consultar OpenAI
        const respostaOpenAI = await obterRespostaOpenAI(pergunta, contexto);
        if (!respostaOpenAI.resposta) {
            await enviarMensagem(client, 'Não consegui processar sua pergunta. Tente reformular.', msg.from);
            return;
        }

        // ESTADO 7: Armazenar resposta da IA imediatamente
        adicionarInteracaoHistorico(msg.from, pergunta, respostaOpenAI.resposta);

        // ESTADO 8: Processar resposta
        const respostaProcessada = await tratarRespostaLeonardo(respostaOpenAI.resposta);
        try {
            // ESTADO 9: Verificar se a resposta é um comando JSON
            const comando = typeof respostaProcessada === 'object' ? respostaProcessada : JSON.parse(respostaOpenAI.resposta);
            if (comando.comando) {
                const resultado = await processarServico(comando.comando, comando.parametros, msg.from);
                return await enviarMensagem(client, resultado, msg.from);
            }
        } catch (e) {
            Logger.debug('Resposta não é JSON válido, tratando como resposta direta');
        }

        // ESTADO 10: Formatar resposta direta (sem API)
        const respostaFinal = typeof respostaProcessada === 'object' ?
            JSON.stringify(respostaProcessada) : respostaProcessada;

        return await enviarMensagem(client, respostaFinal, msg.from);

    } catch (error) {
        Logger.error('Erro ao processar mensagem:', error);
    }
};


wa.onMessage((msg, client) => {
    processarMensagem(msg, client);
});


const client = wa.start(); // ← aqui você tem o client na mão