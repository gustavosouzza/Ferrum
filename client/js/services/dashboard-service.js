import { requisicao } from "../api/ferrum-api.js";

export function consultarResumo() {
  return requisicao("dashboard");
}
