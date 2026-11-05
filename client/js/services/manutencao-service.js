import { requisicao } from "../api/ferrum-api.js";
import { FerrumStore } from "../store.js";

export const listarManutencoes = (db) =>
  requisicao(() => FerrumStore.listarManutencoes(db));
export const listarManutencoesAbertas = (db) =>
  requisicao(() => FerrumStore.listarManutencoesAbertas(db));
export const registrarManutencao = (db, dados) =>
  requisicao(() => FerrumStore.registrarManutencao(db, dados));
export const concluirManutencao = (db, dados) =>
  requisicao(() => FerrumStore.concluirManutencao(db, dados));
