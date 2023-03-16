const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../secret");

//Cadastro
const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        const verificarEmail = await knex("usuarios").where({ email });

        if (verificarEmail.length > 0) {
            return res.status(400).json("Já existe usuário cadastrado com o e-mail informado.");
        }

        const senhaCriptografada = await criptografarSenha(senha);
        await knex("usuarios").insert({ nome, email, senha: senhaCriptografada });

        return res.status(200).json()

    } catch (error) {
        return res.status(500).json(error.message);
    }
};
//Login
const fazerLogin = async (req, res) => {
    const { email, senha } = req.body;


    if (!email || !senha) {
        return res.status(400).json("Todos os campos são obrigatórios");
    }
    try {

        const usuario = await knex("usuarios").where({ email }).first();

        if (usuario.length > 0) {
            return res.status(400).json("Usuário e/ou senha inválido(s).");
        }

        const validarSenha = await bcrypt.compare(senha, usuario.senha);

        if (!validarSenha) {
            return res.status(400).json("Senha inválida.");
        }

        const token = jwt.sign({ id: usuario.id }, secret, { expiresIn: "2h" });

        const { senha: _, ...registredUser } = usuario;

        return res.status(200).json({
            usuario: registredUser,
            token,
        });
    } catch (error) {
        return res.status(500).json("error");
    }
};
const criptografarSenha = async (senha) => {
    return await bcrypt.hash(senha, 10);
};
//Detalhar Usuário
const detalharUsuario = async (req, res) => {
    return res.json(req.usuario);
};
//Atualizar Usuário
const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    if (!nome || !email || !senha) {
        return res.status(400).json("Todos os campos são obrigatórios");
    }
    try {
        const verificarUsuario = await knex("usuarios").where({ email }).first();

        if (verificarUsuario.length > 0 && verificarUsuario.id !== id) {
            return res.status(400).json("Já existe usuário cadastrado com o e-mail informado.");
        }

        const senhaCriptografada = await criptografarSenha(senha)

        await knex("usuarios").where({ id }).update({ nome, email, senha: senhaCriptografada });

        return res.status(202).json("Usuário atualizado");
    } catch (error) {
        return res.status(500).json(error);
    }
};
//Listar Categorias
const listarCategorias = async (req, res) => {
    try {
        const resultado = await knex("categorias");
        return res.json(resultado);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};
//Listar Transações
const listarTransacoes = async (req, res) => {
    const { id } = req.usuario;
    const { filtro } = req.query;
    try {
        let transacoes = [];
        if (filtro) {
            for (let obj of filtro) {
                const resultado = await knex.select("t.id", "t.tipo", "t.descricao as descricao", "t.valor", "t.data_transacao as data", "t.usuario_id", "c.descricao AS categoria_nome")
                    .from("transacoes as t")
                    .where({ usuario_id: parseInt(id) }).leftJoin("categorias as c", "c.id", "=", "t.categoria_id")
                    .where("t.descricao", obj)

                if (resultado.length > 0) {
                    transacoes.push(...resultado);
                }

            }

        } else {
            const resultado = await knex.select("t.id", "t.tipo", "t.descricao as descricao", "t.valor", "t.data_transacao as data", "t.usuario_id", "c.descricao AS categoria_nome")
                .from("transacoes as t")
                .where({ usuario_id: parseInt(id) }).leftJoin("categorias as c", "c.id", "=", "t.categoria_id")

            transacoes = resultado;
        }

        return res.json(transacoes);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

//Cadastrar Transação
const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const { id: usuario_id } = req.usuario;

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json("Todos os campos são obrigatórios");
    }

    try {
        await knex("transacoes").insert({ tipo, descricao, valor, data_transacao: data, usuario_id, categoria_id });

        return res.status(201).json();
    } catch (error) {
        return res.status(500).json(error.message);
    }
};
//Atualizar Transaçâo
const atualizarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id } = req.usuario;
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json("Todos os campos são obrigatórios");
    }
    try {
        const localizarUsuario = await knex("usuarios").where({ id });

        if (localizarUsuario.length < 1) {
            return res.status(400).json("Usuário não encontrado");
        }

        await knex("transacoes").where({ id: req.params.id }).update({ descricao, valor, data_transacao: data, categoria_id, tipo });

        return res.status(202).json("Transação atualizada");
    } catch (error) {
        return res.status(500).json(error.message);
    }
};
//Deletar Transação
const deletarTransacao = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.usuario.id
    try {
        const localizarTransacao = await knex("transacoes").where({ id }).andWhere({ usuario_id });

        if (localizarTransacao.length < 1) {
            return res.status(400).json({ "mensagem": "Transação não encontrada." });
        }

        await knex("transacoes").where({ id }).del();

        return res.status(202).json("Transação deletada");
    } catch (error) {
        return res.status(500).json(error.message);
    }
};
//Extrato transaçôes
const extratoTransacoes = async (req, res) => {
    const { id } = req.usuario;
    const transacoes = await knex("transacoes").where({ usuario_id: id });

    const entrada = somarTransacoes(transacoes, "entrada");

    const saida = somarTransacoes(transacoes, "saida");

    return res.json({
        entrada,
        saida,
    });
};
const somarTransacoes = (transacoes, tipo) => {
    let soma = 0;

    transacoes.find((transacao) => {
        if (transacao.tipo === tipo) {
            soma += Number(transacao.valor);
        }
    });
    return soma;
};


module.exports = {
    cadastrarUsuario,
    fazerLogin,
    atualizarUsuario,
    detalharUsuario,
    listarCategorias,
    listarTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    extratoTransacoes
};
