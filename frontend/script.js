const carrossel = document.getElementById("carrossel-cards");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");


// ==========================================
// CARROSSEL
// ==========================================

btnNext.addEventListener("click", function () {

    carrossel.scrollBy({
        left: 460,
        behavior: "smooth"
    });

});

btnPrev.addEventListener("click", function () {

    carrossel.scrollBy({
        left: -460,
        behavior: "smooth"
    });

});


// ==========================================
// PESQUISA DE FILMES
// ==========================================

const campoPesquisa =
    document.getElementById("campoPesquisa");

const sugestoesPesquisa =
    document.getElementById("sugestoesPesquisa");

let filmes = [];


// ==========================================
// BUSCAR FILMES PARA OS CARDS
// ==========================================

fetch("http://localhost:3000/filmes")

    .then(resposta => {

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        return resposta.json();

    })

    .then(dados => {

        filmes = dados;

        console.log(
            "Filmes recebidos:",
            filmes
        );

        // Criar os cards
        criarCards(filmes);

    })

    .catch(erro => {

        console.error(
            "Erro ao buscar filmes:",
            erro
        );

    });


// ==========================================
// BUSCAR FILMES PARA O BANNER
// ==========================================

fetch("http://localhost:3000/filmes/banner")

    .then(resposta => {

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        return resposta.json();

    })

    .then(filmesBanner => {

        console.log(
            "Filmes do banner:",
            filmesBanner
        );


        const banner =
            document.getElementById("bannerPrincipal");

        const btnExplorar =
            document.getElementById("btnExplorar");

        const bannerDescricao =
            document.getElementById("bannerDescricao");


        if (!filmesBanner.length) {

            console.log(
                "Nenhum filme disponível para o banner."
            );

            return;

        }


        // ======================================
        // ÍNDICE DO BANNER
        // ======================================

        let indiceBanner = 0;


        // ======================================
        // ATUALIZAR BANNER
        // ======================================

        function atualizarBanner() {

            const filme =
                filmesBanner[indiceBanner];


            if (!filme) {
                return;
            }


            // ==================================
            // IMAGEM DE FUNDO
            // ==================================

            if (filme.backdrop_path) {

                const imagemBanner =
                    "https://image.tmdb.org/t/p/original" +
                    filme.backdrop_path;


                banner.style.backgroundImage = `
                    linear-gradient(
                        to right,
                        rgba(5, 5, 15, 0.95),
                        rgba(5, 5, 15, 0.60),
                        rgba(5, 5, 15, 0.20)
                    ),
                    url("${imagemBanner}")
                `;

            }


            // ==================================
            // DESCRIÇÃO
            // ==================================

            bannerDescricao.textContent =
                filme.overview ||
                "Descubra filmes incríveis no CineTrack.";


                        // ==================================
                // BOTÃO EXPLORAR FILMES
                // ==================================

                btnExplorar.onclick = function () {

                    window.location.href = "Filmes.html";

                };

                        }


        // Mostra o primeiro filme
        atualizarBanner();


        // ======================================
        // TROCAR AUTOMATICAMENTE
        // ======================================

        setInterval(function () {

            indiceBanner++;

            if (
                indiceBanner >= filmesBanner.length
            ) {

                indiceBanner = 0;

            }

            atualizarBanner();

        }, 7000);

    })

    .catch(erro => {

        console.error(
            "Erro ao buscar filmes do banner:",
            erro
        );

    });


// ==========================================
// CRIAR CARDS DOS FILMES
// ==========================================

