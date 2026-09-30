# Etapa 04 — Interatividade com JavaScript

## Objetivo da etapa

Adicionar comportamento dinâmico à interface do Ferrum utilizando JavaScript, sem
ainda depender de um back-end (previsto para as Etapas 06/07). As telas HTML e o
CSS responsivo das Etapas 02 e 03 foram mantidos; o que muda nesta etapa é que os
formulários passam a validar dados de verdade, a tabela e o dashboard deixam de
ter conteúdo fixo e passam a refletir o estado real da aplicação, e as regras de
negócio definidas na Etapa 01 (situação do equipamento, vínculo entre empréstimo
e devolução, etc.) passam a ser aplicadas em tempo real no navegador.

## Decisão de arquitetura: persistência em localStorage

Como o projeto ainda não tem banco de dados nem API, os dados (equipamentos,
empréstimos, manutenções e o log de movimentações) são mantidos em um "banco"
simulado em memória e persistido no `localStorage` do navegador
(`client/js/store.js`). Essa decisão foi tomada porque:

- a aplicação é multi-página (4 arquivos `.html` separados, sem um framework de
  SPA/roteamento), então o estado precisa ser compartilhado entre páginas sem um
  servidor — o `localStorage` resolve isso;
- sem persistência alguma, qualquer cadastro, empréstimo ou navegação entre
  páginas perderia os dados, o que tornaria impossível demonstrar fluxos reais
  (cadastrar um equipamento e depois emprestá-lo, por exemplo);
- a camada de dados fica isolada em um único módulo (`FerrumStore`), o que
  facilita substituí-la por chamadas a uma API REST nas Etapas 06/07 sem reescrever
  as telas.

Na primeira execução, o `localStorage` é preenchido com uma massa de dados
inicial (8 equipamentos, 3 empréstimos e 2 manutenções) coerente com os exemplos
já usados nas Etapas 02 e 03.

## Páginas e arquivos envolvidos

| Página | HTML | JavaScript específico |
|---|---|---|
| Dashboard | `client/index.html` | `client/js/dashboard.js` |
| Equipamentos | `client/equipamentos.html` | `client/js/equipamentos.js` |
| Empréstimos | `client/emprestimos.html` | `client/js/emprestimos.js` |
| Manutenções | `client/manutencoes.html` | `client/js/manutencoes.js` |

Compartilhados por todas as páginas:

- `client/js/store.js` — "banco de dados" em `localStorage`, regras de negócio e funções utilitárias (`FerrumStore`);
- `client/js/ui.js` — funções de apoio para exibir erros de validação e alertas de sucesso/erro (`FerrumUI`);
- `client/css/style.css` — recebeu uma seção nova (§15) com os estilos de validação, alertas, etiquetas de situação e botões de ação.

## Funcionalidades interativas desenvolvidas

### 1. Cadastro, edição, exclusão e filtro dinâmico de equipamentos

**Onde:** `equipamentos.html` + `client/js/equipamentos.js`.

O formulário de cadastro valida em JavaScript: nome e identificação obrigatórios,
categoria obrigatória e identificação única (comparando com os equipamentos já
cadastrados, sem diferenciar maiúsculas/minúsculas). Ao salvar, o novo
equipamento é inserido no array em memória e a tabela é reconstruída sem recarregar
a página. O mesmo formulário é reaproveitado para edição: o botão "Editar" de
cada linha preenche os campos com os dados do equipamento selecionado e troca o
título da seção e o texto do botão para indicar o modo de edição.

O formulário de filtro (categoria/situação) não depende de clicar em "Filtrar":
o evento `change` dos dois `<select>` já reaplica o filtro imediatamente sobre o
array de equipamentos, usando `Array.prototype.filter`. Quando nenhum equipamento
atende ao filtro, a tabela é escondida e uma mensagem "Nenhum equipamento
encontrado" é exibida no lugar.

A exclusão pede confirmação inline (sem usar `confirm()` do navegador): o botão
"Excluir" substitui a célula de ações por "Confirmar exclusão? / Cancelar". Além
disso, a regra de negócio da Etapa 01 é aplicada no JavaScript: um equipamento
emprestado ou em manutenção não pode ser excluído — o botão "Excluir" já aparece
desabilitado para esses casos, com uma dica (`title`) explicando o motivo.

