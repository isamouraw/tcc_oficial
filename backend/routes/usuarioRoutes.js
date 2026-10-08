const express = require("express");

const router = express.Router();

const UsuarioController = require("../controllers/usuarioController");


router.post(
    "/cadastro",
    UsuarioController.cadastrar
);


router.post(
    "/login",
    UsuarioController.login
);


router.put(
    "/editar",
    UsuarioController.editarPerfil
);


router.put(
    "/senha",
    UsuarioController.alterarSenha
);


// ATUALIZAR FOTO DE PERFIL
router.put(
    "/foto",
    UsuarioController.atualizarFoto
);


router.get(
    "/:id",
    UsuarioController.buscarPorId
);


module.exports = router;

