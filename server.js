const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Permitir que o Express use o body-parser para processar dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./frontend'));

app.get('/', (req, res) => {
    res.redirect('/telaPrincipal.html');
})

// Rota para processar os dados enviados do formulário
app.post('/cad_pessoa', (req, res) => {
    const form = req.body
    try{
        console.log(form);  // Imprime os dados do formulário no console
        const [ dia, mes, ano ] = form?.data?.split(/\//) || "";

        if(!form.cpf.match(/(\d{3}\.){2}\d{3}-\d{2}/)){
            throw new Error("O CPF deve ser no formato 000.000.000-00");
        }

        if(ano < 1900 || ano >= (new Date()).getFullYear() - 18){
            throw new Error(`O usuário não pode ter ${(new Date()).getFullYear() - parseInt(ano)} anos de idade`);
        }

        if(form.estado_civil === 'casado' && !form.conjuge){
            throw new Error(`O nome do conjugue de ${form.nome} precisa ser informado`);
        }

        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Usuário adicionado',
                success: `O usuário ${form.nome} foi adicionado com sucesso`,
                timer: 3200
            }))).toString()
        })()}`);
    }
    catch(e){
        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Algo deu errado',
                error: e.message,
                timer: 5000
            }))).toString()
        })()}`)
    }
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