Durante a edição, o campo "Situação" fica desabilitado (com uma explicação
abaixo dele): a situação de um equipamento é um estado derivado, alterado
apenas pelas ações de empréstimo, devolução e manutenção, então não faz
sentido deixá-lo editável diretamente no formulário de cadastro — isso evita
que o usuário mude o valor ali e a alteração seja silenciosamente ignorada
pela regra de negócio.

### 2. Registro de empréstimo e devolução, com regras de disponibilidade

**Onde:** `emprestimos.html` + `client/js/emprestimos.js`.

O `<select>` de equipamentos do formulário de empréstimo é montado
dinamicamente a partir da lista de equipamentos com situação `disponivel` — um
equipamento já emprestado ou em manutenção nunca aparece como opção. Ao
registrar o empréstimo, o JavaScript valida responsável, datas obrigatórias e
que a previsão de devolução não seja anterior à data do empréstimo; se passar,
o equipamento tem sua situação alterada para `emprestado`, o histórico é
atualizado e uma movimentação é registrada (refletindo no dashboard).

O formulário de devolução funciona de forma simétrica: o `<select>` só lista
empréstimos com situação `aberto`, a data de devolução não pode ser anterior à
data do empréstimo, e ao confirmar a devolução o equipamento volta para
`disponivel` automaticamente.

### 3. Registro e conclusão de manutenção

**Onde:** `manutencoes.html` + `client/js/manutencoes.js`.

Segue o mesmo padrão: o `<select>` de equipamentos só oferece equipamentos
`disponivel` (um equipamento emprestado precisa ser devolvido antes de ir para
manutenção, e um que já está em manutenção não pode ser enviado de novo). Ao
registrar, o equipamento passa para `manutencao`; ao concluir (formulário
separado, que só lista manutenções `em-andamento`), o equipamento volta para
`disponivel` e a data de conclusão é validada para não ser anterior à data de
início.

### 4. Dashboard calculado em tempo real

**Onde:** `index.html` + `client/js/dashboard.js`.

Os quatro indicadores (total, disponíveis, emprestados, em manutenção) não são
mais números fixos no HTML: são calculados a cada carregamento da página com
`Array.prototype.reduce` sobre a lista de equipamentos salva. A tabela de
"Empréstimos pendentes" é montada com `filter` + `sort` sobre os empréstimos em
aberto, e empréstimos com previsão de devolução já vencida recebem
automaticamente uma etiqueta "Atrasado" (comparando a data prevista com a data
atual). A lista de "Movimentações recentes" é construída a partir de um log de
eventos (cadastro, empréstimo, devolução, manutenção) ordenado por data/hora
mais recente com `sort`, mostrando as 6 últimas.

## Requisitos técnicos da Etapa 04 — onde aparecem no código

- **Manipulação do DOM:** `document.createElement`, `innerHTML`, `appendChild`, `textContent` em todos os arquivos `*.js` de página, para construir linhas de tabela, opções de `<select>` e mensagens.
- **Tratamento de eventos:** `addEventListener("submit"/"click"/"change", ...)` em todos os formulários e botões de ação (editar, excluir, confirmar, cancelar).
- **Validação de formulários:** funções `adicionarEquipamento`, `editarEquipamento`, `registrarEmprestimo`, `registrarDevolucao`, `registrarManutencao`, `concluirManutencao` em `store.js`, todas retornando `{ ok, erros }`.
- **Alteração dinâmica da interface:** filtro de equipamentos sem reload, troca de modo cadastro/edição, confirmação inline de exclusão, tabelas e indicadores recalculados após cada ação, etiqueta de atraso.
- **Uso de funções:** toda a lógica de `store.js` e `ui.js` é organizada em funções puras ou quase puras, reaproveitadas pelas 4 páginas.
- **Uso de arrays:** `db.equipamentos`, `db.emprestimos`, `db.manutencoes`, `db.movimentacoes` são arrays de objetos, manipulados com `push`, `filter`, `find`, `some`.
- **Métodos de iteração:** `filter` (listagens e filtros), `map` não foi necessário separadamente pois `forEach`/`filter` cobriram os casos, `reduce` (estatísticas do dashboard), `sort` (histórico e movimentações recentes), `some`/`find` (checagem de duplicidade e busca por id).
- **Tratamento de situações inválidas:** ver seção seguinte.

## Validações implementadas

