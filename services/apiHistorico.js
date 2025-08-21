const axios = require('axios');
const Logger = require('../utils/logger');
const dayjs = require('dayjs');
const tz = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const dotenv = require('dotenv');
dotenv.config();
dayjs.extend(utc); dayjs.extend(tz);

const TZ = 'America/Sao_Paulo';

class ApiHistorico {
    constructor() {
        // Configuração de ambiente
        this.isDevelopment = process.env.NODE_ENV !== 'production';
        this.baseUrl = "https://engesepapi-production.up.railway.app";
        // this.baseUrl = "http://localhost:8000";
        this.timeout = 10000; // 10 segundos
        
        // Usinas válidas
        this.usinasValidas = [
            "CGH-APARECIDA",
            "CGH-FAE", 
            "PCH-PEDRAS",
            "CGH-PICADAS-ALTAS",
            "CGH-HOPPEN"
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

            return response.data;

        } catch (error) {
            Logger.error('apiHistorico.js, l.32: Erro na requisição da API de histórico', {
                endpoint: endpoint,
                error: error.message,
                status: error.response?.status
            });

            if (error.code === 'ECONNABORTED') {
                throw new Error('Timeout na requisição da API de histórico');
            } else if (error.response?.status) {
                throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
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
    formatarDataComHora(data) {
        // Se a data já tem hora, retorna como está
        if (data.includes(' ')) {
            return data;
        }
        // Se não tem hora, adiciona 00:00 para início do dia e 23:59 para fim do dia
        if (data.includes('/')) {
            return data + ' 00:00';
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
        ? this.adicionarUmDia(dataFim)
        : dataFim;

        // Formata datas com hora (mantém sua função atual)
        let dataInicioFormatada = this.formatarDataComHora(dataInicio);
 
        let dataFimFormatada    = this.formatarDataComHora(dataFim);
        if (p === 'D') {
            console.log(' Diario: dataFimAjustada:', dataFimAjustada);
            dataFimFormatada = this.formatarDataComHora(dataFimAjustada);
        }
        // Log claro
        Logger.info(
        `apiHistorico.js: Janela consultada (fim exclusivo quando aplicável): ` +
        `inicio=${dataInicioFormatada} fim_exclusivo=${dataFimFormatada} periodo=${p}`
        );

        // Chamada da API (inalterada)
        const endpoint = '/producao-acumulada';
        const body = {
            usina: usina,
            data_inicio: dataInicioFormatada,
            data_fim: dataFimFormatada,
            periodo: p,
            token: process.env.TOKEN_API_HISTORICO
        };
        return await this.fazerRequisicao(endpoint, body);
    }

    /**
     * Obtém dados históricos de produção acumulada (sem formatação)
     * @param {string} usina - Nome da usina
     * @param {string} dataInicio - Data de início (DD/MM/YYYY)
     * @param {string} dataFim - Data de fim (DD/MM/YYYY)
     * @param {string} periodo - Período (hour, day, month)
     * @returns {Promise<object>} - Dados brutos da API
     */
    async getDadosHistoricos(usina, dataInicio, dataFim, periodo = 'day') {
        try {
            const dados = await this.getProducaoAcumulada(usina, dataInicio, dataFim, periodo);
            return dados;

        } catch (error) {
            Logger.error('apiHistorico.js, l.95: Erro ao obter dados históricos', {
                usina: usina,
                periodo: periodo,
                error: error.message
            });

            throw error; 
        }
    }
}

module.exports = ApiHistorico;
