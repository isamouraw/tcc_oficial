const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "login.html";
}


// =====================================================
// CARREGAR MINHAS AVALIAÇÕES
// =====================================================

async function carregarAvaliacoesUsuario() {

    const lista = document.getElementById("listaAvaliacoesUsuario");

    try {

        const respostaAvaliacoes = await fetch(
            "http://localhost:3000/avaliacoes/usuario/" + usuario.id
        );

        if (!respostaAvaliacoes.ok) {
            throw new Error("Erro ao buscar avaliações.");
        }

        const avaliacoes = await respostaAvaliacoes.json();

        console.log("MINHAS AVALIAÇÕES:", avaliacoes);

        if (avaliacoes.length === 0) {

            lista.innerHTML = `
                <p class="sem-avaliacoes">
                    Você ainda não avaliou nenhum filme.
                </p>
            `;

            return;
        }

        lista.innerHTML = "";


        // =================================================
        // BUSCAR CADA FILME
        // =================================================

        for (const avaliacao of avaliacoes) {

            try {

                const respostaFilme = await fetch(
                    "http://localhost:3000/filmes/id/" + avaliacao.filme_id
                );

                if (!respostaFilme.ok) {

                    console.log(
                        "Não foi possível encontrar o filme:",
                        avaliacao.filme_id
                    );

                    continue;
                }

                const filme = await respostaFilme.json();


                // =================================================
                // POSTER
                // =================================================

                const poster = filme.poster_path
                    ? "https://image.tmdb.org/t/p/w500" +
                      filme.poster_path
                    : "./assets/sem-poster.jpg";


                // =================================================
                // ESTRELAS
                // =================================================

                const estrelas = "⭐".repeat(
                    Number(avaliacao.nota)
                );


                // =================================================
                // CRIAR CARD
                // =================================================

                const card =
                    document.createElement("div");

                card.classList.add("card");


                // =================================================
                // HTML DO CARD
                // =================================================

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
                        ${estrelas}
                    </p>

                    <p>
                        "${avaliacao.comentario || ""}"
                    </p>

                    <small>
                        ${
                            avaliacao.data_avaliacao
                                ? new Date(
                                    avaliacao.data_avaliacao
                                  ).toLocaleString("pt-BR")
                                : ""
                        }
                    </small>

                    <div class="acoes-avaliacao">

                        <button
                            class="btn-excluir-avaliacao"
                            type="button"
                        >
                            🗑 Excluir
                        </button>

                    </div>

                `;


                // =================================================
                // BOTÃO EXCLUIR
                // =================================================

                const botaoExcluir =
                    card.querySelector(
                        ".btn-excluir-avaliacao"
                    );


                botaoExcluir.addEventListener(
                    "click",
                    async function (event) {

                        // Impede o clique de abrir o filme
                        event.preventDefault();
                        event.stopPropagation();

                        await excluirAvaliacao(
                            avaliacao.id,
                            botaoExcluir
                        );

                    }
                );


                // =================================================
                // CLIQUE NO CARD
                // =================================================

                card.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "avaliacao.html?id=" +
                            filme.id;

                    }
                );


                lista.appendChild(card);


            } catch (erroFilme) {

                console.error(
                    "Erro ao buscar filme:",
                    avaliacao.filme_id,
                    erroFilme
                );

            }

        }

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR MINHAS AVALIAÇÕES:",
            erro
        );

        lista.innerHTML = `
            <p>
                Não foi possível carregar suas avaliações.
            </p>
        `;
    }
}


// =====================================================
// EXCLUIR AVALIAÇÃO
// =====================================================

async function excluirAvaliacao(
    avaliacaoId,
    botao
) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta avaliação?"
        );


    if (!confirmar) {
        return;
    }


    try {

        botao.disabled = true;

        botao.textContent =
            "Excluindo...";


        const resposta =
            await fetch(
                "http://localhost:3000/avaliacoes/" +
                avaliacaoId,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        usuario_id:
                            usuario.id
                    })
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                "Erro ao excluir avaliação."
            );

        }


        // Recarrega as avaliações
        await carregarAvaliacoesUsuario();


    } catch (erro) {

        console.error(
            "ERRO AO EXCLUIR AVALIAÇÃO:",
            erro
        );

        alert(
            erro.message ||
            "Não foi possível excluir a avaliação."
        );


        botao.disabled = false;

        botao.textContent =
            "🗑 Excluir";

    }

}


// =====================================================
// INICIAR
// =====================================================

carregarAvaliacoesUsuario();