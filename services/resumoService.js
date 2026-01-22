// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. gerar_resumo_operativo → orquestra consultas (2x RT, 1x Histórico)
// 2. _buscar_rt_potencia → consulta potência ativa instantânea
// 3. _buscar_rt_nivel → consulta nível de água instantâneo
// 4. _buscar_historico_24h → consulta produção acumulada
// 5. _extrair_caracteristicas → busca limites operativos no config
// 6. _formatar_mensagem → gera o texto final para o usuário
// -------------------------------------------------------------------

const dayjs = require('dayjs');
const Logger = require('../utils/logger');
const configUsinas = require('../config/usinasconfig'); // Usando o config correto

class ResumoService {
    constructor(apiRT, apiHistorico) {
        this.apiRT = apiRT;
        this.apiHist = apiHistorico;
    }

    async gerar_resumo_operativo(nome_usina) {
        try {
            Logger.state(14, 'ResumoService', `Gerando resumo completo para ${nome_usina}`);

            const agora = dayjs();
            // Define o período como o dia atual completo (00:00 hoje até 00:00 amanhã)
            const inicio = agora.startOf('day'); // Hoje 00:00:00
            const fim = agora.add(1, 'day').startOf('day'); // Amanhã 00:00:00 (fim exclusivo)

            // Executa todas as consultas em paralelo
            const [rt_potencia, rt_nivel, dados_hist] = await Promise.all([
                this._buscar_rt_potencia(nome_usina),
                this._buscar_rt_nivel(nome_usina),
                this._buscar_historico_24h(nome_usina, inicio, fim)
            ]);

            // Busca características estáticas (vertimento, parada)
            const caracteristicas = this._extrair_caracteristicas(nome_usina);

            // Consolida os dados
            const dadosConsolidados = {
                usina: nome_usina,
                data_hora: fim, // Mantendo a referência de fim do período de geração
                rt_potencia,
                rt_nivel,
                historico: dados_hist,
                limites: caracteristicas
            };

            // Retorna os dados consolidados para formatação externa
            return dadosConsolidados;

        } catch (error) {
            Logger.error(`Erro fatal no ResumoService para ${nome_usina}:`, error);
            return `❌ Erro ao gerar resumo: ${error.message}`;
        }
    }

    async _buscar_rt_potencia(usina) {
        try {
            const res = await this.apiRT.getLeitura(usina, 'potencias');
            return res?.unidades_geradoras || null;
        } catch (e) {
            Logger.error(`Falha RT Potência ${usina}`, e);
            return null;
        }
    }

    async _buscar_rt_nivel(usina) {
        try {
            const res = await this.apiRT.getLeitura(usina, 'nivel_agua');
            return res?.unidades_geradoras || null;
        } catch (e) {
            Logger.error(`Falha RT Nível ${usina}`, e);
            return null;
        }
    }

    async _buscar_historico_24h(usina, inicio, fim) {
        try {
            const fmt = 'DD/MM/YYYY HH:mm';
            return await this.apiHist.getDadosHistoricos(
                usina,
                inicio.format(fmt),
                fim.format(fmt),
                'D'
            );
        } catch (e) {
            Logger.error(`Falha Histórico ${usina}`, e);
            return null;
        }
    }

    _extrair_caracteristicas(usina) {
        const dadosUsina = configUsinas[usina];
        if (!dadosUsina || !dadosUsina.CLPS) return {};

        // Assume características da primeira UG encontrada (comum em PCHs)
        const primeiraUG = Object.values(dadosUsina.CLPS)[0];
        return primeiraUG?.caracteristicas || {};
    }
}

module.exports = ResumoService;

