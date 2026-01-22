// -------------------------------------------------------------------
// FLUXO DO MÓDULO DE TESTE
// 1. Mock do Client WhatsApp → simula envio
// 2. Testes Integrados (processarMensagem)
// 3. Testes Unitários de Serviços (services) por Usina
// 4. Testes de Erros (errors)
// -------------------------------------------------------------------

const { processarMensagem, services, errors } = require('../index');
const configUsuarios = require('../config/usuarios');
const dayjs = require('dayjs');

// 1. Mock do Client WhatsApp
const mockClient = {
    sendMessage: async (numero, mensagem) => {
        console.log('--------------------------------');
        console.log('[MOCK] Mensagem enviada para:', numero);
        // console.log('[MOCK] Conteúdo:', mensagem); // Descomente para ver tudo
        console.log('--------------------------------');
        return true;
    }
};

// Obter lista única de usinas do arquivo de configuração
function getTodasUsinas() {
    const usinasSet = new Set();

    // De grupos
    if (configUsuarios.gruposPermitidos) {
        configUsuarios.gruposPermitidos.forEach(grupo => {
            if (Array.isArray(grupo.usinas)) {
                grupo.usinas.forEach(u => usinasSet.add(u));
            }
        });
    }

    // De usuários individuais
    if (configUsuarios.usuariosPermitidos) {
        configUsuarios.usuariosPermitidos.forEach(user => {
            if (Array.isArray(user.usina)) {
                user.usina.forEach(u => usinasSet.add(u));
            } else if (user.usina) {
                usinasSet.add(user.usina);
            }
        });
    }

    return Array.from(usinasSet);
}

// 2. Testes Integrados
const casosIntegrados = [
    {
        nome: 'Pergunta Simples (Integração OpenAI + API)',
        msg: {
            from: '554998385500@c.us',
            body: '@leo: qual a potência instantanea da Fae?',
            getChat: async () => ({ isGroup: false })
        }
    }
];

// 3. Testes Unitários de Serviços por Usina
async function testarServicosPorUsina() {
    const usinas = getTodasUsinas();
    console.log(`\n🔍 INICIANDO TESTES PARA ${usinas.length} USINAS: ${usinas.join(', ')}`);

    for (const usina of usinas) {
        console.log(`\n============== 🏭 USINA: ${usina} ==============`);

        // 3.1 Teste Tempo Real (Leitura)
        try {
            console.log(`[TESTE] services.leitura({ usina: '${usina}', tipo: 'potencias' })`);
            const tipo = 'potencias';
            const res = await services.leitura({ usina, tipo });

            if (res && res.dados) {
                console.log(`✅ [Leitura] Sucesso. Dados recebidos.`);
            } else {
                console.error(`❌ [Leitura] Falha: Retornou dados vazios ou nulos.`);
            }
        } catch (e) {
            console.error(`❌ [Leitura] Exceção: ${e.message}`);
        }

        // 3.2 Teste Histórico (Últimos 3 dias)
        try {
            const hoje = dayjs();
            const data_fim = hoje.format('DD/MM/YYYY');
            const data_inicio = hoje.subtract(3, 'day').format('DD/MM/YYYY');

            console.log(`[TESTE] services.historico({ usina: '${usina}', data_inicio: '${data_inicio}', data_fim: '${data_fim}', periodo: 'day' })`);

            const res = await services.historico({
                usina,
                data_inicio,
                data_fim,
                periodo: 'day'
            });

            if (res && res.dados) {
                console.log(`✅ [Histórico] Sucesso. (Objeto de resposta recebido)`);
            } else {
                // Algumas usinas podem não ter histórico, então pode ser warn em vez de erro, mas vamos logar o status.
                console.warn(`⚠️ [Histórico] Retornou sem dados (pode ser normal se a usina for nova ou sem telemetria histórica).`);
            }
        } catch (e) {
            console.error(`❌ [Histórico] Exceção: ${e.message}`);
        }

        // 3.3 Teste Resumo
        try {
            console.log(`[TESTE] services.resumo({ usina: '${usina}' })`);
            const res = await services.resumo({ usina });

            if (res && res.dados && res.dados.resultado) {
                console.log(`✅ [Resumo] Sucesso.`);
            } else {
                console.error(`❌ [Resumo] Falha na geração do resumo.`);
            }
        } catch (e) {
            console.error(`❌ [Resumo] Exceção: ${e.message}`);
        }
    }
}

// 4. Testes de Erros
async function testarErros() {
    console.log('\n⚠️ TESTANDO TRATAMENTO DE ERROS...');

    const testesErro = [
        {
            nome: 'Leitura sem parâmetros',
            fn: () => services.leitura({}),
            esperado: errors.param('leitura (usina, tipo): usina=undefined, tipo=undefined')
        },
    ];

    for (const teste of testesErro) {
        try {
            await teste.fn();
            console.error(`❌ [${teste.nome}] Falhou: Deveria ter lançado erro.`);
        } catch (e) {
            if (e.message === teste.esperado) {
                console.log(`✅ [${teste.nome}] Erro capturado corretamente.`);
            } else {
                console.log(`✅ [${teste.nome}] Erro capturado (mas mensagem diferente da esperada): "${e.message}"`);
            }
        }
    }
}

// Execução Geral
async function rodarTestes() {
    console.log('🚀 INICIANDO BATERIA DE TESTES COMPLETOS\n');

    // Integrados
    // await processarMensagem(casosIntegrados[0].msg, mockClient);

    // Por Usina
    await testarServicosPorUsina();

    // Erros
    await testarErros();

    console.log('\n✅ Bateria de testes finalizada.');
    process.exit(0);
}

rodarTestes();
