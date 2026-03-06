# 🤖 WhatsApp Bot - Leonardo

Bot inteligente para WhatsApp que integra com APIs de usinas hidroelétricas e OpenAI para consultas sobre energia e dados operacionais.

## 🚀 Funcionalidades

- **Chat Inteligente**: Integração com OpenAI para respostas contextuais
- **Consultas em Tempo Real**: Dados atuais de usinas hidroelétricas
- **Histórico de Dados**: Consultas históricas com diferentes períodos
- **Autenticação de Usuários**: Sistema de controle de acesso por número
- **Logs Estruturados**: Rastreamento completo de operações
- **Reconexão Automática**: Recuperação automática em caso de desconexão

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **whatsapp-web.js** - Cliente WhatsApp Web
- **OpenAI API** - Processamento de linguagem natural
- **Puppeteer** - Automação de navegador
- **PM2** - Gerenciamento de processos (produção)

## 📁 Estrutura do Projeto

```
2_whatsapp-bot/
├── config/           # Configurações de usinas e usuários
├── services/         # APIs externas (OpenAI, histórico, tempo real)
├── utils/            # Utilitários (contexto, logger, response)
├── testes/           # Scripts de teste automatizados
├── index.js          # Arquivo principal do bot
└── README.md         # Documentação
```

## ⚙️ Configuração

### Pré-requisitos

- Node.js 16+
- NPM ou Yarn
- Conta WhatsApp ativa
- Chave da API OpenAI

### Instalação

```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd 2_whatsapp-bot

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais
```

### Variáveis de Ambiente

```env
OPENAI_API_KEY=sua_chave_aqui
# Outras variáveis conforme necessário
```

## 🚀 Uso

### Desenvolvimento

```bash
npm start
```

### Servico

```bash
sudo nano /etc/systemd/system/whatsapp-bot.service
```

[Unit]
Description=WhatsApp Bot Engesep Automação
After=network.target

[Service]
Type=simple
User=junior
WorkingDirectory=/home/junior/projetos/chatbot-engesep
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=whatsapp-bot

[Install]
WantedBy=multi-user.target

sudo systemctl daemon-reload
sudo systemctl enable whatsapp-bot
sudo systemctl start whatsapp-bot

sudo journalctl -u whatsapp-bot -f

### Produção (com PM2)

```bash
# Iniciar
pm2 start index.js --name whatsapp-bot

# Monitorar
pm2 list
pm2 logs whatsapp-bot

# Parar
pm2 stop whatsapp-bot
```

## 💬 Comandos do Bot

### Formato Básico

```
@leoq: [sua pergunta]
```

### Exemplos de Uso

- `@leoq: qual a energia gerada hoje na CGH-FAE?`
- `@leoq: qual a potência ativa da usina CGH-FAE?`
- `@leoq: lista` - Lista usuários autorizados

## 🔧 APIs Integradas

### OpenAI

- Processamento de linguagem natural
- Contexto histórico de conversas
- Interpretação de comandos

### API de Tempo Real

- Dados instantâneos de usinas
- Potência ativa, tensão, corrente
- Status operacional

### API de Histórico

- Dados históricos por período
- Relatórios de energia gerada
- Análises temporais

## 📊 Logs e Monitoramento

O bot utiliza um sistema de logs estruturados com estados numerados para rastrear:

- Inicialização e conexão
- Processamento de mensagens
- Consultas às APIs
- Formatação de respostas
- Envio de mensagens

## 🧪 Testes

Execute os testes automatizados:

```bash
# Testes de histórico
node testes/test-historico-2025.js

# Testes de contexto
node testes/test-contexto-atualizado.js

# Testes de intervalos
node testes/test-intervalos-corrigidos.js
```

## 🔒 Segurança

- Autenticação por número de telefone
- Lista de usuários permitidos
- Validação de comandos
- Sanitização de inputs

## 📈 Deploy

### Servidor Ubuntu

```bash
# listar o serviço
pm2 list

# Parar serviço atual
pm2 stop 0

# ati
# Enviar código atualizado
scp -r ./ ubuntu@servidor:/caminho/destino/

# Reiniciar serviço
pm2 start index.js --name whatsapp-bot
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato através do WhatsApp usando o comando `@leoq: ajuda`.

---

**Desenvolvido com ❤️ para monitoramento inteligente de usinas hidroelétricas**

## index.js

// encontrar o nome da usina na pergunta e filtrar o contexto
// Se a pergunta mencionar uma usina específica (e permitida), o contexto terá apenas ela.
// Se não mencionar, terá todas as usinas permitidas.
const usinasContexto = filtrarUsinasPorContexto(pergunta, usina);

// ESTADO 5: Preparar contexto com histórico
// Passamos agora a lista filtrada de usinas
const contexto = getContextoComHistorico(msg.from, usinasContexto);

// ESTADO 6: Consultar OpenAI
const respostaOpenAI = await obterRespostaOpenAI(pergunta, contexto);
if (!respostaOpenAI.resposta) {
await enviarMensagem(client, 'Não consegui processar sua pergunta. Tente reformular.', msg.from);
return;
}

## utils/contexto.js

// Contexto do Leonardo - Assistente IA da EngeSEP
const Logger = require('./logger');

const CONFIG_HISTORICO = {
maxPerguntas: 5,
incluirRespostas: true,
incluirTimestamp: true,
separador: '\n────────────────────────────────────────────────────────\n',
incluirDadosAPI: true
};

// Estrutura atualizada do histórico
let historicoInteracoes = new Map();

/\*\*

- Adiciona uma interação completa ao histórico
  \*/
  function adicionarInteracaoHistorico(userId, pergunta, respostaOpenAI) {
  try {
  if (!historicoInteracoes.has(userId)) {
  historicoInteracoes.set(userId, []);
  }

          const historico = historicoInteracoes.get(userId);
          const novaInteracao = {
              timestamp: new Date().toISOString(),
              pergunta: pergunta,
              respostaOpenAI: respostaOpenAI,
              dadosAPI: null,
              tipoComando: null
          };

          historico.push(novaInteracao);

          // Manter apenas o número máximo configurado
          if (historico.length > CONFIG_HISTORICO.maxPerguntas) {
              historico.shift();
          }

          historicoInteracoes.set(userId, historico);

          Logger.debug(`Histórico atualizado para ${userId}: ${historico.length} interações`);
      } catch (error) {
          console.log(error);
          Logger.error('Erro ao adicionar interação ao histórico:', error);
      }

  }

/\*\*

- Atualiza a última interação com dados da API
  \*/
  function atualizarDadosAPI(userId, dadosAPI, tipoComando) {
  try {
  if (!historicoInteracoes.has(userId)) {
  return;
  }

          const historico = historicoInteracoes.get(userId);
          if (historico.length === 0) {
              return;
          }

          // Atualizar a última interação
          const ultimaInteracao = historico[historico.length - 1];
          ultimaInteracao.dadosAPI = dadosAPI;
          ultimaInteracao.tipoComando = tipoComando;

          historicoInteracoes.set(userId, historico);

          Logger.debug(`Dados API adicionados ao histórico: tipo=${tipoComando}`);
      } catch (error) {
          console.log(error);
          Logger.error('Erro ao atualizar dados da API no histórico:', error);
      }

  }

function obterHistoricoFormatado(userId) {
if (!historicoInteracoes.has(userId)) return '';
const historico = historicoInteracoes.get(userId);
if (!historico.length) return '';

    let out = '\n\n=== HISTÓRICO DE INTERAÇÕES ANTERIORES ===\n';
    out += `Total de interações no contexto: ${historico.length}\n\n`;

    historico.forEach((item, i) => {
        out += `🔹 INTERAÇÃO ${i + 1}\n`;
        if (CONFIG_HISTORICO.incluirTimestamp) {
            out += `Data/Hora: ${new Date(item.timestamp).toLocaleString('pt-BR')}\n`;
        }
        out += `Pergunta do usuário: "${item.pergunta}"\n`;

        // Resposta OpenAI (comando x texto)
        if (item.respostaOpenAI) {
            try {
                const json = JSON.parse(item.respostaOpenAI);
                if (json.comando) {
                    out += `Comando gerado: ${json.comando}\n`;
                    if (json.parametros) {
                        out += `Parâmetros: ${JSON.stringify(json.parametros)}\n`;
                    }
                } else {
                    out += `Resposta direta: ${item.respostaOpenAI.substring(0, 100)}...\n`;
                }
            } catch {
                const resumo = item.respostaOpenAI.substring(0, 100);
                out += `Resposta: ${resumo}${item.respostaOpenAI.length > 100 ? '...' : ''}\n`;
            }
        }

        // Dados da API quando não forem nulos
        if (CONFIG_HISTORICO.incluirDadosAPI && item.dadosAPI) {
            const tipo = item.tipoComando || 'N/A';
            out += `Tipo de consulta API: ${tipo}\n`;

            if (tipo === 'historico') {
                out += `Dados históricos consultados:\n`;
                out += `  Usina: ${item.dadosAPI.usina || 'N/A'}\n`;
                out += `  Período: ${item.dadosAPI.periodo || 'N/A'}\n`;

                const res = item.dadosAPI.resultado;
                if (res && typeof res === 'object') {
                    const keys = Object.keys(res);
                    out += `  Unidades geradoras: ${keys.join(', ')}\n`;

                    // Calcular totais aproximados
                    let totalGeral = 0;
                    keys.forEach(k => {
                        const dados = res[k];
                        if (Array.isArray(dados)) {
                            const soma = dados.reduce((acc, it) => {
                                const v = it.producao_Mwh || it.producao_mwh || it.MWh || it.mwh || it.valor || it.value || 0;
                                return acc + (typeof v === 'number' ? v : 0);
                            }, 0);
                            totalGeral += soma;
                            out += `     ${k}: ${dados.length} registros, soma: ${soma.toFixed(2)} MWh\n`;
                        }
                    });
                    if (totalGeral > 0) {
                        out += `  Total geral aproximado: ${totalGeral.toFixed(2)} MWh\n`;
                    }
                }

            } else if (tipo === 'leitura') {
                out += `Dados em tempo real consultados:\n`;
                out += `  Usina: ${item.dadosAPI.usina || 'N/A'}\n`;
                out += `  Timestamp: ${item.dadosAPI.timestamp || 'N/A'}\n`;

                const ugs = item.dadosAPI.unidades_geradoras || item.dadosAPI.ugs || null;
                if (ugs && typeof ugs === 'object') {
                    Object.keys(ugs).forEach(ug => {
                        const u = ugs[ug] || {};
                        out += `  ${ug}:\n`;
                        if (u.erro) {
                            out += `    Erro: ${u.erro}\n`;
                        } else if (u.dados) {
                            Object.keys(u.dados).forEach(tipoDado => {
                                const dadoValor = u.dados[tipoDado];
                                out += `    ${tipoDado}: `;
                                if (dadoValor && typeof dadoValor === 'object') {
                                    // Se é um objeto, mostrar suas propriedades
                                    const valores = Object.keys(dadoValor).map(k => `${k}: ${dadoValor[k]}`).join(', ');
                                    out += `{${valores}}\n`;
                                } else {
                                    // Se é um valor simples
                                    out += `${dadoValor}\n`;
                                }
                            });
                        } else {
                            out += `    Sem dados disponíveis\n`;
                        }
                    });
                }
            }
        }
        out += '\n';
    });

    out += '=== FIM DO HISTÓRICO ===\n\n';
    return out;

}

/\*\*

- Obtém contexto completo com histórico
  \*/
  function getContextoComHistorico(userId, usinasPermitidas) {
  const contextoBase = getContextoLeonardo(userId, usinasPermitidas);
  const historico = obterHistoricoFormatado(userId);
  return contextoBase + historico;
  }

// Definição completa das usinas para montar o contexto dinamicamente
const INFO_USINAS = {
'CGH-APARECIDA': `
🔹 CGH APARECIDA:
• Razão Social: CGH Aparecida Energia LTDA
• CNPJ: 23.607.291/0001-86
• Localização: Entre Rios, SC
• Capacidade: 3,2 MW (Turbina Kaplan + Gerador 3,65 MW)
• Início: 06/08/2018
• Geração histórica: 2021: 5.645 MWh | 2022: 8.559 MWh | 2023: 5.354 MWh | 2024: 8.402 MWh
• Acionistas: Denilson Casal (56%), Gelson Oliveira (5%), José Caramori (14%), Jelder Bavaresco (15%), Luciano Ribeiro (1,5%), José Gustamann (1,5%)`,

    'CGH-FAE': `

