const conexao = require("../database/conexao.js");


function adicionarAvaliacao(usuario_id, filme_id, nota, comentario, callback) {

    const sql = `
        INSERT INTO avaliacoes
        (usuario_id, filme_id, nota, comentario)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [usuario_id, filme_id, nota, comentario],
        callback
    );

}


function listarAvaliacoes(filme_id, callback) {

    const sql = `
        SELECT *
        FROM avaliacoes
        WHERE filme_id = ?
        ORDER BY data_avaliacao DESC
    `;

    conexao.query(
        sql,
        [filme_id],
        callback
    );

}


function listarAvaliacoesUsuario(usuario_id, callback) {

    console.log("CHEGOU NO MODEL!");
    console.log("USUARIO_ID:", usuario_id);

    const sql = "SELECT * FROM avaliacoes WHERE usuario_id = ?";

    conexao.query(sql, [usuario_id], (erro, resultados) => {

        console.log("ERRO:", erro);
        console.log("RESULTADOS:", resultados);

        if (erro) {
            return callback(erro, null);
        }

        callback(null, resultados);
    });
}


function curtirAvaliacao(usuario_id, avaliacao_id, callback) {

    const sql = `
        INSERT INTO curtidas_avaliacoes
        (usuario_id, avaliacao_id)
        VALUES (?, ?)
    `;

    conexao.query(
        sql,
        [usuario_id, avaliacao_id],
        callback
    );

}


function descurtirAvaliacao(usuario_id, avaliacao_id, callback) {

    const sql = `
        DELETE FROM curtidas_avaliacoes
        WHERE usuario_id = ?
        AND avaliacao_id = ?
    `;

    conexao.query(
        sql,
        [usuario_id, avaliacao_id],
        callback
    );

}


function contarCurtidas(avaliacao_id, callback) {

    const sql = `
        SELECT COUNT(*) AS curtidas
        FROM curtidas_avaliacoes
        WHERE avaliacao_id = ?
    `;

    conexao.query(
        sql,
        [avaliacao_id],
        callback
    );

}


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
            usuarios.nome

        ORDER BY curtidas DESC

        LIMIT 5
    `;

    conexao.query(sql, (erro, resultados) => {

        console.log("ERRO MAIS CURTIDAS:", erro);

        if (erro) {
            return callback(erro, null);
        }

        callback(null, resultados);

    });

}


function verificarCurtida(usuario_id, avaliacao_id, callback) {

    const sql = `
        SELECT id
        FROM curtidas_avaliacoes
        WHERE usuario_id = ?
        AND avaliacao_id = ?
    `;

    conexao.query(
        sql,
        [usuario_id, avaliacao_id],
        callback
    );

}


// =====================================================
// EXCLUIR AVALIAÇÃO
// =====================================================

function excluirAvaliacao(avaliacao_id, usuario_id, callback) {

    // Primeiro remove as curtidas da avaliação
    const sqlCurtidas = `
        DELETE FROM curtidas_avaliacoes
        WHERE avaliacao_id = ?
    `;

    conexao.query(
        sqlCurtidas,
        [avaliacao_id],
        (erro) => {

            if (erro) {
                return callback(erro);
            }

            // Depois exclui a avaliação
            // somente se ela pertencer ao usuário
            const sqlAvaliacao = `
                DELETE FROM avaliacoes
                WHERE id = ?
                AND usuario_id = ?
            `;

            conexao.query(
                sqlAvaliacao,
                [avaliacao_id, usuario_id],
                callback
            );

        }
    );

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
    excluirAvaliacao

};