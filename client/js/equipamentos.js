/**
 * equipamentos.js — Etapa 04
 * ------------------------------------------------------------------
 * Comportamento da tela "Equipamentos" (equipamentos.html):
 *   - cadastro e edição de equipamentos, com validação;
 *   - filtro dinâmico por categoria e situação (sem recarregar a página);
 *   - exclusão de equipamentos, com confirmação inline e bloqueio de
 *     equipamentos emprestados ou em manutenção (regra de negócio).
 *
 * Funcionalidade que não existe apenas com HTML/CSS: a tabela é
 * reconstruída em tempo real a cada cadastro, edição, filtro ou
 * exclusão, sem nenhum recarregamento de página — e o estado é
 * validado em JavaScript antes de qualquer alteração ser aplicada.
 */

let confirmandoExclusaoId = null;

document.addEventListener("DOMContentLoaded", () => {
  const db = FerrumStore.load();

  const formEquipamento = document.getElementById("form-equipamento");
  const formFiltro = document.getElementById("form-filtro-equipamentos");
  const botaoLimparFiltro = document.getElementById("botao-limpar-filtro");
  const botaoCancelarEdicao = document.getElementById("botao-cancelar-edicao");
  const secaoCadastro = formEquipamento.closest("section");

  renderTabela();

  formEquipamento.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = {
      nome: formEquipamento.elements.nome.value,
      identificacao: formEquipamento.elements.identificacao.value,
      descricao: formEquipamento.elements.descricao.value,
      categoria: formEquipamento.elements.categoria.value,
      situacao: formEquipamento.elements.situacao.value
    };

    const idEmEdicao = formEquipamento.elements.equipamentoId.value;
    const resultado = idEmEdicao
      ? FerrumStore.editarEquipamento(db, Number(idEmEdicao), dados)
      : FerrumStore.adicionarEquipamento(db, dados);

    if (!resultado.ok) {
      FerrumUI.exibirErros(formEquipamento, resultado.erros);
      return;
    }

    FerrumUI.limparErros(formEquipamento);
    sairDoModoEdicao();
    FerrumUI.mostrarAlerta(
      secaoCadastro,
      idEmEdicao ? "Equipamento atualizado com sucesso." : "Equipamento cadastrado com sucesso.",
      "sucesso"
    );
    renderTabela();
  });

  botaoCancelarEdicao.addEventListener("click", () => {
    sairDoModoEdicao();
    FerrumUI.limparErros(formEquipamento);
    FerrumUI.limparAlerta(secaoCadastro);
  });

  formFiltro.addEventListener("submit", (evento) => {
    evento.preventDefault();
    renderTabela();
  });

  // Filtra imediatamente também quando o valor do select muda, sem
  // precisar clicar em "Filtrar" — alteração dinâmica da interface.
  formFiltro.addEventListener("change", () => renderTabela());

  botaoLimparFiltro.addEventListener("click", () => {
    formFiltro.reset();
    renderTabela();
  });

  function entrarNoModoEdicao(equipamento) {
    confirmandoExclusaoId = null;
    formEquipamento.elements.equipamentoId.value = equipamento.id;
    formEquipamento.elements.nome.value = equipamento.nome;
    formEquipamento.elements.identificacao.value = equipamento.identificacao;
    formEquipamento.elements.descricao.value = equipamento.descricao;
    formEquipamento.elements.categoria.value = equipamento.categoria;
    formEquipamento.elements.situacao.value = equipamento.situacao;

    // A situação é um estado derivado, controlado pelas telas de
    // Empréstimos e Manutenções — por isso o campo fica desabilitado
    // durante a edição, em vez de aceitar um valor que a função
    // editarEquipamento() (store.js) vai ignorar silenciosamente.
    formEquipamento.elements.situacao.disabled = true;
    document.getElementById("dica-situacao").hidden = false;

    document.getElementById("cadastro-titulo").textContent = `Editando: ${equipamento.nome}`;
    document.getElementById("botao-salvar-equipamento").textContent = "Salvar alterações";
    document.getElementById("botao-cancelar-edicao").textContent = "Cancelar edição";
    formEquipamento.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function sairDoModoEdicao() {
    formEquipamento.reset();
    formEquipamento.elements.equipamentoId.value = "";
    formEquipamento.elements.situacao.disabled = false;
    document.getElementById("dica-situacao").hidden = true;
    document.getElementById("cadastro-titulo").textContent = "Cadastrar equipamento";
    document.getElementById("botao-salvar-equipamento").textContent = "Cadastrar equipamento";
    document.getElementById("botao-cancelar-edicao").textContent = "Limpar";
  }

  function renderTabela() {
    const corpo = document.getElementById("tabela-equipamentos");
    const vazio = document.getElementById("lista-vazia");
    const filtros = {
      categoria: formFiltro.elements["filtro-categoria"].value,
      situacao: formFiltro.elements["filtro-situacao"].value
    };

    const lista = FerrumStore.listarEquipamentos(db, filtros);
    corpo.innerHTML = "";

    if (lista.length === 0) {
      vazio.hidden = false;
      corpo.closest(".table-responsive").hidden = true;
      return;
    }
    vazio.hidden = true;
    corpo.closest(".table-responsive").hidden = false;

    lista.forEach((equipamento) => {
      const linha = document.createElement("tr");

      const emConfirmacao = confirmandoExclusaoId === equipamento.id;
      const podeExcluir = equipamento.situacao === "disponivel";

      let celulaAcoes;
      if (emConfirmacao) {
        celulaAcoes = `
          <span class="confirmacao-exclusao">
            Confirmar exclusão?
            <button type="button" class="btn-link btn-perigo" data-acao="confirmar-excluir" data-id="${equipamento.id}">Sim, excluir</button>
            <button type="button" class="btn-link" data-acao="cancelar-excluir">Cancelar</button>
          </span>`;
      } else {
        celulaAcoes = `
          <button type="button" class="btn-link" data-acao="editar" data-id="${equipamento.id}">Editar</button>
          <button type="button" class="btn-link btn-perigo" data-acao="excluir" data-id="${equipamento.id}" ${
          podeExcluir ? "" : "disabled title=\"Equipamento emprestado ou em manutenção não pode ser excluído\""
        }>Excluir</button>`;
      }

      linha.innerHTML = `
        <td data-label="Nome">${FerrumUI.escapeHtml(equipamento.nome)}</td>
        <td data-label="Categoria">${FerrumUI.escapeHtml(FerrumStore.CATEGORIAS[equipamento.categoria] || equipamento.categoria)}</td>
        <td data-label="Situação">
          <span class="etiqueta etiqueta-${equipamento.situacao}">${FerrumUI.escapeHtml(FerrumStore.SITUACOES_EQUIPAMENTO[equipamento.situacao])}</span>
        </td>
        <td data-label="Ações">${celulaAcoes}</td>
      `;
      corpo.appendChild(linha);
    });

    corpo.querySelectorAll("[data-acao]").forEach((botao) => {
      botao.addEventListener("click", () => {
        const acao = botao.dataset.acao;
        const id = Number(botao.dataset.id);

        if (acao === "editar") {
          const equipamento = FerrumStore.buscarEquipamento(db, id);
          if (equipamento) entrarNoModoEdicao(equipamento);
        } else if (acao === "excluir") {
          confirmandoExclusaoId = id;
          renderTabela();
        } else if (acao === "cancelar-excluir") {
          confirmandoExclusaoId = null;
          renderTabela();
        } else if (acao === "confirmar-excluir") {
          const resultado = FerrumStore.excluirEquipamento(db, id);
          confirmandoExclusaoId = null;
          if (!resultado.ok) {
            FerrumUI.mostrarAlerta(secaoCadastro, resultado.mensagem, "erro");
          } else {
            FerrumUI.mostrarAlerta(secaoCadastro, "Equipamento excluído com sucesso.", "sucesso");
          }
          renderTabela();
        }
      });
    });
  }
});
