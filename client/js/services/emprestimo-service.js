import { requisicao } from "../api/ferrum-api.js";

export function listarEmprestimos() {
  return requisicao("emprestimos");
}

export function listarEmprestimosAbertos() {
  return requisicao("emprestimos?situacao=aberto");
}

export function registrarEmprestimo(dados) {
  return requisicao("emprestimos", "POST", dados);
}

export function registrarDevolucao(dados) {
  return requisicao(`emprestimos/${dados.emprestimoId}/devolucao`, "PATCH", dados);
}
