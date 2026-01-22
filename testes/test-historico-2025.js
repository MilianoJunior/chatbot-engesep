// ========================================
// TESTE ESPECÍFICO - DADOS HISTÓRICOS 2025
// ========================================
// 
// Consulta dados históricos de abril a agosto de 2025
// para verificar se há dados disponíveis no período

require('dotenv').config();
const ApiHistorico = require('./services/apiHistorico');
const Logger = require('./utils/logger');

async function testarHistorico2025() {
    console.log('=== TESTE DE DADOS HISTÓRICOS 2025 ===\n');
    
    const apiHistorico = new ApiHistorico();
    
    // Período de teste: abril a agosto de 2025
    const dataInicio = '01/04/2025';
    const dataFim = '31/08/2025';
    
    console.log(`📅 Período de consulta: ${dataInicio} a ${dataFim}\n`);
    
    // Lista de usinas para testar
    const usinas = [
        'CGH-APARECIDA',
        'CGH-FAE', 
        'PCH-PEDRAS',
        'CGH-PICADAS-ALTAS',
        'CGH-HOPPEN'
    ];
    
    for (const usina of usinas) {
        console.log(`🏭 Testando usina: ${usina}`);
        console.log('─'.repeat(50));
        
        try {
            // Teste 1: Período diário
            console.log('📊 Testando período DIÁRIO...');
            const resultadoDiario = await apiHistorico.getProducaoAcumulada(
                usina, 
                dataInicio, 
                dataFim, 
                'D'
            );
            
            if (resultadoDiario.status === 'sem_dados') {
                console.log('❌ Nenhum dado encontrado para período diário');
            } else {
                console.log('✅ Dados encontrados para período diário:');
                console.log(`   - Usina: ${resultadoDiario.usina}`);
                console.log(`   - Período: ${resultadoDiario.periodo}`);
                console.log(`   - Resultado: ${JSON.stringify(resultadoDiario.resultado, null, 2)}`);
            }
            
            console.log('');
            
            // Teste 2: Período mensal
            console.log('📈 Testando período MENSAL...');
            const resultadoMensal = await apiHistorico.getProducaoAcumulada(
                usina, 
                dataInicio, 
                dataFim, 
                'M'
            );
            
            if (resultadoMensal.status === 'sem_dados') {
                console.log('❌ Nenhum dado encontrado para período mensal');
            } else {
                console.log('✅ Dados encontrados para período mensal:');
                console.log(`   - Usina: ${resultadoMensal.usina}`);
                console.log(`   - Período: ${resultadoMensal.periodo}`);
                console.log(`   - Resultado: ${JSON.stringify(resultadoMensal.resultado, null, 2)}`);
            }
            
            console.log('');
            
            // Teste 3: Período horário
            console.log('⏰ Testando período HORÁRIO...');
            const resultadoHorario = await apiHistorico.getProducaoAcumulada(
                usina, 
                dataInicio, 
                dataFim, 
                'H'
            );
            
            if (resultadoHorario.status === 'sem_dados') {
                console.log('❌ Nenhum dado encontrado para período horário');
            } else {
                console.log('✅ Dados encontrados para período horário:');
                console.log(`   - Usina: ${resultadoHorario.usina}`);
                console.log(`   - Período: ${resultadoHorario.periodo}`);
                console.log(`   - Resultado: ${JSON.stringify(resultadoHorario.resultado, null, 2)}`);
            }
            
        } catch (error) {
            console.log(`❌ Erro ao consultar ${usina}: ${error.message}`);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
    }
    
    console.log('=== TESTE CONCLUÍDO ===');
    console.log('📋 Resumo:');
    console.log('   - Verificou dados de 5 usinas');
    console.log('   - Testou 3 tipos de período (D, M, H)');
    console.log('   - Período: abril a agosto de 2025');
    console.log('   - API: http://localhost:8000');
}

// Executar teste
testarHistorico2025().catch(console.error);
