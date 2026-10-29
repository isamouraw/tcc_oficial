
const express = require("express");

const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoController.js");

// =====================================================
// ADICIONAR AVALIAÇÃO
// =====================================================
router.post("/", avaliacaoController.adicionarAvaliacao);

// =====================================================
// LISTAR AVALIAÇÕES DO USUÁRIO
// =====================================================
router.get(
    "/usuario/:usuario_id",
    avaliacaoController.listarAvaliacoesUsuario
);

// =====================================================
// CURTIR E DESCURTIR AVALIAÇÕES
// =====================================================
router.post("/curtir", avaliacaoController.curtirAvaliacao);

router.delete("/descurtir", avaliacaoController.descurtirAvaliacao);

// =====================================================
// CONTAR CURTIDAS
// =====================================================
router.get(
    "/curtidas/:avaliacao_id",
    avaliacaoController.contarCurtidas
);

// =====================================================
// AVALIAÇÕES MAIS CURTIDAS
// =====================================================
router.get(
    "/mais-curtidas",
    avaliacaoController.listarAvaliacoesMaisCurtidas
);

// =====================================================
// VERIFICAR SE O USUÁRIO CURTIU
// =====================================================
router.get(
    "/curtida/:usuario_id/:avaliacao_id",
    avaliacaoController.verificarCurtida
);

// =====================================================
// CALCULAR MÉDIA DAS NOTAS DO CINE TRACK
// =====================================================
router.get(
    "/media/:filme_id",
    avaliacaoController.calcularMediaFilme
);

// =====================================================
// EXCLUIR AVALIAÇÃO
// =====================================================
router.delete(
    "/:avaliacao_id",
    avaliacaoController.excluirAvaliacao
);

// =====================================================
// LISTAR AVALIAÇÕES DE UM FILME
// DEIXAR ESTA ROTA POR ÚLTIMO
// =====================================================
router.get(
    "/:filme_id",
    avaliacaoController.listarAvaliacoes
);

module.exports = router;
