// -------------------------------------------------------------------
// FLUXO DO MÓDULO
// 1. formatarDetalhesLog → normaliza dados do log
// 2. logar → escreve o log no console correto
// 3. Logger → API pública de logs (com flag DEBUG)
// -------------------------------------------------------------------

// CONFIGURAÇÕES
const DEBUG = process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production';

const NIVEIS = {
    INFO: 'INFO',
    FLOW: 'FLOW',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
    WARN: 'WARN',
    ESTADO: 'ESTADO'
};

const formatarDetalhesLog = (args) => {
    return args.map(item => {
        if (item instanceof Error) return item.stack || item.message;
        if (typeof item === 'string') return item;
        try { return JSON.stringify(item); } catch (e) { return String(item); }
    }).join(' | ');
};

const logar = (nivel, metodo, args) => {
    const detalhes = formatarDetalhesLog(args);
    console[metodo](`[${nivel}] ${detalhes}`);
};

const Logger = {
    info: (...args) => logar(NIVEIS.INFO, 'log', args),
    flow: (...args) => logar(NIVEIS.FLOW, 'log', args),
    success: (...args) => logar(NIVEIS.SUCCESS, 'log', args),
    error: (...args) => logar(NIVEIS.ERROR, 'error', args),
    debug: (...args) => { if (DEBUG) logar(NIVEIS.DEBUG, 'log', args); },
    warn: (...args) => logar(NIVEIS.WARN, 'warn', args),
    state: (stateNum, stateName, details) => logar(`${NIVEIS.ESTADO} ${stateNum}`, 'log', [`${stateName}: ${details}`]),
    isDebug: () => DEBUG
};

module.exports = Logger;
