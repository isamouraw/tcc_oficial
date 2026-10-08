const listaModel = require("../models/listaModel.js");

const listaController = {

    adicionar: (req, res) => {
        const { usuario_id, filme_id } = req.body;

        listaModel.adicionar(usuario_id, filme_id, (erro, resultado) => {
            if (erro) {
                console.error("Erro ao adicionar filme à lista:", erro);
                return res.status(500).json({
                    erro: "Erro ao adicionar filme à lista"
                });
            }

            res.status(201).json({
                mensagem: "Filme adicionado à lista",
                resultado
            });
        });
    },

    remover: (req, res) => {
        const { usuario_id, filme_id } = req.body;

        listaModel.remover(usuario_id, filme_id, (erro, resultado) => {
            if (erro) {
                console.error("Erro ao remover filme da lista:", erro);
                return res.status(500).json({
                    erro: "Erro ao remover filme da lista"
                });
            }

            res.json({
                mensagem: "Filme removido da lista",
                resultado
            });
        });
    },

    listar: (req, res) => {
        const { usuario_id } = req.params;

        listaModel.listar(usuario_id, (erro, resultados) => {
            if (erro) {
                console.error("Erro ao buscar lista:", erro);
                return res.status(500).json({
                    erro: "Erro ao buscar lista"
                });
            }

            res.json(resultados);
        });
    },

    verificar: (req, res) => {
        const { usuario_id, filme_id } = req.params;

        listaModel.verificar(usuario_id, filme_id, (erro, resultados) => {
            if (erro) {
                console.error("Erro ao verificar filme na lista:", erro);
                return res.status(500).json({
                    erro: "Erro ao verificar filme na lista"
                });
            }

            res.json({
                naLista: resultados.length > 0
            });
        });
    }
};

module.exports = listaController;