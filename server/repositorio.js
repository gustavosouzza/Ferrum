import { seedData } from "./dominio.js";

let estado = seedData();
export function executar(escrita, operacao) {
  if (!escrita) return operacao(estado);
  const copia = structuredClone(estado);
  const resultado = operacao(copia);
  estado = copia;
  return resultado;
}
