import { requisicao } from "../api/ferrum-api.js";
import { FerrumStore } from "../store.js";

export const listarEquipamentos = (db, filtros = {}) =>
  requisicao(() => FerrumStore.listarEquipamentos(db, filtros));
export const buscarEquipamento = (db, id) =>
  requisicao(() => FerrumStore.buscarEquipamento(db, id));
export const adicionarEquipamento = (db, dados) =>
  requisicao(() => FerrumStore.adicionarEquipamento(db, dados));
export const editarEquipamento = (db, id, dados) =>
  requisicao(() => FerrumStore.editarEquipamento(db, id, dados));
export const excluirEquipamento = (db, id) =>
  requisicao(() => FerrumStore.excluirEquipamento(db, id));
