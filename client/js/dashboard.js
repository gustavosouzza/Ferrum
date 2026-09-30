/**
 * dashboard.js — Etapa 04
 * ------------------------------------------------------------------
 * Comportamento da tela "Dashboard" (index.html).
 * Não possui formulários: a interatividade aqui é só de leitura — os
 * indicadores, a tabela de pendências e a lista de movimentações são
 * calculados a partir dos dados salvos (FerrumStore) e inseridos no
 * DOM dinamicamente, em vez de aparecerem como texto fixo no HTML.
 */

document.addEventListener("DOMContentLoaded", () => {
  const db = FerrumStore.load();
  renderEstatisticas(db);
  renderPendentes(db);
  renderMovimentacoes(db);
});

function renderEstatisticas(db) {
  const stats = FerrumStore.getStats(db);
  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-disponiveis").textContent = stats.disponiveis;
  document.getElementById("stat-emprestados").textContent = stats.emprestados;
  document.getElementById("stat-manutencao").textContent = stats.emManutencao;
}

function renderPendentes(db) {
  const corpo = document.getElementById("tabela-pendentes");
  const vazio = document.getElementById("pendentes-vazio");
  const hoje = new Date().toISOString().slice(0, 10);

  const pendentes = FerrumStore.listarEmprestimosAbertos(db).sort((a, b) =>
    a.previsaoDevolucao.localeCompare(b.previsaoDevolucao)
  );

  corpo.innerHTML = "";

  if (pendentes.length === 0) {
    vazio.hidden = false;
    corpo.closest(".table-responsive").hidden = true;
    return;
  }

  vazio.hidden = true;
  corpo.closest(".table-responsive").hidden = false;

  pendentes.forEach((emprestimo) => {
    const equipamento = FerrumStore.buscarEquipamento(db, emprestimo.equipamentoId);
    const atrasado = emprestimo.previsaoDevolucao < hoje;

    const linha = document.createElement("tr");
    if (atrasado) linha.classList.add("linha-atrasada");

    linha.innerHTML = `
      <td data-label="Equipamento">${FerrumUI.escapeHtml(equipamento ? equipamento.nome : "—")}</td>
      <td data-label="Responsável">${FerrumUI.escapeHtml(emprestimo.responsavel)}</td>
      <td data-label="Data do empréstimo">${FerrumStore.formatarData(emprestimo.dataEmprestimo)}</td>
      <td data-label="Previsão de devolução">
        ${FerrumStore.formatarData(emprestimo.previsaoDevolucao)}
        ${atrasado ? '<span class="etiqueta etiqueta-atraso">Atrasado</span>' : ""}
      </td>
    `;
    corpo.appendChild(linha);
  });
}

function renderMovimentacoes(db) {
  const lista = document.getElementById("lista-movimentacoes");
  const recentes = FerrumStore.getMovimentacoesRecentes(db, 6);
  lista.innerHTML = "";

  if (recentes.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nenhuma movimentação registrada ainda.";
    lista.appendChild(item);
    return;
  }

  recentes.forEach((mov) => {
    const item = document.createElement("li");
    item.textContent = `${mov.texto} — ${FerrumStore.formatarDataHora(mov.ts)}`;
    lista.appendChild(item);
  });
}
