async function carregarFilme() {

    try {

        const parametros =
            new URLSearchParams(window.location.search);

        const idFilme =
            parametros.get("id");

        if (!idFilme) {
            throw new Error("ID do filme não encontrado");
        }

        const resposta =
            await fetch("http://localhost:3000/filmes");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar filmes");
        }

        const filmes =
            await resposta.json();

        const filme =
            filmes.find(function (filme) {
                return filme.id == idFilme;
            });

        if (!filme) {
            throw new Error("Filme não encontrado");
        }

        const detalhes =
            document.getElementById("detalhesFilme");

        const poster =
            filme.poster_path
                ? "https://image.tmdb.org/t/p/w500" +
                  filme.poster_path
                : "./assets/sem-poster.jpg";

        detalhes.innerHTML = `

            <img
                src="${poster}"
                alt="${filme.title}"
            >

            <div>

                <h1>
                    ${filme.title}
                </h1>

                <p>
                    ${
                        filme.overview ||
                        "Descrição não disponível."
                    }
                </p>

                <p>
                    ⭐ ${
                        Number(filme.vote_average).toFixed(1)
                    }/10
                </p>

                <button id="btnAvaliar">
                    ⭐ Avaliar filme
                </button>

            </div>

        `;

    } catch (erro) {

        console.error(erro);

        document.getElementById(
            "detalhesFilme"
        ).innerHTML =
            "<p>Não foi possível carregar o filme.</p>";
    }
}

carregarFilme();