import { requisicao } from "../api/ferrum-api.js";

export function listarManutencoes() {
  return requisicao("manutencoes");
}

export function listarManutencoesAbertas() {
  return requisicao("manutencoes?situacao=em-andamento");
}

export function registrarManutencao(dados) {
  return requisicao("manutencoes", "POST", dados);
}

export function concluirManutencao(dados) {
  return requisicao(`manutencoes/${dados.manutencaoId}/conclusao`, "PATCH", dados);
}
