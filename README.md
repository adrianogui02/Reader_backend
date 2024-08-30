# Reader API

Bem-vindo à Reader API. Este projeto é uma API desenvolvida para gerenciar leituras de medidores de água e gás. A API está configurada para rodar em um ambiente Dockerizado.


## Instalação

Para configurar e rodar a **Reader API**, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (geralmente incluído com o Node.js)
- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)
- [MongoDB](https://www.mongodb.com/)

### Passo a Passo

1. **Clone o repositório**

   Clone o repositório da API para seu ambiente local:

   ```bash
   git clone https://github.com/adrianogui02/Reader_backend.git
   ```

1. **Navegue até o diretório do projeto**

   Entre no diretório do projeto clonado:

   ```bash
   cd Reader_backend
   ```

1. **Configuração do Ambiente**

   Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

   ```bash
    MONGO_USER=user
    MONGO_PASS=pass
    MONGO_DB=Reader
    MONGO_HOST=mongodb
    PORT=3000
    NODE_ENV=development
    IMGUR_CLIENT_ID=your_imgur_client_id
    GEMINI_API_KEY=your_gemini_api_key
   ```

1. **Usando Docker**

   Você pode seguir os passos abaixo para configurar e rodar a API usando Docker e Docker Compose:

   - Construa e Inicie os containers:

     ```bash
     docker-compose up -d --build
     ```

     Isso irá iniciar o serviço da API na porta 3000 e o MongoDB na porta 27017.

   - Verifique os logs dos containers::

     ```bash
     docker-compose logs -f
     ```

     Verifique se não há erros na inicialização e que a API está conectada ao banco de dados.



## Autores

[@adrianogui02](https://github.com/adrianogui02)

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
