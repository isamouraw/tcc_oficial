
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

async function testar() {
    try {
        await transporter.verify();
        console.log("CONEXÃO COM A BREVO REALIZADA COM SUCESSO!");
    } catch (erro) {
        console.error("ERRO NA CONEXÃO:", erro.message);
    }
}

testar();
