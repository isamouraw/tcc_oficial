const usuario = JSON.parse(localStorage.getItem("usuario"));

console.log("USUÁRIO LOGADO:", usuario);

if (!usuario || !usuario.id) {
    alert("Usuário não identificado. Faça login novamente.");
    window.location.href = "login.html";
}
let notaSelecionada = 0;
let idFilmeAtual = null;


// =====================================================
// CARREGAR FILME
// =====================================================

async function carregarFilme() {

    try {

        const parametros =
            new URLSearchParams(window.location.search);

        const idFilme = parametros.get("id");

        if (!idFilme) {
            throw new Error("Filme não encontrado.");
        }

        idFilmeAtual = idFilme;


        const resposta =
            await fetch("http://localhost:3000/filmes");

        const filmes =
            await resposta.json();


        const filme =
            filmes.find(function (filme) {
                return filme.id == idFilme;
            });


        if (!filme) {
            throw new Error("Filme não encontrado.");
        }


        const poster = filme.poster_path
            ? "https://image.tmdb.org/t/p/w500" + filme.poster_path
            : "./assets/sem-poster.jpg";


        document.getElementById("filmeAvaliacao").innerHTML = `

            <div class="filme-avaliacao">

                <img
                    src="${poster}"
                    alt="${filme.title}"
                >

                <div>

                    <h1>${filme.title}</h1>

                    <p>
                        ${filme.overview ||
                        "Descrição não disponível."}
                    </p>

                    <p class="nota-filme">
                        ⭐ ${Number(filme.vote_average).toFixed(1)}/10
                    </p>

                </div>

            </div>

        `;


        configurarEstrelas();

        carregarAvaliacoes(idFilme);

    } catch (erro) {

        console.error(erro);

        document.getElementById("filmeAvaliacao").innerHTML =
            "<p>Não foi possível carregar o filme.</p>";

    }
}


// =====================================================
// ESTRELAS
// =====================================================

function configurarEstrelas() {

    const estrelas =
        document.querySelectorAll(".estrelas button");


    estrelas.forEach(function (estrela) {

        estrela.addEventListener("click", function () {

            notaSelecionada =
                Number(estrela.dataset.nota);


            estrelas.forEach(function (outraEstrela) {

                if (
                    Number(outraEstrela.dataset.nota)
                    <= notaSelecionada
                ) {

                    outraEstrela.classList.add("selecionada");

                } else {

                    outraEstrela.classList.remove("selecionada");

                }

            });


            document.getElementById("notaTexto").textContent =
                "Sua nota: " + notaSelecionada + "/5";

        });

    });

}


// =====================================================
// ENVIAR AVALIAÇÃO
// =====================================================

document
    .getElementById("btnEnviarAvaliacao")
    .addEventListener("click", async function () {

        const comentario =
            document.getElementById("comentario").value.trim();


        if (notaSelecionada === 0) {

            alert("Escolha uma nota antes de enviar.");

            return;

        }


        if (comentario === "") {

            alert("Escreva um comentário antes de enviar.");

            return;

        }


        try {

            const resposta =
                await fetch("http://localhost:3000/avaliacoes", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        usuario_id: usuario.id,

                        filme_id: idFilmeAtual,

                        nota: notaSelecionada,

                        comentario: comentario

                    })

                });


            const dados =
                await resposta.json();


            if (!resposta.ok) {
                throw new Error("Erro ao salvar avaliação.");
            }


            alert("Avaliação salva com sucesso! 💜");


            document.getElementById("comentario").value = "";

            notaSelecionada = 0;


            document
                .querySelectorAll(".estrelas button")
                .forEach(function (estrela) {

                    estrela.classList.remove("selecionada");

                });


            document.getElementById("notaTexto").textContent =
                "Nenhuma nota selecionada";


            carregarAvaliacoes(idFilmeAtual);


        } catch (erro) {

            console.error(erro);

            alert(
                "Não foi possível salvar a avaliação."
            );

        }

    });


// =====================================================
// CARREGAR AVALIAÇÕES DO FILME
// =====================================================

