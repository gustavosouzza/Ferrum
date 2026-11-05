# Etapa 05 — Modularização e Comunicação Assíncrona

## 1. Objetivo

Nesta etapa, o Ferrum foi preparado para consumir dados de uma fonte externa e teve seu código JavaScript reorganizado em módulos. Como a API REST em Java/Spring Boot pertence a uma etapa posterior do projeto, foi utilizada uma camada de serviço simulada no próprio front-end.

## 2. Organização dos módulos

Os arquivos JavaScript foram separados por responsabilidade:

| Arquivo | Responsabilidade |
|---|---|
| `client/js/api/ferrum-api.js` | Simular a comunicação com o servidor, controlar o tempo de resposta e representar falhas de comunicação |
| `client/js/services/equipamento-service.js` | Consultar, cadastrar, editar e excluir equipamentos |
| `client/js/services/emprestimo-service.js` | Consultar empréstimos e registrar empréstimos/devoluções |
| `client/js/services/manutencao-service.js` | Consultar manutenções e registrar/concluir manutenções |
| `client/js/services/dashboard-service.js` | Consultar os dados necessários ao dashboard |
| `client/js/store.js` | Manter os dados, validações e regras de negócio do Ferrum, com persistência local |
| `client/js/ui.js` | Reunir funções reutilizáveis de interface, mensagens, erros e carregamento |
| `client/js/dashboard.js` | Controlar a interface do dashboard |
| `client/js/equipamentos.js` | Controlar a interface de equipamentos |
| `client/js/emprestimos.js` | Controlar a interface de empréstimos |
| `client/js/manutencoes.js` | Controlar a interface de manutenções |

As páginas HTML passaram a carregar seus arquivos de entrada com `type="module"`, permitindo utilizar `import` e `export`.

## 3. Comunicação assíncrona

A comunicação foi centralizada em `client/js/api/ferrum-api.js`. A função `requisicao()` retorna uma Promise, aguarda um intervalo para simular o tempo de resposta de um servidor e executa a operação solicitada.

Os módulos de serviço utilizam `async/await` indiretamente por meio das Promises retornadas pela camada de API. Os arquivos das páginas aguardam as consultas e operações antes de atualizar a interface.

Nesta etapa, a camada simulada utiliza as funções já existentes em `store.js`. A persistência continua sendo feita no `localStorage`; portanto, ainda não existe um servidor HTTP real nem uma API REST externa. Essa separação permite substituir a implementação simulada por chamadas `fetch()` quando o back-end estiver disponível.

## 4. Operações demonstradas

| Tipo | Operação | Arquivos envolvidos |
|---|---|---|
| Consulta | Listar equipamentos e aplicar filtros | `services/equipamento-service.js`, `equipamentos.js` |
| Consulta | Consultar empréstimos e histórico | `services/emprestimo-service.js`, `emprestimos.js` |
| Consulta | Consultar manutenções | `services/manutencao-service.js`, `manutencoes.js` |
| Consulta | Carregar indicadores e movimentações do dashboard | `services/dashboard-service.js`, `dashboard.js` |
| Envio | Cadastrar equipamento | `services/equipamento-service.js`, `equipamentos.js` |
| Envio | Registrar empréstimo e devolução | `services/emprestimo-service.js`, `emprestimos.js` |
| Envio | Registrar e concluir manutenção | `services/manutencao-service.js`, `manutencoes.js` |

## 5. Estados de carregamento, sucesso e erro

- **Carregamento:** `FerrumUI.mostrarCarregamento()` apresenta uma mensagem enquanto a consulta ou envio está em andamento. Os formulários também informam a operação que está sendo executada.
- **Sucesso:** após o retorno válido da operação, a interface apresenta mensagens como “Equipamento cadastrado com sucesso” ou “Empréstimo registrado com sucesso”.
- **Erro de validação:** as regras existentes em `store.js` continuam retornando os erros por campo, apresentados por `FerrumUI.exibirErros()`.
- **Erro de comunicação:** as páginas capturam exceções com `try/catch` e apresentam uma mensagem ao usuário, sem interromper a aplicação.

## 6. Como testar

1. Abra a pasta `client/` no Visual Studio Code.
2. Utilize a extensão **Live Server** (Ritwick Dey): clique com o botão direito em `index.html` e selecione **Open with Live Server**. O navegador abrirá a aplicação em um endereço local, normalmente `http://127.0.0.1:5500`.
3. Abra Equipamentos e consulte a listagem. O indicador “Consultando equipamentos...” deverá aparecer brevemente.
5. Cadastre um equipamento válido. Durante o envio, deverá aparecer “Enviando dados do equipamento...”; ao final, a mensagem de sucesso e o novo item deverão aparecer.
6. Acesse Empréstimos e registre um empréstimo para um equipamento disponível. Confira a mensagem de sucesso e a atualização do histórico.
7. Repita a consulta e o envio na tela de Manutenções.

### Testar erro de comunicação

1. Abra as ferramentas de desenvolvedor do navegador (F12) e acesse a aba Console.
2. Execute:
   ```javascript
   sessionStorage.setItem("ferrum-simular-erro", "true");
   ```
3. Atualize a página e tente consultar equipamentos ou carregar outra tela. A camada simulada deverá rejeitar a Promise e a interface deverá apresentar a mensagem de falha.
4. Para voltar ao funcionamento normal, execute:
   ```javascript
   sessionStorage.removeItem("ferrum-simular-erro");
   ```
   Depois atualize a página.

## 7. Matriz de evidências

| Requisito da Etapa 05 | Implementação | Arquivo(s) | Como verificar |
|---|---|---|---|
| Separar o código em módulos | Uso de `import` e `export` | `client/js/store.js`, `ui.js`, `services/`, arquivos de página | Inspecionar os imports e exports |
| Evitar arquivo único com toda a lógica | Separação entre API, serviços, dados, interface e páginas | `client/js/api/`, `client/js/services/`, `client/js/` | Conferir a estrutura de diretórios |
| Implementar chamadas assíncronas | Função que retorna Promise e simula latência | `client/js/api/ferrum-api.js` | Inspecionar `requisicao()` |
| Utilizar Fetch, Axios ou mecanismo equivalente | Camada de serviço assíncrona simulada | `client/js/api/ferrum-api.js` | Inspecionar a função `requisicao()` e os serviços |
| Utilizar Promises e/ou async/await | `async`, `await`, `Promise.all` e `Promise` | `client/js/api/`, `client/js/services/`, arquivos de página | Inspecionar as operações assíncronas |
| Tratar carregamento | Mensagem dinâmica durante as operações | `client/js/ui.js`, `equipamentos.js`, `emprestimos.js`, `manutencoes.js`, `dashboard.js` | Observar a mensagem durante as consultas e envios |
| Tratar erros de comunicação | `try/catch` e rejeição simulada da Promise | `client/js/api/ferrum-api.js` e arquivos de página | Ativar `sessionStorage` conforme instruções |
| Utilizar dados externos ou serviço simulado | Serviço simulado sobre a camada de dados local | `client/js/api/` e `client/js/services/` | Executar consultas e envios na aplicação |

## 8. Limitações desta versão

A comunicação desta etapa é simulada e não utiliza uma API REST hospedada. Os dados continuam no `localStorage`, como na etapa anterior. O uso de `fetch()` com endpoints reais e a integração com Java/Spring Boot ficam para a etapa de back-end, sem impedir a evolução da arquitetura atual.
