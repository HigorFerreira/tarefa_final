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

Para rodar o trabalho sem o uso do **Docker**, você pode copiar os scripts em
./db/CriarBanco e colocar em seu Gerenciador de Banco de Dados.
O aplicativo roda tendo como base o nodejs, o node pode ser instalado neste
[link](https://nodejs.org/en). Após instalar o node, rode o script **start.ps1** e
siga as instruções. Caso houver algum problema com a execução de escript, rode
o script **correctScript.ps1** como administrador, e depois rode novamente
**start.ps1**.