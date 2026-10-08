const usuario = JSON.parse(localStorage.getItem("usuario"));


// =====================================================
// VERIFICAR LOGIN
// =====================================================

if (!usuario) {
    window.location.href = "login.html";
}


// =====================================================
// MOSTRAR DADOS
// =====================================================

document.getElementById("nomeUsuario").innerText = usuario.nome;
document.getElementById("emailUsuario").innerText = usuario.email;


// =====================================================
// EDITAR PERFIL
// =====================================================

const modalEditar = document.getElementById("modalEditar");
const btnEditar = document.getElementById("btnEditar");
const fecharEditar = document.getElementById("fecharEditar");
const salvarPerfil = document.getElementById("salvarPerfil");

btnEditar.addEventListener("click", function () {

    document.getElementById("novoNome").value = usuario.nome;
    document.getElementById("novoEmail").value = usuario.email;

    document.getElementById("mensagemPerfil").innerText = "";

    modalEditar.classList.add("ativo");

});


fecharEditar.addEventListener("click", function () {

    modalEditar.classList.remove("ativo");

});


// =====================================================
// SALVAR ALTERAÇÕES DO PERFIL
// =====================================================

salvarPerfil.addEventListener("click", async function () {

    const novoNome =
        document.getElementById("novoNome").value.trim();

    const novoEmail =
        document.getElementById("novoEmail").value.trim();

    const mensagem =
        document.getElementById("mensagemPerfil");


    if (!novoNome || !novoEmail) {

        mensagem.innerText =
            "Preencha todos os campos.";

        return;
    }


    try {

        const resposta = await fetch(
            "http://localhost:3000/usuarios/editar",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id: usuario.id,
                    nome: novoNome,
                    email: novoEmail
                })
            }
        );


        const dados = await resposta.json();


        if (!dados.sucesso) {

            mensagem.innerText =
                dados.mensagem ||
                "Erro ao atualizar perfil.";

            return;
        }


        usuario.nome = novoNome;
        usuario.email = novoEmail;


        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );


        document.getElementById("nomeUsuario").innerText =
            novoNome;

        document.getElementById("emailUsuario").innerText =
            novoEmail;


        mensagem.innerText =
            "Perfil atualizado com sucesso!";


        setTimeout(() => {

            modalEditar.classList.remove("ativo");

        }, 1000);


    } catch (erro) {

        console.error(erro);

        mensagem.innerText =
            "Erro ao conectar com o servidor.";

    }

});


// =====================================================
// ALTERAR SENHA
// =====================================================

const modalSenha = document.getElementById("modalSenha");
const btnSenha = document.getElementById("btnSenha");
const fecharSenha = document.getElementById("fecharSenha");
const salvarSenha = document.getElementById("salvarSenha");


btnSenha.addEventListener("click", function () {

    document.getElementById("novaSenha").value = "";
    document.getElementById("confirmarSenha").value = "";

    document.getElementById("mensagemSenha").innerText = "";

    modalSenha.classList.add("ativo");

});


fecharSenha.addEventListener("click", function () {

    modalSenha.classList.remove("ativo");

});


// =====================================================
// SALVAR NOVA SENHA
// =====================================================

salvarSenha.addEventListener("click", async function () {

    const novaSenha =
        document.getElementById("novaSenha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    const mensagem =
        document.getElementById("mensagemSenha");


    if (!novaSenha || !confirmarSenha) {

        mensagem.innerText =
            "Preencha os dois campos.";

        return;
    }


    if (novaSenha !== confirmarSenha) {

        mensagem.innerText =
            "As senhas não coincidem.";

        return;
    }


    if (novaSenha.length < 6) {

        mensagem.innerText =
            "A senha deve ter pelo menos 6 caracteres.";

        return;
    }


    try {

        const resposta = await fetch(
            "http://localhost:3000/usuarios/senha",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id: usuario.id,
                    senha: novaSenha
                })
            }
        );


        const dados = await resposta.json();


        if (!dados.sucesso) {

            mensagem.innerText =
                dados.mensagem ||
                "Erro ao alterar senha.";

            return;
        }


        mensagem.innerText =
            "Senha alterada com sucesso!";


        document.getElementById("novaSenha").value = "";
        document.getElementById("confirmarSenha").value = "";


        setTimeout(() => {

            modalSenha.classList.remove("ativo");

        }, 1000);


    } catch (erro) {

        console.error(erro);

        mensagem.innerText =
            "Erro ao conectar com o servidor.";

    }

});


// =====================================================
// SAIR
// =====================================================

document.getElementById("btnSair").addEventListener(
    "click",
    function () {

        localStorage.removeItem("usuario");

        window.location.href = "login.html";

    }
);


// =====================================================
// FOTO DE PERFIL
// =====================================================

const inputFoto =
    document.getElementById("inputFoto");

const fotoPerfil =
    document.getElementById("fotoPerfil");


// =====================================================
// CARREGAR FOTO DA CONTA
// =====================================================

if (usuario.foto_perfil) {

    fotoPerfil.src =
        usuario.foto_perfil;

}


// =====================================================
// ESCOLHER E SALVAR NOVA FOTO
// =====================================================

inputFoto.addEventListener("change", function () {


    const arquivo =
        inputFoto.files[0];

    if (!arquivo) {
        return;
    }


    const leitor =
        new FileReader();


    leitor.onload = async function (event) {

        const imagem =
            event.target.result;


        // Mostra a foto imediatamente
        fotoPerfil.src =
            imagem;


        console.log(
            "ID DO USUÁRIO:",
            usuario.id
        );

        console.log(
            "FOTO PRONTA PARA ENVIAR:",
            imagem.substring(0, 30)
        );


        try {

            const resposta = await fetch(
                "http://localhost:3000/usuarios/foto",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        id: usuario.id,
                        foto_perfil: imagem
                    })
                }
            );


            const dados =
                await resposta.json();


            console.log(
                "RESPOSTA DO SERVIDOR:",
                dados
            );


            if (!dados.sucesso) {

                alert(
                    dados.mensagem ||
                    "Erro ao salvar foto."
                );

                return;
            }


            // Atualiza o usuário salvo no navegador
            usuario.foto_perfil =
                imagem;


            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );


            console.log(
                "Foto salva na conta com sucesso!"
            );


        } catch (erro) {

            console.error(
                "Erro ao salvar foto:",
                erro
            );

            alert(
                "Erro ao conectar com o servidor."
            );

        }

    };


    leitor.readAsDataURL(arquivo);

});


console.log(
    "PERFIL.JS FOI CARREGADO"
);
