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
