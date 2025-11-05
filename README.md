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



