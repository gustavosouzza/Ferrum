import * as dominio from "./dominio.js";
import { CATEGORIAS, SITUACOES_EQUIPAMENTO, hojeISO } from "../client/js/formatacao.js";

export class ErroHttp extends Error {
  constructor(status, mensagem, erros = { geral: mensagem }) {
    super(mensagem);
    this.status = status;
    this.erros = erros;
  }
}

function validarTipos(dados, nivel = 0) {
  if (!dados || Array.isArray(dados) || typeof dados !== "object") {
    throw new ErroHttp(400, "Envie um objeto JSON.");
  }
  for (const [campo, valor] of Object.entries(dados)) {
    if (!nivel && ["emprestimo", "manutencao"].includes(campo)) {
      validarTipos(valor, 1);
    } else if (typeof valor !== "string" && !(campo.endsWith("Id") && Number.isSafeInteger(valor))) {
      throw new ErroHttp(422, "Tipo inválido.", { [campo]: "Informe um valor válido." });
    }
  }
}

function entidade(resultado, chave) {
  if (resultado.ok) return resultado[chave];
  const mensagem = resultado.mensagem || Object.values(resultado.erros)[0];
  const conflito = /já existe|não está disponível|já está|está emprestado|já devolvido|já concluída|possui histórico|não é possível excluir/i.test(mensagem);
  throw new ErroHttp(conflito ? 409 : 422, mensagem, resultado.erros);
}

const rotas = [
  ["GET", "/api/dashboard", db => ({
    stats: dominio.getStats(db), equipamentos: db.equipamentos,
    pendentes: dominio.listarEmprestimosAbertos(db),
    movimentacoes: dominio.getMovimentacoesRecentes(db, 6), hoje: hojeISO()
  })],
  ["GET", "/api/equipamentos", (db, p) => dominio.listarEquipamentos(db, p.filtros)],
  ["GET", "/api/equipamentos/:id", (db, p) => equipamento(db, p.id)],
  ["POST", "/api/equipamentos", (db, p) => salvarEquipamento(db, p)],
  ["PUT", "/api/equipamentos/:id", (db, p) => salvarEquipamento(db, p)],
  ["DELETE", "/api/equipamentos/:id", (db, p) => {
    equipamento(db, p.id);
    entidade(dominio.excluirEquipamento(db, p.id));
  }],
  ["GET", "/api/emprestimos", (db, p) => historico(db, dominio.listarEmprestimos(db), p)],
  ["GET", "/api/manutencoes", (db, p) => historico(db, dominio.listarManutencoes(db), p)],
  ["POST", "/api/emprestimos", (db, p) => entidade(dominio.registrarEmprestimo(db, p.dados), "emprestimo")],
  ["POST", "/api/manutencoes", (db, p) => {
    if (p.dados.situacao && !["em-andamento", "concluida"].includes(p.dados.situacao)) {
      throw new ErroHttp(422, "Situação de manutenção inválida.");
    }
    return entidade(dominio.registrarManutencao(db, p.dados), "manutencao");
  }],
  ["PATCH", "/api/emprestimos/:id/devolucao", (db, p) => {
    if (!db.emprestimos.some(e => e.id === p.id)) throw new ErroHttp(404, "Empréstimo não encontrado.");
    return entidade(dominio.registrarDevolucao(db, { ...p.dados, emprestimoId: p.id }), "emprestimo");
  }],
  ["PATCH", "/api/manutencoes/:id/conclusao", (db, p) => {
    if (!db.manutencoes.some(m => m.id === p.id)) throw new ErroHttp(404, "Manutenção não encontrada.");
    return entidade(dominio.concluirManutencao(db, { ...p.dados, manutencaoId: p.id }), "manutencao");
  }]
];

function equipamento(db, id) {
  const item = dominio.buscarEquipamento(db, id);
  if (!item) throw new ErroHttp(404, "Equipamento não encontrado.");
  return item;
}

function salvarEquipamento(db, { id, dados }) {
  const anterior = id && equipamento(db, id);
  if (!Object.hasOwn(CATEGORIAS, dados.categoria)) throw new ErroHttp(422, "Categoria inválida.", { categoria: "Selecione uma categoria válida." });
  if (dados.situacao && !Object.hasOwn(SITUACOES_EQUIPAMENTO, dados.situacao)) throw new ErroHttp(422, "Situação inválida.");
  if (anterior && dados.situacao && anterior.situacao !== dados.situacao) throw new ErroHttp(409, "Altere a situação pela operação de empréstimo ou manutenção.");
  const resultado = id ? dominio.editarEquipamento(db, id, dados) : dominio.adicionarEquipamento(db, dados);
  return entidade(resultado, "equipamento");
}

function historico(db, itens, { filtros }) {
  const nomes = new Map(db.equipamentos.map(e => [e.id, e.nome]));
  return itens.filter(i => !filtros.situacao || i.situacao === filtros.situacao)
    .map(i => ({ ...i, equipamentoNome: nomes.get(i.equipamentoId) }));
}

export function resolver(method, url, dados) {
  const permitidos = [];
  for (const [verbo, caminho, acao] of rotas) {
    const match = new RegExp("^" + caminho.replace(":id", "([1-9][0-9]*)") + "/?$").exec(url.pathname);
    if (!match) continue;
    permitidos.push(verbo);
    if (method !== verbo) continue;
    if (["POST", "PUT", "PATCH"].includes(method)) validarTipos(dados);
    return db => acao(db, { id: Number(match[1]) || null, dados, filtros: Object.fromEntries(url.searchParams) });
  }
  if (permitidos.length) {
    const erro = new ErroHttp(405, "Método não permitido.");
    erro.allow = permitidos.join(", ");
    throw erro;
  }
  throw new ErroHttp(404, "Rota não encontrada.");
}
