const express = require("express");
const axios = require("axios");

const router = express.Router();

const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzExZGMyNTI5ODE5NDlhNmY1OWZhMTg5YTBhMjY5MSIsIm5iZiI6MTc4Njk3NjYwMi4xNjQsInN1YiI6IjZhODMxOTVhYTRmNTkwMGE4MTAyMjYzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._7bjInIKfxzCXTQrneiS0nJvu3uog-rigQfsqPBLDeY";

// ==========================================
// FILMES PARA O BANNER
// ==========================================

router.get("/banner", async (req, res) => {

    try {

        let filmesBanner = [];

        for (let pagina = 1; pagina <= 2; pagina++) {

            console.log(
                "Buscando filmes bem avaliados - página:",
                pagina
            );

            const resposta = await axios.get(
                "https://api.themoviedb.org/3/movie/top_rated",
                {
                    params: {
                        language: "pt-BR",
                        page: pagina
                    },
                    headers: {
                        Authorization: `Bearer ${TMDB_TOKEN}`,
                        accept: "application/json"
                    }
                }
            );

            filmesBanner = filmesBanner.concat(
                resposta.data.results
            );

        }

        // Só filmes que possuem imagem de fundo
        filmesBanner = filmesBanner.filter(
            filme => filme.backdrop_path
        );

        console.log(
            "Filmes para o banner:",
            filmesBanner.length
        );

        res.json(filmesBanner);

    } catch (erro) {

        console.error(
            erro.response?.data || erro.message
        );

        res.status(500).json({
            erro: "Não foi possível buscar os filmes do banner."
        });

    }

});

router.get("/id/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const resposta = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}`,
            {
                params: {
                    language: "pt-BR"
                },
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    accept: "application/json"
                }
            }
        );

        res.json(resposta.data);

    } catch (erro) {

        console.error(
            erro.response?.data || erro.message
        );

        res.status(500).json({
            erro: "Não foi possível buscar o filme."
        });
    }

});

router.get("/", async (req, res) => {

    try {

        let todosOsFilmes = [];

        for (let pagina = 1; pagina <= 10; pagina++) {

            console.log("Buscando página:", pagina);

            const resposta = await axios.get(
                "https://api.themoviedb.org/3/movie/popular",
                {
                    params: {
                        language: "pt-BR",
                        page: pagina
                    },
                    headers: {
                        Authorization: `Bearer ${TMDB_TOKEN}`,
                        accept: "application/json"
                    }
                }
            );

            todosOsFilmes = todosOsFilmes.concat(
                resposta.data.results
            );
        }

        console.log("TOTAL:", todosOsFilmes.length);

        res.json(todosOsFilmes);

    } catch (erro) {

        console.error(
            erro.response?.data || erro.message
        );

        res.status(500).json({
            erro: "Não foi possível buscar os filmes."
        });
    }

});

router.get("/buscar", async (req, res) => {

    try {

        const nome = req.query.nome;

        const resposta = await axios.get(
            "https://api.themoviedb.org/3/search/movie",
            {
                params: {
                    query: nome,
                    language: "pt-BR",
                    page: 1
                },
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    accept: "application/json"
                }
            }
        );

        res.json(resposta.data.results);

    } catch (erro) {

        console.error(
            erro.response?.data || erro.message
        );

        res.status(500).json({
            erro: "Não foi possível pesquisar os filmes."
        });
    }

});

module.exports = router;