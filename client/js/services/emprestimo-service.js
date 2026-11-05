import { requisicao } from "../api/ferrum-api.js";
import { FerrumStore } from "../store.js";

export const listarEmprestimos = (db) =>
  requisicao(() => FerrumStore.listarEmprestimos(db));
export const listarEmprestimosAbertos = (db) =>
  requisicao(() => FerrumStore.listarEmprestimosAbertos(db));
export const registrarEmprestimo = (db, dados) =>
  requisicao(() => FerrumStore.registrarEmprestimo(db, dados));
export const registrarDevolucao = (db, dados) =>
  requisicao(() => FerrumStore.registrarDevolucao(db, dados));