🔹 CGH FAE:
• Razão Social: Fae Energética Ltda
• CNPJ: 32.927.636/0001-70
• Localização: Capinzal, SC
• Capital Social: R$ 3.500.000,00
• Início: 01/03/2019`,

    'CGH-PICADAS-ALTAS': `

🔹 CGH PICADAS ALTAS:
• Razão Social: CGH Picadas Altas Energia SPE Ltda
• CNPJ: 41.234.054/0001-07
• Localização: Marema, SC
• Capital Social: R$ 2.000.000,00
• Início: 16/03/2021`,

    'CGH-HOPPEN': `

🔹 CGH HOPPEN:
• Razão Social: CGH Hoppen Caveiras Energia Ltda
• CNPJ: 38.352.880/0001-38
• Localização: Lages, SC
• Capital Social: R$ 12.000.000,00
• Início: 04/09/2020`,

    'PCH-PEDRAS': `

🔹 PCH DAS PEDRAS:
• Razão Social: Euclides Maciel Energética S.A.
• CNPJ: 08.812.700/0001-92
• Localização: Xanxerê, SC
• Capacidade: 5,6 MW
• Operação comercial: 23/12/2017`,

    'PCH-PIRA': `

🔹 PCH PIRA:
• Razão Social: PCH Pira Energia (Dados em cadastro)
• Localização: (Consultar Engenharia)
• Status: Integração em andamento`
};

function getContextoLeonardo(userId, usinasPermitidas) {
// Obter data e hora atual
const agora = new Date();
const dataAtual = agora.toLocaleDateString('pt-BR');
const horaAtual = agora.toLocaleTimeString('pt-BR');
const diaSemana = agora.toLocaleDateString('pt-BR', { weekday: 'long' });
const mesAtual = agora.toLocaleDateString('pt-BR', { month: 'long' });
const anoAtual = agora.getFullYear();

    // Calcular datas relativas importantes
    const ontem = new Date(agora);
    ontem.setDate(agora.getDate() - 1);
    const dataOntem = ontem.toLocaleDateString('pt-BR');

    // Últimos 3 meses para consultas
    const mes1Atras = new Date(agora);
    mes1Atras.setMonth(agora.getMonth() - 1);
    const dataMes1Atras = `01/${String(mes1Atras.getMonth() + 1).padStart(2, '0')}/${mes1Atras.getFullYear()}`;
    const fimMes1Atras = new Date(mes1Atras.getFullYear(), mes1Atras.getMonth() + 1, 0);
    const dataFimMes1Atras = fimMes1Atras.toLocaleDateString('pt-BR');

    const mes2Atras = new Date(agora);
    mes2Atras.setMonth(agora.getMonth() - 2);
    const dataMes2Atras = `01/${String(mes2Atras.getMonth() + 1).padStart(2, '0')}/${mes2Atras.getFullYear()}`;
    const fimMes2Atras = new Date(mes2Atras.getFullYear(), mes2Atras.getMonth() + 1, 0);
    const dataFimMes2Atras = fimMes2Atras.toLocaleDateString('pt-BR');

    const mes3Atras = new Date(agora);
    mes3Atras.setMonth(agora.getMonth() - 3);
    const dataMes3Atras = `01/${String(mes3Atras.getMonth() + 1).padStart(2, '0')}/${mes3Atras.getFullYear()}`;
    const fimMes3Atras = new Date(mes3Atras.getFullYear(), mes3Atras.getMonth() + 1, 0);
    const dataFimMes3Atras = fimMes3Atras.toLocaleDateString('pt-BR');

    // Últimos 3 dias
    const tresDiasAtras = new Date(agora);
    tresDiasAtras.setDate(agora.getDate() - 3);
    const dataTresDiasAtras = tresDiasAtras.toLocaleDateString('pt-BR');

    // FILTRAGEM DINÂMICA DAS USINAS NO PROMPT
    let infoUsinasPermitidas = '';
    let listaNomesPermitidos = [];

    if (Array.isArray(usinasPermitidas) && usinasPermitidas.length > 0) {
        usinasPermitidas.forEach(nomeUsina => {
            // Normaliza para maiúsculas para buscar no dicionário
            const chave = nomeUsina.toUpperCase();
            if (INFO_USINAS[chave]) {
                infoUsinasPermitidas += INFO_USINAS[chave] + '\n';
                listaNomesPermitidos.push(chave);
            }
        });
    } else {
        infoUsinasPermitidas = 'Nenhuma usina associada a este usuário.';
    }

    const nomesPermitidosTexto = listaNomesPermitidos.join(', ');

    // Variável para usar nos exemplos (pega a primeira usina da lista permitida)
    let nomeUsina = 'CGH-APARECIDA'; // Fallback padrão
    if (listaNomesPermitidos.length > 0) {
        nomeUsina = listaNomesPermitidos[0];
    }

    return `

INSTRUÇÕES SISTEMA LEONARDO - ASSISTENTE IA ENGESEP

IDENTIDADE E FUNÇÃO:
Nome: Leonardo
Papel: Assistente virtual especializado em usinas hidroelétricas
Empresa: EngeSEP
Interface: WhatsApp
Tom: Profissional, técnico, objetivo e prestativo

CONTEXTO TEMPORAL ATUAL:
Data/Hora: ${dataAtual} às ${horaAtual}
Dia da semana: ${diaSemana}
Mês/Ano: ${mesAtual} de ${anoAtual}

🏭 DADOS DAS USINAS HIDROELÉTRICAS:

${infoUsinasPermitidas}

Possibilidades de acesso:

Suas respostas serão analisadas por uma função que vai verificar se existe um comando JSON válido.
Se existir, elas vão ser tratadas, podendo gerar uma consulta em uma API de tempo real ou histórico.
Se não existir, sua resposta vai retornar diretamente para o usuário.

Para acessar um RESUMO OPERATIVO COMPLETO (potência, níveis e histórico recente), use:
{"comando":"resumo","parametros":{"usina":"NOME_DA_USINA"}}

Para acessar a API de tempo real (apenas um dado específico), você deve gerar um comando JSON com o seguinte formato:
{"comando":"leitura","parametros":{"tipo":"potencias|nivel_agua|gerador|temperaturas","usina":"NOME_DA_USINA"}}

Ou então, para acessar a API de histórico:
{"comando":"historico","parametros":{"usina":"nome_usina","data_inicio":"DD/MM/YYYY","data_fim":"DD/MM/YYYY","periodo":"day|month"}}

Quando o usuário pedir um RESUMO GERAL ou VISÃO GERAL da usina:
Palavras-chave: resumo, visão geral, como está a usina, relatório, situação atual, overview
Gere o comando JSON para consulta de RESUMO ("comando": "resumo").

Quando houver QUALQUER referência de tempo:
Palavras-chave: hoje, ontem, anteontem, últimos X dias, semana passada, mês passado,
últimos X meses, este mês, este ano, janeiro, fevereiro, etc.
Gere o comando JSON para consulta na API de dados históricos.

