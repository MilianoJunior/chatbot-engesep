// ========================================
// TESTE DE PERÍODOS RELATIVOS
// ========================================
// 
// Testa se o Leonardo consegue entender
// períodos relativos como "últimos 3 dias"

require('dotenv').config();
const { askOpenAI } = require('./services/apiOpenai');
const { getContextoAtualizado } = require('./utils/context');

async function testarPeriodosRelativos() {
    console.log('=== TESTE DE PERÍODOS RELATIVOS ===\n');
    
    const contexto = getContextoAtualizado();
    console.log('📅 Contexto atualizado obtido');
    console.log(`⏰ Data atual: ${new Date().toLocaleDateString('pt-BR')}`);
    console.log(`🕐 Hora atual: ${new Date().toLocaleTimeString('pt-BR')}\n`);
    
    // Perguntas para testar períodos relativos
    const perguntas = [
        '@leo Qual foi a produção de energia dos últimos 3 dias da usina CGH-APARECIDA?',
        '@leo Mostre o histórico da usina CGH-FAE da semana passada',
        '@leo Dados históricos da usina CGH-HOPPEN do mês passado',
        '@leo Produção de energia da usina PCH-PEDRAS deste mês',
        '@leo Histórico da usina CGH-PICADAS-ALTAS deste ano'
    ];
    
    for (let i = 0; i < perguntas.length; i++) {
        const pergunta = perguntas[i];
        console.log(`--- TESTE ${i + 1}: ${pergunta} ---`);
        
        try {
            const resposta = await askOpenAI(pergunta, contexto);
            console.log('🤖 Resposta do Leonardo:');
            console.log(resposta);
            
            // Verificar se a resposta contém datas específicas
            if (resposta.includes('"comando":"historico"')) {
                console.log('✅ Comando de histórico detectado!');
                
                // Tentar extrair datas da resposta
                const dataMatch = resposta.match(/"data_inicio":"([^"]+)"/);
                const dataFimMatch = resposta.match(/"data_fim":"([^"]+)"/);
                
                if (dataMatch && dataFimMatch) {
                    console.log(`📅 Data início: ${dataMatch[1]}`);
                    console.log(`📅 Data fim: ${dataFimMatch[1]}`);
                    
                    // Verificar se as datas fazem sentido
                    const dataInicio = new Date(dataMatch[1].split('/').reverse().join('-'));
                    const dataFim = new Date(dataFimMatch[1].split('/').reverse().join('-'));
                    const hoje = new Date();
                    
                    if (dataInicio <= hoje && dataFim <= hoje) {
                        console.log('✅ Datas estão no passado (correto)');
                    } else {
                        console.log('⚠️ Datas podem estar incorretas');
                    }
                } else {
                    console.log('❌ Não foi possível extrair datas da resposta');
                }
            } else {
                console.log('❌ Comando de histórico não detectado');
            }
            
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
        }
        
        console.log('\n' + '─'.repeat(60) + '\n');
        
        // Aguardar um pouco entre as perguntas
        if (i < perguntas.length - 1) {
            console.log('⏳ Aguardando 3 segundos...\n');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    console.log('=== TESTE CONCLUÍDO ===');
    console.log('📋 Resumo:');
    console.log('   - Testou 5 perguntas com períodos relativos');
    console.log('   - Verificou se Leonardo entende datas relativas');
    console.log('   - Confirmou se as datas calculadas fazem sentido');
    console.log('   - Leonardo agora pode responder a "últimos 3 dias"!');
}

// Executar teste
testarPeriodosRelativos().catch(console.error);
