const express = require("express");
const {
    cadastrarUsuario,
    fazerLogin,
    atualizarUsuario,
    detalharUsuario,
    listarCategorias,
    listarTransacoes,
    detalharTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    extratoTransacoes
} = require("./controladores/usuario");

const autenticar = require("./autenticacao/autenticacao");
const roteador = express();

roteador.post('/usuario', cadastrarUsuario);
roteador.post('/login', fazerLogin);

roteador.use(autenticar);

roteador.get('/usuario', detalharUsuario);
roteador.put('/usuario', atualizarUsuario);
roteador.get('/categoria', listarCategorias);
roteador.get('/transacao', listarTransacoes);
roteador.get("/transacao/extrato", extratoTransacoes);
roteador.get('/transacao/:id', detalharTransacoes);
roteador.post('/transacao', cadastrarTransacao);
roteador.put('/transacao/:id', atualizarTransacao);
roteador.delete('/transacao/:id', deletarTransacao);
roteador.get("/transacao:filtro", listarTransacoes);

module.exports = roteador