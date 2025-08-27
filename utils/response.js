async function tratarRespostaLeonardo(resposta) {
    
    try {
        // Verificar se a resposta está em formato JSON
        if (typeof resposta === 'string' && resposta.trim().startsWith('{') && resposta.trim().endsWith('}')) {
            const json = JSON.parse(resposta);
            
            // Se contém comando para API, processar
            if (json.comando === 'leitura') {
                // Normalizar nome da usina para formato padrão
                if (json.parametros && json.parametros.usina) {
                    json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
                }
            }
            
            // Comando para histórico de energia
            if (json.comando === 'historico') {
                // Normalizar nome da usina para formato padrão
                if (json.parametros && json.parametros.usina) {
                    json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
                }
            }
            return json;
        }
        
        // Se não for JSON, retornar a resposta original
        return resposta;
        
    } catch (error) {
        return 'Erro ao processar resposta: ' + error.message;
    }
}

// Função para normalizar nomes de usinas
function normalizarNomeUsina(nomeUsina) {
    // Mapear nomes em lowercase/underscore para formato padrão
    const mapeamentoUsinas = {
        'cgh_aparecida': 'CGH-APARECIDA',
        'cgh_fae': 'CGH-FAE',
        'cgh_picadas_altas': 'CGH-PICADAS-ALTAS',
        'cgh_hoppen': 'CGH-HOPPEN',
        'pch_pedras': 'PCH-PEDRAS'
    };
    
    const nomeLower = nomeUsina.toLowerCase().replace(/-/g, '_');
    return mapeamentoUsinas[nomeLower] || nomeUsina;
}

// Função para formatar resposta da API de histórico para WhatsApp
function formatarRespostaHistorico(dados) {
    try {
        if (!dados || typeof dados !== 'object') {
            return '❌ Dados inválidos recebidos da API';
        }

        let resultado = `🏭 *${dados.usina}*\n`;
        resultado += `📊 *Dados Históricos*\n`;
        resultado += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        // Verificar se há dados de energia
        const resultadoData = dados.resultado || {};
        const ugsKeys = Object.keys(resultadoData).filter(key => 
            key.includes('energia') || key.includes('acumulador')
        );
        
        if (ugsKeys.length === 0) {
            return '❌ Nenhum dado de energia encontrado';
        }

        resultado += `📊 *Dados do Período (${dados.periodo === 'M' ? 'Mensal' : dados.periodo === 'D' ? 'Diário' : 'Horário'}):*\n\n`;
        
        let totalRegistros = 0;
        
        // Processar cada UG encontrada
        ugsKeys.forEach((ugKey, ugIndex) => {
            const energiaData = resultadoData[ugKey];
            
            if (Array.isArray(energiaData) && energiaData.length > 0) {
                // Extrair nome da UG do key
                const ugNome = ugKey
                    .replace('_acumulador_energia', '')
                    .replace('_acum_energia', '')
                    .replace('_energia', '')
                    .toUpperCase();
                
                if (ugsKeys.length > 1) {
                    resultado += `🔧 *${ugNome}:*\n`;
                }
                
                // Processar cada registro de energia desta UG
                energiaData.forEach((registro, index) => {
                    if (index < 10) { // Limitar a 10 registros por UG
                        if (typeof registro === 'object') {
                            const keys = Object.keys(registro);
                            if (keys.length > 0) {
                                keys.forEach(key => {
                                    const valor = registro[key];
                                    if (key.toLowerCase().includes('data') || key.toLowerCase().includes('timestamp')) {
                                        try {
                                            resultado += `  📅 ${valor}`;
                                        } catch {
                                            resultado += `  📅 ${valor}`;
                                        }
                                    } else if (typeof valor === 'number') {
                                        resultado += `: ${valor.toFixed(2)} MWh\n`;
                                    } else if (valor !== null && valor !== undefined) {
                                        resultado += `: ${valor}\n`;
                                    }
                                });
                            } else {
                                resultado += `  📅 Registro ${index + 1}: ${JSON.stringify(registro)}\n`;
                            }
                        } else {
                            resultado += `  📅 Valor ${index + 1}: ${registro}\n`;
                        }
                    }
                });

                if (energiaData.length > 10) {
                    resultado += `  ... e mais ${energiaData.length - 10} registros\n`;
                }
                
                if (ugsKeys.length > 1) {
                    resultado += '\n';
                }
                
                totalRegistros += energiaData.length;
            }
        });

        resultado += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        resultado += `📈 Total de registros: ${totalRegistros}\n`;
        resultado += `🏭 Usina: ${dados.usina}\n`;
        resultado += `🔧 Unidades Geradoras: ${ugsKeys.length}\n`;
        resultado += `⏱️ Período: ${dados.periodo === 'M' ? 'Mensal' : dados.periodo === 'D' ? 'Diário' : 'Horário'}`;

        return resultado;

    } catch (error) {
        return '❌ Erro ao formatar dados históricos: ' + error.message;
    }
}

