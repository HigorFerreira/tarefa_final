const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Permitir que o Express use o body-parser para processar dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para exibir o formulário HTML (substitua 'form.html' pelo caminho para o seu arquivo HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/atividade.html'));
});

// Rota para processar os dados enviados do formulário
app.post('/submit', (req, res) => {
    console.log(req.body);  // Imprime os dados do formulário no console
    res.send('Dados recebidos.');
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
