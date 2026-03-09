// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. tratarRespostaLeonardo → analisa JSON/Texto da IA
// 2. formatarRespostaTempoReal → formatação RT padrão
// 3. formatarRespostaHistorico → formatação Histórico (resultado + dados)
// 4. formatarRespostaResumo → formatação Resumo Operativo
// 5. normalizarNomeUsina → padronização de nomes
// 6. _agruparPorUG → pivota array da API em mapa {UG: [{data, valor}]}
// 7. _labelPeriodo → traduz código de período (D/M/H) para label
// 8. _labelGrupo → traduz grupo da API para label legível
// 9. _unidadeAutomatica → detecta unidade pela chave da variável
// -------------------------------------------------------------------

const dayjs = require('dayjs');

// Configurações e Mapas
const MAPEAMENTO_USINAS = {
    'cgh_aparecida': 'CGH-APARECIDA',
    'cgh_fae': 'CGH-FAE',
    'cgh_picadas_altas': 'CGH-PICADAS-ALTAS',
    'cgh_hoppen': 'CGH-HOPPEN',
    'pch_pedras': 'PCH-PEDRAS',
    'pch_pira': 'PCH-PIRA'
};

// -------------------------------------------------------------------
// 1. TRATAMENTO DE RESPOSTA IA
// -------------------------------------------------------------------
async function tratarRespostaLeonardo(resposta) {

    try {
        // Verificar se a resposta está em formato JSON
        if (typeof resposta === 'string' && resposta.trim().startsWith('{') && resposta.trim().endsWith('}')) {
            const json = JSON.parse(resposta);

            // Se contém comando para API, processar
            if (json.comando === 'leitura') {
                // Normalizar nome da usina para formato padrão
                if (json.parametros && json.parametros.usina) {
                    json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
                }
            }

            // Comando para histórico de energia
            if (json.comando === 'historico') {
                // Normalizar nome da usina para formato padrão
                if (json.parametros && json.parametros.usina) {
                    json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
                }
            }
            return json;
        }

        // Se não for JSON, retornar a resposta original
        return resposta;

    } catch (error) {
        return 'Erro ao processar resposta: ' + error.message;
    }
}
// -------------------------------------------------------------------
// 2. FORMATAÇÃO TEMPO REAL (Dinâmico — mesmo estilo do histórico)
// -------------------------------------------------------------------
function formatarRespostaTempoReal(dados) {
    if (!dados || typeof dados !== 'object') return '❌ Dados inválidos';

    const usina = dados.usina || 'USINA';
    const dataHora = dados.timestamp ? dayjs(dados.timestamp).format('DD/MM/YYYY, HH:mm:ss') : '—';
    const ugs = dados.unidades_geradoras || {};

    let texto = `📊 ${usina} - ${dataHora}\n\n`;
    let somaPotencia = 0;
    let temPotencia = false;

    Object.entries(ugs).forEach(([nomeUg, dadosUg]) => {
        texto += `*${nomeUg}*\n`;
        const valores = dadosUg.dados || dadosUg;

        if (typeof valores !== 'object') {
            texto += `  ${valores}\n`;
            return;
        }

        Object.entries(valores).forEach(([k, v]) => {
            if (k === 'tempo_execucao' || k === 'caracteristicas') return;
            const val = (typeof v === 'object' && v?.value !== undefined) ? v.value : v;
            if (typeof val !== 'number') return;

            // Acumular soma de potência ativa
            if (k.toLowerCase().includes('potência ativa')) {
                somaPotencia += val;
                temPotencia = true;
            }

            const nomeChave = k.replace(/ value$/i, '').replace(/_/g, ' ');
            texto += `  ${nomeChave}: ${val.toFixed(2)}${_unidadeAutomatica(k)}\n`;
        });
        texto += `\n`;
    });

    // Totalizar potência ativa se houver mais de uma UG
    if (temPotencia && Object.keys(ugs).length > 1) {
        texto += `*Total Potência Ativa: ${somaPotencia.toFixed(2)} kW*\n`;
    }

    return texto;
}