// Função para formatar resposta da API de tempo real para WhatsApp
function formatarRespostaTempoReal(dados) {
    try {
        console.log('dados:', dados);
        if (!dados || typeof dados !== 'object') {
            return 'Erro: Dados inválidos recebidos da API';
        }

        let resultado = `*${dados.usina}*\n`;
        resultado += `Dados em Tempo Real\n`;
        resultado += `Data/Hora: ${new Date(dados.timestamp).toLocaleString('pt-BR')}\n \n`;

        const unidadesGeradoras = dados.unidades_geradoras || {};
        
        if (Object.keys(unidadesGeradoras).length === 0) {
            return 'Nenhuma unidade geradora encontrada';
        }

        let somaPotencia = 0;
        let potenciasEncontradas = [];

        // Processar cada unidade geradora
        Object.entries(unidadesGeradoras).forEach(([ugNome, ugData]) => {
            resultado += `*${ugNome}:*\n`;
            
            if (ugData.erro) {
                resultado += `   Erro: ${ugData.erro}\n`;
            } else {                
                // Buscar por potência ativa nos dados
                let potenciaEncontrada = false;
                
                if (ugData.dados && typeof ugData.dados === 'object') {
                    Object.entries(ugData.dados).forEach(([tipoDado, valoresTipo]) => {
                        if (valoresTipo && typeof valoresTipo === 'object') {
                            // Tipo de dado (INT, REAL, BOOLEAN)
                            resultado += `  **\n`;
                            
                            Object.entries(valoresTipo).forEach(([chave, valor]) => {
                                if (valor !== null && valor !== undefined) {
                                    // Formatar baseado no tipo de dado
                                    if (typeof valor === 'number') {
                                        if (chave.toLowerCase().includes('temperatura')) {
                                            resultado += `    ${chave}: ${valor.toFixed(1)}°C\n`;
                                        } else if (chave.toLowerCase().includes('potencia') && chave.toLowerCase().includes('ativa')) {
                                            resultado += `    ${chave}: ${valor.toFixed(2)} kw\n`;
                                        } else if (chave.toLowerCase().includes('potencia') || chave.toLowerCase().includes('energia')) {
                                            resultado += `    ${chave}: ${valor.toFixed(2)} MW\n`;
                                        } else if (chave.toLowerCase().includes('nivel') || chave.toLowerCase().includes('altura')) {
                                            resultado += `    ${chave}: ${valor.toFixed(2)} m\n`;
                                        } else if (chave.toLowerCase().includes('velocidade')) {
                                            resultado += `    ${chave}: ${valor.toFixed(2)} rpm\n`;
                                        } else if (chave.toLowerCase().includes('tensao') || chave.toLowerCase().includes('corrente')) {
                                            resultado += `    ${chave}: ${valor.toFixed(2)}\n`;
                                        } else {
                                            resultado += `    ${chave}: ${valor.toFixed(2)}\n`;
                                        }
                                    } else if (typeof valor === 'boolean') {
                                        resultado += `    ${chave}: ${valor ? 'Ativo' : 'Inativo'}\n`;
                                    } else {
                                        resultado += `    ${chave}: ${valor}\n`;
                                    }
                                }
                            });
                        } else if (valoresTipo !== null && valoresTipo !== undefined) {
                            // Valor direto (não aninhado)
                            if (typeof valoresTipo === 'number') {
                                if (tipoDado.toLowerCase().includes('temperatura')) {
                                    resultado += `   ${valoresTipo.toFixed(1)}°C\n`;
                                } else if (tipoDado.toLowerCase().includes('potencia') && tipoDado.toLowerCase().includes('ativa')) {
                                    resultado += `   ${valoresTipo.toFixed(2)} kw\n`;
                                } else if (tipoDado.toLowerCase().includes('potencia') || tipoDado.toLowerCase().includes('energia')) {
                                    resultado += `   ${valoresTipo.toFixed(2)} MW\n`;
                                } else if (tipoDado.toLowerCase().includes('nivel') || tipoDado.toLowerCase().includes('altura')) {
                                    resultado += `   ${valoresTipo.toFixed(2)} m\n`;
                                } else if (tipoDado.toLowerCase().includes('velocidade')) {
                                    resultado += `   ${valoresTipo.toFixed(2)} rpm\n`;
                                } else {
                                    resultado += `   ${valoresTipo.toFixed(2)}\n`;
                                }
                            } else if (typeof valoresTipo === 'boolean') {
                                resultado += `   ${valoresTipo ? 'Ativo' : 'Inativo'}\n`;
                            } else {
                                resultado += `   ${valoresTipo}\n`;
                            }
                        }
                    });
                }
                /*
                A resposta está nesse formato, apenas para a potência ativa:
                CGH-FAE
                Dados em Tempo Real
                Data/Hora: 27/08/2025, 18:23:22
                
                UG-01
                **
                    Potência Ativa: 1204.00

                UG-02
                **
                    Potência Ativa: 184.00

                Mas preciso que fique assim:
                CGH-FAE
                Dados em Tempo Real
                Data/Hora: 27/08/2025, 18:23:22
                
                UG-01:
                   Potência Ativa: 1204.00 kw

                UG-02:
                   Potência Ativa: 184.00 kw

                soma: 1388.00 kw

                */
                // Adicionar características se disponíveis
                // if (ugData.caracteristicas && Object.keys(ugData.caracteristicas).length > 0) {
                //     resultado += `  Características:\n`;
                //     Object.entries(ugData.caracteristicas).forEach(([key, value]) => {
                //         resultado += `    • ${key}: ${value}\n`;
                //     });
                // }
            }
            
            if (index < Object.keys(unidadesGeradoras).length - 1) {
                resultado += '\n';
            }
        });
        return resultado;

    } catch (error) {
        return '❌ Erro ao formatar dados em tempo real: ' + error.message;
    }
}

module.exports = { 
    tratarRespostaLeonardo, 
    formatarRespostaHistorico,
    formatarRespostaTempoReal,
    normalizarNomeUsina
}; 