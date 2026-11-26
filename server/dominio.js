import { hojeISO } from "../client/js/formatacao.js";

export function seedData() {
  return {
    equipamentos: [
      { id: 1, nome: "Furadeira de Impacto", identificacao: "FI-001", descricao: "Furadeira de impacto 750W", categoria: "ferramenta-eletrica", situacao: "emprestado", dataCadastro: "2026-08-01" },
      { id: 2, nome: "Multímetro Digital", identificacao: "MD-002", descricao: "Multímetro digital de bancada", categoria: "equipamento-medicao", situacao: "emprestado", dataCadastro: "2026-08-01" },
      { id: 3, nome: "Compressor de Ar", identificacao: "CA-003", descricao: "Compressor de ar 24L", categoria: "ferramenta-eletrica", situacao: "manutencao", dataCadastro: "2026-08-02" },
      { id: 4, nome: "Chave de Torque", identificacao: "CT-004", descricao: "Chave de torque 10-60Nm", categoria: "ferramenta-manual", situacao: "disponivel", dataCadastro: "2026-08-02" },
      { id: 5, nome: "Parafusadeira", identificacao: "PF-005", descricao: "Parafusadeira a bateria 12V", categoria: "ferramenta-eletrica", situacao: "disponivel", dataCadastro: "2026-08-03" },
      { id: 6, nome: "Trena a Laser", identificacao: "TL-006", descricao: "Trena a laser até 40m", categoria: "equipamento-medicao", situacao: "disponivel", dataCadastro: "2026-08-03" },
      { id: 7, nome: "Capacete de Segurança", identificacao: "CS-007", descricao: "Capacete de segurança classe B", categoria: "equipamento-seguranca", situacao: "disponivel", dataCadastro: "2026-08-04" },
      { id: 8, nome: "Serra Circular", identificacao: "SC-008", descricao: "Serra circular 7.1/4 pol.", categoria: "ferramenta-eletrica", situacao: "disponivel", dataCadastro: "2026-08-04" }
    ],
    emprestimos: [
      { id: 1, equipamentoId: 1, responsavel: "Carlos Silva", dataEmprestimo: "2026-08-25", previsaoDevolucao: "2026-09-05", dataDevolucao: null, observacoes: "", situacao: "aberto" },
      { id: 2, equipamentoId: 2, responsavel: "Ana Pereira", dataEmprestimo: "2026-08-28", previsaoDevolucao: "2026-09-02", dataDevolucao: null, observacoes: "", situacao: "aberto" },
      { id: 3, equipamentoId: 4, responsavel: "João Souza", dataEmprestimo: "2026-08-20", previsaoDevolucao: "2026-08-24", dataDevolucao: "2026-08-24", observacoes: "", situacao: "devolvido" }
    ],
    manutencoes: [
      { id: 1, equipamentoId: 3, descricao: "Vazamento no reservatório", dataInicio: "2026-08-22", dataConclusao: null, situacao: "em-andamento", observacoes: "" },
      { id: 2, equipamentoId: 1, descricao: "Troca de escovas do motor", dataInicio: "2026-08-10", dataConclusao: "2026-08-15", situacao: "concluida", observacoes: "" }
    ],
    movimentacoes: [
      { ts: "2026-08-10T09:00:00", texto: "Manutenção registrada — Furadeira de Impacto" },
      { ts: "2026-08-15T09:00:00", texto: "Manutenção concluída — Furadeira de Impacto" },
      { ts: "2026-08-20T09:00:00", texto: "Empréstimo registrado — Chave de Torque — João Souza" },
      { ts: "2026-08-22T09:00:00", texto: "Manutenção iniciada — Compressor de Ar" },
      { ts: "2026-08-24T09:00:00", texto: "Devolução registrada — Chave de Torque" },
      { ts: "2026-08-25T09:00:00", texto: "Empréstimo registrado — Furadeira de Impacto — Carlos Silva" },
      { ts: "2026-08-28T09:00:00", texto: "Empréstimo registrado — Multímetro Digital — Ana Pereira" }
    ],
    nextIds: { equipamento: 9, emprestimo: 4, manutencao: 3 }
  };
}

