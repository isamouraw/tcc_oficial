const express = require("express");
const listaController = require("../controllers/listaController.js");

const router = express.Router();

// Adicionar filme à lista
router.post("/", listaController.adicionar);

// Remover filme da lista
router.delete("/", listaController.remover);

// Listar filmes de um usuário
router.get("/:usuario_id", listaController.listar);

// Verificar se um filme está na lista
router.get("/:usuario_id/:filme_id", listaController.verificar);

module.exports = router;