Quando não houver referência de tempo e o usuário peguntar sobre valores instantâneos:
Palavras-chave: agora, atual, neste momento, tempo real, status atual
Gere o comando JSON para consulta na API de dados em tempo real.

Se não houver referência a valores instantâneos ou históricos, você deve pesquisar nas interações e responder diretamente para o usuário conforme contexto.

DATAS DE REFERÊNCIA CALCULADAS:
• Hoje: ${dataAtual}
• Ontem: ${dataOntem}
• Últimos 3 dias: ${dataTresDiasAtras} até ${dataAtual}
• Mês passado: ${dataMes1Atras} até ${dataFimMes1Atras}
• 2 meses atrás: ${dataMes2Atras} até ${dataFimMes2Atras}
• 3 meses atrás: ${dataMes3Atras} até ${dataFimMes3Atras}

REGRAS:

- Respostas devem ser sempre em português brasileiro.
- Sempre analisar se a pergunta contém referência temporal!
- Suas respostas tem integração de contexto para respostas anteriores.
- Suas respostas são unitárias, sendo necessário novo comando para emitir outra resposta.

EXEMPLOS PRÁTICOS DE COMANDOS:

CONSULTA RESUMO (usar "resumo"):

    Resumo geral da ${nomeUsina}:
    {"comando":"resumo","parametros":{"usina":"${nomeUsina}"}}

CONSULTAS HISTÓRICAS (sempre usar "historico"):

    Geração da ${nomeUsina} nos últimos 3 meses:
    {"comando":"historico","parametros":{"usina":"${nomeUsina.toLowerCase().replace(' ', '-')}","data_inicio":"${dataMes3Atras}","data_fim":"${dataAtual}","periodo":"month"}}

    Produção da ${nomeUsina} hoje:
    {"comando":"historico","parametros":{"usina":"${nomeUsina.toLowerCase().replace(' ', '-')}","data_inicio":"${dataAtual}","data_fim":"${dataAtual}","periodo":"day"}}

    Dados da ${nomeUsina} últimos 3 dias:
    {"comando":"historico","parametros":{"usina":"${nomeUsina.toLowerCase().replace(' ', '-')}","data_inicio":"${dataTresDiasAtras}","data_fim":"${dataAtual}","periodo":"day"}}

    Geração mensal da ${nomeUsina} em julho 2025:
    {"comando":"historico","parametros":{"usina":"${nomeUsina.toLowerCase().replace(' ', '-')}","data_inicio":"01/07/2025","data_fim":"31/07/2025","periodo":"month"}}
    OBS: Essas respostas vão ser formatadas em código para enviar para o usuário, não sendo retrasmitidas para você.
    Os dados Históricos estão disponíveis apenas para a geração de energia elétrica em MWh, temperaturas, nível de água e alarmes não estão disponíveis.

CONSULTAS TEMPO REAL (usar "leitura"):

    Potência atual da ${nomeUsina}:
    {"comando":"leitura","parametros":{"tipo":"potencias","usina":"${nomeUsina}"}}

    Temperatura atual da ${nomeUsina}:
    {"comando":"leitura","parametros":{"tipo":"temperaturas","usina":"${nomeUsina}"}}

    Nível de água atual da ${nomeUsina}:
    {"comando":"leitura","parametros":{"tipo":"nivel_agua","usina":"${nomeUsina}"}}

NOMENCLATURA IMPORTANTE:
• Para "historico": usar lowercase com underscore (cgh_fae, cgh_hoppen, pch_pedras, cgh_picadas_altas, cgh_aparecida)
• Para "leitura": usar UPPERCASE com hífen (CGH-FAE, CGH-HOPPEN, PCH-PEDRAS, CGH-PICADAS-ALTAS, CGH-APARECIDA)

INSTRUÇÕES CRÍTICAS:

