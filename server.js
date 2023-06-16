const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.NODE_ENV === 'development' ? process.env.DB_HOST ? process.env.DB_HOST : 'localhost' : 'db',
        port: process.env.NODE_ENV === 'development' ? process.env.DB_PORT ? process.env.DB_PORT : 2424 : 5432,
        user: process.env.DB_USER ? process.env.DB_USER : 'postgres',
        database: process.env.NODE_ENV === 'development' ? process.env.DB_DATABASE ? process.env.DB_DATABASE : 'postgres' : 'postgres',
        password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'tarefa'
    }
});

// Permitir que o Express use o body-parser para processar dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./frontend'));

app.get('/test', (req, res) => {
    knex.raw(`
        SELECT * FROM pessoa;
    `, { id: 'Higor' }).then(({ rows }) => rows).then(res => {
        console.log(res);
    })
    res.json({ message: 'OK' });
})

app.get('/', (req, res) => {
    res.redirect('/telaPrincipal.html');
})

app.get('/find_dono_entidade', async (req, res) => {
    if(!req.query.q) return res.status(400);
    return res.json({
        results: await knex.raw(`
        select
            e.dono_id as id,
            e.razao as text
        from entidade e where e.razao ilike '%${req.query.q}%'
        `).then(({rows}) => rows)
    })
});

app.get('/find_dono', async (req, res) => {
    if(!req.query.q){
        return {
            results: await knex.raw("select id, nome as text from pessoa")
                .then(({rows}) => rows)
        }
    }
    const results = await knex.raw("select id, nome as text from pessoa p where nome ilike '%"+req.query.q+"%'")
        .then(({rows}) => rows);
    res.json({
        results
    })
});

app.get('/find_municipio', async (req, res) => {
    const results = await knex.raw("select id, nome as text from municipio where nome ilike '%"+req.query.q+"%'")
        .then(({rows}) => rows);
    res.json({
        results
    })
});

app.get('/find_propriedade', async (req, res) => {
    const results = await knex.raw("select id, nome as text from propriedade where nome ilike '%"+req.query.q+"%'")
        .then(({rows}) => rows);
    res.json({
        results
    })
});

// Rota para processar os dados enviados do formulário
app.post('/cad_pessoa', async (req, res) => {
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

        if(form.estado_civil == 'solteiro'){
            const inserted = await knex.raw(
                `
                INSERT INTO pessoa(nome, cpf, casada, data_nascimento)
                VALUES(:nome, :cpf, FALSE, :data);
                `,
                {
                    ...form,
                    data: (() => {
                        const [ day, month, year ] = form.data.split(/\//g);
                        return`${year}-${month}-${day}`;
                    })()
                }
            )

            console.log(inserted);
        }
        else{
            await knex.raw(
                `
                WITH conjugue AS (
                    INSERT INTO pessoa (nome, cpf, casada)
                    VALUES(:conjuge, :cpf_conjugue, FALSE)
                    RETURNING id
                ),
                pessoa AS (
                    INSERT INTO pessoa (nome, cpf, data_nascimento, casada, casada_com)
                    VALUES(:nome, :cpf, :data, TRUE, (SELECT id FROM conjugue))
                    RETURNING id
                )
                UPDATE pessoa
                SET casada = TRUE, casada_com = (SELECT id FROM pessoa)
                WHERE id = (SELECT id FROM conjugue)
                RETURNING *
                `,
                {
                    ...form,
                    data: (() => {
                        const [ day, month, year ] = form.data.split(/\//g);
                        return`${year}-${month}-${day}`;
                    })()
                }
            ).then(r => console.log(r));
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
        console.error(e);
        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Algo deu errado',
                error: e.message,
                timer: 5000
            }))).toString()
        })()}`)
    }
});

app.post('/cad_propriedade', async (req, res) => {
    try{
        const {
            nome,
            dono,
            data: data_aquisicao,
            area,
            municipio: municipio_id,
            preco,
        } = req.body

        console.log(req.body)

        return res.send("OK")

        await knex("dono").insert({
            pessoa_id: parseInt(dono)
        })
        .returning('id')
        .then(([{ id: dono_id }]) => {
            return knex("propriedade")
                .insert({
                    nome,
                    dono_id,
                    data_aquisicao,
                    area,
                    preco,
                    municipio_id: parseInt(municipio_id)
                })
        })

        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Propriedade adicionada',
                success: `Propriedade ${nome} adicionada com sucesso`,
                timer: 3200
            }))).toString()
        })()}`);
    }
    catch(e){
        console.error(e);
        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Algo deu errado',
                error: e.message,
                timer: 5000
            }))).toString()
        })()}`)
    }
});

app.post('/cad_produto', async (req, res) => {
    try{
        const {
            nome,
            data_provavel_colheita,
            data_colheita_efetiva,
            qtt_colher_prevista,
            qtt_colhida,
            propriedade,
        } = req.body

        await knex("produto")
            .insert({
                nome,
                data_colheita_efetiva,
                data_provavel_colheita,
                qtt_colher_prevista,
                qtt_colhida
            })
            .returning('id')
            .then(([ { id: produto_id } ]) => {
                return knex("propriedade_produto")
                    .insert({
                        produto_id,
                        propriedade_id: parseInt(propriedade)
                    })
            })

        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Produto adicionado',
                success: `Produto ${nome} adicionado com sucesso`,
                timer: 3200
            }))).toString()
        })()}`);
    }
    catch(e){
        console.log(e);

        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Algo deu errado',
                error: e.message,
                timer: 5000
            }))).toString()
        })()}`)
    }
});

app.post('/cad_entidade', async (req, res) => {
    try{
        const {
            nome,
            razao,
            dono_id,
            cnpj
        } = req.body

        if(!cnpj.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)){
            throw new Error("O CNPJ deve ter o formato XX.XXX.XXX/0001-XX")
        }

        // console.log(req.body);

        await knex("entidade")
            .insert({
                nome,
                razao,
                dono_id,
                cnpj
            })
            .returning('id')
            .then(([ { id: entidade_id } ]) => {
                return knex("dono")
                    .insert({
                        entidade_id
                    })
            })

        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Entidade adicionada',
                success: `Entidade adicionada com sucesso`,
                timer: 3200
            }))).toString()
        })()}`);
    }
    catch(e){
        console.log(e);

        res.redirect(`/telaPrincipal.html?${(() => {
            return (new URLSearchParams(Object.entries({
                title: 'Algo deu errado',
                error: e.message,
                timer: 5000
            }))).toString()
        })()}`)
    }
});

app.get('/pessoas', async (req, res) => {
    try {
        const pessoas = await knex.raw(`
        select
            p.id,
            p.nome,
            p.cpf,
            p.data_nascimento,
            p.casada,
            p2.nome as conjuge,
            p2.cpf as conjuge_cpf
        from pessoa p
        left join pessoa p2
        on p.casada_com = p2.id 
        `).then(({ rows }) => rows);
        return res.json(pessoas)
    }
    catch(e){
        return res.redirect(`/telaPrincipal.html?${(() => {
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
