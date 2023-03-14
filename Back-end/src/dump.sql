create database
  dindin;

create table
  "usuarios" (
    id serial primary key,
    nome text not null,
    email text unique not null,
    senha text not null
  );

create table
  "categorias" (id serial primary key, descricao text);

insert into
  categorias (descricao)
values
  ('Assinaturas e Serviços'),('Casa'),('Mercado'),
  ('Cuidados Pessoais'),('Educação'),('Família'),
  ('Lazer'),('Pets'),('Presentes'),('Roupas'),
  ('Saúde'),('Transporte'),('Salário'),('Vendas'),
  ('Outras receitas'),('Outras despesas');
  
CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
      descricao VARCHAR(30),
      valor NUMERIC CHECK (valor > 0) NOT NULL,
      data_transacao DATE DEFAULT now(),
      categoria_id INTEGER REFERENCES categorias(id),
      usuario_id INTEGER REFERENCES usuarios(id),
      tipo VARCHAR(40) NOT NULL
);
  
  select * from categorias
  
  insert into transacoes (descricao, valor, data_transacao, categoria_id, usuario_id, tipo)
  values ('Sapato Amarelo', '20000', '2002-05-1', '10','32','Presente Natal');
  
 SELECT t.id, t.tipo, t.descricao, CAST(t.valor AS FLOAT), t.data_transacao AS data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome
                 FROM transacoes t
                 LEFT JOIN categorias c ON c.id = t.categoria_id
                 WHERE t.usuario_id = $1
                 
