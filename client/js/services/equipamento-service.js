import { requisicao } from "../api/ferrum-api.js";

export function listarEquipamentos(filtros = {}) {
  return requisicao("equipamentos?" + new URLSearchParams(filtros));
}

export function buscarEquipamento(id) {
  return requisicao(`equipamentos/${id}`);
}

export function adicionarEquipamento(dados) {
  return requisicao("equipamentos", "POST", dados);
}

export function editarEquipamento(id, dados) {
  return requisicao(`equipamentos/${id}`, "PUT", dados);
}

export function excluirEquipamento(id) {
  return requisicao(`equipamentos/${id}`, "DELETE");
}
