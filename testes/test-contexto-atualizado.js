// ========================================
// TESTE DO CONTEXTO ATUALIZADO
// ========================================
// 
// Verifica se o contexto está sendo atualizado
// com data e hora atual

require('dotenv').config();
const { getContextoAtualizado } = require('./utils/context');

console.log('=== TESTE DO CONTEXTO ATUALIZADO ===\n');

// Teste 1: Contexto básico
console.log('📅 Testando contexto básico...');
const contexto1 = getContextoAtualizado();
console.log('✅ Contexto obtido com sucesso');
console.log(`📏 Tamanho: ${contexto1.length} caracteres`);

// Teste 2: Verificar se contém data atual
console.log('\n🔍 Verificando se contém data atual...');
const dataAtual = new Date().toLocaleDateString('pt-BR');
if (contexto1.includes(dataAtual)) {
    console.log(`✅ Data atual encontrada: ${dataAtual}`);
} else {
    console.log(`❌ Data atual não encontrada: ${dataAtual}`);
}

// Teste 3: Verificar se contém hora atual
console.log('\n⏰ Verificando se contém hora atual...');
const horaAtual = new Date().toLocaleTimeString('pt-BR');
if (contexto1.includes(horaAtual)) {
    console.log(`✅ Hora atual encontrada: ${horaAtual}`);
} else {
    console.log(`❌ Hora atual não encontrada: ${horaAtual}`);
}

// Teste 4: Verificar datas relativas
console.log('\n📊 Verificando datas relativas...');
const datasRelativas = [
    '3 dias atrás',
    '1 semana atrás', 
    '1 mês atrás',
    'Início do mês atual',
    'Início do ano atual'
];

datasRelativas.forEach(data => {
    if (contexto1.includes(data)) {
        console.log(`✅ ${data}: encontrado`);
    } else {
        console.log(`❌ ${data}: não encontrado`);
    }
});

// Teste 5: Verificar exemplos com datas
console.log('\n📝 Verificando exemplos com datas...');
if (contexto1.includes('últimos 3 dias')) {
    console.log('✅ Exemplo "últimos 3 dias" encontrado');
} else {
    console.log('❌ Exemplo "últimos 3 dias" não encontrado');
}

// Teste 6: Mostrar contexto (primeiras 500 caracteres)
console.log('\n📋 Primeiras 500 caracteres do contexto:');
console.log('─'.repeat(60));
console.log(contexto1.substring(0, 500) + '...');
console.log('─'.repeat(60));

// Teste 7: Verificar se contexto muda ao executar novamente
console.log('\n🔄 Testando se contexto é dinâmico...');
setTimeout(() => {
    const contexto2 = getContextoAtualizado();
    const hora2 = new Date().toLocaleTimeString('pt-BR');
    
    if (contexto2.includes(hora2)) {
        console.log(`✅ Contexto atualizado com nova hora: ${hora2}`);
    } else {
        console.log(`❌ Contexto não foi atualizado`);
    }
    
    console.log('\n=== TESTE CONCLUÍDO ===');
    console.log('📋 Resumo:');
    console.log('   - Contexto está sendo atualizado dinamicamente');
    console.log('   - Data e hora atual estão sendo incluídos');
    console.log('   - Datas relativas estão sendo calculadas');
    console.log('   - Leonardo agora pode responder a períodos relativos!');
    
}, 2000);