function criarCards(listaFilmes) {

    carrossel.innerHTML = "";


    listaFilmes
        .slice(0, 10)
        .forEach(function (filme) {

            const card =
                document.createElement("div");

            card.classList.add("card");


            // ======================================
            // POSTER
            // ======================================

            let poster;

            if (filme.poster_path) {

                poster =
                    "https://image.tmdb.org/t/p/w500" +
                    filme.poster_path;

            } else {

                poster =
                    "./assets/sem-poster.jpg";

            }


            // ======================================
            // CONTEÚDO DO CARD
            // ======================================

            card.innerHTML = `

                <img
                    class="card-img"
                    src="${poster}"
                    alt="${filme.title}"
                >

                <h3>
                    ${filme.title}
                </h3>

                <p>
                    ${
                        filme.overview ||
                        "Descrição não disponível."
                    }
                </p>

                <span class="preco">
                    ⭐ ${
                        filme.vote_average
                            ? Number(filme.vote_average).toFixed(1)
                            : "N/A"
                    }/10
                </span>

                <button
                    class="btn-favoritar"
                    type="button"
                >
                    ♡ Favoritar
                </button>

                <button
                    class="btn-comprar"
                    type="button"
                >
                    Avaliar
                </button>

            `;


            // ======================================
            // CLIQUE NO CARD
            // ======================================

            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "filme.html?id=" + filme.id;

                }
            );


            // ======================================
            // BOTÕES
            // ======================================

            const btnFavoritar =
                card.querySelector(".btn-favoritar");

            const btnAvaliar =
                card.querySelector(".btn-comprar");


            // ======================================
            // VERIFICAR SE JÁ É FAVORITO
            // ======================================

            async function verificarFavorito() {

                const usuario = JSON.parse(
                    localStorage.getItem("usuario")
                );

                if (!usuario) {
                    return;
                }

                try {

                    const resposta = await fetch(
                        `http://localhost:3000/favoritos/${usuario.id}/${filme.id}`
                    );

                    if (!resposta.ok) {
                        return;
                    }

                    const dados =
                        await resposta.json();

                    if (dados.favorito) {

                        btnFavoritar.textContent =
                            "♥ Favoritado";

                    } else {

                        btnFavoritar.textContent =
                            "♡ Favoritar";

                    }

                } catch (erro) {

                    console.error(
                        "Erro ao verificar favorito:",
                        erro
                    );

                }

            }


            verificarFavorito();


            // ======================================
            // FAVORITAR / DESFAVORITAR
            // ======================================

            btnFavoritar.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const usuario = JSON.parse(
                        localStorage.getItem("usuario")
                    );


                    if (!usuario) {

                        alert(
                            "Você precisa estar logado para favoritar um filme."
                        );

                        return;

                    }


                    const estaFavoritado =
                        btnFavoritar.textContent.includes(
                            "Favoritado"
                        );


                    try {

                        btnFavoritar.disabled = true;

                        let resposta;


                        // DESFAVORITAR

                        if (estaFavoritado) {

                            resposta = await fetch(
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

                        }


                        // FAVORITAR

                        else {

                            resposta = await fetch(
                                "http://localhost:3000/favoritos",
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

                        }


                        const dados =
                            await resposta.json();


                        console.log(
                            "RESPOSTA FAVORITO:",
                            dados
                        );


                        if (!resposta.ok) {

                            throw new Error(
                                dados.erro ||
                                "Erro ao alterar favorito"
                            );

                        }


                        // ATUALIZAR BOTÃO

                        if (estaFavoritado) {

                            btnFavoritar.textContent =
                                "♡ Favoritar";

                        } else {

                            btnFavoritar.textContent =
                                "♥ Favoritado";

                        }

                    } catch (erro) {

                        console.error(
                            "Erro ao alterar favorito:",
                            erro
                        );

                        alert(
                            "Não foi possível alterar o favorito."
                        );

                    } finally {

                        btnFavoritar.disabled = false;

                    }

                }
            );


            // ======================================
            // BOTÃO AVALIAR
            // ======================================

            btnAvaliar.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    window.location.href =
                        "filme.html?id=" +
                        filme.id;

                }
            );


            carrossel.appendChild(card);

        });

}


// ==========================================
// PESQUISA
// ==========================================

