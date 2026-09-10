# Etapa 03 — Interface responsiva com CSS

## Objetivo da etapa

Transformar a estrutura HTML semântica desenvolvida na Etapa 02 em uma
interface visualmente organizada, responsiva e adequada a diferentes
tamanhos de tela (desktop, tablet e smartphone), sem alterar o conteúdo,
a proposta ou a estrutura semântica já definidos nas etapas anteriores.

## Interfaces estilizadas

As quatro interfaces já existentes no projeto foram estilizadas e
receberam o mesmo padrão visual:

1. **Dashboard** (`client/index.html`) — visão geral, com resumo dos
   equipamentos, empréstimos pendentes e movimentações recentes.
2. **Equipamentos** (`client/equipamentos.html`) — cadastro, filtro e
   listagem de equipamentos.
3. **Empréstimos** (`client/emprestimos.html`) — registro de
   empréstimo, registro de devolução e histórico de empréstimos.
4. **Manutenções** (`client/manutencoes.html`) — registro de
   manutenção, conclusão de manutenção e histórico de manutenções.

As três primeiras (Dashboard, Equipamentos e Empréstimos) foram
utilizadas como telas representativas para as evidências desta etapa,
conforme orientação do escopo da entrega. A tela de Manutenções recebeu
o mesmo tratamento visual e responsivo e foi validada manualmente,
embora não faça parte do conjunto de 9 capturas de tela exigidas.

## Localização dos arquivos CSS

Foi criado um único arquivo de estilos, organizado internamente por
seções comentadas:

```
client/css/style.css
```

O arquivo é referenciado por todas as páginas HTML por meio de:

```html
<link rel="stylesheet" href="css/style.css">
```

Optou-se por um único arquivo CSS (em vez de dividir em vários
arquivos) porque o projeto possui apenas quatro páginas com estrutura e
componentes muito semelhantes entre si (cabeçalho, navegação, seções,
formulários, tabelas e rodapé). Um único arquivo, bem organizado por
seções numeradas e comentadas, evita duplicação de regras entre
arquivos e mantém a folha de estilos fácil de localizar e manter. Não
foi utilizado nenhum framework de CSS — todo o código é CSS puro.

## Nenhuma alteração de conteúdo

O HTML das quatro páginas foi mantido, preservando a estrutura semântica
da Etapa 02 (`header`, `nav`, `main`, `section`, `form`, `table` etc.).
As únicas alterações feitas no HTML foram:

- inclusão do `<link>` para `css/style.css` no `<head>` de cada página;
- adição da classe `stats-grid` ao `<dl>` do resumo do Dashboard, para
  servir de gancho de estilização do grid de indicadores;
- inclusão de uma `<div class="table-responsive">` envolvendo cada
  `<table>`, usada como contêiner de rolagem horizontal de segurança;
- inclusão do atributo `data-label` em cada `<td>` das tabelas,
  repetindo o texto do `<th>` correspondente — usado apenas pelo CSS
  (`content: attr(data-label)`) para exibir o rótulo da coluna quando a
  tabela é reorganizada em cartões no smartphone.

Nenhum conteúdo, funcionalidade, texto ou informação foi removido ou
inventado.

## Uso de Flexbox

Flexbox foi utilizado nos componentes que organizam itens em linha ou
coluna com alinhamento e espaçamento flexível:

- **Navegação principal** (`nav ul`): itens do menu em linha, com
  quebra automática (`flex-wrap`) e distribuição consistente do espaço.
- **Grupo de botões dos formulários** (`form p:has(> button)`): botões
  de ação lado a lado, com espaçamento uniforme, e empilhados em coluna
  no smartphone.
- **Lista de movimentações recentes** do Dashboard (`section ol`):
  itens em coluna, com espaçamento consistente entre os cartões.
- **Layout geral da página** (`main`): seções empilhadas em coluna com
  espaçamento uniforme entre elas.
- **Célula da tabela em modo cartão** (smartphone): cada `<td>` vira um
  contêiner flex que distribui o rótulo da coluna e o valor nas
  extremidades (`justify-content: space-between`).

## Uso de CSS Grid

CSS Grid foi utilizado nos componentes que exigem organização em
colunas e linhas bem definidas:

- **Estrutura da página** (`body`): grid de três linhas
  (`auto 1fr auto`) para cabeçalho, conteúdo e rodapé, garantindo que o
  rodapé permaneça no final da página mesmo com pouco conteúdo.
- **Resumo do Dashboard** (`dl.stats-grid`): os quatro indicadores
  (total, disponíveis, emprestados, em manutenção) são organizados em
  grid, com número de colunas variando conforme o breakpoint (1 coluna
  no smartphone, 2 no tablet, 4 no desktop).
- **Campos de formulário** (`form p:has(> label)`): cada campo (rótulo
  + entrada) é um grid de 1 coluna no smartphone e passa a 2 colunas
  (rótulo à esquerda, campo à direita) a partir do breakpoint de
  tablet.
- **Cabeçalho no desktop** (`body > header`, a partir de 1024px): grid
  de 2 colunas posiciona a marca (`h1` + parágrafo) à esquerda e a
  navegação à direita, sem necessidade de alterar a estrutura HTML.

## Breakpoints utilizados

Foram definidos dois breakpoints principais, além de ajustes
complementares específicos para smartphone, totalizando conformidade
com a exigência de pelo menos dois breakpoints:

| Breakpoint | Regra CSS | Faixa de aplicação | Cobre o teste de |
|---|---|---|---|
| Base (mobile-first) | sem media query | até 639px | Smartphone (390px) |
| Tablet | `@media (min-width: 640px)` | 640px até 1023px | Tablet (768px) |
| Desktop | `@media (min-width: 1024px)` | a partir de 1024px | Desktop (1440px) |

