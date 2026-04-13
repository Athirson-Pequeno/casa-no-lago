# Documentação — Casa do Lago

Registro de todas as alterações feitas no projeto em relação ao código original.  
O código dos arquivos do projeto foi mantido limpo (sem comentários de alteração).  
Este arquivo é a única fonte de verdade sobre o que mudou e por quê.

---

## Estrutura do projeto

```
casaDoLago/
├── api/                        ← Backend Node.js + Express + MongoDB
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
├── front/                      ← Frontend React + Vite (migrado de HTML puro)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── lib/api.js
│   │   ├── components/Navbar.jsx
│   │   └── pages/Home.jsx + Login.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json
├── .gitignore
└── documentacao.md             ← este arquivo
```

---

## Backend — `api/`

### `config/db.js`

| # | Alteração | Motivo |
|---|-----------|--------|
| 1 | `dbName` mantido como `'casa-do-lago'
| 2 | Removido `dns.setServers(['1.1.1.1', '8.8.8.8'])` | Desnecessário no Render; pode conflitar com o DNS do ambiente de produção |
| 3 | Adicionada validação antecipada de `DB_USER` e `DB_PASS` com `process.exit(1)` | Evita o servidor subir sem banco configurado — falha rápido com mensagem clara |
| 4 | Adicionado listener `mongoose.connection.on('disconnected')` | Registra no log quando a conexão cair, facilitando diagnóstico |

---

### `index.js`

| # | Alteração | Motivo |
|---|-----------|--------|
| 1 | Adicionado pacote `cors` com lista de origens permitidas | O frontend hospedado no Vercel precisa de permissão explícita para chamar a API no Render |
| 2 | Porta dinâmica via `process.env.PORT \|\| 3000` | O Render injeta `PORT` automaticamente; sem isso o serviço não sobe |
| 3 | Removido `body-parser` (pacote separado); substituído por `express.json()` | `body-parser` está depreciado — `express.json()` é o equivalente embutido no Express 4.16+ |
| 4 | Adicionada rota `GET /` como health-check | O Render monitora essa rota para saber se o serviço está vivo |
| 5 | Variável de ambiente `FRONTEND_URL` usada no CORS | Permite configurar a URL do Vercel no painel do Render sem alterar o código |

**Como configurar o CORS em produção:**  
No painel do Render, adicione a variável `FRONTEND_URL` com o valor da URL do seu Vercel (ex: `https://casa-do-lago.vercel.app`).

---

### `controllers/quartosController.js`

| # | Alteração | Motivo |
|---|-----------|--------|
| 1 | Arquivo renomeado de `quartosConttoler.js` para `quartosController.js` | Correção de typo (dois `t`) no nome original |
| 2 | Import em `quartosRoute.js` atualizado para o novo nome | Consequência do item 1 |

Nenhuma alteração funcional.

---

### Demais arquivos do backend

Nenhuma alteração funcional nos arquivos abaixo. Apenas comentários JSDoc foram adicionados/melhorados para clareza:

- `controllers/clienteController.js`
- `controllers/reservaController.js`
- `controllers/tagController.js`
- `middlewares/authMiddleware.js`
- `models/userModel.js`
- `models/clienteModel.js`
- `models/quartosModel.js`
- `models/reservaModel.js`
- `models/tagModel.js`
- `routes/authRoute.js`
- `routes/clienteRoute.js`
- `routes/quartosRoute.js`
- `routes/reservaRoute.js`
- `routes/tagRoute.js`
- `utils/datas.js`
- `utils/validacoes.js`

---

### `package.json` (api)

Dependências adicionadas em relação ao original:

| Pacote | Versão | Motivo |
|--------|--------|--------|
| `cors` | `^2.8.5` | Necessário para permitir chamadas cross-origin do Vercel |

Scripts adicionados:

```json
"start": "node index.js",   // usado pelo Render em produção
"dev":   "nodemon index.js" // uso local com hot-reload
```

Campo `engines` adicionado:

```json
"engines": { "node": ">=18.0.0" }
```

---

## Frontend — `front/`

O frontend foi **migrado de HTML puro para React + Vite**. Os arquivos `home.html` e `login.html` foram removidos. Todo o conteúdo visual, estilos e lógica foram preservados.

### Por que React + Vite?

- Roda em PC e Android (via Wi-Fi com `host: true` no Vite)
- Gerenciamento de estado mais limpo (sem manipulação direta de DOM)
- Deploy no Vercel com configuração mínima
- Permite crescer o projeto (adicionar novas páginas, autenticação com contexto, etc.)

---

### Arquivos criados

#### `index.html`
Ponto de entrada do Vite. Carrega as fontes do Google Fonts (Cormorant Garamond + Jost) e monta o app em `<div id="root">`.

---

#### `vite.config.js`

