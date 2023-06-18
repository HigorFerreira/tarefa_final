#!/bin/bash

# Request the database information from the user
read -p "Insira o host do banco de dados: " host
read -p "Insira a porta do banco de dados: " port
read -p "Insira o nome de usuário do banco de dados: " user
read -p "Insira o nome da Database: " db
read -sp "Insira a senha do banco de dados: " password

# Define the environment variables
export NODE_ENV="development"
export DB_HOST="$host"
export DB_PORT="$port"
export DB_USER="$user"
export DB_PASSWORD="$password"
export DB_DATABASE="$db"

# Install dependencies
if [ -d "node_modules" ]
then
    echo -e "\nOs módulos estão instalados. Para reinstalar, delete a pasta node_modules"
else
    echo -e "\nInstalando módulos"
    npm install
fi

# Start the server
npx nodemon server.js