// -------------------------------------------------------------------
// 3. FORMATAÇÃO HISTÓRICO
// -------------------------------------------------------------------
function formatarRespostaHistorico(dados) {
    if (!dados) return '❌ Sem dados históricos';
    if (dados.status === 'sem_dados') return `ℹ️ Sem dados para o período em ${dados.usina}.`;

    const usina = dados.usina || 'USINA';
    const dataHora = dayjs().format('DD/MM/YYYY, HH:mm:ss');

    let texto = `📊 ${usina} - ${dataHora}\n\n`;

    // --- CASO 1: producao-acumulada (campo 'resultado') ---
    if (Array.isArray(dados.resultado)) {
        const periodo = dados.periodo || 'D';
        texto += `*📈 Geração de energia (${_labelPeriodo(periodo)})*\n\n`;

        if (dados.resultado.length === 0) {
            texto += 'Nenhum dado encontrado.\n';
            return texto;
        }

        const ugMap = _agruparPorUG(dados.resultado);
        const ugs = Object.keys(ugMap).sort();

        ugs.forEach(ug => {
            texto += `*${ug}*\n`;
            ugMap[ug].forEach(({ data, valor }) => {
                texto += `  ${data}: ${valor.toFixed(2)} MWh\n`;
            });
            texto += `\n`;
        });

        let totalGeral = 0;
        ugs.forEach(ug => {
            const soma = ugMap[ug].reduce((acc, r) => acc + r.valor, 0);
            texto += `Soma ${ug}: ${soma.toFixed(2)} MWh\n`;
            totalGeral += soma;
        });
        texto += `Total: ${totalGeral.toFixed(2)} MWh\n`;

        return texto;
    }

    // --- CASO 2: grupo-usina / sensor-usina / tabela-usina (campo 'dados') ---
    if (Array.isArray(dados.dados)) {
        const grupo = dados.grupo || dados.variavel || 'Dados';
        const label = _labelGrupo(grupo);
        texto += `*📊 ${label}*\n\n`;

        if (dados.dados.length === 0) {
            texto += 'Nenhum dado encontrado.\n';
            return texto;
        }

        dados.dados.forEach(reg => {
            const ts = reg.data_hora
                ? dayjs(reg.data_hora).format('DD/MM/YYYY HH:mm')
                : '—';
            texto += `🕐 ${ts}\n`;

            Object.entries(reg).forEach(([chave, valor]) => {
                if (chave === 'data_hora' || typeof valor !== 'number') return;
                texto += `  ${chave}: ${valor.toFixed(2)}${_unidadeAutomatica(chave)}\n`;
            });
            texto += `\n`;
        });

        texto += `Total de registros: ${dados.registros || dados.dados.length}\n`;
        return texto;
    }

    // --- FALLBACK ---
    texto += 'Nenhum dado encontrado.\n';
    return texto;
}

// -------------------------------------------------------------------
// 4. FORMATAÇÃO RESUMO OPERATIVO
// -------------------------------------------------------------------
function formatarRespostaResumo(dados) {
    if (!dados || !dados.resultado) return '❌ Resumo indisponível';

    const r = dados.resultado;
    const usina = r.usina || dados.usina;
    const dataHoje = dayjs().format('DD/MM/YYYY');

    let texto = `📊 ${usina} - ${dataHoje}\n\n`;

    // --- POTÊNCIA ---
    texto += `*⚡ Potência ativa em tempo real*\n`;
    if (r.rt_potencia) {
        Object.entries(r.rt_potencia).forEach(([nome, info]) => {
            const valores = info.dados || info;
            if (typeof valores !== 'object') return;
            Object.entries(valores).forEach(([k, v]) => {
                if (k === 'tempo_execucao') return;
                const val = (typeof v === 'object' && v?.value !== undefined) ? v.value : v;
                if (typeof val !== 'number') return;
                texto += `${nome} - ${k}: ${val.toFixed(2)}${_unidadeAutomatica(k)}\n`;
            });
        });
    } else {
        texto += `(Sem dados)\n`;
    }
    texto += `\n`;

    // --- NÍVEIS ---
    texto += `*💧 Níveis de água em tempo real*\n`;
    if (r.rt_nivel) {
        Object.entries(r.rt_nivel).forEach(([nome, info]) => {
            const valores = info.dados || info;
            if (typeof valores !== 'object') return;
            Object.entries(valores).forEach(([k, v]) => {
                if (k === 'tempo_execucao') return;
                const val = (typeof v === 'object' && v?.value !== undefined) ? v.value : v;
                if (typeof val !== 'number') return;
                texto += `${k}: ${val.toFixed(2)}${_unidadeAutomatica(k)}\n`;
            });
        });

        // Vertimento
        if (r.limites && r.limites['nível de vertimento']) {
            texto += `Vertimento Ref: ${r.limites['nível de vertimento']} m\n`;
        }
    } else {
        texto += `(Sem dados)\n`;
    }
    texto += `\n`;

    // --- GERAÇÃO ---
    texto += `*📈 Geração de energia (Diário)*\n`;
    const hist = r.historico?.resultado;
    if (Array.isArray(hist) && hist.length > 0) {
        const ugMap = _agruparPorUG(hist);
        let totalGeral = 0;

        Object.keys(ugMap).sort().forEach(ug => {
            const soma = ugMap[ug].reduce((acc, r) => acc + r.valor, 0);
            texto += `${ug}: ${soma.toFixed(2)} MWh\n`;
            totalGeral += soma;
        });
        texto += `Total: ${totalGeral.toFixed(2)} MWh\n`;
        texto += `\nobs: intervalo de geração é das 00:00:00 \naté hora da consulta do dia atual.\n`;
    } else {
        texto += `(Histórico indisponível)\n`;
    }

    return texto;
}

