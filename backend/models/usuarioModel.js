
const conexao = require("../database/conexao");

const UsuarioModel = {

    // CADASTRO
    cadastrar: (nome, email, senha, callback) => {

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        conexao.query(sql, [nome, email, senha], callback);
    },


    // LOGIN
    login: (email, senha, callback) => {

        const sql = `
            SELECT id, nome, email, foto_perfil
            FROM usuarios
            WHERE email = ?
            AND senha = ?
        `;

        conexao.query(sql, [email, senha], callback);
    },


    // EDITAR NOME E E-MAIL
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
