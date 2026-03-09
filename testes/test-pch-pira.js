// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. exibirConfiguracao → imprime estrutura completa da PCH-PIRA
// 2. testarLeituraPorTipo → lê dados RT de um tipo específico via API
// 3. testarTodasLeituras → percorre todos os tipos de todas as UGs
// 4. main → execução principal com flags --config, --tipo, --tudo
// -------------------------------------------------------------------

const ApiService = require('../services/apiReadRT');
const leituras = require('../config/usinas');

// -------------------------------------------------------------------
// CONFIGURAÇÕES
// -------------------------------------------------------------------
const USINA = 'PCH-PIRA';
const TIPOS_LEITURA = ['potencias', 'gerador', 'producao', 'monitoramento'];

// -------------------------------------------------------------------
// FUNÇÕES
// -------------------------------------------------------------------

/**
 * Imprime a estrutura completa da PCH-PIRA no console
 */
function exibirConfiguracao() {
    const usina = leituras[USINA];
    if (!usina) {
        console.log(`❌ Usina ${USINA} não encontrada em config/usinas.js`);
        return;
    }

    console.log(`\n🏭 CONFIGURAÇÃO DA ${USINA}`);
    console.log('='.repeat(60));
    console.log(`  IP: ${usina.ip} | Porta: ${usina.port} | Tabela: ${usina.table}`);

    for (const [ugNome, ugData] of Object.entries(usina.CLPS)) {
        console.log(`\n  📌 ${ugNome}`);
        console.log(`     Conexão: ${ugData.conexao.ip}:${ugData.conexao.port}`);
        
        if (ugData.caracteristicas) {
            console.log(`     Características: ${JSON.stringify(ugData.caracteristicas)}`);
        }

        for (const tipo of TIPOS_LEITURA) {
            if (!ugData[tipo]) continue;
            const sensores = Object.keys(ugData[tipo]);
            console.log(`     ${tipo}: [${sensores.join(', ')}]`);
        }
    }
    console.log('\n' + '='.repeat(60));
}

/**
 * Testa leitura RT de um tipo específico para todas as UGs
 */
async function testarLeituraPorTipo(tipo) {
    const api = new ApiService();
    
    console.log(`\n📡 LEITURA RT: ${USINA} → ${tipo}`);
    console.log('-'.repeat(50));

    try {
        const resultado = await api.getLeitura(USINA, tipo);
        
        console.log(`  Timestamp: ${resultado.timestamp}`);
        
        for (const [ug, dados] of Object.entries(resultado.unidades_geradoras)) {
            console.log(`\n  🔋 ${ug} (${dados.tempo_execucao?.toFixed(2) || '?'}s)`);
            
            if (dados.erro) {
                console.log(`     ❌ Erro: ${dados.erro}`);
                continue;
            }

            if (dados.dados) {
                for (const [sensor, valor] of Object.entries(dados.dados)) {
                    console.log(`     ${sensor}: ${valor}`);
                }
            } else {
                console.log('     ⚠️  Sem dados retornados');
            }
        }
    } catch (error) {
        console.log(`  ❌ Erro: ${error.message}`);
    }
}

/**
 * Testa todas as leituras de todos os tipos
 */
async function testarTodasLeituras() {
    console.log(`\n🚀 TESTE COMPLETO: ${USINA}`);
    console.log('='.repeat(60));

    for (const tipo of TIPOS_LEITURA) {
        await testarLeituraPorTipo(tipo);
    }

    console.log('\n✅ TESTE COMPLETO FINALIZADO');
}

// -------------------------------------------------------------------
// EXECUÇÃO
// -------------------------------------------------------------------
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.includes('--config')) {
        exibirConfiguracao();
    } else if (args.includes('--tipo')) {
        const idx = args.indexOf('--tipo');
        const tipo = args[idx + 1];
        if (!tipo || !TIPOS_LEITURA.includes(tipo)) {
            console.log(`❌ Tipo inválido. Use: ${TIPOS_LEITURA.join(', ')}`);
            process.exit(1);
        }
        testarLeituraPorTipo(tipo).catch(console.error);
    } else if (args.includes('--tudo')) {
        testarTodasLeituras().catch(console.error);
    } else {
        console.log(`\n📋 Teste da ${USINA} - Opções:`);
        console.log('  --config  : Exibir configuração da usina');
        console.log('  --tipo X  : Testar leitura de um tipo (potencias, gerador, producao, monitoramento)');
        console.log('  --tudo    : Testar todas as leituras');
        console.log('\nExemplos:');
        console.log('  node testes/test-pch-pira.js --config');
        console.log('  node testes/test-pch-pira.js --tipo potencias');
        console.log('  node testes/test-pch-pira.js --tudo');
    }
}

module.exports = { exibirConfiguracao, testarLeituraPorTipo, testarTodasLeituras };