// -------------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------------

function normalizarNomeUsina(nomeUsina) {
    // Mapear nomes em lowercase/underscore para formato padrão
    const mapeamentoUsinas = {
        'cgh_aparecida': 'CGH-APARECIDA',
        'cgh_fae': 'CGH-FAE',
        'cgh_picadas_altas': 'CGH-PICADAS-ALTAS',
        'cgh_hoppen': 'CGH-HOPPEN',
        'pch_pedras': 'PCH-PEDRAS',
        'pch_pira': 'PCH-PIRA'
    };

    const nomeLower = nomeUsina.toLowerCase().replace(/-/g, '_');
    return mapeamentoUsinas[nomeLower] || nomeUsina;
}


/**
 * Pivota array de registros da API em mapa por UG.
 * Input:  [{ data: '2025-08-17', 'prod_UG-01 Energia Acumulada': 14.14 }, ...]
 * Output: { 'UG-01': [{ data: '2025-08-17', valor: 14.14 }], ... }
 */
function _agruparPorUG(registros) {
    const ugMap = {};

    registros.forEach(reg => {
        const data = reg.data || '—';
        Object.entries(reg).forEach(([chave, valor]) => {
            if (chave === 'data' || typeof valor !== 'number') return;

            // Extrai nome da UG a partir de chaves como 'prod_UG-01 Energia Acumulada'
            const match = chave.match(/(UG-?\d+)/i);
            const nomeUG = match ? match[1].toUpperCase() : chave;

            if (!ugMap[nomeUG]) ugMap[nomeUG] = [];
            ugMap[nomeUG].push({ data, valor });
        });
    });

    return ugMap;
}

function _labelPeriodo(periodo) {
    const labels = { 'D': 'Diário', 'M': 'Mensal', 'H': 'Horário' };
    return labels[periodo] || periodo;
}

function _labelGrupo(grupo) {
    const labels = {
        'potencia': 'Potências',
        'temperaturas': 'Temperaturas',
        'nivel_agua': 'Níveis de Água',
        'hidraulica': 'Dados Hidráulicos',
        'gerador': 'Dados do Gerador'
    };
    return labels[grupo] || grupo;
}

function _unidadeAutomatica(chave) {
    const kl = chave.toLowerCase();
    if (kl.includes('potência ativa') || kl.includes('pot') && kl.includes('ativa')) return ' kW';
    if (kl.includes('potência reativa')) return ' kVAr';
    if (kl.includes('potência aparente')) return ' kVA';
    if (kl.includes('fator de potência') || kl.includes('fator_potencia')) return '';
    if (kl.includes('temp') || kl.includes('enrolamento') || kl.includes('mancal')) return ' °C';
    if (kl.includes('tensão') || kl.includes('tensao')) return ' V';
    if (kl.includes('corrente')) return ' A';
    if (kl.includes('frequência') || kl.includes('frequencia')) return ' Hz';
    if (kl.includes('nível') || kl.includes('nivel') || kl.includes('montante') || kl.includes('jusante')) return ' m';
    if (kl.includes('velocidade')) return ' rpm';
    if (kl.includes('pressão') || kl.includes('pressao')) return ' bar';
    if (kl.includes('energia')) return ' MWh';
    return '';
}

module.exports = {
    tratarRespostaLeonardo,
    formatarRespostaTempoReal,
    formatarRespostaHistorico,
    formatarRespostaResumo,
    normalizarNomeUsina
};
