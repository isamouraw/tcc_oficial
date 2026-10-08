const conexao = require("../database/conexao.js");

const listaModel = {

    adicionar: (usuario_id, filme_id, callback) => {
        const sql = `
            INSERT INTO lista (usuario_id, filme_id)
            VALUES (?, ?)
        `;

        conexao.query(sql, [usuario_id, filme_id], callback);
    },

    remover: (usuario_id, filme_id, callback) => {
        const sql = `
            DELETE FROM lista
            WHERE usuario_id = ? AND filme_id = ?
        `;

        conexao.query(sql, [usuario_id, filme_id], callback);
    },

    listar: (usuario_id, callback) => {
        const sql = `
            SELECT * FROM lista
            WHERE usuario_id = ?
            ORDER BY data_adicionado DESC
        `;

        conexao.query(sql, [usuario_id], callback);
    },

    verificar: (usuario_id, filme_id, callback) => {
        const sql = `
            SELECT * FROM lista
            WHERE usuario_id = ? AND filme_id = ?
        `;

        conexao.query(sql, [usuario_id, filme_id], callback);
    }
};

module.exports = listaModel;