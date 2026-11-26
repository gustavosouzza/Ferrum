# Etapa 07 — Persistência e CRUD

## Escolha e criação

SQLite atende à demonstração local da disciplina e permite verificar relacionamentos, unicidade e transações sem configurar outro serviço. O Node.js 24 fornece o driver node:sqlite. Ao executar `node server/index.js`, o repositório aplica [schema.sql](../server/schema.sql) e insere dados de exemplo somente na inicialização de um banco novo. O arquivo padrão é data/ferrum.sqlite. FERRUM_DB permite escolher outro caminho. Os dados de demonstração vêm do projeto. Cadastros particulares feitos no localStorage da Etapa 05 continuam no navegador antigo e não são importados automaticamente.

## Modelo relacional

| Tabela | Chave | Conteúdo e vínculos |
|---|---|---|
| equipamentos | id | Identificação única, nome, descrição, categoria, situação e data do cadastro. |
| emprestimos | id | equipamentoId referencia equipamentos.id. Inclui responsável, retirada, previsão, devolução, observações e situação. |
| manutencoes | id | equipamentoId referencia equipamentos.id. Inclui descrição, início, conclusão, observações e situação. |
| movimentacoes | id | Data/hora e descrição de cada evento exibido no painel. O texto preserva o registro de exclusões. |

Um equipamento possui zero ou vários empréstimos e manutenções ao longo do tempo. A API permite apenas um uso ativo por equipamento e verifica sua disponibilidade antes de alterar a situação. As chaves estrangeiras preservam o histórico. Índices únicos parciais bloqueiam dois empréstimos abertos ou duas manutenções abertas para o mesmo equipamento.

## Organização e falhas

A camada HTTP chama o domínio por meio de repositorio.js. As regras de negócio desconhecem SQL. O repositório lê o estado na transação e grava somente as linhas alteradas. O bloqueio de escrita é obtido antes da leitura. O registro do movimento e a alteração do equipamento são confirmados juntos. Em caso de falha, a transação é revertida. O servidor registra o erro e responde em JSON. Esta implementação lê as tabelas em memória por operação, uma escolha adequada ao volume de uma demonstração local.

## Demonstrar CRUD e persistência

1. Inicie o servidor e importe a [coleção Postman](Ferrum.postman_collection.json).
2. Execute Listar e Cadastrar. Anote o ID devolvido com status 201.
3. Execute Consultar e Editar. O novo nome será “Alicate revisado”.
4. Encerre o servidor com Ctrl+C e inicie novamente no mesmo projeto.
5. Execute Consultar com o mesmo ID. Confira o nome editado e a identificação.
6. Execute Excluir (204) e Conferir exclusão (404). Reinicie novamente e repita a última consulta para verificar que a exclusão persistiu.

Os corpos das requisições, os filtros e os códigos de resposta estão documentados na [Etapa 06](etapa-06.md).
