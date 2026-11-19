
console.log("LOGIN.JS ESTÁ FUNCIONANDO!");

const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");

const caixaLogin = document.getElementById("caixaLogin");
const caixaCadastro = document.getElementById("caixaCadastro");

const linkIrCadastro = document.getElementById("linkIrCadastro");
const linkIrLogin = document.getElementById("linkIrLogin");

// ==========================================
// TELA INICIAL: LOGIN
// ==========================================

caixaLogin.style.display = "block";
caixaCadastro.style.display = "none";


// ==========================================
// CADASTRO
// ==========================================

formCadastro.addEventListener("submit", async function(event) {

    console.log("BOTÃO CADASTRAR FOI ACIONADO!");

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

        console.log("RESPOSTA DO SERVIDOR:", resultado);

        mensagemCadastro.innerText = resultado.mensagem;

        if (resultado.sucesso) {

            mensagemCadastro.style.color = "green";

            // Limpa os campos do cadastro
            formCadastro.reset();

            // Volta para a tela de login
            document.getElementById("emailLogin").value = email;

            caixaCadastro.style.display = "none";
            caixaLogin.style.display = "block";

        } else {

            mensagemCadastro.style.color = "red";

        }

    } catch (erro) {

        console.error("Erro no cadastro:", erro);

        mensagemCadastro.innerText = "Erro ao conectar com o servidor.";
        mensagemCadastro.style.color = "red";

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
