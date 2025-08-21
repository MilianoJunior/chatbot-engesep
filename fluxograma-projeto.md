# Estados e Transições do Sistema

```mermaid
stateDiagram-v2
    [*] --> 1_Inicializado
    
    1_Inicializado --> 2_AguardandoQR: 1.Iniciar bot
    2_AguardandoQR --> 3_Conectado: 2.QR escaneado
    3_Conectado --> 4_AguardandoMensagem: 3.WhatsApp conectado
    
    4_AguardandoMensagem --> 5_ProcessandoMensagem: 4.Mensagem recebida
    5_ProcessandoMensagem --> 6_VerificandoUsuario: 5.Extrair @leo
    
    6_VerificandoUsuario --> 7_UsuarioNaoAutorizado: 6a.Usuário inválido
    6_VerificandoUsuario --> 8_ProcessandoComando: 6b.Usuário válido
    
    7_UsuarioNaoAutorizado --> 4_AguardandoMensagem: 7.Ignorar mensagem
    
    8_ProcessandoComando --> 9_ConsultandoOpenAI: 8.Enviar para IA
    9_ConsultandoOpenAI --> 10_ProcessandoResposta: 9.Resposta recebida
    
    10_ProcessandoResposta --> 11_ConsultandoAPI: 10a.Comando JSON detectado
    10_ProcessandoResposta --> 15_EnviandoResposta: 10b.Resposta direta
    
    11_ConsultandoAPI --> 12_APIHistorico: 11a.Comando "historico"
    11_ConsultandoAPI --> 13_APITempoReal: 11b.Comando "leitura"
    
    12_APIHistorico --> 14_FormatandoResposta: 12.Dados recebidos
    13_APITempoReal --> 14_FormatandoResposta: 13.Dados recebidos
    
    14_FormatandoResposta --> 15_EnviandoResposta: 14.Resposta formatada
    15_EnviandoResposta --> 4_AguardandoMensagem: 15.Resposta enviada
    
    3_Conectado --> 17_Reconectando: 15.Desconexão detectada
    17_Reconectando --> 2_AguardandoQR: 16.Tentar reconectar
```
##
```mermaid
stateDiagram-v2
    [*] --> 1_Inicializado
    
    1_Inicializado --> 2_AguardandoQR: 1.Iniciar bot
    2_AguardandoQR --> 3_Conectado: 2.QR escaneado
    3_Conectado --> 4_AguardandoMensagem: 3.WhatsApp conectado
    
    4_AguardandoMensagem --> 5_ProcessandoMensagem: 4.Mensagem recebida
    5_ProcessandoMensagem --> 6_VerificandoUsuario: 5.Extrair @leo
    
    6_VerificandoUsuario --> 7_UsuarioNaoAutorizado: 6a.Usuário inválido
    6_VerificandoUsuario --> 8_RecuperandoHistorico: 6b.Usuário válido
    
    7_UsuarioNaoAutorizado --> 4_AguardandoMensagem: 7.Ignorar mensagem
    
    8_RecuperandoHistorico --> 9_PreparandoContexto: 8.Buscar últimas 5 perguntas
    9_PreparandoContexto --> 10_ConsultandoOpenAI: 9.Contexto com histórico
    10_ConsultandoOpenAI --> 11_ProcessandoResposta: 10.Resposta recebida
    
    11_ProcessandoResposta --> 12_ConsultandoAPI: 11a.Comando JSON detectado
    11_ProcessandoResposta --> 16_ArmazenandoHistorico: 11b.Resposta direta
    
    12_ConsultandoAPI --> 13_APIHistorico: 12a.Comando "historico"
    12_ConsultandoAPI --> 14_APITempoReal: 12b.Comando "leitura"
    
    13_APIHistorico --> 15_FormatandoResposta: 13.Dados recebidos
    14_APITempoReal --> 15_FormatandoResposta: 14.Dados recebidos
    
    15_FormatandoResposta --> 16_ArmazenandoHistorico: 15.Resposta formatada
    16_ArmazenandoHistorico --> 17_EnviandoResposta: 16.Pergunta+Resposta salvas
    17_EnviandoResposta --> 4_AguardandoMensagem: 17.Resposta enviada
    
    3_Conectado --> 18_Reconectando: 18.Desconexão detectada
    18_Reconectando --> 2_AguardandoQR: 19.Tentar reconectar
    
    state 8_RecuperandoHistorico {
        [*] --> VerificandoCache
        VerificandoCache --> HistoricoEncontrado: Cache existe
        VerificandoCache --> NovoHistorico: Primeiro acesso
        HistoricoEncontrado --> [*]: Retornar histórico
        NovoHistorico --> [*]: Criar novo Map
    }
    
    state 16_ArmazenandoHistorico {
        [*] --> AdicionandoPergunta
        AdicionandoPergunta --> LimitandoTamanho: Adicionar ao Map
        LimitandoTamanho --> RemoverAntiga: > 5 perguntas
        LimitandoTamanho --> Manter: <= 5 perguntas
        RemoverAntiga --> [*]: Shift() + salvar
        Manter --> [*]: Apenas salvar
    }
```
## claude
```mermaid
stateDiagram-v2
    [*] --> 1_Inicializado
    
    1_Inicializado --> 2_AguardandoQR: 1.Iniciar bot
    2_AguardandoQR --> 3_Conectado: 2.QR escaneado
    3_Conectado --> 4_AguardandoMensagem: 3.WhatsApp conectado
    
    4_AguardandoMensagem --> 5_ProcessandoMensagem: 4.Mensagem recebida
    5_ProcessandoMensagem --> 6_VerificandoUsuario: 5.Extrair @leo
    
    6_VerificandoUsuario --> 7_UsuarioNaoAutorizado: 6a.Usuário inválido
    6_VerificandoUsuario --> 8_RecuperandoHistorico: 6b.Usuário válido
    
    7_UsuarioNaoAutorizado --> 4_AguardandoMensagem: 7.Ignorar mensagem
    
    8_RecuperandoHistorico --> 9_PreparandoContexto: 8.Buscar últimas 5 interações
    9_PreparandoContexto --> 10_ConsultandoOpenAI: 9.Contexto com histórico
    10_ConsultandoOpenAI --> 11_ArmazenandoRespostaIA: 10.Resposta recebida
    
    11_ArmazenandoRespostaIA --> 12_ProcessandoResposta: 11.Salvar resposta OpenAI
    
    12_ProcessandoResposta --> 13_ConsultandoAPI: 12a.Comando JSON detectado
    12_ProcessandoResposta --> 17_FormatandoResposta: 12b.Resposta direta
    
    13_ConsultandoAPI --> 14_APIHistorico: 13a.Comando "historico"
    13_ConsultandoAPI --> 15_APITempoReal: 13b.Comando "leitura"
    
    14_APIHistorico --> 16_ArmazenandoDadosAPI: 14.Dados recebidos
    15_APITempoReal --> 16_ArmazenandoDadosAPI: 15.Dados recebidos
    
    16_ArmazenandoDadosAPI --> 17_FormatandoResposta: 16.Dados API salvos
    17_FormatandoResposta --> 18_EnviandoResposta: 17.Resposta formatada
    18_EnviandoResposta --> 4_AguardandoMensagem: 18.Resposta enviada
    
    3_Conectado --> 19_Reconectando: 19.Desconexão detectada
    19_Reconectando --> 2_AguardandoQR: 20.Tentar reconectar

```
## Legenda dos Estados Numerados

