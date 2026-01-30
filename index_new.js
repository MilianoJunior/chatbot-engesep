// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. montarCacheWeb → aplica cache de versão remoto fixo
// 2. criarClienteWhatsApp → instancia client com auth local
// 3. iniciarTimeoutReady → detecta travamento pós-auth
// 4. monitorarEstadoCliente → loga estado e versão
// 5. inspecionarPagina → confirma URL e readyState
// 6. resumirMensagem → normaliza campos principais da msg
// 7. registrarEventosWhatsApp → registra eventos essenciais
// 8. processarMensagemTeste → responde comandos mínimos
// 9. iniciarClienteWhatsApp → inicializa o client
// -------------------------------------------------------------------

// CONFIGURAÇÕES, CONSTANTES E MAPAS
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const SESSAO_DIR = './sessions';
const PREFIXO = '@leo';
const ARGS_CHROMIUM = ['--no-sandbox', '--disable-setuid-sandbox'];
const HEADLESS = process.env.WA_HEADLESS !== 'false';
const DEVTOOLS = process.env.WA_DEVTOOLS === 'true';
const INFO_DELAY_MS = 5000;
const PAGE_DELAY_MS = 8000;
const INTERVALO_ESTADO_MS = 15000;
const TEMPO_MAX_READY_MS = 30000;
let clientePronto = false;
const WEB_CACHE_REMOTE_PATH = process.env.WA_WEB_REMOTE_PATH
    || 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html';

const montarCacheWeb = () => {
    return { type: 'remote', remotePath: WEB_CACHE_REMOTE_PATH };
};

const criarClienteWhatsApp = () => {
    return new Client({
        authStrategy: new LocalAuth({ dataPath: SESSAO_DIR }),
        webVersionCache: montarCacheWeb(),
        puppeteer: {
            headless: HEADLESS,
            devtools: DEVTOOLS,
            args: ARGS_CHROMIUM
        }
    });
};

const processarMensagemTeste = async (msg, client) => {
    const texto = (msg.body || '').trim();
    if (!texto) return;

    if (texto.toLowerCase() === 'ping') {
        await client.sendMessage(msg.from, 'pong');
        return;
    }

    if (!texto.toLowerCase().startsWith(PREFIXO)) return;
    await client.sendMessage(msg.from, 'ok');
};

const iniciarTimeoutReady = () => {
    setTimeout(() => {
        if (clientePronto) return;
        console.error('READY não foi emitido no tempo esperado.');
    }, TEMPO_MAX_READY_MS);
};

const monitorarEstadoCliente = (client) => {
    setInterval(async () => {
        try {
            const estado = await client.getState();
            const versao = await client.getWWebVersion();
            console.log('ESTADO', estado, 'WWebVersion', versao);
        } catch (error) {
            console.warn('Falha ao consultar estado', error?.message || error);
        }
    }, INTERVALO_ESTADO_MS);
};

const inspecionarPagina = async (client) => {
    try {
        if (!client?.pupPage) return;
        const url = client.pupPage.url();
        const readyState = await client.pupPage.evaluate(() => document.readyState);
        console.log('PAGINA', { url, readyState });
    } catch (error) {
        console.warn('Falha ao inspecionar pagina', error?.message || error);
    }
};

const resumirMensagem = (msg) => {
    return {
        id: msg?.id?._serialized,
        from: msg?.from,
        to: msg?.to,
        fromMe: msg?.fromMe,
        type: msg?.type,
        body: msg?.body
    };
};

const registrarEventosWhatsApp = (client) => {
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
        iniciarTimeoutReady();
        monitorarEstadoCliente(client);
        setTimeout(() => {
            console.log('INFO', client.info || 'info indisponivel');
        }, INFO_DELAY_MS);
        setTimeout(() => {
            inspecionarPagina(client);
        }, PAGE_DELAY_MS);
    });

    client.on('auth_failure', msg => {
        console.error('AUTHENTICATION FAILURE', msg);
    });

    client.on('ready', () => {
        console.log('READY');
        clientePronto = true;
    });

    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    client.on('message', async msg => {
        console.log('MESSAGE', resumirMensagem(msg));
        await processarMensagemTeste(msg, client);
    });

    client.on('message_ack', (msg, ack) => {
        console.log('MESSAGE ACK', msg.id?._serialized, ack);
    });

    client.on('change_state', state => {
        console.log('STATE', state);
    });

    client.on('disconnected', reason => {
        console.log('DISCONNECTED', reason);
    });

    // capturar mensagem de texto que eu envio par minha conta
    client.on('message_create', async msg => {
        console.log('MESSAGE CREATE', resumirMensagem(msg));
        await processarMensagemTeste(msg, client);
    });
};

const iniciarClienteWhatsApp = (client) => {
    client.initialize();
};

const client = criarClienteWhatsApp();
registrarEventosWhatsApp(client);
iniciarClienteWhatsApp(client);
