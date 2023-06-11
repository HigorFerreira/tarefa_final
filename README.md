# Trabalho final

> Higor Ferreira
    João Banczek
    Dayana Pamplona
    Daniel Guedes

# Instruções gerais

O projeto pode ser rodado de duas formas diferentes, com ou sem o uso de **Docker**.
Para rodar sem o uso de Docker será necessário utilizar um banco de dados **PostgreSQL**
devidamente configurado, bem como um **Gerenciador de Banco de Dados**, como
o **PgAdmin**, **DBeaver** ou outro qualquer.
Para rodar o projeto você pode fazê-lo através do docker ou recriando o banco
de dados e rodando a aplicação em nodejs. Recomendamos que apenas instale o Docker
clicando [aqui](https://www.docker.com/) e siga as instruções **Rodando em Docker**


# Rodando em Docker

1. Abra o powershell ou cmd em sua máquina windows e navegue até a pasta do projeto.
2. Rode o comando:
```powershell
docker build -t tarefa_app:latest .
```
3. Rode o comando:
```powershell
docker compose up -d
```
4. Abra seu navegador e acesse **localhost**

# Rodando sem Docker

1. Copie os scripts em **./db/CriarBanco** e cole em seu *Gerenciador de banco de dados*
de preferência para criar o banco de dados

2. Caso não tenha, baixe e instale o **NodeJS** clicando neste [link](https://nodejs.org/en).

3. Abra o **PowerShell** do Windows em modo administrador e rode o seguinte comando:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

4. Inicie o **PowerShell** do Windows a partir da pasta raiz do projeto. Ou inicie normalmente
e navegue até a pasta

5. A partir da pasta raiz do projeto, rode o script:
```powershell
.\start.ps1
```

O escript então pedirá alguns dados para se conectar ao banco:

Em **Insira o host do banco de dados**, digite **localhost** ou o ip da máquina em que seu banco
está rodando.
Em **Insira a porta do banco de dados**, digite a porta **5432** ou a porta em que seu banco está rodando.
Em **Insira o nome de usuário do banco de dados**, digite **postgres** ou qualquer outro usuário que fora previamente
configurado.
Em **Insira o nome da Database**, digite **postgres** ou qualquer outro db que tenha sido configurado.
Em **Insira a senha do banco de dados**, digite sua senha.

O script então instalará as dependências necessárias para rodar o projeto e quando iniciar a aplicação
a seguinte mensagem será exibida: **Servidor rodando na porta 3000**. Basta abrir o navegador de sua
preferência e digitar **localhost:3000** para acessá-la

