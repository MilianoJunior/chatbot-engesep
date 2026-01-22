const fs = require('fs');
const path = require('path');

let cont = 0;
let totalLinhas = 0;
let count = 0;

function estruturaPastasArquivos(caminho, prefixo = "", imprimir = false) {
    try {
        const itens = fs.readdirSync(caminho);
        
        for (const item of itens) {
            const itemPath = path.join(caminho, item);
            const listExclude = ['.idea','.git', '.cursor','node_modules', 'package-lock.json', '.wwebjs_cache', '.wwebjs_auth', 'testes','estrutura-projeto.js'];
            const listInclude = ['.py', '.html', '.css', '.js', '.yaml', '.json', '.md'];
            const listImprimir = ['.py', '.html', '.css', '.js', '.yaml', '.json', '.md'];
            
            if (listExclude.includes(item)) {
                continue;
            }

            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                cont++;
                if (!imprimir) {
                    console.log(`${prefixo}${item}/`);
                }
                estruturaPastasArquivos(itemPath, prefixo + "    ├── ", imprimir);
            } else if (stats.isFile() && listInclude.some(ext => item.endsWith(ext))) {
                cont++;
                if (!imprimir) {
                    console.log(`${prefixo}${item}`);
                }
                
                if (imprimir && listImprimir.some(ext => item.endsWith(ext))) {
                    try {
                        const conteudo = fs.readFileSync(itemPath, 'utf8');
                        count++;
                        console.log('¨¨'.repeat(50));
                        console.log(`${count} - Conteúdo do arquivo ${item}:`);
                        console.log('¨¨'.repeat(50));
                        console.log(conteudo);
                        const linhas = conteudo.split('\n').length;
                        totalLinhas += linhas;
                        console.log(`Quantidade de linhas do arquivo ${item}: ${linhas} totalizando ${totalLinhas} linhas.`);
                    } catch (error) {
                        try {
                            const conteudo = fs.readFileSync(itemPath, 'latin1');
                            count++;
                            console.log('¨¨'.repeat(50));
                            console.log(`${count} - Conteúdo do arquivo ${item}:`);
                            console.log('¨¨'.repeat(50));
                            console.log(conteudo.toString());
                            const linhas = conteudo.toString().split('\n').length;
                            totalLinhas += linhas;
                            console.log(`Quantidade de linhas do arquivo ${item}: ${linhas} totalizando ${totalLinhas} linhas.`);
                        } catch (e) {
                            console.log(`Erro ao ler o arquivo ${item}: ${e.message}`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Erro ao acessar ${caminho}: ${error.message}`);
    }
}


// Função principal para executar
function main() {
    const caminhoAtual = process.cwd();
    console.log('=== ESTRUTURA DO PROJETO ===');
    console.log(`Caminho: ${caminhoAtual}\n`);
    
    // Reset contadores
    cont = 0;
    totalLinhas = 0;
    count = 0;
    
    console.log('1. Estrutura de pastas e arquivos:');
    estruturaPastasArquivos(caminhoAtual);
    console.log(`\nTotal de itens encontrados: ${cont}`);
    
    // console.log('\n2. Métodos dos arquivos Python:');
    // metodosArquivos(caminhoAtual);
    
    // console.log('\n3. Análise dos arquivos JavaScript/Node.js:');
    // analisarArquivosJS(caminhoAtual);
    
    console.log('\n4. Conteúdo completo dos arquivos (modo imprimir):');
    estruturaPastasArquivos(caminhoAtual, "", true);
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
    main();
}

/*
"Atue como um Arquiteto de Software Sênior.
Analise o código JavaScript abaixo. Ele está procedural, difícil de testar e viola o princípio Open/Closed (muitos if/else).
Objetivo: Refatore para uma abordagem Orientada a Objetos ou Funcional robusta que utilize o Padrão Strategy para os comandos.
Requisitos Críticos:
Limpeza: Mantenha o código com menos de 50 linhas.
Manutenibilidade: O tratamento de erros deve ser genérico e centralizado (evite criar objetos gigantes com mensagens hardcoded para cada novo erro).
Extensibilidade: A estrutura deve facilitar a Injeção de Dependências para testes unitários futuros.
DRY: Abstraia a lógica repetitiva de 'chamar API -> validar nulo -> formatar'.
*/

/*
Primeira tarefa do dia:

Melhorar o design da formatação resposta para o WhatsApp.

Todas as respostas são formatadas no arquivo utils/response.js
const {
    tratarRespostaLeonardo,
    formatarRespostaHistorico,
    formatarRespostaTempoReal,
    formatarRespostaResumo
} = require('./utils/response');

Para o resumo, a resposta está nesse formato:

📊 RESUMO OPERATIVO DIÁRIO: CGH-HOPPEN
📅 29/12/2025 (Dados de hoje)

⚡ POTÊNCIA ATUAL
UG-01:
Potência Ativa: 0.00 kW

UG-02:
Potência Ativa: 1133.00 kW

Soma: 1133.00 kW

💧 NÍVEIS DE ÁGUA
UG-01:
Nível Montante UG-01: 869.80 m
Nível Jusante UG-01: 0.00 m

UG-02:
Nível Montante UG-02: 869.80 m
Nível Jusante UG-02: 869.09 m

   ℹ️ Vertimento Ref: 869.9 m
📈 GERAÇÃO DE HOJE
📊 Dados do Período (Diário):

🔧 UG01:
  📅 2025-12-29: 0.00 MWh

🔧 UG02:
  📅 2025-12-29: 7.90 MWh

📈 Total de registros: 2
🏭 Usina: CGH-HOPPEN
🔧 Unidades Geradoras: 2
⏱️ Período: Diário

Quero muddar para esse formato:

📊 CGH-HOPPEN - 29/12/2025

*⚡ Potência ativa em tempo real*
UG-01: 0.00 kW
UG-02: 1133.00 kW

*💧 Níveis de água em tempo real*
Nível Montante: 869.80 m
UG-01: 869.70 m
UG-02: 869.09 m
diferencial de grade UG-01: 0.10 m
diferencial de grade UG-02: 0.01 m
Vertimento Ref: 869.9 m

*📈 Geração de energia (Diário)*
UG-01: 0.00 MWh
UG-02: 7.90 MWh
Total: 7.90 MWh

obs: intervalo de geração é das 00:00:00 
até hora da consulta do dia atual.


Respostas em tempo real, estão nesse formato:

CGH-FAE
Dados em Tempo Real
Data/Hora: 29/12/2025, 10:16:41

UG-01:
Potência Ativa: 0.00 kW

UG-02:
Potência Ativa: 632.00 kW

Soma: 632.00 kW

Gostaria de mudar para esse formato:

CGH-FAE - 29/12/2025, 10:16:41

*⚡ Potência ativa em tempo real*
UG-01: 0.00 kW
UG-02: 632.00 kW

Soma: 632.00 kW

Para os dados históricos, estão nesse formato:

🏭 CGH-FAE
📊 Dados Históricos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Dados do Período (Diário):

🔧 UG01:
  📅 2025-12-26: 19.40 MWh
  📅 2025-12-27: 13.97 MWh
  📅 2025-12-28: 8.33 MWh

🔧 UG02:
  📅 2025-12-26: 1.38 MWh
  📅 2025-12-27: 4.59 MWh
  📅 2025-12-28: 4.09 MWh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Total de registros: 6
🏭 Usina: CGH-FAE
🔧 Unidades Geradoras: 2
⏱️ Período: Diário

Gostaria de mudar para esse formato:

📊 CGH-FAE - 29/12/2025, 10:16:41

*📈 Geração de energia (Diário)*

UG01:
  2025-12-26: 19.40 MWh
  2025-12-27: 13.97 MWh
  2025-12-28: 8.33 MWh

UG02:
  2025-12-26: 1.38 MWh
  2025-12-27: 4.59 MWh
  2025-12-28: 4.09 MWh

Soma UG01: 41.70 MWh
Soma UG02: 10.06 MWh
Total: 51.76 MWh
*/
/*
Testes

1. @leo qual a potência ativa da usina CGH-FAE?
2. @leo qual o nível de água da usina CGH-FAE?
3. @leo qual a geração de energia dos ultimos 7 dias da usina CGH-FAE?
4. @leo quais as temperaturas instantâneas da usina CGH-FAE?
4. @leo resumo da usina CGH-FAE?

1. @leo qual a potência ativa da usina CGH-Hoppen?
2. @leo qual o nível de água da usina CGH-Hoppen?
3. @leo qual a geração de energia dos ultimos 7 dias da usina CGH-Hoppen?
4. @leo resumo da usina CGH-Hoppen?


*/