export function dataISOValida(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

export function registrarMovimentacao(db, texto) {
  db.movimentacoes.push({ ts: new Date().toISOString(), texto });
}

// ----------------------------------------------------------------
// Equipamentos
// ----------------------------------------------------------------

export function listarEquipamentos(db, filtros = {}) {
  return db.equipamentos.filter((equip) => {
    const bateCategoria = !filtros.categoria || equip.categoria === filtros.categoria;
    const bateSituacao = !filtros.situacao || equip.situacao === filtros.situacao;
    return bateCategoria && bateSituacao;
  });
}

export function buscarEquipamento(db, id) {
  return db.equipamentos.find((e) => e.id === id) || null;
}

/**
 * Cadastra um novo equipamento.
 * Retorna { ok: true, equipamento } ou { ok: false, erros: { campo: mensagem } }.
 */
export function adicionarEquipamento(db, dados) {
  const erros = {};
  const nome = (dados.nome || "").trim();
  const identificacao = (dados.identificacao || "").trim();

  if (!nome) erros.nome = "Informe o nome do equipamento.";
  if (!identificacao) {
    erros.identificacao = "Informe a identificação (patrimônio).";
  } else {
    const jaExiste = db.equipamentos.some(
      (e) => e.identificacao.toLowerCase() === identificacao.toLowerCase()
    );
    if (jaExiste) erros.identificacao = "Já existe um equipamento com essa identificação.";
  }
  if (!dados.categoria) erros.categoria = "Selecione uma categoria.";

  // Situação inicial: "emprestado" e "manutencao" exigem os dados do
  // registro correspondente, que é criado junto com o equipamento.
  const situacao = ["emprestado", "manutencao"].includes(dados.situacao) ? dados.situacao : "disponivel";
  const emp = dados.emprestimo || {};
  const man = dados.manutencao || {};
  if (situacao === "emprestado") {
    if (!(emp.responsavel || "").trim()) erros.emprestimoResponsavel = "Informe o responsável.";
    if (!dataISOValida(emp.dataEmprestimo)) erros.emprestimoData = "Informe uma data de empréstimo válida.";
    if (!dataISOValida(emp.previsaoDevolucao)) {
      erros.emprestimoPrevisao = "Informe uma previsão de devolução válida.";
    } else if (dataISOValida(emp.dataEmprestimo) && emp.previsaoDevolucao < emp.dataEmprestimo) {
      erros.emprestimoPrevisao = "A previsão de devolução não pode ser anterior à data do empréstimo.";
    }
  } else if (situacao === "manutencao") {
    if (!(man.descricao || "").trim()) erros.manutencaoDescricao = "Descreva o problema ou serviço.";
    if (!dataISOValida(man.dataInicio)) erros.manutencaoData = "Informe uma data de início válida.";
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  const equipamento = {
    id: db.nextIds.equipamento++,
    nome,
    identificacao,
    descricao: (dados.descricao || "").trim(),
    categoria: dados.categoria,
    situacao,
    dataCadastro: hojeISO()
  };
  db.equipamentos.push(equipamento);
  registrarMovimentacao(db, `Equipamento cadastrado — ${equipamento.nome}`);

  if (situacao === "emprestado") {
    const responsavel = emp.responsavel.trim();
    db.emprestimos.push({
      id: db.nextIds.emprestimo++,
      equipamentoId: equipamento.id,
      responsavel,
      dataEmprestimo: emp.dataEmprestimo,
      previsaoDevolucao: emp.previsaoDevolucao,
      dataDevolucao: null,
      observacoes: "",
      situacao: "aberto"
    });
    registrarMovimentacao(db, `Empréstimo registrado — ${equipamento.nome} — ${responsavel}`);
  } else if (situacao === "manutencao") {
    db.manutencoes.push({
      id: db.nextIds.manutencao++,
      equipamentoId: equipamento.id,
      descricao: man.descricao.trim(),
      dataInicio: man.dataInicio,
      dataConclusao: null,
      situacao: "em-andamento",
      observacoes: ""
    });
    registrarMovimentacao(db, `Manutenção iniciada — ${equipamento.nome}`);
  }

  return { ok: true, equipamento };
}

export function editarEquipamento(db, id, dados) {
  const equipamento = buscarEquipamento(db, id);
  if (!equipamento) return { ok: false, erros: { geral: "Equipamento não encontrado." } };

  const erros = {};
  const nome = (dados.nome || "").trim();
  const identificacao = (dados.identificacao || "").trim();

  if (!nome) erros.nome = "Informe o nome do equipamento.";
  if (!identificacao) {
    erros.identificacao = "Informe a identificação (patrimônio).";
  } else {
    const duplicado = db.equipamentos.some(
      (e) => e.id !== id && e.identificacao.toLowerCase() === identificacao.toLowerCase()
    );
    if (duplicado) erros.identificacao = "Já existe outro equipamento com essa identificação.";
  }
  if (!dados.categoria) erros.categoria = "Selecione uma categoria.";

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  equipamento.nome = nome;
  equipamento.identificacao = identificacao;
  equipamento.descricao = (dados.descricao || "").trim();
  equipamento.categoria = dados.categoria;
  registrarMovimentacao(db, `Equipamento editado — ${equipamento.nome}`);
  return { ok: true, equipamento };
}

/**
 * Exclui um equipamento, respeitando a regra de negócio da Etapa 01:
 * um equipamento emprestado ou em manutenção não pode ser removido.
 */
export function excluirEquipamento(db, id) {
  const equipamento = buscarEquipamento(db, id);
  if (!equipamento) return { ok: false, mensagem: "Equipamento não encontrado." };
  if (equipamento.situacao !== "disponivel") {
    return {
      ok: false,
      mensagem: `Não é possível excluir "${equipamento.nome}": o equipamento está ${
        equipamento.situacao === "emprestado" ? "emprestado" : "em manutenção"
      }.`
    };
  }
  if (db.emprestimos.some(item => item.equipamentoId === id) ||
      db.manutencoes.some(item => item.equipamentoId === id)) {
    return { ok: false, mensagem: "O equipamento possui histórico e deve ser preservado." };
  }
  db.equipamentos = db.equipamentos.filter((e) => e.id !== id);
  registrarMovimentacao(db, `Equipamento excluído — ${equipamento.nome}`);
  return { ok: true };
}

// ----------------------------------------------------------------
// Empréstimos
// ----------------------------------------------------------------

export function listarEmprestimos(db) {
  return [...db.emprestimos].sort((a, b) => b.dataEmprestimo.localeCompare(a.dataEmprestimo));
}

export function listarEmprestimosAbertos(db) {
  return db.emprestimos.filter((e) => e.situacao === "aberto");
}

export function registrarEmprestimo(db, dados) {
  const erros = {};
  const equipamentoId = Number(dados.equipamentoId);
  const equipamento = buscarEquipamento(db, equipamentoId);

  if (!dados.equipamentoId) erros.equipamento = "Selecione um equipamento.";
  else if (!equipamento) erros.equipamento = "Equipamento inválido.";
  else if (equipamento.situacao !== "disponivel")
    erros.equipamento = "Este equipamento não está disponível para empréstimo.";

  const responsavel = (dados.responsavel || "").trim();
  if (!responsavel) erros.responsavel = "Informe o responsável.";

  if (!dataISOValida(dados.dataEmprestimo)) erros.dataEmprestimo = "Informe uma data de empréstimo válida.";
  if (!dataISOValida(dados.previsaoDevolucao)) {
    erros.previsaoDevolucao = "Informe uma previsão de devolução válida.";
  } else if (dataISOValida(dados.dataEmprestimo) && dados.previsaoDevolucao < dados.dataEmprestimo) {
    erros.previsaoDevolucao = "A previsão de devolução não pode ser anterior à data do empréstimo.";
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  const emprestimo = {
    id: db.nextIds.emprestimo++,
    equipamentoId,
    responsavel,
    dataEmprestimo: dados.dataEmprestimo,
    previsaoDevolucao: dados.previsaoDevolucao,
    dataDevolucao: null,
    observacoes: (dados.observacoes || "").trim(),
    situacao: "aberto"
  };
  db.emprestimos.push(emprestimo);
  equipamento.situacao = "emprestado";
  registrarMovimentacao(db, `Empréstimo registrado — ${equipamento.nome} — ${responsavel}`);
  return { ok: true, emprestimo };
}

export function registrarDevolucao(db, dados) {
  const erros = {};
  const emprestimoId = Number(dados.emprestimoId);
  const emprestimo = db.emprestimos.find((e) => e.id === emprestimoId);

  if (!dados.emprestimoId) erros.emprestimo = "Selecione um empréstimo em aberto.";
  else if (!emprestimo || emprestimo.situacao !== "aberto")
    erros.emprestimo = "Empréstimo inválido ou já devolvido.";

  if (!dataISOValida(dados.dataDevolucao)) {
    erros.dataDevolucao = "Informe uma data de devolução válida.";
  } else if (emprestimo && dados.dataDevolucao < emprestimo.dataEmprestimo) {
    erros.dataDevolucao = "A data da devolução não pode ser anterior à data do empréstimo.";
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  emprestimo.situacao = "devolvido";
  emprestimo.dataDevolucao = dados.dataDevolucao;
  const equipamento = buscarEquipamento(db, emprestimo.equipamentoId);
  if (equipamento) equipamento.situacao = "disponivel";
  registrarMovimentacao(
    db,
    `Devolução registrada — ${equipamento ? equipamento.nome : "equipamento"}`
  );
  return { ok: true, emprestimo };
}

// ----------------------------------------------------------------
// Manutenções
// ----------------------------------------------------------------

export function listarManutencoes(db) {
  return [...db.manutencoes].sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
}

export function listarManutencoesAbertas(db) {
  return db.manutencoes.filter((m) => m.situacao === "em-andamento");
}

export function registrarManutencao(db, dados) {
  const erros = {};
  const equipamentoId = Number(dados.equipamentoId);
  const equipamento = buscarEquipamento(db, equipamentoId);

  if (!dados.equipamentoId) erros.equipamento = "Selecione um equipamento.";
  else if (!equipamento) erros.equipamento = "Equipamento inválido.";
  else if (equipamento.situacao === "manutencao")
    erros.equipamento = "Este equipamento já está em manutenção.";
  else if (equipamento.situacao === "emprestado")
    erros.equipamento = "Este equipamento está emprestado; registre a devolução antes de enviá-lo para manutenção.";

  const descricao = (dados.descricao || "").trim();
  if (!descricao) erros.descricao = "Descreva o problema ou serviço.";
  if (!dataISOValida(dados.dataInicio)) erros.dataInicio = "Informe uma data de início válida.";

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  const situacaoInicial = dados.situacao === "concluida" ? "concluida" : "em-andamento";
  const manutencao = {
    id: db.nextIds.manutencao++,
    equipamentoId,
    descricao,
    dataInicio: dados.dataInicio,
    dataConclusao: situacaoInicial === "concluida" ? dados.dataInicio : null,
    situacao: situacaoInicial,
    observacoes: (dados.observacoes || "").trim()
  };
  db.manutencoes.push(manutencao);
  equipamento.situacao = situacaoInicial === "concluida" ? "disponivel" : "manutencao";
  registrarMovimentacao(
    db,
    situacaoInicial === "concluida"
      ? `Manutenção registrada já concluída — ${equipamento.nome}`
      : `Manutenção iniciada — ${equipamento.nome}`
  );
  return { ok: true, manutencao };
}

export function concluirManutencao(db, dados) {
  const erros = {};
  const manutencaoId = Number(dados.manutencaoId);
  const manutencao = db.manutencoes.find((m) => m.id === manutencaoId);

  if (!dados.manutencaoId) erros.manutencao = "Selecione uma manutenção em andamento.";
  else if (!manutencao || manutencao.situacao !== "em-andamento")
    erros.manutencao = "Manutenção inválida ou já concluída.";

  if (!dataISOValida(dados.dataConclusao)) {
    erros.dataConclusao = "Informe uma data de conclusão válida.";
  } else if (manutencao && dados.dataConclusao < manutencao.dataInicio) {
    erros.dataConclusao = "A data de conclusão não pode ser anterior à data de início.";
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  manutencao.situacao = "concluida";
  manutencao.dataConclusao = dados.dataConclusao;
  const equipamento = buscarEquipamento(db, manutencao.equipamentoId);
  if (equipamento) equipamento.situacao = "disponivel";
  registrarMovimentacao(
    db,
    `Manutenção concluída — ${equipamento ? equipamento.nome : "equipamento"}`
  );
  return { ok: true, manutencao };
}

// ----------------------------------------------------------------
// Estatísticas e utilidades
// ----------------------------------------------------------------

export function getStats(db) {
  return db.equipamentos.reduce(
    (acc, equip) => {
      acc.total += 1;
      if (equip.situacao === "disponivel") acc.disponiveis += 1;
      if (equip.situacao === "emprestado") acc.emprestados += 1;
      if (equip.situacao === "manutencao") acc.emManutencao += 1;
      return acc;
    },
    { total: 0, disponiveis: 0, emprestados: 0, emManutencao: 0 }
  );
}

export function getMovimentacoesRecentes(db, limite = 5) {
  return [...db.movimentacoes]
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, limite);
}

