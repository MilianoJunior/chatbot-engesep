// ========================================
// ARQUIVO DE TESTE DA API OPENAI + APIS
// ========================================

// importar a configuração das usinas
const configUsinas = require('../config/usinas');

/**
 * Função principal para percorrer e exibir todas as informações de configUsinas
 */
function percorrerConfigUsinas() {
    console.log('🏭 PERCORRENDO CONFIGURAÇÃO DAS USINAS\n');
    
    // Obter nomes das usinas
    const nomesUsinas = Object.keys(configUsinas);
    console.log(`📋 Total de usinas configuradas: ${nomesUsinas.length}\n`);
    
    // Percorrer cada usina
    nomesUsinas.forEach((nomeUsina, index) => {
        console.log(`\n${index + 1}. ${nomeUsina}`);
        console.log('='.repeat(50));
        
        const usina = configUsinas[nomeUsina];
        exibirInformacoesUsina(nomeUsina, usina);
    });
    
    console.log('\n✅ PERCURSO CONCLUÍDO!');
}

/**
 * Função para gerar perguntas de teste baseadas na configuração
 */
async function gerarPerguntasTesteRT() {
    console.log('🧪 PERGUNTAS DE TESTE BASEADAS NA CONFIGURAÇÃO PARA API EM TEMPO REAL\n');
    
    for (const nomeUsina of Object.keys(configUsinas)) {
        const usina = configUsinas[nomeUsina];
        const clps = Object.keys(usina.CLPS);
        
        console.log('--------------------------------');
        console.log(nomeUsina);
        
        for (const nomeCLP of clps) {
            const clp = usina.CLPS[nomeCLP];
            
            // Perguntas para potências
            if (clp.potencias) {
                const pergunta = `@leo: qual a potência ativa da ${nomeUsina} ${nomeCLP}?`;
                console.log(`\n🔍 TESTANDO: ${pergunta}`);
                try {
                    console.log(`✅ RESPOSTA: ${resposta}`);
                } catch (error) {
                    console.log(`❌ ERRO: ${error.message}`);
                }
            }
            
            // Perguntas para temperaturas
            if (clp.temperaturas) {
                const tiposTemp = Object.keys(clp.temperaturas);
                for (const tipoDado of tiposTemp) {
                    const sensores = clp.temperaturas[tipoDado];
                    const nomesSensores = Object.keys(sensores);
                    if (nomesSensores.length > 0) {
                        const primeiroSensor = nomesSensores[0];
                        const pergunta = `@leo: qual a temperatura do ${primeiroSensor} da ${nomeUsina} ${nomeCLP}?`;
                        console.log(`\n🔍 TESTANDO: ${pergunta}`);
                        try {
                            const resposta = await executarTesteLocal(pergunta);
                            console.log(`✅ RESPOSTA: ${resposta}`);
                        } catch (error) {
                            console.log(`❌ ERRO: ${error.message}`);
                        }
                    }
                }
            }
            
            // Perguntas para nível d'água
            if (clp.nivel_agua) {
                const pergunta = `@leo: qual o nível d'água montante da ${nomeUsina} ${nomeCLP}?`;
                console.log(`\n🔍 TESTANDO: ${pergunta}`);
                try {
                    const resposta = await executarTesteLocal(pergunta);
                    console.log(`✅ RESPOSTA: ${resposta}`);
                } catch (error) {
                    console.log(`❌ ERRO: ${error.message}`);
                }
            }
        }
    }
}

async function gerarPerguntasTesteHistorico() {
    console.log('🧪 PERGUNTAS DE TESTE BASEADAS NA CONFIGURAÇÃO PARA API DE HISTÓRICO\n');
    
    for (const nomeUsina of Object.keys(configUsinas)) {
        const usina = configUsinas[nomeUsina];
        const clps = Object.keys(usina.CLPS);
        
        console.log('--------------------------------');
        console.log(nomeUsina);

        const perguntas = [
            `@leo: qual a potência gerada hj na ${nomeUsina}?`,
            `@leo: qual a potência gerada ontém na ${nomeUsina}?`,
            `@leo: qual a potência gerada no dia 17/08/2025 na ${nomeUsina}?`,
            `@leo: qual a potência gerada no mês de agosto de 2025 da ${nomeUsina}?`,
            `@leo: qual a potência gerada no mês de junho de 2025 da ${nomeUsina}?`,
            `@leo: qual a potência gerada no ano de 2025 da ${nomeUsina}?`
        ];
        
        // Testar cada pergunta
        for (const pergunta of perguntas) {
            console.log(`\n🔍 TESTANDO: ${pergunta}`);
            try {
                const resposta = await executarTesteLocal(pergunta);
                console.log(`✅ RESPOSTA: ${resposta}`);
            } catch (error) {
                console.log(`❌ ERRO: ${error.message}`);
            }
        }
    }
}
// ========================================
// EXECUÇÃO DOS TESTES
// ========================================

// Função para testar uma pergunta específica
async function testarPerguntaEspecifica(pergunta) {
    console.log(`\n🧪 TESTANDO PERGUNTA ESPECÍFICA:`);
    console.log(`Pergunta: ${pergunta}`);
    try {
        const resposta = await executarTesteLocal(pergunta);
        console.log(`✅ Resposta: ${resposta}`);
        return resposta;
    } catch (error) {
        console.log(`❌ Erro: ${error.message}`);
        return null;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    console.log('🚀 INICIANDO TESTES DO CHATBOT LEONARDO\n');
    
    // Escolher qual teste executar
    const args = process.argv.slice(2);
    
    if (args.includes('--rt')) {
        console.log('📡 Executando testes de tempo real...');
        gerarPerguntasTesteRT().catch(console.error);
    } else if (args.includes('--historico')) {
        console.log('📊 Executando testes de histórico...');
        gerarPerguntasTesteHistorico().catch(console.error);
    } else if (args.includes('--pergunta')) {
        const perguntaIndex = args.indexOf('--pergunta');
        if (perguntaIndex + 1 < args.length) {
            const pergunta = args[perguntaIndex + 1];
            testarPerguntaEspecifica(pergunta).catch(console.error);
        } else {
            console.log('❌ Use: --pergunta "sua pergunta aqui"');
        }
    } else {
        console.log('📋 Opções disponíveis:');
        console.log('  --rt        : Testes de tempo real');
        console.log('  --historico : Testes de histórico');
        console.log('  --pergunta  : Testar pergunta específica');
        console.log('\nExemplo: node test-api.js --rt');
        console.log('Exemplo: node test-api.js --pergunta "@leo qual a potência da CGH-APARECIDA?"');
    }
}

module.exports = {
    gerarPerguntasTesteRT,
    gerarPerguntasTesteHistorico,
    testarPerguntaEspecifica
}