async function carregarAvaliacoes(idFilme) {

    try {

        const resposta =
            await fetch(
                "http://localhost:3000/avaliacoes/" + idFilme
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar avaliações."
            );

        }


        const avaliacoes =
            await resposta.json();


        const lista =
            document.getElementById("listaAvaliacoes");


        if (!lista) {

            console.error(
                "Elemento listaAvaliacoes não encontrado."
            );

            return;

        }


        lista.innerHTML = "";


        if (avaliacoes.length === 0) {

            lista.innerHTML =
                '<p class="sem-avaliacoes">Ainda não existem avaliações para este filme. Seja o primeiro a avaliar!</p>';

            return;

        }


        const usuarioAtual =
            JSON.parse(localStorage.getItem("usuario"));


        for (const avaliacao of avaliacoes) {

            const item =
                document.createElement("div");

            item.classList.add("avaliacao-item");


            const estrelas =
                "⭐".repeat(Number(avaliacao.nota));


            let curtidas = 0;

            let usuarioCurtiu = false;

if (usuarioAtual) {
    try {
        const respostaCurtida = await fetch(
            "http://localhost:3000/avaliacoes/curtida/" +
            usuarioAtual.id +
            "/" +
            avaliacao.id
        );

        if (respostaCurtida.ok) {
            const dadosCurtida = await respostaCurtida.json();
            usuarioCurtiu = dadosCurtida.curtiu;
        }

    } catch (erro) {
        console.error("Erro ao verificar curtida:", erro);
    }
}


            try {

                const respostaCurtidas =
                    await fetch(
                        "http://localhost:3000/avaliacoes/curtidas/" +
                        avaliacao.id
                    );


                if (respostaCurtidas.ok) {

                    const dadosCurtidas =
                        await respostaCurtidas.json();

                    curtidas =
                        Number(dadosCurtidas.curtidas) || 0;

                }

            } catch (erro) {

                console.error(
                    "Erro ao buscar curtidas:",
                    erro
                );

            }


            item.innerHTML =
                '<div class="avaliacao-nota">' +
                    estrelas +
                '</div>' +

                '<p class="avaliacao-comentario">' +
                    '"' + avaliacao.comentario + '"' +
                '</p>' +

                '<small>' +
                    (
                        avaliacao.data_avaliacao
                            ? new Date(
                                avaliacao.data_avaliacao
                              ).toLocaleString("pt-BR")
                            : ""
                    ) +
                '</small>' +

                '<div class="curtida-avaliacao">' +

                    '<button ' +
    'type="button" ' +
    'class="btn-curtir-avaliacao">' +
    '♡' +
'</button>' +

                    '<span class="quantidade-curtidas">' +
                        curtidas +
                    '</span>' +

                '</div>';


            const botaoCurtir =
                item.querySelector(
                    ".btn-curtir-avaliacao"
                );


            const quantidadeCurtidas =
                item.querySelector(
                    ".quantidade-curtidas"
                );


                botaoCurtir.addEventListener(
                    "click",
                    async function () {
                
                        if (!usuarioAtual) {
                            alert("Faça login para curtir uma avaliação.");
                            return;
                        }
                
                        try {
                
                            // TENTA CURTIR
                            const respostaCurtir = await fetch(
                                "http://localhost:3000/avaliacoes/curtir",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        usuario_id: usuarioAtual.id,
                                        avaliacao_id: avaliacao.id
                                    })
                                }
                            );
                
                            // SE CONSEGUIU CURTIR
                            if (respostaCurtir.ok) {
                
                                curtidas++;
                
                                quantidadeCurtidas.textContent = curtidas;
                
                                botaoCurtir.textContent = "♥";
                
                                botaoCurtir.classList.add("curtido");
                
                                return;
                            }
                
                
                            // SE JÁ TINHA CURTIDO, DESCURTE
                            const dados = await respostaCurtir.json();
                
                            if (
                                dados.erro ===
                                "Você já curtiu esta avaliação."
                            ) {
                
                                const respostaDescurtir = await fetch(
                                    "http://localhost:3000/avaliacoes/descurtir",
                                    {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            usuario_id: usuarioAtual.id,
                                            avaliacao_id: avaliacao.id
                                        })
                                    }
                                );
                
                                if (!respostaDescurtir.ok) {
                                    throw new Error("Erro ao descurtir.");
                                }
                
                                curtidas--;
                
                                quantidadeCurtidas.textContent = curtidas;
                
                                botaoCurtir.textContent = "♡";
                
                                botaoCurtir.classList.remove("curtido");
                            }
                
                        } catch (erro) {
                
                            console.error(
                                "Erro ao alterar curtida:",
                                erro
                            );
                
                            alert(
                                "Não foi possível alterar a curtida."
                            );
                
                        }
                
                    }
                );


            lista.appendChild(item);

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar avaliações:",
            erro
        );

    }

}


carregarFilme();