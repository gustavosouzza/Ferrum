import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolver, ErroHttp } from "./api.js";
import { executar } from "./repositorio.js";

const client = fileURLToPath(new URL("../client", import.meta.url));
const tipos = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

async function corpo(req) {
  if (req.headers["content-type"]?.split(";")[0].trim() !== "application/json") {
    throw new ErroHttp(415, "Use Content-Type application/json.");
  }
  const partes = [];
  let tamanho = 0;
  for await (const parte of req) {
    tamanho += parte.length;
    if (tamanho > 65536) throw new ErroHttp(413, "Corpo da requisição muito grande.");
    partes.push(parte);
  }
  try { return JSON.parse(Buffer.concat(partes).toString()); }
  catch { throw new ErroHttp(400, "JSON inválido."); }
}

const servidor = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname.startsWith("/api/")) {
      const dados = ["POST", "PUT", "PATCH"].includes(req.method) ? await corpo(req) : undefined;
      const acao = resolver(req.method, url, dados);
      const resultado = executar(req.method !== "GET", acao);
      const status = req.method === "POST" ? 201 : req.method === "DELETE" ? 204 : 200;
      if (status === 201 && url.pathname.replace(/\/$/, "") === "/api/equipamentos") {
        res.setHeader("Location", "/api/equipamentos/" + resultado.id);
      }
      res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(resultado));
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) throw new ErroHttp(405, "Método não permitido.");
    const caminho = resolve(client, "." + (url.pathname === "/" ? "/index.html" : url.pathname));
    if (!caminho.startsWith(client + sep) || !tipos[extname(caminho)]) throw new ErroHttp(404, "Página não encontrada.");
    const arquivo = await readFile(caminho);
    res.writeHead(200, { "Content-Type": tipos[extname(caminho)] + "; charset=utf-8" });
    res.end(req.method === "HEAD" ? undefined : arquivo);
  } catch (erro) {
    const status = erro.status || (erro.code === "ENOENT" ? 404 : 500);
    if (status === 500) console.error(erro);
    const mensagem = erro.status ? erro.message : status === 404 ? "Página não encontrada." : "Falha interna ao processar a operação.";
    if (erro.allow) res.setHeader("Allow", erro.allow);
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, mensagem, erros: erro.erros || { geral: mensagem } }));
  }
});
const porta = Number(process.env.PORT || 3000);
servidor.listen(porta, "127.0.0.1", () => console.log("Ferrum em http://127.0.0.1:" + servidor.address().port));
