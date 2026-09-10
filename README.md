# Ferrum

**Sistema de Gestão de Ferramentas e Equipamentos**

## Sobre o projeto

O **Ferrum** é uma aplicação Web destinada ao gerenciamento e controle de ferramentas e equipamentos utilizados por empresas, oficinas, laboratórios e equipes de trabalho.

A aplicação tem como objetivo centralizar informações sobre os equipamentos disponíveis, seus empréstimos, devoluções e manutenções, permitindo acompanhar a situação de cada item e seu histórico de utilização.

O sistema permitirá controlar quais ferramentas estão disponíveis, emprestadas ou em manutenção, além de registrar os responsáveis pelos empréstimos e as movimentações relacionadas aos equipamentos.

O projeto está sendo desenvolvido de forma incremental ao longo da disciplina **Tecnologia de Construção de Software I**.

## Status atual do projeto

| Etapa | Objetivo | Situação |
|---|---|---|
| 01 | Proposta e especificação | ✅ Concluída |
| 02 | Protótipo estrutural com HTML semântico | ✅ Concluída |
| 03 | Interface responsiva com CSS | ✅ Concluída |
| 04 | Interatividade com JavaScript | ⏳ Pendente |
| 05 | Modularização e comunicação assíncrona | ⏳ Pendente |
| 06 | API REST com Java e Spring Boot | ⏳ Pendente |
| 07 | Persistência e CRUD com banco de dados | ⏳ Pendente |
| 08 | Organização arquitetural | ⏳ Pendente |
| 09 | Evolução do front-end | ⏳ Pendente |
| 10 | Qualidade, versionamento e release candidate | ⏳ Pendente |

Até o momento, o projeto possui uma interface Web estática (HTML semântico + CSS responsivo), sem lógica de aplicação, backend, API ou persistência em banco de dados — o que é esperado para esta fase do desenvolvimento.

## Problema

Em ambientes que possuem diversas ferramentas e equipamentos compartilhados, pode ser difícil controlar onde cada item está, quem está utilizando determinado equipamento e quais ferramentas precisam passar por manutenção.

Quando esse controle é realizado manualmente, utilizando planilhas, anotações ou outros meios não centralizados, podem ocorrer problemas como:

- dificuldade para localizar equipamentos;
- perda do histórico de empréstimos;
- empréstimos duplicados;
- dificuldade para controlar devoluções;
- dificuldade para identificar equipamentos em manutenção;
- ausência de informações sobre quem está utilizando determinado equipamento.

O Ferrum pretende centralizar essas informações em uma única aplicação, facilitando o controle e o acompanhamento dos equipamentos.

## Objetivo

Permitir que usuários responsáveis pelo controle de ferramentas e equipamentos possam cadastrar, consultar e acompanhar os itens disponíveis, além de registrar empréstimos, devoluções e manutenções.

A aplicação também deverá disponibilizar informações que facilitem a identificação da situação atual dos equipamentos e seu histórico.

## Funcionalidades

### Implementadas (nível de interface, Etapas 02 e 03)

As telas abaixo já existem como estrutura HTML semântica, estilizada e responsiva, com dados estáticos de demonstração — ainda sem lógica funcional, backend ou persistência:

- navegação entre as 4 páginas do sistema;
- formulário de cadastro de equipamento (nome, identificação, descrição, categoria, situação);
- formulário de filtro de equipamentos por categoria e situação;
- listagem de equipamentos cadastrados, com ações de editar e excluir;
- formulário de registro de empréstimo e de devolução, com histórico de empréstimos;
- formulário de registro e conclusão de manutenção, com histórico de manutenções;
- dashboard com indicadores gerais (total de equipamentos, disponíveis, emprestados, em manutenção) e movimentações recentes.

### Planejadas (próximas etapas)

- Cadastro e consulta de categorias;
- Interatividade real via JavaScript (Etapa 04);
- Comunicação assíncrona com o servidor (Etapa 05);
- API REST em Java/Spring Boot (Etapa 06);
- Persistência em banco de dados relacional (Etapa 07).

## Regras de negócio

Inicialmente, serão consideradas as seguintes regras:

