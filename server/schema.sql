CREATE TABLE IF NOT EXISTS equipamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL, identificacao TEXT NOT NULL COLLATE NOCASE UNIQUE,
  descricao TEXT NOT NULL, categoria TEXT NOT NULL, dataCadastro TEXT NOT NULL,
  situacao TEXT NOT NULL CHECK(situacao IN ('disponivel','emprestado','manutencao'))
);
CREATE TABLE IF NOT EXISTS emprestimos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipamentoId INTEGER NOT NULL REFERENCES equipamentos(id) ON DELETE RESTRICT,
  responsavel TEXT NOT NULL, dataEmprestimo TEXT NOT NULL,
  previsaoDevolucao TEXT NOT NULL CHECK(previsaoDevolucao >= dataEmprestimo),
  dataDevolucao TEXT CHECK(dataDevolucao >= dataEmprestimo),
  observacoes TEXT NOT NULL, situacao TEXT NOT NULL CHECK(situacao IN ('aberto','devolvido'))
);
CREATE UNIQUE INDEX IF NOT EXISTS emprestimo_aberto ON emprestimos(equipamentoId) WHERE situacao='aberto';
CREATE TABLE IF NOT EXISTS manutencoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipamentoId INTEGER NOT NULL REFERENCES equipamentos(id) ON DELETE RESTRICT,
  descricao TEXT NOT NULL, dataInicio TEXT NOT NULL,
  dataConclusao TEXT CHECK(dataConclusao >= dataInicio),
  observacoes TEXT NOT NULL, situacao TEXT NOT NULL CHECK(situacao IN ('em-andamento','concluida'))
);
CREATE UNIQUE INDEX IF NOT EXISTS manutencao_aberta ON manutencoes(equipamentoId) WHERE situacao='em-andamento';
CREATE TABLE IF NOT EXISTS movimentacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, texto TEXT NOT NULL
);
s