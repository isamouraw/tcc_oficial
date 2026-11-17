require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function enviarCodigoVerificacao(email, codigo) {
    try {
        await transporter.sendMail({
            from: `"CineTrack" <${process.env.EMAIL_REMETENTE}>`,
            to: email,
            subject: "Código de confirmação - CineTrack",
            text: `Seu código de confirmação é: ${codigo}. Ele é válido por 10 minutos.`,
            html: `
                <div style="font-family: Arial; background: #090909; color: white; padding: 30px;">
                    <h1 style="color: #7958B8;">CineTrack</h1>
                    <p>Olá! Use o código abaixo para confirmar seu cadastro:</p>
                    <h2 style="letter-spacing: 5px; color: #a78bfa;">${codigo}</h2>
                    <p>Esse código é válido por 10 minutos.</p>
                </div>
            `
        });

        console.log("E-mail enviado com sucesso!");
        return true;

    } catch (erro) {
        console.error("Erro ao enviar e-mail:", erro.message);
        return false;
    }
}

module.exports = { enviarCodigoVerificacao };