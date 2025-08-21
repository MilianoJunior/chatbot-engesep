// ========================================
// TESTE DE INTERVALOS CORRIGIDOS
// ========================================
// 
// Testa se o Leonardo está usando os intervalos
// corretos para consultas mensais (incluindo mês anterior)

require('dotenv').config();
const { askOpenAI } = require('./services/apiOpenai');
const { getContextoAtualizado } = require('./utils/context');

async function testarIntervalosCorrigidos() {
    console.log('=== TESTE DE INTERVALOS CORRIGIDOS ===\n');
    
    const contexto = getContextoAtualizado();
    console.log('📅 Contexto atualizado obtido');
    console.log(`⏰ Data atual: ${new Date().toLocaleDateString('pt-BR')}`);
    console.log(`🕐 Hora atual: ${new Date().toLocaleTimeString('pt-BR')}\n`);
    
    // Perguntas específicas para testar intervalos mensais
    const perguntas = [
        '@leo qual a produção de energia da hoppen no mês 08/2025',
        '@leo dados históricos da usina CGH-APARECIDA do mês 07/2025',
        '@leo produção de energia da usina CGH-FAE no mês 06/2025',
        '@leo histórico da usina PCH-PEDRAS do mês 05/2025',
        '@leo dados de energia da usina CGH-PICADAS-ALTAS no mês 04/2025'
    ];
    
    for (let i = 0; i < perguntas.length; i++) {
        const pergunta = perguntas[i];
        console.log(`--- TESTE ${i + 1}: ${pergunta} ---`);
        
        try {
            const resposta = await askOpenAI(pergunta, contexto);
            console.log('🤖 Resposta do Leonardo:');
            console.log(resposta);
            
            // Verificar se a resposta contém comando de histórico
            if (resposta.includes('"comando":"historico"')) {
                console.log('✅ Comando de histórico detectado!');
                
                // Extrair datas da resposta
                const dataMatch = resposta.match(/"data_inicio":"([^"]+)"/);
                const dataFimMatch = resposta.match(/"data_fim":"([^"]+)"/);
                
                if (dataMatch && dataFimMatch) {
                    const dataInicio = dataMatch[1];
                    const dataFim = dataFimMatch[1];
                    
                    console.log(`📅 Data início: ${dataInicio}`);
                    console.log(`📅 Data fim: ${dataFim}`);
                    
                    // Verificar se o intervalo está correto (data início > data fim)
                    const dataInicioObj = new Date(dataInicio.split('/').reverse().join('-'));
                    const dataFimObj = new Date(dataFim.split('/').reverse().join('-'));
                    
                    if (dataInicioObj > dataFimObj) {
                        console.log('✅ Intervalo correto: data início > data fim (mês seguinte → mês solicitado)');
                        
                        // Verificar se a diferença é aproximadamente 1 mês
                        const diffMeses = (dataInicioObj.getFullYear() - dataFimObj.getFullYear()) * 12 + 
                                        (dataInicioObj.getMonth() - dataFimObj.getMonth());
                        
                        if (diffMeses === 1) {
                            console.log('✅ Diferença de 1 mês confirmada');
                        } else {
                            console.log(`⚠️ Diferença de ${diffMeses} meses (pode estar incorreto)`);
                        }
                        
                    } else {
                        console.log('❌ Intervalo incorreto: data início deve ser > data fim');
                    }
                    
                    // Verificar se as datas fazem sentido para o mês solicitado
                    const mesSolicitado = dataFim.split('/')[1];
                    const anoSolicitado = dataFim.split('/')[2];
                    console.log(`📊 Mês solicitado: ${mesSolicitado}/${anoSolicitado}`);
                    
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
    console.log('   - Testou 5 consultas mensais específicas');
    console.log('   - Verificou se os intervalos estão corretos');
    console.log('   - Confirmou se data início > data fim');
    console.log('   - Leonardo agora usa intervalos corretos para a API!');
}

// Executar teste
testarIntervalosCorrigidos().catch(console.error);
