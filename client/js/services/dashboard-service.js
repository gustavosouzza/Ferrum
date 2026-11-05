import { requisicao } from "../api/ferrum-api.js";
import { FerrumStore } from "../store.js";

export const consultarResumo = (db) => requisicao(() => ({
  stats: FerrumStore.getStats(db),
  pendentes: FerrumStore.listarEmprestimosAbertos(db),
  equipamentos: db.equipamentos,
  movimentacoes: FerrumStore.getMovimentacoesRecentes(db, 6),
  hoje: FerrumStore.hojeISO()
}));
