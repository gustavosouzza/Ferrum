# Ferrum

**Sistema de Gestão de Ferramentas e Equipamentos**

## Sobre o projeto

O **Ferrum** é uma aplicação Web destinada ao gerenciamento e controle de ferramentas e equipamentos utilizados por empresas, oficinas, laboratórios e equipes de trabalho.

A aplicação tem como objetivo centralizar informações sobre os equipamentos disponíveis, seus empréstimos, devoluções e manutenções, permitindo acompanhar a situação de cada item e seu histórico de utilização.

O sistema permitirá controlar quais ferramentas estão disponíveis, emprestadas ou em manutenção, além de registrar os responsáveis pelos empréstimos e as movimentações relacionadas aos equipamentos.

O projeto será desenvolvido de forma incremental ao longo da disciplina **Tecnologia de Construção de Software I**.

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

## Principais funcionalidades

### Ferramentas e equipamentos

- Cadastro de ferramentas e equipamentos;
- Consulta de ferramentas e equipamentos;
- Edição de equipamentos;
- Exclusão de equipamentos;
- Filtro por categoria;
- Consulta da situação atual do equipamento.

### Empréstimos

- Registro de empréstimos;
- Consulta de empréstimos;
- Identificação do responsável pelo empréstimo;
- Registro da data do empréstimo;
- Registro da previsão de devolução;
- Controle de equipamentos atualmente emprestados.

### Devoluções

- Registro de devolução;
- Consulta do histórico de devoluções;
- Identificação de empréstimos pendentes;
- Controle da situação do equipamento após a devolução.

### Manutenção

- Registro de manutenção;
- Consulta do histórico de manutenção;
- Identificação de equipamentos em manutenção;
- Registro do motivo da manutenção;
- Registro da conclusão da manutenção.

### Dashboard

O sistema poderá apresentar uma visão geral contendo:

- quantidade total de equipamentos;
- equipamentos disponíveis;
- equipamentos emprestados;
- equipamentos em manutenção;
- empréstimos pendentes;
- movimentações recentes.

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

## Interfaces previstas

### Dashboard

Tela principal da aplicação, apresentando uma visão geral da situação dos equipamentos.

Deverá apresentar, inicialmente:

- quantidade total de equipamentos;
- equipamentos disponíveis;
- equipamentos emprestados;
- equipamentos em manutenção;
- empréstimos pendentes;
- movimentações recentes.

### Equipamentos

Tela destinada ao cadastro e consulta dos equipamentos.

Deverá permitir:

- cadastro;
- consulta;
- edição;
- exclusão;
- filtragem;
- visualização da situação atual.

### Empréstimos

Tela destinada ao controle dos empréstimos.

Deverá permitir:

- registrar empréstimo;
- consultar empréstimos;
- filtrar empréstimos;
- visualizar responsável;
- visualizar datas;
- registrar devolução.

### Manutenções

Tela destinada ao controle das manutenções.

Deverá permitir:

- registrar manutenção;
- consultar histórico;
- visualizar equipamentos em manutenção;
- registrar conclusão da manutenção.

## Operações previstas

As principais operações da aplicação serão:

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

## Tecnologias pretendidas

### Cliente

Tecnologias inicialmente previstas:

- HTML5;
- CSS3;
- JavaScript.

A utilização de um framework de front-end poderá ser avaliada durante as etapas posteriores.

### Servidor

Tecnologias inicialmente previstas:

- Java;
- Spring Boot;
- Spring Data JPA;
- Hibernate;
- API REST;
- JSON;
- Maven.

### Persistência

Será utilizado um banco de dados relacional.

Inicialmente, está prevista a utilização do **PostgreSQL**, podendo essa decisão ser alterada durante o desenvolvimento.

### Outras ferramentas

- Git;
- GitHub;
- Docker.

## Arquitetura inicial

A visão inicial da aplicação é:

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

A arquitetura será refinada conforme o projeto evoluir.

## Estrutura prevista do projeto

A estrutura poderá evoluir ao longo das etapas. Inicialmente, será adotada uma organização semelhante a:

```text
ferrum/
│
├── docs/
│   └── proposta.md
│
├── client/
│
├── server/
│
├── README.md
│
└── .gitignore
```

A estrutura definitiva será definida conforme as tecnologias e decisões arquiteturais adotadas durante o desenvolvimento.

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

## Desenvolvimento por etapas

O projeto será desenvolvido incrementalmente.

| Etapa | Objetivo |
|---|---|
| 01 | Proposta e especificação |
| 02 | Protótipo estrutural com HTML semântico |
| 03 | Interface responsiva com CSS |
| 04 | Interatividade com JavaScript |
| 05 | Modularização e comunicação assíncrona |
| 06 | API REST com Java e Spring Boot |
| 07 | Persistência e CRUD com banco de dados |
| 08 | Organização arquitetural |
| 09 | Evolução do front-end |
| 10 | Qualidade, versionamento e release candidate |

Cada etapa deverá representar uma evolução do mesmo projeto.

## Versionamento

O projeto utilizará Git durante todo o desenvolvimento.

As versões das etapas serão identificadas por tags:

```text
etapa-01
etapa-02
etapa-03
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

A documentação do projeto será mantida no diretório:

```text
/docs
```

A documentação inicial inclui:

```text
/docs/proposta.md
```

Novos documentos serão adicionados conforme as etapas do projeto forem concluídas.

## Execução

As instruções de instalação e execução serão adicionadas e atualizadas conforme as tecnologias forem implementadas.

A versão inicial do projeto ainda não possui uma aplicação executável completa.

Quando o front-end e o back-end forem implementados, esta seção deverá conter:

1. pré-requisitos;
2. instalação das dependências;
3. configuração das variáveis de ambiente;
4. configuração do banco de dados;
5. inicialização do servidor;
6. inicialização do cliente;
7. instruções para utilização da aplicação.

## Testes

Os procedimentos e evidências de testes serão documentados conforme as funcionalidades forem implementadas.

A aplicação deverá evoluir para possuir mecanismos que permitam verificar principalmente:

- validação dos empréstimos;
- validação das devoluções;
- controle da situação dos equipamentos;
- regras de manutenção;
- operações da API;
- persistência;
- integração entre front-end e back-end.

## Decisões e limitações

Algumas decisões ainda poderão ser refinadas durante o desenvolvimento, incluindo:

- tecnologia definitiva do front-end;
- estrutura definitiva do banco de dados;
- estratégia de autenticação;
- mecanismo de identificação dos equipamentos;
- arquitetura definitiva do servidor;
- estratégia de notificações.

Essas decisões deverão ser registradas na documentação do projeto conforme forem tomadas.

