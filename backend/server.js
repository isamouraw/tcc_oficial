const express = require("express");
const cors = require("cors");
const path = require("path");
 
const usuarioRoutes = require("./routes/usuarioRoutes.js");
const filmesRoutes = require("./routes/filmeRoutes.js");
const avaliacaoRoutes = require("./routes/avaliacaoRoutes.js");
const favoritoRoutes = require("./routes/favoritoRoutes.js");
const listaRoutes = require("./routes/listaRoutes.js");

const app = express();
 
app.use(cors());
app.use(express.json());
 
app.use(express.static(path.join(__dirname, "../frontend")));
 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/home.html"));
});
 
// Rotas da API
app.use("/usuarios", usuarioRoutes);
app.use("/filmes", filmesRoutes);
console.log("ROTAS DE AVALIAÇÕES CARREGADAS!");
app.use("/avaliacoes", avaliacaoRoutes);
app.use("/favoritos", favoritoRoutes);
app.use("/lista", listaRoutes);
 
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});