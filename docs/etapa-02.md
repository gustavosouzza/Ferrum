# Etapa 02 — Protótipo estrutural com HTML semântico

## Objetivo da etapa

Transformar a proposta definida na Etapa 01 em uma primeira interface Web,
utilizando HTML semântico, sem ainda implementar lógica de aplicação,
banco de dados, API ou autenticação.

## Páginas criadas

Foram criadas 4 páginas representativas do sistema (acima do mínimo de 3
exigido), todas em `client/`:

1. **`index.html` — Dashboard**: tela inicial, com resumo dos
   equipamentos (total, disponíveis, emprestados, em manutenção),
   empréstimos pendentes e movimentações recentes.
2. **`equipamentos.html` — Equipamentos**: cadastro de equipamento,
   filtro por categoria/situação e listagem com ações de editar/excluir.
3. **`emprestimos.html` — Empréstimos**: registro de empréstimo,
   registro de devolução e histórico de empréstimos.
4. **`manutencoes.html` — Manutenções**: registro de manutenção,
   conclusão de manutenção e histórico de manutenções.

Todas compartilham o mesmo cabeçalho e menu de navegação, mantendo
consistência entre as telas.

## Funcionalidades implementadas (nível de interface)

Nesta etapa as funcionalidades foram implementadas apenas como
**estrutura visual/HTML**, sem lógica funcional (conforme escopo da
etapa). Estão representadas:

- navegação entre as 4 páginas do sistema;
- formulário de cadastro de equipamento, com campos nome,
  identificação, descrição, categoria e situação;
- formulário de filtro de equipamentos por categoria e situação;
- listagem de equipamentos cadastrados, com ações de editar e excluir;
- formulário de registro de empréstimo (equipamento, responsável, data
  do empréstimo, previsão de devolução, observações) e listagem do
  histórico de empréstimos;
- formulário de registro de manutenção (equipamento, descrição do
  problema, data de início, situação, observações) e listagem do
  histórico de manutenções;
- resumo geral do sistema (dashboard) com indicadores numéricos e
  movimentações recentes.

## Decisões relacionadas à estrutura HTML

- **`header` + `nav`**: cada página possui um cabeçalho com o nome do
  sistema e uma navegação (`nav` com `aria-label="Navegação principal"`)
  contendo uma lista (`ul`/`li`) de links para as 4 páginas. O link da
  página atual recebe `aria-current="page"` para indicar a localização
  ao usuário.
- **`main` + `section`**: o conteúdo principal de cada página fica
  dentro de `main`, dividido em `section`s com `aria-labelledby`
  apontando para o `h3` correspondente, agrupando funcionalidades
  relacionadas (ex.: cadastro, filtro e listagem em páginas separadas
  dentro da mesma tela).
- **`form` + `fieldset` + `legend`**: todos os formulários usam
  `fieldset`/`legend` para agrupar semanticamente os campos
  relacionados (ex.: "Dados do equipamento", "Dados do empréstimo").
- **`label for` associado ao `id`**: todos os campos de formulário
  possuem `label` explicitamente associado via `for`/`id`, atendendo ao
  critério de acessibilidade da etapa.
- **`table` para listagens**: as listagens (equipamentos, empréstimos
  pendentes, histórico) usam `table` com `caption`, `thead`/`th
  scope="col"` e `tbody`, por se tratar de dados tabulares.
- **`footer`**: cada página é finalizada com um rodapé simples contendo
  o nome do sistema e o ano.
- Foi mantida a mesma estrutura de cabeçalho/navegação/rodapé em todas
  as páginas, facilitando a evolução futura (CSS e JavaScript) sem
  necessidade de duplicar lógica de layout.

## O que não foi feito nesta etapa (fora do escopo)

Conforme o escopo definido, não foram implementados: CSS de estilização
(ainda sem folha de estilos própria), JavaScript, requisições a
banco de dados ou API, autenticação e persistência de dados. As
listagens e valores exibidos são estáticos, apenas para representar a
estrutura das telas.
