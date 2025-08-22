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
- **Relatórios Temporais**: Análises de tendências
- **Comparativos**: Dados entre diferentes períodos

### 🤖 **Chat Inteligente**
- **Perguntas Naturais**: Use linguagem comum
- **Contexto**: O bot lembra das conversas anteriores
- **Interpretação Automática**: Compreende diferentes formas de perguntar

---

## 🏭 Usinas Disponíveis

| Usina | Tipo | Potência Máxima |
|-------|------|-----------------|
| **CGH-APARECIDA** | CGH | 3.350 MW |
| **CGH-FAE** | CGH | 1.350 MW (UG-01) + 650 MW (UG-02) |
| **PCH-PEDRAS** | PCH | 2.800 MW (UG-01 + UG-02) |
| **CGH-PICADAS-ALTAS** | CGH | 300 MW (UG-01) + 700 MW (UG-02) |
| **CGH-HOPPEN** | CGH | 1.300 MW (UG-01 + UG-02) |

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
*Mostra todos os usuários autorizados e suas permissões*

### **Ajuda**
```
@leo: ajuda
```
*Exibe informações sobre como usar o bot*

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

| Termo | Definição |
|-------|-----------|
| **UG** | Unidade Geradora |
| **CGH** | Central Geradora Hidrelétrica |
| **PCH** | Pequena Central Hidrelétrica |
| **Potência Ativa** | Potência real fornecida ao sistema |
| **Montante** | Lado superior da barragem |
| **Jusante** | Lado inferior da barragem |
| **U.H.R.V.** | Unidade Hidráulica de Regulação de Vazão |
| **U.H.L.M.** | Unidade Hidráulica de Limpeza de Máquina |

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

*Última atualização: Agosto 2025*
