/**
 * emprestimos.js — Etapa 04
 * ------------------------------------------------------------------
 * Comportamento da tela "Empréstimos" (emprestimos.html):
 *   - registro de empréstimo, com validação de datas e checagem de
 *     disponibilidade do equipamento (regra de negócio da Etapa 01);
 *   - registro de devolução, atualizando a situação do equipamento;
 *   - histórico de empréstimos renderizado dinamicamente a partir dos
 *     dados salvos.
 *
 * Os dois <select> (equipamento e empréstimo em aberto) são
 * preenchidos via JavaScript a partir dos dados reais, em vez de
 * opções fixas no HTML — assim eles nunca ficam desatualizados em
 * relação à situação de cada equipamento/empréstimo.
 */

document.addEventListener("DOMContentLoaded", () => {
  const db = FerrumStore.load();

  const formEmprestimo = document.getElementById("form-emprestimo");
  const formDevolucao = document.getElementById("form-devolucao");
  const selectEquipamento = document.getElementById("equipamento");
  const selectEmprestimo = document.getElementById("emprestimo-devolucao");

  renderTudo();

  formEmprestimo.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = {
      equipamentoId: selectEquipamento.value,
      responsavel: formEmprestimo.elements.responsavel.value,
      dataEmprestimo: formEmprestimo.elements["data-emprestimo"].value,
      previsaoDevolucao: formEmprestimo.elements["previsao-devolucao"].value,
      observacoes: formEmprestimo.elements.observacoes.value
    };

    const resultado = FerrumStore.registrarEmprestimo(db, dados);
    if (!resultado.ok) {
      FerrumUI.exibirErros(formEmprestimo, resultado.erros);
      return;
    }

    FerrumUI.limparErros(formEmprestimo);
    formEmprestimo.reset();
    FerrumUI.mostrarAlerta(formEmprestimo.closest("section"), "Empréstimo registrado com sucesso.", "sucesso");
    renderTudo();
  });

  formDevolucao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = {
      emprestimoId: selectEmprestimo.value,
      dataDevolucao: formDevolucao.elements["data-devolucao"].value
    };

    const resultado = FerrumStore.registrarDevolucao(db, dados);
    if (!resultado.ok) {
      FerrumUI.exibirErros(formDevolucao, resultado.erros);
      return;
    }

    FerrumUI.limparErros(formDevolucao);
    formDevolucao.reset();
    FerrumUI.mostrarAlerta(formDevolucao.closest("section"), "Devolução registrada com sucesso.", "sucesso");
    renderTudo();
  });

  function renderTudo() {
    renderSelectEquipamentosDisponiveis();
    renderSelectEmprestimosAbertos();
    renderHistorico();
  }

  function renderSelectEquipamentosDisponiveis() {
    const disponiveis = FerrumStore.listarEquipamentos(db, { situacao: "disponivel" });
    selectEquipamento.innerHTML = '<option value="">Selecione um equipamento disponível</option>';
    disponiveis.forEach((equip) => {
      const opcao = document.createElement("option");
      opcao.value = equip.id;
      opcao.textContent = `${equip.nome} (${equip.identificacao})`;
      selectEquipamento.appendChild(opcao);
    });

    const aviso = document.getElementById("sem-equipamentos-disponiveis");
    const semOpcoes = disponiveis.length === 0;
    aviso.hidden = !semOpcoes;
    selectEquipamento.disabled = semOpcoes;
    formEmprestimo.querySelector('button[type="submit"]').disabled = semOpcoes;
  }

  function renderSelectEmprestimosAbertos() {
    const abertos = FerrumStore.listarEmprestimosAbertos(db);
    selectEmprestimo.innerHTML = '<option value="">Selecione um empréstimo em aberto</option>';
    abertos.forEach((emprestimo) => {
      const equipamento = FerrumStore.buscarEquipamento(db, emprestimo.equipamentoId);
      const opcao = document.createElement("option");
      opcao.value = emprestimo.id;
      opcao.textContent = `${equipamento ? equipamento.nome : "—"} — ${emprestimo.responsavel}`;
      selectEmprestimo.appendChild(opcao);
    });

    const aviso = document.getElementById("sem-emprestimos-abertos");
    const semOpcoes = abertos.length === 0;
    aviso.hidden = !semOpcoes;
    selectEmprestimo.disabled = semOpcoes;
    formDevolucao.querySelector('button[type="submit"]').disabled = semOpcoes;
  }

  function renderHistorico() {
    const corpo = document.getElementById("tabela-emprestimos");
    const historico = FerrumStore.listarEmprestimos(db);
    corpo.innerHTML = "";

    historico.forEach((emprestimo) => {
      const equipamento = FerrumStore.buscarEquipamento(db, emprestimo.equipamentoId);
      const linha = document.createElement("tr");
      const situacaoTexto = emprestimo.situacao === "aberto" ? "Em aberto" : "Devolvido";

      linha.innerHTML = `
        <td data-label="Equipamento">${FerrumUI.escapeHtml(equipamento ? equipamento.nome : "Equipamento removido")}</td>
        <td data-label="Responsável">${FerrumUI.escapeHtml(emprestimo.responsavel)}</td>
        <td data-label="Data do empréstimo">${FerrumStore.formatarData(emprestimo.dataEmprestimo)}</td>
        <td data-label="Previsão de devolução">${FerrumStore.formatarData(emprestimo.previsaoDevolucao)}</td>
        <td data-label="Situação">
          <span class="etiqueta etiqueta-${emprestimo.situacao === "aberto" ? "emprestado" : "disponivel"}">${situacaoTexto}</span>
        </td>
      `;
      corpo.appendChild(linha);
    });
  }
});
