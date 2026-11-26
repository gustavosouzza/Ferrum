export async function requisicao(caminho, method = "GET", dados) {
  const resposta = await fetch("/api/" + caminho, {
    method,
    headers: dados ? { "Content-Type": "application/json" } : {},
    body: dados ? JSON.stringify(dados) : undefined
  });
  if (resposta.status === 204) return { ok: true };
  const corpo = await resposta.json();
  if (!resposta.ok) {
    if (method !== "GET" && resposta.status < 500) return corpo;
    throw new Error(corpo.mensagem || "Falha ao consultar o servidor.");
  }
  return method === "GET" ? corpo : { ok: true, recurso: corpo };
}