```js
server: {
  host: true,   // expõe no IP local → Android na mesma Wi-Fi acessa normalmente
  port: 5173,
  proxy: {
    // em dev local, redireciona chamadas de API para o backend na porta 3000
    '/auth', '/quartos', '/reservas', '/clientes', '/tags'
  }
}
```

Em **produção** (Vercel), o proxy não existe — as chamadas vão direto para o Render via `VITE_API_URL`.

---

#### `vercel.json`

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Necessário para que o React Router funcione no Vercel: sem isso, acessar `/login` diretamente retorna 404.

---

#### `src/main.jsx`
Monta o app React no DOM.

---

#### `src/App.jsx`
Define as rotas com React Router:

| Rota | Componente |
|------|-----------|
| `/` | `Home` |
| `/login` | `Login` |
| qualquer outra | redireciona para `/` |

---

#### `src/index.css`
Variáveis CSS globais (`--bg`, `--brown`, `--green`, etc.) e reset base. Preservado do original.

---

#### `src/lib/api.js`
Cliente HTTP centralizado. Responsabilidades:

- Lê `VITE_API_URL` do ambiente (vazio em dev, URL do Render em produção)
- Anexa o Bearer Token JWT automaticamente em toda requisição
- Exporta `saveAuth()`, `logout()` e `getUser()` para gerenciar sessão via `localStorage`

---

#### `src/components/Navbar.jsx` + `Navbar.module.css`
Barra de navegação fixa. Mostra:
- Logo linkado para `/`
- Links de navegação (Quartos, Sobre, Contato)
- Se **logado**: nome do usuário + botão Sair
- Se **deslogado**: botão Login (link para `/login`)

---

#### `src/pages/Home.jsx` + `Home.module.css`
Migração completa de `home.html`. Seções preservadas:

- **Hero** com SVG de paisagem (lago, casa, árvores, nuvens)
- **Barra de busca** (Check-in, Check-out, Tipo de quarto)
- **Grid de quartos** com skeleton de loading
- **Stats** (total, disponíveis, reservados)
- **Modal de reserva** com validação e chamada à API
- **Toast** de feedback (sucesso/erro)
- **Footer**

Lógica de estado com React Hooks (`useState`, `useEffect`). Fallback para dados mock quando a API está offline.

---

#### `src/pages/Login.jsx` + `Login.module.css`
Migração completa de `login.html`. Preservados:

- Layout dois painéis (ilustração SVG esquerda + formulário direita)
- Toggle mostrar/ocultar senha
- Validação de campos antes de chamar API
- Animação de loading no botão
- Toast de sucesso com redirecionamento automático para `/`
- Responsivo: painel esquerdo some em telas menores que 720px

---

## Variáveis de ambiente

### Backend — Render

| Variável | Descrição |
|----------|-----------|
| `DB_USER` | Usuário do MongoDB Atlas |
| `DB_PASS` | Senha do MongoDB Atlas |
| `SECRET` | Chave secreta para assinar os tokens JWT |
| `FRONTEND_URL` | URL do frontend no Vercel (ex: `https://casa-do-lago.vercel.app`) |

### Frontend — Vercel

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL da API no Render (ex: `https://casa-do-lago-api.onrender.com`) |

> Em desenvolvimento local, `VITE_API_URL` não é necessário — o proxy do Vite redireciona automaticamente.

---

## Como rodar localmente

```bash
# Terminal 1 — Backend
cd api
npm install
# Crie o arquivo .env com DB_USER, DB_PASS e SECRET
node index.js
# API disponível em http://localhost:3000

# Terminal 2 — Frontend
cd front
npm install
npm run dev
# App disponível em http://localhost:5173
# Android (mesma rede Wi-Fi): http://192.168.x.x:5173  (Vite mostra o IP no terminal)
```

---

## Deploy — sequência

1. Suba o projeto para um repositório GitHub (o `.gitignore` já exclui `.env` e `node_modules`)
2. **Render** → New Web Service → conecte o repositório → Root directory: `api/` → Start command: `node index.js` → adicione as 4 variáveis de ambiente
3. Copie a URL gerada pelo Render (ex: `https://casa-do-lago-api.onrender.com`)
4. **Vercel** → New Project → conecte o repositório → Root directory: `front/` → adicione `VITE_API_URL` com a URL do Render → Deploy
5. Copie a URL gerada pelo Vercel e volte ao Render para adicionar/atualizar `FRONTEND_URL`

---

## Observações sobre o MongoDB

A connection string usa as credenciais fornecidas via `.env`. Enquanto `DB_USER` e `DB_PASS` forem válidos, a conexão funciona independentemente de quem criou o cluster.

Se precisar de um cluster próprio: crie uma conta gratuita em [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas), crie um cluster M0 (gratuito), adicione um usuário de banco e atualize `DB_USER`, `DB_PASS` e a connection string em `config/db.js` com o novo host do cluster.