Um terceiro bloco, `@media (max-width: 639px)`, concentra os ajustes
exclusivos do smartphone (transformação das tabelas em cartões, botões
de formulário em coluna e navegação em grade 2×2), mantendo essas
regras separadas das regras mobile-first de base para facilitar a
leitura do arquivo.

Essas larguras foram escolhidas para não coincidir com nenhuma das
resoluções de teste exigidas (1440×900, 768×1024 e 390×844), evitando
comportamento ambíguo exatamente na borda de um breakpoint.

## Principais decisões de responsividade

- **Abordagem mobile-first**: o CSS base já atende ao smartphone; os
  breakpoints de tablet e desktop apenas adicionam ou ajustam regras
  (mais colunas, cabeçalho em grid, espaçamento maior), sem duplicar
  estilos.
- **Navegação**: no smartphone os links do menu ficam em uma grade
  2×2 de botões com no mínimo 44px de altura (área de toque
  adequada); no tablet os itens ficam em uma única linha, alinhados à
  direita; no desktop o menu fica ao lado da marca "Ferrum", no mesmo
  cabeçalho.
- **Formulários**: no smartphone o rótulo fica acima do campo
  (coluna única) e os botões ocupam a largura total, empilhados; a
  partir do tablet o rótulo passa a ficar ao lado do campo (grid de 2
  colunas) e os botões voltam a ficar lado a lado.
- **Tabelas/listagens**: no tablet e no desktop as tabelas mantêm o
  formato tradicional, dentro de um contêiner com rolagem horizontal de
  segurança (`.table-responsive`) para o caso de a largura não caber.
  No smartphone, cada linha da tabela é reorganizada como um cartão:
  o cabeçalho (`thead`) é ocultado visualmente (mas continua acessível
  a leitores de tela) e cada célula passa a exibir o nome da coluna
  (via `data-label`) ao lado do valor, preservando todas as
  informações sem exigir rolagem horizontal nem cortar dados.
- **Cards do Dashboard**: os indicadores numéricos (total, disponíveis,
  emprestados, em manutenção) usam Grid para se reorganizar de 1 coluna
  (smartphone) para 2 (tablet) e 4 (desktop), sempre com a mesma
  aparência de cartão.
- **Espaçamento e tipografia**: foi definida uma escala de espaçamento
  (`--space-1` a `--space-7`) e uma paleta de cores em variáveis CSS
  (`:root`), reaproveitadas em todos os componentes, garantindo
  consistência visual entre as quatro páginas e entre os três tamanhos
  de tela.
- **Botões**: em todas as telas os botões têm altura mínima de 44px
  (adequada para toque em smartphones); no smartphone os botões de
  formulário ficam com largura total, empilhados verticalmente.

## Adaptação por tamanho de tela

### Desktop (1440×900)

- Cabeçalho em grid: marca à esquerda, navegação à direita, na mesma
  linha.
- Cards do resumo do Dashboard em 4 colunas.
- Formulários com rótulo e campo lado a lado, ocupando bem a largura
  disponível (largura máxima do conteúdo limitada a 1200px, centralizado).
- Tabelas completas, em formato tradicional.

### Tablet (768×1024)

- Cabeçalho ainda empilhado (marca centralizada acima do menu), com o
  menu em uma única linha alinhada à direita.
- Cards do resumo do Dashboard em 2 colunas.
- Formulários com rótulo ao lado do campo (grid de 2 colunas), já
  aplicando o mesmo padrão do desktop.
- Tabelas completas, em formato tradicional, dentro do contêiner com
  rolagem horizontal de segurança.

### Smartphone (390×844)

- Cabeçalho totalmente empilhado e centralizado; menu em grade 2×2 de
  botões grandes.
- Cards do resumo do Dashboard em 1 coluna.
- Formulários com rótulo acima do campo e botões em largura total,
  empilhados.
- Tabelas reorganizadas em cartões: cada registro vira um bloco com os
  pares "rótulo → valor", sem cortar nem esconder informações.

## Evidências

As evidências visuais desta etapa estão em:

```
docs/evidencias/etapa-03/
```

Foram geradas capturas de tela reais (via Playwright/Chromium,
executando o projeto em um servidor HTTP local) das três telas
representativas (Dashboard, Equipamentos e Empréstimos) nos três
viewports exigidos:

- `desktop-tela-01.png`, `desktop-tela-02.png`, `desktop-tela-03.png` — 1440×900
- `tablet-tela-01.png`, `tablet-tela-02.png`, `tablet-tela-03.png` — 768×1024
- `smartphone-tela-01.png`, `smartphone-tela-02.png`, `smartphone-tela-03.png` — 390×844

Onde `tela-01` = Dashboard, `tela-02` = Equipamentos e `tela-03` =
Empréstimos.

## Como executar e visualizar o projeto

O projeto continua sendo um front-end estático (HTML + CSS puro), sem
dependências de instalação. Para visualizar:

1. Abrir a pasta `client/` em um servidor HTTP simples, por exemplo:
   ```
   cd client
   python3 -m http.server 8000
   ```
2. Acessar `http://localhost:8000/index.html` no navegador.
3. Navegar entre as páginas pelo menu superior.
4. Para testar a responsividade, usar as ferramentas de desenvolvedor
   do navegador (modo de dispositivo) e configurar manualmente os
   tamanhos 1440×900, 768×1024 e 390×844.

## O que não foi feito nesta etapa (fora do escopo)

Conforme o escopo definido para a Etapa 03, não foram implementados:
JavaScript, interatividade dinâmica, backend, API, autenticação ou
persistência em banco de dados. O foco desta etapa foi exclusivamente
CSS, responsividade, organização de estilos e documentação/evidências.
