// ========================================
// LEONARDO CHATBOT - ARQUIVO PRINCIPAL
// ========================================

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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

const verificarUsuario = (numero) => configUsuarios.usuariosPermitidos.find(u => u.numero === numero);

const verificarPermissoesUsina = (numero, usina) => {
    const usuario = verificarUsuario(numero);
    if (!usuario) {
        return false;
    }
    if (!usuario.usina.includes(usina)) {
        return `Usina ${usina} não permitida para o usuário ${usuario.nome}`;
    }
    return true;
}

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
        const comando= comandos.comando;
        const parametros = comandos.parametros;
        let dadosAPI, respostaFormatada;

        if (comando === 'leitura') {            
            Logger.state(15, 'APITempoReal', `Consultando dados em tempo real da usina ${parametros.usina}, tipo: ${parametros.tipo}`);
            dadosAPI = await apiReadRT.getLeitura(parametros.usina, parametros.tipo);
            
            Logger.state(16, 'FormatandoResposta', 'Formatando dados em tempo real para WhatsApp');
            respostaFormatada = formatarRespostaTempoReal(dadosAPI);
            
        } else if (comando === 'historico') {
            Logger.state(14, 'APIHistorico', `Consultando histórico da usina ${parametros.usina}, intervalo: ${parametros.data_inicio} a ${parametros.data_fim}, período: ${parametros.periodo}`);
            dadosAPI = await apiHistorico.getDadosHistoricos(parametros.usina, parametros.data_inicio, parametros.data_fim, parametros.periodo);
            
            Logger.state(16, 'FormatandoResposta', 'Formatando dados históricos para WhatsApp');
            respostaFormatada = formatarRespostaHistorico(dadosAPI);
        }else{
            return 'Comando não reconhecido.';
        }
        
        Logger.state(17, 'ArmazenandoDadosAPI', 'Salvando dados brutos da API no histórico');
        atualizarDadosAPI(userId, dadosAPI, comando);
        
        return respostaFormatada;
        
    } catch (error) {
        Logger.error('Erro ao processar comando:', error);
        return `❌ Erro ao processar comando: ${error.message}`;
    }
};