| Nº | Estado | Descrição | Log no Código |
|---------|------------|----------------|-------------------|
| **1** | `Inicializado` | Bot iniciado e carregando | `[ESTADO 1] Inicializado` |
| **2** | `AguardandoQR` | Gerando QR Code para conexão | `[ESTADO 2] AguardandoQR` |
| **3** | `Conectado` | WhatsApp conectado com sucesso | `[ESTADO 3] Conectado` |
| **4** | `AguardandoMensagem` | Aguardando mensagens dos usuários | `[ESTADO 4] AguardandoMensagem` |
| **5** | `ProcessandoMensagem` | Mensagem recebida, iniciando processamento | `[ESTADO 5] ProcessandoMensagem` |
| **6** | `VerificandoUsuario` | Verificando se usuário está autorizado | `[ESTADO 6] VerificandoUsuario` |
| **7** | `UsuarioNaoAutorizado` | Usuário não autorizado ou sem @leo | `[ESTADO 7] UsuarioNaoAutorizado` |
| **8** | `ProcessandoComando` | Processando pergunta do usuário | `[ESTADO 8] ProcessandoComando` |
| **9** | `ConsultandoOpenAI` | Enviando pergunta para IA | `[ESTADO 9] ConsultandoOpenAI` |
| **10** | `ProcessandoResposta` | Resposta OpenAI recebida | `[ESTADO 10] ProcessandoResposta` |
| **11** | `ConsultandoAPI` | Comando JSON detectado | `[ESTADO 11] ConsultandoAPI` |
| **12** | `APIHistorico` | Consultando API de dados históricos | `[ESTADO 12] APIHistorico` |
| **13** | `APITempoReal` | Consultando API de dados em tempo real | `[ESTADO 13] APITempoReal` |
| **14** | `FormatandoResposta` | Formatando resposta para envio | `[ESTADO 14] FormatandoResposta` |
| **15** | `EnviandoResposta` | Enviando resposta para WhatsApp | `[ESTADO 15] EnviandoResposta` |


## Fluxos Principais

- **Fluxo Resposta Direta**: 1 → 2 → 3 → 4 → 5 → 6 → 8 → 9 → 10 → 15
- **Fluxo Resposta API Histórico**: 1 → 2 → 3 → 4 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 14 → 15
- **Fluxo Resposta API Real-Time**: 1 → 2 → 3 → 4 → 5 → 6 → 8 → 9 → 10 → 11 → 13 → 14 → 15

## Prompts

Gravar emojis no historico de contexto, 
