# Especificação de Design: Migração do Front-End HTML para React

**Data:** 2026-04-07
**Projeto:** Casa do Lago
**Escopo:** substituir o front atual em HTML estático por uma aplicação React funcional, mantendo o visual existente e conectando às rotas já disponíveis da API.

## Objetivo

Transformar as telas atuais `[home.html](D:/estudos/casanolago/casa-no-lago/front/home.html)` e `[login.html](D:/estudos/casanolago/casa-no-lago/front/login.html)` em uma aplicação React moderna, organizada e pronta para crescer. A nova base deve incluir roteamento, componentes reutilizáveis, autenticação persistida, integração com a API Express existente e suporte a uma nova tela de cadastro conectada a `/auth/register`.

## Resultado Esperado

Ao final da migração, o projeto deve oferecer:

- uma aplicação React independente para o front-end;
- rotas para Home, Login e Cadastro;
- layout visual equivalente ao front atual;
- listagem e filtro de quartos consumindo `GET /quartos`;
- login consumindo `POST /auth/login`;
- cadastro consumindo `POST /auth/register`;
- criação de reserva consumindo `POST /reservas`;
- proteção do fluxo de reserva para usuários não autenticados;
- componentes e arquivos organizados para manutenção futura.

## Contexto Atual

O repositório contém:

- um diretório `[front](D:/estudos/casanolago/casa-no-lago/front)` com HTML estático, CSS inline e scripts embutidos;
- um diretório `[api](D:/estudos/casanolago/casa-no-lago/api)` com API Express;
- rotas já existentes para autenticação, quartos e reservas.

Comportamentos já observados no front atual:

- a Home exibe quartos, filtros de busca e modal de reserva;
- a Home já tenta consumir `/quartos` e `/reservas`;
- a tela de Login já tenta consumir `/auth/login`;
- o design usa a paleta visual atual, tipografia `Cormorant Garamond` e `Jost`, além de uma composição visual mais editorial.

## Abordagem Escolhida

Será adotada uma base React mais pronta para crescimento, mas sem abstrações desnecessárias.

Essa abordagem inclui:

- React para renderização declarativa;
- React Router para navegação entre páginas;
- camada de serviços para chamadas HTTP;
- contexto de autenticação para sessão e token;
- componentes menores para layout, autenticação, listagem de quartos e modal de reserva;
- reaproveitamento do visual atual, convertendo HTML e CSS existentes para JSX e arquivos de estilo adequados ao novo app.

Essa escolha foi priorizada porque cria uma estrutura sustentável para evolução, sem cair em uma migração literal com componentes gigantes ou scripts acoplados ao DOM.

## Arquitetura Proposta

O novo front será estruturado como uma aplicação React com separação clara entre páginas, componentes, serviços e estado global de autenticação.

Estrutura conceitual:

- `src/main.jsx`: ponto de entrada da aplicação;
- `src/App.jsx`: árvore principal com roteamento;
- `src/pages/`: páginas de alto nível;
- `src/components/`: componentes reutilizáveis de UI e layout;
- `src/context/`: autenticação e estado compartilhado;
- `src/services/`: cliente HTTP e funções de integração com a API;
- `src/styles/`: estilos globais e estilos por domínio visual;
- `src/utils/`: funções auxiliares de formatação e validação, se necessário.

## Rotas da Aplicação

As rotas iniciais serão:

- `/`: página Home;
- `/login`: página de autenticação;
- `/cadastro`: página de criação de conta.

Não há necessidade inicial de rotas aninhadas ou dashboard administrativo. A navegação deve permanecer simples e consistente com o fluxo atual.

## Páginas e Componentes

### Home

Responsabilidades:

- renderizar a navegação principal;
- apresentar a seção hero;
- exibir barra de busca com filtros;
- carregar quartos da API ao iniciar;
- aplicar filtros de pesquisa;
- exibir cards de quartos;
- abrir e fechar modal de reserva;
- criar reserva para usuário autenticado;
- redirecionar para login quando a reserva exigir autenticação.

Componentes previstos:

- `Navbar`
- `HeroSection`
- `RoomSearchBar`
- `RoomGrid`
- `RoomCard`
- `ReservationModal`
- `Footer`

### Login

Responsabilidades:

- exibir formulário controlado de login;
- alternar exibição da senha;
- enviar credenciais para a API;
- mostrar erro e estado de carregamento;
- salvar token e refletir usuário autenticado no app;
- redirecionar após login com sucesso.

Componentes previstos:

- `AuthLayout`
- `LoginForm`
- componentes menores de campo e feedback, se isso simplificar o código.

### Cadastro

Responsabilidades:

- exibir formulário controlado de criação de conta;
- coletar nome, email, senha, confirmação, telefone e CPF;
- enviar dados para `/auth/register`;
- exibir mensagens de erro e sucesso;
- oferecer navegação natural para login após cadastro bem-sucedido.

Componentes previstos:

- `AuthLayout`
- `RegisterForm`

## Fluxo de Dados

### Quartos

- ao abrir a Home, a aplicação consulta `GET /quartos`;
- os dados recebidos alimentam o estado da lista de quartos;
- os filtros da interface atual serão representados em estado React;
- ao executar a busca, a aplicação monta a query string e consulta novamente a API;
- caso a API falhe ou retorne lista vazia, a interface deve refletir isso com mensagens adequadas.

### Login

