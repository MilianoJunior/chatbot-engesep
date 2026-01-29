// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. criarClienteWhatsApp → instancia cliente com auth local
// 2. registrarEventosPadrao → conecta eventos base de diagnóstico
// 3. iniciarCliente → inicializa o client
// -------------------------------------------------------------------

// CONFIGURAÇÕES, CONSTANTES E MAPAS
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Logger = require('./logger');

class WhatsAppService {
    constructor(options = {}) {
        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: options.dataPath || './sessions'
            }),
            puppeteer: {
                headless: options.headless ?? true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        this._registerDefaultEvents();
    }

    _registerDefaultEvents() {
        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
            Logger.info('QR gerado. Escaneie para autenticar.');
        });

        this.client.on('ready', () => {
            Logger.success('Cliente pronto.');
        });

        this.client.on('auth_failure', msg => {
            Logger.error('Falha de auth', msg);
        });

        this.client.on('disconnected', reason => {
            Logger.warn('Desconectado', reason);
        });

        this.client.on('authenticated', () => {
            Logger.success('Autenticado com sucesso.');
        });

        this.client.on('change_state', state => {
            Logger.debug('Mudança de estado', state);
        });

        this.client.on('loading_screen', (percent, message) => {
            Logger.debug(`Carregando ${percent}%`, message);
        });
    }

    /**
     * Hook para mensagens recebidas
     */
    onMessage(callback) {
        this.client.on('message', async msg => {
            try {
                await callback(msg, this.client);
            } catch (error) {
                Logger.error('Erro no callback de mensagem', error);
            }
        });
    }

    /**
     * Hook para mensagens criadas (enviadas + recebidas)
     */
    onMessageCreate(callback) {
        this.client.on('message_create', async msg => {
            try {
                await callback(msg, this.client);
            } catch (error) {
                Logger.error('Erro no callback de message_create', error);
            }
        });
    }

    /**
     * Inicializa o cliente
     */
    start() {
        try {
            this.client.initialize();
            Logger.info('Inicializando cliente WhatsApp...');
            return this.client;
        } catch (error) {
            Logger.error('Falha ao inicializar cliente', error);
            return null;
        }
    }

    /**
     * Retorna o client para uso externo
     */
    getClient() {
        return this.client;
    }
}

module.exports = WhatsAppService;
