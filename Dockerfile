# Use uma imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo package.json e yarn.lock ou package-lock.json
COPY package*.json yarn.lock ./

# Instale as dependências
RUN yarn install

# Copie o restante do código para o contêiner
COPY . .

# Exponha a porta da aplicação
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["yarn", "start"]
