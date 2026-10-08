const favoritoModel = require("../models/favoritoModel");

const adicionarFavorito = (req, res) => {
    const { usuario_id, filme_id } = req.body;

    favoritoModel.adicionarFavorito(usuario_id, filme_id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao adicionar favorito" });
        }

        res.status(201).json({
            mensagem: "Filme adicionado aos favoritos!"
        });
    });
};

const removerFavorito = (req, res) => {
    const { usuario_id, filme_id } = req.body;

    favoritoModel.removerFavorito(usuario_id, filme_id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao remover favorito" });
        }

        res.json({
            mensagem: "Filme removido dos favoritos!"
        });
    });
};

const listarFavoritos = (req, res) => {
    const { usuario_id } = req.params;

    favoritoModel.listarFavoritos(usuario_id, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao listar favoritos" });
        }

        res.json(resultados);
    });
};

const verificarFavorito = (req, res) => {
    const { usuario_id, filme_id } = req.params;

    favoritoModel.verificarFavorito(usuario_id, filme_id, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao verificar favorito" });
        }

        res.json({
            favorito: resultados.length > 0
        });
    });
};

module.exports = {
    adicionarFavorito,
    removerFavorito,
    listarFavoritos,
    verificarFavorito
};