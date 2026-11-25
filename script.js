// Lista inicial de exemplo. Os novos alunos são adicionados a este array.
const turma = [
  { nome: "Ana Souza", media: 8.5 },
  { nome: "Bruno Lima", media: 6.0 },
  { nome: "Carla Mendes", media: 4.5 }
];

const form = document.querySelector("#form-aluno");
const busca = document.querySelector("#busca");
const corpoTabela = document.querySelector("#corpo-tabela");
const mensagem = document.querySelector("#mensagem");
const campoNome = document.querySelector("#nome");
const campoNota = document.querySelector("#nota");
const contador = document.querySelector("#contador");
const avisoVazio = document.querySelector("#vazio");

// Mostra os alunos recebidos na tabela.
function mostrarTurma(alunos) {
  corpoTabela.innerHTML = "";

  alunos.forEach((aluno) => {
    const linha = document.createElement("tr");
    const situacao = aluno.media >= 6 ? "Aprovado" : "Reprovado";
    const classe = aluno.media >= 6 ? "aprovado" : "reprovado";

    linha.innerHTML = `
      <td>${aluno.nome}</td>
      <td class="nota">${aluno.media.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      })}</td>
      <td><span class="status ${classe}">${situacao}</span></td>
    `;

    // Bônus: dois cliques removem o aluno da lista.
    linha.addEventListener("dblclick", () => {
      const posicao = turma.indexOf(aluno);
      if (posicao !== -1) {
        turma.splice(posicao, 1);
        filtrarTurma();
        mostrarMensagem(`${aluno.nome} foi removido da turma.`, "sucesso");
      }
    });

    corpoTabela.appendChild(linha);
  });

  contador.textContent = `${turma.length} ${turma.length === 1 ? "aluno" : "alunos"}`;
  avisoVazio.hidden = alunos.length !== 0;
}

// Mostra uma mensagem de retorno na página.
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

// Filtra os nomes conforme o usuário digita.
function filtrarTurma() {
  const termo = busca.value.toLowerCase().trim();
  const achados = turma.filter((aluno) =>
    aluno.nome.toLowerCase().includes(termo)
  );

  mostrarTurma(achados);

  if (termo !== "" && achados.length === 0) {
    avisoVazio.textContent = `Nenhum aluno com "${busca.value}" foi encontrado.`;
  } else {
    avisoVazio.textContent = "Nenhum aluno encontrado.";
  }
}

// Evento submit: funciona tanto ao clicar quanto ao apertar Enter.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = form.nome.value.trim();
  const notaTexto = form.nota.value;
  const nota = Number(notaTexto);

  campoNome.classList.remove("campo-erro");
  campoNota.classList.remove("campo-erro");

  if (nome.length < 3) {
    campoNome.classList.add("campo-erro");
    mostrarMensagem("Digite um nome com pelo menos 3 letras.", "erro");
    campoNome.focus();
    return;
  }

  if (notaTexto === "" || !Number.isFinite(nota) || nota < 0 || nota > 10) {
    campoNota.classList.add("campo-erro");
    mostrarMensagem("A nota deve ser um número entre 0 e 10.", "erro");
    campoNota.focus();
    return;
  }

  turma.push({ nome: nome, media: nota });
  filtrarTurma();
  form.reset();
  campoNome.focus();
  mostrarMensagem(`${nome} foi cadastrado com sucesso!`, "sucesso");
});

// Evento input: atualiza a tabela a cada letra digitada.
busca.addEventListener("input", () => {
  filtrarTurma();
});

// Bônus: Esc limpa a busca e mostra a turma inteira.
busca.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    busca.value = "";
    filtrarTurma();
    busca.focus();
  }
});

// Exibe a turma inicial ao abrir a página.
mostrarTurma(turma);