campoPesquisa.addEventListener(
    "input",
    function () {

        const texto =
            campoPesquisa.value
                .trim()
                .toLowerCase();


        sugestoesPesquisa.innerHTML = "";


        if (texto === "") {

            sugestoesPesquisa.style.display =
                "none";

            return;

        }


        // ======================================
        // FILTRAR FILMES
        // ======================================

        const resultados =
            filmes.filter(function (filme) {

                return filme.title
                    .toLowerCase()
                    .includes(texto);

            });


        console.log(
            "Resultados encontrados:",
            resultados
        );


        // ======================================
        // CRIAR SUGESTÕES
        // ======================================

        resultados
            .slice(0, 5)
            .forEach(function (filme) {

                const sugestao =
                    document.createElement("div");

                sugestao.classList.add(
                    "sugestao"
                );


                // POSTER

                if (filme.poster_path) {

                    const poster =
                        document.createElement("img");

                    poster.classList.add(
                        "poster-pesquisa"
                    );

                    poster.src =
                        "https://image.tmdb.org/t/p/w92" +
                        filme.poster_path;

                    poster.alt =
                        filme.title;

                    sugestao.appendChild(
                        poster
                    );

                }


                // TÍTULO

                const titulo =
                    document.createElement("span");

                titulo.textContent =
                    filme.title;

                sugestao.appendChild(
                    titulo
                );


                // CLIQUE

                sugestao.addEventListener(
                    "click",
                    function () {

                        campoPesquisa.value =
                            filme.title;

                        sugestoesPesquisa.innerHTML =
                            "";

                        sugestoesPesquisa.style.display =
                            "none";


                        window.location.href =
                            "filme.html?id=" +
                            filme.id;

                    }
                );


                sugestoesPesquisa.appendChild(
                    sugestao
                );

            });


        // ======================================
        // MOSTRAR / ESCONDER
        // ======================================

        if (resultados.length > 0) {

            sugestoesPesquisa.style.display =
                "block";

        } else {

            sugestoesPesquisa.style.display =
                "none";

        }

    }
);

// ==========================================
// COMENTÁRIOS MAIS CURTIDOS
// ==========================================

async function carregarComentariosMaisCurtidos() {

    const lista =
        document.getElementById("listaComentariosCurtidos");

    if (!lista) {
        return;
    }

    try {

        const resposta = await fetch(
            "http://localhost:3000/avaliacoes/mais-curtidas"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar comentários.");
        }

        const avaliacoes =
            await resposta.json();

        console.log(
            "COMENTÁRIOS MAIS CURTIDOS:",
            avaliacoes
        );

        lista.innerHTML = "";

        if (avaliacoes.length === 0) {

            lista.innerHTML =
                `<p class="sem-comentarios">
                    Ainda não existem comentários.
                </p>`;

            return;
        }


        avaliacoes.forEach(function (avaliacao) {

            const card =
                document.createElement("div");

            card.classList.add(
                "comentario-card"
            );


            const nome =
                avaliacao.nome || "Usuário";


            const quantidadeCurtidas =
                Number(avaliacao.curtidas) || 0;


            const estrelas =
                "⭐".repeat(
                    Math.round(Number(avaliacao.nota))
                );


            card.innerHTML = `

                <div class="comentario-usuario">

                    <div class="comentario-foto">
                        👤
                    </div>

                    <strong>
                        ${nome}
                    </strong>

                </div>


                <div class="comentario-estrelas">
                    ${estrelas}
                </div>


                <p class="comentario-texto">
                    "${avaliacao.comentario}"
                </p>


                <div class="comentario-curtidas">
                    ♥ ${quantidadeCurtidas}
                    ${
                        quantidadeCurtidas === 1
                            ? "curtida"
                            : "curtidas"
                    }
                </div>

            `;


            lista.appendChild(card);

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar comentários mais curtidos:",
            erro
        );

        lista.innerHTML =
            `<p class="sem-comentarios">
                Não foi possível carregar os comentários.
            </p>`;

    }

}


carregarComentariosMaisCurtidos();