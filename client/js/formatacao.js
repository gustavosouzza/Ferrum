export function hojeISO() {
  const d = new Date();
  const dois = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

export function formatarData(iso) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(isoDateTime) {
  const d = new Date(isoDateTime);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export const CATEGORIAS = {
  "ferramenta-manual": "Ferramenta manual",
  "ferramenta-eletrica": "Ferramenta elétrica",
  "equipamento-medicao": "Equipamento de medição",
  "equipamento-seguranca": "Equipamento de segurança"
};

export const SITUACOES_EQUIPAMENTO = {
  disponivel: "Disponível",
  emprestado: "Emprestado",
  manutencao: "Em manutenção"
};