1. Um equipamento emprestado não poderá ser emprestado novamente enquanto não for devolvido.
2. Um equipamento em manutenção não poderá ser emprestado.
3. Um empréstimo deverá estar associado a um usuário responsável.
4. Uma devolução deverá estar relacionada a um empréstimo existente.
5. O histórico de empréstimos deverá ser mantido após a devolução do equipamento.
6. Um equipamento poderá possuir diversos registros de manutenção ao longo de sua utilização.
7. Um equipamento deverá possuir uma situação que permita identificar se está disponível, emprestado ou em manutenção.
8. Ao registrar uma devolução, a situação do equipamento deverá ser atualizada conforme as regras definidas pelo sistema.

## Domínio

Os principais conceitos do sistema são:

```text
Usuário
   │
   └── realiza
          │
          ▼
      Empréstimo
          │
          └── referencia
                 │
                 ▼
       Equipamento
          │
          ├── pertence a → Categoria
          │
          └── possui → Manutenções
```

### Entidades principais

- **Usuário** — pessoa que utiliza o sistema e pode ser responsável por um empréstimo.
- **Equipamento** — ferramenta ou equipamento controlado pelo sistema.
- **Categoria** — classificação utilizada para organizar os equipamentos.
- **Empréstimo** — registro da retirada de um equipamento por determinado usuário.
- **Devolução** — registro da devolução de um equipamento emprestado.
- **Manutenção** — registro das intervenções realizadas em um equipamento.

## Interfaces

| Página | Arquivo | Descrição |
|---|---|---|
| Dashboard | `client/index.html` | Visão geral: resumo dos equipamentos, empréstimos pendentes e movimentações recentes. |
| Equipamentos | `client/equipamentos.html` | Cadastro, filtro e listagem de equipamentos. |
| Empréstimos | `client/emprestimos.html` | Registro de empréstimo, registro de devolução e histórico. |
| Manutenções | `client/manutencoes.html` | Registro e conclusão de manutenção, e histórico. |

## Operações previstas

1. Cadastrar equipamento.
2. Consultar equipamentos.
3. Editar equipamento.
4. Excluir equipamento.
5. Cadastrar categoria.
6. Registrar empréstimo.
7. Consultar empréstimos.
8. Registrar devolução.
9. Consultar histórico de empréstimos.
10. Registrar manutenção.
11. Consultar histórico de manutenção.
12. Consultar a situação atual de um equipamento.

As operações de empréstimo, devolução e manutenção deverão refletir na situação atual do equipamento.

## Tecnologias

### Cliente

Utilizadas até o momento:

- HTML5 (estrutura semântica — Etapa 02);
- CSS3, com Flexbox, Grid e media queries (responsividade — Etapa 03).

Previstas para etapas futuras:

- JavaScript (interatividade, Etapa 04);
- possível framework de front-end, a avaliar.

### Servidor (planejado)

- Java;
- Spring Boot;
- Spring Data JPA;
- Hibernate;
- API REST;
- JSON;
- Maven.

### Persistência (planejada)

Será utilizado um banco de dados relacional. Inicialmente está prevista a utilização do **PostgreSQL**, podendo essa decisão ser alterada durante o desenvolvimento.

### Outras ferramentas

- Git;
- GitHub;
- Docker (planejado).

## Arquitetura

A visão inicial da aplicação, a ser implementada nas próximas etapas:

```text
┌───────────────────────┐
│       FRONT-END       │
│                       │
│   HTML / CSS / JS     │
└───────────┬───────────┘
            │
            │ HTTP / JSON
            ▼
┌───────────────────────┐
│        API REST       │
│                       │
│    Java / Spring      │
│         Boot          │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    REGRAS DE NEGÓCIO  │
│                       │
│ Empréstimos           │
│ Devoluções            │
│ Manutenções           │
│ Situação equipamentos │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     BANCO DE DADOS    │
│                       │
│ Usuários              │
│ Equipamentos          │
│ Categorias            │
│ Empréstimos           │
│ Manutenções           │
└───────────────────────┘
```

Atualmente apenas a camada de front-end (HTML + CSS) está implementada. A arquitetura será refinada conforme o projeto evoluir.

## Estrutura do projeto

