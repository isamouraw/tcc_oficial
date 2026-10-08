const conexao = require("../database/conexao");

const UsuarioModel = {

    cadastrar: (nome, email, senha, callback) => {

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        conexao.query(
            sql,
            [nome, email, senha],
            callback
        );
    },


    login: (email, senha, callback) => {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE email = ?
            AND senha = ?
        `;

        conexao.query(
            sql,
            [email, senha],
            callback
        );
    },


    editarPerfil: (id, nome, email, callback) => {

        const sql = `
            UPDATE usuarios
            SET nome = ?, email = ?
            WHERE id = ?
        `;

        conexao.query(
            sql,
            [nome, email, id],
            callback
        );
    },


    alterarSenha: (id, senha, callback) => {

        const sql = `
            UPDATE usuarios
            SET senha = ?
            WHERE id = ?
        `;

        conexao.query(
            sql,
            [senha, id],
            callback
        );
    },


    buscarPorId: (id, callback) => {

        const sql = `
            SELECT id, nome, email, foto_perfil
            FROM usuarios
            WHERE id = ?
        `;

        conexao.query(
            sql,
            [id],
            callback
        );
    },


    // ==============================
    // SALVAR FOTO DE PERFIL
    // ==============================

    atualizarFoto: (id, foto_perfil, callback) => {

        const sql = `
            UPDATE usuarios
            SET foto_perfil = ?
            WHERE id = ?
        `;

        conexao.query(
            sql,
            [foto_perfil, id],
            callback
        );
    }

};

module.exports = UsuarioModel;

