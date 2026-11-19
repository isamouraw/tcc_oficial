
const usuario = JSON.parse(localStorage.getItem("usuario"));

// =====================================================
// VERIFICAR LOGIN
// =====================================================

if (!usuario) {
    window.location.href = "login.html";
} else {

    // =====================================================
    // MOSTRAR DADOS DO USUÁRIO
    // =====================================================

    const nomeUsuario = document.getElementById("nomeUsuario");
    const emailUsuario = document.getElementById("emailUsuario");

    nomeUsuario.innerText = usuario.nome;
    emailUsuario.innerText = usuario.email;


    // =====================================================
    // FOTO DE PERFIL
    // =====================================================

    const fotoPerfil = document.getElementById("fotoPerfil");
    const inputFoto = document.getElementById("inputFoto");

    const fotoPadrao = "https://placehold.co/120x120/171a45/ffffff?text=Foto";

    if (usuario.foto_perfil) {
        fotoPerfil.src = usuario.foto_perfil;
    } else {
        fotoPerfil.src = fotoPadrao;
    }

    inputFoto.addEventListener("change", function () {

        const arquivo = inputFoto.files[0];

        if (!arquivo) {
            return;
        }

        if (!arquivo.type.startsWith("image/")) {
            alert("Selecione um arquivo de imagem válido.");
            inputFoto.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = async function () {

            const foto = leitor.result;

            try {

                const resposta = await fetch("http://localhost:3000/usuarios/foto", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: usuario.id,
                        foto_perfil: foto
                    })
                });

                const dados = await resposta.json();

                if (!resposta.ok || !dados.sucesso) {
                    alert(dados.mensagem || "Erro ao atualizar foto.");
                    return;
                }

                usuario.foto_perfil = foto;

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(usuario)
                );

                fotoPerfil.src = foto;

                alert("Foto de perfil atualizada com sucesso!");

            } catch (erro) {

                console.error("Erro ao atualizar foto:", erro);
                alert("Erro ao conectar com o servidor.");

            }

        };

        leitor.readAsDataURL(arquivo);

    });


    // =====================================================
    // EDITAR NOME E E-MAIL
    // =====================================================

    const modalEditar = document.getElementById("modalEditar");
    const btnEditar = document.getElementById("btnEditar");
    const fecharEditar = document.getElementById("fecharEditar");
    const salvarPerfil = document.getElementById("salvarPerfil");

    const novoNome = document.getElementById("novoNome");
    const novoEmail = document.getElementById("novoEmail");
    const mensagemPerfil = document.getElementById("mensagemPerfil");

    btnEditar.addEventListener("click", function () {

        novoNome.value = usuario.nome;
        novoEmail.value = usuario.email;

        mensagemPerfil.innerText = "";

        modalEditar.classList.add("ativo");

    });

    fecharEditar.addEventListener("click", function () {
        modalEditar.classList.remove("ativo");
    });


    // =====================================================
    // SALVAR ALTERAÇÕES DO PERFIL
    // =====================================================

    salvarPerfil.addEventListener("click", async function () {

        const nome = novoNome.value.trim();
        const email = novoEmail.value.trim();

        mensagemPerfil.innerText = "";

        if (!nome || !email) {
            mensagemPerfil.innerText = "Preencha todos os campos.";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mensagemPerfil.innerText = "Digite um e-mail válido.";
            return;
        }

        salvarPerfil.disabled = true;

        try {

            const resposta = await fetch("http://localhost:3000/usuarios/editar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: usuario.id,
                    nome: nome,
                    email: email
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                mensagemPerfil.innerText =
                    dados.mensagem || "Erro ao atualizar perfil.";
                return;
            }

            usuario.nome = nome;
            usuario.email = email;

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            nomeUsuario.innerText = nome;
            emailUsuario.innerText = email;

            mensagemPerfil.innerText =
                "Perfil atualizado com sucesso!";

            setTimeout(() => {
                modalEditar.classList.remove("ativo");
            }, 1200);

        } catch (erro) {

            console.error("Erro ao editar perfil:", erro);

            mensagemPerfil.innerText =
                "Erro ao conectar com o servidor.";

        } finally {
            salvarPerfil.disabled = false;
        }

    });


    // =====================================================
    // ALTERAR SENHA
    // =====================================================

    const modalSenha = document.getElementById("modalSenha");
    const btnSenha = document.getElementById("btnSenha");
    const fecharSenha = document.getElementById("fecharSenha");
    const salvarSenha = document.getElementById("salvarSenha");

    const novaSenha = document.getElementById("novaSenha");
    const confirmarSenha = document.getElementById("confirmarSenha");
    const mensagemSenha = document.getElementById("mensagemSenha");

    btnSenha.addEventListener("click", function () {

        novaSenha.value = "";
        confirmarSenha.value = "";

        mensagemSenha.innerText = "";

        modalSenha.classList.add("ativo");

    });

    fecharSenha.addEventListener("click", function () {
        modalSenha.classList.remove("ativo");
    });


    // =====================================================
    // SALVAR NOVA SENHA
    // =====================================================

    salvarSenha.addEventListener("click", async function () {

        const senha = novaSenha.value;
        const confirmacao = confirmarSenha.value;

        mensagemSenha.innerText = "";

        if (!senha || !confirmacao) {
            mensagemSenha.innerText = "Preencha os dois campos.";
            return;
        }

        if (senha !== confirmacao) {
            mensagemSenha.innerText = "As senhas não coincidem.";
            return;
        }

        if (senha.length < 6) {
            mensagemSenha.innerText =
                "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        salvarSenha.disabled = true;

        try {

            const resposta = await fetch("http://localhost:3000/usuarios/senha", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: usuario.id,
                    senha: senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                mensagemSenha.innerText =
                    dados.mensagem || "Erro ao alterar senha.";
                return;
            }

            mensagemSenha.innerText =
                "Senha alterada com sucesso!";

            novaSenha.value = "";
            confirmarSenha.value = "";

            setTimeout(() => {
                modalSenha.classList.remove("ativo");
            }, 1200);

        } catch (erro) {

            console.error("Erro ao alterar senha:", erro);

            mensagemSenha.innerText =
                "Erro ao conectar com o servidor.";

        } finally {
            salvarSenha.disabled = false;
        }

    });


    // =====================================================
    // SAIR DA CONTA
    // =====================================================

    document.getElementById("btnSair").addEventListener("click", function () {

        localStorage.removeItem("usuario");

        window.location.href = "login.html";

    });

    console.log("PERFIL.JS CARREGADO COM SUCESSO!");

}
