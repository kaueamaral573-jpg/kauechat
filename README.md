# Chat com IA (LLM)

Aplicação web de chat que conversa com um modelo de linguagem (LLM), feita com HTML5, CSS3 e JavaScript puro. Toda a integração com a API acontece direto no navegador (client-side), usando `fetch()` e `async/await`, sem backend.

## Integrante

- Kaue Amaral Raffa

## API utilizada

- **Provedor:** Groq
- **Endpoint:** `https://api.groq.com/openai/v1/chat/completions` (formato compatível com Chat Completions)
- **Modelo:** `openai/gpt-oss-20b`

## Funcionalidades

- Interface semelhante a uma plataforma de chat
- Campo de texto com envio por botão ou pela tecla Enter (Shift + Enter quebra a linha)
- Balões distintos para o usuário, a IA e as mensagens de erro
- Histórico da conversa enviado a cada requisição, mantendo o contexto
- Indicador de carregamento enquanto a IA responde
- Tratamento de erros da API (chave inválida, limite de requisições, servidor fora do ar, falta de internet)
- Botão "Limpar chat" para iniciar uma nova conversa

## Estrutura do projeto

```
├── index.html   # estrutura da página
├── style.css    # identidade visual
├── script.js    # lógica do chat e chamada à API
├── config.js    # URL da API, chave e modelo
└── README.md
```

## Como executar

1. Baixe ou clone o projeto e mantenha todos os arquivos na mesma pasta.
2. Crie uma chave de API gratuita em [console.groq.com/keys](https://console.groq.com/keys).
3. Abra o arquivo `config.js` e coloque sua chave:

   ```js
   const API_URL = "https://api.groq.com/openai/v1/chat/completions";
   const API_KEY = "COLE_SUA_CHAVE_AQUI";
   const MODEL = "openai/gpt-oss-20b";
   ```

4. Abra o `index.html` no navegador (duplo clique) ou use a extensão Live Server do VS Code.
5. Digite uma mensagem e envie para conversar com a IA.

## Aviso de segurança

Como a chave de API fica no JavaScript do navegador, qualquer pessoa que abrir a página consegue vê-la. Por isso, use apenas chaves de teste e **não publique a chave real em repositórios públicos**.
