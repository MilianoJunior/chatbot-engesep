/*
# -------------------------------------------------------------------
# FLUXO DO MÓDULO
# 1. salvar_instrucao_ia → salva nova instrução no arquivo de contexto
# 2. obter_instrucoes_armazenadas → carrega as instruções para injetar na IA
# -------------------------------------------------------------------
*/

const fs = require('fs');
const path = require('path');
const Logger = require('./logger');

const ARQUIVO_CONTEXTO = path.join(__dirname, '..', 'config', 'contexto_adicional.txt');

const salvar_instrucao_ia = (texto, usina) => {
    try {
        const usinaNormalizada = Array.isArray(usina) ? usina.join(', ') : (usina || 'GERAL');
        const conteudo = `[USINA: ${usinaNormalizada}] - ${texto}\n`;
        fs.appendFileSync(ARQUIVO_CONTEXTO, conteudo, 'utf8');
        Logger.info(`Nova instrução armazenada para ${usinaNormalizada}.`);
        return "Instrução armazenada com sucesso!";
    } catch (error) {
        Logger.error('Erro ao salvar instrução na IA:', error);
        return "Erro ao armazenar a instrução.";
    }
};

const obter_instrucoes_armazenadas = () => {
    try {
        if (!fs.existsSync(ARQUIVO_CONTEXTO)) return '';
        const conteudo = fs.readFileSync(ARQUIVO_CONTEXTO, 'utf8');
        if (!conteudo.trim()) return '';
        return `\n\n=== INSTRUÇÕES ADICIONAIS DO USUÁRIO ===\n${conteudo}\n========================================\n\n`;
    } catch (error) {
        Logger.error('Erro ao ler instruções armazenadas:', error);
        return '';
    }
};

module.exports = { salvar_instrucao_ia, obter_instrucoes_armazenadas };