| Formulário | Validação |
|---|---|
| Cadastro/edição de equipamento | Nome obrigatório; identificação obrigatória e única (case-insensitive); categoria obrigatória |
| Registro de empréstimo | Equipamento deve estar selecionado e `disponivel`; responsável obrigatório; datas obrigatórias; previsão de devolução ≥ data do empréstimo |
| Registro de devolução | Empréstimo deve estar selecionado e `aberto`; data de devolução obrigatória e ≥ data do empréstimo |
| Registro de manutenção | Equipamento deve estar selecionado e `disponivel` (não pode estar emprestado nem já em manutenção); descrição obrigatória; data de início obrigatória |
| Conclusão de manutenção | Manutenção deve estar selecionada e `em-andamento`; data de conclusão obrigatória e ≥ data de início |

## Situações inválidas tratadas

- Envio de formulário com campos obrigatórios vazios (mensagem específica por campo, foco automático no primeiro campo com erro).
- Cadastro de equipamento com identificação (patrimônio) já usada por outro equipamento.
- Tentativa de excluir um equipamento que está emprestado ou em manutenção (botão desabilitado e mensagem explicativa caso a exclusão seja forçada).
- Tentativa de registrar empréstimo para equipamento que não está disponível (não aparece na lista, e a validação no `store.js` recusa mesmo assim).
- Datas fora de ordem (previsão de devolução antes do empréstimo; devolução antes do empréstimo; conclusão antes do início da manutenção).
- Listas vazias: quando não há equipamento disponível, empréstimo em aberto ou manutenção em andamento, o formulário correspondente é desabilitado e uma mensagem é exibida em vez de deixar o usuário tentar enviar um `<select>` vazio.
- Falha ao acessar o `localStorage` (modo privado antigo, cota excedida): a aplicação cai para os dados padrão em memória em vez de quebrar, com aviso no console.

## Matriz de evidências

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
|---|---|---|---|
| Manipulação do DOM | Renderização dinâmica da tabela de equipamentos e do dashboard | `client/js/equipamentos.js`, `client/js/dashboard.js` | `docs/evidencias/etapa-04/equipamentos-02-cadastro-sucesso.png` (linha nova inserida na tabela) e `dashboard-01-estado-inicial.png` (indicadores preenchidos via DOM) |
| Tratamento de eventos | Envio de formulários e cliques em Editar/Excluir/Confirmar | `client/js/equipamentos.js` (listeners `submit` e `click` em `[data-acao]`) | `docs/evidencias/etapa-04/equipamentos-07-confirmar-exclusao.png` |
| Validação de formulários | Cadastro de equipamento com campos vazios | `client/js/store.js` (`adicionarEquipamento`), `client/js/ui.js` (`exibirErros`) | `docs/evidencias/etapa-04/equipamentos-01-validacao-cadastro-invalido.png` |
| Alteração dinâmica da interface | Filtro de equipamentos por categoria/situação sem reload | `client/js/equipamentos.js` (evento `change` do formulário de filtro) | `docs/evidencias/etapa-04/equipamentos-04-filtro-dinamico.png` e `equipamentos-05-filtro-sem-resultado.png` |
| Uso de funções | Organização de `store.js` e `ui.js` em funções reaproveitadas pelas 4 páginas | `client/js/store.js`, `client/js/ui.js` | Código-fonte dos arquivos citados |
| Uso de arrays | Estruturas `db.equipamentos`, `db.emprestimos`, `db.manutencoes`, `db.movimentacoes` | `client/js/store.js` (`seedData`) | Código-fonte de `store.js`, seção `seedData()` |
| Métodos de iteração | `reduce` no cálculo de estatísticas; `filter`/`sort` no histórico e nas pendências | `client/js/store.js` (`getStats`, `listarEquipamentos`, `getMovimentacoesRecentes`) | `docs/evidencias/etapa-04/dashboard-02-estado-apos-operacoes.png` (números recalculados após as ações do teste) |
| Tratamento de situações inválidas | Identificação duplicada; equipamento emprestado bloqueado para exclusão; datas fora de ordem | `client/js/store.js` | `docs/evidencias/etapa-04/equipamentos-03-identificacao-duplicada.png`, `equipamentos-06-exclusao-bloqueada.png`, `emprestimos-02-validacao-datas.png` |

## Evidências do funcionamento

