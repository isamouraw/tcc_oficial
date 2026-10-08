async function carregarLista() {
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        // Verifica se existe usuário logado
        if (!usuario) {
            window.location.href = "login.html";
            return;
        }

        const lista = document.getElementById("listaFilmes");

        // Busca os filmes da lista desse usuário
        const respostaLista = await fetch(
            `http://localhost:3000/lista/${usuario.id}`
        );

        if (!respostaLista.ok) {
            throw new Error("Erro ao buscar lista");
        }

        const filmesLista = await respostaLista.json();

        console.log("LISTA:", filmesLista);

        // Se não tiver nenhum filme na lista
        if (filmesLista.length === 0) {
            lista.innerHTML = `
                <p class="sem-favoritos">
                    Você ainda não adicionou nenhum filme à sua lista.
                </p>
            `;
            return;
        }

        lista.innerHTML = "";

        // Busca os filmes do backend
        const respostaFilmes = await fetch(
            "http://localhost:3000/filmes"
        );

        if (!respostaFilmes.ok) {
            throw new Error("Erro ao buscar filmes");
        }

        const filmes = await respostaFilmes.json();

        // Para cada filme da lista
        filmesLista.forEach(function (item) {

            // Procura o filme correspondente
            const filme = filmes.find(function (filme) {
                return Number(filme.id) === Number(item.filme_id);
            });

            // Se o filme não estiver entre os carregados
            if (!filme) {
                return;
            }

            const card = document.createElement("div");
            card.classList.add("card");

            const poster = filme.poster_path
                ? "https://image.tmdb.org/t/p/w500" + filme.poster_path
                : "./assets/sem-poster.jpg";

            card.innerHTML = `
                <img
                    class="card-img"
                    src="${poster}"
                    alt="${filme.title}"
                >

                <h2>${filme.title}</h2>

                <p>
                    ⭐ ${Number(filme.vote_average).toFixed(1)}/10
                </p>

                <p>
                    ${filme.overview || "Descrição não disponível."}
                </p>

                <button class="btn-lista" type="button">
                    ✓ Na Lista
                </button>

                <button class="btn-avaliar" type="button">
                    ⭐ Avaliar
                </button>
            `;

            const botaoLista =
                card.querySelector(".btn-lista");

            const botaoAvaliar =
                card.querySelector(".btn-avaliar");

                card.onclick = function () {

                    window.location.href =
                        "avaliacao.html?id=" + filme.id;
                
                };


            // ==========================================
            // REMOVER DA LISTA
            // ==========================================

            botaoLista.onclick = async function (event) {

                event.stopPropagation();

                try {

                    botaoLista.disabled = true;

                    const resposta = await fetch(
                        "http://localhost:3000/lista",
                        {
                            method: "DELETE",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                usuario_id: usuario.id,
                                filme_id: filme.id
                            })
                        }
                    );

                    const dados = await resposta.json();

                    console.log("REMOVER DA LISTA:", dados);

                    if (!resposta.ok) {
                        throw new Error(
                            dados.erro ||
                            "Erro ao remover filme da lista"
                        );
                    }

                    // Remove o card da tela
                    card.remove();

                    // Verifica se ficou sem filmes
                    if (lista.children.length === 0) {
                        lista.innerHTML = `
                            <p class="sem-favoritos">
                                Você ainda não adicionou nenhum filme à sua lista.
                            </p>
                        `;
                    }

                } catch (erro) {

                    console.error(
                        "ERRO AO REMOVER DA LISTA:",
                        erro
                    );

                    alert(
                        "Não foi possível remover o filme da lista."
                    );

                    botaoLista.disabled = false;
                }
            };


            // ==========================================
            // AVALIAR
            // ==========================================

            botaoAvaliar.onclick = function () {

                window.location.href =
                    "avaliacao.html?id=" + filme.id;
            };

            lista.appendChild(card);
        });

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR LISTA:",
            erro
        );

        const lista = document.getElementById("listaFilmes");

        if (lista) {
            lista.innerHTML = `
                <p>
                    Não foi possível carregar sua lista.
                </p>
            `;
        }
    }
}

carregarLista();