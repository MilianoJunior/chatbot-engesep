index.js
    - Arquivo que executa e gerencia os serviços e tratamentos;
servicos/
    apiHistorico.js
        - Se conecta em um Endpoint online para buscar dados historicos das usinas.
    apiOpenai.js
        - Se conecta no modelo da Openai e obtem a resposta
    apiReadRT.js
        - Se conecta pela VPN em uma api CLPS em todas as usinas obtendo valores das variaveis em tempo real.
config/
    usinas.js
        - Dados de conexão para a apReadRT em tempo real e possibilita ver as configurações e usinas disponíveis.
    usuarios.js
        - Lista de usuarios e grupos permitidos

Planejamento;

Passo 1: modificar apenas o arquivo index.js chamar a api da Openai e imprimir a resposta se caso um usuario da lista de usuarios e o comando @leo foi executado, eu testo as alterações
Passo 2: modificar o arquivo index.js e os outros aquivos necessários para testar a resposta da api da Openai, para saber se ela entende, baseado no contexto, quando o usuario pede para acessar dados em tempo real e dados historicos, mandando o json para cada requisição ou não, para enviar sua reposta, alterei o aquirvo response.js para apenas imprimir o valor correto
Passo 3: Todas as respostas foram corretas, agora preciso retornar as repostas sem tratamento, requisitar para as duas apis: apiHistorico.js e apiReadRT.js e imprimir a resposta para ver se esta certo

