# Etapa 06 — API REST

Execute `node server/index.js` na raiz com Node.js 24+. As páginas e a API ficam em http://127.0.0.1:3000. O diretório server contém o servidor HTTP (index.js), as rotas (api.js), as regras (dominio.js) e o repositório de dados (repositorio.js).

## Recursos

Todos os caminhos abaixo começam com /api. Envie objetos JSON com Content-Type application/json. As consultas e alterações bem-sucedidas retornam 200, os cadastros 201 e a exclusão 204 sem corpo.

| Método | Caminho | Operação e campos |
|---|---|---|
| GET | /equipamentos | Lista. Filtros opcionais categoria e situacao na query. |
| GET | /equipamentos/{id} | Busca individual. |
| POST | /equipamentos | Cadastra nome, identificacao e categoria. descricao é opcional. A situação inicial padrão é disponivel. |
| PUT | /equipamentos/{id} | Atualiza nome, identificacao, categoria e descricao. O servidor controla a situação pelos movimentos. |
| DELETE | /equipamentos/{id} | Exclui equipamento disponível sem histórico de empréstimos ou manutenções. |
| GET | /emprestimos | Histórico. Use ?situacao=aberto para os pendentes. |
| POST | /emprestimos | equipamentoId, responsavel, dataEmprestimo, previsaoDevolucao e observacoes opcional. |
| PATCH | /emprestimos/{id}/devolucao | Registra dataDevolucao. |
| GET | /manutencoes | Histórico. Use ?situacao=em-andamento para as abertas. |
| POST | /manutencoes | equipamentoId, descricao, dataInicio, situacao opcional (em-andamento ou concluida) e observacoes opcional. |
| PATCH | /manutencoes/{id}/conclusao | Registra dataConclusao. |
| GET | /dashboard | Totais, equipamentos, empréstimos pendentes, data de referência e movimentos recentes. |

Categorias aceitas: ferramenta-manual, ferramenta-eletrica, equipamento-medicao e equipamento-seguranca. Datas usam AAAA-MM-DD. Para cadastrar equipamento já emprestado, envie situacao igual a emprestado e um objeto emprestimo com responsavel, dataEmprestimo e previsaoDevolucao. Para cadastrar em manutenção, envie situacao igual a manutencao e um objeto manutencao com descricao e dataInicio.

## Exemplo de cadastro

POST /api/equipamentos

```json
{"nome":"Alicate","identificacao":"AL-101","categoria":"ferramenta-manual"}
```

Exemplo de resposta 201. O ID e a data são atribuídos pelo servidor.

```json
{"id":9,"nome":"Alicate","identificacao":"AL-101","descricao":"","categoria":"ferramenta-manual","situacao":"disponivel","dataCadastro":"2026-11-26"}
```

GET /api/equipamentos/9 retorna o objeto. Para editar, envie PUT ao mesmo endereço com os dados completos do cadastro. DELETE no mesmo endereço retorna 204. Uma nova consulta após a exclusão retorna 404.

## Erros

Exemplo de consulta a um equipamento inexistente (404):

```json
{"ok":false,"mensagem":"Equipamento não encontrado.","erros":{"geral":"Equipamento não encontrado."}}
```

O cliente também recebe 400 para JSON inválido, 405 para método indisponível, 415 para mídia incompatível, 422 para dados inválidos e 409 para conflitos como patrimônio duplicado ou exclusão bloqueada. Erros internos retornam 500.

## Reproduzir no Postman

Importe [a coleção Ferrum](Ferrum.postman_collection.json). Com o servidor iniciado, execute as requisições da coleção em ordem. O cadastro armazena o ID recebido na variável equipamentoId para consulta, edição e exclusão. A última consulta deve retornar 404. Para os fluxos de empréstimo e manutenção, use também as páginas da aplicação.
