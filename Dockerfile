# Escolha a imagem base do Node.js
FROM node:14

# Crie um diretório para abrigar o aplicativo
WORKDIR /usr/src/app

# Copie o package.json e o yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Instale as dependências do aplicativo
RUN yarn install

# Copie o resto dos arquivos do aplicativo
COPY . .

# Exponha a porta que a aplicação utilizará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "node", "server.js" ]