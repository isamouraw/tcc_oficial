
const express = require("express");

const router = express.Router();

const UsuarioController = require("../controllers/usuarioController");
console.log("FUNÇÕES DO CONTROLLER:", Object.keys(UsuarioController));

console.log("CADASTRO:", typeof UsuarioController.cadastrar);
console.log("LOGIN:", typeof UsuarioController.login);
console.log("EDITAR:", typeof UsuarioController.editarPerfil);
console.log("SENHA:", typeof UsuarioController.alterarSenha);
console.log("FOTO:", typeof UsuarioController.atualizarFoto);
console.log("BUSCAR:", typeof UsuarioController.buscarPorId);

// CADASTRO
router.post(
    "/cadastro",
    UsuarioController.cadastrar
);

// LOGIN
router.post(
    "/login",
    UsuarioController.login
);

// EDITAR PERFIL
router.put(
    "/editar",
    UsuarioController.editarPerfil
);

// ALTERAR SENHA
router.put(
    "/senha",
    UsuarioController.alterarSenha
);

// ATUALIZAR FOTO DE PERFIL
router.put(
    "/foto",
    UsuarioController.atualizarFoto
);

// BUSCAR USUÁRIO
router.get(
    "/:id",
    UsuarioController.buscarPorId
);

module.exports = router;
