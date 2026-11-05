/**
 * emprestimos.js — Etapa 05
 * Registro e consulta assíncrona de empréstimos e devoluções.
 */
import { FerrumStore } from "./store.js";
import { FerrumUI } from "./ui.js";
import { listarEquipamentos } from "./services/equipamento-service.js";
import {
  listarEmprestimos, listarEmprestimosAbertos,
  registrarEmprestimo, registrarDevolucao
} from "./services/emprestimo-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const db = FerrumStore.load();
  const main = document.querySelector("main");
  const formEmprestimo = document.getElementById("form-emprestimo");
  const formDevolucao = document.getElementById("form-devolucao");
  const selectEquipamento = document.getElementById("equipamento");
  const selectEmprestimo = document.getElementById("emprestimo-devolucao");

  async function renderTudo() {
    FerrumUI.mostrarCarregamento(main, true, "Consultando empréstimos...");
    try {
      const [equipamentos, abertos, historico] = await Promise.all([
        listarEquipamentos(db, { situacao: "disponivel" }),
        listarEmprestimosAbertos(db),
        listarEmprestimos(db)
      ]);
      selectEquipamento.innerHTML = '<option value="">Selecione um equipamento disponível</option>';
      equipamentos.forEach((equip) => {
        const option = document.createElement("option");
        option.value = equip.id;
        option.textContent = `${equip.nome} (${equip.identificacao})`;
        selectEquipamento.appendChild(option);
      });
      const semEquipamentos = equipamentos.length === 0;
      document.getElementById("sem-equipamentos-disponiveis").hidden = !semEquipamentos;
      selectEquipamento.disabled = semEquipamentos;
      formEmprestimo.querySelector('button[type="submit"]').disabled = semEquipamentos;

      selectEmprestimo.innerHTML = '<option value="">Selecione um empréstimo em aberto</option>';
      abertos.forEach((emprestimo) => {
        const equip = equipamentos.find((e) => e.id === emprestimo.equipamentoId) ||
          db.equipamentos.find((e) => e.id === emprestimo.equipamentoId);
        const option = document.createElement("option");
        option.value = emprestimo.id;
        option.textContent = `${equip ? equip.nome : "—"} — ${emprestimo.responsavel}`;
        selectEmprestimo.appendChild(option);
      });
      const semAbertos = abertos.length === 0;
      document.getElementById("sem-emprestimos-abertos").hidden = !semAbertos;
      selectEmprestimo.disabled = semAbertos;
      formDevolucao.querySelector('button[type="submit"]').disabled = semAbertos;
      await renderHistorico(historico);
    } catch (erro) {
      FerrumUI.mostrarAlerta(main, erro.message || "Não foi possível consultar os empréstimos.", "erro");
    } finally {
      FerrumUI.mostrarCarregamento(main, false);
    }
  }

  async function renderHistorico(historico = null) {
    const dados = historico || await listarEmprestimos(db);
    const corpo = document.getElementById("tabela-emprestimos");
    corpo.innerHTML = "";
    for (const emprestimo of dados) {
      const equipamento = db.equipamentos.find((e) => e.id === emprestimo.equipamentoId);
      const linha = document.createElement("tr");
      const aberto = emprestimo.situacao === "aberto";
      linha.innerHTML = `
        <td data-label="Equipamento">${FerrumUI.escapeHtml(equipamento ? equipamento.nome : "Equipamento removido")}</td>
        <td data-label="Responsável">${FerrumUI.escapeHtml(emprestimo.responsavel)}</td>
        <td data-label="Data do empréstimo">${FerrumStore.formatarData(emprestimo.dataEmprestimo)}</td>
        <td data-label="Previsão de devolução">${FerrumStore.formatarData(emprestimo.previsaoDevolucao)}</td>
        <td data-label="Situação"><span class="etiqueta etiqueta-${aberto ? "emprestado" : "disponivel"}">${aberto ? "Em aberto" : "Devolvido"}</span></td>`;
      corpo.appendChild(linha);
    }
  }

  formEmprestimo.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = {
      equipamentoId: selectEquipamento.value,
      responsavel: formEmprestimo.elements.responsavel.value,
      dataEmprestimo: formEmprestimo.elements["data-emprestimo"].value,
      previsaoDevolucao: formEmprestimo.elements["previsao-devolucao"].value,
      observacoes: formEmprestimo.elements.observacoes.value
    };
    FerrumUI.mostrarCarregamento(main, true, "Enviando registro de empréstimo...");
    try {
      const resultado = await registrarEmprestimo(db, dados);
      if (!resultado.ok) { FerrumUI.exibirErros(formEmprestimo, resultado.erros); return; }
      FerrumUI.limparErros(formEmprestimo);
      formEmprestimo.reset();
      FerrumUI.mostrarAlerta(formEmprestimo.closest("section"), "Empréstimo registrado com sucesso.", "sucesso");
      await renderTudo();
    } catch (erro) {
      FerrumUI.mostrarAlerta(formEmprestimo.closest("section"), erro.message, "erro");
    } finally { FerrumUI.mostrarCarregamento(main, false); }
  });

  formDevolucao.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = {
      emprestimoId: selectEmprestimo.value,
      dataDevolucao: formDevolucao.elements["data-devolucao"].value
    };
    FerrumUI.mostrarCarregamento(main, true, "Enviando registro de devolução...");
    try {
      const resultado = await registrarDevolucao(db, dados);
      if (!resultado.ok) { FerrumUI.exibirErros(formDevolucao, resultado.erros); return; }
      FerrumUI.limparErros(formDevolucao);
      formDevolucao.reset();
      FerrumUI.mostrarAlerta(formDevolucao.closest("section"), "Devolução registrada com sucesso.", "sucesso");
      await renderTudo();
    } catch (erro) {
      FerrumUI.mostrarAlerta(formDevolucao.closest("section"), erro.message, "erro");
    } finally { FerrumUI.mostrarCarregamento(main, false); }
  });

  await renderTudo();
});
