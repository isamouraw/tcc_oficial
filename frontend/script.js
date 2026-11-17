
const carrossel = document.getElementById("carrossel-cards");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");

const campoPesquisa = document.getElementById("campoPesquisa");
const sugestoesPesquisa = document.getElementById("sugestoesPesquisa");

let filmes = [];


// ==========================================
// CARROSSEL
// ==========================================

if (btnNext && carrossel) {
    btnNext.addEventListener("click", function () {
        carrossel.scrollBy({
            left: 460,
            behavior: "smooth"
        });
    });
}

if (btnPrev && carrossel) {
    btnPrev.addEventListener("click", function () {
        carrossel.scrollBy({
            left: -460,
            behavior: "smooth"
        });
    });
}


// ==========================================
// BUSCAR FILMES
// ==========================================

async function carregarFilmes() {
    try {
        const resposta = await fetch("http://localhost:3000/filmes");

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        filmes = await resposta.json();

        console.log("FILMES RECEBIDOS:", filmes);

        criarCards(filmes);

    } catch (erro) {
        console.error("Erro ao buscar filmes:", erro);
    }
}


// ==========================================
// BANNER PRINCIPAL
// ==========================================

async function carregarBanner() {
    try {
        const resposta = await fetch("http://localhost:3000/filmes/banner");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar banner.");
        }

        const filmesBanner = await resposta.json();

        console.log("FILMES DO BANNER:", filmesBanner);

        const banner = document.getElementById("bannerPrincipal");
        const btnExplorar = document.getElementById("btnExplorar");
        const bannerDescricao = document.getElementById("bannerDescricao");

        if (!banner || !bannerDescricao || !btnExplorar || !filmesBanner.length) {
            return;
        }

        let indiceBanner = 0;

        function atualizarBanner() {
            const filme = filmesBanner[indiceBanner];

            if (!filme) return;

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

            bannerDescricao.textContent =
                filme.overview ||
                "Descubra filmes incríveis no CineTrack.";
        }

        btnExplorar.onclick = function () {
            window.location.href = "Filmes.html";
        };

        atualizarBanner();

        setInterval(function () {
            indiceBanner++;

            if (indiceBanner >= filmesBanner.length) {
                indiceBanner = 0;
            }

            atualizarBanner();
        }, 7000);

    } catch (erro) {
        console.error("Erro ao carregar banner:", erro);
    }
}


// ==========================================
// CRIAR CARDS DOS FILMES
// ==========================================

function criarCards(listaFilmes) {
    if (!carrossel) return;

    carrossel.innerHTML = "";

    listaFilmes.slice(0, 10).forEach(function (filme) {
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

            <h3>${filme.title}</h3>

            <p>
                ${filme.overview || "Descrição não disponível."}
            </p>

            <span class="preco">
                ⭐ ${
                    filme.vote_average
                        ? Number(filme.vote_average).toFixed(1)
                        : "N/A"
                }/10
            </span>

            <button class="btn-favoritar" type="button">
                ♡ Favoritar
            </button>

            <button class="btn-comprar" type="button">
                Avaliar
            </button>
        `;

       card.addEventListener("click", function (event) {
        if (event.target.closest("button")) {
          return;
      }
        window.location.href = "avaliacao.html?id=" + filme.id;
    });

        const btnFavoritar = card.querySelector(".btn-favoritar");
        const btnAvaliar = card.querySelector(".btn-comprar");

        // VERIFICAR FAVORITO
        async function verificarFavorito() {
            const usuario = JSON.parse(
                localStorage.getItem("usuario")
            );

            if (!usuario) return;

            try {
                const resposta = await fetch(
                    `http://localhost:3000/favoritos/${usuario.id}/${filme.id}`
                );

                if (!resposta.ok) return;

                const dados = await resposta.json();

                btnFavoritar.textContent = dados.favorito
                    ? "♥ Favoritado"
                    : "♡ Favoritar";

            } catch (erro) {
                console.error("Erro ao verificar favorito:", erro);
            }
        }

        verificarFavorito();

        // FAVORITAR / DESFAVORITAR
        btnFavoritar.addEventListener("click", async function (event) {
            event.preventDefault();
            event.stopPropagation();

            const usuario = JSON.parse(
                localStorage.getItem("usuario")
            );

            if (!usuario) {
                alert("Você precisa estar logado para favoritar um filme.");
                window.location.href = "login.html";
                return;
            }

            const estaFavoritado =
                btnFavoritar.textContent.includes("Favoritado");

            try {
                btnFavoritar.disabled = true;

                const resposta = await fetch(
                    "http://localhost:3000/favoritos",
                    {
                        method: estaFavoritado ? "DELETE" : "POST",
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

                if (!resposta.ok) {
                    throw new Error(dados.erro || "Erro ao alterar favorito.");
                }

                btnFavoritar.textContent = estaFavoritado
                    ? "♡ Favoritar"
                    : "♥ Favoritado";

            } catch (erro) {
                console.error("Erro ao alterar favorito:", erro);
                alert("Não foi possível alterar o favorito.");

            } finally {
                btnFavoritar.disabled = false;
            }
        });

        // AVALIAR
        btnAvaliar.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            window.location.href = "avaliacao.html?id=" + filme.id;
        });

        carrossel.appendChild(card);
    });
}


