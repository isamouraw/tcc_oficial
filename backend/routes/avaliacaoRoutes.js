const express = require("express");

const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoController.js");

router.post("/", avaliacaoController.adicionarAvaliacao);

router.get("/usuario/:usuario_id", avaliacaoController.listarAvaliacoesUsuario);

router.post("/curtir", avaliacaoController.curtirAvaliacao);

router.delete("/descurtir", avaliacaoController.descurtirAvaliacao);

router.get("/curtidas/:avaliacao_id", avaliacaoController.contarCurtidas);

router.get("/mais-curtidas", avaliacaoController.listarAvaliacoesMaisCurtidas);

router.get("/curtida/:usuario_id/:avaliacao_id", avaliacaoController.verificarCurtida);

router.delete("/:avaliacao_id", avaliacaoController.excluirAvaliacao);

// DEIXE ESTA POR ÚLTIMO

router.get("/:filme_id", avaliacaoController.listarAvaliacoes);

module.exports = router;