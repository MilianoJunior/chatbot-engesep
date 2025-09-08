async function tratarRespostaLeonardo(resposta) {
    try {
        console.log('🔄 tratarRespostaLeonardo recebeu:', typeof resposta, resposta ? resposta.substring(0, 200) + '...' : 'null');
        
        if (!resposta) {
            const erro = 'Resposta vazia ou nula recebida';
            console.error('❌ ' + erro);
            return erro;
        }

        // Verificar se a resposta está em formato JSON
        if (typeof resposta === 'string' && resposta.trim().startsWith('{') && resposta.trim().endsWith('}')) {
            console.log('📄 Tentando fazer parse JSON da resposta...');
            let json;
            
            try {
                json = JSON.parse(resposta);
                console.log('✅ JSON parseado com sucesso:', json);
            } catch (parseError) {
                console.error('❌ Erro ao fazer parse do JSON:', parseError.message);
                console.error('❌ String JSON problemática:', resposta);
                return `Erro ao processar resposta JSON: ${parseError.message}`;
            }
            
            // Se contém comando para API, processar
            if (json.comando === 'leitura') {
                console.log('🔧 Processando comando de leitura...');
                // Normalizar nome da usina para formato padrão
                if (json.parametros && json.parametros.usina) {
                    const usinaOriginal = json.parametros.usina;
                    json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
                    console.log(`🏭 Usina normalizada: ${usinaOriginal} -> ${json.parametros.usina}`);
                }
            }
            
            // Comando para histórico de energia
            if (json.comando === 'historico') {
                console.log('📊 Processando comando de histórico...');
                // Normalizar nome da usina para formato padrão
                if (json.parametros && json.parametros.usina) {
                    const usinaOriginal = json.parametros.usina;
                    json.parametros.usina = normalizarNomeUsina(json.parametros.usina);
                    console.log(`🏭 Usina normalizada: ${usinaOriginal} -> ${json.parametros.usina}`);
                }
            }
            
            console.log('✅ Comando processado:', json.comando);
            return json;
        }
        
        // Se não for JSON, retornar a resposta original
        console.log('💬 Resposta não é JSON, retornando como texto direto');
        return resposta;
        
    } catch (error) {
        const mensagemErro = `Erro crítico ao processar resposta: ${error.message}`;
        console.error('🚨 ERRO CRÍTICO em tratarRespostaLeonardo:', error);
        console.error('🚨 Stack:', error.stack);
        console.error('🚨 Resposta original:', resposta);
        return mensagemErro;
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
        if (dados.status === 'sem_dados' || dados.status === 'sem dados') {
            return `🏭 *${dados.usina || 'Usina'}*\n\n` +
                   `📊 *Consulta de Dados Históricos*\n` +
                   `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                   `ℹ️ ${dados.mensagem || 'Nenhum dado encontrado para o período consultado.'}\n\n` +
                   `💡 *Sugestões:*\n` +
                   `• Verifique se a data está correta\n` +
                   `• Tente um período mais recente\n` +
                   `• Consulte dados em tempo real com: "@leo: potência ativa da ${dados.usina}"\n` +
                   `• Para ajuda: "@leo: ajuda"`;
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

        console.log('✅ Formatação histórica concluída, tamanho da resposta:', resultado.length);
        return resultado;

    } catch (error) {
        const mensagemErro = '❌ Erro ao formatar dados históricos: ' + error.message;
        console.error('🚨 ERRO em formatarRespostaHistorico:', error);
        console.error('🚨 Stack:', error.stack);
        console.error('🚨 Dados originais:', dados);
        return mensagemErro;
    }
}

// Função para formatar resposta da API de tempo real para WhatsApp
function formatarRespostaTempoReal(dados) {
    try {
      if (!dados || typeof dados !== 'object') {
        return '❌ Dados inválidos da API';
      }
  
      const norm = (s = '') =>
        s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
      const isTripAlarme = (k) => {
        const n = norm(k);
        return n.includes('trip') || n.includes('alarme') || n.includes('alarmes');
      };
  
      const isPotAtiva = (k) => {
        const n = norm(k);
        // cobre "potência ativa", "pot_ativa", "p ativa", "pat", etc.
        return (n.includes('pot') && n.includes('ativa')) || /\bp[_\s-]*ativa\b/.test(n);
      };
  
      const toNumber = (v) => {
        if (typeof v === 'number' && Number.isFinite(v)) return v;
        const f = parseFloat(String(v).replace(',', '.'));
        return Number.isFinite(f) ? f : null;
      };
  
      const fmtValor = (chave, valor) => {
        const n = norm(chave);
        const num = toNumber(valor);
        if (num === null) return String(valor);
  
        if (n.includes('temperatura')) return `${num.toFixed(1)}°C`;
        if (n.includes('nivel') || n.includes('altura')) return `${num.toFixed(2)} m`;
        if (n.includes('velocidade') || n.includes('rpm')) return `${num.toFixed(2)} rpm`;
        if (n.includes('tensao') || n.includes('tens')) return `${num.toFixed(2)} V`;
        if (n.includes('corrente')) return `${num.toFixed(2)} A`;
        if (n.includes('frequencia') || n.includes('hz')) return `${num.toFixed(2)} Hz`;
        if (n.includes('pot') && n.includes('ativa')) return `${num.toFixed(2)} kW`;
        if (n.includes('pot') || n.includes('energia')) return `${num.toFixed(2)} MW`;
        return `${num.toFixed(2)}`;
      };
  
      let resultado = `*${dados.usina || '—'}*\n`;
      resultado += `Dados em Tempo Real\n`;
      resultado += `Data/Hora: ${dados.timestamp ? new Date(dados.timestamp).toLocaleString('pt-BR') : '—'}\n`;
  
      const ugs = dados.unidades_geradoras || {};
      const entradas = Object.entries(ugs);
      if (!entradas.length) {
        return (
          resultado +
          `\nℹ️ Nenhuma unidade geradora encontrada.\n`
        );
      }
  
      let somaPotAtiva = 0;
  
      entradas.forEach(([ugNome, ugData], idx) => {
        resultado += `\n${ugNome}:\n`;
  
        const bloco = ugData && typeof ugData === 'object' ? ugData.dados || ugData : {};
        // Varre apenas primeiro nível (como no seu exemplo),
        // mas aceita sub-objetos com outro for..in
        Object.entries(bloco).forEach(([tipoDado, valores]) => {
          if (valores && typeof valores === 'object') {
            Object.keys(valores).forEach((variavel) => {
              const val = valores[variavel];
              // Soma potência ativa
              if (isPotAtiva(variavel)) {
                const num = toNumber(val);
                if (num !== null) somaPotAtiva += num;
                resultado += `${variavel}: ${fmtValor(variavel, val)}\n`;
                return;
              }
              // Pula trips/alarmes
              if (isTripAlarme(variavel)) return;
  
              // Imprime chave/valor formatado
              const nome = variavel.replace(/\s*value\s*$/i, '');
              resultado += `${nome}: ${fmtValor(variavel, val)}\n`;
            });
          } else {
            // Valor direto não-objeto
            if (!isTripAlarme(tipoDado)) {
              if (isPotAtiva(tipoDado)) {
                const num = toNumber(valores);
                if (num !== null) somaPotAtiva += num;
              }
              resultado += `${tipoDado}: ${fmtValor(tipoDado, valores)}\n`;
            }
          }
        });
      });
  
      if (somaPotAtiva > 0) {
        resultado += `\nSoma: ${somaPotAtiva.toFixed(2)} kW\n`;
      }
  
      return resultado;
    } catch (error) {
      console.error('🚨 ERRO em formatarRespostaTempoReal:', error);
      return '❌ Erro ao formatar dados em tempo real: ' + error.message;
    }
  }
  
// Função para formatar resposta da API de tempo real para WhatsApp
// function formatarRespostaTempoReal(dados) {
//     try {
//         let resultado = `*${dados.usina}*\n`;
//         resultado += `Dados em Tempo Real\n`;
//         resultado += `Data/Hora: ${new Date(dados.timestamp).toLocaleString('pt-BR')}\n`;
//         const entradas = Object.entries(dados.unidades_geradoras);
//         let somaPotAtiva = 0;
//         entradas.forEach(([ugNome, ugData], idx) => {
//             resultado += `${ugNome}:\n`;
//             const dados = ugData.dados;
//             Object.entries(dados).forEach(([tipoDado, valores]) => {
//                 const variaveis = Object.keys(valores);
//                 variaveis.forEach((variavel) => {
//                     if (variavel.toLowerCase().includes('potência')) {
//                         resultado += `${variavel}: ${valores[variavel]}\n`;
//                         somaPotAtiva = somaPotAtiva + parseInt(valores[variavel]);
//                     }
//                     if (!(variavel.toLowerCase().includes('trip') || variavel.toLowerCase().includes('alarmes'))) {                
//                         resultado += `${variavel.replace(' value', '')}: ${valores[variavel].toFixed(2)} °C\n`;
//                     }
//                 });
//             });    
//         });
//         if (somaPotAtiva > 0) {
//             resultado += `Soma: ${somaPotAtiva.toFixed(2)} kw\n`;
//         }
//         return resultado;
//     } catch (error) {
//         console.error('🚨 ERRO em formatarRespostaTempoReal:', error);
//         return '❌ Erro ao formatar dados em tempo real: ' + error.message;
//     }
// }

        //         let pot = null;
        //         if (ugData && ugData.dados && typeof ugData.dados === 'object') {
        //             for (const [tipoDado, valoresTipo] of Object.entries(ugData.dados)) {
        //                 if (valoresTipo && typeof valoresTipo === 'object') {
        //                     for (const [ch, val] of Object.entries(valoresTipo)) {
        //                         if (
        //                             typeof val === 'number' &&
        //                             ch && ch.toLowerCase().includes('potencia') && ch.toLowerCase().includes('ativa')
        //                         ) { pot = val; break; }
        //                     }
        //                 }
        //                 if (
        //                     pot === null &&
        //                     typeof valoresTipo === 'number' &&
        //                     tipoDado && tipoDado.toLowerCase().includes('potencia') && tipoDado.toLowerCase().includes('ativa')
        //                 ) { pot = valoresTipo; }
        //                 if (pot !== null) break;
        //             }
        //             }
        //             if (typeof pot === 'number') {
        //                 somaPotAtiva += pot;
        //                 saida += `   Potência Ativa: ${pot.toFixed(2)} kw\n`;
        //             } else {
        //                 saida += `   Potência Ativa: N/A\n`;
        //             }
        //         }
        //         if (idx < entradas.length - 1) saida += `\n`;
        //     });

        //     saida += `\nSoma: ${somaPotAtiva.toFixed(2)} kw`;
        //     return saida;
        // }

        // let somaPotencia = 0;
        // let potenciasEncontradas = [];

        // // Processar cada unidade geradora
        // Object.entries(unidadesGeradoras).forEach(([ugNome, ugData]) => {
        //     resultado += `*${ugNome}:*\n`;
            
        //     if (ugData.erro) {
        //         resultado += `   Erro: ${ugData.erro}\n`;
        //     } else {                
        //         // Buscar por potência ativa nos dados
        //         let potenciaEncontrada = false;
                
        //         if (ugData.dados && typeof ugData.dados === 'object') {
        //             Object.entries(ugData.dados).forEach(([tipoDado, valoresTipo]) => {
        //                 if (valoresTipo && typeof valoresTipo === 'object') {
        //                     // Tipo de dado (INT, REAL, BOOLEAN)
        //                     resultado += `  **\n`;
                            
        //                     Object.entries(valoresTipo).forEach(([chave, valor]) => {
        //                         if (valor !== null && valor !== undefined) {
        //                             // Formatar baseado no tipo de dado
        //                             if (typeof valor === 'number') {
        //                                 if (chave.toLowerCase().includes('temperatura')) {
        //                                     resultado += `    ${chave}: ${valor.toFixed(1)}°C\n`;
        //                                 } else if (chave.toLowerCase().includes('potencia') && chave.toLowerCase().includes('ativa')) {
        //                                     resultado += `    ${chave}: ${valor.toFixed(2)} kw\n`;
        //                                 } else if (chave.toLowerCase().includes('potencia') || chave.toLowerCase().includes('energia')) {
        //                                     resultado += `    ${chave}: ${valor.toFixed(2)} MW\n`;
        //                                 } else if (chave.toLowerCase().includes('nivel') || chave.toLowerCase().includes('altura')) {
        //                                     resultado += `    ${chave}: ${valor.toFixed(2)} m\n`;
        //                                 } else if (chave.toLowerCase().includes('velocidade')) {
        //                                     resultado += `    ${chave}: ${valor.toFixed(2)} rpm\n`;
        //                                 } else if (chave.toLowerCase().includes('tensao') || chave.toLowerCase().includes('corrente')) {
        //                                     resultado += `    ${chave}: ${valor.toFixed(2)}\n`;
        //                                 } else {
        //                                     resultado += `    ${chave}: ${valor.toFixed(2)}\n`;
        //                                 }
        //                             } else if (typeof valor === 'boolean') {
        //                                 resultado += `    ${chave}: ${valor ? 'Ativo' : 'Inativo'}\n`;
        //                             } else {
        //                                 resultado += `    ${chave}: ${valor}\n`;
        //                             }
        //                         }
        //                     });
        //                 } else if (valoresTipo !== null && valoresTipo !== undefined) {
        //                     // Valor direto (não aninhado)
        //                     if (typeof valoresTipo === 'number') {
        //                         if (tipoDado.toLowerCase().includes('temperatura')) {
        //                             resultado += `   ${valoresTipo.toFixed(1)}°C\n`;
        //                         } else if (tipoDado.toLowerCase().includes('potencia') && tipoDado.toLowerCase().includes('ativa')) {
        //                             resultado += `   ${valoresTipo.toFixed(2)} kw\n`;
        //                         } else if (tipoDado.toLowerCase().includes('potencia') || tipoDado.toLowerCase().includes('energia')) {
        //                             resultado += `   ${valoresTipo.toFixed(2)} MW\n`;
        //                         } else if (tipoDado.toLowerCase().includes('nivel') || tipoDado.toLowerCase().includes('altura')) {
        //                             resultado += `   ${valoresTipo.toFixed(2)} m\n`;
        //                         } else if (tipoDado.toLowerCase().includes('velocidade')) {
        //                             resultado += `   ${valoresTipo.toFixed(2)} rpm\n`;
        //                         } else {
        //                             resultado += `   ${valoresTipo.toFixed(2)}\n`;
        //                         }
        //                     } else if (typeof valoresTipo === 'boolean') {
        //                         resultado += `   ${valoresTipo ? 'Ativo' : 'Inativo'}\n`;
        //                     } else {
        //                         resultado += `   ${valoresTipo}\n`;
        //                     }
        //                 }
        //             });
        //         }
 
        //     }
        //     if (index < Object.keys(unidadesGeradoras).length - 1) {
        //         resultado += '\n';
        //     }
        // });
        // return resultado;

//     } catch (error) { 
//         console.error('🚨 ERRO em formatarRespostaTempoReal:', error);
//         return '❌ Erro ao formatar dados em tempo real: ' + error.message;
//     }
// }

module.exports = { 
    tratarRespostaLeonardo, 
    formatarRespostaHistorico,
    formatarRespostaTempoReal,
    normalizarNomeUsina
}; 


  