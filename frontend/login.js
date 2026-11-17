
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const formVerificacao = document.getElementById("formVerificacao");

const caixaLogin = document.getElementById("caixaLogin");
const caixaCadastro = document.getElementById("caixaCadastro");
const caixaVerificacao = document.getElementById("caixaVerificacao");

const linkIrCadastro = document.getElementById("linkIrCadastro");
const linkIrLogin = document.getElementById("linkIrLogin");

let emailCadastroPendente = "";


// ==========================================
// CADASTRO
// ==========================================

formCadastro.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nome = document.getElementById("nomeCadastro").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;

    const mensagemCadastro = document.getElementById("mensagemCadastro");

    try {

        const resposta = await fetch("http://localhost:3000/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const resultado = await resposta.json();

        mensagemCadastro.innerText = resultado.mensagem;

        if (resultado.sucesso) {

            emailCadastroPendente = email;

            caixaCadastro.style.display = "none";
            caixaVerificacao.style.display = "block";

            document.getElementById("codigoVerificacao").value = "";
            document.getElementById("mensagemVerificacao").innerText = "";

        }

    } catch (erro) {

        console.error("Erro no cadastro:", erro);

        mensagemCadastro.innerText = "Erro ao conectar com o servidor.";

    }

});


// ==========================================
// CONFIRMAÇÃO DO E-MAIL
// ==========================================

formVerificacao.addEventListener("submit", async function(event) {

    event.preventDefault();

    const codigo = document.getElementById("codigoVerificacao").value.trim();

    const mensagemVerificacao = document.getElementById("mensagemVerificacao");

    try {

        const resposta = await fetch("http://localhost:3000/usuarios/verificar-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailCadastroPendente,
                codigo: codigo
            })
        });

        const resultado = await resposta.json();

        mensagemVerificacao.innerText = resultado.mensagem;

        if (resultado.sucesso) {

            mensagemVerificacao.style.color = "green";

            document.getElementById("emailLogin").value = emailCadastroPendente;

            caixaVerificacao.style.display = "none";
            caixaLogin.style.display = "block";

        } else {

            mensagemVerificacao.style.color = "red";

        }

    } catch (erro) {

        console.error("Erro na confirmação:", erro);

        mensagemVerificacao.innerText = "Erro ao conectar com o servidor.";
        mensagemVerificacao.style.color = "red";

    }

});


// ==========================================
// LOGIN
// ==========================================

formLogin.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    const mensagemLogin = document.getElementById("mensagemLogin");

    try {

        const resposta = await fetch("http://localhost:3000/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const resultado = await resposta.json();

        mensagemLogin.innerText = resultado.mensagem;

        if (resultado.sucesso) {

            mensagemLogin.style.color = "green";

            localStorage.setItem("usuario", JSON.stringify(resultado.usuario));

            window.location.href = "index.html";

        } else {

            mensagemLogin.style.color = "red";

        }

    } catch (erro) {

        console.error("Erro no login:", erro);

        mensagemLogin.innerText = "Erro ao conectar com o servidor.";
        mensagemLogin.style.color = "red";

    }

});


// ==========================================
// ALTERNAR LOGIN E CADASTRO
// ==========================================

linkIrCadastro.addEventListener("click", function(event) {

    event.preventDefault();

    caixaLogin.style.display = "none";
    caixaCadastro.style.display = "block";

});


linkIrLogin.addEventListener("click", function(event) {

    event.preventDefault();

    caixaCadastro.style.display = "none";
    caixaLogin.style.display = "block";

});