const processarMensagem = async (msg, client) => {
    try {
        Logger.state(5, 'ProcessandoMensagem', 'Mensagem recebida, iniciando processamento');
        
        const usuario = verificarUsuario(msg.from);
        const comandoLeonardo = msg.body.trim().toLowerCase().startsWith('@leo');
        const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        console.log('--------------------------------');
        console.log('usuario:', msg.from);
        console.log('hora:', hora);
        console.log('msg.body:', msg.body);
        console.log('comandoLeonardo:', comandoLeonardo);
        console.log('--------------------------------');
        
        if (!usuario || !comandoLeonardo) {
            Logger.state(7, 'UsuarioNaoAutorizado', 'Usuário não autorizado ou sem @leo, ignorando');
            return 'Usuário não autorizado ou sem @leo, ignorando';
        }

        Logger.state(6, 'VerificandoUsuario', `Usuário autorizado: ${usuario.nome}`);
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


        // ESTADO 8: Recuperar histórico
        Logger.state(8, 'RecuperandoHistorico', `Recuperando histórico do usuário ${usuario.nome}, ${msg.from}, usinas permitidas: ${usuario.usina}`);
        
        // ESTADO 9: Preparar contexto com histórico
        Logger.state(9, 'PreparandoContexto', 'Montando contexto com histórico de interações');
        const contexto = getContextoComHistorico(msg.from, usuario.usina);
        console.log('contexto:', contexto);

        // ESTADO 10: Consultar OpenAI
        Logger.state(10, 'ConsultandoOpenAI', 'Enviando pergunta para OpenAI com contexto histórico');
        const respostaOpenAI = await obterRespostaOpenAI(pergunta, contexto);
        
        if (!respostaOpenAI.resposta) {
            await msg.reply('Não consegui processar sua pergunta. Tente reformular.');
            return;
        }

        // ESTADO 11: Armazenar resposta da IA imediatamente
        Logger.state(11, 'ArmazenandoRespostaIA', 'Salvando pergunta e resposta OpenAI no histórico');
        adicionarInteracaoHistorico(msg.from, pergunta, respostaOpenAI.resposta);
        
        // ESTADO 12: Processar resposta
        Logger.state(12, 'ProcessandoResposta', 'Analisando tipo de resposta (comando ou direta)');
        const respostaProcessada = await tratarRespostaLeonardo(respostaOpenAI.resposta);
        
        // verificar se a resposta aborda usina e verifique se a usina citada é permitida para o usuário
        const usinaReferenciada = respostaOpenAI.resposta.includes('usina');
        if (usinaReferenciada) {
            const usina = respostaOpenAI.resposta.split(' ')[1];
            const verificarPermissoesUsina = verificarPermissoesUsina(msg.from, usina);
        }
        
        try {
            // Tentar processar como comando JSON usando a resposta processada
            const comando = typeof respostaProcessada === 'object' ? respostaProcessada : JSON.parse(respostaOpenAI.resposta);
            if (comando.comando) {

                // ESTADO 13: Comando detectado
                Logger.state(13, 'ConsultandoAPI', `Comando JSON detectado: ${comando.comando}`);

                // Processar comando (estados 14 ou 15, depois 16 para armazenar dados API)
                const resultado = await processarComando(comando, msg.from);
                
                // ESTADO 18: Enviar resposta formatada
                Logger.state(18, 'EnviandoResposta', 'Enviando resposta formatada da API');
                await msg.reply(resultado);
                return resultado;
            }
        } catch (e) {
            Logger.debug('Resposta não é JSON válido, tratando como resposta direta');
        }

        // ESTADO 17: Formatar resposta direta (sem API)
        Logger.state(17, 'FormatandoResposta', 'Formatando resposta direta da OpenAI');
        const respostaFinal = typeof respostaProcessada === 'object' ? 
            JSON.stringify(respostaProcessada) : respostaProcessada;

        // ESTADO 18: Enviar resposta
        Logger.state(18, 'EnviandoResposta', 'Enviando resposta direta');
        await msg.reply(respostaFinal);
        return respostaFinal;

    } catch (error) {
        Logger.error('Erro ao processar mensagem:', error);
        await msg.reply('Erro ao processar mensagem.');
    }
};

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    Logger.state(2, 'AguardandoQR', 'QR Code gerado - escaneie com WhatsApp');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    Logger.state(3, 'Conectado', 'Bot Leonardo pronto e conectado ao WhatsApp!');
    Logger.state(4, 'AguardandoMensagem', 'Aguardando mensagens dos usuários');
});

client.on('message', async msg => await processarMensagem(msg, client));
// client.on('message_create', async msg => await processarMensagem(msg, client));

client.on('auth_failure', () => Logger.error('Falha na autenticação'));

client.on('disconnected', (reason) => {
    Logger.state(17, 'Reconectando', `Desconectado: ${reason}, tentando reconectar...`);
    setTimeout(() => {
        Logger.state(2, 'AguardandoQR', 'Tentando reconectar...');
        client.initialize();
    }, 5000);
});

client.initialize();
Logger.state(1, 'Inicializado', 'Bot Leonardo iniciado!');


process.on('SIGINT', () => {
    Logger.info('Encerrando bot...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    Logger.info('Encerrando bot...');
    process.exit(0);
});
/*
Como enviar o projeto para o servidor Ubuntu Server a partir do Windows 11?

# 1 passo: verificar se o serviço pm2 está rodando o bot antigo
pm2 list
 id │ name            │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ whatsapp-bot    │ default     │ N/A     │ fork    │ 444012   │ 21D    │ 1    │ online    │ 0%       │ 107.5mb  │ junior   │ disabled │

# 2 passo: parar o serviço pm2 que está rodando o bot antigo
pm2 stop 0
junior@engesep-server:~$ pm2 stop 0
[PM2] Applying action stopProcessId on app [0](ids: [ '0' ])
[PM2] [whatsapp-bot](0) ✓
┌────┬─────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name            │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ whatsapp-bot    │ default     │ N/A     │ fork    │ 0        │ 0      │ 1    │ stopped   │ 0%       │ 0b       │ junior   │ disabled │

# 3 passo: enviar o projeto para o servidor Ubuntu Server
junior@engesep-server:~$ scp -r /home/junior/whatsapp-bot ubuntu@192.168.10.10:/home/ubuntu/whatsapp-bot


*/