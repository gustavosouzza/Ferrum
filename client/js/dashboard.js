/**
 * dashboard.js
 * Consulta assíncrona dos indicadores, empréstimos pendentes e movimentações.
 */
import * as formato from "./formatacao.js";
import { FerrumUI } from "./ui.js";
import { consultarResumo } from "./services/dashboard-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");
  FerrumUI.mostrarCarregamento(main, true);
  try {
    const resumo = await consultarResumo();
    renderEstatisticas(resumo.stats);
    renderPendentes(resumo);
    renderMovimentacoes(resumo.movimentacoes);
  } catch (erro) {
    FerrumUI.mostrarAlerta(main, erro.message || "Não foi possível carregar o dashboard.", "erro");
  } finally {
    FerrumUI.mostrarCarregamento(main, false);
  }
});

function renderEstatisticas(stats) {
  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-disponiveis").textContent = stats.disponiveis;
  document.getElementById("stat-emprestados").textContent = stats.emprestados;
  document.getElementById("stat-manutencao").textContent = stats.emManutencao;
}

function renderPendentes(resumo) {
  const corpo = document.getElementById("tabela-pendentes");
  const vazio = document.getElementById("pendentes-vazio");
  const pendentes = resumo.pendentes.sort((a, b) =>
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
    const equipamento = resumo.equipamentos.find((e) => e.id === emprestimo.equipamentoId);
    const atrasado = emprestimo.previsaoDevolucao < resumo.hoje;
    const linha = document.createElement("tr");
    if (atrasado) linha.classList.add("linha-atrasada");
    linha.innerHTML = `
      <td data-label="Equipamento">${FerrumUI.escapeHtml(equipamento ? equipamento.nome : "—")}</td>
      <td data-label="Responsável">${FerrumUI.escapeHtml(emprestimo.responsavel)}</td>
      <td data-label="Data do empréstimo">${formato.formatarData(emprestimo.dataEmprestimo)}</td>
      <td data-label="Previsão de devolução">${formato.formatarData(emprestimo.previsaoDevolucao)}
        ${atrasado ? '<span class="etiqueta etiqueta-atraso">Atrasado</span>' : ""}
      </td>`;
    corpo.appendChild(linha);
  });
}

function renderMovimentacoes(movimentacoes) {
  const lista = document.getElementById("lista-movimentacoes");
  lista.innerHTML = "";
  if (movimentacoes.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nenhuma movimentação registrada ainda.";
    lista.appendChild(item);
    return;
  }
  movimentacoes.forEach((mov) => {
    const item = document.createElement("li");
    item.textContent = `${mov.texto} — ${formato.formatarDataHora(mov.ts)}`;
    lista.appendChild(item);
  });
}