```text
Ferrum/
│
├── README.md
├── .gitignore
│
├── client/
│   ├── index.html
│   ├── equipamentos.html
│   ├── emprestimos.html
│   ├── manutencoes.html
│   └── css/
│       └── style.css
│
├── docs/
│   ├── proposta.md
│   ├── etapa-02.md
│   ├── etapa-03.md
│   └── evidencias/
│       └── etapa-03/
│           ├── desktop-tela-01.png
│           ├── desktop-tela-02.png
│           ├── desktop-tela-03.png
│           ├── tablet-tela-01.png
│           ├── tablet-tela-02.png
│           ├── tablet-tela-03.png
│           ├── smartphone-tela-01.png
│           ├── smartphone-tela-02.png
│           └── smartphone-tela-03.png
│
└── server/          (a ser criado nas próximas etapas)
```

## Escopo inicial

### Incluído

- cadastro de equipamentos;
- cadastro de categorias;
- consulta de equipamentos;
- edição de equipamentos;
- exclusão de equipamentos;
- registro de empréstimos;
- registro de devoluções;
- consulta do histórico de empréstimos;
- registro de manutenções;
- consulta do histórico de manutenção;
- controle da situação dos equipamentos;
- dashboard com informações gerais.

### Não incluído inicialmente

- integração com sistemas externos de empresas;
- rastreamento GPS dos equipamentos;
- identificação por RFID ou dispositivos físicos;
- notificações por SMS;
- integração com sistemas de ponto;
- controle financeiro completo;
- compra automática de equipamentos;
- execução automática de processos de manutenção.

Essas funcionalidades poderão ser consideradas futuramente, mas não fazem parte do escopo inicial.

## Versionamento

O projeto utiliza Git durante todo o desenvolvimento. As versões das etapas são identificadas por tags:

```text
etapa-01  ✅
etapa-02  ✅
etapa-03  ✅
etapa-04
etapa-05
etapa-06
etapa-07
etapa-08
etapa-09
etapa-10
final
```

## Documentação

A documentação do projeto é mantida no diretório `/docs`:

- [`docs/proposta.md`](docs/proposta.md) — proposta e especificação inicial (Etapa 01);
- [`docs/etapa-02.md`](docs/etapa-02.md) — páginas criadas, funcionalidades e decisões de estrutura HTML (Etapa 02);
- [`docs/etapa-03.md`](docs/etapa-03.md) — decisões de responsividade, breakpoints e evidências (Etapa 03);
- [`docs/evidencias/etapa-03/`](docs/evidencias/etapa-03/) — capturas de tela em desktop, tablet e smartphone.

Novos documentos serão adicionados conforme as próximas etapas forem concluídas.

## Execução

O projeto ainda é um front-end estático (HTML + CSS puro), sem dependências de instalação.

Para visualizar localmente:

```bash
cd client
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000/index.html` no navegador e navegue entre as páginas pelo menu superior. Para conferir a responsividade, use o modo de dispositivo das ferramentas de desenvolvedor do navegador nos tamanhos 1440×900 (desktop), 768×1024 (tablet) e 390×844 (smartphone).

Quando o back-end for implementado, esta seção será atualizada com:

1. pré-requisitos;
2. instalação das dependências;
3. configuração das variáveis de ambiente;
4. configuração do banco de dados;
5. inicialização do servidor;
6. inicialização do cliente;
7. instruções para utilização da aplicação.

## Testes

Os procedimentos e evidências de testes serão documentados conforme as funcionalidades forem implementadas. A aplicação deverá evoluir para possuir mecanismos que permitam verificar principalmente:

- validação dos empréstimos;
- validação das devoluções;
- controle da situação dos equipamentos;
- regras de manutenção;
- operações da API;
- persistência;
- integração entre front-end e back-end.

## Decisões e limitações conhecidas

Algumas decisões ainda serão refinadas durante o desenvolvimento, incluindo:

- tecnologia definitiva do front-end (uso ou não de framework);
- estrutura definitiva do banco de dados;
- estratégia de autenticação;
- mecanismo de identificação dos equipamentos;
- arquitetura definitiva do servidor;
- estratégia de notificações.

Essas decisões serão registradas na documentação do projeto conforme forem tomadas.