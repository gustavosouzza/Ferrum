# Ferrum

Aplicação web de controle de equipamentos compartilhados. O painel acompanha disponibilidade, empréstimos, devoluções e manutenções. As quatro páginas utilizam a mesma API.

## Executar

Instale Node.js 24 ou superior. Na pasta que contém package.json, execute:

```sh
node server/index.js
```

Abra http://127.0.0.1:3000 no navegador. Use Ctrl+C no terminal para encerrar. O servidor entrega a interface e a API no mesmo endereço. Todos os módulos usados já acompanham o Node.

## Entregas da disciplina

- [Proposta, domínio e operações](docs/proposta.md)
- [Etapa 02 — HTML semântico](docs/etapa-02.md)
- [Etapa 03 — CSS responsivo](docs/etapa-03.md)
- [Etapa 04 — JavaScript](docs/etapa-04.md)
- [Etapa 05 — comunicação simulada](docs/etapa-05.md)
- [Etapa 06 — API REST, exemplos e coleção Postman](docs/etapa-06.md)

A partir da Etapa 06, os serviços do navegador usam fetch para consultar a API Node.js. As regras de empréstimo, devolução, manutenção e exclusão são validadas no servidor. A versão da Etapa 06 inicia com dados de demonstração em memória. As alterações dessa versão duram até o encerramento do processo.

## Etapa 07 — Banco de dados

Esta versão usa SQLite. A primeira execução cria data/ferrum.sqlite com o modelo e os dados iniciais. As alterações são preservadas após reiniciar o servidor. Veja [modelo, relacionamentos, CRUD e teste de persistência](docs/etapa-07.md).
