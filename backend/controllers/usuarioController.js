const UsuarioModel = require("../models/usuarioModel");


const UsuarioController = {

    // =====================================================
    // CADASTRO
    // =====================================================

    cadastrar: (req, res) => {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {

            return res.json({
                sucesso: false,
                mensagem: "Preencha todos os campos!"
            });

        }

        UsuarioModel.cadastrar(
            nome,
            email,
            senha,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro detalhado no banco:",
                        erro
                    );

                    return res.json({
                        sucesso: false,
                        mensagem: "Erro ao cadastrar usuario",
                        detalhe: erro.message
                    });

                }

                res.json({
                    sucesso: true,
                    mensagem: "Usuário cadastrado com sucesso!"
                });

            }
        );

    },


    // =====================================================
    // LOGIN
    // =====================================================

    login: (req, res) => {

        const { email, senha } = req.body;

        UsuarioModel.login(
            email,
            senha,
            (erro, resultado) => {

                if (erro) {

                    console.error(
                        "Erro no login:",
                        erro
                    );

                    return res.json({
                        sucesso: false,
                        mensagem: "Erro no servidor!"
                    });

                }

                if (resultado && resultado.length > 0) {

                    res.json({
                        sucesso: true,
                        mensagem: "Login realizado com sucesso!",
                        usuario: resultado[0]
                    });

                } else {

                    res.json({
                        sucesso: false,
                        mensagem: "Email ou senha incorretos"
                    });

                }

            }
        );

    },


    // =====================================================
    // EDITAR PERFIL
    // =====================================================

    editarPerfil: (req, res) => {

        const { id, nome, email } = req.body;

        if (!id || !nome || !email) {

            return res.json({
                sucesso: false,
                mensagem: "Nome e e-mail são obrigatórios."
            });

        }

        UsuarioModel.editarPerfil(
            id,
            nome,
            email,
            (erro, resultado) => {

                if (erro) {

                    console.error(
                        "Erro ao editar perfil:",
                        erro
                    );

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao atualizar perfil."
                    });

                }

                res.json({
                    sucesso: true,
                    mensagem: "Perfil atualizado com sucesso!"
                });

            }
        );

    },


    // =====================================================
    // ALTERAR SENHA
    // =====================================================

    alterarSenha: (req, res) => {

        const { id, senha } = req.body;

        if (!id || !senha) {

            return res.json({
                sucesso: false,
                mensagem: "A nova senha é obrigatória."
            });

        }

        UsuarioModel.alterarSenha(
            id,
            senha,
            (erro, resultado) => {

                if (erro) {

                    console.error(
                        "Erro ao alterar senha:",
                        erro
                    );

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao alterar senha."
                    });

                }

                res.json({
                    sucesso: true,
                    mensagem: "Senha alterada com sucesso!"
                });

            }
        );

    },


    // =====================================================
    // BUSCAR USUÁRIO
    // =====================================================

    buscarPorId: (req, res) => {

        const { id } = req.params;

        UsuarioModel.buscarPorId(
            id,
            (erro, resultado) => {

                if (erro) {

                    console.error(
                        "Erro ao buscar usuário:",
                        erro
                    );

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

            }
        );

    },


    // =====================================================
    // ATUALIZAR FOTO DE PERFIL
    // =====================================================

    atualizarFoto: (req, res) => {

        const { id, foto_perfil } = req.body;

        if (!id || !foto_perfil) {

            return res.json({
                sucesso: false,
                mensagem: "Foto não enviada."
            });

        }

        UsuarioModel.atualizarFoto(
            id,
            foto_perfil,
            (erro) => {

                if (erro) {

                    console.error(
                        "Erro ao atualizar foto:",
                        erro
                    );

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao atualizar foto."
                    });

                }

                res.json({
                    sucesso: true,
                    mensagem: "Foto atualizada com sucesso!"
                });

            }
        );

    }

};


module.exports = UsuarioController;
