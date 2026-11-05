/**
 * ferrum-api.js — Camada de comunicação da Etapa 05.
 * Simula uma API REST: recebe uma operação, aguarda a resposta e devolve
 * os dados em formato semelhante ao JSON de um servidor.
 */
const TEMPO_RESPOSTA = 450;
const CHAVE_FALHA = "ferrum-simular-erro";

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requisicao(operacao) {
  await aguardar(TEMPO_RESPOSTA);

  // Permite demonstrar o tratamento de erro sem depender de um servidor real.
  if (sessionStorage.getItem(CHAVE_FALHA) === "true") {
    throw new Error("Falha simulada de comunicação com o servidor Ferrum.");
  }

  try {
    const resultado = operacao();
    if (resultado && resultado.ok === false) return resultado;
    return resultado;
  } catch (erro) {
    throw new Error(erro.message || "Não foi possível concluir a comunicação.");
  }
}
