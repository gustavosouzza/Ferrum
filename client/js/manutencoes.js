/**
 * manutencoes.js — Etapa 04
 * ------------------------------------------------------------------
 * Comportamento da tela "Manutenções" (manutencoes.html):
 *   - registro de manutenção (só equipamentos disponíveis podem ser
 *     enviados para manutenção — um equipamento emprestado precisa
 *     ser devolvido antes);
 *   - conclusão de manutenção, com validação de datas;
 *   - histórico renderizado dinamicamente.
 */

document.addEventListener("DOMContentLoaded", () => {
  const db = FerrumStore.load();

  const formManutencao = document.getElementById("form-manutencao");
  const formConcluir = document.getElementById("form-concluir-manutencao");
  const selectEquipamento = document.getElementById("equipamento-manutencao");
  const selectManutencao = document.getElementById("manutencao-concluir");

  renderTudo();

  formManutencao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = {
      equipamentoId: selectEquipamento.value,
      descricao: formManutencao.elements["descricao-problema"].value,
      dataInicio: formManutencao.elements["data-inicio"].value,
      situacao: formManutencao.elements["situacao-manutencao"].value,
      observacoes: formManutencao.elements["observacoes-manutencao"].value
    };

    const resultado = FerrumStore.registrarManutencao(db, dados);
    if (!resultado.ok) {
      FerrumUI.exibirErros(formManutencao, resultado.erros);
      return;
    }

    FerrumUI.limparErros(formManutencao);
    formManutencao.reset();
    FerrumUI.mostrarAlerta(formManutencao.closest("section"), "Manutenção registrada com sucesso.", "sucesso");
    renderTudo();
  });

  formConcluir.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = {
      manutencaoId: selectManutencao.value,
      dataConclusao: formConcluir.elements["data-conclusao"].value
    };

    const resultado = FerrumStore.concluirManutencao(db, dados);
    if (!resultado.ok) {
      FerrumUI.exibirErros(formConcluir, resultado.erros);
      return;
    }

    FerrumUI.limparErros(formConcluir);
    formConcluir.reset();
    FerrumUI.mostrarAlerta(formConcluir.closest("section"), "Manutenção concluída com sucesso.", "sucesso");
    renderTudo();
  });

  function renderTudo() {
    renderSelectEquipamentosDisponiveis();
    renderSelectManutencoesAbertas();
    renderHistorico();
  }

  function renderSelectEquipamentosDisponiveis() {
    const disponiveis = FerrumStore.listarEquipamentos(db, { situacao: "disponivel" });
    selectEquipamento.innerHTML = '<option value="">Selecione um equipamento</option>';
    disponiveis.forEach((equip) => {
      const opcao = document.createElement("option");
      opcao.value = equip.id;
      opcao.textContent = `${equip.nome} (${equip.identificacao})`;
      selectEquipamento.appendChild(opcao);
    });

    const aviso = document.getElementById("sem-equipamentos-para-manutencao");
    const semOpcoes = disponiveis.length === 0;
    aviso.hidden = !semOpcoes;
    selectEquipamento.disabled = semOpcoes;
    formManutencao.querySelector('button[type="submit"]').disabled = semOpcoes;
  }

  function renderSelectManutencoesAbertas() {
    const abertas = FerrumStore.listarManutencoesAbertas(db);
    selectManutencao.innerHTML = '<option value="">Selecione uma manutenção</option>';
    abertas.forEach((manutencao) => {
      const equipamento = FerrumStore.buscarEquipamento(db, manutencao.equipamentoId);
      const opcao = document.createElement("option");
      opcao.value = manutencao.id;
      opcao.textContent = `${equipamento ? equipamento.nome : "—"} — iniciada em ${FerrumStore.formatarData(manutencao.dataInicio)}`;
      selectManutencao.appendChild(opcao);
    });

    const aviso = document.getElementById("sem-manutencoes-abertas");
    const semOpcoes = abertas.length === 0;
    aviso.hidden = !semOpcoes;
    selectManutencao.disabled = semOpcoes;
    formConcluir.querySelector('button[type="submit"]').disabled = semOpcoes;
  }

  function renderHistorico() {
    const corpo = document.getElementById("tabela-manutencoes");
    const historico = FerrumStore.listarManutencoes(db);
    corpo.innerHTML = "";

    historico.forEach((manutencao) => {
      const equipamento = FerrumStore.buscarEquipamento(db, manutencao.equipamentoId);
      const linha = document.createElement("tr");
      const situacaoTexto = manutencao.situacao === "em-andamento" ? "Em andamento" : "Concluída";

      linha.innerHTML = `
        <td data-label="Equipamento">${FerrumUI.escapeHtml(equipamento ? equipamento.nome : "Equipamento removido")}</td>
        <td data-label="Descrição">${FerrumUI.escapeHtml(manutencao.descricao)}</td>
        <td data-label="Data de início">${FerrumStore.formatarData(manutencao.dataInicio)}</td>
        <td data-label="Data de conclusão">${FerrumStore.formatarData(manutencao.dataConclusao)}</td>
        <td data-label="Situação">
          <span class="etiqueta etiqueta-${manutencao.situacao === "em-andamento" ? "manutencao" : "disponivel"}">${situacaoTexto}</span>
        </td>
      `;
      corpo.appendChild(linha);
    });
  }
});
