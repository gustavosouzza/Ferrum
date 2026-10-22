/**
 * ui.js — Etapa 04
 * ------------------------------------------------------------------
 * Funções de apoio para manipulação do DOM, usadas por todas as
 * páginas: exibir/limpar mensagens de erro em campos de formulário,
 * mostrar alertas de sucesso/erro e escapar texto antes de inserir no
 * HTML (evita que dados digitados pelo usuário quebrem a página).
 */

const FerrumUI = (() => {
  /** Evita que o conteúdo inserido via innerHTML seja interpretado como HTML. */
  function escapeHtml(valor) {
    const div = document.createElement("div");
    div.textContent = valor ?? "";
    return div.innerHTML;
  }

  /**
   * Localiza o campo (input/select/textarea) associado a um elemento de
   * erro. Em vez de buscar por `name` — os nomes das chaves de erro
   * retornadas por store.js (ex.: "dataEmprestimo") nem sempre coincidem
   * com o atributo `name` do HTML (ex.: "data-emprestimo") — a busca é
   * feita pela proximidade no DOM: o campo é o input/select/textarea mais
   * próximo dentro do mesmo <p> (ou, na falta de um, do mesmo <fieldset>)
   * que contém o elemento [data-erro-de]. Isso funciona independentemente
   * de como o campo foi nomeado.
   */
  function localizarCampo(alvoErro) {
    if (!alvoErro) return null;
    const container = alvoErro.closest("p") || alvoErro.closest("fieldset") || alvoErro.parentElement;
    return container ? container.querySelector("input, select, textarea") : null;
  }

  /**
   * Aplica as mensagens de erro de `erros` (objeto { nomeDoCampo: mensagem })
   * nos campos correspondentes do formulário, usando o atributo
   * data-erro-de="nomeDoCampo" em um elemento <small> já presente no HTML.
   * Também marca o campo com aria-invalid e a classe "invalido", e leva o
   * foco para o primeiro campo com erro.
   */
  function exibirErros(form, erros) {
    limparErros(form);
    let primeiroInput = null;

    Object.entries(erros).forEach(([campo, mensagem]) => {
      const alvoErro = form.querySelector(`[data-erro-de="${campo}"]`);
      if (alvoErro) alvoErro.textContent = mensagem;

      const input = localizarCampo(alvoErro);
      if (input) {
        if (alvoErro) {
          if (!alvoErro.id) alvoErro.id = `erro-${input.id || campo}`;
          input.setAttribute("aria-describedby", alvoErro.id);
        }
        input.setAttribute("aria-invalid", "true");
        input.classList.add("invalido");
        if (!primeiroInput) primeiroInput = input;
      }
    });

    if (erros.geral) {
      const alvoGeral = form.querySelector('[data-erro-de="geral"]');
      if (alvoGeral) alvoGeral.textContent = erros.geral;
      else mostrarAlerta(form.closest("section") || form, erros.geral, "erro");
    }

    if (primeiroInput && typeof primeiroInput.focus === "function") primeiroInput.focus();
  }

  function limparErros(form) {
    form.querySelectorAll("[data-erro-de]").forEach((el) => {
      el.textContent = "";
    });
    form.querySelectorAll(".invalido").forEach((el) => {
      el.classList.remove("invalido");
      el.removeAttribute("aria-invalid");
    });
  }

  /**
   * Mostra uma mensagem de retorno (sucesso ou erro) dentro de um
   * elemento com [data-alerta] próximo ao formulário. A mensagem some
   * sozinha depois de alguns segundos quando é de sucesso.
   */
  function mostrarAlerta(container, mensagem, tipo = "sucesso") {
    const alvo = container.querySelector("[data-alerta]");
    if (!alvo) return;
    // Torna o alerta visível antes de definir o texto e informa o tipo
    // aos leitores de tela (erro = assertivo, sucesso = educado).
    alvo.className = `alerta alerta-${tipo}`;
    alvo.setAttribute("role", tipo === "erro" ? "alert" : "status");
    alvo.hidden = false;
    alvo.textContent = mensagem;
    if (tipo === "sucesso") {
      clearTimeout(alvo._timeoutId);
      alvo._timeoutId = setTimeout(() => {
        alvo.hidden = true;
      }, 4000);
    }
  }

  function limparAlerta(container) {
    const alvo = container.querySelector("[data-alerta]");
    if (alvo) alvo.hidden = true;
  }

  return { escapeHtml, exibirErros, limparErros, mostrarAlerta, limparAlerta };
})();