Todas as capturas abaixo estão em `docs/evidencias/etapa-04/` e foram geradas
automaticamente com Playwright/Chromium, navegando pela aplicação real (não são
mockups): cada ação (clique, preenchimento de campo, envio de formulário) foi
executada de fato no navegador antes da captura.

| Arquivo | O que mostra |
|---|---|
| `dashboard-01-estado-inicial.png` | Dashboard com os indicadores calculados a partir dos dados iniciais e duas pendências marcadas como "Atrasado" |
| `equipamentos-01-validacao-cadastro-invalido.png` | Envio do formulário de cadastro em branco — três mensagens de erro exibidas |
| `equipamentos-02-cadastro-sucesso.png` | Equipamento novo cadastrado com sucesso, aparecendo na tabela e com alerta de confirmação |
| `equipamentos-03-identificacao-duplicada.png` | Tentativa de cadastrar identificação já existente — erro específico no campo |
| `equipamentos-04-filtro-dinamico.png` | Filtro por situação "Disponível" aplicado sem recarregar a página |
| `equipamentos-05-filtro-sem-resultado.png` | Filtro sem resultados — mensagem "Nenhum equipamento encontrado" |
| `equipamentos-06-exclusao-bloqueada.png` | Botão "Excluir" desabilitado para equipamento emprestado |
| `equipamentos-07-confirmar-exclusao.png` | Confirmação inline de exclusão para equipamento disponível |
| `emprestimos-01-registro-sucesso.png` | Empréstimo registrado com sucesso |
| `emprestimos-02-validacao-datas.png` | Erro de validação: previsão de devolução anterior à data do empréstimo |
| `emprestimos-03-devolucao-sucesso.png` | Devolução registrada com sucesso |
| `emprestimos-04-historico-atualizado.png` | Histórico de empréstimos já refletindo a devolução |
| `manutencoes-01-validacao-cadastro.png` | Erro de validação: descrição do problema não informada |
| `manutencoes-02-registro-sucesso.png` | Manutenção registrada com sucesso |
| `manutencoes-03-conclusao-sucesso.png` | Manutenção concluída com sucesso, histórico atualizado |
| `dashboard-02-estado-apos-operacoes.png` | Dashboard após todas as operações do roteiro de teste, com os indicadores recalculados corretamente |

## Instruções para testar as funcionalidades

1. Suba um servidor estático na pasta `client/` (necessário porque o `fetch`/
   `localStorage` de alguns navegadores se comporta melhor servido por HTTP do
   que abrindo o arquivo diretamente):
   ```bash
   cd client
   python3 -m http.server 8000
   ```
2. Acesse `http://localhost:8000/index.html`.
3. **Cadastro/edição/exclusão de equipamento:** vá em "Equipamentos", tente
   enviar o formulário de cadastro em branco (deve mostrar erros), depois
   preencha nome, identificação e categoria e cadastre. Clique em "Editar" numa
   linha da tabela para alterar os dados, ou em "Excluir" para ver a
   confirmação inline (equipamentos emprestados ou em manutenção têm o botão
   desabilitado).
4. **Filtro:** na mesma página, mude os campos "Categoria" ou "Situação" do
   formulário de filtro — a tabela é atualizada imediatamente.
5. **Empréstimo/devolução:** vá em "Empréstimos", registre um empréstimo para
   um equipamento disponível (repare que equipamentos emprestados/em manutenção
   não aparecem na lista) e depois registre a devolução dele na segunda seção
   da mesma página.
6. **Manutenção:** vá em "Manutenções" e repita o fluxo de registrar e concluir.
7. **Dashboard:** volte para "Dashboard" e confira que os indicadores e a lista
   de movimentações recentes refletem as ações realizadas nos passos
   anteriores.
8. **Persistência:** recarregue a página (F5) a qualquer momento — os dados
   continuam lá, pois ficam salvos no `localStorage` do navegador. Para
   reiniciar os dados para o estado inicial, abra o console do navegador e
   execute `localStorage.removeItem("ferrum-db-v1")`, depois recarregue.

## O que não foi feito nesta etapa (fora do escopo)

Conforme o escopo da Etapa 04, não foram implementados: comunicação com
back-end/API, banco de dados real, autenticação e módulos JavaScript separados
por arquivo (import/export) — o projeto ainda é servido como scripts clássicos
(`<script src="...">`), o que é suficiente para o tamanho atual da aplicação. A
modularização mais formal está prevista para a Etapa 05.
