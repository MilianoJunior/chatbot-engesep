// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. tratarRespostaLeonardo → analisa JSON/Texto da IA
// 2. formatarRespostaTempoReal → formatação RT padrão
// 3. formatarRespostaHistorico → formatação Histórico padrão
// 4. formatarRespostaResumo → formatação Resumo Operativo
// 5. normalizarNomeUsina → padronização de nomes
// -------------------------------------------------------------------

const dayjs = require('dayjs');

// Configurações e Mapas
const MAPEAMENTO_USINAS = {
    'cgh_aparecida': 'CGH-APARECIDA',
    'cgh_fae': 'CGH-FAE',
    'cgh_picadas_altas': 'CGH-PICADAS-ALTAS',
    'cgh_hoppen': 'CGH-HOPPEN',
    'pch_pedras': 'PCH-PEDRAS'
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

// async function tratarRespostaLeonardo(resposta) {
//     try {
//         if (!resposta) return 'Resposta vazia ou nula recebida';

//         // Verificar se a resposta está em formato JSON
//         if (typeof resposta === 'string' && resposta.trim().startsWith('{') && resposta.trim().endsWith('}')) {
//             const json = JSON.parse(resposta);

//             // Se contém comando para API, processar
//             if (json.comando === 'leitura') {
//                 // Normalizar nome da usina para formato padrão
//                 if (json.parametros && json.parametros.usina) {
//                     json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
//                 }
//             }

//             // Comando para histórico de energia
//             if (json.comando === 'historico') {
//                 // Normalizar nome da usina para formato padrão
//                 if (json.parametros && json.parametros.usina) {
//                     json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
//                 }
//             }

//             // Comando para resumo
//             if (json.comando === 'resumo') {
//                 if (json.parametros && json.parametros.usina) {
//                     json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
//                 }
//             }

//             return json;
//         }
//         return resposta;
//     } catch (error) {
//         console.error('Erro crítico tratarRespostaLeonardo:', error);
//         return `Erro crítico: ${error.message}`;
//     }
// }

// -------------------------------------------------------------------
// 2. FORMATAÇÃO TEMPO REAL (Dinâmico para Potência, Nível e Outros)
// -------------------------------------------------------------------
function formatarRespostaTempoReal(dados) {
    if (!dados || typeof dados !== 'object') return '❌ Dados inválidos';

    const usina = dados.usina || 'USINA';
    const dataHora = dados.timestamp ? dayjs(dados.timestamp).format('DD/MM/YYYY, HH:mm:ss') : '—';
    const ugs = dados.unidades_geradoras || {};

    // Tenta detectar o tipo de dado predominante analisando as chaves de todas as UGs
    let temPotencia = false;
    let temNivel = false;
    let contadorChaves = 0;

    Object.values(ugs).forEach(ugData => {
        const valores = ugData.dados || ugData;
        if (typeof valores === 'object') {
            Object.keys(valores).forEach(k => {
                if (k === 'tempo_execucao') return;
                contadorChaves++;
                const kl = k.toLowerCase();
                // Identifica Potência Ativa (exclusivo)
                if ((kl.includes('pot') && kl.includes('ativa')) || kl.includes('active_power')) {
                    temPotencia = true;
                }
                // Identifica Nível de Água (exclusivo)
                if (kl.includes('nivel') || kl.includes('montante') || kl.includes('jusante') || kl.includes('grade')) {
                    temNivel = true;
                }
            });
        }
    });

    // Se detectou ambos (improvável na API atual, mas possível) ou nenhum específico que justifique layout especial,
    // trataremos como genérico se houver muitas outras chaves misturadas.
    // Mas a prioridade é: Potência > Nível > Genérico

    let texto = `${usina} - ${dataHora}\n\n`;

    // --- CASO 1: POTÊNCIA ATIVA ---
    // Ativado apenas se a intenção parece ser exclusivamente potência
    if (temPotencia && !temNivel) {
        texto += `*⚡ Potência ativa em tempo real*\n`;
        let soma = 0;
        Object.entries(ugs).forEach(([nomeUg, dadosUg]) => {
            const val = _extrairValorPotencia(dadosUg);
            // Se retornar null, tenta achar algo para exibir ou diz sem leitura
            if (val !== null) {
                texto += `${nomeUg}: ${val.toFixed(2)} kW\n`;
                soma += val;
            } else {
                texto += `${nomeUg}: (Sem leitura)\n`;
            }
        });
        texto += `\nSoma: ${soma.toFixed(2)} kW\n`;
        return texto;
    }

    // --- CASO 2: NÍVEIS DE ÁGUA ---
    if (temNivel && !temPotencia) {
        texto += `*💧 Níveis de água em tempo real*\n`;

        const niveisBuffer = [];
        let montanteGeral = null;

        Object.entries(ugs).forEach(([nome, info]) => {
            const dadosFlat = (info.dados || info);

            Object.entries(dadosFlat).forEach(([k, v]) => {
                const val = (typeof v === 'object' && v?.value !== undefined) ? v.value : v;
                if (typeof val !== 'number') return;

                const kLower = k.toLowerCase();
                if (kLower.includes('montante')) {
                    niveisBuffer.push({ label: `Nível Montante ${nome}`, val: val, tipo: 'montante', ug: nome });
                    if (!montanteGeral) montanteGeral = val;
                } else if (kLower.includes('jusante') || kLower.includes('grade')) {
                    niveisBuffer.push({ label: `${nome}`, val: val, tipo: 'grade', ug: nome });
                } else if (kLower.includes('nivel') || kLower.includes('nível')) {
                    // Fallback para outros niveis genéricos
                    niveisBuffer.push({ label: `${k} ${nome}`, val: val });
                }
            });
        });

        // Montante (agrupado se igual)
        const montantes = niveisBuffer.filter(x => x.tipo === 'montante');
        const unicos = [...new Set(montantes.map(x => x.val))];
        if (unicos.length === 1) {
            texto += `Nível Montante: ${unicos[0].toFixed(2)} m\n`;
        } else {
            montantes.forEach(m => texto += `${m.label}: ${m.val.toFixed(2)} m\n`);
        }

        // Grades/Jusante
        const grades = niveisBuffer.filter(x => x.tipo === 'grade');
        grades.forEach(g => {
            texto += `${g.label}: ${g.val.toFixed(2)} m\n`;
        });

        // Outros níveis
        const outros = niveisBuffer.filter(x => !x.tipo);
        outros.forEach(o => {
            texto += `${o.label}: ${o.val.toFixed(2)} m\n`;
        });

        // Diferenciais (Grade vs Montante)
        grades.forEach(g => {
            const montanteRef = montantes.find(m => m.ug === g.ug) || montantes[0];
            if (montanteRef) {
                const diff = montanteRef.val - g.val;
                texto += `diferencial de grade ${g.ug}: ${diff.toFixed(2)} m\n`;
            }
        });

        return texto;
    }

    // --- CASO 3: GENÉRICO (Temperaturas, Gerador, Monitoramento, etc) ---
    // Formatação limpa chave-valor para qualquer outro dado
    texto += `*📊 Dados em Tempo Real*\n`;

    Object.entries(ugs).forEach(([nomeUg, dadosUg]) => {
        texto += `\n*${nomeUg}*\n`; // Destaca nome da UG/Grupo
        const valores = dadosUg.dados || dadosUg;

        if (typeof valores === 'object') {
            Object.entries(valores).forEach(([k, v]) => {
                // Ignora metadados internos
                if (k === 'tempo_execucao' || k === 'caracteristicas') return;

                const val = (typeof v === 'object' && v?.value !== undefined) ? v.value : v;

                // Formatação inteligente de valor
                let valFmt = val;
                if (typeof val === 'number') {
                    valFmt = val.toFixed(2);

                    // Adiciona unidades comuns baseado no nome da chave
                    const kl = k.toLowerCase();
                    if (kl.includes('temp') || kl.includes('enrolamento') || kl.includes('mancal') || kl.includes('oleo')) valFmt += ' °C';
                    else if (kl.includes('tensao')) valFmt += ' V';
                    else if (kl.includes('corrente')) valFmt += ' A';
                    else if (kl.includes('frequencia')) valFmt += ' Hz';
                    else if (kl.includes('velocidade')) valFmt += ' rpm';
                    else if (kl.includes('pressao')) valFmt += ' bar';
                }

                // Limpeza do nome da chave (remove "value", "alarmes" sufixos se redundante)
                let nomeChave = k.replace(/ value$/i, '').replace(/_/g, ' ');
                texto += `${nomeChave}: ${valFmt}\n`;
            });
        } else {
            texto += `${valores}\n`;
        }
    });

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
    texto += `*📈 Geração de energia (Diário)*\n\n`;

    const resultado = dados.resultado || {};
    let totalGeral = 0;
    let temDados = false;

    // Agrupamento por UG
    Object.keys(resultado).sort().forEach(key => {
        if (key.includes('energia') && Array.isArray(resultado[key])) {
            temDados = true;
            const nomeUg = key.replace(/_/g, ' ').replace(' energia', '').replace('acumulador ', '').toUpperCase();
            const registros = resultado[key];

            texto += `${nomeUg}:\n`;

            let somaUg = 0;

            // Limita visualização para não poluir se vierem muitos dados
            // Mas o pedido original mostra 3 dias.
            registros.forEach(reg => {
                let data = null;
                let valor = null;

                if (typeof reg === 'object') {
                    // Busca dinâmica de data e valor
                    const keys = Object.keys(reg);
                    const kData = keys.find(k => k.includes('data') || k.includes('timestamp'));
                    // Valor é o numérico que não é data
                    const kValor = keys.find(k => !k.includes('data') && !k.includes('timestamp') && typeof reg[k] === 'number');

                    if (kData) data = dayjs(reg[kData]).format('YYYY-MM-DD');
                    if (kValor) valor = reg[kValor];
                }

                if (data && valor !== null) {
                    texto += `  ${data}: ${valor.toFixed(2)} MWh\n`;
                    somaUg += valor;
                }
            });
            texto += `\n`;
        }
    });

    // Bloco de Somas por UG e Total
    let totaisTexto = '';
    Object.keys(resultado).sort().forEach(key => {
        if (key.includes('energia') && Array.isArray(resultado[key])) {
            const nomeUg = key.replace(/_/g, '').replace('energia', '').replace('acumulador', '').toUpperCase(); // Simplificado ex: UG01
            const registros = resultado[key];
            let soma = 0;
            registros.forEach(r => {
                const v = Object.values(r).find(val => typeof val === 'number');
                if (v) soma += v;
            });
            totaisTexto += `Soma ${nomeUg}: ${soma.toFixed(2)} MWh\n`;
            totalGeral += soma;
        }
    });

    if (totaisTexto) {
        texto += totaisTexto;
        texto += `Total: ${totalGeral.toFixed(2)} MWh\n`;
    }

    if (!temDados) texto += "Nenhum dado encontrado.\n";

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
            const val = _extrairValorPotencia(info);
            const valExibido = (val !== null) ? val : 0;
            texto += `${nome}: ${valExibido.toFixed(2)} kW\n`;
        });
    } else {
        texto += `(Sem dados)\n`;
    }
    texto += `\n`;

    // --- NÍVEIS ---
    texto += `*💧 Níveis de água em tempo real*\n`;
    if (r.rt_nivel) {
        const niveisBuffer = [];
        let montanteGeral = null;

        Object.entries(r.rt_nivel).forEach(([nome, info]) => {
            const dadosFlat = (info.dados || info);

            Object.entries(dadosFlat).forEach(([k, v]) => {
                const val = (typeof v === 'object' && v?.value !== undefined) ? v.value : v;
                if (typeof val !== 'number') return;

                const kLower = k.toLowerCase();

                if (kLower.includes('montante')) {
                    niveisBuffer.push({ label: `Nível Montante ${nome}`, val: val, tipo: 'montante', ug: nome });
                    if (!montanteGeral) montanteGeral = val;
                } else if (kLower.includes('jusante') || kLower.includes('grade')) {
                    niveisBuffer.push({ label: `${nome}`, val: val, tipo: 'grade', ug: nome });
                } else if (kLower.includes('nivel') || kLower.includes('nível')) {
                    niveisBuffer.push({ label: `${k} ${nome}`, val: val });
                }
            });
        });

        // Montante
        const montantes = niveisBuffer.filter(x => x.tipo === 'montante');
        const unicos = [...new Set(montantes.map(x => x.val))];

        if (unicos.length === 1) {
            texto += `Nível Montante: ${unicos[0].toFixed(2)} m\n`;
        } else {
            montantes.forEach(m => texto += `${m.label}: ${m.val.toFixed(2)} m\n`);
        }

        // Grade/Jusante
        const grades = niveisBuffer.filter(x => x.tipo === 'grade');
        grades.forEach(g => {
            texto += `${g.label}: ${g.val.toFixed(2)} m\n`;
        });

        // Diferenciais
        grades.forEach(g => {
            const montanteRef = montantes.find(m => m.ug === g.ug) || montantes[0];
            if (montanteRef) {
                const diff = montanteRef.val - g.val;
                texto += `diferencial de grade ${g.ug}: ${diff.toFixed(2)} m\n`;
            }
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
    if (r.historico && r.historico.resultado) {
        let totalGeral = 0;
        const hist = r.historico.resultado;

        Object.keys(hist).sort().forEach(key => {
            if (key.includes('energia') && Array.isArray(hist[key])) {
                const nomeUg = key.replace(/_/g, '-').replace('-energia', '').replace('-acumulador', '').toUpperCase();
                const registros = hist[key];
                let somaUg = 0;
                registros.forEach(reg => {
                    const v = Object.values(reg).find(val => typeof val === 'number');
                    if (v) somaUg += v;
                });

                texto += `${nomeUg}: ${somaUg.toFixed(2)} MWh\n`;
                totalGeral += somaUg;
            }
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
        'pch_pedras': 'PCH-PEDRAS'
    };

    const nomeLower = nomeUsina.toLowerCase().replace(/-/g, '_');
    return mapeamentoUsinas[nomeLower] || nomeUsina;
}

function _parseNum(v) {
    if (typeof v === 'number') return v;
    const f = parseFloat(String(v).replace(',', '.'));
    return isNaN(f) ? 0 : f;
}

function _extrairValorPotencia(dados) {
    if (!dados) return null;
    const valores = dados.dados || dados;
    if (typeof valores === 'number') return valores;
    if (typeof valores === 'object') {
        for (const k of Object.keys(valores)) {
            const kLower = k.toLowerCase();
            if ((kLower.includes('pot') && kLower.includes('ativa')) || kLower.includes('active_power')) {
                const v = valores[k];
                return (typeof v === 'object') ? _parseNum(v.value) : _parseNum(v);
            }
        }
    }
    return null;
}

module.exports = {
    tratarRespostaLeonardo,
    formatarRespostaTempoReal,
    formatarRespostaHistorico,
    formatarRespostaResumo,
    normalizarNomeUsina
};