- o formulário envia `email` e `password` para `POST /auth/login`;
- em caso de sucesso, o token retornado é salvo no contexto e em `localStorage`;
- o estado autenticado é restaurado no carregamento inicial da aplicação;
- mensagens de erro da API devem ser exibidas de forma amigável.

### Cadastro

- o formulário envia `name`, `email`, `password`, `confirmpassword`, `telefone` e `cpf` para `POST /auth/register`;
- a tela deve refletir validações da API e permitir que o usuário corrija os dados;
- após sucesso, o fluxo recomendado é encaminhar o usuário para login.

### Reserva

- ao clicar em reservar, a Home abre um modal associado ao quarto selecionado;
- se o usuário não estiver autenticado, a ação deve orientar ou redirecionar para `/login`;
- se estiver autenticado, o modal envia a requisição para `POST /reservas` com o token no header `Authorization`;
- o feedback de sucesso ou erro deve ser visível no próprio fluxo da reserva.

## Estado da Aplicação

O estado global inicial será restrito ao que realmente precisa ser compartilhado:

- token de autenticação;
- indicador de usuário autenticado;
- funções de login e logout;
- restauração de sessão a partir de `localStorage`.

Estados locais ficarão nas páginas ou componentes:

- filtros de busca;
- loading de quartos;
- quarto selecionado;
- abertura do modal;
- valores e erros dos formulários;
- estados de envio.

Isso evita um estado global excessivo e mantém a base simples.

## Integração com a API

O front deverá consumir a API Express já existente em `[api/index.js](D:/estudos/casanolago/casa-no-lago/api/index.js)`.

Regras de integração:

- centralizar chamadas HTTP em serviços;
- usar uma configuração base de URL para facilitar execução local;
- enviar `Content-Type: application/json` quando necessário;
- enviar `Authorization: Bearer <token>` nas rotas protegidas;
- tratar mensagens de erro vindas da API sem esconder o motivo do problema.

Rotas consideradas no design:

- `GET /quartos`
- `POST /auth/login`
- `POST /auth/register`
- `POST /reservas`

## Decisões de UI e Migração Visual

O design atual deve ser preservado, com ajustes apenas quando necessários para melhor adaptação ao React.

Diretrizes:

- manter a mesma identidade visual, paleta, espaçamentos e tipografia;
- migrar o CSS inline dos HTMLs para arquivos de estilo do app React;
- substituir `onclick`, `addEventListener` e manipulação manual do DOM por `onClick`, `useState`, `useEffect` e renderização declarativa;
- transformar links de navegação interna em `Link` do React Router;
- manter a experiência visual da Home e do Login, e criar o Cadastro no mesmo idioma visual.

## Tratamento de Erros e Estados Vazios

O front deve contemplar explicitamente:

- erro ao carregar quartos;
- ausência de resultados na busca;
- erro de login;
- erro de cadastro;
- erro ao reservar;
- carregamento durante chamadas assíncronas.

Os feedbacks devem ser claros, visíveis e integrados ao layout, evitando alertas nativos do navegador como solução principal.

## Estratégia de Teste

A implementação deve seguir TDD.

Cobertura mínima esperada:

- renderização das rotas principais;
- login com sucesso e com erro;
- persistência do token no carregamento;
- carregamento e renderização de quartos;
- submissão dos filtros;
- abertura e fechamento do modal de reserva;
- proteção do fluxo de reserva sem autenticação;
- envio do cadastro;
- envio da reserva autenticada.

Ferramentas de teste devem ser compatíveis com a stack React adotada, priorizando testes de comportamento em vez de testes acoplados à implementação.

## Critérios de Aceite

O trabalho será considerado correto quando:

- a aplicação React iniciar localmente sem depender dos HTMLs antigos;
- a navegação entre Home, Login e Cadastro estiver funcional;
- o layout permanecer visualmente fiel ao original;
- quartos forem carregados pela API;
- login salvar sessão e permitir fluxo autenticado;
- cadastro enviar dados válidos para a API;
- reserva exigir autenticação e funcionar com token válido;
- a base de código ficar organizada em componentes React reutilizáveis.

## Fora de Escopo Neste Ciclo

Para manter o trabalho focado, ficam fora deste ciclo:

- painel administrativo;
- recuperação de senha;
- gestão avançada de perfil;
- refatorações amplas na API;
- novas regras de negócio além das já suportadas pelas rotas existentes.

## Riscos e Mitigações

### Diferenças entre o comportamento do HTML atual e o contrato real da API

Mitigação: validar a implementação contra as rotas existentes e tratar respostas inesperadas com feedbacks claros.

### CSS migrado gerar regressões visuais

Mitigação: preservar classes, estrutura visual e proporção dos blocos principais durante a conversão para componentes.

### Acoplamento desnecessário entre páginas e chamadas HTTP

Mitigação: isolar acesso à API em serviços reutilizáveis desde o início.

### Sessão quebrar após recarregar a página

Mitigação: restaurar autenticação no bootstrap da aplicação com base no `localStorage`.

## Resumo

O front do Casa do Lago será migrado de HTML estático para uma aplicação React com estrutura mais preparada para evolução. A solução terá páginas para Home, Login e Cadastro, integração com a API atual, persistência de autenticação, reserva protegida por login e manutenção do visual já existente. A arquitetura prioriza componentes reutilizáveis, serviços HTTP organizados e estado global mínimo.
