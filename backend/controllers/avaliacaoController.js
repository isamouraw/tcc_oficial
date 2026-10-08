const avaliacaoModel = require("../models/avaliacaoModel.js");


// =====================================================
// ADICIONAR AVALIAÇÃO
// =====================================================

function adicionarAvaliacao(req, res) {

    const {
        usuario_id,
        filme_id,
        nota,
        comentario
    } = req.body;

    if (!usuario_id || !filme_id || !nota) {

        return res.status(400).json({
            erro: "Usuário, filme e nota são obrigatórios."
        });

    }

    avaliacaoModel.adicionarAvaliacao(
        usuario_id,
        filme_id,
        nota,
        comentario,
        (erro, resultado) => {

            if (erro) {

                console.error(
                    "ERRO AO ADICIONAR AVALIAÇÃO:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao adicionar avaliação."
                });

            }

            res.status(201).json({
                mensagem: "Avaliação adicionada com sucesso!",
                id: resultado.insertId
            });

        }
    );

}


// =====================================================
// LISTAR AVALIAÇÕES DO FILME
// =====================================================

function listarAvaliacoes(req, res) {

    const { filme_id } = req.params;

    avaliacaoModel.listarAvaliacoes(
        filme_id,
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "ERRO AO LISTAR AVALIAÇÕES:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao listar avaliações."
                });

            }

            res.json(resultados);

        }
    );

}


// =====================================================
// LISTAR AVALIAÇÕES DO USUÁRIO
// =====================================================

function listarAvaliacoesUsuario(req, res) {

    const { usuario_id } = req.params;

    avaliacaoModel.listarAvaliacoesUsuario(
        usuario_id,
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "ERRO AO LISTAR AVALIAÇÕES DO USUÁRIO:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao listar avaliações do usuário."
                });

            }

            res.json(resultados);

        }
    );

}


// =====================================================
// CURTIR AVALIAÇÃO
// =====================================================

function curtirAvaliacao(req, res) {

    const {
        usuario_id,
        avaliacao_id
    } = req.body;

    if (!usuario_id || !avaliacao_id) {

        return res.status(400).json({
            erro: "Usuário e avaliação são obrigatórios."
        });

    }

    avaliacaoModel.curtirAvaliacao(
        usuario_id,
        avaliacao_id,
        (erro, resultado) => {

            if (erro) {

                console.error(
                    "ERRO AO CURTIR AVALIAÇÃO:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao curtir avaliação."
                });

            }

            res.json({
                mensagem: "Avaliação curtida com sucesso!"
            });

        }
    );

}


// =====================================================
// DESCURTIR AVALIAÇÃO
// =====================================================

function descurtirAvaliacao(req, res) {

    const {
        usuario_id,
        avaliacao_id
    } = req.body;

    if (!usuario_id || !avaliacao_id) {

        return res.status(400).json({
            erro: "Usuário e avaliação são obrigatórios."
        });

    }

    avaliacaoModel.descurtirAvaliacao(
        usuario_id,
        avaliacao_id,
        (erro, resultado) => {

            if (erro) {

                console.error(
                    "ERRO AO DESCURTIR AVALIAÇÃO:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao descurtir avaliação."
                });

            }

            res.json({
                mensagem: "Curtida removida com sucesso!"
            });

        }
    );

}


// =====================================================
// CONTAR CURTIDAS
// =====================================================

function contarCurtidas(req, res) {

    const { avaliacao_id } = req.params;

    avaliacaoModel.contarCurtidas(
        avaliacao_id,
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "ERRO AO CONTAR CURTIDAS:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao contar curtidas."
                });

            }

            res.json(resultados[0]);

        }
    );

}


// =====================================================
// AVALIAÇÕES MAIS CURTIDAS
// =====================================================

function listarAvaliacoesMaisCurtidas(req, res) {

    avaliacaoModel.listarAvaliacoesMaisCurtidas(
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "ERRO AO LISTAR MAIS CURTIDAS:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao listar avaliações mais curtidas."
                });

            }

            res.json(resultados);

        }
    );

}


// =====================================================
// VERIFICAR SE USUÁRIO CURTIU
// =====================================================

function verificarCurtida(req, res) {

    const {
        usuario_id,
        avaliacao_id
    } = req.params;

    avaliacaoModel.verificarCurtida(
        usuario_id,
        avaliacao_id,
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "ERRO AO VERIFICAR CURTIDA:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao verificar curtida."
                });

            }

            res.json({
                curtiu: resultados.length > 0
            });

        }
    );

}


// =====================================================
// EXCLUIR AVALIAÇÃO
// =====================================================

function excluirAvaliacao(req, res) {

    const { avaliacao_id } = req.params;
    const { usuario_id } = req.body;

    if (!avaliacao_id || !usuario_id) {

        return res.status(400).json({
            erro: "Usuário e avaliação são obrigatórios."
        });

    }

    avaliacaoModel.excluirAvaliacao(
        avaliacao_id,
        usuario_id,
        (erro, resultado) => {

            if (erro) {

                console.error(
                    "ERRO AO EXCLUIR AVALIAÇÃO:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao excluir avaliação."
                });

            }

            if (resultado.affectedRows === 0) {

                return res.status(403).json({
                    erro: "Você só pode excluir suas próprias avaliações."
                });

            }

            res.json({
                mensagem: "Avaliação excluída com sucesso!"
            });

        }
    );

}


// =====================================================
// EXPORTAÇÕES
// =====================================================

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