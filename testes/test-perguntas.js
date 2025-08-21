// ========================================
// 6 PERGUNTAS PARA TESTAR O BOT LEONARDO
// ========================================
// 
// Use estas perguntas no WhatsApp com o bot:
// 1. @leo Qual é a potência atual da usina CGH-APARECIDA?
// 2. @leo Mostre a temperatura dos enrolamentos da usina CGH-PICADAS-ALTAS
// 3. @leo Qual é o nível de água atual da usina PCH-PEDRAS?
// 4. @leo Dados históricos de energia da usina CGH-FAE de janeiro 2024
// 5. @leo Resumo geral de todas as usinas disponíveis
// 6. @leo Qual é o CNPJ e localização da usina CGH-HOPPEN?
// ========================================

console.log('=== 6 PERGUNTAS PARA TESTAR O BOT LEONARDO ===\n');

const perguntas = [
    {
        numero: 1,
        pergunta: '@leo Qual é a potência atual da usina CGH-APARECIDA?',
        tipo: 'Dados em Tempo Real',
        esperado: 'JSON com comando "leitura" e dados de potência da UG-01'
    },
    {
        numero: 2,
        pergunta: '@leo Mostre a temperatura dos enrolamentos da usina CGH-PICADAS-ALTAS',
        tipo: 'Dados em Tempo Real',
        esperado: 'JSON com comando "leitura" e dados de temperatura das UGs 01 e 02'
    },
    {
        numero: 3,
        pergunta: '@leo Qual é o nível de água atual da usina PCH-PEDRAS?',
        tipo: 'Dados em Tempo Real',
        esperado: 'JSON com comando "leitura" e dados de nível de água das UGs 01 e 02'
    },
    {
        numero: 4,
        pergunta: '@leo Dados históricos de energia da usina CGH-FAE de janeiro 2024',
        tipo: 'Dados Históricos',
        esperado: 'JSON com comando "historico" e período específico'
    },
    {
        numero: 5,
        pergunta: '@leo Resumo geral de todas as usinas disponíveis',
        tipo: 'Resumo Geral',
        esperado: 'JSON com comando "resumo_all"'
    },
    {
        numero: 6,
        pergunta: '@leo Qual é o CNPJ e localização da usina CGH-HOPPEN?',
        tipo: 'Dados Estáticos',
        esperado: 'Resposta em texto usando contexto das usinas'
    }
];

perguntas.forEach(p => {
    console.log(`${p.numero}. ${p.pergunta}`);
    console.log(`   Tipo: ${p.tipo}`);
    console.log(`   Esperado: ${p.esperado}`);
    console.log('');
});

console.log('=== INSTRUÇÕES DE TESTE ===');
console.log('1. Execute o bot: node index.js');
console.log('2. Escaneie o QR Code no WhatsApp');
console.log('3. Envie cada pergunta para o bot');
console.log('4. Verifique se a resposta está correta');
console.log('5. Confirme se os dados são reais ou simulados');
console.log('');
console.log('=== RESULTADOS ESPERADOS ===');
console.log('✅ Dados em Tempo Real: Deve retornar dados atuais das usinas');
console.log('✅ Dados Históricos: Deve retornar comando JSON (API pode não estar disponível)');
console.log('✅ Resumo Geral: Deve retornar comando JSON');
console.log('✅ Dados Estáticos: Deve retornar informações do contexto');
console.log('');
console.log('=== LOGS IMPORTANTES ===');
console.log('• Verifique os logs do console para detalhes das APIs');
console.log('• Confirme se as permissões de usuário estão funcionando');
console.log('• Observe o tempo de resposta das APIs');
console.log('• Verifique se os dados são consistentes entre consultas');
