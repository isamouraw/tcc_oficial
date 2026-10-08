const express = require("express");
const router = express.Router();

const favoritoController = require("../controllers/favoritoController");

router.post("/", favoritoController.adicionarFavorito);

router.delete("/", favoritoController.removerFavorito);

router.get("/:usuario_id", favoritoController.listarFavoritos);

router.get("/:usuario_id/:filme_id", favoritoController.verificarFavorito);

module.exports = router;