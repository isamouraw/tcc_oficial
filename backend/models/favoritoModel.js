const conexao = require("../database/conexao.js");

const adicionarFavorito = (usuario_id, filme_id, callback) => {
    const sql = `
        INSERT INTO favoritos (usuario_id, filme_id)
        VALUES (?, ?)
    `;

    conexao.query(sql, [usuario_id, filme_id], callback);
};

const removerFavorito = (usuario_id, filme_id, callback) => {
    const sql = `
        DELETE FROM favoritos
        WHERE usuario_id = ? AND filme_id = ?
    `;

    conexao.query(sql, [usuario_id, filme_id], callback);
};

const listarFavoritos = (usuario_id, callback) => {
    const sql = `
        SELECT * FROM favoritos
        WHERE usuario_id = ?
        ORDER BY data_favoritado DESC
    `;

    conexao.query(sql, [usuario_id], callback);
};

const verificarFavorito = (usuario_id, filme_id, callback) => {
    const sql = `
        SELECT * FROM favoritos
        WHERE usuario_id = ? AND filme_id = ?
    `;

    conexao.query(sql, [usuario_id, filme_id], callback);
};

module.exports = {
    adicionarFavorito,
    removerFavorito,
    listarFavoritos,
    verificarFavorito
};