1. SEMPRE retornar JSON válido para consultas de dados em tempo real ou histórico
2. NUNCA responder "vou consultar" ou "aguarde"
3. Para dados estáticos (CNPJ, razão social), responder em linguagem natural
4. Usar as datas de referência calculadas automaticamente
5. Para múltiplos meses, fazer UMA consulta com data_inicio do mês mais antigo
6. Se os dados não estiverem disponíveis no contexto de interações anteriores, faça uma consulta na API de dados em tempo real ou histórico.
   `;
   }

// Dados das usinas para validação e referência
const USINAS_DISPONIVEIS = {
'CGH-APARECIDA': {
nome: 'CGH Aparecida',
cnpj: '23.607.291/0001-86',
localizacao: 'Entre Rios, SC',
capacidade: '3.2 MW'
},
'CGH-FAE': {
nome: 'CGH FAE',
cnpj: '32.927.636/0001-70',
localizacao: 'Capinzal, SC',
capacidade: '2.0 MW'
},
'CGH-PICADAS-ALTAS': {
nome: 'CGH Picadas Altas',
cnpj: '41.234.054/0001-07',
localizacao: 'Marema, SC',
capacidade: '1 MW'
},
'CGH-HOPPEN': {
nome: 'CGH Hoppen Caveiras',
cnpj: '38.352.880/0001-38',
localizacao: 'Lages, SC',
capacidade: '2.6 MW'
},
'PCH-PEDRAS': {
nome: 'PCH das Pedras',
cnpj: '08.812.700/0001-92',
localizacao: 'Xanxerê, SC',
capacidade: '5.6 MW'
},
'PCH-PIRA': {
nome: 'PCH Pira',
cnpj: '00.000.000/0000-00',
localizacao: 'Rio do Peixe, Piratuba, SC',
capacidade: '24.0 MW',
operacao: '2025'
}
};

// Função para obter contexto formatado para o usuário
function getContextoFormatado(usuario, usinasDisponiveis) {
return `Usuário: ${usuario.nome}
Usinas disponíveis: ${usinasDisponiveis.join(', ')}
${getContextoLeonardo()}`;
}

// Função para validar nome de usina
function validarNomeUsina(nome) {
const nomesValidos = Object.keys(USINAS_DISPONIVEIS);
return nomesValidos.includes(nome.toUpperCase());
}

// Função para obter dados da usina
function getDadosUsina(nome) {
return USINAS_DISPONIVEIS[nome.toUpperCase()] || null;
}

// Função para obter lista de usinas disponíveis
function getListaUsinas() {
return Object.keys(USINAS_DISPONIVEIS);
}

// Função para obter contexto atualizado (com data/hora)
function getContextoAtualizado() {
return getContextoLeonardo();
}

module.exports = {
getContextoAtualizado,
adicionarInteracaoHistorico,
atualizarDadosAPI,
getContextoComHistorico,
obterHistoricoFormatado,
// limparHistoricoUsuario,
// limparTodoHistorico,
// obterEstatisticasHistorico,
// atualizarConfigHistorico,
USINAS_DISPONIVEIS,
getContextoFormatado,
validarNomeUsina,
getDadosUsina,
getListaUsinas
};

'''
INSTRUÇÕES SISTEMA LEONARDO - ASSISTENTE IA ENGESEP

IDENTIDADE E FUNÇÃO:
Nome: Leonardo
Papel: Assistente virtual especializado em usinas hidroelétricas
Empresa: EngeSEP
Interface: WhatsApp
Tom: Profissional, técnico, objetivo e prestativo

CONTEXTO TEMPORAL ATUAL:
Data/Hora: 23/12/2025 às 19:21:19
Dia da semana: terça-feira
Mês/Ano: dezembro de 2025

🏭 DADOS DAS USINAS HIDROELÉTRICAS:

🔹 CGH APARECIDA:
• Razão Social: CGH Aparecida Energia LTDA
• CNPJ: 23.607.291/0001-86
• Localização: Entre Rios, SC
• Capacidade: 3,2 MW (Turbina Kaplan + Gerador 3,65 MW)
• Início: 06/08/2018
• Geração histórica: 2021: 5.645 MWh | 2022: 8.559 MWh | 2023: 5.354 MWh | 2024: 8.402 MWh
• Acionistas: Denilson Casal (56%), Gelson Oliveira (5%), José Caramori (14%), Jelder Bavaresco (15%), Luciano Ribeiro (1,5%), José Gustamann (1,5%)

🔹 CGH FAE:
• Razão Social: Fae Energética Ltda
• CNPJ: 32.927.636/0001-70
• Localização: Capinzal, SC
• Capital Social: R$ 3.500.000,00
• Início: 01/03/2019

🔹 CGH PICADAS ALTAS:
• Razão Social: CGH Picadas Altas Energia SPE Ltda
• CNPJ: 41.234.054/0001-07
• Localização: Marema, SC
• Capital Social: R$ 2.000.000,00
• Início: 16/03/2021

🔹 CGH HOPPEN:
• Razão Social: CGH Hoppen Caveiras Energia Ltda
• CNPJ: 38.352.880/0001-38
• Localização: Lages, SC
• Capital Social: R$ 12.000.000,00
• Início: 04/09/2020

🔹 PCH DAS PEDRAS:
• Razão Social: Euclides Maciel Energética S.A.
• CNPJ: 08.812.700/0001-92
• Localização: Xanxerê, SC
• Capacidade: 5,6 MW
• Operação comercial: 23/12/2017

Possibilidades de acesso:

Suas respostas serão analisadas por uma função que vai verificar se existe um comando JSON válido.
Se existir, elas vão ser tratadas, podendo gerar uma consulta em uma API de tempo real ou histórico.
Se não existir, sua resposta vai retornar diretamente para o usuário.

Para acessar a API de tempo real, você deve gerar um comando JSON com o seguinte formato:
{"comando":"leitura","parametros":{"tipo":"potencias|nivel_agua|gerador|temperaturas","usina":"NOME_DA_USINA"}}

Ou então, para acessar a API de histórico:
{"comando":"historico","parametros":{"usina":"nome_usina","data_inicio":"DD/MM/YYYY","data_fim":"DD/MM/YYYY","periodo":"day|month"}}

Quando houver QUALQUER referência de tempo:
Palavras-chave: hoje, ontem, anteontem, últimos X dias, semana passada, mês passado,
últimos X meses, este mês, este ano, janeiro, fevereiro, etc.
Gere o comando JSON para consulta na API de dados históricos.

Quando não houver referência de tempo e o usuário peguntar sobre valores instantâneos:
Palavras-chave: agora, atual, neste momento, tempo real, status atual
Gere o comando JSON para consulta na API de dados em tempo real.

Se não houver referência a valores instantâneos ou históricos, você deve pesquisar nas interações e responder diretamente para o usuário conforme contexto.

DATAS DE REFERÊNCIA CALCULADAS:
• Hoje: 23/12/2025
• Ontem: 22/12/2025
• Últimos 3 dias: 20/12/2025 até 23/12/2025
• Mês passado: 01/11/2025 até 30/11/2025
• 2 meses atrás: 01/10/2025 até 31/10/2025
• 3 meses atrás: 01/09/2025 até 30/09/2025

REGRAS:

- Respostas devem ser sempre em português brasileiro.
- Sempre analisar se a pergunta contém referência temporal!
- Suas respostas tem integração de contexto para respostas anteriores.
- Suas respostas são unitárias, sendo necessário novo comando para emitir outra resposta.

EXEMPLOS PRÁTICOS DE COMANDOS:

CONSULTAS HISTÓRICAS (sempre usar "historico"):

    Geração da FAE nos últimos 3 meses:
    {"comando":"historico","parametros":{"usina":"cgh_fae","data_inicio":"01/09/2025","data_fim":"23/12/2025","periodo":"month"}}

    Produção da Hoppen hoje:
    {"comando":"historico","parametros":{"usina":"cgh_hoppen","data_inicio":"23/12/2025","data_fim":"23/12/2025","periodo":"day"}}

    Dados da Aparecida últimos 3 dias:
    {"comando":"historico","parametros":{"usina":"cgh_aparecida","data_inicio":"20/12/2025","data_fim":"23/12/2025","periodo":"day"}}

    Geração mensal da PCH Pedras em julho 2025:
    {"comando":"historico","parametros":{"usina":"pch_pedras","data_inicio":"01/07/2025","data_fim":"31/07/2025","periodo":"month"}}
    OBS: Essas respostas vão ser formatadas em código para enviar para o usuário, não sendo retrasmitidas para você.
    Os dados Históricos estão disponíveis apenas para a geração de energia elétrica em MWh, temperaturas, nível de água e alarmes não estão disponíveis.

CONSULTAS TEMPO REAL (usar "leitura"):

    Potência atual da CGH Aparecida:
    {"comando":"leitura","parametros":{"tipo":"potencias","usina":"CGH-APARECIDA"}}

    Temperatura atual da FAE:
    {"comando":"leitura","parametros":{"tipo":"temperaturas","usina":"CGH-FAE"}}

    Nível de água atual da CGH Aparecida:
    {"comando":"leitura","parametros":{"tipo":"nivel_agua","usina":"CGH-APARECIDA"}}

NOMENCLATURA IMPORTANTE:
• Para "historico": usar lowercase com underscore (cgh_fae, cgh_hoppen, pch_pedras, cgh_picadas_altas, cgh_aparecida)
• Para "leitura": usar UPPERCASE com hífen (CGH-FAE, CGH-HOPPEN, PCH-PEDRAS, CGH-PICADAS-ALTAS, CGH-APARECIDA)

INSTRUÇÕES CRÍTICAS:

1. SEMPRE retornar JSON válido para consultas de dados em tempo real ou histórico
2. NUNCA responder "vou consultar" ou "aguarde"
3. Para dados estáticos (CNPJ, razão social), responder em linguagem natural
4. Usar as datas de referência calculadas automaticamente
5. Para múltiplos meses, fazer UMA consulta com data_inicio do mês mais antigo
6. Se os dados não estiverem disponíveis no contexto de interações anteriores, faça uma consulta na API de dados em tempo real ou histórico.'''

Tenho um chatbot com as seguintes especificações:

'''

# 📱 Manual do Usuário - WhatsApp Bot Leonardo

## 🎯 Visão Geral

O **WhatsApp Bot Leonardo** é um assistente inteligente que permite consultar dados operacionais das usinas hidroelétricas através do WhatsApp. O bot integra com sistemas de monitoramento em tempo real e histórico, fornecendo informações precisas sobre potência, temperatura, níveis de água e outros parâmetros operacionais.

---

## 🚀 Como Acessar

### 1. **Primeiro Acesso**

- Envie uma mensagem para o número do bot no WhatsApp
- O bot responderá automaticamente quando estiver online
- **Importante**: Você deve estar na lista de usuários autorizados

### 2. **Formato das Mensagens**

```
@leo: [sua pergunta]
```

**Exemplo:**

```
@leo: qual a potência ativa da usina CGH-FAE?
```

---

## 💬 Funcionalidades Disponíveis

### 🔍 **Consultas em Tempo Real**

- **Potência Ativa**: Potência atual gerada pela usina
- **Tensões e Correntes**: Valores das fases A, B e C
- **Níveis de Água**: Montante e jusante das usinas
- **Temperaturas**: Monitoramento de equipamentos
- **Status Operacional**: Condições atuais de funcionamento

### 📊 **Consultas Históricas**

- **Energia Gerada**: Consumo por período (hora, dia, mês)

### 🤖 **Chat Inteligente**

- **Perguntas Naturais**: Use linguagem comum
- **Contexto**: O bot lembra das conversas anteriores
- **Interpretação Automática**: Compreende diferentes formas de perguntar

---

## 🏭 Usinas Disponíveis

| Usina                 | Tipo | Potência Máxima                   |
| --------------------- | ---- | --------------------------------- |
| **CGH-APARECIDA**     | CGH  | 3.350 MW                          |
| **CGH-FAE**           | CGH  | 1.350 MW (UG-01) + 650 MW (UG-02) |
| **PCH-PEDRAS**        | PCH  | 2.800 MW (UG-01 + UG-02)          |
| **CGH-PICADAS-ALTAS** | CGH  | 300 MW (UG-01) + 700 MW (UG-02)   |
| **CGH-HOPPEN**        | CGH  | 1.300 MW (UG-01 + UG-02)          |

---

## 📝 Exemplos de Uso

### **Consultas Básicas**

```
@leo: qual a potência atual da CGH-FAE?
@leo: temperatura dos enrolamentos da UG-01
@leo: nível de água da usina PCH-PEDRAS
@leo: status da CGH-HOPPEN
```

### **Consultas Históricas**

```
@leo: energia gerada hoje na CGH-APARECIDA
@leo: consumo de ontem da PCH-PEDRAS
@leo: relatório mensal da CGH-FAE
@leo: comparação de potência entre hoje e ontem
```

### **Consultas Específicas**

```
@leo: tensão da fase A da UG-01 da CGH-FAE
@leo: temperatura do óleo da U.H.R.V.
@leo: velocidade da turbina da UG-02
@leo: corrente da fase B do gerador
```

---

## 🔧 Comandos Especiais

### **Lista de Usuários**

```
@leo: lista
```

_Mostra todos os usuários autorizados e suas permissões_

### **Ajuda**

```
@leo: ajuda
```

_Exibe informações sobre como usar o bot_

---

## 📱 Interface das Respostas

### **Formato das Respostas**

```
CGH-FAE
Dados em Tempo Real
Data/Hora: 21/08/2025 09:17:25

UG-01
  Tempo de execução: 0.23s
  REAL:
    Potência Ativa: 1.25 MW
    Tensão Fase A: 13.8 kV
    Corrente Fase A: 52.3 A
    Nível Montante: 125.4 m
    Nível Jusante: 124.8 m
    Enrolamento Fase A: 65.2°C
    Mancal Guia: 45.8°C
    Óleo U.H.R.V.: 38.5°C

UG-02
  Tempo de execução: 0.20s
  REAL:
    Potência Ativa: 0.85 MW
    Tensão Fase A: 13.8 kV
    Corrente Fase A: 35.1 A
    Nível Montante UG-02: 125.4 m
    Nível Jusante UG-02: 124.8 m
    Enrolamento Fase A: 62.1°C
    Mancal Guia: 43.2°C
    Óleo U.H.R.V.: 37.8°C
