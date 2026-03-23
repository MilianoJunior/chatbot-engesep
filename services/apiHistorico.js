const axios = require('axios');
const Logger = require('../utils/logger');
const dayjs = require('dayjs');
const tz = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
// const dotenv = require('dotenv');
// dotenv.config();
dayjs.extend(utc); dayjs.extend(tz);

const TZ = 'America/Sao_Paulo';

class ApiHistorico {
    constructor() {
        // Configuração de ambiente
        this.isDevelopment = 'production';
        this.baseUrl = "https://engesepapi-production.up.railway.app";
        // this.baseUrl = "http://localhost:8000";
        this.timeout = 10000; // 10 segundos
        
        // Usinas válidas
        this.usinasValidas = [
            "CGH-APARECIDA",
            "CGH-FAE", 
            "PCH-PEDRAS",
            "CGH-PICADAS-ALTAS",
            "CGH-HOPPEN",
            "PCH-PIRA"
        ];
    }

    /**
     * Faz uma requisição POST para a API de histórico
     * @param {string} endpoint - Endpoint da API
     * @param {object} body - Dados do corpo da requisição
     * @returns {Promise<object>} - Resposta da API
     */
    async fazerRequisicao(endpoint, body) {
        try {
            Logger.debug('🌐 ApiHistorico requisição:', `${this.baseUrl}${endpoint}`);
            Logger.debug('📤 Body:', JSON.stringify(body, null, 2));

            const response = await axios.post(
                `${this.baseUrl}${endpoint}`,
                body,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: this.timeout
                }
            );

            Logger.debug('📥 Resposta API:', { status: response.status, dataSize: response.data ? JSON.stringify(response.data).length : 0 });

            if (!response.data) {
                const erro = 'API retornou resposta vazia';
                console.error('❌ ' + erro);
                throw new Error(erro);
            }

            return response.data;

        } catch (error) {
            const detalhesErro = {
                endpoint: endpoint,
                baseUrl: this.baseUrl,
                body: body,
                error: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                code: error.code,
                stack: error.stack
            };

            Logger.error('apiHistorico.js fazerRequisicao: Erro na requisição da API de histórico', detalhesErro);
            console.error('🚨 ERRO na requisição da API de histórico:', detalhesErro);

            if (error.code === 'ECONNABORTED') {
                throw new Error(`Timeout na requisição da API de histórico (${this.timeout}ms)`);
            } else if (error.code === 'ECONNREFUSED') {
                throw new Error(`Conexão recusada pela API: ${this.baseUrl}${endpoint}`);
            } else if (error.code === 'ENOTFOUND') {
                throw new Error(`Servidor não encontrado: ${this.baseUrl}`);
            } else if (error.response?.status) {
                const mensagem = `Erro HTTP ${error.response.status}: ${error.response.statusText}`;
                if (error.response.data) {
                    throw new Error(`${mensagem}\nDetalhes: ${JSON.stringify(error.response.data)}`);
                }
                throw new Error(mensagem);
            } else {
                throw new Error(`Erro na conexão: ${error.message}`);
            }
        }
    }

    /**
     * Valida se a usina é válida
     * @param {string} usina - Código da usina
     * @returns {boolean} - True se válida
     */
    validarUsina(usina) {
        return this.usinasValidas.includes(usina);
    }

    /**
     * Normaliza o período para o formato aceito pela API
     * @param {string} periodo - Período informado
     * @returns {string} - Período normalizado
     */
    normalizarPeriodo(periodo) {
        const periodoUpper = periodo.toUpperCase();
        
        if (['D', 'DIARIO', 'DAY'].includes(periodoUpper)) {
            return 'D';
        } else if (['H', 'HORARIO', 'HOUR'].includes(periodoUpper)) {
            return 'H';
        } else if (['M', 'MENSAL', 'MONTH'].includes(periodoUpper)) {
            return 'M';
        }
        
        return 'D'; // Padrão
    }

    /**
     * Adiciona 1 dia a uma data no formato DD/MM/YYYY
     * @param {string} data - Data no formato DD/MM/YYYY
     * @returns {string} - Data com 1 dia adicionado
     */
    adicionarUmDia(data) {
        try {
            // Converter DD/MM/YYYY para Date
            const partes = data.split('/');
            if (partes.length === 3) {
                const dia = parseInt(partes[0]);
                const mes = parseInt(partes[1]) - 1; // Mês começa em 0
                const ano = parseInt(partes[2]);
                
                const dataObj = new Date(ano, mes, dia);
                dataObj.setDate(dataObj.getDate() + 1);
                
                // Converter de volta para DD/MM/YYYY
                const novoDia = String(dataObj.getDate()).padStart(2, '0');
                const novoMes = String(dataObj.getMonth() + 1).padStart(2, '0');
                const novoAno = dataObj.getFullYear();
                
                return `${novoDia}/${novoMes}/${novoAno}`;
            }
            return data; // Retorna original se não conseguir converter
        } catch (error) {
            Logger.error('apiHistorico.js: Erro ao adicionar 1 dia à data', { data, error: error.message });
            return data; // Retorna original em caso de erro
        }
    }

    /**
     * Formata data para o formato esperado pela API (DD/MM/YYYY HH:mm)
     * @param {string} data - Data no formato DD/MM/YYYY
     * @returns {string} - Data formatada com hora
     */
    formatarDataComHora(data, isFim = false) {
        // Se a data já tem hora, retorna como está
        if (data.includes(' ')) {
            return data;
        }
        // Se não tem hora, adiciona 00:00 para início ou 23:59 para fim
        if (data.includes('/')) {
            return isFim ? `${data} 23:59` : `${data} 00:00`;
        }
        
        return data;
    }

    /**
     * Obtém dados de produção acumulada
     * @param {string} usina - Código da usina (ex: "CGH-APARECIDA")
     * @param {string} dataInicio - Data de início no formato "DD/MM/YYYY" ou "DD/MM/YYYY HH:mm"
     * @param {string} dataFim - Data de fim no formato "DD/MM/YYYY" ou "DD/MM/YYYY HH:mm"
     * @param {string} periodo - Período: "D"/"DIARIO", "H"/"HORARIO", "M"/"MENSAL" (padrão: "D")
     * @returns {Promise<object>} - Dados de produção acumulada
     */
    async getProducaoAcumulada(usina, dataInicio, dataFim, periodo = 'D') {
        if (!dataInicio || !dataFim) {
            throw new Error('Data de início e fim são obrigatórias');
        }
        // Normaliza período uma única vez
        const p = this.normalizarPeriodo(periodo);

        // Ajusta fim EXCLUSIVO apenas se for diário
        const dataFimAjustada = (p === 'D')
        ? this.adicionarUmDia(dataFim.split(' ')[0])  // Remove hora se existir
        : dataFim.split(' ')[0];  // Remove hora se existir

        // Formata datas com hora
        const dataInicioFormatada = this.formatarDataComHora(dataInicio.split(' ')[0]);
        let dataFimFormatada = this.formatarDataComHora(dataFimAjustada, true);

        // Log claro
        Logger.info(
        `apiHistorico.js: Janela consultada (fim exclusivo quando aplicável): ` +
        `inicio=${dataInicioFormatada} fim_exclusivo=${dataFimFormatada} periodo=${p}`
        );

        // Chamada da API
        const endpoint = '/producao-acumulada';
        const body = {
            usina: usina,
            data_inicio: dataInicioFormatada,
            data_fim: dataFimFormatada,
            periodo: p,
            token: process.env.TOKEN
        };
        console.log(body)
        Logger.info(`2222222- apiHistorico.js: Body: | ${JSON.stringify(body)}`);
        return await this.fazerRequisicao(endpoint, body);
    }

    /**
     * Obtém dados de um grupo de variáveis
     * @param {string} usina - Código da usina
     * @param {string} grupo - Nome do grupo (ex: "potencia", "temperaturas")
     * @param {string} dataInicio - Data de início
     * @param {string} dataFim - Data de fim
     * @returns {Promise<object>} - Dados do grupo
     */
    async getGrupoUsina(usina, grupo, dataInicio, dataFim) {
        if (!grupo) {
            throw new Error('Grupo é obrigatório para este endpoint');
        }

        const dataInicioFormatada = this.formatarDataComHora(dataInicio.split(' ')[0]);
        const dataFimFormatada = this.formatarDataComHora(dataFim.split(' ')[0], true);

        const endpoint = '/grupo-usina';
        const body = {
            usina: usina,
            grupo: grupo,
            data_inicio: dataInicioFormatada,
            data_fim: dataFimFormatada,
            token: '123456'
        };
        return await this.fazerRequisicao(endpoint, body);
    }

    /**
     * Obtém dados de um sensor/variável específico
     * @param {string} usina - Código da usina
     * @param {string} variavel - Nome da variável (ex: "Nível Montante")
     * @param {string} dataInicio - Data de início
     * @param {string} dataFim - Data de fim
     * @returns {Promise<object>} - Dados do sensor
     */
    async getSensorUsina(usina, variavel, dataInicio, dataFim) {
        if (!variavel) {
            throw new Error('Variável é obrigatória para este endpoint');
        }

        const dataInicioFormatada = this.formatarDataComHora(dataInicio.split(' ')[0]);
        const dataFimFormatada = this.formatarDataComHora(dataFim.split(' ')[0], true);

        const endpoint = '/sensor-usina';
        const body = {
            usina: usina,
            variavel: variavel,
            data_inicio: dataInicioFormatada,
            data_fim: dataFimFormatada,
            token: '123456'
        };
        return await this.fazerRequisicao(endpoint, body);
    }

    /**
     * Obtém dump completo da tabela
     * @param {string} usina - Código da usina
     * @param {string} dataInicio - Data de início
     * @param {string} dataFim - Data de fim
     * @returns {Promise<object>} - Dados brutos da tabela
     */
    async getTabelaUsina(usina, dataInicio, dataFim) {
        const dataInicioFormatada = this.formatarDataComHora(dataInicio.split(' ')[0]);
        const dataFimFormatada = this.formatarDataComHora(dataFim.split(' ')[0], true);

        const endpoint = '/tabela-usina';
        const body = {
            usina: usina,
            data_inicio: dataInicioFormatada,
            data_fim: dataFimFormatada,
            token: '12345678'
        };
        return await this.fazerRequisicao(endpoint, body);
    }

    /**
     * Obtém dados históricos de acordo com o endpoint especificado
     * @param {object} parametros - Parâmetros do comando histórico
     * @returns {Promise<object>} - Dados brutos da API
     */
    async getDadosHistoricos(parametros) {
        try {
            const { endpoint, usina, data_inicio, data_fim, periodo, grupo, variavel } = parametros;
            Logger.debug('📊 getDadosHistoricos:', parametros);
            
            // Validar parâmetros básicos
            if (!usina || !data_inicio || !data_fim) {
                const erro = 'Parâmetros obrigatórios ausentes (usina, data_inicio, data_fim)';
                console.error('❌ ' + erro, parametros);
                throw new Error(erro);
            }

            // Validar usina
            if (!this.validarUsina(usina)) {
                const erro = `Usina inválida: ${usina}. Usinas válidas: ${this.usinasValidas.join(', ')}`;
                console.error('❌ ' + erro);
                throw new Error(erro);
            }

            let dados;
            switch (endpoint) {
                case 'producao-acumulada':
                    Logger.debug('✅ Chamando getProducaoAcumulada...');
                    dados = await this.getProducaoAcumulada(usina, data_inicio, data_fim, periodo);
                    break;
                case 'grupo-usina':
                    Logger.debug('✅ Chamando getGrupoUsina...');
                    dados = await this.getGrupoUsina(usina, grupo, data_inicio, data_fim);
                    break;
                case 'sensor-usina':
                    Logger.debug('✅ Chamando getSensorUsina...');
                    dados = await this.getSensorUsina(usina, variavel, data_inicio, data_fim);
                    break;
                case 'tabela-usina':
                    Logger.debug('✅ Chamando getTabelaUsina...');
                    dados = await this.getTabelaUsina(usina, data_inicio, data_fim);
                    break;
                default:
                    const erro = `Endpoint não suportado: ${endpoint}`;
                    console.error('❌ ' + erro);
                    throw new Error(erro);
            }

            Logger.debug('📊 Dados obtidos:', { usina: dados?.usina, periodo: dados?.periodo, temResultado: !!dados?.resultado });

            return dados;

        } catch (error) {
            const detalhesErro = {
                parametros,
                error: error.message,
                stack: error.stack
            };

            Logger.error('apiHistorico.js getDadosHistoricos: Erro ao obter dados históricos', detalhesErro);
            console.error('🚨 ERRO em getDadosHistoricos:', detalhesErro);

            throw error; 
        }
    }
}

module.exports = ApiHistorico;

