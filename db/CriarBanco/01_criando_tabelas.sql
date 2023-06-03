-- Criando a tabela pessoa
CREATE TABLE public.pessoa (
	id serial NOT NULL,
	nome varchar(255) NOT NULL,
	cpf varchar(14) NOT NULL,
	data_nascimento date NULL,
	casada bool NOT NULL DEFAULT FALSE,
	casada_com integer NULL,
	CONSTRAINT pessoa_id_pk PRIMARY KEY (id),
	constraint casada_pk foreign key (casada_com) references public.pessoa(id)
);

-- Criando a tabela Entidade
create table public.entidade(
	id serial NOT NULL,
	nome varchar(255) not null,
	razao varchar(255),
	cnpj varchar(18) not null,
	dono_id integer not null,
	
	CONSTRAINT entidade_id_pk PRIMARY KEY (id),
	CONSTRAINT dono_fk FOREIGN KEY (dono_id) REFERENCES public.pessoa(id) ON DELETE cascade
);

-- Criando a tabela telefones
CREATE TABLE public.telefones (
	id serial NOT NULL,
	telefone varchar(15) NOT NULL,
	pessoa_id integer null,
	entidade_id integer NULL,
	
	CONSTRAINT telefone_id_pk PRIMARY KEY (id),
	CONSTRAINT telefones_pessoa_fk FOREIGN KEY (pessoa_id) REFERENCES public.pessoa(id) ON DELETE cascade,
	CONSTRAINT telefones_entidade_fk FOREIGN KEY (entidade_id) REFERENCES public.entidade(id) ON DELETE cascade
);

-- Criando a tabela Municipio
create table public.municipio(
	id serial not null,
	nome varchar(128) not null,
	
	CONSTRAINT municipio_id_pk PRIMARY KEY (id)
	
);

-- Criando a tabela Dono
create table public.dono (
	id serial not null,
	pessoa_id integer null,
	entidade_id integer null,
	
	CONSTRAINT dono_id_pk PRIMARY KEY (id),
	CONSTRAINT pessoa_fk FOREIGN KEY (pessoa_id) REFERENCES public.pessoa(id) ON DELETE cascade,
	CONSTRAINT entidade_fk FOREIGN KEY (entidade_id) REFERENCES public.entidade(id) ON DELETE cascade,
	constraint pessoa_ou_entidade check (not (pessoa_id is not null and entidade_id is not null)) 
);

-- Criando a tabela Propriedade
create table public.propriedade (
	id serial not null,
	data_aquisicao date not null,
	area int not null,
	preco decimal not null,
	municipio_id integer not null,
	dono_id integer not null,
	
	CONSTRAINT propriedade_id_pk PRIMARY KEY (id),
	CONSTRAINT municipio_fk FOREIGN KEY (municipio_id) REFERENCES public.municipio(id) ON DELETE cascade,
	CONSTRAINT dono_fk FOREIGN KEY (dono_id) REFERENCES public.dono(id) ON DELETE cascade
);

-- Criando a tabela de Produto
create table public.produto (
	id serial not null,
	nome varchar(128) not null,
	data_provavel_colheita date not null,
	data_colheita_efetiva date not null,
	qtt_colher_prevista int not null,
	qtt_colhida int not null,
	
	CONSTRAINT produto_id_pk PRIMARY KEY (id)
);

create table public.propriedade_produto (
	id serial not null,
	propriedade_id integer not null,
	produto_id integer not null,
	
	CONSTRAINT propriedade_produto_id_pk PRIMARY KEY (id),
	CONSTRAINT propriedade_fk FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id) ON DELETE cascade,
	CONSTRAINT produto_fk FOREIGN KEY (produto_id) REFERENCES public.produto(id) ON DELETE cascade
);

-- Criação de índices
create index nome_municipio on municipio (nome);
create index telefone on telefones(telefone);
create index pessoa_idx on pessoa(nome, cpf);
create index entidade_idx on entidade(nome, razao, cnpj);
create index produdo_idx on produto(nome);