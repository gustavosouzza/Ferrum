import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { seedData } from "./dominio.js";

const arquivo = process.env.FERRUM_DB || fileURLToPath(new URL("../data/ferrum.sqlite", import.meta.url));
mkdirSync(dirname(arquivo), { recursive: true });
const banco = new DatabaseSync(arquivo);
banco.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000");
const tabelas = {
  equipamentos: "equipamento",
  emprestimos: "emprestimo",
  manutencoes: "manutencao"
};

// Os nomes das tabelas e colunas vêm exclusivamente do esquema local.
function inserir(tabela, linha) {
  const campos = Object.keys(linha);
  const marcadores = campos.map(() => "?").join(",");
  banco.prepare(`INSERT INTO ${tabela} (${campos.join(",")}) VALUES (${marcadores})`).run(...Object.values(linha));
}

banco.exec("BEGIN IMMEDIATE");
try {
  const versao = banco.prepare("PRAGMA user_version").get().user_version;
  if (versao === 0) {
    banco.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
    const inicial = seedData();
    for (const tabela of [...Object.keys(tabelas), "movimentacoes"]) {
      for (const linha of inicial[tabela]) inserir(tabela, linha);
    }
    banco.exec("PRAGMA user_version = 1");
  } else if (versao !== 1) {
    throw new Error("Versão do banco incompatível com esta entrega.");
  }
  banco.exec("COMMIT");
} catch (erro) {
  banco.exec("ROLLBACK");
  throw erro;
}

function carregar() {
  const estado = { nextIds: {} };
  const sequencia = banco.prepare("SELECT seq FROM sqlite_sequence WHERE name = ?");
  for (const [tabela, chave] of Object.entries(tabelas)) {
    estado[tabela] = banco.prepare(`SELECT * FROM ${tabela} ORDER BY id`).all();
    estado.nextIds[chave] = (sequencia.get(tabela)?.seq || 0) + 1;
  }
  estado.movimentacoes = banco.prepare("SELECT ts, texto FROM movimentacoes ORDER BY id").all();
  return estado;
}

// O domínio opera sobre uma cópia. Apenas linhas alteradas são escritas.
function persistir(anterior, atual) {
  for (const tabela of Object.keys(tabelas)) {
    const antigas = new Map(anterior[tabela].map(item => [item.id, item]));
    for (const item of atual[tabela]) {
      const antes = antigas.get(item.id);
      if (!antes) {
        inserir(tabela, item);
        continue;
      }
      antigas.delete(item.id);
      const campos = Object.keys(item).filter(c => c !== "id" && item[c] !== antes[c]);
      if (campos.length) {
        const atribuicoes = campos.map(c => c + " = ?").join(", ");
        banco.prepare(`UPDATE ${tabela} SET ${atribuicoes} WHERE id = ?`).run(...campos.map(c => item[c]), item.id);
      }
    }
    for (const id of antigas.keys()) banco.prepare(`DELETE FROM ${tabela} WHERE id = ?`).run(id);
  }
  for (const mov of atual.movimentacoes.slice(anterior.movimentacoes.length)) inserir("movimentacoes", mov);
}

export function executar(escrita, operacao) {
  banco.exec(escrita ? "BEGIN IMMEDIATE" : "BEGIN");
  try {
    const estado = carregar();
    const anterior = escrita ? structuredClone(estado) : null;
    const resultado = operacao(estado);
    if (escrita) persistir(anterior, estado);
    banco.exec("COMMIT");
    return resultado;
  } catch (erro) {
    banco.exec("ROLLBACK");
    throw erro;
  }
}
