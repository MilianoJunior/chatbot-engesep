const Logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    flow: (msg) => console.log(`[FLOW] ${msg}`),
    success: (msg) => console.log(`[SUCCESS] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    debug: (msg) => console.log(`[DEBUG] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    state: (stateNum, stateName, details) => console.log(`[ESTADO ${stateNum}] ${stateName}: ${details}`)
};

module.exports = Logger;
