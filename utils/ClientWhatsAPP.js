const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
    constructor(options = {}) {
        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: options.dataPath || './sessions'
            }),
            puppeteer: {
                headless: options.headless ?? true
            }
        });

        this._registerDefaultEvents();
    }

    _registerDefaultEvents() {
        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('Cliente pronto!');
        });

        this.client.on('auth_failure', msg => {
            console.error('Falha de auth:', msg);
        });

        this.client.on('disconnected', reason => {
            console.log('Desconectado:', reason);
        });
    }

    /**
     * Hook para mensagens recebidas
     */
    onMessage(callback) {
        this.client.on('message', async msg => {
            callback(msg, this.client);
        });
    }

    /**
     * Hook para mensagens criadas (enviadas + recebidas)
     */
    onMessageCreate(callback) {
        this.client.on('message_create', async msg => {
            callback(msg, this.client);
        });
    }

    /**
     * Inicializa o cliente
     */
    start() {
        this.client.initialize();
        return this.client;
    }

    /**
     * Retorna o client para uso externo
     */
    getClient() {
        return this.client;
    }
}

module.exports = WhatsAppService;
