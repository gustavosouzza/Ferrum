/**
 * equipamentos.js — Etapa 05
 * Tela de cadastro, edição, exclusão e consulta assíncrona de equipamentos.
 */
import { FerrumStore } from "./store.js";
import { FerrumUI } from "./ui.js";
import {
  listarEquipamentos, buscarEquipamento, adicionarEquipamento,
  editarEquipamento, excluirEquipamento
} from "./services/equipamento-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const db = FerrumStore.load();
  const main = document.querySelector("main");
  const form = document.getElementById("form-equipamento");
  const filtro = document.getElementById("form-filtro-equipamentos");
  const secaoCadastro = form.closest("section");
  const secaoLista = document.getElementById("lista-titulo").closest("section");
  const situacao = form.elements.situacao;
  let confirmandoExclusaoId = null;

  const dicaCadastro = "Ao escolher Emprestado ou Em manutenção, informe os dados abaixo: o registro também aparecerá nas telas de Empréstimos e Manutenções.";
  const dicaEdicao = "A situação é alterada automaticamente pelas telas de Empréstimos e Manutenções, não pode ser editada aqui diretamente.";

  function atualizarCamposSituacao() {
    const cadastrando = !situacao.disabled;
    const mostrarEmprestimo = cadastrando && situacao.value === "emprestado";
    const mostrarManutencao = cadastrando && situacao.value === "manutencao";
    document.getElementById("campos-emprestimo").hidden = !mostrarEmprestimo;
    document.getElementById("campos-manutencao").hidden = !mostrarManutencao;
    if (mostrarEmprestimo && !document.getElementById("emp-data").value) document.getElementById("emp-data").value = FerrumStore.hojeISO();
    if (mostrarManutencao && !document.getElementById("man-data").value) document.getElementById("man-data").value = FerrumStore.hojeISO();
  }

  async function renderTabela() {
    FerrumUI.mostrarCarregamento(main, true, "Consultando equipamentos...");
    try {
      const filtros = {
        categoria: filtro.elements["filtro-categoria"].value,
        situacao: filtro.elements["filtro-situacao"].value
      };
      const lista = await listarEquipamentos(db, filtros);
      const corpo = document.getElementById("tabela-equipamentos");
      const vazio = document.getElementById("lista-vazia");
      corpo.innerHTML = "";
      vazio.hidden = lista.length !== 0;
      corpo.closest(".table-responsive").hidden = lista.length === 0;

      lista.forEach((equipamento) => {
        const linha = document.createElement("tr");
        const emConfirmacao = confirmandoExclusaoId === equipamento.id;
        const podeExcluir = equipamento.situacao === "disponivel";
        const acoes = emConfirmacao
          ? `<span class="confirmacao-exclusao">Confirmar exclusão?
              <button type="button" class="btn-link btn-perigo" data-acao="confirmar-excluir" data-id="${equipamento.id}">Sim, excluir</button>
              <button type="button" class="btn-link" data-acao="cancelar-excluir">Cancelar</button></span>`
          : `<button type="button" class="btn-link" data-acao="editar" data-id="${equipamento.id}">Editar</button>
              <button type="button" class="btn-link btn-perigo" data-acao="excluir" data-id="${equipamento.id}" ${podeExcluir ? "" : "disabled"}>Excluir</button>
              ${podeExcluir ? "" : `<small class="dica-campo">Não pode ser excluído: ${equipamento.situacao === "emprestado" ? "emprestado" : "em manutenção"}.</small>`}`;
        linha.innerHTML = `
          <td data-label="Nome">${FerrumUI.escapeHtml(equipamento.nome)}</td>
          <td data-label="Categoria">${FerrumUI.escapeHtml(FerrumStore.CATEGORIAS[equipamento.categoria] || equipamento.categoria)}</td>
          <td data-label="Situação"><span class="etiqueta etiqueta-${equipamento.situacao}">${FerrumUI.escapeHtml(FerrumStore.SITUACOES_EQUIPAMENTO[equipamento.situacao])}</span></td>
          <td data-label="Ações">${acoes}</td>`;
        corpo.appendChild(linha);
      });
    } catch (erro) {
      FerrumUI.mostrarAlerta(secaoLista, erro.message || "Erro ao consultar equipamentos.", "erro");
    } finally {
      FerrumUI.mostrarCarregamento(main, false);
    }
  }

  function sairDoModoEdicao() {
    form.reset();
    form.elements.equipamentoId.value = "";
    situacao.disabled = false;
    document.getElementById("dica-situacao").textContent = dicaCadastro;
    document.getElementById("cadastro-titulo").textContent = "Cadastrar equipamento";
    document.getElementById("botao-salvar-equipamento").textContent = "Cadastrar equipamento";
    document.getElementById("botao-cancelar-edicao").textContent = "Limpar";
    atualizarCamposSituacao();
  }

  async function entrarNoModoEdicao(id) {
    try {
      const equipamento = await buscarEquipamento(db, id);
      if (!equipamento) return;
      confirmandoExclusaoId = null;
      form.elements.equipamentoId.value = equipamento.id;
      form.elements.nome.value = equipamento.nome;
      form.elements.identificacao.value = equipamento.identificacao;
      form.elements.descricao.value = equipamento.descricao;
      form.elements.categoria.value = equipamento.categoria;
      situacao.value = equipamento.situacao;
      situacao.disabled = true;
      document.getElementById("dica-situacao").textContent = dicaEdicao;
      atualizarCamposSituacao();
      document.getElementById("cadastro-titulo").textContent = `Editando: ${equipamento.nome}`;
      document.getElementById("botao-salvar-equipamento").textContent = "Salvar alterações";
      document.getElementById("botao-cancelar-edicao").textContent = "Cancelar edição";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (erro) {
      FerrumUI.mostrarAlerta(secaoLista, erro.message, "erro");
    }
  }

  situacao.addEventListener("change", atualizarCamposSituacao);
  form.addEventListener("reset", () => setTimeout(atualizarCamposSituacao, 0));
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = {
      nome: form.elements.nome.value,
      identificacao: form.elements.identificacao.value,
      descricao: form.elements.descricao.value,
      categoria: form.elements.categoria.value,
      situacao: situacao.value,
      emprestimo: {
        responsavel: document.getElementById("emp-responsavel").value,
        dataEmprestimo: document.getElementById("emp-data").value,
        previsaoDevolucao: document.getElementById("emp-previsao").value
      },
      manutencao: {
        descricao: document.getElementById("man-descricao").value,
        dataInicio: document.getElementById("man-data").value
      }
    };
    const id = form.elements.equipamentoId.value;
    FerrumUI.mostrarCarregamento(main, true, "Enviando dados do equipamento...");
    try {
      const resultado = id
        ? await editarEquipamento(db, Number(id), dados)
        : await adicionarEquipamento(db, dados);
      if (!resultado.ok) {
        FerrumUI.exibirErros(form, resultado.erros || { geral: resultado.mensagem });
        return;
      }
      FerrumUI.limparErros(form);
      sairDoModoEdicao();
      FerrumUI.mostrarAlerta(secaoCadastro, id ? "Equipamento atualizado com sucesso." : "Equipamento cadastrado com sucesso.", "sucesso");
      await renderTabela();
    } catch (erro) {
      FerrumUI.mostrarAlerta(secaoCadastro, erro.message || "Erro de comunicação ao salvar equipamento.", "erro");
    } finally {
      FerrumUI.mostrarCarregamento(main, false);
    }
  });

  document.getElementById("botao-cancelar-edicao").addEventListener("click", () => {
    sairDoModoEdicao();
    FerrumUI.limparErros(form);
    FerrumUI.limparAlerta(secaoCadastro);
  });
  filtro.addEventListener("submit", (e) => { e.preventDefault(); renderTabela(); });
  filtro.addEventListener("change", renderTabela);
  document.getElementById("botao-limpar-filtro").addEventListener("click", () => { filtro.reset(); renderTabela(); });

  document.getElementById("tabela-equipamentos").addEventListener("click", async (evento) => {
    const botao = evento.target.closest("[data-acao]");
    if (!botao) return;
    const acao = botao.dataset.acao;
    const id = Number(botao.dataset.id);
    if (acao === "editar") return entrarNoModoEdicao(id);
    if (acao === "excluir") { confirmandoExclusaoId = id; return renderTabela(); }
    if (acao === "cancelar-excluir") { confirmandoExclusaoId = null; return renderTabela(); }
    if (acao === "confirmar-excluir") {
      FerrumUI.mostrarCarregamento(main, true, "Enviando solicitação de exclusão...");
      try {
        const resultado = await excluirEquipamento(db, id);
        FerrumUI.mostrarAlerta(secaoLista, resultado.ok ? "Equipamento excluído com sucesso." : resultado.mensagem, resultado.ok ? "sucesso" : "erro");
      } catch (erro) {
        FerrumUI.mostrarAlerta(secaoLista, erro.message, "erro");
      } finally {
        confirmandoExclusaoId = null;
        FerrumUI.mostrarCarregamento(main, false);
        await renderTabela();
      }
    }
  });

  atualizarCamposSituacao();
  await renderTabela();
});
