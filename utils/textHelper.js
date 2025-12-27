// Mapeamento de apelidos para IDs oficiais
const APELIDOS_USINAS = {
    'CGH-APARECIDA': ['aparecida', 'cgh aparecida', 'cgh-aparecida', 'ug01 aparecida', 'ug-01 aparecida'],
    'CGH-FAE': ['fae', 'cgh fae', 'cgh-fae', 'usina fae'],
    'CGH-PICADAS-ALTAS': ['picadas', 'picadas altas', 'cgh picadas', 'cgh-picadas', 'picada'],
    'CGH-HOPPEN': ['hoppen', 'cgh hoppen', 'cgh-hoppen', 'hopen'],
    'PCH-PEDRAS': ['pedras', 'pch pedras', 'pch-pedras', 'das pedras', 'usina pedras'],
    'PCH-PIRA': ['pira', 'pch pira', 'pch-pira', 'usina pira']
};

/**
 * Tenta identificar qual usina está sendo mencionada na pergunta.
 * Retorna um array com a usina encontrada (se tiver permissão) 
 * ou a lista original se não encontrar nada específico.
 */
function filtrarUsinasPorContexto(pergunta, usinasPermitidas) {
    if (!pergunta) return usinasPermitidas;

    const texto = pergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Procura por menções diretas
    for (const [idUsina, apelidos] of Object.entries(APELIDOS_USINAS)) {
        // Verifica se algum apelido está presente na pergunta
        if (apelidos.some(apelido => texto.includes(apelido))) {
            // Se encontrou e o usuário tem permissão, retorna APENAS essa usina
            if (usinasPermitidas.includes(idUsina)) {
                return [idUsina];
            }
        }
    }

    // Se não citou nenhuma específica (ex: "quanto gerou hoje?"), mantém todas as permitidas
    return usinasPermitidas;
}

module.exports = { filtrarUsinasPorContexto };