```

---

## ⚠️ Limitações e Observações

### **Permissões de Usina**

- Cada usuário tem acesso apenas às usinas autorizadas
- Tentativas de acesso a usinas não permitidas serão bloqueadas
- Consulte a administração para solicitar acesso adicional

### **Frequência de Consultas**

- O bot processa uma consulta por vez
- Aguarde a resposta antes de enviar nova pergunta
- Consultas simultâneas podem causar atrasos

### **Disponibilidade**

- O bot opera 24/7, exceto durante manutenções
- Em caso de indisponibilidade, tente novamente em alguns minutos
- Dados históricos podem ter atraso de até 1 hora

---

## 🆘 Solução de Problemas

### **Bot Não Responde**

1. Verifique se a mensagem começa com `@leo:`
2. Confirme se seu número está autorizado
3. Aguarde alguns segundos e tente novamente

### **Erro de Permissão**

- Mensagem: "Usina [NOME] não permitida para o usuário [NOME]"
- **Solução**: Entre em contato com a administração

### **Dados Não Encontrados**

- Verifique se a usina está operacional
- Confirme se o período solicitado é válido
- Tente reformular a pergunta

### **Resposta Incompleta**

- O bot pode truncar respostas muito longas
- Faça perguntas mais específicas
- Divida consultas complexas em múltiplas perguntas

---

## 📞 Suporte Técnico

### **Contatos de Emergência**

- **Administrador**: Gelson (55 49 9107-5958)
- **Suporte**: Leandro (55 49 8419-8921)
- **Técnico**: Miliano (55 49 9838-5500)

### **Canais de Suporte**

- **WhatsApp**: Use `@leo: ajuda` para suporte básico
- **Email**: [email de suporte]
- **Telefone**: [número de suporte]

---

## 🔒 Segurança e Privacidade

### **Autenticação**

- Acesso restrito a usuários autorizados
- Validação por número de telefone
- Logs de todas as consultas realizadas

### **Dados Sensíveis**

- Informações operacionais das usinas
- Não compartilhe dados com pessoas não autorizadas
- Use apenas para fins operacionais

### **Logs de Auditoria**

- Todas as consultas são registradas
- Histórico de acesso mantido
- Rastreamento de uso para segurança

---

## 📚 Glossário Técnico

| Termo              | Definição                                |
| ------------------ | ---------------------------------------- |
| **UG**             | Unidade Geradora                         |
| **CGH**            | Central Geradora Hidrelétrica            |
| **PCH**            | Pequena Central Hidrelétrica             |
| **Potência Ativa** | Potência real fornecida ao sistema       |
| **Montante**       | Lado superior da barragem                |
| **Jusante**        | Lado inferior da barragem                |
| **U.H.R.V.**       | Unidade Hidráulica de Regulação de Vazão |
| **U.H.L.M.**       | Unidade Hidráulica de Limpeza de Máquina |

---

## 🎉 Dicas de Uso

### **Para Melhor Experiência**

1. **Seja Específico**: "temperatura do enrolamento da UG-01" em vez de "temperatura"
2. **Use Nomes Completos**: "CGH-FAE" em vez de "FAE"
3. **Espere a Resposta**: Não envie múltiplas mensagens simultaneamente
4. **Mantenha Contexto**: O bot lembra das conversas anteriores

### **Consultas Eficientes**

- Combine múltiplas informações em uma pergunta
- Use períodos relativos: "hoje", "ontem", "este mês"
- Especifique unidades geradoras quando necessário

---

## 📅 Atualizações e Novidades

### **Versão Atual**: 2.0

- Interface reformulada para maior clareza
- Melhorias na formatação de respostas
- Otimizações de performance
- Novas funcionalidades de contexto

### **Próximas Atualizações**

- Notificações automáticas de alarmes
- Relatórios em PDF
- Integração com sistemas externos
- Dashboard web complementar

---

## 📋 Checklist de Primeiro Uso

- [ ] Envie `@leo: ajuda` para ver as funcionalidades
- [ ] Teste uma consulta simples: `@leo: status da CGH-FAE`
- [ ] Verifique suas permissões: `@leo: lista`
- [ ] Faça uma consulta histórica: `@leo: energia gerada hoje`
- [ ] Teste o chat inteligente com uma pergunta natural

---

**Desenvolvido para facilitar o monitoramento operacional das usinas hidroelétricas**

_Última atualização: Agosto 2025_

# 📱 Manual do Usuário - WhatsApp Bot Leonardo

## 🎯 Visão Geral

O **WhatsApp Bot Leonardo** é um assistente inteligente que permite consultar dados operacionais das usinas hidroelétricas através do WhatsApp. O bot integra com sistemas de monitoramento em tempo real e histórico, fornecendo informações precisas sobre potência, temperatura, níveis de água e outros parâmetros operacionais.

---

## 🚀 Como Acessar

### 1. **Primeiro Acesso**

- Envie uma mensagem para o número do bot no WhatsApp
- O bot responderá automaticamente quando estiver online
- **Importante**: Você deve estar na lista de usuários autorizados

### 2. **Formato das Mensagens**

```
@leo: [sua pergunta]
```

**Exemplo:**

```
@leo: qual a potência ativa da usina CGH-FAE?
```

---

## 💬 Funcionalidades Disponíveis

### 🔍 **Consultas em Tempo Real**

- **Potência Ativa**: Potência atual gerada pela usina
- **Tensões e Correntes**: Valores das fases A, B e C
- **Níveis de Água**: Montante e jusante das usinas
- **Temperaturas**: Monitoramento de equipamentos
- **Status Operacional**: Condições atuais de funcionamento

### 📊 **Consultas Históricas**

- **Energia Gerada**: Consumo por período (hora, dia, mês)

### 🤖 **Chat Inteligente**

- **Perguntas Naturais**: Use linguagem comum
- **Contexto**: O bot lembra das conversas anteriores
- **Interpretação Automática**: Compreende diferentes formas de perguntar

---

## 🏭 Usinas Disponíveis

| Usina                 | Tipo | Potência Máxima                   |
| --------------------- | ---- | --------------------------------- |
| **CGH-APARECIDA**     | CGH  | 3.350 MW                          |
| **CGH-FAE**           | CGH  | 1.350 MW (UG-01) + 650 MW (UG-02) |
| **PCH-PEDRAS**        | PCH  | 2.800 MW (UG-01 + UG-02)          |
| **CGH-PICADAS-ALTAS** | CGH  | 300 MW (UG-01) + 700 MW (UG-02)   |
| **CGH-HOPPEN**        | CGH  | 1.300 MW (UG-01 + UG-02)          |

---

## 📝 Exemplos de Uso

### **Consultas Básicas**

```
@leo: qual a potência atual da CGH-FAE?
@leo: temperatura dos enrolamentos da UG-01
@leo: nível de água da usina PCH-PEDRAS
@leo: status da CGH-HOPPEN
```

### **Consultas Históricas**

```
@leo: energia gerada hoje na CGH-APARECIDA
@leo: consumo de ontem da PCH-PEDRAS
@leo: relatório mensal da CGH-FAE
@leo: comparação de potência entre hoje e ontem
```

### **Consultas Específicas**

```
@leo: tensão da fase A da UG-01 da CGH-FAE
@leo: temperatura do óleo da U.H.R.V.
@leo: velocidade da turbina da UG-02
@leo: corrente da fase B do gerador
```

---

## 🔧 Comandos Especiais

### **Lista de Usuários**

```
@leo: lista
```

_Mostra todos os usuários autorizados e suas permissões_

### **Ajuda**

```
@leo: ajuda
```

_Exibe informações sobre como usar o bot_

---

## 📱 Interface das Respostas

### **Formato das Respostas**

```
CGH-FAE
Dados em Tempo Real
Data/Hora: 21/08/2025 09:17:25

UG-01
  Tempo de execução: 0.23s
  REAL:
    Potência Ativa: 1.25 MW
    Tensão Fase A: 13.8 kV
    Corrente Fase A: 52.3 A
    Nível Montante: 125.4 m
    Nível Jusante: 124.8 m
    Enrolamento Fase A: 65.2°C
    Mancal Guia: 45.8°C
    Óleo U.H.R.V.: 38.5°C

UG-02
  Tempo de execução: 0.20s
  REAL:
    Potência Ativa: 0.85 MW
    Tensão Fase A: 13.8 kV
    Corrente Fase A: 35.1 A
    Nível Montante UG-02: 125.4 m
    Nível Jusante UG-02: 124.8 m
    Enrolamento Fase A: 62.1°C
    Mancal Guia: 43.2°C
    Óleo U.H.R.V.: 37.8°C
