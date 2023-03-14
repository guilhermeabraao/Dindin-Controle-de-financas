const { pool } = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../secret");

//Cadastro
const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const query = "select * from usuarios where email = $1";
        const { rowCount } = await pool.query(query, [email]);

        if (rowCount > 0) {
            return res.status(400).json("Já existe usuário cadastrado com o e-mail informado.");
        }
        const inserirQuery = "insert into usuarios (nome, email, senha) values ($1,$2,$3) returning *";

        const criarUsuario = await pool.query(inserirQuery, [nome, email, await criptografarSenha(senha)]);

        if (criarUsuario) {
            return res.status(200).json(
                (usuario = {
                    id: criarUsuario.rows[0].id,
                    nome: criarUsuario.rows[0].nome,
                    email: criarUsuario.rows[0].email,
                })
            );
        }
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
        const loginQuery = "select * from usuarios where email = $1";
        const usuario = await pool.query(loginQuery, [email]);

        if (usuario.rowCount === 0) {
            return res.status(400).json("Usuário e/ou senha inválido(s).");
        }

        const validarSenha = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!validarSenha) {
            return res.status(400).json("Senha inválida.");
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, secret, { expiresIn: "2h" });

        const { senha: _, ...registredUser } = usuario.rows[0];

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
        const query = "select * from usuarios where email = $1";
        const { rows, rowCount } = await pool.query(query, [email]);

        if (rowCount > 0 && rows[0].id !== id) {
            return res.status(400).json("Já existe usuário cadastrado com o e-mail informado.");
        }

        const putQuery = "update usuarios set nome = $1, email = $2, senha = $3 where id = $4 ";
        const idQuery = req.usuario.id;

        const { rowCount: updatedRows } = await pool.query(putQuery, [
            nome,
            email,
            await criptografarSenha(senha),
            idQuery,
        ]);

        return res.status(202).json("Usuário atualizado");
    } catch (error) {
        return res.status(500).json(error);
    }
};
//Listar Categorias
const listarCategorias = async (req, res) => {
    try {
        const resultado = await pool.query("select * from categorias");
        return res.json(resultado.rows);
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
                const { rows } = await pool.query(
                    `SELECT t.id, t.tipo, coalesce(t.descricao, 'sem descricao') as descricao, cast(t.valor as float), t.data_transacao as data, t.usuario_id, c.descricao AS categoria_nome FROM transacoes as t LEFT JOIN categorias as c ON c.id = t.categoria_id WHERE t.usuario_id = $1 and c.descricao = $2`,
                    [id, obj]
                );
                if (rows.length > 0) {
                    transacoes.push(...rows);
                }

            }

        } else {
            const { rows } = await pool.query(
                "SELECT t.id, t.tipo, coalesce(t.descricao, 'sem descricao') as descricao, cast(t.valor as float), t.data_transacao as data, t.usuario_id, c.descricao AS categoria_nome FROM transacoes as t LEFT JOIN categorias as c ON c.id = t.categoria_id WHERE t.usuario_id = $1",
                [id]
            );
            transacoes = rows;
        }

        return res.json(transacoes);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};
//Detalhar Transação
const detalharTransacoes = async (req, res) => {
    const usuario = req.usuario;
    const { id: transacao_id } = req.params;

    try {
        const query =
            "SELECT t.id, t.tipo, coalesce(t.descricao, 'sem descricao') as descricao, cast(t.valor as float), t.data_transacao as data, t.usuario_id, c.descricao AS categoria_nome FROM transacoes as t LEFT JOIN categorias as c ON c.id = t.categoria_id WHERE t.usuario_id = $1 AND t.id = $2";

        const resultado = await pool.query(query, [usuario.id, transacao_id]);

        return res.status(200).json(resultado.rows);
    } catch (error) {
        return res.status(400).json(error);
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
        const validarId =
            "insert into transacoes (tipo, descricao, valor, data_transacao, usuario_id, categoria_id) values ($1, $2, $3, $4, $5, $6) returning *";
        const validado = await pool.query(validarId, [tipo, descricao, valor, data, usuario_id, categoria_id]);

        const categoriaNome = await pool.query("select descricao from categorias where id = $1", [categoria_id]);

        if (validado.rowCount === 0) {
            return res.status(400).json("Categoria não existente");
        }

        return res.status(201).json({
            id: validado.rows[0].id,
            tipo,
            descricao,
            valor,
            data,
            usuario_id,
            categoria_id,
            categoria_nome: categoriaNome.rows[0].descricao,
        });
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
        const query = "select * from usuarios where id = $1";
        const { rowCount } = await pool.query(query, [id]);

        const queryId = req.params.id;


        if (rowCount < 1) {
            return res.status(400).json("Usuário não encontrado");
        }


        const putQuery =
            "update transacoes set descricao = $1, valor = $2, data_transacao = $3, categoria_id = $4, tipo = $5 where id = $6";

        const { rowCount: updatedRows } = await pool.query(putQuery, [
            descricao,
            valor,
            data,
            categoria_id,
            tipo,
            queryId,
        ]);

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
        const query = "select * from transacoes where id = $1 AND usuario_id=$2";
        const { rowCount } = await pool.query(query, [id, usuario_id]);
        const queryId = req.params.id;


        if (rowCount < 1) {
            return res.status(400).json({ "mensagem": "Transação não encontrada." });
        }

        const deleteQuery = "delete from transacoes where id = $1";
        const { rowCount: updatedRows } = await pool.query(deleteQuery, [queryId]);

        return res.status(202).json("Transação deletada");
    } catch (error) {
        return res.status(500).json(error.message);
    }
};
//Extrato transaçôes
const extratoTransacoes = async (req, res) => {
    const { id } = req.usuario;
    const transacoes = await pool.query("select * from transacoes where usuario_id=$1", [id]);

    const entrada = somarTransacoes(transacoes, "entrada");

    const saida = somarTransacoes(transacoes, "saida");

    return res.json({
        entrada,
        saida,
    });
};
const somarTransacoes = (transacoes, tipo) => {
    let soma = 0;

    transacoes.rows.find((transacao) => {
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
    detalharTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    extratoTransacoes
};
