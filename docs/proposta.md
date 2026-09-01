# Ferrum — Sistema de Gestão de Ferramentas e Equipamentos

## 1. Proposta

O **Ferrum** é uma aplicação Web destinada à gestão e ao controle de ferramentas e equipamentos utilizados por empresas, oficinas, laboratórios e equipes de trabalho.

A aplicação permitirá cadastrar equipamentos, registrar empréstimos e devoluções e manter o histórico de manutenções. A partir dessas informações, o usuário poderá acompanhar a situação atual dos equipamentos e consultar seu histórico de utilização.

O sistema terá como foco a organização e o controle das informações dos equipamentos, não substituindo procedimentos internos de segurança ou manutenção.

## 2. Problema

Em ambientes que possuem diversas ferramentas e equipamentos compartilhados, pode ser difícil acompanhar onde cada item está, quem está utilizando determinado equipamento e quais itens estão indisponíveis por manutenção.

Quando esse controle é realizado manualmente, por meio de planilhas, anotações ou diferentes sistemas, podem ocorrer:

- dificuldade para localizar equipamentos;
- perda do histórico de empréstimos;
- empréstimos duplicados;
- dificuldade para acompanhar devoluções;
- falta de controle sobre equipamentos em manutenção;
- dificuldade para identificar o responsável por um equipamento.

O Ferrum pretende centralizar essas informações em uma única aplicação.

## 3. Público-alvo

O público-alvo são organizações e equipes que possuem ferramentas ou equipamentos compartilhados e precisam controlar sua utilização.

Entre os possíveis usuários estão:

- oficinas;
- laboratórios;
- empresas de manutenção;
- equipes técnicas;
- empresas que disponibilizam equipamentos para seus funcionários.

## 4. Objetivo

### 4.1 Objetivo principal

Desenvolver uma aplicação Web que permita cadastrar e acompanhar ferramentas e equipamentos, controlando empréstimos, devoluções e manutenções.

### 4.2 Objetivos secundários

A aplicação deverá:

- manter o cadastro dos equipamentos;
- controlar a disponibilidade dos equipamentos;
- registrar empréstimos e devoluções;
- manter o histórico de movimentações;
- registrar manutenções;
- apresentar a situação atual dos equipamentos;
- disponibilizar informações para facilitar o controle dos responsáveis.

## 5. Funcionalidades

### 5.1 Cadastro e consulta de equipamentos

Permitir manter informações dos equipamentos utilizados no sistema.

Cada equipamento deverá possuir inicialmente:

- nome;
- identificação;
- descrição;
- categoria;
- situação;
- data de cadastro.

As situações inicialmente consideradas serão:

- disponível;
- emprestado;
- em manutenção.

### 5.2 Cadastro e consulta de categorias

Permitir organizar os equipamentos por categorias.

Uma categoria deverá possuir inicialmente:

- nome;
- descrição;
- situação de cadastro.

### 5.3 Registro de empréstimos

Permitir registrar a retirada de equipamentos.

Um empréstimo deverá possuir inicialmente:

- equipamento;
- usuário responsável;
- data do empréstimo;
- previsão de devolução;
- data de devolução, quando concluído;
- observações.

### 5.4 Consulta do histórico de empréstimos

Permitir consultar os empréstimos já registrados.

A consulta deverá apresentar informações como:

- equipamento;
- responsável;
- data do empréstimo;
- previsão de devolução;
- situação;
- data de devolução.

### 5.5 Registro de devoluções

Permitir registrar a devolução de um equipamento associado a um empréstimo.

A devolução deverá atualizar a situação do equipamento conforme as regras definidas pelo sistema.

### 5.6 Registro de manutenção

Permitir registrar manutenções realizadas ou necessárias em equipamentos.

Uma manutenção deverá possuir inicialmente:

- equipamento;
- descrição do problema ou serviço;
- data de início;
- data de conclusão, quando finalizada;
- situação;
- observações.

### 5.7 Dashboard

Disponibilizar uma visão geral contendo informações como:

- quantidade total de equipamentos;
- equipamentos disponíveis;
- equipamentos emprestados;
- equipamentos em manutenção;
- empréstimos pendentes;
- movimentações recentes.

## 6. Entidades e conceitos do domínio

### 6.1 Usuário

Pessoa que utiliza o sistema e pode ser responsável por um empréstimo.

### 6.2 Equipamento

Ferramenta ou equipamento controlado pelo sistema.

### 6.3 Categoria

Classificação utilizada para organizar os equipamentos.

### 6.4 Empréstimo

Registro da retirada de um equipamento por determinado usuário.

### 6.5 Devolução

Registro da devolução de um equipamento associado a um empréstimo.

### 6.6 Manutenção

Registro de uma manutenção realizada ou necessária em um equipamento.

## 7. Interfaces previstas

### 7.1 Dashboard

Tela principal da aplicação.

Apresentará:

- quantidade total de equipamentos;
- equipamentos disponíveis;
- equipamentos emprestados;
- equipamentos em manutenção;
- empréstimos pendentes;
- movimentações recentes.

### 7.2 Equipamentos

Tela destinada ao cadastro e consulta dos equipamentos.

Deverá permitir:

- consulta;
- filtragem;
- cadastro;
- edição;
- exclusão;
- visualização da situação.

### 7.3 Empréstimos