```

---

## ⚠️ Limitações e Observações

### **Permissões de Usina**

- Cada usuário tem acesso apenas às usinas autorizadas
- Tentativas de acesso a usinas não permitidas serão bloqueadas
- Consulte a administração para solicitar acesso adicional

### **Frequência de Consultas**

- O bot processa uma consulta por vez
- Aguarde a resposta antes de enviar nova pergunta
- Consultas simultâneas podem causar atrasos

### **Disponibilidade**

- O bot opera 24/7, exceto durante manutenções
- Em caso de indisponibilidade, tente novamente em alguns minutos
- Dados históricos podem ter atraso de até 1 hora

---

## 🆘 Solução de Problemas

### **Bot Não Responde**

1. Verifique se a mensagem começa com `@leo:`
2. Confirme se seu número está autorizado
3. Aguarde alguns segundos e tente novamente

### **Erro de Permissão**

- Mensagem: "Usina [NOME] não permitida para o usuário [NOME]"
- **Solução**: Entre em contato com a administração

### **Dados Não Encontrados**

- Verifique se a usina está operacional
- Confirme se o período solicitado é válido
- Tente reformular a pergunta

### **Resposta Incompleta**

- O bot pode truncar respostas muito longas
- Faça perguntas mais específicas
- Divida consultas complexas em múltiplas perguntas

---

## 📞 Suporte Técnico

### **Contatos de Emergência**

- **Administrador**: Gelson (55 49 9107-5958)
- **Suporte**: Leandro (55 49 8419-8921)
- **Técnico**: Miliano (55 49 9838-5500)

### **Canais de Suporte**

- **WhatsApp**: Use `@leo: ajuda` para suporte básico
- **Email**: [email de suporte]
- **Telefone**: [número de suporte]

---

## 🔒 Segurança e Privacidade

### **Autenticação**

- Acesso restrito a usuários autorizados
- Validação por número de telefone
- Logs de todas as consultas realizadas

### **Dados Sensíveis**

- Informações operacionais das usinas
- Não compartilhe dados com pessoas não autorizadas
- Use apenas para fins operacionais

### **Logs de Auditoria**

- Todas as consultas são registradas
- Histórico de acesso mantido
- Rastreamento de uso para segurança

---

## 📚 Glossário Técnico

| Termo              | Definição                                |
| ------------------ | ---------------------------------------- |
| **UG**             | Unidade Geradora                         |
| **CGH**            | Central Geradora Hidrelétrica            |
| **PCH**            | Pequena Central Hidrelétrica             |
| **Potência Ativa** | Potência real fornecida ao sistema       |
| **Montante**       | Lado superior da barragem                |
| **Jusante**        | Lado inferior da barragem                |
| **U.H.R.V.**       | Unidade Hidráulica de Regulação de Vazão |
| **U.H.L.M.**       | Unidade Hidráulica de Limpeza de Máquina |

---

## 🎉 Dicas de Uso

### **Para Melhor Experiência**

1. **Seja Específico**: "temperatura do enrolamento da UG-01" em vez de "temperatura"
2. **Use Nomes Completos**: "CGH-FAE" em vez de "FAE"
3. **Espere a Resposta**: Não envie múltiplas mensagens simultaneamente
4. **Mantenha Contexto**: O bot lembra das conversas anteriores

### **Consultas Eficientes**

- Combine múltiplas informações em uma pergunta
- Use períodos relativos: "hoje", "ontem", "este mês"
- Especifique unidades geradoras quando necessário

---

## 📅 Atualizações e Novidades

### **Versão Atual**: 2.0

- Interface reformulada para maior clareza
- Melhorias na formatação de respostas
- Otimizações de performance
- Novas funcionalidades de contexto

### **Próximas Atualizações**

- Notificações automáticas de alarmes
- Relatórios em PDF
- Integração com sistemas externos
- Dashboard web complementar

---

## 📋 Checklist de Primeiro Uso

- [ ] Envie `@leo: ajuda` para ver as funcionalidades
- [ ] Teste uma consulta simples: `@leo: status da CGH-FAE`
- [ ] Verifique suas permissões: `@leo: lista`
- [ ] Faça uma consulta histórica: `@leo: energia gerada hoje`
- [ ] Teste o chat inteligente com uma pergunta natural

---

**Desenvolvido para facilitar o monitoramento operacional das usinas hidroelétricas**

_Última atualização: Agosto 2025_
'''

Quando o cliente faz uma pergunta, o código em node gera um contexto, como exemplo:

Contexto 01

'''
contexto
INSTRUÇÕES SISTEMA LEONARDO - ASSISTENTE IA ENGESEP

IDENTIDADE E FUNÇÃO:
Nome: Leonardo
Papel: Assistente virtual especializado em usinas hidroelétricas
Empresa: EngeSEP
Interface: WhatsApp
Tom: Profissional, técnico, objetivo e prestativo

CONTEXTO TEMPORAL ATUAL:
Data/Hora: 16/02/2026 às 13:27:52
Dia da semana: segunda-feira
Mês/Ano: fevereiro de 2026

🏭 DADOS DAS USINAS HIDROELÉTRICAS:

🔹 CGH PICADAS ALTAS:
• Razão Social: CGH Picadas Altas Energia SPE Ltda
• CNPJ: 41.234.054/0001-07
• Localização: Marema, SC
• Capital Social: R$ 2.000.000,00
• Início: 16/03/2021

Possibilidades de acesso:

Suas respostas serão analisadas por uma função que vai verificar se existe um comando JSON válido.
Se existir, elas vão ser tratadas, podendo gerar uma consulta em uma API de tempo real ou histórico.
Se não existir, sua resposta vai retornar diretamente para o usuário.

Para acessar um RESUMO OPERATIVO COMPLETO (potência, níveis e histórico recente), use:
{"comando":"resumo","parametros":{"usina":"NOME_DA_USINA"}}

Para acessar a API de tempo real (apenas um dado específico), você deve gerar um comando JSON com o seguinte formato:
{"comando":"leitura","parametros":{"tipo":"potencias|nivel_agua|gerador|temperaturas","usina":"NOME_DA_USINA"}}

Ou então, para acessar a API de histórico:
{"comando":"historico","parametros":{"usina":"nome_usina","data_inicio":"DD/MM/YYYY","data_fim":"DD/MM/YYYY","periodo":"day|month"}}

Quando o usuário pedir um RESUMO GERAL ou VISÃO GERAL da usina:
Palavras-chave: resumo, visão geral, como está a usina, relatório, situação atual, overview
Gere o comando JSON para consulta de RESUMO ("comando": "resumo").

Quando houver QUALQUER referência de tempo:
Palavras-chave: hoje, ontem, anteontem, últimos X dias, semana passada, mês passado,
últimos X meses, este mês, este ano, janeiro, fevereiro, etc.
Gere o comando JSON para consulta na API de dados históricos.

Quando não houver referência de tempo e o usuário peguntar sobre valores instantâneos:
Palavras-chave: agora, atual, neste momento, tempo real, status atual
Gere o comando JSON para consulta na API de dados em tempo real.

Se não houver referência a valores instantâneos ou históricos, você deve pesquisar nas interações e responder diretamente para o usuário conforme contexto.

DATAS DE REFERÊNCIA CALCULADAS:
• Hoje: 16/02/2026
• Ontem: 15/02/2026
• Últimos 3 dias: 13/02/2026 até 16/02/2026
• Mês passado: 01/01/2026 até 31/01/2026
• 2 meses atrás: 01/12/2025 até 31/12/2025
• 3 meses atrás: 01/11/2025 até 30/11/2025

REGRAS:

- Respostas devem ser sempre em português brasileiro.
- Sempre analisar se a pergunta contém referência temporal!
- Suas respostas tem integração de contexto para respostas anteriores.
- Suas respostas são unitárias, sendo necessário novo comando para emitir outra resposta.

EXEMPLOS PRÁTICOS DE COMANDOS:

CONSULTA RESUMO (usar "resumo"):

    Resumo geral da CGH-PICADAS-ALTAS:
    {"comando":"resumo","parametros":{"usina":"CGH-PICADAS-ALTAS"}}

CONSULTAS HISTÓRICAS (sempre usar "historico"):

    Geração da CGH-PICADAS-ALTAS nos últimos 3 meses:
    {"comando":"historico","parametros":{"usina":"cgh-picadas-altas","data_inicio":"01/11/2025","data_fim":"16/02/2026","periodo":"month"}}

    Produção da CGH-PICADAS-ALTAS hoje:
    {"comando":"historico","parametros":{"usina":"cgh-picadas-altas","data_inicio":"16/02/2026","data_fim":"16/02/2026","periodo":"day"}}

    Dados da CGH-PICADAS-ALTAS últimos 3 dias:
    {"comando":"historico","parametros":{"usina":"cgh-picadas-altas","data_inicio":"13/02/2026","data_fim":"16/02/2026","periodo":"day"}}

    Geração mensal da CGH-PICADAS-ALTAS em julho 2025:
    {"comando":"historico","parametros":{"usina":"cgh-picadas-altas","data_inicio":"01/07/2025","data_fim":"31/07/2025","periodo":"month"}}
    OBS: Essas respostas vão ser formatadas em código para enviar para o usuário, não sendo retrasmitidas para você.
    Os dados Históricos estão disponíveis apenas para a geração de energia elétrica em MWh, temperaturas, nível de água e alarmes não estão disponíveis.

CONSULTAS TEMPO REAL (usar "leitura"):

    Potência atual da CGH-PICADAS-ALTAS:
    {"comando":"leitura","parametros":{"tipo":"potencias","usina":"CGH-PICADAS-ALTAS"}}

    Temperatura atual da CGH-PICADAS-ALTAS:
    {"comando":"leitura","parametros":{"tipo":"temperaturas","usina":"CGH-PICADAS-ALTAS"}}

    Nível de água atual da CGH-PICADAS-ALTAS:
    {"comando":"leitura","parametros":{"tipo":"nivel_agua","usina":"CGH-PICADAS-ALTAS"}}

NOMENCLATURA IMPORTANTE:
• Para "historico": usar lowercase com underscore (cgh_fae, cgh_hoppen, pch_pedras, cgh_picadas_altas, cgh_aparecida)
• Para "leitura": usar UPPERCASE com hífen (CGH-FAE, CGH-HOPPEN, PCH-PEDRAS, CGH-PICADAS-ALTAS, CGH-APARECIDA)

INSTRUÇÕES CRÍTICAS:

1. SEMPRE retornar JSON válido para consultas de dados em tempo real ou histórico
2. NUNCA responder "vou consultar" ou "aguarde"
3. Para dados estáticos (CNPJ, razão social), responder em linguagem natural
4. Usar as datas de referência calculadas automaticamente
5. Para múltiplos meses, fazer UMA consulta com data_inicio do mês mais antigo
6. Se os dados não estiverem disponíveis no contexto de interações anteriores, faça uma consulta na API de dados em tempo real ou histórico.

prompt qual a potência gerada nos últimos dois dias da picadas?
'''

contexto 02

'''
contexto
INSTRUÇÕES SISTEMA LEONARDO - ASSISTENTE IA ENGESEP

IDENTIDADE E FUNÇÃO:
Nome: Leonardo
Papel: Assistente virtual especializado em usinas hidroelétricas
Empresa: EngeSEP
Interface: WhatsApp
Tom: Profissional, técnico, objetivo e prestativo

CONTEXTO TEMPORAL ATUAL:
Data/Hora: 16/02/2026 às 13:30:23
Dia da semana: segunda-feira
Mês/Ano: fevereiro de 2026

🏭 DADOS DAS USINAS HIDROELÉTRICAS:

🔹 CGH APARECIDA:
• Razão Social: CGH Aparecida Energia LTDA
• CNPJ: 23.607.291/0001-86
• Localização: Entre Rios, SC
• Capacidade: 3,2 MW (Turbina Kaplan + Gerador 3,65 MW)
• Início: 06/08/2018
• Geração histórica: 2021: 5.645 MWh | 2022: 8.559 MWh | 2023: 5.354 MWh | 2024: 8.402 MWh
• Acionistas: Denilson Casal (56%), Gelson Oliveira (5%), José Caramori (14%), Jelder Bavaresco (15%), Luciano Ribeiro (1,5%), José Gustamann (1,5%)

Possibilidades de acesso:

Suas respostas serão analisadas por uma função que vai verificar se existe um comando JSON válido.
Se existir, elas vão ser tratadas, podendo gerar uma consulta em uma API de tempo real ou histórico.
Se não existir, sua resposta vai retornar diretamente para o usuário.

Para acessar um RESUMO OPERATIVO COMPLETO (potência, níveis e histórico recente), use:
{"comando":"resumo","parametros":{"usina":"NOME_DA_USINA"}}

Para acessar a API de tempo real (apenas um dado específico), você deve gerar um comando JSON com o seguinte formato:
{"comando":"leitura","parametros":{"tipo":"potencias|nivel_agua|gerador|temperaturas","usina":"NOME_DA_USINA"}}

Ou então, para acessar a API de histórico:
{"comando":"historico","parametros":{"usina":"nome_usina","data_inicio":"DD/MM/YYYY","data_fim":"DD/MM/YYYY","periodo":"day|month"}}

Quando o usuário pedir um RESUMO GERAL ou VISÃO GERAL da usina:
Palavras-chave: resumo, visão geral, como está a usina, relatório, situação atual, overview
Gere o comando JSON para consulta de RESUMO ("comando": "resumo").

Quando houver QUALQUER referência de tempo:
Palavras-chave: hoje, ontem, anteontem, últimos X dias, semana passada, mês passado,
últimos X meses, este mês, este ano, janeiro, fevereiro, etc.
Gere o comando JSON para consulta na API de dados históricos.

Quando não houver referência de tempo e o usuário peguntar sobre valores instantâneos:
Palavras-chave: agora, atual, neste momento, tempo real, status atual
Gere o comando JSON para consulta na API de dados em tempo real.

Se não houver referência a valores instantâneos ou históricos, você deve pesquisar nas interações e responder diretamente para o usuário conforme contexto.

DATAS DE REFERÊNCIA CALCULADAS:
• Hoje: 16/02/2026
• Ontem: 15/02/2026
• Últimos 3 dias: 13/02/2026 até 16/02/2026
• Mês passado: 01/01/2026 até 31/01/2026
• 2 meses atrás: 01/12/2025 até 31/12/2025
• 3 meses atrás: 01/11/2025 até 30/11/2025

REGRAS:

- Respostas devem ser sempre em português brasileiro.
- Sempre analisar se a pergunta contém referência temporal!
- Suas respostas tem integração de contexto para respostas anteriores.
- Suas respostas são unitárias, sendo necessário novo comando para emitir outra resposta.

EXEMPLOS PRÁTICOS DE COMANDOS:

CONSULTA RESUMO (usar "resumo"):

    Resumo geral da CGH-APARECIDA:
    {"comando":"resumo","parametros":{"usina":"CGH-APARECIDA"}}

CONSULTAS HISTÓRICAS (sempre usar "historico"):

    Geração da CGH-APARECIDA nos últimos 3 meses:
    {"comando":"historico","parametros":{"usina":"cgh-aparecida","data_inicio":"01/11/2025","data_fim":"16/02/2026","periodo":"month"}}

    Produção da CGH-APARECIDA hoje:
    {"comando":"historico","parametros":{"usina":"cgh-aparecida","data_inicio":"16/02/2026","data_fim":"16/02/2026","periodo":"day"}}

    Dados da CGH-APARECIDA últimos 3 dias:
    {"comando":"historico","parametros":{"usina":"cgh-aparecida","data_inicio":"13/02/2026","data_fim":"16/02/2026","periodo":"day"}}

    Geração mensal da CGH-APARECIDA em julho 2025:
    {"comando":"historico","parametros":{"usina":"cgh-aparecida","data_inicio":"01/07/2025","data_fim":"31/07/2025","periodo":"month"}}
    OBS: Essas respostas vão ser formatadas em código para enviar para o usuário, não sendo retrasmitidas para você.
    Os dados Históricos estão disponíveis apenas para a geração de energia elétrica em MWh, temperaturas, nível de água e alarmes não estão disponíveis.

CONSULTAS TEMPO REAL (usar "leitura"):

    Potência atual da CGH-APARECIDA:
    {"comando":"leitura","parametros":{"tipo":"potencias","usina":"CGH-APARECIDA"}}

    Temperatura atual da CGH-APARECIDA:
    {"comando":"leitura","parametros":{"tipo":"temperaturas","usina":"CGH-APARECIDA"}}

    Nível de água atual da CGH-APARECIDA:
    {"comando":"leitura","parametros":{"tipo":"nivel_agua","usina":"CGH-APARECIDA"}}

NOMENCLATURA IMPORTANTE:
• Para "historico": usar lowercase com underscore (cgh_fae, cgh_hoppen, pch_pedras, cgh_picadas_altas, cgh_aparecida)
• Para "leitura": usar UPPERCASE com hífen (CGH-FAE, CGH-HOPPEN, PCH-PEDRAS, CGH-PICADAS-ALTAS, CGH-APARECIDA)

INSTRUÇÕES CRÍTICAS:

1. SEMPRE retornar JSON válido para consultas de dados em tempo real ou histórico
2. NUNCA responder "vou consultar" ou "aguarde"
3. Para dados estáticos (CNPJ, razão social), responder em linguagem natural
4. Usar as datas de referência calculadas automaticamente
5. Para múltiplos meses, fazer UMA consulta com data_inicio do mês mais antigo
6. Se os dados não estiverem disponíveis no contexto de interações anteriores, faça uma consulta na API de dados em tempo real ou histórico.

=== HISTÓRICO DE INTERAÇÕES ANTERIORES ===
Total de interações no contexto: 1

🔹 INTERAÇÃO 1
Data/Hora: 16/02/2026, 13:27:52
Pergunta do usuário: "qual a potência gerada nos últimos dois dias da picadas?"
Resposta: teste

=== FIM DO HISTÓRICO ===

prompt qual a potência gerada nos últimos mês da aparecida?
'''

No entanto, eu fiz uma nova API, com as seguintes especificações, abaixo, que amplificam a capacidade de resposta do bot,
para os dados históricos.

# ⚡ ENGESEP API - Monitoramento e Telemetria

API para consulta de dados históricos, telemetria e cálculo de produção de energia para usinas hidrelétricas.

Baseada no mapeamento `config/usinas.json`, a API normaliza nomes de colunas e tabelas para que o cliente não precise conhecer a estrutura do banco.

---

## 📖 Guia Rápido de Uso

### Passo 1 — Descubra as usinas disponíveis

```
GET /usinas
```

### Passo 2 — Veja os grupos e variáveis da usina

```
GET /grupos/CGH-APARECIDA
```

### Passo 3 — Consulte os dados

Use o **nome do grupo** (`POST /grupo-usina`) ou o **alias da variável** (`POST /sensor-usina`) retornados no passo anterior.

> **Formato de data obrigatório:** `DD/MM/YYYY HH:mm`

---

## 🔑 Conceitos Importantes

### Usinas com 1 UG vs 2 UGs

| Tipo      | Exemplo         | Comportamento                                                                   |
| :-------- | :-------------- | :------------------------------------------------------------------------------ |
| **1 UG**  | `CGH-APARECIDA` | Todas as variáveis retornam com prefixo `UG-01`                                 |
| **2 UGs** | `PCH-PEDRAS`    | As variáveis de cada UG vêm juntas na mesma resposta: `UG-01 ...` e `UG-02 ...` |

### Resolução Automática

O cliente envia apenas as datas. A API decide o intervalo de resample:

| Intervalo solicitado | Resolução aplicada   |
| :------------------- | :------------------- |
| ≤ 1 hora             | 1 min (dados brutos) |
| ≤ 1 dia              | 15 min               |
| > 1 dia              | 30 min               |

### Filtro de Outliers (IQR)

Valores fora de `[Q1 - 1.5×IQR, Q3 + 1.5×IQR]` são substituídos pelo último valor válido (`ffill`). Nenhum registro é removido. Grupos do tipo `status` não são filtrados.

---

## 📡 Endpoints

### `GET /usinas`

Lista todas as usinas configuradas.

**Resposta:**

```json
{
  "usinas_disponiveis": [
    { "codigo": "CGH-APARECIDA", "descricao": "CGH Aparecida - 1 UG" },
    { "codigo": "CGH-FAE", "descricao": "CGH FAE - 2 UGs" },
    { "codigo": "PCH-PEDRAS", "descricao": "PCH Pedras - 2 UGs" },
    { "codigo": "CGH-PICADAS-ALTAS", "descricao": "CGH Picadas Altas - 2 UGs" },
    { "codigo": "CGH-HOPPEN", "descricao": "CGH Hoppen - 2 UGs" }
  ]
}
```

---

### `GET /grupos/{usina}`

Retorna os grupos disponíveis e seus aliases. **Use os aliases retornados aqui como parâmetro nas consultas.**

#### Exemplo: Usina com 1 UG (`CGH-APARECIDA`)

```
GET /grupos/CGH-APARECIDA
```

```json
{
  "status": ["UG-01 Status"],
  "energia": ["UG-01 Energia Acumulada"],
  "eletrica": [
    "UG-01 Tensão Fase A",
    "UG-01 Tensão Fase B",
    "UG-01 Tensão Fase C",
    "UG-01 Corrente Fase A",
    "UG-01 Corrente Fase B",
    "UG-01 Corrente Fase C",
    "UG-01 Tensão Excitação",
    "UG-01 Corrente Excitação",
    "UG-01 Frequência"
  ],
  "potencia": [
    "UG-01 Potência Ativa",
    "UG-01 Potência Reativa",
    "UG-01 Potência Aparente",
    "UG-01 Fator de Potência"
  ],
  "mecanica": [
    "UG-01 Distribuidor",
    "UG-01 Velocidade",
    "UG-01 Posição Rotor",
    "UG-01 Horímetro"
  ],
  "hidraulica": ["Nível Montante", "Nível Jusante", "UG-01 Vazão Turbina"],
  "pressoes": ["UG-01 Pressão Óleo UHLM", "UG-01 Pressão Óleo UHRV"],
  "temperaturas": [
    "UG-01 Temp. Óleo UHLM",
    "UG-01 Temp. Óleo UHRV",
    "UG-01 Temp. Mancal Casquilho Combinado",
    "UG-01 Temp. Enrolamento Fase A",
    "..."
  ]
}
```

#### Exemplo: Usina com 2 UGs (`PCH-PEDRAS`)

```
GET /grupos/PCH-PEDRAS
```

```json
{
  "status": ["UG-01 Status", "UG-02 Status"],
  "energia": ["UG-01 Energia Acumulada", "UG-02 Energia Acumulada"],
  "potencia": [
    "UG-01 Potência Ativa",
    "UG-01 Potência Reativa",
    "UG-01 Potência Aparente",
    "UG-01 Fator de Potência",
    "UG-02 Potência Ativa",
    "UG-02 Potência Reativa",
    "UG-02 Potência Aparente",
    "UG-02 Fator de Potência"
  ],
  "mecanica": [
    "UG-01 Distribuidor",
    "UG-01 Rotor",
    "UG-01 Velocidade",
    "UG-01 Horímetro",
    "UG-02 Distribuidor",
    "UG-02 Rotor",
    "UG-02 Velocidade",
    "UG-02 Horímetro"
  ],
  "temperaturas": [
    "UG-01 Temp. Óleo UHLM",
    "UG-01 Temp. Enrolamento Fase A",
    "...",
    "UG-02 Temp. Óleo UHLM",
    "UG-02 Temp. Enrolamento Fase A",
    "..."
  ],
  "vibracao": [
    "UG-01 Vibração Eixo LA X",
    "UG-01 Vibração Eixo LA Y",
    "...",
    "UG-02 Vibração Eixo LA X",
    "UG-02 Vibração Eixo LA Y",
    "..."
  ]
}
```

> **Diferença principal:** Usinas com 2 UGs que possuem **tabelas separadas** (como `PCH-PEDRAS` → `pch_pedras_ug01` e `pch_pedras_ug02`) fazem merge automático dos dados por `data_hora` na resposta.

---

### `POST /sensor-usina`

Consulta o histórico de **uma única variável**.

#### Exemplo: 1 UG — Potência Ativa

**Request:**

```json
{
  "usina": "CGH-APARECIDA",
  "variavel": "UG-01 Potência Ativa",
  "data_inicio": "15/01/2026 08:00",
  "data_fim": "15/01/2026 09:00",
  "token": "seu_token"
}
```

**Response:** (intervalo ≤ 1h → resolução 1 min)

```json
{
  "usina": "CGH-APARECIDA",
  "variavel": "UG-01 Potência Ativa",
  "registros": 60,
  "dados": [
    { "data_hora": "2026-01-15T08:00:00", "UG-01 Potência Ativa": 125.4 },
    { "data_hora": "2026-01-15T08:01:00", "UG-01 Potência Ativa": 124.8 },
    { "data_hora": "2026-01-15T08:02:00", "UG-01 Potência Ativa": 126.1 },
    "..."
  ]
}
```

#### Exemplo: 2 UGs — Potência Ativa da UG-02

**Request:**

```json
{
  "usina": "PCH-PEDRAS",
  "variavel": "UG-02 Potência Ativa",
  "data_inicio": "15/01/2026 08:00",
  "data_fim": "15/01/2026 09:00",
  "token": "seu_token"
}
```

**Response:**

```json
{
  "usina": "PCH-PEDRAS",
  "variavel": "UG-02 Potência Ativa",
  "registros": 60,
  "dados": [
    { "data_hora": "2026-01-15T08:00:00", "UG-02 Potência Ativa": 310.2 },
    { "data_hora": "2026-01-15T08:01:00", "UG-02 Potência Ativa": 308.7 },
    "..."
  ]
}
```

> **Importante:** Para consultar a potência de ambas as UGs de uma vez, use `POST /grupo-usina` com `grupo: "potencia"`.

---

### `POST /grupo-usina`

Consulta **todas as variáveis de um grupo** de uma vez.

#### Exemplo: 1 UG — Grupo `potencia` (CGH-APARECIDA)

**Request:**

```json
{
  "usina": "CGH-APARECIDA",
  "grupo": "potencia",
  "data_inicio": "15/01/2026 00:00",
  "data_fim": "16/01/2026 00:00",
  "token": "seu_token"
}
```

**Response:** (intervalo = 1 dia → resolução 15 min)

```json
{
  "usina": "CGH-APARECIDA",
  "grupo": "potencia",
  "registros": 96,
  "dados": [
    {
      "data_hora": "2026-01-15T00:00:00",
      "UG-01 Potência Ativa": 120.5,
      "UG-01 Potência Reativa": 18.3,
      "UG-01 Potência Aparente": 121.9,
      "UG-01 Fator de Potência": 0.989
    },
    {
      "data_hora": "2026-01-15T00:15:00",
      "UG-01 Potência Ativa": 118.2,
      "UG-01 Potência Reativa": 17.9,
      "UG-01 Potência Aparente": 119.6,
      "UG-01 Fator de Potência": 0.988
    },
    "..."
  ]
}
```

#### Exemplo: 2 UGs — Grupo `potencia` (PCH-PEDRAS)

**Request:**

```json
{
  "usina": "PCH-PEDRAS",
  "grupo": "potencia",
  "data_inicio": "15/01/2026 00:00",
  "data_fim": "16/01/2026 00:00",
  "token": "seu_token"
}
```

**Response:** (dados das duas UGs na mesma linha temporal)

```json
{
  "usina": "PCH-PEDRAS",
  "grupo": "potencia",
  "registros": 96,
  "dados": [
    {
      "data_hora": "2026-01-15T00:00:00",
      "UG-01 Potência Ativa": 305.1,
      "UG-01 Potência Reativa": 42.3,
      "UG-01 Potência Aparente": 308.0,
      "UG-01 Fator de Potência": 0.991,
      "UG-02 Potência Ativa": 298.7,
      "UG-02 Potência Reativa": 39.8,
      "UG-02 Potência Aparente": 301.3,
      "UG-02 Fator de Potência": 0.991
    },
    {
      "data_hora": "2026-01-15T00:15:00",
      "UG-01 Potência Ativa": 302.4,
      "UG-01 Potência Reativa": 41.0,
      "UG-01 Potência Aparente": 305.2,
      "UG-01 Fator de Potência": 0.991,
      "UG-02 Potência Ativa": 300.1,
      "UG-02 Potência Reativa": 40.5,
      "UG-02 Potência Aparente": 302.8,
      "UG-02 Fator de Potência": 0.991
    },
    "..."
  ]
}
```

> **Observe:** Na `PCH-PEDRAS`, cada UG tem sua própria tabela no banco (`pch_pedras_ug01`, `pch_pedras_ug02`). A API faz o merge automaticamente por `data_hora` e retorna tudo unificado.

---

### `POST /tabela-usina`

Retorna **todas as colunas** de todas as tabelas da usina. Sem filtro de outliers, sem resample. Ideal para dump/auditoria.

**Request:**

```json
{
  "usina": "CGH-APARECIDA",
  "data_inicio": "15/01/2026 08:00",
  "data_fim": "15/01/2026 08:05",
  "token": "seu_token"
}
```

**Response:**

```json
{
  "usina": "CGH-APARECIDA",
  "registros": 5,
  "tabelas": ["cgh_aparecida"],
  "dados": [
    {
      "data_hora": "2026-01-15T08:00:00",
      "id": 12401,
      "status": 1,
      "potencia_ativa": 125.4,
      "tensao_fase_A": 4180.0,
      "nivel_montante": 512.3,
      "_tabela": "cgh_aparecida"
    },
    "..."
  ]
}
```

> **Nota:** Os nomes das colunas na resposta do `/tabela-usina` são os nomes **originais do banco** (sem aliases). Use os outros endpoints para obter os nomes amigáveis.

---

### `POST /producao-acumulada`

Calcula geração de energia por período.

**Request:**

```json
{
  "usina": "CGH-APARECIDA",
  "data_inicio": "01/01/2026 00:00",
  "data_fim": "03/01/2026 23:59",
  "periodo": "D",
  "token": "seu_token"
}
```

- `periodo`: `"H"` (Hora) · `"D"` (Dia) · `"M"` (Mês)

---

### `GET /health`

```json
{ "status": "operacional", "database": "conectado" }
```

---

## 📚 Referência de Grupos por Usina

| Grupo        | CGH-APARECIDA | CGH-FAE | PCH-PEDRAS | CGH-PICADAS-ALTAS | CGH-HOPPEN |
| :----------- | :-----------: | :-----: | :--------: | :---------------: | :--------: |
| status       |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| energia      |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| eletrica     |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| potencia     |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| mecanica     |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| hidraulica   |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| pressoes     |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| temperaturas |      ✅       |   ✅    |     ✅     |        ✅         |     ✅     |
| vibracao     |       —       |   ✅    |     ✅     |         —         |     —      |
| diversos     |       —       |    —    |     ✅     |        ✅         |     —      |

---

Sendo assim, preciso nesse primeiro momento projetar e abstrair as novas consultas para os dados históricos, e vc vai me ajudar a criar os prompts para a IDE antigravity para que possamos implementar as novas consultas no código, vamos fazer passo a passo, testar e implementar o próximo passo, perdi a manhã toda tentando algo mais geral, mas tive que recomeçar do zero, então vamos fazer devagar e com calma.
