
const conexao = require("../database/conexao.js");

// ADICIONAR AVALIAÇÃO
function adicionarAvaliacao(usuario_id, filme_id, nota, comentario, callback) {
    const sql = `
        INSERT INTO avaliacoes
        (usuario_id, filme_id, nota, comentario)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(sql, [usuario_id, filme_id, nota, comentario], callback);
}

// LISTAR AVALIAÇÕES DE UM FILME
function listarAvaliacoes(filme_id, callback) {
    const sql = `
        SELECT avaliacoes.*, usuarios.nome, usuarios.foto_perfil
        FROM avaliacoes
        LEFT JOIN usuarios ON avaliacoes.usuario_id = usuarios.id
        WHERE avaliacoes.filme_id = ?
        ORDER BY avaliacoes.data_avaliacao DESC
    `;

    conexao.query(sql, [filme_id], callback);
}

// LISTAR AVALIAÇÕES DE UM USUÁRIO
function listarAvaliacoesUsuario(usuario_id, callback) {
    const sql = `
        SELECT
            avaliacoes.*,
            usuarios.nome,
            usuarios.foto_perfil
        FROM avaliacoes
        LEFT JOIN usuarios ON avaliacoes.usuario_id = usuarios.id
        WHERE avaliacoes.usuario_id = ?
        ORDER BY avaliacoes.data_avaliacao DESC
    `;

    conexao.query(sql, [usuario_id], callback);
}

// CURTIR AVALIAÇÃO
function curtirAvaliacao(usuario_id, avaliacao_id, callback) {
    const sql = `
        INSERT INTO curtidas_avaliacoes
        (usuario_id, avaliacao_id)
        VALUES (?, ?)
    `;

    conexao.query(sql, [usuario_id, avaliacao_id], callback);
}

// DESCURTIR AVALIAÇÃO
function descurtirAvaliacao(usuario_id, avaliacao_id, callback) {
    const sql = `
        DELETE FROM curtidas_avaliacoes
        WHERE usuario_id = ? AND avaliacao_id = ?
    `;

    conexao.query(sql, [usuario_id, avaliacao_id], callback);
}

// CONTAR CURTIDAS
function contarCurtidas(avaliacao_id, callback) {
    const sql = `
        SELECT COUNT(*) AS curtidas
        FROM curtidas_avaliacoes
        WHERE avaliacao_id = ?
    `;

    conexao.query(sql, [avaliacao_id], callback);
}

// LISTAR AVALIAÇÕES MAIS CURTIDAS
function listarAvaliacoesMaisCurtidas(callback) {
    const sql = `
        SELECT
            avaliacoes.id,
            avaliacoes.usuario_id,
            avaliacoes.filme_id,
            avaliacoes.nota,
            avaliacoes.comentario,
            avaliacoes.data_avaliacao,
            usuarios.nome,
            usuarios.foto_perfil,
            COUNT(curtidas_avaliacoes.id) AS curtidas
        FROM avaliacoes
        LEFT JOIN curtidas_avaliacoes
            ON avaliacoes.id = curtidas_avaliacoes.avaliacao_id
        LEFT JOIN usuarios
            ON avaliacoes.usuario_id = usuarios.id
        GROUP BY
            avaliacoes.id,
            avaliacoes.usuario_id,
            avaliacoes.filme_id,
            avaliacoes.nota,
            avaliacoes.comentario,
            avaliacoes.data_avaliacao,
            usuarios.nome,
            usuarios.foto_perfil
        ORDER BY curtidas DESC
        LIMIT 5
    `;

    conexao.query(sql, callback);
}

// VERIFICAR CURTIDA
function verificarCurtida(usuario_id, avaliacao_id, callback) {
    const sql = `
        SELECT id
        FROM curtidas_avaliacoes
        WHERE usuario_id = ? AND avaliacao_id = ?
    `;

    conexao.query(sql, [usuario_id, avaliacao_id], callback);
}

// EXCLUIR AVALIAÇÃO
function excluirAvaliacao(avaliacao_id, usuario_id, callback) {
    const verificarSQL = `
        SELECT id
        FROM avaliacoes
        WHERE id = ? AND usuario_id = ?
    `;

    conexao.query(verificarSQL, [avaliacao_id, usuario_id], (erro, resultados) => {
        if (erro) return callback(erro);

        if (resultados.length === 0) {
            return callback(null, { affectedRows: 0 });
        }

        const sqlCurtidas = `
            DELETE FROM curtidas_avaliacoes
            WHERE avaliacao_id = ?
        `;

        conexao.query(sqlCurtidas, [avaliacao_id], (erro) => {
            if (erro) return callback(erro);

            const sqlAvaliacao = `
                DELETE FROM avaliacoes
                WHERE id = ? AND usuario_id = ?
            `;

            conexao.query(sqlAvaliacao, [avaliacao_id, usuario_id], callback);
        });
    });
}

// CALCULAR MÉDIA
function calcularMediaFilme(filme_id, callback) {
    const sql = `
        SELECT
            ROUND(AVG(nota), 1) AS media,
            COUNT(nota) AS total_avaliacoes
        FROM avaliacoes
        WHERE filme_id = ?
    `;

    conexao.query(sql, [filme_id], callback);
}

module.exports = {
    adicionarAvaliacao,
    listarAvaliacoes,
    listarAvaliacoesUsuario,
    curtirAvaliacao,
    descurtirAvaliacao,
    contarCurtidas,
    listarAvaliacoesMaisCurtidas,
    verificarCurtida,
    excluirAvaliacao,
    calcularMediaFilme
};
