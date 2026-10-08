async function carregarFavoritos() {

    try {

        const usuario = JSON.parse(
            localStorage.getItem("usuario")
        );

        // Verifica se existe usuário logado
        if (!usuario) {
            window.location.href = "login.html";
            return;
        }

        const lista =
            document.getElementById("listaFavoritos");

        // Busca os favoritos do usuário
        const respostaFavoritos = await fetch(
            `http://localhost:3000/favoritos/${usuario.id}`
        );

        if (!respostaFavoritos.ok) {
            throw new Error("Erro ao buscar favoritos");
        }

        const favoritos =
            await respostaFavoritos.json();

        console.log("FAVORITOS:", favoritos);

        // Se não tiver favoritos
        if (favoritos.length === 0) {

            lista.innerHTML = `
                <p class="sem-favoritos">
                    Você ainda não adicionou nenhum filme aos favoritos.
                </p>
            `;

            return;
        }

        lista.innerHTML = "";

        // Busca os filmes
        const respostaFilmes = await fetch(
            "http://localhost:3000/filmes"
        );

        if (!respostaFilmes.ok) {
            throw new Error("Erro ao buscar filmes");
        }

        const filmes = await respostaFilmes.json();


        // Cria os cards dos favoritos
        favoritos.forEach(function (item) {

            const filme = filmes.find(function (filme) {

                return Number(filme.id) ===
                    Number(item.filme_id);

            });

            // Se não encontrar o filme
            if (!filme) {
                return;
            }


            const card =
                document.createElement("div");

            card.classList.add("card");


            const poster = filme.poster_path
                ? "https://image.tmdb.org/t/p/w500" +
                  filme.poster_path
                : "./assets/sem-poster.jpg";


            card.innerHTML = `

                <img
                    class="card-img"
                    src="${poster}"
                    alt="${filme.title}"
                >

                <h2>
                    ${filme.title}
                </h2>

                <p>
                    ⭐ ${Number(
                        filme.vote_average
                    ).toFixed(1)}/10
                </p>

                <p>
                    ${
                        filme.overview ||
                        "Descrição não disponível."
                    }
                </p>

                <button
                    class="btn-favoritar"
                    type="button"
                >
                    ♥ Favoritado
                </button>

                <button
                    class="btn-lista"
                    type="button"
                >
                    + Adicionar à Lista
                </button>

                <button
                    class="btn-avaliar"
                    type="button"
                >
                    ⭐ Avaliar
                </button>

            `;


            const botaoFavoritar =
                card.querySelector(
                    ".btn-favoritar"
                );

            const botaoLista =
                card.querySelector(
                    ".btn-lista"
                );

            const botaoAvaliar =
                card.querySelector(
                    ".btn-avaliar"
                );

                card.onclick = function () {

                    window.location.href =
                        "avaliacao.html?id=" +
                        filme.id;
                
                };


            // ==========================================
            // DESFAVORITAR
            // ==========================================

            botaoFavoritar.onclick =
            async function (event) {
        
                event.stopPropagation();

                    try {

                        botaoFavoritar.disabled =
                            true;

                        const resposta =
                            await fetch(
                                "http://localhost:3000/favoritos",
                                {
                                    method: "DELETE",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({
                                        usuario_id:
                                            usuario.id,

                                        filme_id:
                                            filme.id
                                    })
                                }
                            );


                        const dados =
                            await resposta.json();


                        console.log(
                            "REMOVER FAVORITO:",
                            dados
                        );


                        if (!resposta.ok) {

                            throw new Error(
                                dados.erro ||
                                "Erro ao remover favorito"
                            );

                        }


                        // Remove o card da página
                        card.remove();


                        // Se ficou sem favoritos
                        if (
                            lista.children.length === 0
                        ) {

                            lista.innerHTML = `
                                <p class="sem-favoritos">
                                    Você ainda não adicionou nenhum filme aos favoritos.
                                </p>
                            `;

                        }

                    } catch (erro) {

                        console.error(
                            "ERRO AO REMOVER FAVORITO:",
                            erro
                        );

                        alert(
                            "Não foi possível remover o favorito."
                        );

                        botaoFavoritar.disabled =
                            false;
                    }

                };


            // ==========================================
            // ADICIONAR À LISTA
            // ==========================================

            botaoLista.onclick =
            async function (event) {

                 event.stopPropagation();

                    try {

                        botaoLista.disabled =
                            true;


                        const resposta =
                            await fetch(
                                "http://localhost:3000/lista",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({
                                        usuario_id:
                                            usuario.id,

                                        filme_id:
                                            filme.id
                                    })
                                }
                            );


                        const dados =
                            await resposta.json();


                        if (!resposta.ok) {

                            // Se já estiver na lista
                            if (
                                resposta.status === 500
                            ) {

                                console.log(
                                    "Filme possivelmente já está na lista."
                                );

                            }

                            throw new Error(
                                dados.erro ||
                                "Erro ao adicionar à lista"
                            );

                        }


                        botaoLista.textContent =
                            "✓ Na Lista";


                    } catch (erro) {

                        console.error(
                            "ERRO AO ADICIONAR À LISTA:",
                            erro
                        );

                        alert(
                            "Não foi possível adicionar o filme à lista."
                        );

                    } finally {

                        botaoLista.disabled =
                            false;
                    }

                };


            // ==========================================
            // AVALIAR
            // ==========================================

            botaoAvaliar.onclick =
                function () {

                    window.location.href =
                        "avaliacao.html?id=" +
                        filme.id;

                };


            lista.appendChild(card);

        });

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR FAVORITOS:",
            erro
        );

        const lista =
            document.getElementById(
                "listaFavoritos"
            );

        if (lista) {

            lista.innerHTML = `
                <p>
                    Não foi possível carregar seus favoritos.
                </p>
            `;

        }

    }

}


carregarFavoritos();