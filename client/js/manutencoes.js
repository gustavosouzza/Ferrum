/**
 * manutencoes.js — Etapa 05
 * Registro e consulta assíncrona de manutenções.
 */
import { FerrumStore } from "./store.js";
import { FerrumUI } from "./ui.js";
import { listarEquipamentos } from "./services/equipamento-service.js";
import {
  listarManutencoes, listarManutencoesAbertas,
  registrarManutencao, concluirManutencao
} from "./services/manutencao-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const db = FerrumStore.load();
  const main = document.querySelector("main");
  const formManutencao = document.getElementById("form-manutencao");
  const formConcluir = document.getElementById("form-concluir-manutencao");
  const selectEquipamento = document.getElementById("equipamento-manutencao");
  const selectManutencao = document.getElementById("manutencao-concluir");

  async function renderTudo() {
    FerrumUI.mostrarCarregamento(main, true, "Consultando manutenções...");
    try {
      const [equipamentos, abertas, historico] = await Promise.all([
        listarEquipamentos(db, { situacao: "disponivel" }),
        listarManutencoesAbertas(db),
        listarManutencoes(db)
      ]);
      selectEquipamento.innerHTML = '<option value="">Selecione um equipamento</option>';
      equipamentos.forEach((equip) => {
        const option = document.createElement("option");
        option.value = equip.id;
        option.textContent = `${equip.nome} (${equip.identificacao})`;
        selectEquipamento.appendChild(option);
      });
      const semEquipamentos = equipamentos.length === 0;
      document.getElementById("sem-equipamentos-para-manutencao").hidden = !semEquipamentos;
      selectEquipamento.disabled = semEquipamentos;
      formManutencao.querySelector('button[type="submit"]').disabled = semEquipamentos;

      selectManutencao.innerHTML = '<option value="">Selecione uma manutenção</option>';
      abertas.forEach((manutencao) => {
        const equip = db.equipamentos.find((e) => e.id === manutencao.equipamentoId);
        const option = document.createElement("option");
        option.value = manutencao.id;
        option.textContent = `${equip ? equip.nome : "—"} — iniciada em ${FerrumStore.formatarData(manutencao.dataInicio)}`;
        selectManutencao.appendChild(option);
      });
      const semAbertas = abertas.length === 0;
      document.getElementById("sem-manutencoes-abertas").hidden = !semAbertas;
      selectManutencao.disabled = semAbertas;
      formConcluir.querySelector('button[type="submit"]').disabled = semAbertas;
      renderHistorico(historico);
    } catch (erro) {
      FerrumUI.mostrarAlerta(main, erro.message || "Não foi possível consultar as manutenções.", "erro");
    } finally { FerrumUI.mostrarCarregamento(main, false); }
  }

  function renderHistorico(historico) {
    const corpo = document.getElementById("tabela-manutencoes");
    corpo.innerHTML = "";
    historico.forEach((manutencao) => {
      const equipamento = db.equipamentos.find((e) => e.id === manutencao.equipamentoId);
      const emAndamento = manutencao.situacao === "em-andamento";
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td data-label="Equipamento">${FerrumUI.escapeHtml(equipamento ? equipamento.nome : "Equipamento removido")}</td>
        <td data-label="Descrição">${FerrumUI.escapeHtml(manutencao.descricao)}</td>
        <td data-label="Data de início">${FerrumStore.formatarData(manutencao.dataInicio)}</td>
        <td data-label="Data de conclusão">${FerrumStore.formatarData(manutencao.dataConclusao)}</td>
        <td data-label="Situação"><span class="etiqueta etiqueta-${emAndamento ? "manutencao" : "disponivel"}">${emAndamento ? "Em andamento" : "Concluída"}</span></td>`;
      corpo.appendChild(linha);
    });
  }

  formManutencao.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = {
      equipamentoId: selectEquipamento.value,
      descricao: formManutencao.elements["descricao-problema"].value,
      dataInicio: formManutencao.elements["data-inicio"].value,
      situacao: formManutencao.elements["situacao-manutencao"].value,
      observacoes: formManutencao.elements["observacoes-manutencao"].value
    };
    FerrumUI.mostrarCarregamento(main, true, "Enviando registro de manutenção...");
    try {
      const resultado = await registrarManutencao(db, dados);
      if (!resultado.ok) { FerrumUI.exibirErros(formManutencao, resultado.erros); return; }
      FerrumUI.limparErros(formManutencao);
      formManutencao.reset();
      FerrumUI.mostrarAlerta(formManutencao.closest("section"), "Manutenção registrada com sucesso.", "sucesso");
      await renderTudo();
    } catch (erro) {
      FerrumUI.mostrarAlerta(formManutencao.closest("section"), erro.message, "erro");
    } finally { FerrumUI.mostrarCarregamento(main, false); }
  });

  formConcluir.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = {
      manutencaoId: selectManutencao.value,
      dataConclusao: formConcluir.elements["data-conclusao"].value
    };
    FerrumUI.mostrarCarregamento(main, true, "Enviando conclusão da manutenção...");
    try {
      const resultado = await concluirManutencao(db, dados);
      if (!resultado.ok) { FerrumUI.exibirErros(formConcluir, resultado.erros); return; }
      FerrumUI.limparErros(formConcluir);
      formConcluir.reset();
      FerrumUI.mostrarAlerta(formConcluir.closest("section"), "Manutenção concluída com sucesso.", "sucesso");
      await renderTudo();
    } catch (erro) {
      FerrumUI.mostrarAlerta(formConcluir.closest("section"), erro.message, "erro");
    } finally { FerrumUI.mostrarCarregamento(main, false); }
  });

  await renderTudo();
});
