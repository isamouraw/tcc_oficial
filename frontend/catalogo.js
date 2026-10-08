let todosOsFilmes = [];
async function carregarFilmes() {
    try {
        const resposta = await fetch("http://localhost:3000/filmes");

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const filmes = await resposta.json();
        todosOsFilmes = filmes;

        console.log("FILMES DO CATÁLOGO:", filmes);

        const lista = document.getElementById("listaFilmes");

        if (!lista) {
            throw new Error("Elemento listaFilmes não encontrado");
        }

        lista.innerHTML = "";

        const usuario = JSON.parse(localStorage.getItem("usuario"));

        filmes.forEach(async function (filme) {

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

                <p>⭐ ${Number(filme.vote_average).toFixed(1)}/10</p>

                <p>${filme.overview || "Descrição não disponível."}</p>

                <button class="btn-favoritar" type="button">
                    ♡ Favoritar
                </button>

                <button class="btn-lista" type="button">
                    + Adicionar à Lista
                </button>

                <button class="btn-avaliar" type="button">
                    ⭐ Avaliar
                </button>
            `;

            const botaoFavoritar =
                card.querySelector(".btn-favoritar");

            const botaoLista =
                card.querySelector(".btn-lista");

            const botaoAvaliar =
                card.querySelector(".btn-avaliar");

                card.onclick = function () {
                    const usuario = localStorage.getItem("usuario");
                
                    if (!usuario) {
                        window.location.href = "login.html";
                        return;
                    }
                
                    window.location.href =
                        "avaliacao.html?id=" + filme.id;
                };


            // ==========================================
            // VERIFICAR SE O FILME JÁ É FAVORITO
            // ==========================================

            if (usuario) {
                try {

                    const respostaFavorito = await fetch(
                        `http://localhost:3000/favoritos/${usuario.id}/${filme.id}`
                    );

                    if (respostaFavorito.ok) {

                        const dadosFavorito =
                            await respostaFavorito.json();

                        if (dadosFavorito.favorito) {
                            botaoFavoritar.textContent =
                                "♥ Favoritado";
                        }
                    }

                } catch (erro) {

                    console.error(
                        "Erro ao verificar favorito:",
                        erro
                    );
                }
            }


            // ==========================================
            // VERIFICAR SE O FILME JÁ ESTÁ NA LISTA
            // ==========================================

            if (usuario) {
                try {

                    const respostaLista = await fetch(
                        `http://localhost:3000/lista/${usuario.id}/${filme.id}`
                    );

                    if (respostaLista.ok) {

                        const dadosLista =
                            await respostaLista.json();

                        if (dadosLista.naLista) {
                            botaoLista.textContent =
                                "✓ Na Lista";
                        }
                    }

                } catch (erro) {

                    console.error(
                        "Erro ao verificar lista:",
                        erro
                    );
                }
            }


            // ==========================================
            // FAVORITAR / DESFAVORITAR
            // ==========================================

            botaoFavoritar.onclick = async function (event) {

                event.preventDefault();
                event.stopPropagation();

                const usuarioAtual = JSON.parse(
                    localStorage.getItem("usuario")
                );

                if (!usuarioAtual) {
                    window.location.href = "login.html";
                    return;
                }

                const estaFavoritado =
                    botaoFavoritar.textContent.includes("Favoritado");

                try {

                    botaoFavoritar.disabled = true;

                    let resposta;

                    if (estaFavoritado) {

                        // DESFAVORITAR
                        resposta = await fetch(
                            "http://localhost:3000/favoritos",
                            {
                                method: "DELETE",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    usuario_id: usuarioAtual.id,
                                    filme_id: filme.id
                                })
                            }
                        );

                    } else {

                        // FAVORITAR
                        resposta = await fetch(
                            "http://localhost:3000/favoritos",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    usuario_id: usuarioAtual.id,
                                    filme_id: filme.id
                                })
                            }
                        );
                    }

                    const dados = await resposta.json();

                    console.log("RESPOSTA FAVORITO:", dados);

                    if (!resposta.ok) {
                        throw new Error(
                            dados.erro ||
                            "Erro ao alterar favorito"
                        );
                    }

                    if (estaFavoritado) {

                        botaoFavoritar.textContent =
                            "♡ Favoritar";

                    } else {

                        botaoFavoritar.textContent =
                            "♥ Favoritado";
                    }

                } catch (erro) {

                    console.error(
                        "ERRO AO ALTERAR FAVORITO:",
                        erro
                    );

                    alert(
                        "Não foi possível alterar o favorito."
                    );

                } finally {

                    botaoFavoritar.disabled = false;

                }
            };


            // ==========================================
            // ADICIONAR / REMOVER DA LISTA
            // ==========================================

            botaoLista.onclick = async function (event) {

                event.preventDefault();
                event.stopPropagation();

                const usuarioAtual = JSON.parse(
                    localStorage.getItem("usuario")
                );

                if (!usuarioAtual) {
                    window.location.href = "login.html";
                    return;
                }

                const estaNaLista =
                    botaoLista.textContent.includes("Na Lista");

                try {

                    botaoLista.disabled = true;

                    let resposta;

                    if (estaNaLista) {

                        // REMOVER DA LISTA
                        resposta = await fetch(
                            "http://localhost:3000/lista",
                            {
                                method: "DELETE",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    usuario_id: usuarioAtual.id,
                                    filme_id: filme.id
                                })
                            }
                        );

                    } else {

                        // ADICIONAR À LISTA
                        resposta = await fetch(
                            "http://localhost:3000/lista",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    usuario_id: usuarioAtual.id,
                                    filme_id: filme.id
                                })
                            }
                        );
                    }

                    const dados = await resposta.json();

                    console.log("RESPOSTA LISTA:", dados);

                    if (!resposta.ok) {
                        throw new Error(
                            dados.erro ||
                            "Erro ao alterar lista"
                        );
                    }

                    if (estaNaLista) {

                        botaoLista.textContent =
                            "+ Adicionar à Lista";

                    } else {

                        botaoLista.textContent =
                            "✓ Na Lista";
                    }

                } catch (erro) {

                    console.error(
                        "ERRO AO ALTERAR LISTA:",
                        erro
                    );

                    alert(
                        "Não foi possível alterar a lista."
                    );

                } finally {

                    botaoLista.disabled = false;

                }
            };


            // ==========================================
            // AVALIAR
            // ==========================================

            botaoAvaliar.onclick = function (event) {

                event.preventDefault();
                event.stopPropagation();

                const usuario = localStorage.getItem("usuario");

                if (!usuario) {
                    window.location.href = "login.html";
                    return;
                }

                window.location.href =
                    "avaliacao.html?id=" + filme.id;
            };


            lista.appendChild(card);
        });

    } catch (erro) {

        console.error("ERRO NO CATÁLOGO:", erro);

        const lista =
            document.getElementById("listaFilmes");

        if (lista) {
            lista.innerHTML =
                "<p>Não foi possível carregar os filmes.</p>";
        }
    }
}

carregarFilmes();

console.log("CATALOGO.JS FOI CARREGADO!");

function pesquisarFilmes() {

    const pesquisa =
        document.getElementById("pesquisaFilme").value
        .toLowerCase()
        .trim();

    const cards =
        document.querySelectorAll("#listaFilmes .card");

    cards.forEach(function (card) {

        const titulo =
            card.querySelector("h2").textContent.toLowerCase();

        if (titulo.includes(pesquisa)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });
}

document
    .getElementById("pesquisaFilme")
    .addEventListener("input", pesquisarFilmes);