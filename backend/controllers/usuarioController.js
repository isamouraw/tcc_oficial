
const UsuarioModel = require("../models/usuarioModel");
const { enviarCodigoVerificacao } = require("../email");
const crypto = require("crypto");

const UsuarioController = {

    // CADASTRO
    cadastrar: (req, res) => {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.json({
                sucesso: false,
                mensagem: "Preencha todos os campos!"
            });
        }

        const codigo = crypto.randomInt(100000, 1000000).toString();
        const expiracao = new Date(Date.now() + 10 * 60 * 1000);

        UsuarioModel.cadastrarComVerificacao(
            nome,
            email,
            senha,
            codigo,
            expiracao,
            async (erro) => {

                if (erro) {
                    console.error("Erro ao cadastrar:", erro);

                    if (erro.code === "ER_DUP_ENTRY") {
                        return res.json({
                            sucesso: false,
                            mensagem: "Este e-mail já está cadastrado."
                        });
                    }

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao cadastrar usuário."
                    });
                }

                const enviado = await enviarCodigoVerificacao(email, codigo);

                if (!enviado) {
                    return res.json({
                        sucesso: false,
                        mensagem: "Cadastro criado, mas não foi possível enviar o código. Entre em contato com o suporte."
                    });
                }

                return res.json({
                    sucesso: true,
                    mensagem: "Cadastro realizado! Enviamos um código de confirmação para seu e-mail."
                });

            }
        );

    },


    // LOGIN
    login: (req, res) => {

        const { email, senha } = req.body;

        UsuarioModel.login(email, senha, (erro, resultado) => {

            if (erro) {
                console.error("Erro no login:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro no servidor!"
                });
            }

            if (!resultado || resultado.length === 0) {
                return res.json({
                    sucesso: false,
                    mensagem: "E-mail ou senha incorretos."
                });
            }

            if (!resultado[0].email_verificado) {
                return res.json({
                    sucesso: false,
                    mensagem: "Confirme seu e-mail antes de entrar."
                });
            }

            return res.json({
                sucesso: true,
                mensagem: "Login realizado com sucesso!",
                usuario: resultado[0]
            });

        });

    },


    // CONFIRMAR E-MAIL
    verificarEmail: (req, res) => {

        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return res.json({
                sucesso: false,
                mensagem: "Informe seu e-mail e o código recebido."
            });
        }

        UsuarioModel.verificarCodigo(
            email,
            codigo,
            (erro, resultado) => {

                if (erro) {
                    console.error("Erro ao verificar e-mail:", erro);

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao confirmar e-mail."
                    });
                }

                if (resultado.affectedRows === 0) {
                    return res.json({
                        sucesso: false,
                        mensagem: "Código inválido ou expirado."
                    });
                }

                return res.json({
                    sucesso: true,
                    mensagem: "E-mail confirmado com sucesso! Agora você pode fazer login."
                });

            }
        );

    },


    // EDITAR PERFIL
    editarPerfil: (req, res) => {

        const { id, nome, email } = req.body;

        if (!id || !nome || !email) {
            return res.json({
                sucesso: false,
                mensagem: "Nome e e-mail são obrigatórios."
            });
        }

        UsuarioModel.editarPerfil(id, nome, email, (erro) => {

            if (erro) {
                console.error("Erro ao editar perfil:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao atualizar perfil."
                });
            }

            res.json({
                sucesso: true,
                mensagem: "Perfil atualizado com sucesso!"
            });

        });

    },


    // ALTERAR SENHA
    alterarSenha: (req, res) => {

        const { id, senha } = req.body;

        if (!id || !senha) {
            return res.json({
                sucesso: false,
                mensagem: "A nova senha é obrigatória."
            });
        }

        UsuarioModel.alterarSenha(id, senha, (erro) => {

            if (erro) {
                console.error("Erro ao alterar senha:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao alterar senha."
                });
            }

            res.json({
                sucesso: true,
                mensagem: "Senha alterada com sucesso!"
            });

        });

    },


    // BUSCAR USUÁRIO
    buscarPorId: (req, res) => {

        const { id } = req.params;

        UsuarioModel.buscarPorId(id, (erro, resultado) => {

            if (erro) {
                console.error("Erro ao buscar usuário:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao buscar usuário."
                });
            }

            if (!resultado || resultado.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Usuário não encontrado."
                });
            }

            res.json({
                sucesso: true,
                usuario: resultado[0]
            });

        });

    },


    // ATUALIZAR FOTO DE PERFIL
    atualizarFoto: (req, res) => {

        const { id, foto_perfil } = req.body;

        if (!id || !foto_perfil) {
            return res.json({
                sucesso: false,
                mensagem: "Foto não enviada."
            });
        }

        UsuarioModel.atualizarFoto(id, foto_perfil, (erro) => {

            if (erro) {
                console.error("Erro ao atualizar foto:", erro);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao atualizar foto."
                });
            }

            res.json({
                sucesso: true,
                mensagem: "Foto atualizada com sucesso!"
            });

        });

    }

};

module.exports = UsuarioController;
