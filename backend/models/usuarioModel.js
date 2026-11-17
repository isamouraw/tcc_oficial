
const conexao = require("../database/conexao");

const UsuarioModel = {

    // CADASTRO COM CÓDIGO DE VERIFICAÇÃO
    cadastrarComVerificacao: (nome, email, senha, codigo, expiracao, callback) => {

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha, codigo_verificacao, codigo_expiracao, email_verificado)
            VALUES (?, ?, ?, ?, ?, 0)
        `;

        conexao.query(
            sql,
            [nome, email, senha, codigo, expiracao],
            callback
        );
    },


    // LOGIN
    login: (email, senha, callback) => {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE email = ?
            AND senha = ?
        `;

        conexao.query(sql, [email, senha], callback);
    },


    // CONFIRMAR E-MAIL
    verificarCodigo: (email, codigo, callback) => {

        const sql = `
            UPDATE usuarios
            SET
                email_verificado = 1,
                codigo_verificacao = NULL,
                codigo_expiracao = NULL
            WHERE email = ?
            AND codigo_verificacao = ?
            AND codigo_expiracao > NOW()
            AND email_verificado = 0
        `;

        conexao.query(sql, [email, codigo], callback);
    },


    // EDITAR PERFIL
    editarPerfil: (id, nome, email, callback) => {

        const sql = `
            UPDATE usuarios
            SET nome = ?, email = ?
            WHERE id = ?
        `;

        conexao.query(sql, [nome, email, id], callback);
    },


    // ALTERAR SENHA
    alterarSenha: (id, senha, callback) => {

        const sql = `
            UPDATE usuarios
            SET senha = ?
            WHERE id = ?
        `;

        conexao.query(sql, [senha, id], callback);
    },


    // BUSCAR USUÁRIO
    buscarPorId: (id, callback) => {

        const sql = `
            SELECT id, nome, email, foto_perfil
            FROM usuarios
            WHERE id = ?
        `;

        conexao.query(sql, [id], callback);
    },


    // ATUALIZAR FOTO DE PERFIL
    atualizarFoto: (id, foto_perfil, callback) => {

        const sql = `
            UPDATE usuarios
            SET foto_perfil = ?
            WHERE id = ?
        `;

        conexao.query(sql, [foto_perfil, id], callback);
    }

};

module.exports = UsuarioModel;