Tela destinada ao controle dos empréstimos.

Deverá permitir:

- registrar empréstimo;
- consultar empréstimos;
- filtrar registros;
- visualizar responsável;
- visualizar datas;
- registrar devolução.

### 7.4 Manutenções

Tela destinada ao controle das manutenções.

Deverá permitir:

- registrar manutenção;
- consultar histórico;
- visualizar equipamentos em manutenção;
- registrar conclusão.

## 8. Operações previstas

As principais operações serão:

1. Cadastrar equipamento.
2. Consultar equipamentos.
3. Editar equipamento.
4. Excluir equipamento.
5. Cadastrar categoria.
6. Consultar categorias.
7. Registrar empréstimo.
8. Consultar empréstimos.
9. Registrar devolução.
10. Consultar histórico de empréstimos.
11. Registrar manutenção.
12. Consultar histórico de manutenção.
13. Consultar a situação de um equipamento.

A inclusão, alteração ou conclusão de operações deverá refletir na situação correspondente do equipamento.

## 9. Tecnologias pretendidas

### 9.1 Cliente

Tecnologias inicialmente previstas:

- HTML5;
- CSS3;
- JavaScript.

A utilização de um framework de front-end poderá ser avaliada posteriormente.

### 9.2 Servidor

Tecnologias inicialmente previstas:

- Java;
- Spring Boot;
- Spring Data JPA;
- Hibernate;
- API REST;
- JSON;
- Maven.

### 9.3 Persistência

Será utilizado um banco de dados relacional.

A tecnologia inicialmente prevista é o **PostgreSQL**, podendo ser alterada durante a implementação.

## 10. Diagrama inicial

```text
┌──────────────────────┐
│       USUÁRIO        │
│                      │
│ Consulta equipamentos│
│ Registra empréstimos │
│ Registra devoluções  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    FRONT-END WEB     │
│                      │
│ Dashboard            │
│ Equipamentos         │
│ Empréstimos          │
│ Manutenções          │
└──────────┬───────────┘
           │
           │ HTTP / JSON
           ▼
┌──────────────────────┐
│       API REST       │
│                      │
│ Java / Spring Boot   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    REGRAS DE NEGÓCIO │
│                      │
│ Empréstimos          │
│ Devoluções           │
│ Manutenções          │
│ Situação do item     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    BANCO DE DADOS    │
│                      │
│ Usuários             │
│ Equipamentos         │
│ Categorias           │
│ Empréstimos          │
│ Manutenções          │
└──────────────────────┘
```

O diagrama representa a visão inicial da solução. A arquitetura poderá ser refinada durante as etapas posteriores.

## 11. Escopo inicial

### Dentro do escopo

- cadastro de equipamentos;
- cadastro de categorias;
- consulta de equipamentos;
- edição e exclusão;
- registro de empréstimos;
- registro de devoluções;
- histórico de empréstimos;
- registro de manutenções;
- histórico de manutenções;
- controle da situação dos equipamentos;
- dashboard.

### Fora do escopo inicial

- integração com sistemas externos;
- rastreamento GPS;
- identificação por RFID ou dispositivos físicos;
- notificações por SMS;
- integração com sistemas de ponto;
- controle financeiro completo;
- compra automática de equipamentos;
- automação de processos de manutenção.

Essas funcionalidades poderão ser consideradas futuramente, mas não fazem parte do escopo inicial.

## 12. Premissas e limitações

O sistema será inicialmente orientado às informações fornecidas pelos usuários.

Os equipamentos, empréstimos, devoluções e manutenções deverão ser cadastrados pelos usuários.

A aplicação não controlará fisicamente os equipamentos e não terá, inicialmente, integração com dispositivos de rastreamento ou identificação.

A disponibilidade das informações dependerá da qualidade dos dados cadastrados.

## 13. Evolução prevista

O projeto será desenvolvido de forma incremental.

A evolução prevista é:

1. estruturação das interfaces com HTML semântico;
2. estilização e responsividade com CSS;
3. implementação de interatividade com JavaScript;
4. modularização e comunicação assíncrona;
5. implementação da API REST com Java e Spring Boot;
6. persistência em banco de dados;
7. implementação das operações de CRUD;
8. organização arquitetural;
9. integração completa entre front-end, API e banco;
10. revisão, documentação, testes e preparação da versão final.

O objetivo é que cada etapa acrescente uma capacidade relevante ao mesmo sistema.

## 14. Limitações conhecidas

Nesta versão inicial ainda não estão completamente definidas:

- arquitetura final do servidor;
- estratégia de autenticação;
- tecnologia definitiva do front-end;
- estrutura definitiva do banco de dados;
- mecanismo de identificação dos equipamentos;
- estratégia de notificações.

Essas decisões serão refinadas durante o desenvolvimento.

## 15. Critérios de sucesso da proposta

A proposta será considerada bem-sucedida se permitir desenvolver uma aplicação Web capaz de:

- cadastrar equipamentos;
- registrar empréstimos;
- registrar devoluções;
- controlar a situação dos equipamentos;
- registrar manutenções;
- consultar históricos;
- apresentar informações gerais da utilização dos equipamentos;
- evoluir progressivamente conforme os conteúdos da disciplina;
- manter separação adequada entre interface, servidor, regras de negócio e persistência.