// ==========================================
// PESQUISA DE FILMES
// ==========================================

if (campoPesquisa && sugestoesPesquisa) {
    campoPesquisa.addEventListener("input", function () {
        const texto = campoPesquisa.value.trim().toLowerCase();

        sugestoesPesquisa.innerHTML = "";

        if (texto === "") {
            sugestoesPesquisa.style.display = "none";
            return;
        }

        const resultados = filmes.filter(function (filme) {
            return filme.title.toLowerCase().includes(texto);
        });

        console.log("RESULTADOS ENCONTRADOS:", resultados);

        resultados.slice(0, 5).forEach(function (filme) {
            const sugestao = document.createElement("div");
            sugestao.classList.add("sugestao");

            if (filme.poster_path) {
                const poster = document.createElement("img");

                poster.classList.add("poster-pesquisa");
                poster.src =
                    "https://image.tmdb.org/t/p/w92" + filme.poster_path;
                poster.alt = filme.title;

                sugestao.appendChild(poster);
            }

            const titulo = document.createElement("span");
            titulo.textContent = filme.title;

            sugestao.appendChild(titulo);

            sugestao.addEventListener("click", function () {
                campoPesquisa.value = filme.title;
                sugestoesPesquisa.innerHTML = "";
                sugestoesPesquisa.style.display = "none";

                window.location.href = "avaliacao.html?id=" + filme.id;
            });

            sugestoesPesquisa.appendChild(sugestao);
        });

        sugestoesPesquisa.style.display =
            resultados.length > 0 ? "block" : "none";
    });
}


// ==========================================
// COMENTÁRIOS MAIS CURTIDOS
// ==========================================


async function carregarComentariosMaisCurtidos() {
    const lista = document.getElementById("listaComentariosCurtidos");

    if (!lista) return;

    try {
        const resposta = await fetch(
            "http://localhost:3000/avaliacoes/mais-curtidas"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar comentários.");
        }

        const avaliacoes = await resposta.json();

        console.log("COMENTÁRIOS RECEBIDOS NA HOME:", avaliacoes);

        lista.innerHTML = "";

        if (!Array.isArray(avaliacoes) || avaliacoes.length === 0) {
            lista.innerHTML = `
                <p class="sem-comentarios">
                    Ainda não existem comentários.
                </p>
            `;
            return;
        }

        avaliacoes.forEach(function (avaliacao) {
            const card = document.createElement("div");
            card.classList.add("comentario-card");

            const nome = avaliacao.nome || "Usuário";
            const foto = typeof avaliacao.foto_perfil === "string"
                ? avaliacao.foto_perfil.trim()
                : "";

            const quantidadeCurtidas =
                Number(avaliacao.curtidas) || 0;

            const estrelas = "⭐".repeat(
                Math.round(Number(avaliacao.nota) || 0)
            );

            // USUÁRIO E FOTO
            const usuarioDiv = document.createElement("div");
            usuarioDiv.className = "comentario-usuario";

            if (foto.startsWith("data:image/")) {
                const imagem = document.createElement("img");

                imagem.className = "comentario-foto";
                imagem.src = foto;
                imagem.alt = "Foto de " + nome;

                // Tamanho aplicado diretamente para não depender do CSS
                imagem.style.width = "40px";
                imagem.style.height = "40px";
                imagem.style.minWidth = "40px";
                imagem.style.borderRadius = "50%";
                imagem.style.objectFit = "cover";
                imagem.style.display = "block";
                imagem.style.flexShrink = "0";

                imagem.onerror = function () {
                    console.error("ERRO AO CARREGAR FOTO DE:", nome);
                };

                usuarioDiv.appendChild(imagem);
            } else {
                console.warn("Foto não encontrada para:", nome);
            }

            const nomeElemento = document.createElement("strong");
            nomeElemento.className = "comentario-nome";
            nomeElemento.textContent = nome;

            usuarioDiv.appendChild(nomeElemento);

            // ESTRELAS
            const avaliacaoEstrelas = document.createElement("div");
            avaliacaoEstrelas.className = "comentario-estrelas";
            avaliacaoEstrelas.textContent = estrelas;

            // COMENTÁRIO
            const textoComentario = document.createElement("p");
            textoComentario.className = "comentario-texto";
            textoComentario.textContent = avaliacao.comentario
                ? `"${avaliacao.comentario}"`
                : "";

            // CURTIDAS
            const curtidas = document.createElement("div");
            curtidas.className = "comentario-curtidas";
            curtidas.textContent =
                `♥ ${quantidadeCurtidas} ${
                    quantidadeCurtidas === 1 ? "curtida" : "curtidas"
                }`;

            // MONTAR CARD
            card.appendChild(usuarioDiv);
            card.appendChild(avaliacaoEstrelas);
            card.appendChild(textoComentario);
            card.appendChild(curtidas);

            lista.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar comentários:", erro);

        lista.innerHTML = `
            <p class="sem-comentarios">
                Não foi possível carregar os comentários.
            </p>
        `;
    }
}


// ==========================================
// INICIAR HOME
// ==========================================

carregarFilmes();
carregarBanner();
carregarComentariosMaisCurtidos();

console.log("HOME.JS FOI CARREGADO!");
