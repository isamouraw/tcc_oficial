const { enviarCodigoVerificacao } = require("./email");

async function testar() {
    const enviado = await enviarCodigoVerificacao(
        "cinetrack.oficial@gmail.com",
        "123456"
    );

    console.log(enviado ? "E-MAIL ENVIADO!" : "ERRO NO ENVIO!");
}

testar();