const axios = require('axios');
const leituras = require('../config/usinas');
const usuarios = require('../config/usuarios');
const Logger = require('../utils/logger');

class ApiService {
    constructor() {
        this.leituras = leituras;
        this.usuarios = usuarios;
    }

    /**
     * Fecha todas as conexões Modbus ativas via API
     * @param {Object} config - Configuração da usina {ip: string, port: number}
     * @returns {Promise<boolean>} - True se conexões fechadas com sucesso
     */
    async closeModbusConnections(config) {
        try {
            const url = `http://${config.ip}:${config.port}/closeConnections`;
            
            const response = await axios.post(url, {}, {
                timeout: 5000, // 5 segundos
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const connectionsData = response.data;
            
            if (connectionsData.status !== 'success') {
                throw new Error(`[ERRO API] ${connectionsData.message || 'Status não é success'}`);
            }
            
            Logger.success(`apiService.js: Conexões Modbus fechadas com sucesso em ${config.ip}:${config.port}`);
            return true;
            
        } catch (error) {
            Logger.error(`apiService.js: Erro ao fechar conexões Modbus em ${config.ip}:${config.port}`, error);
            throw new Error(`[ERRO] ${error.message}`);
        }
    }
    /**
     * Obtém dados de uma usina específica
     * @param {Object} config - Configuração da usina {ip: string, port: number, tipo: string, unidade: string}
     * @param {Object} data - Dados da conexão e registros {conexao: string, registers: Object}
     * @returns {Promise<Array>} [dados, tempo_execucao]
     */
    async getData(config, data) {
        const inicio = Date.now();
        
        const body = {
            conexao: data.conexao,
            registers: data.registers
        };
        
        const url = `http://${config.ip}:${config.port}/readCLP/leituras`;
        
        Logger.debug(`apiService.js, l.59: Fazendo requisição para: ${url}`, { body });
        
        try {
            // Timeout de 3 segundos
            const response = await axios.post(url, body, {
                timeout: 3000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const leiturasData = response.data;
            const fim = (Date.now() - inicio) / 1000; // Converte para segundos
            
            Logger.debug('apiService.js, l.73: Resposta recebida', { leiturasData });
            
            if (leiturasData.status === 'success') {
                Logger.success(`apiService.js, l.76: Dados obtidos com sucesso em ${fim.toFixed(2)}s`);
                
                // Fechar conexões Modbus após obter dados com sucesso
                try {
                    await this.closeModbusConnections(config);
                } catch (closeError) {
                    Logger.warn(`apiService.js: Aviso - Não foi possível fechar conexões: ${closeError.message}`);
                }
                
                return [leiturasData.data, fim];
            } else {
                Logger.error('apiService.js, l.79: API retornou status de erro', { leiturasData });                
                // Tentar fechar conexões mesmo em caso de erro
                try {
                    await this.closeModbusConnections(config);
                } catch (closeError) {
                    Logger.warn(`apiService.js: Aviso - Não foi possível fechar conexões: ${closeError.message}`);
                }
                
                return [null, fim];
            }
            
        } catch (error) {            
            if (error.code === 'ECONNABORTED') {
                Logger.error('apiService.js, l.88: Timeout na requisição', { url, timeout: '3s' });
            } else if (error.code === 'ECONNREFUSED') {
                Logger.error('apiService.js, l.90: Conexão recusada', { url });
            } else {
                Logger.error('apiService.js, l.92: Erro na requisição', {
                    url, 
                    error: error.message,
                    code: error.code 
                });
            }
            try {
                await this.closeModbusConnections(config);
            } catch (closeError) {
                Logger.warn(`apiService.js: Aviso - Não foi possível fechar conexões: ${closeError.message}`);
            }
            
            return [null, fim];
        }
    }

    /**
     * Obtém dados de uma usina específica usando a configuração das usinas
     * @param {string} nomeUsina - Nome da usina
     * @param {string} ug - Unidade geradora (ex: "UG-01")
     * @param {string} tipo - Tipo de dados ("leituras", "temperaturas", "alarmes", etc.)
     * @returns {Promise<Array>} [dados, tempo_execucao]
     */
    async getUsinaData(nomeUsina, ug, tipo) {
        const usina = this.leituras[nomeUsina];
        if (!usina) {
            throw new Error(`Usina ${nomeUsina} não encontrada`);
        }

        const ugData = usina.CLPS[ug];
        if (!ugData) {
            throw new Error(`UG ${ug} não encontrada na usina ${nomeUsina}`);
        }

        const config = {
            ip: usina.ip,
            port: usina.port,
            tipo: tipo,
            unidade: ug
        };

        const data = {
            conexao: {
                ip: ugData.conexao.ip,
                port: ugData.conexao.port
            },
            registers: ugData[tipo] || {}
        };

        return await this.getData(config, data);
    }

    async getLeitura(nomeUsina, tipo) {
        
        const usina = this.leituras[nomeUsina];
        if (!usina) {
            throw new Error(`Usina ${nomeUsina} não encontrada`);
        }
        
        const resultados = {};
        
        // Iterar sobre todas as UGs da usina
        for (const [ugNome, ugData] of Object.entries(usina.CLPS)) {
            
            try {
                // Obter dados da UG usando o tipo especificado
                if (ugData[tipo] === undefined) {
                    continue;
                }
                const [dados, tempo] = await this.getUsinaData(nomeUsina, ugNome, tipo);                
                resultados[ugNome] = {
                    dados: dados,
                    tempo_execucao: tempo,
                    caracteristicas: ugData.caracteristicas || {}
                };
                
            } catch (error) {
                Logger.error(`apiService.js, l.170: Erro ao obter dados da ${ugNome}`, error);
                resultados[ugNome] = {
                    erro: error.message,
                    dados: {},
                    tempo_execucao: 0
                };
            }
        }
        
        return {
            usina: nomeUsina,
            timestamp: new Date().toISOString(),
            unidades_geradoras: resultados
        };
    }
}

module.exports = ApiService; 
